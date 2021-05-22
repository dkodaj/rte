--? remove Scrolled

module MiniRte.Core exposing (
      addContent
    , addText
    , addImage
    , changeIndent
    , contentChanged
    , currentLink
    , currentSelection
    , decode
    , defaultFont
    , defaultFontSize
    , Editor
    , encode
    , fontFamily
    , fontSize
    , init
    , initCmd
    , initWith
    , initWithContent
    , initWithText
    , link
    , loadContent
    , loadText
    , replaceText
    , setSelection
    , showContentInactive
    , state
    , subscriptions  
    , textAlign
    , textContent
    , toggleBold
    , toggleItalic
    , toggleNodeType  
    , toggleParaClass
    , toggleStrikeThrough
    , toggleUnderline
    , toText
    , undo
    , unlink
    , update
    , view
    )

import Browser.Dom as Dom exposing (Error, Viewport)
import Browser.Events
import Css exposing (..)
import Css.Animations as CssAnim
import Html.Styled as Html exposing (Attribute, Html, text)
import Html.Styled.Attributes as Attr exposing (css)
import Html.Styled.Events as Events
import Html.Styled.Keyed as Keyed
import Html.Styled.Lazy as Lazy
import IntDict exposing (IntDict)
import Json.Decode as Decode exposing (Decoder, Value)
import Json.Encode as Encode
import Json.Decode.Pipeline as Pipeline
import MiniRte.CoreTypes exposing (..)
import MiniRte.Types exposing  (Content, Element(..), Character, EmbeddedHtml, LineBreak,
      Child(..), FontStyle, StyleTags, TextAlignType(..))
import Process
import Task
import Time


type alias Editor =
    { box : Box
    , clipboard : Maybe Content
    , compositionStart : Content
    , compositionUpdate : String
    , content : Content
    , ctrlDown : Bool
    , cursor : Int
    , cursorScreen : Box
    , drag : Drag
    , editorID : String
    , fontSizeUnit : Maybe String
    , fontStyle : MiniRte.Types.FontStyle        
    , highlighter : Maybe (Content -> Content)
    , idCounter : Int
    , indentUnit : Maybe (Float,String)
    , lastKeyDown : Float
    , lastMouseDown : Float
    , locateBacklog : Int
    , located : IntDict ScreenElement
    , locating : Locating
    , selection : Maybe (Int,Int)
    , selectionStyle : List (Attribute Msg)
    , shiftDown : Bool
    , state : State
    , typing : Bool
    , undo : List Undo
    , viewport : Viewport
    }

type alias Box =
    { x : Float
    , y : Float
    , width : Float
    , height : Float
    }


type alias ClassLocator =
    IntDict (List String)


type Drag =
      DragFrom Int
    | DragInit
    | NoDrag


type alias KeyedNode msg = (String, Html msg)


type alias KeyedNodes msg = List (KeyedNode msg)


type LinkTag =
      Ends String
    | Starts


type Locating =
      Idle
    | LineBoundary Vertical (Int,Int)
    | LineJump Vertical (Int,Int)
    | Mouse Select (Float,Float) (Int,Int)
    | Page Vertical (Int,Int)


type alias MouseLocator =
    { previous : Maybe ScreenElement
    , winner : Maybe ScreenElement
    }


type alias Paragraph =
    { idx : Int
    , children : List (Int, Element)
    , lineBreak : LineBreak
    }


type alias Paragraphs =
    List Paragraph


type alias ScreenElement =
    { idx : Int
    , x : Float
    , y : Float
    , height : Float
    }


type Select =
    SelectNone | SelectWord



type Vertical =
    Down | Up


type alias Wrapper =
    KeyedNodes Msg -> KeyedNode Msg


type alias Undo =
    { content : Content
    , cursor : Int
    , fontStyle : MiniRte.Types.FontStyle
    , selection : Maybe (Int,Int)
    }

-- == Main functions == --


init : String -> (Editor, Cmd Msg)
init editorID =
    ( init1 editorID, initCmd editorID )


init1 : String -> Editor
init1 editorID =
    { box = null
    , clipboard = Nothing
    , compositionStart = []
    , compositionUpdate = ""
    , content = [Break (defaultLineBreak 0)]
    , ctrlDown = False
    , cursor = 0
    , cursorScreen = null
    , drag = NoDrag
    , editorID = editorID
    , fontSizeUnit = Nothing
    , fontStyle = emptyFontStyle            
    , highlighter = Nothing
    , idCounter = 1
    , indentUnit = Nothing
    , lastKeyDown = -1
    , lastMouseDown = -1
    , locateBacklog = 0
    , located = IntDict.empty
    , locating = Idle
    , selection = Nothing
    , selectionStyle = defaultSelectionStyle
    , shiftDown = False
    , state = Edit
    , typing = False
    , undo = []
    , viewport =
            { scene =
                { width = 0
                , height = 0
                }
            , viewport =  null
            }
    }


init3 : String -> Maybe (Content -> Content) -> List (Attribute Msg) -> Editor
init3 editorID highlighter selectionStyle =
    let
        i = init1 editorID
    in
    { i |
        highlighter = highlighter
      , selectionStyle = selectionStyle
    }


initCmd : String -> Cmd Msg
initCmd editorID =
    Cmd.batch
        [ focusOnEditor Edit editorID
        , placeCursor ScrollIfNeeded editorID
        ]


initWith : String -> String -> ( Editor, Cmd Msg )
initWith encodedContent id =
    case decode encodedContent of
        Just content ->
            initWithContent content id

        Nothing ->
            init id


initWithContent : Content -> String -> ( Editor, Cmd Msg )
initWithContent content id =
    ( loadContent content (init1 id), initCmd id )


initWithText : String -> String -> ( Editor, Cmd Msg )
initWithText content id =
    ( loadText content (init1 id), initCmd id )


subscriptions : Editor -> Sub Msg
subscriptions e =
    let
        default =
            [ Browser.Events.onKeyDown (decodeKeyAndTime KeyDown)
            , Browser.Events.onKeyUp (decodeKey KeyUp)
            , Browser.Events.onMouseUp (Decode.succeed MouseUp) 
            ]

        mouseMove =
            Browser.Events.onMouseMove (decodeTargetIdAndTime MouseMove) 
    in
    case e.state of
        Display ->
            Sub.none

        Edit ->
            case e.drag of
                NoDrag ->
                    Sub.batch default

                _ ->
                    Sub.batch ( mouseMove :: default )

        Freeze ->
            Sub.none


update : Msg -> Editor -> ( Editor, Cmd Msg )
update msg e0 =
    let     
        maxIdx =
            List.length e.content - 1

        e =
            updateUndo msg e0
    in
    case msg of
        AddText txt ->
            typed txt e Nothing False


        CompositionEnd txt ->
            if txt == "" then
                addContent e.compositionStart e
            else
                let
                    newLength =
                        List.length (String.toList txt)

                    ( new, newMsg ) =
                        update (CompositionUpdate txt) e
                in
                ( { new | cursor = new.cursor + newLength }
                , newMsg
                )


        CompositionStart ->
            case e.selection of
                Nothing ->
                    ( { e |
                          compositionStart = [] 
                        , compositionUpdate = ""
                      }
                    , Cmd.none 
                    )

                Just (beg,end) ->
                    ( { e |
                          compositionStart = List.take (end-beg+1) (List.drop beg e.content)
                        , compositionUpdate = ""
                        , content = delete beg (end+1) e
                        , cursor = beg
                        , selection = Nothing
                      }
                    , placeCursor ScrollIfNeeded e.editorID
                    )


        CompositionUpdate txt ->
            let
                oldEnd =
                    e.cursor + List.length (String.toList e.compositionUpdate)

                newLength =
                    List.length (String.toList txt)

                ( new, newMsg ) =
                    typed txt { e | content = delete e.cursor oldEnd e } Nothing False
            in
            ( { new |
                  compositionUpdate = txt
                , cursor = e.cursor
              }
            , newMsg
            )


        Copy ->            
            copy e


        Cut ->
            cut e


        KeyDown timeStamp key ->            
            keyDown timeStamp key e


        KeyDownTimeStamp float ->
            if e.lastKeyDown == float then
                ( { e | typing = False }
                , Cmd.none 
                )
            else
                ( e, Cmd.none )


        KeyUp str ->
            case str of
                "Control" ->
                    ( { e | ctrlDown = False }, Cmd.none )

                "Shift" ->
                    ( { e | shiftDown = False }, Cmd.none )

                _ ->
                    ( e, Cmd.none )

        
        LocatedChar idx (Ok data) ->  
            let
                elem = data.element

                located =
                    IntDict.insert idx (ScreenElement idx elem.x elem.y elem.height) e.located

                locateBacklog = e.locateBacklog - 1

                f x =
                    { x | 
                        locateBacklog = locateBacklog
                      , located = located 
                    }
            in
            if locateBacklog > 0 then
                if e.locating /= Idle then
                    ( f e, Cmd.none )
                else
                    ( e, Cmd.none )
            else                
                case e.locating of
                    Idle ->
                        ( e, Cmd.none )

                    LineBoundary a b ->
                        lineBoundary a b (f e)

                    LineJump a b ->
                        lineJump a b (f e)

                    Mouse a b c ->
                        locateMouse a b c (f e)

                    Page a b ->
                        page a b (f e)


        LocatedChar _ (Err err) ->
            ( e, Cmd.none )


        MouseDown (x,y) timeStamp ->
            if e.state == Freeze then
                ( e, Cmd.none )
            else
                if timeStamp - e.lastMouseDown <= 500 then --doubleclicked                
                    case e.locating of
                        Idle ->
                            ( selectCurrentWord e
                            , focusOnEditor e.state e.editorID
                            )

                        Mouse a b c ->
                            ( { e | locating = Mouse SelectWord b c }
                            , focusOnEditor e.state e.editorID
                            )

                        _ ->
                            mouseDown (x,y) timeStamp e
                else
                    mouseDown (x,y) timeStamp e


        MouseMove targetId timeStamp ->
            if timeStamp - e.lastMouseDown < 200 then
                ( e, Cmd.none )
            else
                case (e.drag, getIdx targetId e.content) of
                    (DragFrom startIdx, Just currentIdx) ->
                        let
                            ((beg,end), newCursor) =
                                if startIdx < currentIdx then
                                    ( (startIdx, currentIdx), min maxIdx (currentIdx + 1) )
                                else
                                    ( (currentIdx, startIdx), currentIdx )
                        in
                        ( { e | 
                              cursor = newCursor
                            , selection = Just (beg,end)
                          }
                        , Cmd.none 
                        )

                    _ ->
                        ( e, Cmd.none )


        MouseUp ->
            ( { e |
                 drag = NoDrag
               , selection = 
                    case e.selection of
                        Nothing -> Nothing
                        Just (beg,end) ->
                            if e.cursor < beg - 1 || e.cursor > end + 1 then
                                Nothing
                            else
                                e.selection
              }
            , Cmd.none 
            )


        NoOp ->
            ( e, Cmd.none )


        Paste str ->           
            case e.clipboard of
                Nothing ->
                    typed str e Nothing True

                Just internalClipboard ->
                    if toText internalClipboard /= str then
                        typed str e Nothing True
                    else
                        addContent internalClipboard e                    


        PlaceCursor1_EditorPos scroll (Ok data) ->
            ( { e | box = data.element }
            , getViewport (PlaceCursor2_Viewport scroll) e.editorID 
            )


        PlaceCursor1_EditorPos _ (Err err) ->
            ( e, Cmd.none )


        PlaceCursor2_Viewport scroll (Ok data) ->            
            locateCursorParent { e | viewport = data } scroll

        
        PlaceCursor2_Viewport _ (Err err) ->
            ( e, Cmd.none )        


        PlaceCursor3_CursorParent scroll (Ok data) ->
            let
                f x =
                    { x | cursorScreen = data.element }
            in
            case scroll of
                ScrollIfNeeded ->
                    ( f e
                    , scrollIfNeeded data.element e.box e.viewport e.editorID
                    )

                NoScroll ->
                    ( f e, Cmd.none )


        PlaceCursor3_CursorParent _ (Err err) ->
            ( e, Cmd.none )


        Scrolled scrollTop ->
            let
                cursorScreen = e.cursorScreen

                vp0 = e.viewport

                vp1 = vp0.viewport

                yDelta = vp1.y - scrollTop
            in
            ( { e |
                  cursorScreen =
                    { cursorScreen |
                        y = e.cursorScreen.y + yDelta
                    }

                , viewport = { vp0 | viewport = { vp1 | y = scrollTop } }
              }

            , Cmd.none
            )


        SwitchTo newState ->
            state newState e


        ToBrowserClipboard txt ->
            ( e, Cmd.none )


        UndoAction ->
            undoAction e


