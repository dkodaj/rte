port module Main exposing (main)

import Browser
import Bytes exposing (Bytes)
import Content
import File exposing (File)
import File.Download
import File.Select
import Highlighter exposing (highlighter)
import Html exposing (div, Html, text)
import Html.Attributes as Attr exposing (class)
import Html.Events as Events
import MiniRte as Rte
import MiniRte.Types as Rtypes
import Task


main =
    Browser.document
        { init = init
        , subscriptions = subscriptions
        , update = update
        , view = view
        }


type alias Model =
    { rte : Rte.Rte Msg }


type Msg =
      DownloadContentStart
    | DownloadContentEnd Bytes  
    | FileDecoded Bytes
    | FileSelected File
    | FileSelect
    | Rte Rtypes.Msg


init : () -> ( Model, Cmd Msg )
init _ =
    let
        content =
            Rte.decodeContentString Content.json
            |> Result.withDefault []

        parameters =
            { id = "MyRTE"
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
    ( { rte = rte }
    , cmd
    )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Rte.subscriptions model.rte
        , fromBrowserClipboard ( Rte << Rtypes.FromBrowserClipboard )        
        ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
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
                    update (Rte (Rtypes.LoadContent content)) model

                Err err ->
                    update (Rte (Rtypes.LoadText ("File open error: " ++ err))) model

        FileSelected file ->
            ( model
            , Task.perform FileDecoded (File.toBytes file)
            )

        FileSelect ->
            ( model
            , File.Select.file ["application/gz"] FileSelected
            )

        Rte (Rtypes.ToBrowserClipboard txt) ->
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

        , icon "Bold.svg" Rtypes.Bold

        , icon "Italic.svg" Rtypes.Italic

        , icon "Underline.svg" Rtypes.Underline

        , icon "Strikethrough.svg" Rtypes.StrikeThrough

        , icon "Undo.svg" Rtypes.Undo
        
        , icon "Left.svg" (Rtypes.TextAlign Rtypes.Left)

        , icon "Center.svg" (Rtypes.TextAlign Rtypes.Center)
        
        , icon "Right.svg" (Rtypes.TextAlign Rtypes.Right)

        , icon "Unindent.svg"  Rtypes.Unindent

        , icon "Indent.svg" Rtypes.Indent

        , icon "Heading.svg"  Rtypes.Heading

        , icon "Coding.svg" (Rtypes.Class "code")

        , icon "Emoji.svg" Rtypes.ToggleEmojiBox

        , icon "Link.svg"  Rtypes.ToggleLinkBox

        , icon "Unlink.svg" Rtypes.Unlink

        , icon "Picture.svg" Rtypes.ToggleImageBox

        , icon "ListBullets.png" (Rtypes.Class "bullets")

        , icon "ListNumbered.png" (Rtypes.Class "numbered")

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
