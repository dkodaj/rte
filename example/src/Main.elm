port module Main exposing (main)

import Array
import Browser
import Browser.Dom as Dom
import Bytes exposing (Bytes)
import File exposing (File)
import File.Download
import File.Select
import Highlighter exposing (highlighter)
import Html exposing (div, Html, text)
import Html.Attributes as Attr exposing (class)
import Html.Events as Events
import Json.Decode as Decode exposing (Decoder)
import MiniRte as Rte exposing (Rte)
import MiniRte.Types as RteTypes
import Process
import SavedContent
import Task


main =
    Browser.document
        { init = init
        , subscriptions = subscriptions
        , update = update
        , view = view
        }


type alias Model =
    { rte : Rte
    , fontSelector : Bool
    , fontSizeSelector : Bool
    , inputBox : Maybe (InputBoxType, String)
    , readingMode : Bool
    , showEmojis : Bool
    , notification : Maybe String
    }


type Msg =
      AddImage String
    | AddLink String
    | AddText String
    | Bold
    | Class String
    | ClearNotification
    | CloseInputBox
    | DownloadContentEnd Bytes  
    | DownloadContentStart
    | FileDecoded Bytes
    | FileSelect
    | FileSelected File
    | Font (List String)
    | FontSelector Bool
    | FontSize Float
    | FontSizeSelector Bool
    | Freeze
    | Heading
    | Indent
    | InputImage String
    | InputLink String
    | Internal RteTypes.Msg
    | Italic
    | NoOp
    | ReadingMode Bool
    | ShowEmojis Bool
    | Strikethrough
    | TextAlign RteTypes.TextAlignType
    | ToggleImageBox
    | ToggleLinkBox
    | Underline
    | Undo
    | Unindent
    | Unlink


type InputBoxType =
    ImageInput | LinkInput


init : () -> ( Model, Cmd Msg )
init _ =
    let
        content =            
            case Rte.decodeContentString SavedContent.json of
                Ok x ->
                    x

                Err err ->
                    Rte.textToContent err

        rte =
            Rte.init "MyRTE"
            |> Rte.replaceContent content
            |> Rte.setHighlighter (Just Highlighter.highlighter)
    in
    ( { rte = rte
      , fontSelector = False
      , fontSizeSelector = False
      , inputBox = Nothing  
      , notification = Nothing
      , readingMode = False
      , showEmojis = False
      }
    
    , Cmd.none
    )


subscriptions : Model -> Sub Msg
subscriptions model =
    case model.readingMode of
        True ->
            Sub.none

        False ->
            Sub.batch
                [ Rte.subscriptions model.rte
                , fromBrowserClipboard RteTypes.FromBrowserClipboard
                ]
            |> Sub.map Internal


