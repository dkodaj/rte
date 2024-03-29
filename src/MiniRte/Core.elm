module MiniRte.Core exposing
    ( Editor
    , addContent    
    , addImage
    , addText
    , changeIndent
    , contentChanged
    , copy
    , currentLink
    , currentSelection
    , cut
    , decodeContentString
    , decodeContentGZip
    , embed
    , encodeContentString
    , encodeContentGZip
    , focusOnEditor
    , fontFamily
    , fontSize
    , init
    , link
    , loadContent
    , loadText
    , replaceText
    , selectRange
    , setSelection
    , showContentInactive
    , showEncodedContentInactive
    , showEmbedded
    , state
    , subscriptions
    , textAlign
    , textContent
    , textToContent
    , toText
    , toggleBold
    , toggleItalic
    , toggleNodeType
    , toggleParaClass
    , toggleStrikeThrough
    , toggleUnderline
    , undo
    , unlink
    , update
    , view
    )

import Array exposing (Array)
import Browser.Dom as Dom exposing (Error, Viewport)
import Browser.Events
import Bytes exposing (Bytes)
import Bytes.Decode
import Bytes.Encode
import Css exposing (..)
import Css.Animations as CssAnim
import Flate
import Html.Styled as Html exposing (Attribute, Html, text)
import Html.Styled.Attributes as Attr exposing (css)
import Html.Styled.Events as Events
import Html.Styled.Lazy as HtmlLazy
import IntDict exposing (IntDict)
import Json.Decode as Decode exposing (Decoder, Value)
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode
import MiniRte.Types exposing (..)
import MiniRte.TypesThatAreNotPublic exposing (..)
import Process
import Task
import Time


type alias Editor =
    { characterLimit : Maybe Int
    , clipboard : Maybe Content
    , content : Content
    , ctrlDown : Bool
    , cursor : Int
    , cursorElement : Dom.Element
    , drag : Drag
    , editorElement : Dom.Element
    , editorID : String
    , fontSizeUnit : Maybe String
    , fontStyle : MiniRte.Types.FontStyle
    , highlighter : Maybe (Content -> Content)
    , indentUnit : Maybe ( Float, String )
    , lastKeyDown : Float
    , lastMouseDown : Float
    , locateBacklog : Int
    , located : IntDict ScreenElement
    , locateNext : List (( Int, Int ) -> Locating)
    , locating : Locating
    , pasteImageLinksAsImages : Bool
    , pasteLinksAsLinks : Bool
    , selection : Maybe ( Int, Int )
    , selectionStyle : List (Attribute Msg)
    , shiftDown : Bool
    , state : State
    , typing : Bool
    , undo : List Undo
    , viewport : Dom.Viewport
    }


type alias Paragraph =
    { idx : Int
    , children : List ( Int, Element )
    , lineBreak : LineBreakRecord
    }


type alias Paragraphs =
    List Paragraph


type alias Undo =
    { content : Content
    , cursor : Int
    , fontStyle : MiniRte.Types.FontStyle
    , selection : Maybe ( Int, Int )
    }


init : String -> Editor
init editorID =
    { characterLimit = Nothing
    , clipboard = Nothing
    , content = Array.push (LineBreak defaultLineBreakRecord) Array.empty
    , ctrlDown = False
    , cursor = 0
    , cursorElement = nullElement
    , drag = NoDrag
    , editorElement = nullElement
    , editorID = editorID
    , fontSizeUnit = Nothing
    , fontStyle = emptyFontStyle
    , highlighter = Nothing
    , indentUnit = Nothing
    , lastKeyDown = -1
    , lastMouseDown = -1
    , locateBacklog = 0
    , locateNext = []
    , located = IntDict.empty
    , locating = Idle
    , pasteImageLinksAsImages = False
    , pasteLinksAsLinks = False
    , selection = Nothing
    , selectionStyle = defaultSelectionStyle
    , shiftDown = False
    , state = Edit
    , typing = False
    , undo = []
    , viewport = nullViewport
    }


init3 : String -> Maybe (Content -> Content) -> List (Attribute Msg) -> Editor
init3 editorID highlighter selectionStyle =
    let
        i =
            init editorID
    in
    { i
        | highlighter = highlighter
        , selectionStyle = selectionStyle
    }


subscriptions : Editor -> Sub Msg
subscriptions e =
    case e.state of
        Display ->
            Sub.none

        Edit ->            
            List.map (Sub.map Internal)
                [ Browser.Events.onMouseUp (Decode.succeed MouseUp)
                , Browser.Events.onKeyDown (decodeKey KeyDown)
                , Browser.Events.onKeyUp (decodeKey KeyUp)
                , Time.every 200 (\_ -> FocusOnEditor)
                ]
            |> Sub.batch

        Freeze ->
            Sub.none


