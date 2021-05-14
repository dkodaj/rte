port module Main exposing (main)

import App.Content
import App.Highlight
import Browser
import Html exposing (div, Html, text)
import Html.Attributes as Attr exposing (class)
import Html.Events as Events
import MiniRte as Rte
import MiniRte.Types as RteTypes


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
    Internal RteTypes.Msg


init : () -> ( Model, Cmd Msg )
init _ =
    let
        parameters =
            { id = "MyRTE"
            , content = Just App.Content.json
            , fontSizeUnit = Nothing
            , highlighter = Just App.Highlight.code
            , indentUnit = Nothing            
            , selectionStyle = []
            , styling =
                { active =  [ class "rte-wrap" ]
                , inactive =  [ class "blogpost" ]
                }            
            , tagger = Internal
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
        , fromBrowserClipboard ( Internal << RteTypes.FromBrowserClipboard )
        ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Internal (RteTypes.ToBrowserClipboard txt) ->
            ( model, toBrowserClipboard txt )

        Internal rteMsg ->
            let
                ( rte, cmd ) =
                    Rte.update rteMsg model.rte
            in
            ( { rte = rte }
            , cmd
            )


view : Model -> Browser.Document Msg
view model =   
    { title = "RTE demo"
    , body =
        [ div
            [ class "body-wrap" ]
            [ toolbar model
            , Rte.textarea model.rte

            , Html.a
                [ Attr.href "https://github.com/dkodaj/rte" 
                , class "source"
                ]
                [ text "Source" ]

            , Html.a
                [ Attr.href "/rte/icon-credits.html" 
                , class "source"
                ]
                [ text "Icon Credits" ]
            ]
        ]
    }


toolbar : Model -> Html Msg
toolbar model =
    let
        icon name msg =
            Html.img
                [ Attr.src ("/rte/icon/" ++ name ++ ".svg")
                , class "icon"
                , Events.onClick (Internal msg)
                ] []
    in
    div
        [ class "toolbar" ]
        [ Rte.onOffSwitch model.rte
            { activeColor = "#2196F3" 
            , inactiveColor = "#ccc"
            , width = 60
            }

        , icon "Bold" RteTypes.Bold

        , icon "Italic" RteTypes.Italic

        , icon "Underline" RteTypes.Underline

        , icon "Strikethrough" RteTypes.StrikeThrough

        , icon "Undo" RteTypes.Undo
        
        , icon "Left" (RteTypes.TextAlign RteTypes.Left)

        , icon "Center" (RteTypes.TextAlign RteTypes.Center)
        
        , icon "Right" (RteTypes.TextAlign RteTypes.Right)

        , icon "Unindent"  RteTypes.Unindent

        , icon "Indent"  RteTypes.Indent

        , icon "Heading"  RteTypes.Heading

        , icon "Coding" (RteTypes.Class "Code")

        , icon "Emoji" RteTypes.ToggleEmojiBox

        , icon "Link"  RteTypes.ToggleLinkBox

        , icon "Unlink" RteTypes.Unlink

        , icon "Picture" RteTypes.ToggleImageBox

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
