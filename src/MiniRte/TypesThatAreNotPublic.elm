module MiniRte.TypesThatAreNotPublic exposing (InternalMsg(..), ScrollMode(..), State(..), StyleTags)

import Array exposing (Array)
import Browser.Dom as Dom exposing (Error, Viewport)


type InternalMsg =
      CompositionEnd String
    | CompositionStart
    | CompositionUpdate String
    | FocusOnEditor
    | Input Float String
    | InputTimeStamp Float
    | KeyDown String
    | KeyUp String
    | LocatedChar Int (Result Error Dom.Element)
    | MouseHit Int Float
    | MouseDown ( Float, Float ) Float
    | MouseMove Int Float
    | MouseUp
    | NoOp
    | Paste String
    | PlaceCursor1_EditorViewport ScrollMode (Result Error Dom.Viewport)
    | PlaceCursor2_EditorElement ScrollMode (Result Error Dom.Element)
    | PlaceCursor3_CursorElement ScrollMode (Result Error Dom.Element)    
    | Scrolled
    | SwitchTo State
    | UndoAction


type ScrollMode
    = ScrollIfNeeded
    | NoScroll


type State
    = Display
    | Edit
    | Freeze


type alias StyleTags =
    List ( String, String )