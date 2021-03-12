module Main exposing (main)

import Browser
import Browser.Dom as Dom
import Highlight
import Html exposing (div, Html, text)
import Html.Attributes as Attr
import Html.Events as Events
import Json.Decode as Decode
import Rte
import Sample
import Task


main =
    Browser.document
        { init = init
        , subscriptions = subscriptions
        , update = update
        , view = view
        }


type alias Model =
    { inputBox : Maybe InputBox
    , rte : Rte.Editor 
    }


type Msg =
      Bold
    | Code
    | Emoji
    | Font (List String)
    | FontSize Float
    | Heading
    | ImageAdd String
    | ImageInput String
    | Indent
    | Internal Rte.Msg
    | Italic
    | LinkAdd String
    | LinkInput String
    | NoOp
    | StrikeThrough
    | TextAlign Rte.TextAlign
    | ToggleImageBox
    | ToggleLinkBox
    | Underline
    | Undo
    | Unindent
    | Unlink


type InputBox =
      ImageInputBox String
    | LinkInputBox String


type alias InputBoxProps =
    { content : String
    , inputMsg : String -> Msg
    , okMsg : String -> Msg
    , placeholder : String
    }


init : () -> ( Model, Cmd Msg )
init _ =
    let
        ( rte, rteCmd ) =
            Rte.initWith Sample.content "MyRTE"
    in
    ( { inputBox = Nothing      
      , rte =
            { rte |
                highlighter = Just Highlight.code 
            }
      }
    , Cmd.map Internal rteCmd
    )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.map Internal (Rte.subscriptions model.rte)


