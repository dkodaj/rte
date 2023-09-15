port module Main exposing (main)

import Array
import Browser
import Bytes exposing (Bytes)
import File exposing (File)
import File.Download
import File.Select
import Highlighter exposing (highlighter)
import Html exposing (div, Html, text)
import Html.Attributes as Attr exposing (class)
import Html.Events as Events
import MiniRte as Rte
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
    { rte : Rte.Rte Msg 
    , notification : Maybe String
    }


type Msg =
      ClearNotification
    | DownloadContentStart
    | DownloadContentEnd Bytes  
    | FileDecoded Bytes
    | FileSelected File
    | FileSelect
    | Rte RteTypes.Msg


init : () -> ( Model, Cmd Msg )
init _ =
    let
        content =            
            case Rte.decodeContentString SavedContent.json of
                Ok x ->
                    x

                Err err ->
                    Array.empty

        parameters =
            { id = "MyRTE"
            , characterLimit = Just 10000
            , content = content
            , fontSizeUnit = Nothing
            , highlighter = Just highlighter
            , indentUnit = Nothing
            , pasteImageLinksAsImages = True
            , pasteLinksAsLinks = True
            , selectionStyle = []
            , styling =
                { active =  [ class "rte-wrap" ]
                , inactive =  [ class "blogpost" ]
                }            
            , tagger = Rte
            }

        ( rte, cmd ) =
            Rte.init parameters
    in
    ( { rte = rte 
      , notification = Nothing
      }
    , cmd
    )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Rte.subscriptions model.rte
        , fromBrowserClipboard ( Rte << RteTypes.FromBrowserClipboard )        
        ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ClearNotification ->
            ( { model | notification = Nothing }
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
                    update (Rte (RteTypes.LoadContent content)) model

                Err err ->                    
                    update (Rte (RteTypes.LoadText ("File open error: " ++ err))) model

        FileSelected file ->
            ( model
            , Task.perform FileDecoded (File.toBytes file)
            )

        FileSelect ->
            ( model
            , File.Select.file ["application/gz"] FileSelected
            )

        Rte (RteTypes.CharacterLimitReached int) ->
            ( { model | notification = Just ("Max " ++ String.fromInt int ++ " characters (incl. line breaks)") }
            , Process.sleep 3000
              |> Task.perform (\_ -> ClearNotification)
            )

        Rte (RteTypes.ToBrowserClipboard txt) ->
            ( model, toBrowserClipboard txt )

        Rte rteMsg ->
            let
                ( rte, cmd ) =
                    Rte.update rteMsg model.rte
            in
            ( { model | rte = rte }, cmd )


view : Model -> Browser.Document Msg
view model =   
    { title = "RTE demo"
    , body =
        [ div
            [ class "body-wrap" ]
            [ toolbar model
            , Rte.textarea model.rte

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


---== Helpers


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


toolbar : Model -> Html Msg
toolbar model =
    let
        icon name msg =
            icon2 name (Rte msg)

        icon2 name msg =
            Html.img
                [ Attr.src ("icon/" ++ name)
                , class "icon"
                , Events.onClick msg
                ] []
    in
    div
        [ class "toolbar" ]
        [ Rte.onOffSwitch model.rte
            { activeColor = "#2196F3" 
            , inactiveColor = "#ccc"
            , width = 60
            }

        , icon "Bold.svg" RteTypes.Bold

        , icon "Italic.svg" RteTypes.Italic

        , icon "Underline.svg" RteTypes.Underline

        , icon "Strikethrough.svg" RteTypes.StrikeThrough

        , icon "Undo.svg" RteTypes.Undo
        
        , icon "Left.svg" (RteTypes.TextAlign RteTypes.Left)

        , icon "Center.svg" (RteTypes.TextAlign RteTypes.Center)
        
        , icon "Right.svg" (RteTypes.TextAlign RteTypes.Right)

        , icon "Unindent.svg"  RteTypes.Unindent

        , icon "Indent.svg" RteTypes.Indent

        , icon "Heading.svg"  RteTypes.Heading

        , icon "Coding.svg" (RteTypes.Class "code")

        , icon "Emoji.svg" RteTypes.ToggleEmojiBox

        , icon "Link.svg"  RteTypes.ToggleLinkBox

        , icon "Unlink.svg" RteTypes.Unlink

        , icon "Picture.svg" RteTypes.ToggleImageBox

        , icon "ListBullets.png" (RteTypes.Class "bullets")

        , icon "ListNumbered.png" (RteTypes.Class "numbered")

        , Rte.fontSelector model.rte
                { styling = [ class "select" ]
                , fonts =
                    [ ["Oswald","sans-serif"]
                    , ["Playfair Display", "serif"]
                    , ["Ubuntu Mono","monospace"]
                    ]
                }

        , Rte.fontSizeSelector model.rte
                { styling = [ class "select" ]                    
                , sizes =
                    List.range 3 15
                        |> List.map (\a -> 2*a)
                            |> List.map toFloat
                }

        , icon2 "Save.png" DownloadContentStart

        , icon2 "Open.svg" FileSelect

        , Rte.emojiBox model.rte
                { styling = 
                    { active = [ class "emoji-box" ]
                    , inactive = [ Attr.style "display" "none" ]
                    }

                , emojis =
                    [ "😛", "😝", "😜", "🤪"
                    , "🤨", "🧐", "🤓", "😎", "🤩"
                    , "🥳", "😏", "😒", "😞", "😔"
                    , "😟", "😕", "🙁", "☹️", "😣"
                    , "😖", "😫", "😩", "🥺", "😢"
                    , "😭", "😤", "😠", "😡", "🤬"
                    , "🤯", "😳", "🥵", "🥶", "😱"    
                    ]
                }

        , Rte.inputBox model.rte
                { styling = 
                    { active = [ class "input-box" ]
                    , inactive =
                        [ class "input-box" 
                        , Attr.style "visibility" "hidden"
                        ]
                    }
                }
        ]



--=== PORTS

--from JavaScript to Elm

port fromBrowserClipboard : (String -> msg) -> Sub msg


--from Elm to JavaScript

port toBrowserClipboard : String -> Cmd msg