updateUndo : Msg -> Editor -> Editor
updateUndo msg e =
    let
        maxIdx = List.length e.content - 1
    in
    case msg of
        KeyDown timeStamp str ->
            let
                contentMod =                    
                    if timeStamp - e.lastKeyDown < 1000 then                        
                        undoRefreshHead e
                    else                        
                        undoAddNew e

                like : String -> Editor
                like x =
                    updateUndo (KeyDown timeStamp x) e
            in
            if String.length str == 1 then
                if not e.ctrlDown then
                    contentMod
                else
                    case str of
                        {-"0" ->
                            contentMod

                        "1" ->
                            contentMod-}

                        "x" ->
                            if e.selection /= Nothing then
                                undoAddNew e
                            else
                                e

                        "X" ->
                            like "x"

                        "v" ->
                            if e.clipboard /= Nothing then
                                undoAddNew e
                            else
                                e

                        "V" ->
                            like "v"

                        _ -> e
            else
            case str of
                "Backspace" ->
                    case e.selection of
                        Nothing ->
                            if e.cursor > 0 then
                                contentMod
                            else
                                e

                        Just _ ->
                            contentMod

                "Delete" ->
                    case e.selection of
                        Nothing ->
                            if e.cursor < maxIdx then
                                contentMod
                            else
                                e

                        Just _ ->
                            contentMod

                "Enter" ->
                    contentMod

                _ ->
                    e

        _ ->
            e


view : (Msg -> msg) -> List (Attribute msg) -> Editor -> Html msg
view tagger userDefinedStyles e =        
    let
        dummy =
            Html.map tagger
            <| Html.input
                [ Attr.type_ "text"
                , Attr.id (dummyID e.editorID)
                , Events.on "focus" (Decode.succeed (SwitchTo Edit))
                , Events.on "compositionend" (Decode.map CompositionEnd (Decode.field "data" Decode.string))
                , Events.on "compositionstart" (Decode.succeed CompositionStart)
                , Events.on "compositionupdate" (Decode.map CompositionUpdate (Decode.field "data" Decode.string))
                , css
                    [ position absolute
                    , left (vw -100)
                    , width (vw 10)
                    ]
                ] []

        viewTextareaContent =
            { content = e.content
            , cursor = e.cursor
            , selection = e.selection
            , typing = e.typing
            }

        viewTextareaParams =
            { editorID = e.editorID
            , fontSizeUnit = e.fontSizeUnit
            , highlighter = e.highlighter
            , indentUnit = e.indentUnit
            , selectionStyle = e.selectionStyle
            , userDefinedStyles = userDefinedStyles
            , tagger = tagger
            }
    in
    case e.state of
        Display ->            
            showContent viewTextareaParams { viewTextareaContent | cursor = -1, selection = Nothing }

        Edit ->
            Html.div
                [ ]
                [ (Lazy.lazy (showContent viewTextareaParams)) viewTextareaContent
                , dummy
                ]

        Freeze ->
            Html.div
                [ ]
                [ (Lazy.lazy (showContent viewTextareaParams)) { viewTextareaContent | typing = True }
                ]


type alias ViewTextareaContent =
    { content : Content
    , cursor : Int
    , selection : Maybe (Int,Int)
    , typing : Bool
    }


type alias ViewTextareaParams msg =
    { editorID : String
    , fontSizeUnit : Maybe String
    , highlighter : Maybe (Content -> Content)
    , indentUnit : Maybe (Float,String)
    , selectionStyle : List (Attribute Msg)
    , userDefinedStyles : List (Attribute msg)
    , tagger : (Msg -> msg)
    }


--- === Helper functions === ---

addText : String -> Editor -> ( Editor, Cmd Msg )
addText str e =
    typed str e Nothing False


addContent : Content -> Editor -> ( Editor, Cmd Msg )
addContent added e =
    let
        f : (Int, Content) -> Content -> Content
        f (id, output) input =
            case input of
                [] ->
                    List.reverse output

                x :: rest ->
                    f (id + 1, idSet id x :: output) rest

        g : Content -> Content
        g xs =
            f (e.idCounter, []) xs

        h : Int -> Content -> Int -> Content
        h x y z =
            List.take x y ++ (g added) ++ List.drop z y

        i : Content -> Content
        i x =
            if x == [] then [Break (defaultLineBreak 0)] else x
            -- prevent last Break from being deleted

        j : Int -> Content -> Int -> Content
        j x y z = i (h x y z)                
    in
    case e.selection of
        Nothing ->
            ( { e |
                  content = j e.cursor e.content e.cursor
                , cursor = e.cursor + List.length added
                , idCounter = e.idCounter + List.length added
              }
            , placeCursor ScrollIfNeeded e.editorID
            )

        Just (beg,end) ->
            ( { e |
                  content = j beg e.content (end+1)
                , cursor = beg + List.length added
                , idCounter = e.idCounter + List.length added
                , selection = Nothing
              }
            , placeCursor ScrollIfNeeded e.editorID
            )


addIds : Content -> Content
addIds content =
    let
        f : Int -> Element -> Element
        f idx elem =
            case elem of
                Break br -> Break { br | id = idx }
                Char char -> Char { char | id = idx }
                Embedded html -> Embedded { html | id = idx }

        g : Element -> (Int, Content) -> (Int, Content)
        g elem (idx, xs) =
            (idx - 1, f idx elem :: xs)

        maxIdx = List.length content - 1
    in
    Tuple.second
        <| List.foldr g (maxIdx, []) content


addImage : String -> Editor -> ( Editor, Cmd Msg )
addImage src e =
    let
        imgNode =
            { attributes = [("src", src)]
            , classes = []
            , children = []
            , highlightClasses = []
            , highlightStyling = []
            , id = -1
            , nodeType = Just "img"
            , styling = []
            , text = Nothing
            }
    in
    embed imgNode e


alphaNumAt : Int -> Content -> Bool
alphaNumAt idx content =
    case get idx content of
        Just (Char ch) ->            
            Char.isAlphaNum ch.char || diacritical ch.char

        _ ->
            False


attributes : Element -> List (Attribute Msg)
attributes elem =
    let
        f : String -> Attribute Msg
        f x =
            Attr.class x

        g : (String, String) -> Attribute Msg
        g (x,y) =
            Attr.style x y

        h x =
            List.map f (x.classes ++ x.highlightClasses)
            ++ List.map g (x.styling ++ x.highlightStyling)
    in
    case elem of
        Break b ->
            h b            

        Char c ->
            List.map f (c.fontStyle.classes ++ c.highlightClasses)
            ++ List.map g (c.fontStyle.styling ++ c.highlightStyling)

        Embedded html ->
            h html


bold : Bool -> Editor -> ( Editor, Cmd Msg )
bold bool editor =
    setFontStyleTag boldStyle bool editor


boldStyle : (String, String)
boldStyle =
    ("font-weight", "bold")


breakIntoParas : Content -> Paragraphs
breakIntoParas content =
    let
        f : Element -> (Int, Paragraphs) -> (Int, Paragraphs)
        f elem (idx, ys) =
            case elem of
                (Break br) ->
                    ( idx - 1, Paragraph idx [] br :: ys )

                _ ->
                    case ys of
                        [] ->
                            ( idx - 1, [] )
                            -- trouble if content doesn't end with a Break element

                        x :: rest ->
                            ( idx - 1, { x | children = (idx, elem) :: x.children } :: rest )

        maxIdx = List.length content - 1
    in
    Tuple.second (List.foldr f (maxIdx, []) content)


changeContent : (Element -> Element) -> Int -> Content -> Content
changeContent f idx content =
    case get idx content of
        Nothing ->
            content

        Just elem ->
            set idx (f elem) content


changeContent2 : (Element -> Element) -> Int -> Editor -> Editor
changeContent2 f idx e =
    case get idx e.content of
        Nothing ->
            e

        Just elem ->
            set2 idx (f elem) e


changeIndent : Int -> Editor -> ( Editor, Cmd Msg )
changeIndent amount editor =
    let
        f : LineBreak -> LineBreak
        f x =
            { x | indent = amount + x.indent }
    in    
    setPara f editor


contentChanged : Msg -> Editor -> Bool
contentChanged msg e =
    let
        maxIdx = List.length e.content - 1
    in
    case msg of
        AddText txt ->
            txt /= ""

        KeyDown timeStamp str ->
            let
                like x =
                    contentChanged (KeyDown timeStamp x) e
            in
            if String.length str == 1 then
                if not e.ctrlDown then
                    True
                else
                    case str of
                        {-"0" ->
                            True

                        "1" ->
                            True-}

                        "x" ->
                            True

                        "X" ->
                            like "x"

                        "v" ->
                            True

                        "V" ->
                            like "v"

                        "z" ->
                            True

                        "Z" ->
                            like "z"

                        _ -> False
            else
            case str of
                "Backspace" ->
                    case e.selection of
                        Nothing ->
                            if e.cursor > 0 then
                                True
                            else
                                False

                        Just _ ->
                            True

                "Delete" ->
                    case e.selection of
                        Nothing ->
                            if e.cursor < maxIdx then
                                True
                            else
                                False

                        Just _ ->
                            True

                "Enter" ->
                    True

                _ ->
                    False


        Paste str ->
            str /= "" || Maybe.map toText e.clipboard /= Just ""


        UndoAction ->
            True


        _ ->
            False


