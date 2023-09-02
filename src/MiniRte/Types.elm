module MiniRte.Types exposing
    ( Msg(..), InputBox(..), TextAlignType(..)
    , Content, Element(..), Character, EmbeddedHtml, LineBreak, Child(..), FontStyle
    , emptyEmbeddedHtml
    )

{-|

@docs Msg, InputBox, TextAlignType


# Writing highlighters

When writing a highlighter, pass in a `Content -> Content` function on init.
The function should modify the `highlightClasses`, `highlightIndent`, or `highlightStyling` fields of the elements.
Each string `x` in `highlightClasses` turns into `Html.Attribute.class x`.
Each `(x,y)` in `highlightStyling` turns into `Html.Attribute.style x y`.
Attributes of `LineBreak`s apply to the preceding paragraph as a whole.

@docs Content, Element, Character, EmbeddedHtml, emptyEmbeddedHtml, LineBreak, Child, FontStyle

-}

import Array exposing (Array)
import Html.Styled exposing (Html)
import MiniRte.TypesThatAreNotPublic exposing (..)


{-| For toolbar icons or shortcut keys. See the [example](https://github.com/dkodaj/rte/tree/master/example) for tips.

      Active Bool       -- turn editing mode on/off
    | AddContent Content -- insert content at cursor
    | AddCustomHtml EmbeddedHtml -- insert html at cursor
    | AddImage src      -- Html.img element with src = src
    | AddLink String    -- attach link to current selection
    | AddText String    -- insert text at cursor
    | Bold              -- make text bold
    | Class String      -- toggle class on current paragraph
    | Copy              -- copy current selection
    | Cut               -- cut current selection
    | Font (List String)
                        -- set current font families
                        -- e.g. ["Oswald", "sans-serif"]
    | FontSize Float    -- set current font size
    | FreezeEditor      -- turn off cursor, take away focus
    | FromBrowserClipboard String
                        -- see package description
    | Heading           -- toggles between h1 and plain div    
    | ImageSourceInput  -- you won't need this
    | Indent            -- increase indent of current paragraph by 1
    | Internal msg      -- not part of the API
    | Italic            -- make text italic
    | LinkHrefInput     -- you won't need this
    | LoadContent Content -- replace current content
    | LoadText String    -- replace current content
    | NodeType String   -- set Html.node type of current paragraph (e.g. `"h1"`)
    | Selection (x,y)   -- select characters no. x to y (inclusive)
    | StrikeThrough     -- cross out text
    | TextAlign TextAlignType
                        -- change alignment of current paragraph
    | ToBrowserClipboard String
                        -- see package description
    | ToggleEmojiBox    -- turn emoji input box on/off
    | ToggleImageBox    -- turn image link input box on/off
    | ToggleLinkBox     -- turn link input box on/off
    | Underline         -- underline text
    | Undo              -- undo last action
    | Unindent          -- decrease indent of current paragraph
    | Unlink            -- remove the link that the cursor is touching

-}
type Msg
    = Active Bool
    | AddContent Content
    | AddCustomHtml EmbeddedHtml
    | AddImage String
    | AddLink String
    | AddText String
    | Bold
    | Class String
    | Copy    
    | Cut
    | Font (List String)
    | FontSize Float
    | FreezeEditor
    | FromBrowserClipboard String
    | Heading
    | ImageSourceInput String
    | Indent
    | Internal InternalMsg
    | Italic
    | LinkHrefInput String
    | LoadContent Content
    | LoadText String
    | NodeType String
    | Selection (Int,Int)
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
    , highlightStyling : List (String,String)
    , link : Maybe String
    }


{-| -}
type Child
    = Child EmbeddedHtml


{-| -}
type alias Content =
    Array Element


{-| -}
type Element
    = Break LineBreak
    | Char Character
    | Embedded EmbeddedHtml


{-|-}
type alias EmbeddedHtml =
    { attributes : List (String, String)
    , classes : List String
    , children : List Child    
    , highlightClasses : List String
    , highlightStyling : List (String, String)
    , nodeType : Maybe String
    , styling : List (String, String)
    , text : Maybe String
    }

{-| An empty div.
-}
emptyEmbeddedHtml : EmbeddedHtml
emptyEmbeddedHtml =
    { attributes = []
    , classes = []
    , children = []
    , highlightClasses = []
    , highlightStyling = []
    , nodeType = Nothing
    , styling = []
    , text = Nothing
    }


{-| -}
type alias FontStyle =
    { classes : List String
    , fontFamily : List String
    , fontSize : Maybe Float
    , styling : List (String, String)
    }
    

{-| -}
type alias LineBreak =
    { classes : List String
    , highlightClasses : List String
    , highlightIndent : Int
    , highlightStyling : List (String, String)
    , indent : Int
    , nodeType : Maybe String
    , styling : List (String, String)
    }


{-| -}
type TextAlignType
    = Center
    | Left
    | Right