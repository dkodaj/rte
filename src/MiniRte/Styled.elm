module MiniRte.Styled exposing
    ( init, Rte, Parameters, subscriptions, update
    , textarea, display, DisplayParams
    , emojiBox, EmojiBoxParams, fontSelector, FontSelectorParams
    , fontSizeSelector, FontSizeSelectorParams, inputBox, InputBoxParams
    , onOffSwitch, SwitchParams
    , isActive, textContent, textToContent
    , decodeContentString
    , decodeContentGZip
    , encodeContentString
    , encodeContentGZip    
    )

{-| Same as `MiniRte` except it uses [Html.Styled](https://package.elm-lang.org/packages/rtfeldman/elm-css/latest/Html-Styled).


# Init and update

@docs init, Rte, Parameters, subscriptions, update, textToContent


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
import MiniRte.Types exposing (Content, InputBox(..), Msg(..))
import MiniRte.TypesThatAreNotPublic exposing (..)
import Task



--== Main types ==--


{-| -}
type alias Rte msg =
    { emojiBox : Bool
    , inputBox : Maybe InputBox
    , styling :
        { active : List (Html.Styled.Attribute msg)
        , inactive : List (Html.Styled.Attribute msg)
        }
    , tagger : Msg -> msg
    , textarea : MiniRte.Core.Editor
    }



--== Subsidiary types ==--


{-| `content` can be plain text or a json string created with [encodedContent](#encodedContent).

`fontSizeUnit` defaults to `"px"`.

`indentUnit` defaults to `(50,"px")`.

The attributes in `styling` will be attached to the div that contains the text.

-}
type alias DisplayParams msg =
    { content : String
    , fontSizeUnit : Maybe String
    , highlighter : Maybe (MiniRte.Types.Content -> MiniRte.Types.Content)
    , id : String
    , indentUnit : Maybe ( Float, String )
    , styling : List (Html.Styled.Attribute msg)
    }


{-| -}
type alias EmojiBoxParams msg =
    { styling :
        { active : List (Html.Styled.Attribute msg)
        , inactive : List (Html.Styled.Attribute msg)
        }
    , emojis : List String
    }


{-| -}
type alias FontSelectorParams msg =
    { styling : List (Html.Styled.Attribute msg)
    , fonts : List (List String)
    }


{-| -}
type alias FontSizeSelectorParams msg =
    { styling : List (Html.Styled.Attribute msg)
    , sizes : List Float
    }


type alias InputBoxBehaviour =
    { content : String
    , inputMsg : String -> Msg
    , okMsg : String -> Msg
    , placeholder : String
    }


{-| -}
type alias InputBoxParams msg =
    { styling :
        { active : List (Html.Styled.Attribute msg)
        , inactive : List (Html.Styled.Attribute msg)
        }
    }


{-| `id` must be unique; it is used to monitor the position of characters.

`content` is the initial content of the textarea. It can be `Just` some plain text or a json string generated by [encodedContent](#encodedContent).

`fontSizeUnit` defaults to `"px"`.

`highlighter` runs before each view update and it re-styles the text. See the [Content](MiniRte-Types#Content) type and the [example](https://github.com/dkodaj/rte/tree/master/example).

`indentUnit` defaults to `(50,"px")`.

`selectionStyle` controls the appearance of selected text. It defaults to `[("background", "hsl(217,71%,53%)"), ("color", "white")]`.

`styling.active` styles the textarea div in active mode (when editing). Use `update (Active True/False)` to switch between modes.

`tagger` turns the package's own [Msg](MiniRte-Types#Msg) type into your app's msg.

-}
type alias Parameters msg =
    { id : String
    , content : MiniRte.Types.Content
    , fontSizeUnit : Maybe String
    , highlighter : Maybe (MiniRte.Types.Content -> MiniRte.Types.Content)
    , indentUnit : Maybe ( Float, String )
    , pasteImageLinksAsImages : Bool
    , pasteLinksAsLinks : Bool
    , selectionStyle : List ( String, String )
    , styling :
        { active : List (Html.Styled.Attribute msg)
        , inactive : List (Html.Styled.Attribute msg)
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


{-| -}
subscriptions : Rte msg -> Sub msg
subscriptions =
    Common.subscriptions


{-| -}
update : Msg -> Rte msg -> ( Rte msg, Cmd msg )
update =
    Common.update

{-| -}
textToContent : String -> Content
textToContent =
    MiniRte.Core.textToContent


--== Helpers in ABC order ==--

{-| Convert serialized content string back into content.
-}
decodeContentString : String -> Result String Content
decodeContentString =
    MiniRte.Core.decodeContentString

{-| Convert gzipped serialized content back into content.
-}
decodeContentGZip : Bytes -> Result String Content
decodeContentGZip =
    MiniRte.Core.decodeContentGZip

{-| Serialize the edited text as string.
-}
encodeContentString : Rte msg -> String
encodeContentString =
    MiniRte.Core.encodeContentString

{-| Serialize the edited text as a gzip file.
-}
encodeContentGZip : Rte msg -> Bytes
encodeContentGZip =
    MiniRte.Core.encodeContentGZip



{-| Display formatted text, without an editor.

If you want to preserve the option of editing it, create an editor with [init](#init) and put it in passive mode with `update (Active False)`.

-}
display : (Msg -> msg) -> DisplayParams msg -> Html.Styled.Html msg
display tagger p =
    MiniRte.Core.showContentInactive p.id p.styling p.fontSizeUnit p.highlighter p.indentUnit tagger p.content


{-| Make it appear/disappear with `update ToggleEmojiBox`.
Each `x` in `params.emojis` turns into a clickable div that triggers `update AddText` events.
-}
emojiBox : Rte msg -> EmojiBoxParams msg -> Html.Styled.Html msg
emojiBox rte params =
    let
        styling =
            if rte.emojiBox then
                params.styling.active

            else
                params.styling.inactive

        toDiv x =
            div
                [ Html.Styled.Events.onClick (rte.tagger (AddText x))
                , css [ cursor pointer ]
                ]
                [ text x ]
    in
    div
        styling
        (List.map toDiv params.emojis)


{-| A `Html.select` element that triggers `update Font` events.
-}
fontSelector : Rte msg -> FontSelectorParams msg -> Html.Styled.Html msg
fontSelector rte params =
    let
        maybeFontName =
            List.head rte.textarea.fontStyle.fontFamily

        selected x =
            case maybeFontName of
                Nothing ->
                    False

                Just y ->
                    x == y

        placeholder =
            Html.Styled.option
                [ Html.Styled.Attributes.disabled True
                , Html.Styled.Attributes.selected (maybeFontName == Nothing)
                ]
                [ text "font" ]

        o xs =
            case xs of
                [] ->
                    div [] []

                x :: _ ->
                    Html.Styled.option
                        [ Html.Styled.Attributes.value x
                        , Html.Styled.Attributes.selected (selected x)
                        ]
                        [ text x ]

        msg x =
            case List.filter (\a -> List.head a == Just x) params.fonts of
                xs :: _ ->
                    Just (rte.tagger (Font xs))

                [] ->
                    Nothing
    in
    Html.Styled.select
        (Html.Styled.Events.on "change" (selectDecode msg) :: params.styling)
        (placeholder :: List.map o params.fonts)


{-| A `Html.select` element that triggers `update FontSize` events.
-}
fontSizeSelector : Rte msg -> FontSizeSelectorParams msg -> Html.Styled.Html msg
fontSizeSelector rte params =
    let
        maybeSize =
            rte.textarea.fontStyle.fontSize

        selected x =
            case maybeSize of
                Nothing ->
                    False

                Just y ->
                    x == y

        msg x =
            Maybe.map (rte.tagger << FontSize) (String.toFloat x)

        o x =
            Html.Styled.option
                [ Html.Styled.Attributes.value (String.fromFloat x)
                , Html.Styled.Attributes.selected (selected x)
                ]
                [ text (String.fromFloat x) ]

        placeholder =
            Html.Styled.option
                [ Html.Styled.Attributes.disabled True
                , Html.Styled.Attributes.selected (maybeSize == Nothing)
                ]
                [ text "size" ]
    in
    Html.Styled.select
        (Html.Styled.Events.on "change" (selectDecode msg) :: params.styling)
        (placeholder :: List.map o params.sizes)


{-| Input box for adding hyperlinks and image links.
Make it appear/disappear with `update ToggleImageBox` or `update ToggleLinkBox`.
It contains an OK button that triggers `update ImageAdd` or `update LinkAdd`.
-}
inputBox : Rte msg -> InputBoxParams msg -> Html.Styled.Html msg
inputBox rte params =
    case Maybe.map inputBoxBehaviour rte.inputBox of
        Just behaviour ->
            let
                value =
                    if behaviour.content == "" then
                        Html.Styled.Attributes.placeholder behaviour.placeholder

                    else
                        Html.Styled.Attributes.value behaviour.content
            in
            div
                params.styling.active
                (List.map (Html.Styled.map rte.tagger)
                    [ Html.Styled.input
                        [ value
                        , Html.Styled.Attributes.type_ "text"
                        , Html.Styled.Events.onInput behaviour.inputMsg
                        , Html.Styled.Attributes.id (Common.inputBoxId rte)
                        ]
                        []
                    , Html.Styled.button
                        [ Html.Styled.Events.onClick (behaviour.okMsg behaviour.content) ]
                        [ text "Ok" ]
                    ]
                )

        Nothing ->
            div
                params.styling.inactive
                [ Html.Styled.input
                    [ Html.Styled.Attributes.type_ "text" ]
                    []
                , Html.Styled.button
                    []
                    [ text "Ok" ]
                ]


inputBoxBehaviour : InputBox -> InputBoxBehaviour
inputBoxBehaviour x =
    case x of
        ImageInputBox str ->
            { content = str
            , inputMsg = ImageSourceInput
            , okMsg = AddImage
            , placeholder = "Image url"
            }

        LinkInputBox str ->
            { content = str
            , inputMsg = LinkHrefInput
            , okMsg = AddLink
            , placeholder = "Link url"
            }


{-| Checks if the editor is active.
-}
isActive : Rte msg -> Bool
isActive rte =
    rte.textarea.state == Edit


{-| A switch that turns editing on/off. The `params.width` field controls its width in px.
-}
onOffSwitch : Rte msg -> SwitchParams -> Html.Styled.Html msg
onOffSwitch rte params =
    let
        switch =
            [ position relative
            , Css.display inlineBlock
            , height (px (0.57 * params.width))
            , width (px params.width)
            ]

        checked =
            rte.textarea.state /= Display

        sliderColor =
            if checked then
                params.activeColor

            else
                params.inactiveColor

        pos =
            if checked then
                transforms [ translateX (px (0.43 * params.width)) ]

            else
                transforms []

        slider =
            [ position absolute
            , cursor pointer
            , top (px 0)
            , left (px 0)
            , right (px 0)
            , bottom (px 0)
            , property "background-color" sliderColor
            , transition [ Css.Transitions.backgroundColor 400 ]
            , borderRadius (px (0.57 * params.width))
            , before
                [ position absolute
                , property "content" "''"
                , height (px (0.43 * params.width))
                , width (px (0.43 * params.width))
                , left (px (0.067 * params.width))
                , bottom (px (0.067 * params.width))
                , backgroundColor (hex "FFFFFF")
                , transition [ Css.Transitions.transform 400 ]
                , pos
                , borderRadius (pc 50)
                ]
            ]
    in
    Html.Styled.map rte.tagger <|
        Html.Styled.label
            [ css switch ]
            [ Html.Styled.span
                [ css slider
                , Html.Styled.Events.onClick (Active (not checked))
                ]
                []
            ]


selectDecode : (String -> Maybe msg) -> Decoder msg
selectDecode check =
    let
        f x =
            case check x of
                Just msg ->
                    Decode.succeed msg

                Nothing ->
                    Decode.fail "bad value"
    in
    Decode.at [ "target", "value" ]
        (Decode.string |> Decode.andThen f)


{-| The plain text content of the textarea. Suitable for both `Rte` and `Rte`.
-}
textContent : Rte msg -> String
textContent rte =
    MiniRte.Core.toText rte.textarea.content


{-| Displays the edited text plus the cursor.
-}
textarea : Rte msg -> Html.Styled.Html msg
textarea rte =
    let
        styling =
            if rte.textarea.state == Display then
                rte.styling.inactive
            else
                rte.styling.active
    in
    MiniRte.Core.view rte.tagger styling rte.textarea