copy : Editor -> ( Editor, Cmd Msg )
copy e =
    case e.selection of
        Nothing ->
            ( e, Cmd.none )

        Just (beg,end) ->
            let
                clipboard =
                    List.take (end - beg + 1) <| List.drop beg e.content
            in
            ( { e | clipboard = Just clipboard }
            , Task.perform identity <| Task.succeed <| ToBrowserClipboard (toText clipboard)
            )


copyMsg : Cmd Msg
copyMsg =
    Task.perform identity (Task.succeed Copy)


currentLink : Editor -> Maybe String
currentLink e =
    case linkAt e.cursor e.content of
        Just x -> Just x
        Nothing ->
            case e.selection of
                Just (beg,end) ->
                    linkAt end e.content

                Nothing ->
                    Nothing


currentLinkPos : Editor -> Maybe (Int,Int)
currentLinkPos e =
    let
        f : String -> Int -> Int
        f href idx =
            if linkAt (idx-1) e.content == Just href then
                f href (idx-1)
            else
                idx

        beg : String -> Int
        beg href =
            f href e.cursor

        g : String -> Int -> Int
        g href idx =
            if linkAt (idx+1) e.content == Just href then
                g href (idx+1)
            else
                idx

        end : String -> Int
        end href =
            g href e.cursor
    in
    case currentLink e of
        Just href ->
            Just (beg href, end href)

        Nothing ->
            Nothing


currentParaStyle : Int -> Editor -> LineBreak
currentParaStyle id editor =
    case lineBreakAt editor.cursor editor.content of
        Just lineBreak ->
            { lineBreak | id = id }

        Nothing ->
            defaultLineBreak id


currentSelection : Editor -> Maybe String
currentSelection e =
    case e.selection of
        Nothing ->
            Nothing

        Just (beg,end) ->
            Just
                <| toText                
                    <| List.take (end-beg+1)
                        <| List.drop beg e.content


currentWord : Editor -> (Int, Int)
currentWord e =
    let
        beg = previousWordBoundary e
    in
    case next nonAlphaNumAt e.cursor e.content of
        Just x ->
            (beg, x-1)

        Nothing ->
            (beg, List.length e.content - 1)


cursorHtml : Bool -> Html msg
cursorHtml typing =
    let
        blink =
            CssAnim.keyframes
                [ (0, [CssAnim.opacity (int 1)])
                , (49, [CssAnim.opacity (int 1)])
                , (50, [CssAnim.opacity (int 0)])
                , (100, [CssAnim.opacity (int 0)])
                ]

        anim =
            if not typing then
                [ animationName blink
                , animationDuration (ms (2*tickPeriod))
                , property "animation-iteration-count" "infinite"
                ]
            else
                []
    in
    Html.div
        [ css
            ( [ borderLeft2 (px 3) solid
              , borderColor (rgb 0 0 0)
              , boxSizing borderBox
              , height (em 1.17)
              , left (px 0)
              , position absolute
              , top (em 0.05)
              , marginRight (em -0.5)
              ]
              ++
              anim
            )  
        ] []


cut : Editor -> ( Editor, Cmd Msg )
cut e =
    let
        ( copied, copyCmd ) = copy e
    in
    case e.selection of
        Nothing ->
            ( e, Cmd.none )

        Just (beg,end) ->            
            ( { copied |
                    content = List.take beg e.content ++ (List.drop (end-beg+1) (List.drop beg e.content))
                  , cursor = beg
                  , selection = Nothing
                }
            , Cmd.batch
                [ copyCmd
                , placeCursor ScrollIfNeeded e.editorID
                ]
            )

cutMsg : Cmd Msg
cutMsg =
    Task.perform identity (Task.succeed Cut)

decodeClipboardData : (Value -> Msg) -> Decoder Msg
decodeClipboardData f =
    Decode.map f
        ( Decode.field "clipboardData" Decode.value )

decodeKey : (String -> Msg) -> Decoder Msg
decodeKey f =
    Decode.map f
        ( Decode.field "key" Decode.string )


decodeKeyAndTime : (Float -> String -> Msg) -> Decoder Msg
decodeKeyAndTime f =
    Decode.map2 f
        ( Decode.field "timeStamp" Decode.float )
        ( Decode.field "key" Decode.string )


decodeMouse : ((Float,Float) -> Float -> msg) -> Decoder msg
decodeMouse msg =
    let
        tagger x y z =
            msg (x,y) z
    in
    Decode.map3 tagger
        (Decode.field "clientX" Decode.float)
        (Decode.field "clientY" Decode.float)
        (Decode.field "timeStamp" Decode.float)


decodeTargetIdAndTime : (String -> Float -> Msg) -> Decoder Msg
decodeTargetIdAndTime f =
    Decode.map2 f
        ( Decode.oneOf
            [ Decode.at ["target","id"] Decode.string
            , Decode.succeed ""
            ]
        )
        ( Decode.field "timeStamp" Decode.float )


defaultFont : List String -> Editor -> Editor
defaultFont xs e =
    let
        f x =
            { x | fontFamily = xs }
    in
    { e | fontStyle = f e.fontStyle }


defaultFontSize : Float -> Editor -> Editor
defaultFontSize float e =
    let
        f x =
            { x | fontSize = Just float }
    in
    { e | fontStyle = f e.fontStyle }


defaultLineBreak : Int -> LineBreak
defaultLineBreak id =
    { classes = []
    , highlightClasses = []
    , highlightIndent = 0
    , highlightStyling = []
    , id = id
    , indent = 0
    , nodeType = Nothing
    , styling = []
    }


defaultSelectionStyle : List (Attribute Msg)
defaultSelectionStyle =
    [ css
        [ backgroundColor (hsl 217 0.71 0.53)    
        , color (hsl 0 0 1)
        ]
    ]


dehighlight : Element -> Element
dehighlight elem =
    case elem of
        Break br ->
            Break
                { br |
                    highlightClasses = []
                  , highlightIndent = 0
                  , highlightStyling = []
                }

        Char ch ->
            Char
                { ch |
                    highlightClasses = []
                  , highlightStyling = []
                }

        Embedded html ->
            Embedded
                { html |
                    highlightClasses = []
                  , highlightStyling = []
                }


delete : Int -> Int -> Editor -> Content
delete beg end e =
    let
        f x y z =
            List.take x z ++ List.drop y z

        g x =
            if x == [] then [Break (defaultLineBreak 0)] else x
            -- prevent last Break from being deleted
    in
    g (f beg end e.content)


detectFontStyle : Int -> Editor -> Editor
detectFontStyle idx e =
    case get (idx-1) e.content of
        Just (Char c) ->
            { e | fontStyle = c.fontStyle }

        _ ->
            e


diacritical : Char -> Bool
diacritical char =
    List.member char
        [ 'À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë'
        , 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'Ø'
        , 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'Þ', 'ß', 'à', 'á', 'â', 'ã', 'ä'
        , 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð'
        , 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', 'ø', 'ù', 'ú', 'û', 'ü', 'ý'
        , 'þ', 'ÿ', 'Ő', 'ő', 'Ű', 'ű'
        ]


embed : EmbeddedHtml -> Editor -> ( Editor, Cmd Msg )
embed html e =
    let
        elem = Embedded { html | id = e.idCounter }
    in
    ( { e | 
          content = List.take e.cursor e.content ++ [elem] ++ List.drop e.cursor e.content
        , cursor = e.cursor + 1
        , idCounter = e.idCounter + 1
      }
    , placeCursor NoScroll e.editorID
    )


emptyFontStyle : MiniRte.Types.FontStyle
emptyFontStyle =
    { classes = []
    , fontFamily = []
    , fontSize = Nothing
    , styling = []
    }


dummyID : String -> String
dummyID x =
    x ++ "_dummy_"


focusOnEditor : State -> String -> Cmd Msg
focusOnEditor editorState editorID =
    if editorState == Edit then
        Task.attempt (\_ -> NoOp) (Dom.focus (dummyID editorID))
    else
        Cmd.none


fontFamily : List String -> Editor -> ( Editor, Cmd Msg )
fontFamily xs e =
    let
        mod : MiniRte.Types.FontStyle -> MiniRte.Types.FontStyle
        mod x =
            { x | fontFamily = xs }
    in
    setFontStyle mod e


fontSize : Float -> Editor -> ( Editor, Cmd Msg )
fontSize float e =
    let
        mod : MiniRte.Types.FontStyle -> MiniRte.Types.FontStyle
        mod x =
            { x | fontSize = Just float }
    in
    setFontStyle mod e


get : Int -> Content -> Maybe Element
get idx content =
    case List.drop idx content of
        [] ->
            Nothing

        x :: _ ->
            Just x


getIdx : String -> Content -> Maybe Int
getIdx idStr content =
    let
        f : Int -> Element -> (Int, Maybe Int) -> (Int, Maybe Int)
        f id elem (x, y) =
            case y of
                Just _ -> (x, y)
                Nothing ->
                    if idOf elem == id then
                        (x, Just x)
                    else
                        (x + 1, Nothing)
    in
    case String.toInt idStr of
        Just id ->
            Tuple.second
                <| List.foldl (f id) (0, Nothing) content

        Nothing ->
            Nothing


getViewport : (Result Error Viewport -> Msg) -> String -> Cmd Msg
getViewport msg editorID =
    Task.attempt msg (Dom.getViewportOf editorID)



idOf : Element -> Int
idOf elem =
    case elem of
        Break br -> br.id
        Char char -> char.id
        Embedded html -> html.id


idSet : Int -> Element -> Element
idSet id elem =
    case elem of
        Break br -> Break { br | id = id }
        Char ch -> Char { ch | id = id }
        Embedded html -> Embedded { html | id = id }


insertBreak : LineBreak -> Maybe Float -> Editor -> Editor
insertBreak br maybeTimeStamp editor0 =
    let
        e =
            case maybeTimeStamp of
                Just timeStamp ->
                    { editor0 | lastKeyDown = timeStamp }

                Nothing -> editor0

        elemTxt = "\n"
    in
    case e.selection of
        Nothing ->
            { e |
              content = List.take e.cursor e.content ++ [Break br] ++ List.drop e.cursor e.content                    
            , cursor = e.cursor + 1
            , idCounter = e.idCounter + 1
            }

        Just (beg,end) ->
            { e |
                content = List.take beg e.content ++ [Break br] ++ List.drop (end+1) e.content                    
              , cursor = beg + 1
              , idCounter = e.idCounter + 1
              , selection = Nothing
            }


is : (String, String) -> Editor -> Bool
is attr editor =
    List.member attr editor.fontStyle.styling


isAt : (String,String) -> Editor -> Int -> Maybe Bool
isAt attr e idx =
    case get idx e.content of
        Just (Char c) ->
            Just (List.member attr c.fontStyle.styling)

        _ ->
            Nothing


isBreak : Int -> Content -> Bool
isBreak idx content =
     case get idx content of
        Just (Break _) -> True
        _ -> False


isBold : Editor -> Bool
isBold editor =
    is boldStyle editor