apply : (Rte -> (Rte, Cmd RteTypes.Msg)) -> Model -> (Model, Cmd Msg)
apply f model =
    let
        (rte,cmd) =
            f model.rte
    in
    ( { model | rte = rte }, Cmd.map Internal cmd)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        AddImage src ->
            apply (Rte.addImageWithSrc src) { model | inputBox = Nothing }

        AddLink href ->
            apply (Rte.addLink href) { model | inputBox = Nothing }

        AddText str ->
            apply (Rte.addText str) model

        Bold ->
            apply Rte.toggleBold model

        Class str ->
            apply (Rte.toggleClass str) model

        ClearNotification ->
            ( { model | notification = Nothing }
            , Cmd.none
            )

        CloseInputBox ->
            ( { model |                    
                    rte = Rte.unfreeze model.rte 
                  , inputBox = Nothing 
                  , showEmojis = False
                  , fontSelector = False
                  , fontSizeSelector = False
              }
            , Cmd.none
            )

        DownloadContentStart ->
            let
                bytes =
                    Rte.encodeContentGZip model.rte
            in
            ( model
            , Task.perform identity (Task.succeed (DownloadContentEnd bytes))
            )

        DownloadContentEnd bytes ->
            ( model
            , File.Download.bytes "content.gz" "application/zip" bytes
            )

        FileDecoded bytes ->
            case Rte.decodeContentGZip bytes of
                Ok content ->
                    apply ( \x -> (Rte.replaceContent content x, Cmd.none) ) model

                Err err ->
                    apply ( \x -> (Rte.replaceContentString ("File open error: " ++ err) x, Cmd.none) ) model

        FileSelected file ->
            ( model
            , Task.perform FileDecoded (File.toBytes file)
            )

        FileSelect ->
            ( model
            , File.Select.file ["application/gz"] FileSelected
            )

        Font list ->
            apply (Rte.toggleFontFamily list) model

        FontSelector bool ->
            ( { model | fontSelector = bool }
            , Cmd.none
            )

        FontSize float ->
            apply (Rte.setFontSize float) model

        FontSizeSelector bool ->
            ( { model | fontSizeSelector = bool }
            , Cmd.none
            )

        Freeze ->
            ( { model | rte = Rte.freeze model.rte}
            , Cmd.none
            )

        Heading ->
            apply Rte.toggleHeading model

        Indent ->
            apply Rte.increaseIndent model

        InputImage src ->
            ( { model | inputBox = Just (ImageInput, src) }
            , Cmd.none
            )

        InputLink href ->
            ( { model | inputBox = Just (LinkInput, href) }
            , Cmd.none
            )
            
        Internal (RteTypes.CharacterLimitReached int) ->
            ( { model | notification = Just ("Max " ++ String.fromInt int ++ " characters (incl. line breaks)") }

            , Process.sleep 3000
              |> Task.perform (\_ -> ClearNotification)
            )

        Internal (RteTypes.ToBrowserClipboard txt) ->
            ( model, toBrowserClipboard txt )

        Internal rteMsg ->
            apply (Rte.update rteMsg) model

        Italic ->
            apply Rte.toggleItalic model

        NoOp ->
            ( model, Cmd.none )

        ReadingMode bool ->
            ( { model | readingMode = bool }
            , Cmd.none
            )

        ShowEmojis bool ->
            ( { model | showEmojis = bool }
            , Cmd.none
            )

        Strikethrough ->
            apply Rte.toggleStrikethrough model

        TextAlign itsType ->
            apply (Rte.setTextAlignment itsType) model

        ToggleImageBox ->
            case model.inputBox of
                Just (ImageInput, _) ->
                    update CloseInputBox model

                _ ->
                    ( { model | 
                          inputBox = Just (ImageInput, "") 
                        , rte = Rte.freeze model.rte
                      }
                    
                    , Task.attempt (\_ -> NoOp) (Dom.focus inputBoxId)
                    )

        ToggleLinkBox ->
            case model.inputBox of
                Just (LinkInput, _) ->
                    update CloseInputBox model

                _ ->
                    ( { model | 
                          inputBox = Just (LinkInput, "") 
                        , rte = Rte.freeze model.rte
                      }
                    
                    , Task.attempt (\_ -> NoOp) (Dom.focus inputBoxId)
                    )

        Underline ->
            apply Rte.toggleUnderline model

        Undo ->
            apply Rte.undo model

        Unindent ->
            apply Rte.decreaseIndent model

        Unlink ->
            apply Rte.unlink model


view : Model -> Browser.Document Msg
view model =
    let
        textarea =
            Html.map Internal <|
                Rte.textarea
                    model.rte
                    [ class "rte-wrap" ]                

        wrappedTextarea =
            div
                [ Events.onClick CloseInputBox ]
                [ textarea ]

        customization =
            { highlighter = Just Highlighter.highlighter
            , fontSizeUnit = Nothing
            , indentUnit = Nothing 
            }

        editedContent =
            Html.map Internal <|
                Rte.showContentCustom
                    customization  
                    (Rte.content model.rte)
                    [ class "blogpost" ]
    in
    { title = "RTE demo"
    , body =
        [ div
            [ class "body-wrap" ]
            [ toolbarTop model
            , toolbar model
            
            , if model.readingMode then editedContent else wrappedTextarea
            
            , notification model

            , Html.a
                [ Attr.href "https://github.com/dkodaj/rte/tree/master/example" 
                , class "source"
                ]
                [ text "Source" ]

            , Html.a
                [ Attr.href "icon-credits.html" 
                , class "source"
                ]
                [ text "Icon Credits" ]
            ]
        ]
    }


