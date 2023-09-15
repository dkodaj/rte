module MiniRte exposing
    ( init, Rte, Parameters, subscriptions, update
    , textarea, display, DisplayParams
    , emojiBox, EmojiBoxParams, fontSelector, FontSelectorParams
    , fontSizeSelector, FontSizeSelectorParams, inputBox, InputBoxParams
    , onOffSwitch, SwitchParams
    , isActive, textContent, textToContent, contentToText
    , decodeContentString
    , decodeContentGZip
    , encodeContentString
    , encodeContentGZip
    )

{-|

Don't forget to hook [subscriptions](#subscriptions) and [update](#update) into your app's own `subscriptions` and `update` function. Without that, the editor won't do anything.

**Note**: While the editor is active, it keeps taking away the focus from every other element ([source](https://github.com/dkodaj/rte/blob/master/src/MiniRte/Core.elm?plain=1#L260)). This may interfere with Html.select and such. Use the `FreezeEditor` [Msg](MiniRte-Types#Msg) to take away the focus ([example](https://github.com/dkodaj/rte/blob/master/src/MiniRte/Styled.elm?plain=1#L325)) and `Active True` to give it back.

# Init and update

@docs init, Rte, Parameters, subscriptions, update, textToContent, contentToText


# View

@docs textarea, display, DisplayParams


# Toolbar

@docs emojiBox, EmojiBoxParams, fontSelector, FontSelectorParams
@docs fontSizeSelector, FontSizeSelectorParams, inputBox, InputBoxParams
@docs onOffSwitch, SwitchParams


# Serialize/deserialize content

@docs encodeContentString, encodeContentGZip, decodeContentString, decodeContentGZip


# Info

@docs isActive, textContent

-}

import Browser.Dom as Dom
import Bytes exposing (Bytes)
import Css exposing (..)
import Css.Transitions exposing (transition)
import Html exposing (Html)
import Html.Attributes
import Html.Styled exposing (div, text)
import Html.Styled.Attributes exposing (css)
import Html.Styled.Events
import Json.Decode as Decode exposing (Decoder)
import MiniRte.Common as Common
import MiniRte.Core
import MiniRte.Styled as Styled
import MiniRte.Types as Types exposing (Child(..), Content, InputBox(..))
import MiniRte.TypesThatAreNotPublic as HiddenTypes
import Task



--== Main types ==--


{-| Normally, you don't have to do anything with these variables; use [update](#update) and [Msg](MiniRte-Types#Msg) to modify the editor's state.

If `emojiBox` is `True`, then the [emojiBox](#emojiBox) is visible.

If `inputBox` is `Nothing`, then the [inputBox](#inputBox) is not visible.

`styling.active` styles the div containing the editor in active mode (when editing), `styling.passive` does the same in [display](#display) mode or inactive mode. Use [init](#init) to set it.

`tagger` connects RTE [Msg](MiniRte-Types#Msg)'s with your app's own Msg type. Use [init](#init) to set it.

`textarea` is a [complicated object](https://github.com/dkodaj/rte/blob/master/src/MiniRte/Core.elm?plain=1#L77) that you shouldn't mess with.
-}
type alias Rte msg =
    { emojiBox : Bool
    , inputBox : Maybe InputBox
    , styling :
        { active : List (Html.Attribute msg)
        , inactive : List (Html.Attribute msg)
        }
    , tagger : Msg -> msg
    , textarea : MiniRte.Core.Editor
    }


type alias RteStyled msg =
    Styled.Rte msg


type alias Msg =
    Types.Msg



--== Subsidiary types ==--


{-| `content` can be plain text (in which case it is turned into [Content](MiniRte-Types#Content) by [textToContent](#textToContent)), or it can be a json string created with [encodeContentString](#encodeContentString).

`fontSizeUnit` defaults to `"px"`.

Use `highlighter` to to re-style the text the way you want it (e.g. code highlighting). See the [Content](MiniRte-Types#Content) type and the [example](https://github.com/dkodaj/rte/blob/master/example/src/Highlighter.elm).

`id` must be unique.    

`indentUnit` defaults to `(50,"px")`.

The content of `styling` is attached to the div that contains the text.

-}
type alias DisplayParams msg =
    { content : String
    , fontSizeUnit : Maybe String
    , highlighter : Maybe (Types.Content -> Types.Content)
    , id : String
    , indentUnit : Maybe ( Float, String )
    , styling : List (Html.Attribute msg)
    }


{-| -}
type alias EmojiBoxParams msg =
    { styling :
        { active : List (Html.Attribute msg)
        , inactive : List (Html.Attribute msg)
        }
    , emojis : List String
    }


{-| -}
type alias FontSelectorParams msg =
    { styling : List (Html.Attribute msg)
    , fonts : List (List String)
    }


{-| -}
type alias FontSizeSelectorParams msg =
    { styling : List (Html.Attribute msg)
    , sizes : List Float
    }


{-| -}
type alias InputBoxParams msg =
    { styling :
        { active : List (Html.Attribute msg)
        , inactive : List (Html.Attribute msg)
        }
    }


{-| `id` must be unique.

`characterLimit` puts a limit on how much text can be entered (see the note on [performance issues](https://package.elm-lang.org/packages/dkodaj/rte/latest/)). (Linebreaks and embedded images count as 1 character each.) Get notified of reaching the limit by capturing the `CharacterLimitReached` [Msg](MiniRte-Types#Msg).

`content` is the initial content of the textarea. Use [Array.empty](https://package.elm-lang.org/packages/elm/core/latest/Array#empty) to initialize with empty content. To initialize with saved content, use [decodeContentString](#decodeContentString) or [decodeContentGZip](#decodeContentGZip) ([example](https://github.com/dkodaj/rte/blob/master/example/src/Main.elm?plain=1#L102)). To convert plain text into [Content](MiniRte-Types#Content), use [textToContent](#textToContent).

`fontSizeUnit` defaults to `"px"`.

`highlighter` runs before each view update, re-stylings the text as you see fit. See the [Content](MiniRte-Types#Content) type and the [example](https://github.com/dkodaj/rte/blob/master/example/src/Highlighter.elm).

`indentUnit` defaults to `(50,"px")`.

If `pasteImageLinksAsImages` is `True`, then pasting an image link or an image (data url) into the RTE will insert the image into the text.

if `pasteLinksAsLinks` is `True`, then pasting a link ([something that starts with](https://github.com/dkodaj/rte/blob/master/src/MiniRte/Core.elm?plain=1#L1399) `"http://"` or `"https://"`) will create a clickable link.

`selectionStyle` controls the appearance of selected text. It defaults to `[("background", "hsl(217,71%,53%)"), ("color", "white")]`.

`styling.active` styles the textarea div in active mode (when editing). Use `update (Active True/False)` to switch between modes.

`tagger` turns the package's own [Msg](MiniRte-Types#Msg) type into your app's msg.

-}
type alias Parameters msg =
    { id : String
    , characterLimit : Maybe Int
    , content : Types.Content
    , fontSizeUnit : Maybe String
    , highlighter : Maybe (Types.Content -> Types.Content)
    , indentUnit : Maybe ( Float, String )
    , pasteImageLinksAsImages : Bool
    , pasteLinksAsLinks : Bool
    , selectionStyle : List ( String, String )
    , styling :
        { active : List (Html.Attribute msg)
        , inactive : List (Html.Attribute msg)
        }
    , tagger : Msg -> msg
    }


{-| -}
type alias SwitchParams =
    { activeColor : String
    , inactiveColor : String
    , width : Float
    }



--== Main functions ==--


{-| -}
init : Parameters msg -> ( Rte msg, Cmd msg )
init =
    Common.init


{-| Handles keydown/keyup and mouse events and it keeps the RTE in focus ([source](https://github.com/dkodaj/rte/blob/master/src/MiniRte/Core.elm?plain=1#L249)).
-}
subscriptions : Rte msg -> Sub msg
subscriptions =
    Common.subscriptions


{-| Use this to handle the RTE's own [Msg](MiniRte-Types#Msg) updates ([example](https://github.com/dkodaj/rte/blob/master/example/src/Main.elm?plain=1#L125)).
-}
update : Msg -> Rte msg -> ( Rte msg, Cmd msg )
update =
    Common.update


{-| Convert a string into [Content](MiniRte-Types#Content).
-}
textToContent : String -> Content
textToContent =
    MiniRte.Core.textToContent

{-| Ignores [EmbeddedHtml](MiniRte-Types#EmbeddedHtml) elements (replaces them with `""`).-}
contentToText : Content -> String
contentToText =
    MiniRte.Core.toText 

--== Helpers in ABC order ==--

{-| Convert serialized content string back into content.
-}
decodeContentString : String -> Result String Content
decodeContentString =
    MiniRte.Core.decodeContentString

{-| Convert gzipped serialized content back into content ([example](https://github.com/dkodaj/rte/blob/master/example/src/Main.elm?plain=1#L102)).
-}
decodeContentGZip : Bytes -> Result String Content
decodeContentGZip =
    MiniRte.Core.decodeContentGZip


{-| Display formatted content, without an editor (e.g. as a blog post).
-}
display : (Msg -> msg) -> DisplayParams msg -> Html msg
display tagger p =
    let
        styledParams =
            { content = p.content
            , fontSizeUnit = p.fontSizeUnit
            , highlighter = p.highlighter
            , id = p.id
            , indentUnit = p.indentUnit
            , styling = tostyled p.styling
            }
    in
    Styled.display tagger styledParams
    |> Html.Styled.toUnstyled
        

{-| Serialize the edited text as string.
-}
encodeContentString : Rte msg -> String
encodeContentString =
    MiniRte.Core.encodeContentString

{-| Serialize the edited text as a gzip file ([example](https://github.com/dkodaj/rte/blob/master/example/src/Main.elm?plain=1#L90)).
-}
encodeContentGZip : Rte msg -> Bytes
encodeContentGZip =
    MiniRte.Core.encodeContentGZip


{-| Make it appear/disappear with `update ToggleEmojiBox`.
Each `x` in `params.emojis` turns into a clickable div that triggers `update AddText` events. [Example](https://github.com/dkodaj/rte/blob/master/example/src/Main.elm?plain=1#L236)
-}
emojiBox : Rte msg -> EmojiBoxParams msg -> Html msg
emojiBox rte params =
    let
        styledParams =
            { emojis = params.emojis
            , styling = tostyled3 params.styling
            }
    in
    Html.Styled.toUnstyled <|
        Styled.emojiBox (tostyled2 rte) styledParams



{-| A `Html.select` element that triggers `update Font` events. [Example](https://github.com/dkodaj/rte/blob/master/example/src/Main.elm?plain=1#L215)
-}
fontSelector : Rte msg -> FontSelectorParams msg -> Html msg
fontSelector rte params =
    let
        styledParams =
            { fonts = params.fonts
            , styling = tostyled params.styling
            }
    in
    Html.Styled.toUnstyled <|
        Styled.fontSelector (tostyled2 rte) styledParams


{-| A `Html.select` element that triggers `update FontSize` events. [Example](https://github.com/dkodaj/rte/blob/master/example/src/Main.elm?plain=1#L224)
-}
fontSizeSelector : Rte msg -> FontSizeSelectorParams msg -> Html msg
fontSizeSelector rte params =
    let
        styledParams =
            { sizes = params.sizes
            , styling = tostyled params.styling
            }
    in
    Styled.fontSizeSelector (tostyled2 rte) styledParams
    |> Html.Styled.toUnstyled
        


{-| Input box for adding hyperlinks and image links.
Make it appear/disappear with `update ToggleImageBox` or `update ToggleLinkBox`.
It contains an OK button that triggers `update ImageAdd` or `update LinkAdd`. [Example](https://github.com/dkodaj/rte/blob/master/example/src/Main.elm?plain=1#L253)
-}
inputBox : Rte msg -> InputBoxParams msg -> Html msg
inputBox rte params =
    Styled.inputBox
        (tostyled2 rte)
        { styling = tostyled3 params.styling }
    |> Html.Styled.toUnstyled


{-| Checks if the editor is active.
-}
isActive : Rte msg -> Bool
isActive rte =
    rte.textarea.state == HiddenTypes.Edit


{-| A switch that turns editing on/off. The `params.width` field controls its width in px. [Example](https://github.com/dkodaj/rte/blob/master/example/src/Main.elm?plain=1#L173)
-}
onOffSwitch : Rte msg -> SwitchParams -> Html msg
onOffSwitch rte params =
    Styled.onOffSwitch (tostyled2 rte) params
    |> Html.Styled.toUnstyled


{-| The plain text content of the textarea.
-}
textContent : Rte msg -> String
textContent rte =
    MiniRte.Core.toText rte.textarea.content


{-| Display the edited text plus the cursor. [Example](https://github.com/dkodaj/rte/blob/master/example/src/Main.elm?plain=1#L137)
-}
textarea : Rte msg -> Html msg
textarea rte =
    Styled.textarea (tostyled2 rte)
    |> Html.Styled.toUnstyled


tostyled : List (Html.Attribute msg) -> List (Html.Styled.Attribute msg)
tostyled =
    List.map Html.Styled.Attributes.fromUnstyled


tostyled2 : Rte msg -> RteStyled msg
tostyled2 rte =
    { emojiBox = rte.emojiBox
    , inputBox = rte.inputBox
    , styling = tostyled3 rte.styling
    , tagger = rte.tagger
    , textarea = rte.textarea
    }


type alias Styling msg =
    { active : List (Html.Attribute msg)
    , inactive : List (Html.Attribute msg)
    }


type alias StyledStyling msg =
    { active : List (Html.Styled.Attribute msg)
    , inactive : List (Html.Styled.Attribute msg)
    }


tostyled3 : Styling msg -> StyledStyling msg
tostyled3 a =
    { active = tostyled a.active
    , inactive = tostyled a.inactive
    }