update : InternalMsg -> Editor -> ( Editor, Cmd Msg )
update msg e0 =
    let
        maxIdx =
            Array.length e.content - 1

        e =
            updateUndo msg e0
    in    
    case msg of
        FocusOnEditor ->
            ( e, focusOnEditor e )

        Input timeStamp key ->            
            onInput timeStamp key e

        InputTimeStamp float ->
            if e.lastKeyDown == float then
                ( { e | typing = False }
                , Cmd.none
                )
            else
                ( e, Cmd.none )

        KeyDown key timeStamp altKey ->
            keyDown key altKey e

        KeyUp str _ _ ->
            case str of
                "Control" ->
                    ( { e | ctrlDown = False }, Cmd.none )

                "Shift" ->
                    ( { e | shiftDown = False }, Cmd.none )

                _ ->
                    ( e, Cmd.none )

        LocatedChar idx (Ok data) ->
            let
                elem =
                    data.element

                located =
                    IntDict.insert idx (ScreenElement idx elem.x elem.y elem.height) e.located

                locateBacklog =
                    e.locateBacklog - 1

                f x =
                    { x
                        | locateBacklog = locateBacklog
                        , located = located
                    }
            in
            if locateBacklog > 0 then
                ( f e, Cmd.none )
            else
                case e.locating of
                    Cursor ->
                        ( e, Cmd.none )

                    Idle ->
                        ( e, Cmd.none )

                    LineBoundary a b ->
                        lineBoundary Nothing a b (f e)

                    LineJump a b ->
                        jump a b (f e)

                    Mouse a b c ->
                        locateMouse a b c (f e)

                    Page a _ c ->
                        lineBoundary (Just a) Up c (f e)

        LocatedChar _ (Err err) ->
            ( e, Cmd.none )

        MouseDown ( x, y ) timeStamp ->
            if timeStamp - e.lastMouseDown <= 500 then
                --doubleclicked
                case e.locating of
                    Idle ->
                        ( selectCurrentWord e
                        , Cmd.none
                        )

                    Mouse a b c ->
                        ( { e | locating = Mouse SelectWord b c }
                        , Cmd.none
                        )

                    _ ->
                        mouseDown ( x, y ) timeStamp e
            else
                mouseDown ( x, y ) timeStamp e

        MouseHit idx timeStamp ->
            if timeStamp - e.lastMouseDown <= 500 && idx == e.cursor then
                ( selectCurrentWord { e | drag = NoDrag }
                , Cmd.none
                )
            else
                placeCursor2 NoScroll
                    ( { e
                        | cursor = idx
                        , drag = DragFrom idx
                        , lastMouseDown = timeStamp
                        , selection = Nothing
                      }
                    , Cmd.none
                    )

        MouseMove currentIdx timeStamp ->
            if timeStamp - e.lastMouseDown < 500 then
                --doubleclicked
                ( e, Cmd.none )
            else
                case e.drag of
                    DragFrom startIdx ->
                        let
                            ( ( beg, end ), newCursor ) =
                                if startIdx < currentIdx then
                                    ( ( startIdx, currentIdx ), min maxIdx (currentIdx + 1) )
                                else
                                    ( ( currentIdx, startIdx ), currentIdx )
                        in
                        ( { e
                            | cursor = newCursor
                            , selection = Just ( beg, end )
                          }
                        , Cmd.none
                        )

                    _ ->
                        ( e, Cmd.none )

        MouseUp ->
            ( { e
                | drag = NoDrag
                , selection =
                    case e.selection of
                        Nothing ->
                            Nothing

                        Just ( beg, end ) ->
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
            if e.state == Edit then
                case e.clipboard of
                    Nothing ->
                        pasted str e True

                    Just internalClipboard ->
                        if toText internalClipboard /= str then
                            pasted str e True
                        else
                            addContent internalClipboard e
            else
                ( e, Cmd.none )            

        PlaceCursor1_EditorViewport scroll (Ok data) ->
            ( { e | viewport = data }
            , Task.attempt
                ( Internal << PlaceCursor2_EditorElement scroll )
                ( Dom.getElement e.editorID ) 
            )

        PlaceCursor1_EditorViewport _ (Err err) ->
            ( detectFontStyle { e | locating = Idle }
            , Cmd.none 
            )

        PlaceCursor2_EditorElement scroll (Ok data) ->
            locateCursorParent { e | editorElement = data } scroll

        PlaceCursor2_EditorElement _ (Err err) ->
            ( detectFontStyle  { e | locating = Idle }
            , Cmd.none 
            )

        PlaceCursor3_CursorElement scroll (Ok data) ->
            let
                f x =
                    { x
                        | cursorElement = data
                        , locating = Idle
                    }
                    |> detectFontStyle
            in
            case scroll of
                ScrollIfNeeded ->
                    case scrollIfNeeded data e.editorElement e.viewport e.cursor e.editorID of
                        Nothing ->
                            locateNext (f e)

                        Just scrollCmd ->
                            ( e, scrollCmd )

                NoScroll ->
                    locateNext (f e)

        PlaceCursor3_CursorElement _ (Err err) ->
            ( detectFontStyle { e | locating = Idle }
            , Cmd.none 
            )

        Scrolled ->
            placeCursor NoScroll { e | locating = Idle }

        SwitchTo newState ->
            ( state newState e, Cmd.none )

        UndoAction ->
            undoAction e


updateUndo : InternalMsg -> Editor -> Editor
updateUndo msg e =
    let
        maxIdx =
            Array.length e.content - 1
    in
    case msg of
        Input timeStamp str ->
            let
                contentMod =
                    if timeStamp - e.lastKeyDown < 400 then
                        undoRefreshHead e
                    else
                        undoAddNew e

                like : String -> Editor
                like x =
                    updateUndo (Input timeStamp x) e
            in
            if String.length str /= 1 || e.ctrlDown then
                e
            else
                contentMod

        KeyDown str timeStamp altKey ->
            case str of
                "Backspace" ->
                    case e.selection of
                        Nothing ->
                            if e.cursor > 0 then
                                undoAddNew e
                            else
                                e

                        Just _ ->
                            undoAddNew e

                "Delete" ->
                    case e.selection of
                        Nothing ->
                            if e.cursor < maxIdx then
                                undoAddNew e
                            else
                                e

                        Just _ ->
                            undoAddNew e

                "Enter" ->
                    undoAddNew e

                _ ->
                    if not e.ctrlDown then
                        e
                    else
                        case str of
                            "0" ->
                                undoAddNew e

                            "1" ->
                                undoAddNew e

                            "x" ->
                                if e.selection /= Nothing then
                                    undoAddNew e
                                else
                                    e

                            "X" ->
                                updateUndo (KeyDown "x" timeStamp altKey) e

                            "v" ->
                                if e.clipboard /= Nothing then
                                    undoAddNew e

                                else
                                    e

                            "V" ->
                                updateUndo (KeyDown "v" timeStamp altKey) e

                            _ ->
                                e

        _ ->
            e


view : List (Attribute Msg) -> Editor -> Html Msg
view userDefinedStyles e =
    let
        dummy =
            Html.input
                [ Attr.type_ "text"
                , Attr.id (dummyID e.editorID)
                , Attr.autocomplete False
                , Events.on "focus" (Decode.succeed (SwitchTo Edit))
                , Events.preventDefaultOn "copy" (Decode.succeed (NoOp, True))
                , Events.preventDefaultOn "cut" (Decode.succeed (NoOp, True))
                , Events.preventDefaultOn "paste" (Decode.succeed (NoOp, True))
                , css
                    [ position fixed
                    , left (px 0)
                    , top (px 0)
                    , width (vw 99)
                    , height (vh 99)
                    , zIndex (int -75500)
                    , opacity (int 0)                        
                    ]
                ]
                []
    in
    case e.state of
        Display ->
            showContent userDefinedStyles e

        Edit ->
            Html.div
                [ ]
                [ HtmlLazy.lazy (showContent userDefinedStyles) e
                , Html.map Internal dummy
                ]

        Freeze ->
            Html.div
                []
                [ HtmlLazy.lazy (showContent userDefinedStyles) { e | typing = True }
                ]


--- === Helper functions === ---

addBreakToEnd : Content -> Content
addBreakToEnd x =
-- prevent last LineBreak from being deleted
    case Array.get (Array.length x - 1) x of
        Nothing ->
            Array.push (LineBreak defaultLineBreakRecord) Array.empty

        Just (LineBreak _) ->
            x

        Just _ ->
            Array.push (LineBreak defaultLineBreakRecord) x


addContent : Content -> Editor -> ( Editor, Cmd Msg )
addContent added e =
    case e.selection of
        Nothing ->
            placeCursor ScrollIfNeeded
                { e
                    | cursor = e.cursor + Array.length added                    
                    , content =
                        Array.slice e.cursor (Array.length e.content) e.content
                        |> Array.append added
                        |> Array.append (Array.slice 0 e.cursor e.content)
                        |> addBreakToEnd
                }

        Just ( beg, end ) ->
            placeCursor ScrollIfNeeded
                { e
                    | cursor = beg + Array.length added                    
                    , selection = Nothing
                    , content =
                        Array.slice (end+1) (Array.length e.content) e.content
                        |> Array.append added
                        |> Array.append (Array.slice 0 beg e.content)
                        |> addBreakToEnd
                }


addImage : String -> Editor -> ( Editor, Cmd Msg )
addImage src e =
    let
        imgNode =
            { emptyEmbeddedHtml |
                  attributes = [ ( "src", src ) ]                
                , nodeType = Just "img"
                , styling =
                    [ ( "object-fit", "contain" ) 
                    , ( "max-width", "100%" ) 
                    ]
            }
    in
    embed imgNode e


addText : String -> Editor -> ( Editor, Cmd Msg )
addText str e =
    typed str e False


alphaNumAt : Int -> Content -> Bool
alphaNumAt idx content =
    case Array.get idx content of
        Just (Character ch) ->
            Char.isAlphaNum ch.char || diacritical ch.char

        _ ->
            False


attributes : Element -> List (Attribute Msg)
attributes elem =
    let
        f : String -> Attribute Msg
        f x =
            Attr.class x

        g : ( String, String ) -> Attribute Msg
        g ( x, y ) =
            Attr.style x y
        
        h x =          
            List.map f (x.classes ++ x.highlightClasses)
            ++ List.map g (x.styling ++ x.highlightStyling)
    in
    case elem of
        LineBreak b ->
            h b

        Character c ->
            List.map f (c.fontStyle.classes ++ c.highlightClasses)
            ++ List.map g (c.fontStyle.styling ++ c.highlightStyling)

        EmbeddedHtml html ->
            h html


bold : Bool -> Editor -> ( Editor, Cmd Msg )
bold bool editor =
    setFontStyleTag boldStyle bool editor


boldStyle : ( String, String )
boldStyle =
    ( "font-weight", "bold" )


breakIntoParas : Content -> Paragraphs
breakIntoParas content =
    let
        f : Element -> ( Int, Paragraphs ) -> ( Int, Paragraphs )
        f elem ( idx, ys ) =
            case elem of
                LineBreak br ->
                    ( idx - 1, Paragraph idx [] br :: ys )

                _ ->
                    case ys of
                        [] ->
                            ( idx - 1, [] )

                        -- trouble if content doesn't end with a LineBreak element
                        x :: rest ->
                            ( idx - 1, { x | children = ( idx, elem ) :: x.children } :: rest )

        maxIdx =
            Array.length content - 1
    in
    Array.foldr f ( maxIdx, [] ) content
    |> Tuple.second


type alias IndexedElem =
    (Int, Element)

breakIntoWords : List IndexedElem -> List (List IndexedElem)
breakIntoWords list =
    let
        f : IndexedElem -> (List IndexedElem, List (List IndexedElem)) -> (List IndexedElem, List (List IndexedElem))
        f (idx,elem) (word,output) =
            case elem of
                -- should never occur because of BreakIntoParas
                LineBreak br ->
                    (word,output)

                EmbeddedHtml html ->
                    ([], [(idx,Character zeroWidthCharacterRecord), (idx,elem)] :: word :: output)

                Character ch ->
                    if ch.char == ' ' then
                        case List.head word of
                            Just (_, elem2) ->
                                case elem2 of
                                    Character ch2 ->
                                        if ch2.char == ' ' then
                                            ( (idx,elem) :: word, output )
                                        else
                                            ([(idx,elem)], word :: output)

                                    _ ->
                                        ([(idx,elem)], word :: output)


                            Nothing ->
                                ([(idx,elem)], output)
                    else
                        case List.head word of
                            Just (_, elem2) ->
                                case elem2 of
                                    Character ch2 ->
                                        if ch2.char == ' ' then
                                            ( [(idx,elem)], word :: output)
                                        else
                                            ((idx,elem) :: word, output)

                                    _ ->
                                        ([(idx,elem)], word :: output)

                            Nothing ->
                                ([(idx,elem)], output)

        g (x,y) =
            x :: y
    in
    List.foldr f ([],[]) list
    |> g


changeContent : (Element -> Element) -> Int -> Content -> Content
changeContent f idx content =
    case Array.get idx content of
        Nothing ->
            content

        Just elem ->
            Array.set idx (f elem) content


changeContent2 : (Element -> Element) -> Int -> Editor -> Editor
changeContent2 f idx e =
    case Array.get idx e.content of
        Nothing ->
            e

        Just elem ->
            set2 idx (f elem) e


changeElementWithId : Int -> (Element -> Element) -> Editor -> Editor
changeElementWithId idx mod e =
    case Array.get idx e.content of
        Nothing ->
            e

        Just elem ->
            { e | content = Array.set idx (mod elem) e.content }
    

changeIndent : Int -> Editor -> ( Editor, Cmd Msg )
changeIndent amount editor =
    let
        f : LineBreakRecord -> LineBreakRecord
        f x =
            { x | indent = amount + x.indent }
    in
    setPara f editor


contentChanged : Msg -> Editor -> Bool
contentChanged msg e =
    let
        maxIdx =
            Array.length e.content - 1
    in
    case msg of
        Internal (Input timeStamp str) ->
            if String.length str /= 1 then
                False
            else
                not e.ctrlDown

        Internal (KeyDown str _ _) ->            
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
                    if e.ctrlDown then
                        case str of
                            "0" ->
                                True

                            "1" ->
                                True

                            "x" ->
                                True

                            "X" ->
                                True

                            "v" ->
                                True

                            "V" ->
                                True

                            "z" ->
                                True

                            "Z" ->
                                True

                            _ ->
                                False
                    else
                        False

        Internal (Paste str) ->
            str /= "" || Maybe.map toText e.clipboard /= Just ""

        Internal UndoAction ->
            True

        _ ->
            False


copy : Editor -> ( Editor, Cmd Msg )
copy e =
    case e.selection of
        Nothing ->
            ( e, Cmd.none )

        Just ( beg, end ) ->
            let
                clipboard =
                    Array.slice beg (end + 1) e.content                    
            in
            ( { e | clipboard = Just clipboard }
            
            , ToBrowserClipboard (toText clipboard)
              |> Task.succeed
              |> Task.perform identity
            )


currentLink : Editor -> Maybe String
currentLink e =
    case linkAt e.cursor e.content of
        Just x ->
            Just x

        Nothing ->
            case e.selection of
                Just ( beg, end ) ->
                    linkAt end e.content

                Nothing ->
                    Nothing


currentLinkPos : Editor -> Maybe ( Int, Int )
currentLinkPos e =
    let
        f : String -> Int -> Int
        f href idx =
            if linkAt (idx - 1) e.content == Just href then
                f href (idx - 1)
            else
                idx

        beg : String -> Int
        beg href =
            f href e.cursor

        g : String -> Int -> Int
        g href idx =
            if linkAt (idx + 1) e.content == Just href then
                g href (idx + 1)
            else
                idx

        end : String -> Int
        end href =
            g href e.cursor
    in
    case currentLink e of
        Just href ->
            Just ( beg href, end href )

        Nothing ->
            Nothing


currentParaStyle : Editor -> LineBreakRecord
currentParaStyle editor =
    lineBreakAt editor.cursor editor.content
    |> Maybe.withDefault defaultLineBreakRecord


currentSelection : Editor -> Maybe String
currentSelection e =
    case e.selection of
        Nothing ->
            Nothing

        Just ( beg, end ) ->
            Array.slice beg end e.content
            |> toText
            |> Just


currentWord : Editor -> ( Int, Int )
currentWord e =
    let
        beg =
            previousWordBoundary e
    in
    case next nonAlphaNumAt e.cursor e.content of
        Just x ->
            ( beg, x - 1 )

        Nothing ->
            ( beg, Array.length e.content - 1 )


cursorScreenElem : Editor -> ScreenElement
cursorScreenElem e =
    { idx = e.cursor
    , x = e.cursorElement.element.x
    , y = e.cursorElement.element.y
    , height = e.cursorElement.element.height
    }


cursorHtml : Bool -> Html msg
cursorHtml typing =
    let
        blink =
            CssAnim.keyframes
                [ ( 0, [ CssAnim.opacity (int 1) ] )
                , ( 49, [ CssAnim.opacity (int 1) ] )
                , ( 50, [ CssAnim.opacity (int 0) ] )
                , ( 100, [ CssAnim.opacity (int 0) ] )
                ]

        anim =
            if not typing then
                [ animationName blink
                , animationDuration (ms (2 * tickPeriod))
                , property "animation-iteration-count" "infinite"
                ]
            else
                []

        styling =
            [ borderLeft2 (px 3) solid
            , borderColor (rgb 0 0 0)
            , boxSizing borderBox
            , height (em 1.17)
            , left (px 0)
            , position absolute
            , top (em 0.05)
            , marginRight (em -0.5)
            ]
    in
    Html.div
        [ css (styling ++ anim) ]
        []


cut : Editor -> ( Editor, Cmd Msg )
cut e =
    let
        ( copied, copyCmd ) =
            copy e
    in
    case e.selection of
        Nothing ->
            ( e, Cmd.none )

        Just ( beg, end ) ->
            let
                content =
                    Array.slice (end+1) (Array.length e.content) e.content
                    |> Array.append (Array.slice 0 beg e.content)
                    |> addBreakToEnd
            in
            placeCursor2 ScrollIfNeeded
                ( { copied
                    | content = content
                    , cursor = beg
                    , selection = Nothing
                  }
                , copyCmd
                )


decodeClipboardData : (Value -> InternalMsg) -> Decoder InternalMsg
decodeClipboardData f =
    Decode.map f
        (Decode.field "clipboardData" Decode.value)


decodeInputAndTime : (Float -> String -> msg) -> Decoder msg
decodeInputAndTime f =    
    Decode.map2 f
        (Decode.field "timeStamp" Decode.float)
        (Decode.field "data" Decode.string)


decodeKey : (String -> Float -> Bool -> InternalMsg) -> Decoder InternalMsg
decodeKey f =
    Decode.map3 f
        (Decode.field "key" Decode.string)
        (Decode.field "timeStamp" Decode.float)
        (Decode.field "altKey" Decode.bool)


decodeMouse : Decoder InternalMsg
decodeMouse =
    let
        tag x y z =
            MouseDown ( x, y ) z
    in
    Decode.map3 tag
        (Decode.field "clientX" Decode.float)
        (Decode.field "clientY" Decode.float)
        (Decode.field "timeStamp" Decode.float)                    
    

decodeTargetIdAndTime : (String -> Float -> InternalMsg) -> Decoder InternalMsg
decodeTargetIdAndTime f =
    Decode.map2 f
        (Decode.oneOf
            [ Decode.at [ "target", "id" ] Decode.string
            , Decode.succeed ""
            ]
        )
        (Decode.field "timeStamp" Decode.float)


defaultLineBreakRecord : LineBreakRecord
defaultLineBreakRecord =
    { classes = []
    , highlightClasses = []
    , highlightIndent = 0
    , highlightStyling = []
    , id = ""
    , indent = 0
    , nodeType = Nothing
    , styling = []
    , textAlign = Left
    }


defaultSelectionStyle : List (Attribute Msg)
defaultSelectionStyle =
    [ css
        [ backgroundColor (hsl 217 0.71 0.53)
        , color (hsl 0 0 1)
        ]
    ]


delete : Int -> Int -> Editor -> Content
delete beg end e =
    Array.slice end (Array.length e.content) e.content
    |> Array.append (Array.slice 0 beg e.content)
    |> addBreakToEnd


diacritical : Char -> Bool
diacritical char =
    List.member char
        [ 'À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ'
        , 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í'
        , 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô'
        , 'Õ', 'Ö', 'Ø', 'Ù', 'Ú', 'Û', 'Ü'
        , 'Ý', 'Þ', 'ß', 'à', 'á', 'â', 'ã'
        , 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê'
        , 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ñ'
        , 'ò', 'ó', 'ô', 'õ', 'ö', 'ø', 'ù'
        , 'ú', 'û', 'ü', 'ý', 'þ', 'ÿ', 'Ő'
        , 'ő', 'Ű', 'ű'
        ]


detectFontStyle : Editor -> Editor
detectFontStyle e =
    case Array.get (e.cursor - 1) e.content of
        Just (Character c) ->
            { e | fontStyle = c.fontStyle }

        _ ->
            e


detectFontStyleAt : Int -> Editor -> MiniRte.Types.FontStyle
detectFontStyleAt idx e =
    if e.fontStyle == emptyFontStyle then
        case Array.get idx e.content of
            Just (Character ch) ->        
                ch.fontStyle

            _ ->
                emptyFontStyle
    else
        e.fontStyle


embed : EmbeddedHtmlRecord -> Editor -> ( Editor, Cmd Msg )
embed html e =    
    placeCursor NoScroll
        { e
            | content =
                Array.slice 0 e.cursor e.content
                |> Array.push (EmbeddedHtml html)
                |> \x -> Array.append x (Array.slice e.cursor (Array.length e.content) e.content)
                |> addBreakToEnd

            , cursor = e.cursor + 1
        }


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


focusOnEditor : Editor -> Cmd Msg
focusOnEditor e =
    Dom.focus (dummyID e.editorID)
    |> Task.attempt (\_ -> Internal NoOp)


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


insertBreak : LineBreakRecord -> Maybe Float -> Editor -> Editor
insertBreak br maybeTimeStamp editor0 =
    let
        e =
            case maybeTimeStamp of
                Just timeStamp ->
                    { editor0 | lastKeyDown = timeStamp }

                Nothing ->
                    editor0
    in
    case e.selection of
        Nothing ->
            { e
                | cursor = e.cursor + 1
                , content =                    
                    Array.slice 0 e.cursor e.content
                    |> Array.push (LineBreak br)
                    |> \x -> Array.append x (Array.slice e.cursor (Array.length e.content) e.content)
            }

        Just ( beg, end ) ->
            { e
                | cursor = beg + 1
                , selection = Nothing
                , content =
                    Array.slice 0 beg e.content
                    |> Array.push (LineBreak br)
                    |> \x -> Array.append x (Array.slice (end+1) (Array.length e.content) e.content)
            }


is : ( String, String ) -> Editor -> Bool
is attr e =
    isAt attr e (e.cursor - 1)
    |> Maybe.withDefault False


isAt : ( String, String ) -> Editor -> Int -> Maybe Bool
isAt attr e idx =
    case Array.get idx e.content of
        Just (Character c) ->
            Just (List.member attr c.fontStyle.styling)

        _ ->
            Nothing


isBreak : Int -> Content -> Bool
isBreak idx content =
    case Array.get idx content of
        Just (LineBreak _) ->
            True

        _ ->
            False


isBold : Editor -> Bool
isBold editor =
    is boldStyle editor


isItalic : Editor -> Bool
isItalic editor =
    is italicStyle editor


type IsLink =
      NotLink
    | IsImageLink String
    | IsLinkButNotImage String
    | IsImageDataLink

isLink : String -> IsLink
isLink str =
    let
        strip x y =
            if String.startsWith x y then
                Err (String.dropLeft (String.length x) y)
            else
                Ok y

        stripped =
            strip "http://" str
            |> Result.andThen (strip "https://")

        imageExtensions =
            [ ".jpeg"
            , ".jpg"
            , ".gif"
            , ".png"
            , ".apng"
            , ".svg"
            , ".bmp"
            , ".ico"
            ]

        isImage x =
            imageExtensions
            |> List.foldl (\a b -> b || String.endsWith a x) False
                
    in
    case stripped of
        Ok _ ->
            if String.startsWith "data:image/" str then
                IsImageDataLink
            else
                NotLink

        Err x ->
            if isImage x then
                IsImageLink x
            else
                IsLinkButNotImage x


isSelection : ( String, String ) -> Editor -> Bool
isSelection attr e =
    case e.selection of
        Nothing ->
            True

        Just ( beg, end ) ->
            List.map (isAt attr e) (List.range beg end)
            |> List.member (Just False)
            |> not                    


isStrikeThrough : Editor -> Bool
isStrikeThrough editor =
    is strikeThroughStyle editor


isUnderline : Editor -> Bool
isUnderline editor =
    is underlineStyle editor


italic : Bool -> Editor -> ( Editor, Cmd Msg )
italic bool editor =
    setFontStyleTag italicStyle bool editor


italicStyle : ( String, String )
italicStyle =
    ( "font-style", "italic" )


jump : Vertical -> ( Int, Int ) -> Editor -> ( Editor, Cmd Msg )
jump direction ( beg, end ) e =
    let
        isRelevant : ScreenElement -> ScreenElement -> Bool
        isRelevant cursor elem =
            case direction of
                Down ->
                    elem.y > cursor.y && not (onSameLine elem cursor)

                Up ->
                    elem.y < cursor.y && not (onSameLine elem cursor)

        maxIdx =
            Array.length e.content - 1

        g : Int -> Editor -> ( Editor, Cmd Msg )
        g idx x =
            { x
                | cursor = idx
                , located = IntDict.empty
                , locating = Idle
            }
            |> selectionMod e.cursor
            |> placeCursor ScrollIfNeeded

        fail x =
            placeCursor ScrollIfNeeded
                { x
                    | located = IntDict.empty
                    , locating = Idle
                }
    in
    case jumpHelp isRelevant direction ( beg, end ) e of
        ( Nothing, Nothing ) ->
            if beg == 0 then
                g 0 e
            else if end == maxIdx then
                g maxIdx e
            else
                fail e

        ( _, Just idx ) ->
            g idx e

        ( Just x, Nothing ) ->
            locateChars e (Just x) (LineJump direction)


jumpHelp : (ScreenElement -> ScreenElement -> Bool) -> Vertical -> ( Int, Int ) -> Editor -> ( Maybe ( Int, Vertical ), Maybe Int )
jumpHelp isRelevant direction ( beg, end ) e =
    let
        maxIdx =
            Array.length e.content - 1

        cursor =
            IntDict.get e.cursor e.located
            |> Maybe.withDefault nullScreenElement
            --locateChars guarantees that this is not used

        better : ScreenElement -> ScreenElement -> Bool
        better a b =
            abs (a.x - cursor.x) < abs (b.x - cursor.x)

        last : ScreenElement -> Bool
        last x =
            case direction of
                Down ->
                    x.idx == maxIdx

                Up ->
                    x.idx == 0

        f : Int -> ScreenElement -> ( Maybe ScreenElement, Maybe ScreenElement ) -> ( Maybe ScreenElement, Maybe ScreenElement )
        f _ new ( candidate, winner ) =
            if not (isRelevant cursor new) then
                ( candidate, winner )
            else
                case winner of
                    Just _ ->
                        ( Nothing, winner )

                    Nothing ->
                        case candidate of
                            Nothing ->
                                if last new then
                                    ( Nothing, Just new )
                                else
                                    ( Just new, Nothing )

                            Just old ->
                                if not (onSameLine old new) then
                                    ( Nothing, Just old )
                                else if better old new then
                                    ( Nothing, Just old )
                                else if last new then
                                    ( Nothing, Just new )
                                else
                                    ( Just new, Nothing )

        fold =
            case direction of
                Down ->
                    IntDict.foldl

                Up ->
                    IntDict.foldr
    in
    case fold f ( Nothing, Nothing ) e.located of
        ( _, Just winner ) ->
            ( Nothing, Just winner.idx )

        ( _, Nothing ) ->
            case direction of
                Down ->
                    if end >= maxIdx then
                        ( Nothing, Nothing )
                    else
                        ( Just ( end - 1, Down ), Nothing )

                Up ->
                    if beg <= 0 then
                        ( Nothing, Nothing )
                    else
                        ( Just ( beg + 1, Up ), Nothing )


keyDown : String -> Bool -> Editor -> ( Editor, Cmd Msg )
keyDown str altKey e =
    let
        maxIdx =
            Array.length e.content - 1
    in
    case str of
        "ArrowDown" ->
            if e.cursor >= maxIdx then
                ( e, Cmd.none )
            else
                locateChars e Nothing (LineJump Down)

        "ArrowLeft" ->
            if e.cursor < 1 then
                if not e.shiftDown then
                    ( { e
                        | cursor = 0
                        , selection = Nothing
                      }
                    , Cmd.none
                    )
                else
                    ( e, Cmd.none )

            else if e.ctrlDown then
                let
                    newCursor =
                        previousWordBoundary e
                in
                { e | cursor = newCursor }
                |> selectionMod e.cursor 
                |> placeCursor ScrollIfNeeded

            else
                let
                    f x =
                        max 0 x

                    newCursor =
                        if e.shiftDown then
                            f (e.cursor - 1)
                        else
                            case e.selection of
                                Nothing ->
                                    f (e.cursor - 1)

                                Just ( beg, _ ) ->
                                    beg
                in
                { e | cursor = newCursor }
                |> selectionMod e.cursor 
                |> placeCursor ScrollIfNeeded

        "ArrowRight" ->
            if e.cursor >= maxIdx then
                ( { e | cursor = maxIdx, selection = Nothing }, Cmd.none )

            else if not e.shiftDown && e.selection == Just ( 0, maxIdx ) then
                { e
                    | cursor = maxIdx
                    , selection = Nothing
                }
                |> placeCursor ScrollIfNeeded

            else if e.ctrlDown then
                let
                    newCursor =
                        nextWordBoundary e
                in
                { e | cursor = newCursor }
                |> selectionMod e.cursor
                |> placeCursor ScrollIfNeeded

            else
                let
                    f x =
                        min x maxIdx

                    newCursor =
                        if e.shiftDown then
                            f (e.cursor + 1)
                        else
                            case e.selection of
                                Nothing ->
                                    f (e.cursor + 1)

                                Just ( _, end ) ->
                                    f (end + 1)
                in
                { e | cursor = newCursor }
                |> selectionMod e.cursor 
                |> placeCursor ScrollIfNeeded

        "ArrowUp" ->
            if e.cursor == 0 then
                ( e, Cmd.none )
            else
                locateChars e Nothing (LineJump Up)

        "Backspace" ->
            case e.selection of
                Nothing ->
                    if e.cursor > 0 then
                        { e
                            | cursor = e.cursor - 1
                            , content =                                        
                                Array.slice e.cursor (Array.length e.content) e.content
                                |> Array.append (Array.slice 0 (e.cursor - 1) e.content)
                                |> addBreakToEnd
                        }
                        |> placeCursor ScrollIfNeeded
                    else
                        ( e, Cmd.none )

                Just ( beg, end ) ->
                    { e
                        | cursor = beg
                        , selection = Nothing
                        , content =                                    
                             Array.slice (end + 1) (Array.length e.content) e.content
                            |> Array.append (Array.slice 0 beg e.content)
                            |> addBreakToEnd
                    }
                    |> placeCursor ScrollIfNeeded

        "Control" ->
            ( { e | ctrlDown = True }, Cmd.none )

        "Delete" ->
            case e.selection of
                Nothing ->
                    if e.cursor < maxIdx then
                        { e | content = delete e.cursor (e.cursor + 1) e }
                        |> placeCursor ScrollIfNeeded
                    else
                        ( e, Cmd.none )

                Just ( beg, end ) ->
                    { e
                        | content = delete beg (end + 1) e
                        , cursor = beg
                        , selection = Nothing
                    }
                    |> placeCursor ScrollIfNeeded

        "End" ->
            if e.ctrlDown then
                { e | cursor = maxIdx }
                |> selectionMod e.cursor 
                |> placeCursor ScrollIfNeeded

            else if e.shiftDown then
                locateChars e Nothing (LineBoundary Down)

            else
                locateChars { e | selection = Nothing } Nothing (LineBoundary Down)

        "Enter" ->
            if e.shiftDown then
                keyDown "\n" altKey e
            else
                insertBreak (currentParaStyle e) Nothing e
                |> placeCursor ScrollIfNeeded

        "Home" ->
            if e.ctrlDown then
                { e | cursor = 0 }
                |> selectionMod e.cursor 
                |> placeCursor ScrollIfNeeded

            else if e.shiftDown then
                locateChars e Nothing (LineBoundary Up)

            else
                locateChars { e | selection = Nothing } Nothing (LineBoundary Up)

        "PageDown" ->
            if e.cursor == maxIdx then
                ( e, Cmd.none )
            else
                let
                    pageSize =
                        toFloat maxIdx
                            * e.viewport.viewport.height
                            / e.viewport.scene.height
                        |> Basics.round
                in
                locateChars e Nothing (Page (min maxIdx (e.cursor + pageSize)) Down)

        "PageUp" ->
            if e.cursor == 0 then
                ( e, Cmd.none )

            else
                let
                    pageSize =
                        toFloat maxIdx
                            * e.viewport.viewport.height
                            / e.viewport.scene.height
                        |> Basics.round
                in
                locateChars e Nothing (Page (max 0 (e.cursor - pageSize)) Up)

        "Shift" ->
            ( { e | shiftDown = True }, Cmd.none )

        _ ->
            case e.ctrlDown of
                False ->
                    if not altKey && String.length str == 1 then
                        typed str e False
                    else
                        ( e, Cmd.none )

                True ->
                    let
                        like x =
                            keyDown x altKey e
                    in
                    case str of
                        "0" ->
                            typed "–" e False

                        -- en dash
                        "1" ->
                            typed "—" e False

                        -- em dash
                        "a" ->
                            ( { e
                                | selection = Just ( 0, maxIdx )
                              }
                            , Cmd.none
                            )

                        "A" ->
                            like "a"

                        "c" ->
                            copy e

                        "C" ->
                            like "c"

                        "x" ->
                            cut e

                        "X" ->
                            like "x"

                        "z" ->
                            ( e, Task.perform identity (Task.succeed (Internal UndoAction)) )

                        "Z" ->
                            like "z"

                        _ ->
                            ( e, Cmd.none )



lineBoundary : Maybe Int -> Vertical -> ( Int, Int ) -> Editor -> ( Editor, Cmd Msg )
lineBoundary maybeIdx direction ( beg, end ) e =
    let
        maxIdx =
            Array.length e.content - 1

        last : ScreenElement -> Bool
        last x =
            case direction of
                Down ->
                    x.idx == maxIdx

                Up ->
                    x.idx == 0

        cursorIdx =
            Maybe.withDefault e.cursor maybeIdx

        cursor =
            IntDict.get cursorIdx e.located
            |> Maybe.withDefault nullScreenElement
            --locateChars guarantees that this is not used

        f : Int -> ScreenElement -> ( Maybe ScreenElement, Maybe ScreenElement ) -> ( Maybe ScreenElement, Maybe ScreenElement )
        f _ a ( candidate, winner ) =
            case winner of
                Just _ ->
                    ( Nothing, winner )

                Nothing ->
                    if not (onSameLine a cursor) then
                        ( Nothing, candidate )

                    else if last a then
                        ( Nothing, Just a )

                    else
                        ( Just a, Nothing )

        fold =
            case direction of
                Down ->
                    IntDict.foldl

                Up ->
                    IntDict.foldr
    in
    case fold f ( Nothing, Nothing ) e.located of
        ( _, Just a ) ->
            { e
                | cursor = a.idx
                , located = IntDict.empty
                , locating = Idle
            }
            |> selectionMod e.cursor
            |> placeCursor ScrollIfNeeded

        ( Just _, _ ) ->
            case direction of
                Down ->
                    locateChars e (Just ( end - 1, Down )) (LineBoundary Down)

                Up ->
                    locateChars e (Just ( beg + 1, Up )) (LineBoundary Up)

        ( Nothing, Nothing ) ->
            ( { e
                | located = IntDict.empty
                , locating = Idle
              }
            , Cmd.none
            )


lineBreakAt : Int -> Content -> Maybe LineBreakRecord
lineBreakAt idx content =
    case nextBreakFrom idx content of
        Just ( _, lineBreak ) ->
            Just lineBreak

        Nothing ->
            Nothing


link : String -> Editor -> Editor
link href e =
    let
        f : Element -> Element
        f elem =
            case elem of
                Character ch ->
                    Character { ch | link = Just href }

                _ ->
                    elem

        g : Int -> Editor -> Editor
        g idx x =
            changeContent2 f idx x

        h : Int -> Int -> Editor
        h beg end =
            List.foldl g e (List.range beg end)
    in
    case e.selection of
        Nothing ->
            linkMod f e

        Just ( beg, end ) ->
            h beg end


linkAt : Int -> Content -> Maybe String
linkAt idx content =
    case Array.get idx content of
        Just (Character ch) ->
            ch.link

        _ ->
            Nothing


linkMod : (Element -> Element) -> Editor -> Editor
linkMod f editor =
    case currentLinkPos editor of
        Nothing ->
            editor

        Just ( beg, end ) ->
            List.foldl (changeContent2 f) editor (List.range beg end)


loadContent : Content -> Editor -> Editor
loadContent raw e =
    let
        i =
            init3 e.editorID e.highlighter e.selectionStyle
    in
    undoAddNew
        { i 
            | content = addBreakToEnd raw
            , state = Edit 
        }


loadText : String -> Editor -> Editor
loadText txt editor =
    let
        shell =
            init3 editor.editorID editor.highlighter editor.selectionStyle
    in
    undoAddNew
        { shell 
            | state = Edit 
            , content = textToContent txt |> addBreakToEnd
        }


locateCmd : Int -> String -> Cmd Msg
locateCmd idx id =
    Dom.getElement id
    |> Task.attempt (Internal << LocatedChar idx)


locateChars : Editor -> Maybe ( Int, Vertical ) -> (( Int, Int ) -> Locating) -> ( Editor, Cmd Msg )
locateChars e maybeLimit func =
    if e.locating /= Idle && maybeLimit == Nothing then
        ( { e | locateNext = e.locateNext ++ [ func ] }, Cmd.none )

    else
        let
            limit =
                case maybeLimit of
                    Nothing ->
                        e.cursor

                    Just ( x, _ ) ->
                        x

            ( a, b ) =
                case func ( 0, 0 ) of
                    Cursor ->
                        ( 0, -1 )

                    --should never happen
                    Idle ->
                        ( 0, -1 )

                    --should never happen
                    LineBoundary Down _ ->
                        ( limit, limit + 100 )

                    LineBoundary Up _ ->
                        ( limit - 100, limit )

                    LineJump Down _ ->
                        ( limit, limit + 150 )

                    LineJump Up _ ->
                        ( limit - 150, limit )

                    Mouse select mousePos _ ->
                        case maybeLimit of
                            Just ( x, Down ) ->
                                ( x, x + 500 )

                            Just ( x, Up ) ->
                                ( x - 500, x )

                            Nothing ->
                                let
                                    guess =
                                        mouseDownGuess mousePos e
                                in
                                ( guess - 500, guess + 500 )

                    Page guess _ _ ->
                        case maybeLimit of
                            Nothing ->
                                ( guess - 100, guess + 100 )

                            Just ( x, Up ) ->
                                ( x - 100, guess )

                            Just ( x, Down ) ->
                                ( guess, x + 100 )

            maxIdx =
                Array.length e.content - 1

            ( beg, end ) =
                ( max 0 a, min maxIdx b )

            cmd : Int -> List (Cmd Msg) -> List (Cmd Msg)
            cmd idx xs =
                locateCmd idx (e.editorID ++ String.fromInt idx) :: xs

            range =
                if e.cursor < beg || e.cursor > end then
                    e.cursor :: List.range beg end
                else
                    List.range beg end

            cmds : List (Cmd Msg)
            cmds =
                List.foldr cmd [] range
        in
        ( { e
            | locateBacklog = List.length cmds
            , located = IntDict.empty
            , locating =
                if List.length cmds == 0 then
                    Idle
                else
                    func ( beg, end )
          }
        , Cmd.batch cmds
        )


locateCursorParent : Editor -> ScrollMode -> ( Editor, Cmd Msg )
locateCursorParent e scroll =
    case Array.get e.cursor e.content of
        Just _ ->
            ( e
            , e.editorID ++ String.fromInt e.cursor
              |> Dom.getElement
              |> Task.attempt (Internal << PlaceCursor3_CursorElement scroll)
            )

        Nothing ->
            ( e, Cmd.none )


locateMoreChars : Editor -> ( Int, Int ) -> (( Int, Int ) -> Locating) -> List ( Int, Int ) -> ( Editor, Cmd Msg )
locateMoreChars e ( a, b ) func newRegions =
    let
        maxIdx =
            Array.length e.content - 1

        normalize ( x, y ) =
            ( max 0 x, min maxIdx y )

        ( beg, end ) =
            normalize ( a, b )

        cmd : Int -> List (Cmd Msg) -> List (Cmd Msg)
        cmd idx xs =
            locateCmd idx (e.editorID ++ String.fromInt idx) :: xs

        toList ( x, y ) =
            List.range x y

        idxs =
            List.concat (List.map toList (List.map normalize newRegions))

        cmds : List (Cmd Msg)
        cmds =
            List.foldr cmd [] idxs
    in
    case idxs of
        [] ->
            ( { e
                | locateBacklog = 0
                , located = IntDict.empty
                , locating = Idle
              }
            , Cmd.none
            )

        xs ->
            ( { e
                | locateBacklog = List.length cmds
                , locating = func ( beg, end )
              }
            , Cmd.batch cmds
            )


locateMouse : Select -> ( Float, Float ) -> ( Int, Int ) -> Editor -> ( Editor, Cmd Msg )
locateMouse s ( mouseX, mouseY ) ( beg, end ) e =
    let
        maxIdx =
            Array.length e.content - 1

        diff : ScreenElement -> Float
        diff a =
            a.y - mouseY

        flips : ScreenElement -> ScreenElement -> Bool
        flips a b =
            -- a is below the mouse pos, b is at the same level or above
            -- note that this refers to the top of the character
            diff a > 0 && diff b <= 0

        f : Int -> ScreenElement -> MouseLocator -> MouseLocator
        f _ new m =
            case m.winner of
                Just _ ->
                    m

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
                Just _ ->
                    x

                Nothing ->
                    if b.idx > a.idx then
                        Nothing

                    else if not (onSameLine a b) then
                        Just (b.idx + 1)

                    else if b.idx == 0 then
                        Just 0

                    else
                        Nothing

        getBounds : ScreenElement -> Maybe ( Int, Int )
        getBounds a =
            -- get the indices of the beginning and end of the line that ends with a
            case IntDict.foldr (g a) Nothing e.located of
                Just begIdx ->
                    Just ( begIdx, a.idx )

                Nothing ->
                    Nothing

        targetLine : Maybe ( Int, Int )
        targetLine =
            -- get the beg and end index of the line where the mouse was clicked
            case mouseLocator.winner of
                Nothing ->
                    Nothing

                Just pos ->
                    getBounds pos

        fail x =
            ( { x
                | locateBacklog = 0
                , located = IntDict.empty
                , locating = Idle
              }
            , Cmd.none
            )

        continue x =
            if beg <= 0 && end >= maxIdx then
                fail x
            else
                case IntDict.get beg e.located of
                    Nothing ->
                        fail x

                    Just begElem ->
                        let
                            jumpSize =
                                500
                        in
                        locateMoreChars
                            x
                            ( beg - jumpSize, end + jumpSize )
                            (Mouse s ( mouseX, mouseY ))
                            [ ( beg - jumpSize, beg - 1 )
                            , ( end + 1, end + jumpSize )
                            ]
    in
    case targetLine of
        Nothing ->
            continue e

        Just ( lineBeg, lineEnd ) ->
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
                                if better new a then
                                    Just new
                                else
                                    Just a

                maybeSelectWord : ( Editor, Cmd Msg ) -> ( Editor, Cmd Msg )
                maybeSelectWord ( a, b ) =
                    case s of
                        SelectNone ->
                            ( a, b )

                        SelectWord ->
                            ( selectCurrentWord a, b )
            in
            case IntDict.foldl h Nothing e.located of
                Just closest ->
                    { e
                        | cursor = closest.idx
                        , located = IntDict.empty
                        , locating = Idle
                        , drag =
                            if e.drag == DragInit then
                                DragFrom closest.idx
                            else
                                e.drag
                    }
                    |> placeCursor NoScroll
                    |> maybeSelectWord 

                Nothing ->
                    continue e


locateNext : Editor -> ( Editor, Cmd Msg )
locateNext e =
    case e.locateNext of
        func :: rest ->
            locateChars { e | locateNext = rest } Nothing func

        _ ->
            ( e, Cmd.none )


mouseDown : ( Float, Float ) -> Float -> Editor -> ( Editor, Cmd Msg )
mouseDown ( mouseX, mouseY ) timeStamp e =
    let
        f x y =
            { x
                | drag = y
                , lastMouseDown = timeStamp
            }
    in
    locateChars (f { e | selection = Nothing } DragInit) Nothing (Mouse SelectNone ( mouseX, mouseY ))


mouseDownGuess : ( Float, Float ) -> Editor -> Int
mouseDownGuess ( mouseX, mouseY ) e =
    let
        cursorIdx =
            e.cursor

        maxIdx =
            Array.length e.content - 1

        pageSizeGuess =
            toFloat maxIdx * e.viewport.viewport.height / e.viewport.scene.height
    in
    cursorIdx + Basics.round ((mouseY - e.cursorElement.element.y) / pageSizeGuess)


next : (Int -> Content -> Bool) -> Int -> Content -> Maybe Int
next f idx content =
    let
        g : Element -> (Int, Maybe Int) -> (Int, Maybe Int)
        g _ (x,y) =
            case y of
                Just _ ->
                    (x,y)

                Nothing ->
                    if f x content then
                        (x, Just x)
                    else
                        (x+1, Nothing)
    in
    Array.slice (idx+1) (Array.length content) content
    |> Array.foldl g (idx+1, Nothing)
    |> Tuple.second


nextBreak : Editor -> Maybe ( Int, LineBreakRecord )
nextBreak editor =
    nextBreakFrom editor.cursor editor.content


nextBreakFrom : Int -> Content -> Maybe ( Int, LineBreakRecord )
nextBreakFrom begIdx content =
    let
        maxIdx =
            Array.length content - 1

        f : Int -> Maybe ( Int, LineBreakRecord ) -> Maybe ( Int, LineBreakRecord )
        f idx result =
            case result of
                Just _ ->
                    result

                Nothing ->
                    case Array.get idx content of
                        Just (LineBreak br) ->
                            Just ( idx, br )

                        _ ->
                            Nothing
    in
    List.range begIdx maxIdx
    |> List.foldl f Nothing


nextWordBoundary : Editor -> Int
nextWordBoundary e =
    let
        f x =
            next nonAlphaNumAt x.cursor x.content
            |> Maybe.withDefault (Array.length e.content - 1)                

        g x =
            { x | cursor = f x }
    in
    if alphaNumAt (e.cursor - 1) e.content then
        f e
    else
        f (g e)


nonAlphaNumAt : Int -> Content -> Bool
nonAlphaNumAt idx content =
    not (alphaNumAt idx content)


nullBox =
    { x = 0
    , y = 0
    , height = 0
    , width = 0
    }


nullElement =
    { scene =
        { width = 0
        , height = 0
        }
    , viewport = nullBox
    , element = nullBox
    }


nullScreenElement =
    { x = 0
    , y = 0
    , height = 0
    , idx = -1
    }


nullViewport =
    { scene =
        { width = 0
        , height = 0
        }
    , viewport = nullBox
    }


onInput : Float -> String -> Editor -> ( Editor, Cmd Msg )
onInput timeStamp str e =
    let
        timeStampCmd =
            Process.sleep tickPeriod
            |> Task.perform (\_ -> Internal (InputTimeStamp timeStamp))

        f ( x, y ) =
            ( { x
                | lastKeyDown = timeStamp
                , typing = True
              }
            , Cmd.batch [ timeStampCmd, y ]
            )
    in
    f (onInputHelp timeStamp str e)


onInputHelp : Float -> String -> Editor -> ( Editor, Cmd Msg )
onInputHelp timeStamp str e =
    let
        like : String -> ( Editor, Cmd Msg )
        like x =
            update (Input timeStamp x) e

        maxIdx =
            Array.length e.content - 1
    in
    if String.length str /= 1 then
        ( e, Cmd.none )
    else
        if not e.ctrlDown then
            typed str e False
        else
            ( e, Cmd.none )


onSameLine : ScreenElement -> ScreenElement -> Bool
onSameLine a b =
    a.y == b.y
    ||
        a.y <= b.y
        &&
        a.y + a.height >= b.y + b.height
    ||
        b.y <= a.y
        &&
        b.y + b.height >= a.y + a.height


paraClassAdd : String -> LineBreakRecord -> LineBreakRecord
paraClassAdd className br =
    let
        filtered : List String -> List String
        filtered xs =
            List.filter (\x -> not (x == className)) xs
    in
    { br | classes = className :: filtered br.classes }


paraClassRemove : String -> LineBreakRecord -> LineBreakRecord
paraClassRemove className br =
    let
        filtered : List String -> List String
        filtered xs =
            List.filter (\x -> not (x == className)) xs
    in
    { br
        | classes = filtered br.classes
        , highlightClasses = filtered br.highlightClasses
    }


parasInSelection : Editor -> List ( Int, LineBreakRecord )
parasInSelection e =
    let
        f : Element -> ( Int, List ( Int, LineBreakRecord ) ) -> ( Int, List ( Int, LineBreakRecord ) )
        f x ( y, zs ) =
            case x of
                LineBreak br ->
                    ( y + 1, ( y, br ) :: zs )

                _ ->
                    ( y + 1, zs )

        g : ( Int, Int ) -> Content -> List ( Int, LineBreakRecord )
        g ( beg, end ) x =            
            Array.slice beg (end+1) e.content
            |> Array.foldl f ( beg, [] )
            |> Tuple.second
                
    in
    case e.selection of
        Nothing ->
            case nextBreakFrom e.cursor e.content of
                Just x ->
                    [ x ]

                Nothing ->
                    []

        Just ( beg, end ) ->
            case nextBreakFrom end e.content of
                Just x ->
                    x :: g ( beg, end ) e.content

                Nothing ->
                    g ( beg, end ) e.content


pasted : String -> Editor -> Bool -> ( Editor, Cmd Msg )
pasted txt e modifyClipboard =
    let
        default =
            typed txt e modifyClipboard

        linked strippedPrefix =
            typed_ (Just txt) strippedPrefix e modifyClipboard
    in
    case isLink txt of
        NotLink ->
            default

        IsImageDataLink ->
            if e.pasteImageLinksAsImages then
                addImage txt e
            else
                default

        IsImageLink strippedPrefix ->
            if e.pasteImageLinksAsImages then
                addImage txt e
            else
                if e.pasteLinksAsLinks then
                    linked strippedPrefix
                else
                    default

        IsLinkButNotImage strippedPrefix ->
            if e.pasteLinksAsLinks then
                linked strippedPrefix
            else
                default


placeCursor : ScrollMode -> Editor -> ( Editor, Cmd Msg )
placeCursor scroll e =
    ( { e | locateBacklog = 0, locating = Cursor }
    , placeCursorCmd scroll e.editorID
    )


placeCursor2 : ScrollMode -> ( Editor, Cmd Msg ) -> ( Editor, Cmd Msg )
placeCursor2 scroll ( e, cmd ) =
    ( { e | locateBacklog = 0, locating = Cursor }
    , Cmd.batch
        [ placeCursorCmd scroll e.editorID
        , cmd
        ]
    )


placeCursorCmd : ScrollMode -> String -> Cmd Msg
placeCursorCmd scroll editorID =
    Dom.getViewportOf editorID
    |> Task.attempt (Internal << PlaceCursor1_EditorViewport scroll)


previous : (Int -> Content -> Bool) -> Int -> Content -> Maybe Int
previous f idx content =
    let
        g : Int -> Maybe Int -> Maybe Int
        g x y =
            case y of
                Just _ ->
                    y

                Nothing ->
                    if f x content then
                        Just x
                    else
                        Nothing

        idxs =
            List.range 0 (idx - 1)
    in
    List.foldr g Nothing idxs


previousLineBreak : Int -> Content -> Int
previousLineBreak idx content =
    previous isBreak idx content
    |> Maybe.withDefault 0


previousWordBoundary : Editor -> Int
previousWordBoundary e =
    let
        f x =
            previous nonAlphaNumAt x.cursor x.content
            |> Maybe.map (\a -> a + 1)
            |> Maybe.withDefault 0                    

        g x =
            previous alphaNumAt x.cursor x.content
            |> Maybe.map (\a -> a + 1)
            |> Maybe.withDefault 0

        h x =
            { x | cursor = g x }
    in
    if alphaNumAt (e.cursor - 1) e.content then
        f e
    else
        f (h e)


replaceLink : String -> Editor -> Editor
replaceLink href editor =
    let
        f : Element -> Element
        f elem =
            case elem of
                Character ch ->
                    Character { ch | link = Just href }

                _ ->
                    elem
    in
    linkMod f editor


replaceText : String -> Editor -> Editor
replaceText txt editor =
    { editor | state = Edit, content = textToContent txt }


restore : Undo -> Editor -> Editor
restore x editor =
    { editor
        | content = x.content
        , cursor = x.cursor
        , fontStyle = x.fontStyle
        , selection = x.selection
    }


scrollIfNeeded : Dom.Element -> Dom.Element -> Dom.Viewport -> Int -> String -> Maybe (Cmd Msg)
scrollIfNeeded cursorData editorData viewportData cursorIdx editorID =
    let
        cursor =
            cursorData.element

        editor =
            editorData.element

        viewport =
            viewportData.viewport

        scrollTo y =
            Dom.setViewportOf editorID 0 y
            |> Task.attempt (\_ -> Internal Scrolled)                
    in
    if cursor.y + cursor.height > editor.y + editor.height then
        scrollTo (viewport.y + cursor.y + cursor.height - editor.y - editor.height)
        |> Just

    else if cursor.y < editor.y then
        scrollTo (viewport.y + cursor.y - editor.y)
        |> Just

    else
        Nothing


selectCurrentWord : Editor -> Editor
selectCurrentWord editor =
    let
        ( beg, end ) =
            currentWord editor
    in
    { editor
        | cursor = min (end + 1) (Array.length editor.content - 1)
        , selection = Just ( beg, end )
    }


selectionMod : Int -> Editor -> Editor
selectionMod oldCursor new =
    let
        newCursor =
            new.cursor

        selection =
            case new.selection of
                Just ( beg, end ) ->
                    if newCursor < beg then
                        Just ( newCursor, end )

                    else if newCursor > end then
                        Just ( beg, newCursor - 1 )

                    else if oldCursor == beg then
                        Just ( newCursor, end )

                    else
                        Just ( beg, newCursor - 1 )

                Nothing ->
                    if newCursor < oldCursor then
                        Just ( newCursor, oldCursor - 1 )

                    else if newCursor > oldCursor then
                        Just ( oldCursor, newCursor - 1 )

                    else
                        Nothing
    in
    if new.shiftDown then
        { new | selection = selection }
    else
        { new | selection = Nothing }


selectRange : (Int,Int) -> Editor -> ( Editor, Cmd Msg )
selectRange (x,y) e =
    let
        beg =
            max 0 x

        end =
            min (Array.length e.content - 2) y
    in
    { e | cursor = end + 1, selection = Just (beg,end) }
    |> placeCursor ScrollIfNeeded


set2 : Int -> Element -> Editor -> Editor
set2 idx elem editor =
    { editor
        | content = Array.set idx elem editor.content
    }


setFontStyle : (MiniRte.Types.FontStyle -> MiniRte.Types.FontStyle) -> Editor -> ( Editor, Cmd Msg )
setFontStyle mod e =
    let
        f : Element -> Element
        f elem =
            case elem of
                Character c ->
                    Character { c | fontStyle = mod c.fontStyle }

                _ ->
                    elem

        g : Int -> Content -> Content
        g idx content =
            case Array.get idx content of
                Just elem ->
                    Array.set idx (f elem) content

                Nothing ->
                    content

        h : ( Int, Int ) -> Content -> Content
        h ( beg, end ) content =
            List.foldl g content (List.range beg end)

        i : ( Int, Int ) -> Editor -> Editor
        i ( beg, end ) x =
            { x | content = h ( beg, end ) x.content }

        j : Editor -> Editor
        j x =
            { x | fontStyle = mod e.fontStyle }
    in
    case e.selection of
        Nothing ->
            ( j e, Cmd.none )

        Just ( beg, end ) ->
            undoAddNew e
            |> i ( beg, end )
            |> j
            |> placeCursor ScrollIfNeeded


setFontStyleTag : ( String, String ) -> Bool -> Editor -> ( Editor, Cmd Msg )
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


setPara : (LineBreakRecord -> LineBreakRecord) -> Editor -> ( Editor, Cmd Msg )
setPara f e =
    let
        g : ( Int, LineBreakRecord ) -> Editor -> Editor
        g ( idx, lineBreak ) x =
            set2 idx (LineBreak (f lineBreak)) x

        h : List ( Int, LineBreakRecord ) -> Editor -> Editor
        h xs y =
            List.foldr g y xs
    in
    h (parasInSelection e) (undoAddNew e)
    |> placeCursor ScrollIfNeeded        


setSelection : ( Int, Int ) -> Editor -> ( Editor, Cmd Msg )
setSelection ( a, b ) e =
    let
        maxIdx =
            Array.length e.content - 1

        ( beg, end ) =
            if a <= b then
                ( max 0 a, min maxIdx b )
            else
                ( max 0 b, min maxIdx a )
    in
    placeCursor ScrollIfNeeded
        { e
            | cursor = min maxIdx (end + 1)
            , selection = Just ( beg, end )
        }


type alias ShowCharParams =
    { editorID : String
    , eState : State
    , selection : Maybe (Int, Int)
    , selectionStyle : List (Attribute Msg)
    , cursor : Int
    , typing : Bool
    , fontSizeUnit : Maybe String
    }


showChar : Editor -> Int -> CharacterRecord -> Html Msg
showChar e idx ch =
    let
        id =
            e.editorID ++ String.fromInt idx

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
                Nothing ->
                    x

                Just href ->
                    Html.a
                        [ Attr.href href 
                        , Attr.target "_blank"
                        ]
                        [ x ]

        child =
            if idx == e.cursor then
                [ linked (text (String.fromChar ch.char))
                , cursorHtml e.typing
                ]
            else
                [ linked (text (String.fromChar ch.char)) ]

        pos =
            if idx == e.cursor then
                [ css
                    [ position relative ]
                ]
            else
                []

        unit =
            Maybe.withDefault "px" e.fontSizeUnit

        size =
            case ch.fontStyle.fontSize of
                Nothing ->
                    []

                Just x ->
                    [ Attr.style "font-size" (String.fromFloat x ++ unit) ]

        select : List (Attribute Msg)
        select =
            case e.selection of
                Just ( beg, end ) ->
                    if idx >= beg && idx <= end then
                        e.selectionStyle
                    else
                        []

                Nothing ->
                    []

        mouseEnterListener =
            Events.on "mouseenter"
                    (Decode.map
                        (\x -> Internal (MouseMove idx x))
                        (Decode.field "timeStamp" Decode.float)
                    )

        mouseDownListener =
            case ch.link of
                Nothing ->
                    Events.stopPropagationOn "mousedown"
                        (Decode.map
                            (\x -> ( Internal (MouseHit idx x), True ))
                            (Decode.field "timeStamp" Decode.float)
                        )

                Just _ ->
                    -- if user clicks on a link, do not move cursor but follow the link
                    Events.stopPropagationOn "mousedown"
                        (Decode.succeed (Internal NoOp, True))

        listeners =
            if e.state == Edit then
                [ mouseDownListener, mouseEnterListener ]
            else
                []
    in
    Html.span
        ( Attr.id id
            :: attributes (Character ch)
            ++ fontFamilyAttr
            ++ listeners
            ++ pos
            ++ select
            ++ size
        )
        child


showContent : List (Attribute Msg)  -> Editor -> Html Msg
showContent userDefinedStyles e =
    let
        listeners =
            case e.state of
                Edit ->
                    [ Events.on "mousedown" (Decode.map Internal decodeMouse) ]

                Freeze ->
                    []

                Display ->
                    []

        attrs =
            Attr.id e.editorID
            :: listeners
            ++ List.map (\(x,y) -> Attr.style x y)
                [ ("cursor", "text")
                , ("user-select", "none")
                , ("white-space", "pre-wrap")
                , ("word-break", "break-word")                
                ]
            ++ userDefinedStyles

        highlight =
            Maybe.withDefault identity e.highlighter


        paragraphs =
            breakIntoParas (highlight e.content)
            |> List.map (showPara e)
    in
    Html.div
        attrs
        paragraphs


showContentInactive : { fontSizeUnit : Maybe String, indentUnit : Maybe (Float, String), highlighter : Maybe (Content -> Content) } -> List (Attribute Msg) -> Content -> Html Msg
showContentInactive myParams userDefinedStyles myContent =
    let
        attrs =
            userDefinedStyles
            ++ List.map (\(x,y) -> Attr.style x y)
                [ ("cursor", "text")
                , ("user-select", "none")
                , ("white-space", "pre-wrap")
                , ("word-break", "break-word")                
                ]

        emptyEditor =
            init (dummyID "uneditable")

        dummyEditor =
            { emptyEditor |
                cursor = -1
              , fontSizeUnit = myParams.fontSizeUnit
              , indentUnit = myParams.indentUnit
              , selectionStyle = []
              , state = Display
            }
             

        highlight =
            Maybe.withDefault identity myParams.highlighter

        paragraphs =
            List.map
                (showPara dummyEditor)
                (breakIntoParas (highlight myContent))
    in
    Html.div
        attrs
        paragraphs


showEncodedContentInactive : { fontSizeUnit : Maybe String, indentUnit : Maybe (Float, String), highlighter : Maybe (Content -> Content) } -> List (Attribute Msg) -> String -> Html Msg
showEncodedContentInactive myParams userDefinedStyles json =
    let
        myContent =
            decode json
            |> Maybe.withDefault (textToContent json)
    in            
    showContentInactive myParams userDefinedStyles myContent


showEmbedded : EmbeddedHtmlRecord -> Html Msg
showEmbedded html =
    let
        textChild =
            case html.text of
                Nothing ->
                    Nothing

                Just txt ->
                    Just (text txt)

        f : Child -> Html Msg
        f x =
            case x of
                Child y ->
                    showEmbedded y

        g : ( String, String ) -> Attribute Msg
        g ( x, y ) =
            Attr.attribute x y

        attrs =            
            attributes (EmbeddedHtml html) ++ List.map g html.attributes            
    in
    case html.nodeType of
        Nothing ->
            case textChild of
                Nothing ->
                    Html.div [] []

                Just x ->
                    x

        Just x ->
            Html.node x attrs (Maybe.withDefault [] (Maybe.map (\y -> [y]) textChild) ++ List.map f html.children)


showPara : Editor -> Paragraph -> Html Msg
showPara e p =
    let
        indentUnit =
            Maybe.withDefault (50, "px") e.indentUnit

        f : ( Int, Element ) -> List (Html Msg) -> List (Html Msg)
        f ( idx, elem ) ys =
            case elem of
                --never occurs because of breakIntoParas
                LineBreak br ->
                    ys

                Character ch ->
                    HtmlLazy.lazy (showChar e idx) ch :: ys

                EmbeddedHtml html ->
                    showEmbedded html :: ys

        g : List ( Int, Element ) -> List (Html Msg) -> List (Html Msg)
        g xs ys =
            Html.div [] (List.foldr f [] xs) :: ys

        finalZeroSpace =
            Character
                { zeroWidthCharacterRecord | fontStyle = detectFontStyleAt (p.idx - 1) e }
    in
    p.children ++ [ (p.idx, finalZeroSpace) ]
    |> breakIntoWords
    |> List.foldr g []
    |> wrap indentUnit p.lineBreak
    

snapshot : Editor -> Undo
snapshot editor =
    { content = editor.content
    , cursor = editor.cursor
    , fontStyle = editor.fontStyle
    , selection = editor.selection
    }


spaceOrLineBreakAt : Int -> Content -> Bool
spaceOrLineBreakAt idx content =
    case Array.get idx content of
        Just (LineBreak _) ->
            True

        Just (Character ch) ->
            ch.char == ' '

        Just (EmbeddedHtml _) ->
            False

        Nothing ->
            False


state : State -> Editor -> Editor
state new e =
    { e | state = new }


strikeThrough : Bool -> Editor -> ( Editor, Cmd Msg )
strikeThrough bool editor =
    setFontStyleTag strikeThroughStyle bool editor


strikeThroughStyle : ( String, String )
strikeThroughStyle =
    ( "text-decoration", "line-through" )


textAlign : TextAlignType -> Editor -> ( Editor, Cmd Msg )
textAlign alignment e =
    let
        f x =
            { x | textAlign = alignment }
    in
    setPara f e


textContent : Editor -> String
textContent e =
    toText e.content


textToContent : String -> Content
textToContent txt =
    let
        f : Char -> Content -> Content
        f x ys =
            case x of
                '\n' ->
                    Array.push (LineBreak defaultLineBreakRecord) ys

                _ ->
                    Array.push
                    ( Character
                        { char = x
                        , fontStyle = emptyFontStyle
                        , highlightClasses = []
                        , highlightStyling = []
                        , link = Nothing
                        }
                    ) ys
    in
    if txt == "" then
        Array.push (LineBreak defaultLineBreakRecord) Array.empty
    else
        String.foldl f Array.empty txt
        |> addBreakToEnd


tickPeriod : Float
tickPeriod =
--millisec
    500


toggle : ( String, String ) -> Editor -> ( Editor, Cmd Msg )
toggle attr e =
    case e.selection of
        Just _ ->
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
        f : LineBreakRecord -> LineBreakRecord
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
        f : LineBreakRecord -> LineBreakRecord
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
                LineBreak _ ->
                    "\n"

                Character ch ->
                    String.fromChar ch.char

                EmbeddedHtml html ->
                    ""

        g : Element -> String -> String
        g x y =
            y ++ f x
    in
    Array.foldl g "" content


typed : String -> Editor -> Bool -> ( Editor, Cmd Msg )
typed txt e modifyClipboard =
    let
        checkCharLimit (x,y) =
            case x.characterLimit of
                Nothing ->
                    (x,y)

                Just int ->
                    if Array.length x.content > int then
                        ( e
                        , Task.succeed (CharacterLimitReached int)
                          |> Task.perform identity
                        )
                    else
                        (x,y)
    in
    typed_ (currentLink e) txt e modifyClipboard
    |> checkCharLimit


typed_ : Maybe String -> String -> Editor -> Bool -> ( Editor, Cmd Msg )
typed_ activeLink txt e modifyClipboard =
    let   
        f : Int -> Char -> Element
        f idx char =
            Character
                { char = char
                , fontStyle = e.fontStyle
                , highlightClasses = []
                , highlightStyling = []
                , link = activeLink
                }

        newContent =
            String.toList txt
            |> Array.fromList
            |> Array.indexedMap f

        newClipboard =
            if modifyClipboard then
                Just newContent
            else
                e.clipboard
    in
    case e.selection of
        Nothing ->
            placeCursor ScrollIfNeeded
                { e
                    | clipboard = newClipboard
                    , cursor = e.cursor + List.length (String.toList txt)
                    , content =
                        Array.slice e.cursor (Array.length e.content) e.content
                        |> Array.append newContent
                        |> Array.append (Array.slice 0 e.cursor e.content)
                }

        Just ( beg, x ) ->
            let
                maxIdx =
                    Array.length e.content - 1

                end =
                    if x == maxIdx then
                        maxIdx - 1
                    else
                        x
                -- prevent last LineBreak from being deleted
            in
            placeCursor ScrollIfNeeded
                { e
                    | clipboard = newClipboard
                    , cursor = beg + List.length (String.toList txt)
                    , selection = Nothing
                    , content =
                        Array.slice (end+1) (Array.length e.content) e.content
                        |> Array.append newContent
                        |> Array.append (Array.slice 0 beg e.content)
                }


undoAction : Editor -> ( Editor, Cmd Msg )
undoAction e =
    case e.undo of
        [] ->
            ( e, Cmd.none )

        x :: [] ->
            restore x { e | undo = [ x ] }
            |> placeCursor ScrollIfNeeded                

        x :: rest ->
            restore x { e | undo = rest }
            |> placeCursor ScrollIfNeeded                


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
        -- e.undo should never be empty. This is supposed to be
        -- taken care of by initWithContent, initWithText, and restore.
            e
            
        _ :: rest ->

            { e
                | undo = current :: rest
            }


underline : Bool -> Editor -> ( Editor, Cmd Msg )
underline bool editor =
    setFontStyleTag underlineStyle bool editor


underlineStyle : ( String, String )
underlineStyle =
    ( "text-decoration", "underline" )


undo : Editor -> ( Editor, Cmd Msg )
undo e =
    update UndoAction e


undoMaxDepth : Int
undoMaxDepth =
    300


unlink : Editor -> Editor
unlink editor =
    let
        f : Element -> Element
        f elem =
            case elem of
                Character ch ->
                    Character { ch | link = Nothing }

                _ ->
                    elem
    in
    linkMod f editor


wordAt : Int -> Content -> Bool
wordAt idx content =
    not (spaceOrLineBreakAt idx content)


wrap : ( Float, String ) -> LineBreakRecord -> List (Html Msg) -> Html Msg
wrap (amount, unit) l words =
    let
        indentation =
            l.indent + l.highlightIndent

        indentStr =
            String.fromFloat (toFloat indentation * amount) ++ unit

        indentAttr =
            if indentation > 0 then
                [ Attr.style "padding-left" indentStr
                , Attr.style "padding-right" indentStr
                ]
            else
                []

        alignment =
            [ css
                [ displayFlex
                , alignItems start
                , justifyContent myJusfifyContent
                , flexWrap Css.wrap
                ]
            ]

        myJusfifyContent =
            case l.textAlign of
                Center -> Css.center
                Left -> Css.start
                Right -> Css.end

        nodeType =
            case l.nodeType of
                Nothing -> Html.div
                Just x -> Html.node x
    in
    nodeType
        ( alignment ++ indentAttr ++ attributes (LineBreak l) )
        words


zeroWidthChar =
    Char.fromCode 8203


zeroWidthCharacterRecord : CharacterRecord
zeroWidthCharacterRecord =
    { char = zeroWidthChar
    , fontStyle = emptyFontStyle
    , highlightClasses = []
    , highlightStyling = []
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


decodeCharacterRecord : Decode.Decoder CharacterRecord
decodeCharacterRecord =
    let
        toChar x =
            case String.uncons x of
                Just ( char, _ ) ->
                    Decode.succeed char

                Nothing ->
                    Decode.fail ("Not convertible into a Char: " ++ x)
    in
    Decode.map5
        CharacterRecord
        (Decode.field "char" (Decode.string |> Decode.andThen toChar))
        (Decode.field "fontStyle" decodeFontStyle)
        (Decode.succeed [])--"highlightClasses"
        (Decode.succeed [])--"highlightStyling"
        (Decode.field "link" (Decode.maybe Decode.string))


decodeContent : Decode.Decoder Content
decodeContent =
    Decode.array decodeElement


decodeContentString : String -> Result String Content
decodeContentString str =
    Decode.decodeString decodeContent str
    |> Result.mapError decodeErrorToString


decodeErrorToString : Decode.Error -> String
decodeErrorToString err =
    case err of
        Decode.Field _ x -> decodeErrorToString x
        Decode.Index _ x -> decodeErrorToString x
        Decode.OneOf list -> List.map decodeErrorToString list |> String.join "; "
        Decode.Failure x _ -> x


decodeContentGZip : Bytes -> Result String Content
decodeContentGZip bytes =
    let
        decodeAsString : Bytes -> Maybe String
        decodeAsString buffer =
            let
                decoder = Bytes.Decode.string (Bytes.width buffer)
            in
                Bytes.Decode.decode decoder buffer
    in
    Flate.inflateGZip bytes
    |> Maybe.andThen decodeAsString
    |> Maybe.map decodeContentString
    |> Maybe.withDefault (Err "Not a gzip archive.")


decodeElement : Decode.Decoder Element
decodeElement =
    Decode.field "Constructor" Decode.string
    |> Decode.andThen decodeElementHelp


decodeElementHelp constructor =
    case constructor of
        "LineBreak" ->
            Decode.map
                LineBreak
                (Decode.field "A1" decodeLineBreakRecord)

        "Character" ->
            Decode.map
                Character
                (Decode.field "A1" decodeCharacterRecord)

        "EmbeddedHtml" ->
            Decode.map
                EmbeddedHtml
                (Decode.field "A1" decodeEmbeddedHtml)

        other ->
            Decode.fail <| "Unknown constructor for type Element: " ++ other


decodeEmbeddedHtml : Decode.Decoder EmbeddedHtmlRecord
decodeEmbeddedHtml =
    let
        decodeListener =
            Decode.map3 (\x y z -> { on = x, tag = y, at = z })
                (Decode.field "on" Decode.string)
                (Decode.field "tag" Decode.string)
                (Decode.field "at" (Decode.list Decode.string))

        f : Decoder EmbeddedHtmlRecord
        f =
            Decode.succeed EmbeddedHtmlRecord
                |> Pipeline.required "attributes" (Decode.list decodeTuple_String_String_)
                |> Pipeline.required "classes" (Decode.list Decode.string)
                |> Pipeline.hardcoded [] --"children"
                |> Pipeline.hardcoded [] -- "highlightClasses"
                |> Pipeline.hardcoded [] --"highlightStyling"
                |> Pipeline.required "nodeType" (Decode.maybe Decode.string)
                |> Pipeline.required "styling" decodeStyleTags
                |> Pipeline.required "text" (Decode.maybe Decode.string)

        g : Decoder ( EmbeddedHtmlRecord, List String )
        g =
            Decode.map2 Tuple.pair f (Decode.field "children" (Decode.list Decode.string))

        h : Result Decode.Error (List EmbeddedHtmlRecord) -> List String -> Result Decode.Error (List EmbeddedHtmlRecord)
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
                                    h (Ok (result :: xs)) rest

                                Err err ->
                                    Err err

        i : ( EmbeddedHtmlRecord, List String ) -> Decode.Decoder EmbeddedHtmlRecord
        i ( x, ys ) =
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
        (Decode.field "classes" (Decode.list Decode.string))
        (Decode.field "fontFamily" (Decode.list Decode.string))
        (Decode.field "fontSize" (Decode.maybe Decode.float))
        (Decode.field "styling" decodeStyleTags)


decodeLineBreakRecord : Decode.Decoder LineBreakRecord
decodeLineBreakRecord =
    Decode.succeed
        LineBreakRecord
        |> Pipeline.required "classes" (Decode.list Decode.string)
        |> Pipeline.hardcoded []--highlightClasses
        |> Pipeline.hardcoded 0 --highlightIndent
        |> Pipeline.hardcoded []--highlightStyling
        |> Pipeline.hardcoded "" --id
        |> Pipeline.required "indent" Decode.int
        |> Pipeline.required "nodeType" (Decode.maybe Decode.string)
        |> Pipeline.required "styling" decodeStyleTags
        |> Pipeline.required "textAlign" decodeTextAlignType


decodeStyleTags : Decode.Decoder StyleTags
decodeStyleTags =
    Decode.list decodeTuple_String_String_


decodeTextAlignType : Decoder TextAlignType
decodeTextAlignType =
    let
        recover x =
            case x of
                "Center"->
                    Decode.succeed Center
                "Left"->
                    Decode.succeed Left
                "Right"->
                    Decode.succeed Right
                other->
                    Decode.fail <| "Unknown constructor for type TextAlignType: " ++ other
    in
        Decode.string |> Decode.andThen recover


decodeTuple_String_String_ : Decode.Decoder ( String, String )
decodeTuple_String_String_ =
    Decode.map2
        (\a1 a2 -> ( a1, a2 ))
        (Decode.field "A1" Decode.string)
        (Decode.field "A2" Decode.string)


encode : Editor -> String
encode e =
    encodeContent e.content
    |> Encode.encode 0


encodeCharacterRecord : CharacterRecord -> Decode.Value
encodeCharacterRecord a =
    Encode.object
        [ ( "char", Encode.string (String.fromChar a.char) )
        , ( "fontStyle", encodeFontStyle a.fontStyle )
        , ( "link", encodeMaybe Encode.string a.link )
        ]


encodeChild : Child -> Decode.Value
encodeChild (Child a1) =
    encodeEmbeddedHtml a1


encodeContent : Content -> Decode.Value
encodeContent a =
    Encode.array encodeElement a


encodeContentString : Editor -> String
encodeContentString a =
    encode a


encodeContentGZip : Editor -> Bytes
encodeContentGZip a =
    encodeContentString a
        |> Bytes.Encode.string
        |> Bytes.Encode.encode
        |> Flate.deflateGZip


encodeElement : Element -> Decode.Value
encodeElement a =
    case a of
        LineBreak a1 ->
            Encode.object
                [ ( "Constructor", Encode.string "LineBreak" )
                , ( "A1", encodeLineBreakRecord a1 )
                ]

        Character a1 ->
            Encode.object
                [ ( "Constructor", Encode.string "Character" )
                , ( "A1", encodeCharacterRecord a1 )
                ]

        EmbeddedHtml a1 ->
            Encode.object
                [ ( "Constructor", Encode.string "EmbeddedHtml" )
                , ( "A1", encodeEmbeddedHtml a1 )
                ]


encodeEmbeddedHtml : EmbeddedHtmlRecord -> Decode.Value
encodeEmbeddedHtml a =
    let
        encodeListener b =
            Encode.object
                [ ( "on", Encode.string b.on )
                , ( "tag", Encode.string b.tag )
                , ( "at", Encode.list Encode.string b.at )
                ]
    in
    Encode.object
        [ ( "attributes", Encode.list encodeTuple_String_String_ a.attributes )
        , ( "classes", Encode.list Encode.string a.classes )
        , ( "children", Encode.list encodeChild a.children )
        , ( "nodeType", encodeMaybe Encode.string a.nodeType )
        , ( "styling", encodeStyleTags a.styling )
        , ( "text", encodeMaybe Encode.string a.text )
        ]


encodeFontStyle : MiniRte.Types.FontStyle -> Decode.Value
encodeFontStyle a =
    Encode.object
        [ ( "classes", Encode.list Encode.string a.classes )
        , ( "fontFamily", Encode.list Encode.string a.fontFamily )
        , ( "fontSize", encodeMaybe Encode.float a.fontSize )
        , ( "styling", encodeStyleTags a.styling )
        ]


encodeLineBreakRecord : LineBreakRecord -> Decode.Value
encodeLineBreakRecord a =
    Encode.object
        [ ( "classes", Encode.list Encode.string a.classes )
        , ( "indent", Encode.int a.indent )
        , ( "nodeType", encodeMaybe Encode.string a.nodeType )
        , ( "styling", encodeStyleTags a.styling )
        , ( "textAlign", encodeTextAlignType a.textAlign )
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


encodeTextAlignType : TextAlignType -> Value
encodeTextAlignType a =
    Encode.string <|
        case a of
            Center-> "Center"
            Left-> "Left"
            Right-> "Right"


encodeTuple_String_String_ : ( String, String ) -> Decode.Value
encodeTuple_String_String_ ( a1, a2 ) =
    Encode.object
        [ ( "A1", Encode.string a1 )
        , ( "A2", Encode.string a2 )
        ]
