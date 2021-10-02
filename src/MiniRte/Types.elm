module MiniRte.Types exposing
    ( Msg(..), InputBox(..), TextAlignType(..)
    , Content, Element(..), Character, EmbeddedHtml, LineBreak, Child(..), FontStyle, StyleTags
    )

{-|

@docs Msg, InputBox, TextAlignType


# Writing highlighters

When writing a highlighter, pass in a `Content -> Content` function on init.
The function should modify the `highlightClasses` or `highlightStyling` fields of the elements.
Each string `x` in `highlightClasses` turns into `Html.Attribute.class x`.
Each `(x,y)` in `highlightStyling` turns into `Html.Attribute.style x y`.
Attributes of `LineBreak`s apply to the preceding paragraph as a whole.

@docs Content, Element, Character, EmbeddedHtml, LineBreak, Child, FontStyle, StyleTags

-}

import MiniRte.CoreTypes


{-| For toolbar icons or shortcut keys. See the [example](https://github.com/dkodaj/rte/tree/master/example) for tips.

      Active Bool       -- turn editing on/off
    | AddText String    -- insert text
    | Bold              -- make text bold
    | Class String      -- put a class on current paragraph
    | Core MiniRte.CoreTypes.Msg
                        -- normally, you won't need this
    | Cut
    | Copy
    | Font (List String)
                        -- set current font families
                        -- e.g. ["Oswald", "sans-serif"]
    | FontSize Float    -- set current font size
    | FromBrowserClipboard String
                        -- see package description
    | Heading           -- toggles between h1 and plain div
    | ImageAdd String   -- embed image (the String is a link)
    | ImageInput String -- modify content of image input box
    | Indent            -- increase indent of current para
    | Italic            -- make text italic
    | LinkAdd String    -- add link to current selection
    | LinkInput String  -- modify content of link input box
    | NoOp              -- normally, you won't need this
    | StrikeThrough     -- cross out text
    | TextAlign TextAlignType
                        -- change alignment of current para
    | ToBrowserClipboard String
                        -- see package description
    | ToggleEmojiBox    -- turn emoji input box on/off
    | ToggleImageBox    -- turn image link input box on/off
    | ToggleLinkBox     -- turn link input box on/off
    | Underline         -- underline text
    | Undo              -- undo last action
    | Unindent          -- decrease indent of current para
    | Unlink            -- remove the link the cursor is touching

-}
type Msg
    = Active Bool
    | AddText String
    | Bold
    | Class String
    | Core MiniRte.CoreTypes.Msg
    | Cut
    | Copy
    | Font (List String)
    | FontSize Float
    | FromBrowserClipboard String
    | Heading
    | ImageAdd String
    | ImageInput String
    | Indent
    | Italic
    | LinkAdd String
    | LinkInput String
    | NoOp
    | StrikeThrough
    | TextAlign TextAlignType
    | ToBrowserClipboard String
    | ToggleEmojiBox
    | ToggleImageBox
    | ToggleLinkBox
    | Underline
    | Undo
    | Unindent
    | Unlink


{-| -}
type InputBox
    = ImageInputBox String
    | LinkInputBox String


{-| -}
type alias Character =
    { char : Char
    , fontStyle : FontStyle
    , highlightClasses : List String
    , highlightStyling : StyleTags
    , id : Int
    , link : Maybe String
    }


{-| -}
type Child
    = Child EmbeddedHtml


{-| -}
type alias Content =
    List Element


{-| -}
type Element
    = Break LineBreak
    | Char Character
    | Embedded EmbeddedHtml


{-| -}
type alias EmbeddedHtml =
    { attributes : List ( String, String )
    , classes : List String
    , children : List Child
    , highlightClasses : List String
    , highlightStyling : StyleTags
    , id : Int
    , nodeType : Maybe String
    , styling : StyleTags
    , text : Maybe String
    }


{-| -}
type alias FontStyle =
    { classes : List String
    , fontFamily : List String
    , fontSize : Maybe Float
    , styling : StyleTags
    }


{-| -}
type alias LineBreak =
    { classes : List String
    , highlightClasses : List String
    , highlightIndent : Int
    , highlightStyling : StyleTags
    , id : Int
    , indent : Int
    , nodeType : Maybe String
    , styling : StyleTags
    }


{-| -}
type alias StyleTags =
    List ( String, String )


{-| -}
type TextAlignType
    = Center
    | Left
    | Right