apply : ( Rte.Editor -> (Rte.Editor, Cmd Rte.Msg) ) -> Model -> ( Model, Cmd Msg )
apply f model =
    let
        ( rte, rteCmd ) =
            f model.rte        
    in
    ( { model | rte = rte }
    , Cmd.map Internal rteCmd 
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =    
    case msg of
        Bold ->
            apply Rte.toggleBold model


        Code ->
            apply (Rte.toggleParaClass "Code") model


        Emoji ->
            apply (Rte.addContent emoji) model


        Font family ->
            apply (Rte.fontFamily family) model


        FontSize float ->
            apply (Rte.fontSize float) model


        Heading ->
            apply (Rte.toggleNodeType "h1") model


        ImageAdd str ->
            if str == "" then
                ( { model | inputBox = Nothing }, Cmd.none )
            else
                let
                    ( rte, rteCmd ) =
                        Rte.addImage str (Rte.activate model.rte)
                in
                ( { model |
                      rte = rte
                    , inputBox = Nothing
                  }  
                , Cmd.map Internal rteCmd
                )


        ImageInput str ->
            ( { model | inputBox = Just (ImageInputBox str) }
            , Cmd.none 
            )

        
        Indent ->
            apply (Rte.changeIndent 1) model


        Internal rteMsg ->
            apply (Rte.update rteMsg) model


        Italic ->
            apply Rte.toggleItalic model


        LinkAdd href -> 
            if href == "" then
                ( { model | inputBox = Nothing }, Cmd.none )
            else
                ( { model |
                      rte = Rte.link href (Rte.activate model.rte)
                    , inputBox = Nothing  
                  }
                , Cmd.none 
                )


        LinkInput str ->
            ( { model | inputBox = Just (LinkInputBox str) }
            , Cmd.none 
            )


        NoOp ->
            ( model, Cmd.none )


        StrikeThrough ->
            apply Rte.toggleStrikeThrough model


        TextAlign alignment ->
            apply (Rte.textAlign alignment) model


        ToggleImageBox ->                   
            case model.inputBox of
                Just (ImageInputBox _) ->
                    ( { model |
                          inputBox = Nothing 
                        , rte = Rte.activate model.rte  
                      }
                    , Cmd.none 
                    )

                _ ->
                    ( { model |
                          inputBox = Just (ImageInputBox "") 
                        , rte = Rte.inactivate model.rte  
                      }
                    , Task.attempt (\_ -> NoOp) (Dom.focus "InputBox")
                    )


        ToggleLinkBox ->
            case model.inputBox of
                Just (LinkInputBox _) ->
                    ( { model |
                          inputBox = Nothing
                        , rte = Rte.activate model.rte   
                      }
                    , Cmd.none 
                    )

                _ ->
                    let
                        currentLink =
                            Maybe.withDefault "" (Rte.currentLink model.rte)
                    in
                    ( { model |
                          inputBox = Just (LinkInputBox currentLink) 
                        , rte = Rte.inactivate model.rte
                      }
                    , Task.attempt (\_ -> NoOp) (Dom.focus "InputBox")
                    )


        Underline ->
            apply Rte.toggleUnderline model


        Undo ->
            apply Rte.undo model


        Unindent ->
            apply (Rte.changeIndent -1) model


        Unlink ->
            ( { model | rte = Rte.unlink model.rte }
            , Cmd.none 
            )


view : Model -> Browser.Document Msg
view model =   
    let
        rteCss =
            [ Attr.class "RTE" ]
    in
    { title = "RTE demo"
    , body =        
        [ div
            [ Attr.class "Wrap" ]
            [ toolbar model

            , inputBox model.inputBox

            , Html.map Internal (Rte.view rteCss model.rte)
                {- The editor must be positioned relative to the html body,
                   (= it should never be inside a node with a "position: relative" style attribute),
                   because the cursor is positioned using absolute coordinates.
                   To see what goes wrong otherwise, try replacing the line above with this:
                    
                    div
                        [ Attr.style "position" "relative" ]
                        [ Html.map Internal (Rte.view css model.rte) ]
                -}

            , Html.a
                [ Attr.href "https://github.com/dkodaj/rte" 
                , Attr.class "Source"
                ]
                [ text "Source" ]

            , Html.a
                [ Attr.href "/rte/icon-credits.html" 
                , Attr.class "Source"
                ]
                [ text "Icon Credits" ]
            ]
        ]
    }


--== Helpers in ABC order ==--


emoji : Rte.Content
emoji =
    Rte.unicode 128537


inputBox : Maybe InputBox -> Html Msg
inputBox state =
    case Maybe.map inputBoxProps state of
        Just props ->
            let
                value =
                    if props.content == "" then
                        Attr.placeholder props.placeholder
                    else
                        Attr.value props.content
                    
            in
            div
                [ Attr.class "InputBox" ]
                [ Html.input
                    [ value
                    , Attr.type_ "text"
                    , Events.onInput props.inputMsg
                    , Attr.id "InputBox"
                    ] []

                , Html.button
                    [ Events.onClick (props.okMsg props.content) ]
                    [ text "Ok" ]
                ]

        Nothing ->
            div
                [ Attr.class "InputBox" 
                , Attr.style "visibility" "hidden"
                ]
                [ Html.input
                    [ Attr.type_ "text" ] []

                , Html.button
                    [ ]
                    [ text "Ok" ]
                ]


inputBoxProps : InputBox -> InputBoxProps
inputBoxProps x =
    case x of
        ImageInputBox str ->
            { content = str
            , inputMsg = ImageInput
            , okMsg = ImageAdd
            , placeholder = "Image url"
            }

        LinkInputBox str ->
            { content = str
            , inputMsg = LinkInput
            , okMsg = LinkAdd
            , placeholder = "Link url"
            }


icon : String -> Msg -> Html Msg
icon img msg =
    Html.img
        [ Attr.src ("/rte/icon/" ++ img ++ ".svg")
        , Attr.class "Icon"
        , Events.onClick msg
        ]
        []


selectDecode : (String -> Maybe Msg) -> Decode.Decoder Msg
selectDecode check =
    let
        f x =
            case check x of
                Just msg ->
                    Decode.succeed msg

                Nothing ->
                    Decode.fail "bad value"
    in
    Decode.at ["target","value"]
        ( Decode.string |> Decode.andThen f )


selectFont : Maybe String -> Html Msg
selectFont maybeFontName =
    let
        fonts =
            [ ("Oswald","sans-serif")
            , ("Playfair Display", "serif")
            , ("Ubuntu Mono","monospace")
            ]

        selected x =
            case maybeFontName of
                Nothing -> False
                Just y -> x == y

        placeholder =
            Html.option
                [ Attr.disabled True
                , Attr.selected (maybeFontName == Nothing)
                ]
                [ text "font" ]

        o (x,y) =
            Html.option
                [ Attr.value x
                , Attr.selected (selected x)
                ]
                [ text x ]

        toMsg x =
            case List.filter (\(a,b)-> a == x ) fonts of
                (_,y) :: _ -> Just (Font [x,y])
                [] -> Nothing
    in
    Html.select
        [ Events.on "change" (selectDecode toMsg) ]
        ( placeholder :: List.map o fonts )


selectFontSize : Maybe Float -> Html Msg
selectFontSize maybeSize =    
    let
        selected x =
            case maybeSize of
                Nothing -> False
                Just y -> toFloat x == y

        toMsg x =
            Maybe.map FontSize (String.toFloat x)
        
        o x =
            Html.option
                [ Attr.value (String.fromInt x) 
                , Attr.selected (selected x)
                ]
                [ text (String.fromInt x) ]

        placeholder =
            Html.option
                [ Attr.disabled True
                , Attr.selected (maybeSize == Nothing)
                ]
                [ text "size" ]

        range x y =
            List.range 0 ((y-x)//2)
                |> List.map (\a -> 2*a)
                    |> List.map (\a -> a + x)
    in
    Html.select
        [ Events.on "change" (selectDecode toMsg) ]
        ( placeholder :: List.map o (range 6 30) )


toolbar : Model -> Html Msg
toolbar model =
    div
        [ Attr.class "Toolbar" ]
        [ icon "Bold" Bold
        , icon "Italic"  Italic
        , icon "Underline"  Underline
        , icon "Strikethrough"  StrikeThrough
        , icon "Undo" Undo
        , icon "Left" (TextAlign Rte.Left)
        , icon "Center" (TextAlign Rte.Center)
        , icon "Right" (TextAlign Rte.Right)
        , icon "Unindent"  Unindent
        , icon "Indent"  Indent
        , icon "Heading"  Heading
        , icon "Coding" Code
        , icon "Emoji" Emoji
        , icon "Link"  ToggleLinkBox
        , icon "Unlink" Unlink
        , icon "Picture" ToggleImageBox
        , selectFontSize model.rte.fontStyle.fontSize
        , selectFont (List.head model.rte.fontStyle.fontFamily)
        ]