isItalic : Editor -> Bool
isItalic editor =
    is italicStyle editor


isSelection : (String, String) -> Editor -> Bool
isSelection attr e =
    case e.selection of
        Nothing ->
            True

        Just (beg,end) ->
            not
                <| List.member (Just False)
                    <| List.map (isAt attr e) (List.range beg end)


isStrikeThrough : Editor -> Bool
isStrikeThrough editor =
    is strikeThroughStyle editor


isUnderline : Editor -> Bool
isUnderline editor =
    is underlineStyle editor


italic : Bool -> Editor -> ( Editor, Cmd Msg )
italic bool editor =
    setFontStyleTag italicStyle bool editor


italicStyle : (String,String)
italicStyle =
    ("font-style", "italic")


jump : (Vertical -> (Int,Int) -> Locating) -> (ScreenElement -> ScreenElement -> Bool) -> Vertical -> (Int,Int) -> Editor -> ( Editor, Cmd Msg )
jump f isRelevant direction (beg,end) e =
    let
        maxIdx = List.length e.content - 1

        g : Int -> Editor -> ( Editor, Cmd Msg )
        g idx x =
            ( detectFontStyle idx
              <| selectionMod e.cursor
                { x |
                    cursor = idx
                  , located = IntDict.empty
                  , locating = Idle 
                }
            , placeCursor ScrollIfNeeded e.editorID
            )

        fail x =
            ( { x |
                  located = IntDict.empty
                , locating = Idle 
              }
            , Cmd.none
            )
    in
    case jumpHelp isRelevant direction (beg,end) e of
        (Nothing, Nothing) ->
            fail e

        (_, Just idx) ->
            g idx e            

        (Just ((a,b),(c,d)), Nothing) ->
            if beg == 0 then
                g 0 e
            else
                if end == maxIdx then
                    g maxIdx e
                else
                    if beg > 0 || end < maxIdx then
                        locateMoreChars e (a, d) (f direction) [(a,b),(c,d)]
                    else
                        fail e