---== Main Helpers

notification : Model -> Html Msg
notification model =
    case model.notification of
        Nothing ->
            div
                [ class "notification" ]
                []

        Just txt ->
            div
                [ class "notification" ]
                [ text txt ]


onOffSwitch : Bool -> Html Msg
onOffSwitch readingMode =
    let
        state =
            case readingMode of
                True ->
                    class "sliderCircle"

                False ->
                    class "sliderCircle sliderCircleRight"

        wrap =
            case readingMode of
                True ->
                    class "slider"

                False ->
                    class "slider sliderRight" 
    in
    Html.label
        [ class "switch" ]
        [ Html.span
            [ wrap
            ,  Events.onClick (ReadingMode (not readingMode))
            ]
            [ div
                [ state ]
                []
            ]
        ]           


toolbar : Model -> Html Msg
toolbar model =
    let
        icon name msg =
            Html.img
                [ Attr.src ("icon/" ++ name)
                , class "icon"
                , Events.onClick msg
                ] []
    in
    case model.readingMode of
        True ->
            div
                [ class "toolbar-inactive" ]
                [ onOffSwitch model.readingMode
                , div
                    [ Attr.style "margin-left" "15px" ]
                    [ Html.i [] [text "This is how the edited content looks in reading mode."] ]
                ]

        False ->
            div
                [ class "toolbar" ]
                [ onOffSwitch model.readingMode

                , icon "Bold.svg" Bold

                , icon "Italic.svg" Italic

                , icon "Underline.svg" Underline

                , icon "Strikethrough.svg" Strikethrough

                , icon "Undo.svg" Undo
                
                , icon "Left.svg" (TextAlign RteTypes.Left)

                , icon "Center.svg" (TextAlign RteTypes.Center)
                
                , icon "Right.svg" (TextAlign RteTypes.Right)

                , icon "Unindent.svg" Unindent

                , icon "Indent.svg" Indent

                , icon "Heading.svg" Heading

                , icon "Coding.svg" (Class "code")

                , icon "Emoji.svg" (ShowEmojis (not model.showEmojis))

                , icon "Link.svg"  ToggleLinkBox

                , icon "Unlink.svg" Unlink

                , icon "Picture.svg" ToggleImageBox

                , icon "ListBullets.png" (Class "bullets")

                , icon "ListNumbered.png" (Class "numbered")

                , icon "Save.png" DownloadContentStart

                , icon "Open.svg" FileSelect

                , if model.showEmojis then
                    emojiBox
                        [ class "emoji-box" ]
                        [ "😛", "😝", "😜", "🤪"
                        , "🤨", "🧐", "🤓", "😎", "🤩"
                        , "🥳", "😏", "😒", "😞", "😔"
                        , "😟", "😕", "🙁", "☹️", "😣"
                        , "😖", "😫", "😩", "🥺", "😢"
                        , "😭", "😤", "😠", "😡", "🤬"
                        , "🤯", "😳", "🥵", "🥶", "😱"    
                        ]
                    else
                        div [] []

                , case model.inputBox of
                    Nothing ->
                        div [] []

                    Just (inputBoxType, str) ->
                        inputBoxTemplate [ class "input-box" ] inputBoxType str
                ]


toolbarTop : Model -> Html Msg
toolbarTop model =
    case model.readingMode of
        True ->
            div [] []

        False ->
            div
                [ class "toolbar-top" ]        
                [ fontSelector
                        model                        
                        [ ["Oswald","sans-serif"]
                        , ["Playfair Display", "serif"]
                        , ["Ubuntu Mono","monospace"]
                        ]

                , fontSizeSelector
                        model
                        ( List.range 1 10
                          |> List.map (\a -> 10*a)
                          |> List.map toFloat
                        )
                ]


---== Components

