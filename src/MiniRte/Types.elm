module MiniRte.Types exposing
    ( Msg(..), TextAlignType(..)
    , Content, Element(..), CharacterRecord, EmbeddedHtmlRecord, LineBreakRecord, Child(..), FontStyle
    , emptyEmbeddedHtml
    )

{-|

@docs Msg, TextAlignType


# Writing highlighters

A highlighter is a `Content -> Content` function that you can inject into the model using `setHighlighter`.
The function should modify the `highlightClasses`, `highlightIndent`, or `highlightStyling` fields of the elements.
Each string `x` in `highlightClasses` turns into `Html.(Styled.)Attribute.class x`.
Each `(x,y)` in `highlightStyling` turns into `Html.(Styled.)Attribute.style x y`.
Attributes of `LineBreak`s apply to the paragraph (the previous non-linebreak elements) as a whole.

@docs Content, Element, CharacterRecord, EmbeddedHtmlRecord, emptyEmbeddedHtml, LineBreakRecord, Child, FontStyle

-}

import Array exposing (Array)
import Html.Styled exposing (Html)
import MiniRte.TypesThatAreNotPublic exposing (..)


{-|   CharacterLimitReached int -- get notified if too much text is entered
    | FromBrowserClipboard String
                        -- see package description
    | Internal msg      -- not part of the API
    | ToBrowserClipboard String
-}
type Msg
    = CharacterLimitReached Int
    | FromBrowserClipboard String
    | Internal InternalMsg
    | ToBrowserClipboard String


{-| -}
type alias CharacterRecord =
    { char : Char
    , fontStyle : FontStyle
    , highlightClasses : List String
    , highlightStyling : List (String,String)
    , link : Maybe String
    }


{-| -}
type Child
    = Child EmbeddedHtmlRecord


{-| -}
type alias Content =
    Array Element


{-| -}
type Element
    = Character CharacterRecord
    | EmbeddedHtml EmbeddedHtmlRecord
    | LineBreak LineBreakRecord


{-|  You can embed any html node using this type. The RTE will only be able to delete or copy/paste these elements.
-}
type alias EmbeddedHtmlRecord =
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
emptyEmbeddedHtml : EmbeddedHtmlRecord
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
type alias LineBreakRecord =
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