jumpHelp : (ScreenElement -> ScreenElement -> Bool) -> Vertical -> (Int,Int) -> Editor -> (Maybe ((Int,Int),(Int,Int)), Maybe Int)
jumpHelp isRelevant direction (beg,end) e =
    let
        maxIdx = List.length e.content - 1

        cursor = 
            { idx = e.cursor
            , x = e.cursorScreen.x
            , y = e.cursorScreen.y
            , height = e.cursorScreen.height
            }

        better : ScreenElement -> ScreenElement -> Bool
        better a b =
            abs (a.x - cursor.x) < abs (b.x - cursor.x)

        last : ScreenElement -> Bool
        last x =
            case direction of
                Down -> x.idx == maxIdx
                Up -> x.idx == 0

        f : Int -> ScreenElement -> (Maybe ScreenElement, Maybe ScreenElement) -> (Maybe ScreenElement, Maybe ScreenElement)
        f _ new (candidate, winner) =
            if not (isRelevant cursor new) then
                (candidate, winner)
            else
                case winner of
                    Just _ ->
                        (Nothing, winner)

                    Nothing ->
                        case candidate of
                            Nothing ->
                                if last new then
                                    (Nothing, Just new)
                                else
                                    (Just new, Nothing)

                            Just old ->
                                if not (onSameLine old new) || better old new then
                                        (Nothing, Just old)
                                else
                                    if last new then
                                        (Nothing, Just new)
                                    else
                                        (Just new, Nothing)

        fold =
            case direction of
                Down -> IntDict.foldl
                Up -> IntDict.foldr
    in
    case fold f (Nothing,Nothing) e.located of
        (_, Just winner) ->
            (Nothing, Just winner.idx)

        (_, Nothing) ->
            (Just ((beg - jumpSize//2, beg - 1), (end + 1, end + jumpSize//2)), Nothing)


jumpSize : Int
jumpSize = 100


keyDown : Float -> String -> Editor -> (Editor, Cmd Msg)
keyDown timeStamp str e =
    let
        timeStampCmd =
            Process.sleep tickPeriod |> Task.perform (\_ -> KeyDownTimeStamp timeStamp)

        f (x,y) =
            ( { x |
                lastKeyDown = timeStamp
              , typing = True 
              }
            , Cmd.batch [timeStampCmd,y] 
            )
    in
    f (keyDownHelp timeStamp str e)


keyDownHelp : Float -> String -> Editor -> (Editor, Cmd Msg)
keyDownHelp timeStamp str e =
    let

        like : String -> ( Editor, Cmd Msg )
        like x =
            update (KeyDown timeStamp x) e
    
        maxIdx = List.length e.content - 1
    in
    if String.length str == 1 then
        if not e.ctrlDown then
            typed str e (Just timeStamp) False
        else
            case str of
                {-"0" ->
                    typed "–" e (Just timeStamp) False  -- N dash                            

                "1" ->
                    typed "—" e (Just timeStamp) False -- M dash-}

                "a" ->
                    ( { e |
                         selection = Just (0, maxIdx)
                      }
                    , Cmd.none
                    )

                "A" ->
                    like "a"

                "c" ->
                    update Copy e

                "C" ->
                    like "c"

                "x" ->                            
                    update Cut e

                "X" ->
                    like "x"

                "z" ->
                    ( e, Task.perform identity (Task.succeed UndoAction) )

                "Z" ->
                    like "z"

                _ ->
                    ( e, Cmd.none )
    else
    case str of
        "ArrowDown" ->
            if e.cursor >= maxIdx then
                ( e, Cmd.none )
            else
                locateChars e (e.cursor + 1, e.cursor + jumpSize) (LineJump Down)

        "ArrowLeft" ->
            if e.cursor < 1 then
                if not e.shiftDown then
                    ( { e |
                          cursor = 0
                        , selection = Nothing 
                      }
                    , Cmd.none 
                    )
                else
                    ( e, Cmd.none )
            else
                if e.ctrlDown then
                    let
                        newCursor =  previousWordBoundary e
                    in
                    ( detectFontStyle newCursor
                        <| selectionMod e.cursor { e | cursor = newCursor }
                    
                    , placeCursor ScrollIfNeeded e.editorID
                    )
                else
                    let
                        f x = max 0 x

                        newCursor =
                            if e.shiftDown then
                                f (e.cursor - 1)
                            else
                                case e.selection of
                                    Nothing -> f (e.cursor - 1)
                                    Just (beg,_) -> beg
                    in
                    ( detectFontStyle newCursor
                        <| selectionMod e.cursor { e | cursor = newCursor }                                        

                    , placeCursor ScrollIfNeeded e.editorID
                    )

        "ArrowRight" ->
            if e.cursor >= maxIdx then
                ( { e | cursor = maxIdx, selection = Nothing }, Cmd.none )
            else
                if not e.shiftDown && e.selection == Just (0, maxIdx) then
                    ( detectFontStyle maxIdx
                          { e |
                             cursor = maxIdx
                           , selection = Nothing
                          } 
                    , placeCursor ScrollIfNeeded e.editorID
                    )
                else
                    if e.ctrlDown then
                        let
                            newCursor =
                                nextWordBoundary e
                        in
                        ( detectFontStyle newCursor
                            <| selectionMod e.cursor { e | cursor = newCursor }
                        
                        , placeCursor ScrollIfNeeded e.editorID
                        )
                    else
                        let
                            f x = min x maxIdx

                            newCursor =
                                if e.shiftDown then
                                    f (e.cursor + 1)
                                else
                                    case e.selection of
                                        Nothing -> f (e.cursor + 1)
                                        Just (_,end) -> f (end + 1)
                        in
                        ( detectFontStyle newCursor
                            <| selectionMod e.cursor { e | cursor = newCursor }   

                        , placeCursor ScrollIfNeeded e.editorID
                        )

        "ArrowUp" ->
            if e.cursor == 0 then
                ( e, Cmd.none )
            else
                locateChars e (e.cursor-jumpSize, e.cursor - 1) (LineJump Up)
                

        "Backspace" ->
            case e.selection of
                Nothing ->
                    if e.cursor > 0 then
                        ( detectFontStyle (e.cursor-1)
                              { e |
                                 content = List.take (e.cursor-1) e.content ++ List.drop e.cursor e.content
                               , cursor = e.cursor - 1
                              }
                        , placeCursor ScrollIfNeeded e.editorID
                        )
                    else
                        ( e, Cmd.none )

                Just (beg,end) ->
                    ( detectFontStyle beg
                          { e |
                             content = List.take beg e.content ++ List.drop (end+1) e.content
                           , cursor = beg
                           , selection = Nothing
                          }
                    , placeCursor ScrollIfNeeded e.editorID
                    )

        "Control" ->
            ( { e | ctrlDown = True }, Cmd.none )


        "Delete" ->
            case e.selection of
                Nothing ->
                    if e.cursor < maxIdx then
                        ( { e |
                             content = delete e.cursor (e.cursor+1) e
                          }
                        , placeCursor ScrollIfNeeded e.editorID
                        )
                    else
                        ( e, Cmd.none )

                Just (beg,end) ->
                    ( detectFontStyle beg
                          { e |
                             content = delete beg (end+1) e
                           , cursor = beg
                           , selection = Nothing  
                          }
                    , placeCursor ScrollIfNeeded e.editorID
                    )

        "End" ->
            if e.ctrlDown then
                ( detectFontStyle maxIdx
                    <| selectionMod e.cursor { e | cursor = maxIdx }

                , placeCursor ScrollIfNeeded e.editorID
                )
            else
                if e.shiftDown then
                    locateChars e (e.cursor + 1, e.cursor+jumpSize) (LineBoundary Down)
                else
                    locateChars { e | selection = Nothing } (e.cursor + 1, e.cursor+jumpSize) (LineBoundary Down)

        "Enter" ->
            if e.shiftDown then
                update (KeyDown timeStamp "\n") e
            else
                ( insertBreak (currentParaStyle e.idCounter e) (Just timeStamp) e
                , placeCursor ScrollIfNeeded e.editorID
                )

        "Home" ->
            if e.ctrlDown then
                ( detectFontStyle 0
                    <| selectionMod e.cursor { e | cursor = 0  }
                    
                , placeCursor ScrollIfNeeded e.editorID
                )
            else
                if e.shiftDown then
                    locateChars e (e.cursor-jumpSize, e.cursor - 1) (LineBoundary Up)
                else
                    locateChars { e | selection = Nothing } (e.cursor-jumpSize, e.cursor - 1) (LineBoundary Up)

        "PageDown" ->
            if e.cursor == maxIdx then
                ( e, Cmd.none )
            else
                locateChars e (pageEstimate Down maxIdx e.cursor e.viewport) (Page Down)

        "PageUp" ->
            if e.cursor == 0 then
                ( e, Cmd.none )
            else
                locateChars e (pageEstimate Up maxIdx e.cursor e.viewport) (Page Up)

        "Shift" ->
            ( { e | shiftDown = True }, Cmd.none )

        "Tab" ->
            ( e, Cmd.none )

        _ ->
            ( e, Cmd.none )


lineBoundary : Vertical -> (Int,Int) -> Editor -> ( Editor, Cmd Msg )
lineBoundary direction (beg,end) e =
    let
        maxIdx = List.length e.content - 1

        last : ScreenElement -> Bool
        last x =
            case direction of
                Down -> x.idx == maxIdx
                Up -> x.idx == 0

        cursor = 
            { idx = e.cursor
            , x = e.cursorScreen.x
            , y = e.cursorScreen.y
            , height = e.cursorScreen.height
            }

        f : Int -> ScreenElement -> (Maybe ScreenElement, Maybe ScreenElement) -> (Maybe ScreenElement, Maybe ScreenElement)
        f _ a (candidate, winner) =
            case winner of
                Just _ ->
                    (Nothing, winner)

                Nothing ->                            
                    if not (onSameLine a cursor) then
                        (Nothing, candidate)
                    else
                        if last a then
                            (Nothing, Just a)
                        else
                            (Just a, Nothing)

        fold =
            case direction of
                Down -> IntDict.foldl
                Up -> IntDict.foldr                
    in
    case fold f (Nothing,Nothing) e.located of
        (_, Just a) ->
            ( detectFontStyle a.idx
              <| selectionMod e.cursor
                { e |
                    cursor = a.idx
                  , located = IntDict.empty
                  , locating = Idle 
                }
            , placeCursor ScrollIfNeeded e.editorID
            )

        (Just _, _) ->
            case direction of
                Down ->
                    locateMoreChars
                        e
                        (e.cursor, end + jumpSize)
                        (LineBoundary Down)
                        [(end + 1, end + jumpSize)]

                Up ->
                    locateMoreChars
                        e
                        (beg - jumpSize, e.cursor)
                        (LineBoundary Up)
                        [(beg - jumpSize, beg - 1)]

        (Nothing, Nothing) ->
            ( { e |
                  located = IntDict.empty
                , locating = Idle 
              }
            , Cmd.none
            )


lineBreakAt : Int -> Content -> Maybe LineBreak
lineBreakAt idx content =
    case nextBreakFrom idx content of
        Just (_, lineBreak) ->
            Just lineBreak

        Nothing ->
            Nothing


lineJump : Vertical -> (Int,Int) -> Editor -> ( Editor, Cmd Msg )
lineJump direction (beg,end) editor =
    let
        f : ScreenElement -> ScreenElement -> Bool
        f cursor pos =
            case direction of
                Down -> pos.y > cursor.y
                Up -> pos.y < cursor.y
    in
    jump LineJump f direction (beg,end) editor


link : String -> Editor -> Editor
link href e =
    let
        f : Element -> Element
        f elem =
            case elem of
                Char ch -> Char { ch | link = Just href }
                _ -> elem

        g : Int -> Editor -> Editor
        g idx x =
            changeContent2 f idx x

        h : Int -> Int -> Editor
        h beg end  =
            List.foldl g e (List.range beg end)
    in
    case e.selection of
        Nothing ->
            linkMod f e

        Just (beg,end) ->
            h beg end


linkAt : Int -> Content -> Maybe String
linkAt idx content =
    case get idx content of
        Just (Char ch) ->
            ch.link

        _ ->
            Nothing


linkMod : (Element -> Element) -> Editor -> Editor
linkMod f editor =
    case currentLinkPos editor of
        Nothing ->
            editor

        Just (beg,end) ->
            List.foldl (changeContent2 f) editor (List.range beg end)


loadContent : Content -> Editor -> Editor
loadContent raw e =
    let
        i = init3 e.editorID e.highlighter e.selectionStyle

        content =
            case List.drop (List.length raw - 1) raw of
                Break _ :: _ -> raw
                _ -> raw ++ [Break (defaultLineBreak 0)]
    in
    undoAddNew
        { i |        
          content = addIds content
        , idCounter = List.length content
        , state = Edit
        }

 
loadText : String -> Editor -> Editor
loadText txt editor =
    let
        shell =
            init3 editor.editorID editor.highlighter editor.selectionStyle
    in
    undoAddNew (loadTextHelp txt shell)
        

loadTextHelp : String -> Editor -> Editor
loadTextHelp txt shell =
    let
        addCounter x =
            { x | idCounter = List.length x.content }
    in    
    addCounter
        { shell |        
            content = addIds (textToContent txt)
          , state = Edit
        }


locateCmd : Int -> String -> Cmd Msg
locateCmd idx id =    
    Task.attempt (LocatedChar idx) (Dom.getElement id)


locateChars : Editor -> (Int,Int) -> ( (Int,Int) -> Locating ) -> ( Editor, Cmd Msg )
locateChars e (a,b) func =
    let
        maxIdx = List.length e.content - 1

        (beg,end) =
            (max 0 a, min maxIdx b)

        cmd : Int -> List (Cmd Msg) -> List (Cmd Msg)
        cmd idx xs =
            case Maybe.map idOf (get idx e.content) of
                Nothing ->
                    xs

                Just id ->
                    locateCmd idx (e.editorID ++ String.fromInt id) :: xs

        cmds : List (Cmd Msg)
        cmds =
            List.foldr cmd [] (List.range beg end)
    in
    ( { e |
          locateBacklog = List.length cmds
        , located = IntDict.empty
        , locating = func (beg,end)
      }
    , Cmd.batch (focusOnEditor e.state e.editorID :: cmds)
    )


locateCursorParent : Editor -> ScrollMode -> ( Editor, Cmd Msg )
locateCursorParent e scroll =
    let
        id =
            Maybe.map idOf (get e.cursor e.content)
    in
    case id of
        Just x ->
            ( e, Task.attempt (PlaceCursor3_CursorParent scroll) <| Dom.getElement <| e.editorID ++ String.fromInt x )

        Nothing ->
            ( e, Cmd.none )


locateMoreChars : Editor -> (Int,Int) -> ((Int,Int) -> Locating) -> List (Int,Int) -> (Editor, Cmd Msg)
locateMoreChars e (a,b) func newRegions =
    let
        maxIdx = List.length e.content - 1

        normalize (x,y) =
            (max 0 x, min maxIdx y)

        (beg,end) =
            normalize (a,b)        
       
        cmd : Int -> List (Cmd Msg) -> List (Cmd Msg)
        cmd idx xs =
            case Maybe.map idOf (get idx e.content) of
                Nothing ->
                    xs

                Just id ->
                    locateCmd idx (e.editorID ++ String.fromInt id) :: xs

        toList (x,y) = List.range x y

        idxs =
            List.concat (List.map toList (List.map normalize newRegions))

        cmds : List (Cmd Msg)
        cmds =
            List.foldr cmd [] idxs
    in
    case idxs of
        [] ->
            ( { e |
                  locateBacklog = 0
                , located = IntDict.empty
                , locating = Idle
              }
            , Cmd.none 
            )

        xs ->
            ( { e |
                  locateBacklog = List.length cmds
                , locating = func (beg,end)
              }
            , Cmd.batch cmds
            )


locateMouse : Select -> (Float,Float) -> (Int,Int) -> Editor -> (Editor, Cmd Msg)
locateMouse s (mouseX,mouseY) (beg,end) e =
    let
        maxIdx = List.length e.content - 1

        diff : ScreenElement -> Float
        diff a =
            a.y - mouseY

        flips : ScreenElement -> ScreenElement -> Bool
        flips a b =
            -- a is below the mouse pos, b is at the same level or above
            -- note that this refers to the top of the character
            (diff a > 0 && diff b <= 0)

        f : Int -> ScreenElement -> MouseLocator -> MouseLocator
        f _ new m =
            case m.winner of
                Just _ -> m

                Nothing ->
                    if new.idx == maxIdx && diff new <= 0 then
                        { m | winner = Just new }
                    else
                        case m.previous of
                            Nothing ->
                                { m | previous = Just new }

                            Just old ->                            
                                if flips new old then
                                    { m | winner = Just old }
                                else
                                    { m | previous = Just new }

        start =
            { previous = Nothing
            , winner = Nothing
            }

        mouseLocator =
            -- find the last character whose top is just above the mouse pos
            -- ( starting from the end, find the first character where flip occurs )
            IntDict.foldl f start e.located

        g : ScreenElement -> Int -> ScreenElement -> Maybe Int -> Maybe Int
        g a _ b x =
            case x of
                Just _ -> x
                Nothing ->
                    if b.idx > a.idx then
                        Nothing
                    else
                        if not (onSameLine a b) then
                            Just (b.idx +1)
                        else
                            if b.idx == 0 then
                                Just 0
                            else
                                Nothing

        getBounds : ScreenElement -> Maybe (Int, Int)
        getBounds a =
            -- get the indices of the beginning and end of the line that ends with a
            case IntDict.foldr (g a) Nothing e.located of
                Just begIdx ->
                    Just (begIdx, a.idx)

                Nothing ->
                    Nothing

        targetLine : Maybe (Int, Int)
        targetLine =
            -- get the beg and end index of the line where the mouse was clicked
            case mouseLocator.winner of
                Nothing -> Nothing           
                Just pos ->
                    getBounds pos

        continue x =
            if beg <= 0 && end >= maxIdx then                
                ( { x |
                      locateBacklog = 0
                    , located = IntDict.empty
                    , locating = Idle
                  }
                , Cmd.none 
                )
            else                
                locateMoreChars
                    x
                    (beg - jumpSize, end + jumpSize)
                    ( Mouse s (mouseX,mouseY) )
                    [ (beg - jumpSize, beg - 1) 
                    , (end + 1, end + jumpSize)
                    ]
    in
    case targetLine of
        Nothing ->            
            continue e

        Just (lineBeg, lineEnd) ->
            let
                better : ScreenElement -> ScreenElement -> Bool
                better a b =
                    abs (mouseX - a.x) < abs (mouseX - b.x)

                h : Int -> ScreenElement -> Maybe ScreenElement -> Maybe ScreenElement
                h idx new old =
                    if idx < lineBeg || idx > lineEnd then
                        old
                    else
                        case old of
                            Nothing ->
                                Just new

                            Just a ->
                                if better new a then Just new else Just a

                maybeSelectWord : (Editor, Cmd Msg) -> (Editor, Cmd Msg)
                maybeSelectWord (a,b) =
                    case s of
                        SelectNone ->
                            (a,b)

                        SelectWord ->
                            ( selectCurrentWord a, b )
            in
            case  IntDict.foldl h Nothing e.located of
                Just closest ->
                    maybeSelectWord
                        ( detectFontStyle closest.idx
                              { e |
                                  cursor = closest.idx
                                , drag =
                                      if e.drag == DragInit then
                                          DragFrom closest.idx
                                      else
                                          e.drag
                                , located = IntDict.empty
                                , locating = Idle 
                              }
                            , placeCursor NoScroll e.editorID
                        )

                Nothing ->
                    continue e                    


mouseDown : (Float,Float) -> Float -> Editor -> ( Editor, Cmd Msg )
mouseDown (mouseX,mouseY) timeStamp e =
    let
        (pX,pY) = (e.box.x, e.box.y)

        viewport = e.viewport.viewport

        (vX,vY) = (viewport.x, viewport.y)

        sceneHeight = e.viewport.scene.height

        maxIdx = List.length e.content - 1

        guess : Int
        guess =
            Basics.round (toFloat maxIdx * ((mouseY - pY) + vY) / sceneHeight)

        bounds =
            (guess - jumpSize, guess + jumpSize)

        f x y =
            { x | 
                drag = y
              , lastMouseDown = timeStamp
            }            
    in
    locateChars (f { e | selection = Nothing } DragInit) bounds (Mouse SelectNone (mouseX, mouseY))


next : (Int -> Content -> Bool) -> Int -> Content -> Maybe Int
next f idx content =
    let
        maxIdx = List.length content - 1

        g : Int -> Maybe Int -> Maybe Int
        g x y =
            case y of
                Just _ -> y
                Nothing ->
                    if f x content then
                        Just x
                    else
                        Nothing

        idxs = List.range (idx+1) maxIdx
    in
    List.foldl g Nothing idxs


nextBreak : Editor -> Maybe (Int, LineBreak)
nextBreak editor =
    nextBreakFrom editor.cursor editor.content


nextBreakFrom : Int -> Content -> Maybe (Int, LineBreak)
nextBreakFrom begIdx content =
    let
        maxIdx = List.length content - 1

        f : Int -> Maybe (Int, LineBreak) -> Maybe (Int, LineBreak)
        f idx result =
            case result of
                Just _ -> result
                Nothing ->
                    case get idx content of
                        Just (Break br) ->
                            Just (idx, br)
                        
                        _ -> Nothing
    in
    List.foldl f Nothing (List.range begIdx maxIdx)


nextWordBoundary : Editor -> Int
nextWordBoundary e =    
    if alphaNumAt e.cursor e.content then
        Maybe.withDefault (List.length e.content - 1)
            <| next nonAlphaNumAt e.cursor e.content
    else
        Maybe.withDefault (List.length e.content - 1)
            <| next alphaNumAt e.cursor e.content


nonAlphaNumAt : Int -> Content -> Bool
nonAlphaNumAt idx content =
    not (alphaNumAt idx content)


null : Box
null =
    { x = 0
    , y = 0
    , height = 0
    , width = 0
    }


onSameLine : ScreenElement -> ScreenElement -> Bool
onSameLine a b =
    a.y == b.y ||
    a.y <= b.y && a.y + a.height >= b.y + b.height ||
    b.y <= a.y && b.y + b.height >= a.y + a.height


page : Vertical -> (Int,Int) -> Editor -> ( Editor, Cmd Msg )
page direction (beg,end) e =
    let
        f : ScreenElement -> ScreenElement -> Bool
        f cursor idx =
            case direction of
                Down -> idx.y >= cursor.y + e.box.height
                Up -> idx.y <= cursor.y - e.box.height
    in
    jump Page f direction (beg,end) e


pageEstimate : Vertical -> Int -> Int -> Viewport -> (Int,Int)
pageEstimate direction maxIdx cursor viewport =
    let
        scene = viewport.scene

        v = viewport.viewport

        pageSizeGuess =            
            Basics.round (toFloat (maxIdx + 1) * v.height / scene.height)

        cursorGuess =
            case direction of
                Down -> min maxIdx (cursor + pageSizeGuess)
                Up -> max 0 (cursor - pageSizeGuess)
    in
    ( cursorGuess - jumpSize, cursorGuess + jumpSize )


paraClassAdd : String -> LineBreak -> LineBreak
paraClassAdd className br =
    let
        filtered : List String -> List String
        filtered xs =
            List.filter (\x -> not (x == className)) xs
    in
    { br | classes = className :: filtered br.classes }


paraClassRemove : String -> LineBreak -> LineBreak
paraClassRemove className br =
    let
        filtered : List String -> List String
        filtered xs =
            List.filter (\x -> not (x == className)) xs
    in
    { br |
        classes = filtered br.classes 
      , highlightClasses = filtered br.highlightClasses
    }
    

parasInSelection : Editor -> List (Int, LineBreak)
parasInSelection e =
    let
        f : Element -> (Int, List (Int, LineBreak)) -> (Int, List (Int, LineBreak))
        f x (y,zs) =
            case x of
                Break br -> (y + 1, (y, br) :: zs)
                _ -> (y + 1, zs)

        g : (Int,Int) -> Content -> List (Int, LineBreak)
        g (beg,end) x =
            Tuple.second
                <| List.foldl f (beg, []) (List.drop beg (List.take (end + 1) e.content))
    in
    case e.selection of
        Nothing ->
            case nextBreakFrom e.cursor e.content of
                Just x ->
                    [x]

                Nothing ->
                    []

        Just (beg,end) ->
            case nextBreakFrom end e.content of
                Just x ->
                    x :: g (beg,end) e.content

                Nothing ->
                    g (beg,end) e.content


placeCursor : ScrollMode -> String -> Cmd Msg
placeCursor scroll editorID =    
    Task.attempt (PlaceCursor1_EditorPos scroll) (Dom.getElement editorID)


previous : (Int -> Content -> Bool) -> Int -> Content -> Maybe Int
previous f idx content =
    let
        g : Int -> Maybe Int -> Maybe Int
        g x y =
            case y of
                Just _ -> y
                Nothing ->
                    if f x content then
                        Just x
                    else
                        Nothing

        idxs = List.range 0 (idx-1)
    in
    List.foldr g Nothing idxs


previousLineBreak : Int -> Content -> Int
previousLineBreak idx content =
    Maybe.withDefault 0
        <| previous isBreak idx content


previousWordBoundary : Editor -> Int
previousWordBoundary e =
    if alphaNumAt (e.cursor-1) e.content then
        Maybe.withDefault 0
            <| Maybe.map (\x -> x + 1)
                <| previous nonAlphaNumAt e.cursor e.content
    else
        Maybe.withDefault 0
            <| Maybe.map (\x -> x + 1)
                <| previous alphaNumAt e.cursor e.content


replaceLink : String -> Editor -> Editor
replaceLink href editor =
    let
        f : Element -> Element
        f elem =
            case elem of
                Char ch -> Char { ch | link = Just href }
                _ -> elem
    in
    linkMod f editor


replaceText : String -> Editor -> Editor
replaceText txt editor =
    loadTextHelp txt editor


restore : Undo -> Editor -> Editor
restore x editor =
    { editor | 
        content = x.content
      , cursor = x.cursor
      , fontStyle = x.fontStyle
      , selection = x.selection
    }


scrollIfNeeded : Box -> Box -> Viewport -> String -> Cmd Msg
scrollIfNeeded cursor box viewport editorID =
    let
        viewY = viewport.viewport.y
    in
    if cursor.y < box.y then
        let
            yDelta =  -box.y + cursor.y
        in
        scrollTo editorID (viewY + yDelta)
    else
        if cursor.y > box.y + box.height then
            let
                yDelta = 
                    cursor.y + cursor.height - box.y - box.height
            in
            scrollTo editorID (viewY + yDelta)
        else
            Cmd.none


scrollTo : String -> Float -> Cmd Msg
scrollTo editorID y =
    Task.attempt (\_ -> NoOp)
        <| Dom.setViewportOf editorID 0 y


scrollToCursor : Editor -> Cmd Msg
scrollToCursor e =
    placeCursor ScrollIfNeeded e.editorID


selectCurrentWord : Editor -> Editor
selectCurrentWord editor =
    let
        (beg,end) =
            currentWord editor
    in
    { editor |
        cursor = min (end+1) (List.length editor.content - 1)
      , selection = Just (beg,end) 
    }


selectionMod : Int -> Editor -> Editor
selectionMod oldCursor new =
    let
        newCursor = new.cursor

        selection =
            case new.selection of
                Just (beg,end) ->
                    if newCursor < beg then
                        Just (newCursor, end)
                    else
                        if newCursor > end then
                            Just (beg, newCursor - 1)
                        else
                            if oldCursor == beg then
                                Just (newCursor, end)
                            else
                                Just (beg, newCursor - 1)

                Nothing ->
                    if newCursor < oldCursor then
                        Just (newCursor, oldCursor - 1)
                    else
                        if newCursor > oldCursor then
                            Just (oldCursor, newCursor - 1)
                        else
                            Nothing                    
    in
    if new.shiftDown then
        { new | selection = selection }
    else
        { new | selection = Nothing }


set : Int -> Element -> Content -> Content
set idx elem content =
    List.take idx content ++ [elem] ++ List.drop (idx+1) content 


set2 : Int -> Element -> Editor -> Editor
set2 idx elem editor =
    let
        content = editor.content
    in
    { editor |
        content = set idx elem content
    }


setFontStyle : (MiniRte.Types.FontStyle -> MiniRte.Types.FontStyle) -> Editor -> ( Editor, Cmd Msg )
setFontStyle mod e =
    let
        f : Element -> Element
        f elem =
            case elem of
                Char c -> Char { c | fontStyle = mod c.fontStyle }
                _ -> elem

        g : Int -> Content -> Content
        g idx content =
            case get idx content of
                Just elem -> set idx (f elem) content
                Nothing -> content


        h : (Int,Int) -> Content -> Content
        h (beg,end) content =
            List.foldl g content (List.range beg end)

        i : (Int,Int) -> Editor -> Editor
        i (beg,end) x =
            { x | content = h (beg,end) x.content }

        j : Editor -> Editor
        j x =
            { x | fontStyle = mod e.fontStyle }
    in
    case e.selection of
        Nothing ->
            ( j e, Cmd.none )

        Just (beg,end) ->
            ( j
                <| i (beg,end)
                    <| undoAddNew e

            , placeCursor ScrollIfNeeded e.editorID
            )


setFontStyleTag : (String, String) -> Bool -> Editor -> ( Editor, Cmd Msg )
setFontStyleTag attr bool e =
    let
        restOf : StyleTags -> StyleTags
        restOf xs =
            List.filter (\x -> not (x == attr)) xs

        mod : { a | styling : StyleTags } -> { a | styling : StyleTags }
        mod x =
            if bool then
                { x | styling = attr :: restOf x.styling }
            else
                { x | styling = restOf x.styling }
    in
    case e.selection of
        Just _ ->
            setFontStyle mod e

        Nothing ->
            ( { e | fontStyle = mod e.fontStyle }, Cmd.none )


setPara : (LineBreak -> LineBreak) -> Editor -> ( Editor, Cmd Msg )
setPara f e =
    let
        g : (Int, LineBreak) -> Editor -> Editor
        g (idx, lineBreak) x =
            set2 idx (Break (f lineBreak)) x

        h : List (Int, LineBreak) -> Editor -> Editor
        h xs y =
            List.foldr g y xs
    in
    ( h (parasInSelection e) (undoAddNew e)
    , placeCursor ScrollIfNeeded e.editorID
    )


setSelection : (Int, Int) -> Editor -> ( Editor, Cmd Msg )
setSelection (a,b) e =
    let
        maxIdx = List.length e.content - 1

        (beg, end) =
            if a <= b then
                ( max 0 a, min maxIdx b )
            else
                ( max 0 b, min maxIdx a )
    in
    ( { e |
          cursor = min maxIdx (end + 1)
        , selection = Just (beg,end) 
      }
    , placeCursor ScrollIfNeeded e.editorID
    )


showChar : String -> Maybe (Int,Int) -> List (Attribute Msg) -> Int -> Bool -> Int -> Maybe String -> Character -> KeyedNode Msg
showChar editorID selection selectionStyle cursor typing idx fontSizeUnit ch =
    let
        id =
            editorID  ++ String.fromInt ch.id

        fontFamilyAttr =
            if ch.fontStyle.fontFamily == [] then
                []
            else
                [ css
                    [ fontFamilies ch.fontStyle.fontFamily ]
                ]

        linked : Html Msg -> Html Msg
        linked x =
            case ch.link of
                Nothing -> x                
                Just href ->
                    Html.a
                        [ Attr.href href ]
                        [ x ]

        child =            
            if idx == cursor then                
                [ linked (text (String.fromChar ch.char))
                , cursorHtml typing
                ]
            else
                [ linked (text (String.fromChar ch.char)) ]

        pos =
            if idx == cursor then
                [ css
                    [ position relative ]
                ]
            else
                []

        unit =
            Maybe.withDefault "px" fontSizeUnit

        size =
            case ch.fontStyle.fontSize of
                Nothing -> []
                Just x ->
                    [ Attr.style "font-size" (String.fromFloat x ++ unit) ]

        select : List (Attribute Msg)
        select =
            case selection of
                Just (beg,end) ->
                    if idx >= beg && idx <= end then
                        selectionStyle
                    else
                        []

                Nothing -> []
    in
    ( id        
    , Html.span
        ( Attr.id id ::   
          attributes (Char ch) ++
          fontFamilyAttr ++
          pos ++
          select ++
          size
        )  
        child
    )


showContent : ViewTextareaParams msg -> ViewTextareaContent -> Html msg
showContent params c =
    let
        listeners =
            [ Events.on "mousedown" (decodeMouse (\x y -> params.tagger <| MouseDown x y))
            , Events.on "scroll" (Decode.map ( params.tagger << Scrolled ) (Decode.at ["target", "scrollTop"] Decode.float))
            ]

        attrs =
            ( params.userDefinedStyles ++ 
              listeners ++  
            [ css
                [ property "cursor" "text"
                , property "user-select" "none"
                , whiteSpace preWrap
                , property "word-break" "break-word"
                ]
            , Attr.id params.editorID
            ]
            )

        highlight =
            case params.highlighter of
                Just f -> f << List.map dehighlight
                Nothing -> identity

        paragraphs =
            List.map
                (showPara params.editorID params.tagger c.cursor params.indentUnit c.selection params.selectionStyle c.typing params.fontSizeUnit)
                (breakIntoParas (highlight c.content))
    in
    Keyed.node "div"
        attrs
        paragraphs


showContentInactive : String -> List (Attribute msg) -> Maybe String -> Maybe (Content -> Content) -> Maybe (Float, String) -> (Msg -> msg) -> String -> Html msg
showContentInactive editorID userDefinedStyles fontSizeUnit highlighter indentUnit tagger txt =
    let
        attrs =
            ( userDefinedStyles ++ 
            [ css
                [ property "cursor" "text"
                , property "user-select" "none"
                , whiteSpace preWrap
                , property "word-break" "break-word"
                ]
            ])

        highlight =
            case highlighter of
                Just f -> f << List.map dehighlight
                Nothing -> identity

        paragraphs x =
                List.map
                    (Tuple.second << showPara editorID tagger -1 indentUnit Nothing [] False fontSizeUnit)
                    (breakIntoParas (highlight x))

        render x =
            Html.div
                attrs
                (paragraphs x)
    in
    case decode txt of
        Just content ->
            render content

        Nothing ->
            render (textToContent txt)        


showEmbedded : EmbeddedHtml -> Html Msg
showEmbedded html =
    let
        textChild =
            case html.text of
                Nothing -> []
                Just txt -> [text txt]

        f : Child -> Html Msg
        f x =
            case x of
                Child y -> showEmbedded y

        g : (String, String) -> Attribute Msg
        g (x,y) =
            Attr.attribute x y

        attrs = attributes (Embedded html) ++ List.map g (html.attributes)
    in
    case html.nodeType of
        Nothing ->
            case textChild of
                [] -> Html.div [] []
                x :: _ -> x

        Just x ->
            Html.node x attrs (textChild ++ List.map f html.children)


showPara : String -> (Msg -> msg) -> Int -> Maybe (Float, String) -> Maybe (Int,Int) -> List (Attribute Msg) -> Bool -> Maybe String -> Paragraph -> KeyedNode msg
showPara editorID tagger cursor maybeIndentUnit selection selectionStyle typing fontSizeUnit p =
    let        
        print : Int -> Character -> KeyedNode Msg
        print idx ch =
            showChar editorID selection selectionStyle cursor typing idx fontSizeUnit ch
            
        f : EmbeddedHtml -> KeyedNode Msg
        f html =
            (String.fromInt html.id ++ "embed", showEmbedded html)

        g : (Int, Element) -> KeyedNodes Msg -> KeyedNodes Msg
        g (idx, elem) ys =
            case elem of
                Break br ->
                    ys
                    --never occurs because of breakIntoParas
                
                Char ch ->
                    print idx ch :: ys
                
                Embedded html ->
                    zeroSpace idx html.id ::
                    f html ::
                    ys

        zeroSpace idx id =
            print idx (zeroWidthCharacter id)

        indentUnit =
            Maybe.withDefault (50,"px") maybeIndentUnit

        tag (x,y) =
            (x, Html.map tagger y)
    in
    tag
        <| wrap editorID indentUnit p.lineBreak
            <| List.foldr g [zeroSpace p.idx p.lineBreak.id] p.children


snapshot : Editor -> Undo
snapshot editor =
    { content = editor.content
    , cursor = editor.cursor
    , fontStyle = editor.fontStyle
    , selection = editor.selection
    }


spaceOrLineBreakAt : Int -> Content -> Bool
spaceOrLineBreakAt idx content =
    case get idx content of
        Just (Break _) ->
            True

        Just (Char ch) ->
            ch.char == ' '

        Just (Embedded _) ->
            False

        Nothing ->
            False


state : State -> Editor -> ( Editor, Cmd Msg )
state new e =
    let
        cmd =
            if new == Edit then
                focusOnEditor Edit e.editorID
            else
                Cmd.none
    in
    ( { e | state = new }, cmd )


strikeThrough : Bool -> Editor -> ( Editor, Cmd Msg )
strikeThrough bool editor =
    setFontStyleTag strikeThroughStyle bool editor


strikeThroughStyle : (String, String)
strikeThroughStyle =
    ("text-decoration", "line-through")


textAlign : TextAlignType -> Editor -> ( Editor, Cmd Msg )
textAlign alignment e =
    let
        style =
            case alignment of
                Center -> "center"
                Left -> "left"
                Right -> "right"

        keep (x,y) =
            x /= "text-align"

        f x =
            { x |
                styling = ("text-align",style) :: List.filter keep x.styling 
            }
    in
    setPara f e


textContent : Editor -> String
textContent e =
    toText e.content


textToContent : String -> Content
textToContent txt =
    let
        f : Char -> Element
        f x =
            case x of
                '\n' ->
                    Break (defaultLineBreak 0)

                _ ->
                    Char
                        { char = x
                        , fontStyle = emptyFontStyle
                        , highlightClasses = []
                        , highlightStyling = []
                        , id = 0
                        , link = Nothing
                        }

        g : List Char -> Content -> Content
        g xs ys =
            case xs of
                [] -> ys
                x :: rest ->
                    g rest (f x :: ys)

        end =
            [Break (defaultLineBreak 0)]

        converted =
            g (List.reverse (String.toList txt)) []
    in
    if txt == "" then
        end
    else
        if List.head (List.reverse (String.toList txt)) == Just '\n' then
            converted
        else
            converted ++ end


tickPeriod : Float
tickPeriod =
    500 --millisec


toggle : (String, String) -> Editor -> ( Editor, Cmd Msg )
toggle attr e =
    case e.selection of
        Just _  ->
            setFontStyleTag attr (not <| isSelection attr e) e

        Nothing ->
            setFontStyleTag attr (not <| is attr e) e


toggleBold : Editor -> ( Editor, Cmd Msg )
toggleBold e =
    toggle boldStyle e


toggleItalic : Editor -> ( Editor, Cmd Msg )
toggleItalic e =
    toggle italicStyle e


toggleStrikeThrough : Editor -> ( Editor, Cmd Msg )
toggleStrikeThrough e =
    let
        removeUnderline x =
            if is underlineStyle x then
                Tuple.first (underline False x)
            else
                x
    in
    toggle strikeThroughStyle (removeUnderline e)


toggleUnderline : Editor -> ( Editor, Cmd Msg )
toggleUnderline e =
    let
        removeStrikeThrough x =
            if is strikeThroughStyle x then
                Tuple.first (strikeThrough False x)
            else
                x
    in
    toggle underlineStyle (removeStrikeThrough e)


toggleNodeType : String -> Editor -> ( Editor, Cmd Msg )
toggleNodeType nodeType e =
    let
        f : LineBreak -> LineBreak
        f x =
            if x.nodeType == Just nodeType then
                { x | nodeType = Nothing }
            else
                { x | nodeType = Just nodeType }
    in
    setPara f e
    

toggleParaClass : String -> Editor -> ( Editor, Cmd Msg )
toggleParaClass className e =
    let
        f : LineBreak -> LineBreak
        f x =
            if List.member className x.classes then
                paraClassRemove className x
            else
                paraClassAdd className x
    in
    setPara f e


toText : Content -> String
toText content =
    let
        f : Element -> String
        f x =
            case x of
                Break _ -> "\n"
                Char ch -> String.fromChar ch.char
                Embedded html -> zeroWidthSpace

        g : Element -> String -> String
        g x y =
            y ++ f x
    in
    List.foldl g "" content


typed : String -> Editor -> Maybe Float -> Bool -> ( Editor, Cmd Msg )
typed txt e maybeTimeStamp modifyClipboard =
    let
        txtLength = List.length (String.toList txt)

        activeLink =
            currentLink e

        f : Int -> Char -> Element
        f id char =
            Char
                { char = char
                , fontStyle = e.fontStyle
                , highlightClasses = []
                , highlightStyling = []
                , id = id
                , link = activeLink
                }

        g : List Char -> (Int, Content) -> (Int, Content)
        g xs (id, content) =
            case xs of
                [] -> (id, content)
                x :: rest ->
                    g rest (id - 1, f id x :: content)

        newIdCounter = e.idCounter + txtLength

        newContent =
            Tuple.second 
                <| g (List.reverse (String.toList txt)) (newIdCounter - 1, [])

        newClipboard =
            if modifyClipboard then
                Just newContent
            else
                e.clipboard
    in
    case e.selection of
        Nothing ->
            ( { e |
                  clipboard = newClipboard
                , content = List.take e.cursor e.content ++ newContent ++ List.drop e.cursor e.content                    
                , cursor = e.cursor + txtLength
                , idCounter = newIdCounter
              }
            , placeCursor ScrollIfNeeded e.editorID
            )

        Just (beg, x) ->
            let
                maxIdx =
                    List.length e.content - 1

                end =
                    if x == maxIdx then maxIdx - 1 else x
                    -- prevent last Break from being deleted
            in
            ( { e |
                  clipboard = newClipboard
                , content = List.take beg e.content ++ newContent ++ List.drop (end+1) e.content                    
                , cursor = beg + txtLength
                , idCounter = newIdCounter
                , selection = Nothing
              }
            , placeCursor ScrollIfNeeded e.editorID
            )


undoAction : Editor -> ( Editor, Cmd Msg )
undoAction e =
    case e.undo of
        [] ->
            ( e, Cmd.none )

        x :: [] ->
            ( restore x { e | undo = [x] }
            , placeCursor ScrollIfNeeded e.editorID
            )

        x :: rest ->
            ( restore x { e | undo = rest }
            , placeCursor ScrollIfNeeded e.editorID
            )


undoAddNew : Editor -> Editor
undoAddNew e =
    let    
        clip xs =
            List.take undoMaxDepth xs
    in    
    { e | undo = clip (snapshot e :: e.undo) }


undoRefreshHead : Editor -> Editor
undoRefreshHead e =
    let
        current =
            snapshot e
    in
    case e.undo of
        [] ->
            e
            -- e.undo should never be empty. This is supposed to be
            -- taken care of by initWithContent, initWithText, and restore.

        _ :: rest ->
            { e |
                undo = current :: rest
            }


underline : Bool -> Editor -> ( Editor, Cmd Msg )
underline bool editor =
    setFontStyleTag underlineStyle bool editor    


underlineStyle : (String, String)
underlineStyle =
    ("text-decoration", "underline")


undo : Editor -> ( Editor, Cmd Msg )
undo e =
    update UndoAction e


undoMaxDepth : Int
undoMaxDepth = 10


unlink : Editor -> Editor
unlink editor =
    let
        f : Element -> Element
        f elem =
            case elem of
                Char ch -> Char { ch | link = Nothing }
                _ -> elem
    in
    linkMod f editor


wordAt : Int -> Content -> Bool
wordAt idx content =
    not (spaceOrLineBreakAt idx content)


wrap : String -> (Float, String) -> LineBreak -> Wrapper
wrap editorID (amount, unit) l =
    let
        addId x func ys = (x, func ys)

        id =
            editorID  ++ String.fromInt l.id ++ "wrap"

        indentation =
            l.indent + l.highlightIndent

        indentStr =
            String.fromFloat (toFloat indentation*amount) ++ unit

        indentAttr =
            if indentation > 0 then
                [ Attr.style "padding-left" indentStr 
                , Attr.style "padding-right" indentStr
                ]
            else
                []
    in
    case l.nodeType of
        Nothing ->
            addId id (Keyed.node "div" <| indentAttr ++ attributes (Break l))

        Just nodeType ->
            addId id (Keyed.node nodeType <| indentAttr ++ attributes (Break l))


zeroWidthChar =
    Char.fromCode 8203


zeroWidthCharacter : Int -> Character
zeroWidthCharacter id =
    { char = zeroWidthChar
    , fontStyle = emptyFontStyle
    , highlightClasses = []
    , highlightStyling = []
    , id = id
    , link = Nothing
    }


zeroWidthSpace : String
zeroWidthSpace =
    String.fromChar zeroWidthChar


--=== Encoding / decoding content

decode : String -> Maybe Content
decode x =
    case Decode.decodeString decodeContent x of
        Ok content ->
            Just content

        Err err ->
            Nothing


decodeCharacter : Decode.Decoder Character
decodeCharacter =
    let
        toChar x =
            case String.uncons x of
                Just (char, _) ->
                    Decode.succeed char

                Nothing ->
                    Decode.fail ("Not convertible into a Char: " ++ x)
    in
    Decode.map6
        Character
            ( Decode.field "char" ( Decode.string |> Decode.andThen toChar ) )
            ( Decode.field "fontStyle" decodeFontStyle )
            ( Decode.succeed [] )  --"highlightClasses"
            ( Decode.succeed [] )  --"highlightStyling"
            ( Decode.succeed -1 ) --id
            ( Decode.field "link" (Decode.maybe Decode.string) )


decodeContent : Decode.Decoder Content
decodeContent =
    Decode.list decodeElement


decodeElement : Decode.Decoder Element
decodeElement =
    Decode.field "Constructor" Decode.string |> Decode.andThen decodeElementHelp


decodeElementHelp constructor =
    case constructor of
        "Break" ->
            Decode.map
                Break
                    ( Decode.field "A1" decodeLineBreak )
        "Char" ->
            Decode.map
                Char
                    ( Decode.field "A1" decodeCharacter )
        "Embedded" ->
            Decode.map
                Embedded
                    ( Decode.field "A1" decodeEmbeddedHtml )
        other->
            Decode.fail <| "Unknown constructor for type Element: " ++ other



decodeEmbeddedHtml : Decode.Decoder EmbeddedHtml
decodeEmbeddedHtml =
    let        
        f : Decoder EmbeddedHtml
        f =
            Decode.succeed EmbeddedHtml
                |> Pipeline.required "attributes" (Decode.list decodeTuple_String_String_)
                |> Pipeline.required "classes" (Decode.list Decode.string)
                |> Pipeline.hardcoded [] --"children"
                |> Pipeline.hardcoded [] -- "highlightClasses"
                |> Pipeline.hardcoded [] --"highlightStyling"
                |> Pipeline.hardcoded -1 --"id"
                |> Pipeline.required "nodeType" (Decode.maybe Decode.string)
                |> Pipeline.required "styling" decodeStyleTags
                |> Pipeline.required "text" (Decode.maybe Decode.string)

        g : Decoder (EmbeddedHtml, List String)
        g =
            Decode.map2 Tuple.pair f (Decode.field "children" (Decode.list Decode.string))

        h : Result Decode.Error (List EmbeddedHtml) -> List String -> Result Decode.Error (List EmbeddedHtml)
        h x ys =
            case x of
                Err err ->
                    Err err

                Ok xs ->
                    case ys of
                        [] ->
                            x

                        y :: rest ->
                            case Decode.decodeString decodeEmbeddedHtml y of
                                Ok result ->
                                    h (Ok (result::xs)) rest

                                Err err ->
                                    Err err

        i : (EmbeddedHtml, List String) -> Decode.Decoder EmbeddedHtml
        i (x,ys) =
            case h (Ok []) ys of
                Ok children ->
                    Decode.succeed { x | children = List.map Child children }

                Err err ->
                    Decode.fail (Decode.errorToString err)
    in
    g |> Decode.andThen i


decodeFontStyle : Decode.Decoder MiniRte.Types.FontStyle
decodeFontStyle =
    Decode.map4
        FontStyle
            ( Decode.field "classes" (Decode.list Decode.string) )
            ( Decode.field "fontFamily" (Decode.list Decode.string) )
            ( Decode.field "fontSize" (Decode.maybe Decode.float) )
            ( Decode.field "styling" decodeStyleTags )


decodeLineBreak : Decode.Decoder LineBreak
decodeLineBreak =
    Decode.map8
        LineBreak
            ( Decode.field "classes" (Decode.list Decode.string) )
            ( Decode.succeed [] )--highlightClasses
            ( Decode.succeed 0 )--highlightIndent
            ( Decode.succeed [] )--highlightStyling
            ( Decode.succeed -1 )--id
            ( Decode.field "indent" Decode.int )
            ( Decode.field "nodeType" (Decode.maybe Decode.string) )
            ( Decode.field "styling" decodeStyleTags )


decodeStyleTags : Decode.Decoder StyleTags
decodeStyleTags =
    Decode.list decodeTuple_String_String_


decodeTuple_String_String_ : Decode.Decoder (String, String)
decodeTuple_String_String_ =
    Decode.map2
        (\a1 a2 -> (a1, a2))
            ( Decode.field "A1" Decode.string )
            ( Decode.field "A2" Decode.string )


encode : Editor -> String
encode e =
    Encode.encode 0 (encodeContent e.content)


encodeCharacter : Character -> Decode.Value
encodeCharacter a =
    Encode.object
        [ ("char", Encode.string (String.fromChar a.char))
        , ("fontStyle", encodeFontStyle a.fontStyle)
        , ("link", encodeMaybe Encode.string a.link)
        ]


encodeChild : Child -> Decode.Value
encodeChild (Child a1) =
    encodeEmbeddedHtml a1


encodeContent : Content -> Decode.Value
encodeContent a =
    Encode.list encodeElement a


encodeElement : Element -> Decode.Value
encodeElement a =
    case a of
        Break a1 ->
            Encode.object
                [ ("Constructor", Encode.string "Break")
                , ("A1", encodeLineBreak a1)
                ]
        Char a1 ->
            Encode.object
                [ ("Constructor", Encode.string "Char")
                , ("A1", encodeCharacter a1)
                ]
        Embedded a1 ->
            Encode.object
                [ ("Constructor", Encode.string "Embedded")
                , ("A1", encodeEmbeddedHtml a1)
                ]


encodeEmbeddedHtml : EmbeddedHtml -> Decode.Value
encodeEmbeddedHtml a =
    Encode.object
        [ ("attributes", Encode.list encodeTuple_String_String_ a.attributes)
        , ("classes", Encode.list Encode.string a.classes)
        , ("children", Encode.list encodeChild a.children)
        , ("nodeType", encodeMaybe Encode.string a.nodeType)
        , ("styling", encodeStyleTags a.styling)
        , ("text", encodeMaybe Encode.string a.text)
        ]


encodeFontStyle : MiniRte.Types.FontStyle -> Decode.Value
encodeFontStyle a =
    Encode.object
        [ ("classes", Encode.list Encode.string a.classes)
        , ("fontFamily", Encode.list Encode.string a.fontFamily)
        , ("fontSize", encodeMaybe Encode.float a.fontSize)
        , ("styling", encodeStyleTags a.styling)
        ]


encodeLineBreak : LineBreak -> Decode.Value
encodeLineBreak a =
    Encode.object
        [ ("classes", Encode.list Encode.string a.classes)
        , ("indent", Encode.int a.indent)
        , ("nodeType", encodeMaybe Encode.string a.nodeType)
        , ("styling", encodeStyleTags a.styling)
        ]


encodeMaybe f a = 
    case a of
        Just b ->
            f b
        Nothing ->
            Encode.null


encodeStyleTags : StyleTags -> Decode.Value
encodeStyleTags a =
    Encode.list encodeTuple_String_String_ a


encodeTuple_String_String_ : (String, String) -> Decode.Value
encodeTuple_String_String_ (a1, a2) =
    Encode.object
        [ ("A1", Encode.string a1)
        , ("A2", Encode.string a2)
        ]