emojiBox : List (Html.Attribute Msg) -> List String -> Html Msg
emojiBox styling emojis =
    let
        toDiv x =
            div
                [ Events.onClick (AddText x)
                , Attr.style "cursor" "pointer"
                ]
                [ text x ]
    in
    div
        styling
        (List.map toDiv emojis)


fontSelector : Model -> List (List String) -> Html Msg
fontSelector model fonts =
    let
        maybeFontName =
            Rte.fontFamily model.rte
            |> List.head

        selected x =
            case maybeFontName of
                Nothing ->
                    False

                Just y ->
                    x == y

        option xs =
            case xs of
                [] ->
                    div [] []

                x :: _ ->
                    div
                        [ if selected x then class "selectOption selected" else class "selectOption"
                        , Events.onClick (Font xs)
                        , Events.onMouseOver (FontSelector True)
                        ]
                        [ text x ]

        msg x =
            case List.filter (\a -> List.head a == Just x) fonts of
                xs :: _ ->
                    Just (Font xs)

                [] ->
                    Nothing

        heading =
            div
                [ class "selectHeading"
                , Events.onMouseOver (FontSelector True)
                ]
                [ text headingTxt ]

        headingTxt =
            Maybe.withDefault "font" maybeFontName

        options =
            case model.fontSelector of
                True ->
                    List.map option fonts

                False ->
                    []
    in
    div
        [ class "select" 
        , Events.onMouseOut (FontSelector False)
        ]
        ( heading :: options )


fontSizeSelector : Model -> List Float -> Html Msg
fontSizeSelector model sizes =
    let
        maybeSize =
            Rte.fontSize model.rte

        selected x =
            case maybeSize of
                Nothing ->
                    False

                Just y ->
                    x == y

        msg x =
            Maybe.map FontSize (String.toFloat x)

        option x =
            div
                [ if selected x then class "selectOption selected" else class "selectOption"
                , Events.onClick (FontSize x)
                , Events.onMouseOver (FontSizeSelector True)
                ]
                [ text (String.fromFloat x) ]

        heading =
            div
                [ class "selectHeading"
                , Events.onMouseOver (FontSizeSelector True)                
                ]
                [ text headingTxt ]

        headingTxt =
            Maybe.map String.fromFloat maybeSize
            |> Maybe.withDefault "size"

        options =
            case model.fontSizeSelector of
                True ->
                    List.map option sizes

                False ->
                    []
    in
    div
        [ class "select" 
        , Events.onMouseOut (FontSizeSelector False)
        ]
        ( heading :: options )


inputBoxId : String
inputBoxId =
    "myInputBox"


inputBoxTemplate : List (Html.Attribute Msg) -> InputBoxType -> String -> Html Msg
inputBoxTemplate styling myType content =
        let
            behaviour =
                inputBoxBehaviour myType

            value =
                case content of
                    "" ->                    
                        Attr.placeholder behaviour.placeholder

                    other ->                    
                        Attr.value other
        in
        div
            styling
            [ Html.button
                [ Events.onClick CloseInputBox
                , class "cancel"
                ]
                [ text "X" ]

            , Html.input
                [ value
                , Attr.type_ "text"
                , Events.onInput behaviour.inputMsg
                , Attr.id inputBoxId
                ]
                []

            , Html.button
                [ Events.onClick (behaviour.okMsg content) ]
                [ text "Ok" ]
            ]


type alias InputBoxBehaviour =
    { inputMsg : String -> Msg
    , okMsg : String -> Msg
    , placeholder : String
    }


inputBoxBehaviour : InputBoxType -> InputBoxBehaviour
inputBoxBehaviour x =
    case x of
        ImageInput ->
            { inputMsg = InputImage
            , okMsg = AddImage
            , placeholder = "Image url"
            }

        LinkInput ->
            { inputMsg = InputLink
            , okMsg = AddLink
            , placeholder = "Link url"
            }
            

--=== PORTS

--from JavaScript to Elm

port fromBrowserClipboard : (String -> msg) -> Sub msg


--from Elm to JavaScript

port toBrowserClipboard : String -> Cmd msg
