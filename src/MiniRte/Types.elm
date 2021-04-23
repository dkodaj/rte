module MiniRte.Types exposing (
      Content, Element(..), Character, EmbeddedHtml, LineBreak,
      Child(..), FontStyle, StyleTags, TextAlign(..)
    )

{-| 
When writing a highlighter, modify the `highlightClasses` or `highlightStyling` fields of the elements.

Each string `x` in `highlightClasses` turns into `Html.Attribute.class x`.

Each `(x,y)` in `highlightStyling` turns into `Html.Attribute.style x y`.

Attributes of `LineBreak`s apply to the preceding paragraph as a whole.

@docs Content, Element, Character, EmbeddedHtml, LineBreak,
Child, FontStyle, StyleTags, TextAlign
-}

{-|-}
type alias Character =
    { char : Char
    , fontStyle : FontStyle
    , highlightClasses : List String
    , highlightStyling : StyleTags
    , id : Int
    , link : Maybe String
    }


{-|-}
type Child =
    Child EmbeddedHtml

{-|-}
type alias Content =
    List Element

{-|-}
type Element =
      Break LineBreak
    | Char Character
    | Embedded EmbeddedHtml

{-|-}
type alias EmbeddedHtml =    
    { attributes : List (String, String)
    , classes : List String
    , children : List Child
    , highlightClasses : List String
    , highlightStyling : StyleTags
    , id : Int
    , nodeType : Maybe String
    , styling : StyleTags
    , text : Maybe String
    }

{-|-}
type alias FontStyle =
    { classes : List String
    , fontFamily : List String
    , fontSize : Maybe Float
    , styling : StyleTags
    }

{-|-}
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

{-|-}
type alias StyleTags =
    List (String, String)

{-|-}
type TextAlign =
      Center
    | Left
    | Right