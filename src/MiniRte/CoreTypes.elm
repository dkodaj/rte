module MiniRte.CoreTypes exposing (Msg(..), ScrollMode(..), State(..))

import Browser.Dom as Dom exposing (Error)
import Html.Styled as Html exposing (Attribute, Html, text)
import Html.Styled.Attributes as Attr exposing (css)
import IntDict exposing (IntDict)
import Json.Decode as Decode exposing (Decoder, Value)



type Msg =
      AddText String
    | CompositionEnd String
    | CompositionStart
    | CompositionUpdate String
    | Copy
    | Cut
    | KeyDown Float String
    | KeyDownTimeStamp Float
    | KeyUp String    
    | LocatedChar Int (Result Error Dom.Element)
    | MouseHit Int
    | MouseDown (Float,Float) Float
    | MouseMove String Float
    | MouseUp
    | NoOp
    | Paste String
    | PlaceCursor1_EditorViewport ScrollMode (Result Error Dom.Viewport)
    | PlaceCursor2_EditorElement ScrollMode (Result Error Dom.Element)
    | PlaceCursor3_CursorElement ScrollMode (Result Error Dom.Element)
    | Scrolled
    | SwitchTo State
    | ToBrowserClipboard String
    | UndoAction


-- == subsidiary types == --


type ScrollMode =
    ScrollIfNeeded | NoScroll


type State =
      Display
    | Edit
    | Freeze