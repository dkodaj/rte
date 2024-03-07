module MiniRte.TypesThatAreNotPublic exposing (
      InternalMsg(..)
    , Drag(..)
    , Locating(..)
    , MouseLocator
    , ScreenElement
    , ScrollMode(..)
    , Select(..)
    , State(..)
    , StyleTags
    , Vertical(..)
    )

import Array exposing (Array)
import Browser.Dom as Dom exposing (Error, Viewport)
import Time exposing (Posix)


type InternalMsg =
      FocusOnEditor
    | Input Float String
    | InputTimeStamp Float
    | KeyDown String Float Bool
    | KeyUp String Float Bool
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


type Drag
    = DragFrom Int
    | DragInit
    | NoDrag


type Locating
    = Cursor
    | Idle
    | LineBoundary Vertical ( Int, Int )
    | LineJump Vertical ( Int, Int )
    | Mouse Select ( Float, Float ) ( Int, Int )
    | Page Int Vertical ( Int, Int )


type alias MouseLocator =
    { previous : Maybe ScreenElement
    , winner : Maybe ScreenElement
    }


type alias ScreenElement =
    { idx : Int
    , x : Float
    , y : Float
    , height : Float
    }

type ScrollMode
    = ScrollIfNeeded
    | NoScroll


type Select
    = SelectNone
    | SelectWord


type State
    = Display
    | Edit
    | Freeze


type alias StyleTags =
    List ( String, String )


type Vertical
    = Down
    | Up