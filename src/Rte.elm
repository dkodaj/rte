module Rte exposing (main)

import Browser
import Browser.Dom as Dom
import Highlight
import Html.Styled as Html exposing (div, Html, text)
import Html.Styled.Attributes as Attr
import Html.Styled.Events as Events
import Json.Decode as Decode
import Rte.Core
import SampleContent
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
    , rte : Rte.Core.Editor 
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
    | Internal Rte.Core.Msg
    | Italic
    | LinkAdd String
    | LinkInput String
    | NoOp
    | StrikeThrough
    | Switch Bool
    | TextAlign Rte.Core.TextAlign
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
            Rte.Core.initWith SampleContent.json "MyRTE"
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
    Sub.map Internal (Rte.Core.subscriptions model.rte)


apply : ( Rte.Core.Editor -> (Rte.Core.Editor, Cmd Rte.Core.Msg) ) -> Model -> ( Model, Cmd Msg )
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
    if model.rte.state == Rte.Core.Display && msg /= Switch True then
        ( model, Cmd.none )
    else
        case msg of
            Bold ->
                apply Rte.Core.toggleBold model


            Code ->
                apply (Rte.Core.toggleParaClass "Code") model


            Emoji ->
                apply (Rte.Core.addText "🤪") model


            Font family ->
                apply (Rte.Core.fontFamily family) model


            FontSize float ->
                apply (Rte.Core.fontSize float) model


            Heading ->
                apply (Rte.Core.toggleNodeType "h1") model


            ImageAdd str ->
                if str == "" then
                    ( { model | inputBox = Nothing }, Cmd.none )
                else
                    let
                        ( rte1, rteCmd1 ) =
                            Rte.Core.addImage str model.rte

                        ( rte2, rteCmd2 ) =
                            Rte.Core.state Rte.Core.Edit rte1

                        toCmd =
                            Cmd.map Internal
                    in
                    ( { model |
                          inputBox = Nothing 
                        , rte = rte1
                      }
                    , Cmd.batch (List.map toCmd [rteCmd1, rteCmd2])
                    )


            ImageInput str ->
                ( { model | inputBox = Just (ImageInputBox str) }
                , Cmd.none 
                )

            
            Indent ->
                apply (Rte.Core.changeIndent 1) model


            Internal rteMsg ->
                apply (Rte.Core.update rteMsg) model


            Italic ->
                apply Rte.Core.toggleItalic model


            LinkAdd href -> 
                if href == "" then
                    ( { model | inputBox = Nothing }, Cmd.none )
                else
                    apply
                        (Rte.Core.state Rte.Core.Edit)
                        { model |
                            inputBox = Nothing 
                          , rte = Rte.Core.link href model.rte
                        }


            LinkInput str ->
                ( { model | inputBox = Just (LinkInputBox str) }
                , Cmd.none 
                )


            NoOp ->
                ( model, Cmd.none )


            Switch bool ->
                let
                    state =
                        if bool then Rte.Core.Edit else Rte.Core.Display
                in
                apply (Rte.Core.state state) { model | inputBox = Nothing }


            StrikeThrough ->
                apply Rte.Core.toggleStrikeThrough model


            TextAlign alignment ->
                apply (Rte.Core.textAlign alignment) model


            ToggleImageBox ->                   
                case model.inputBox of
                    Just (ImageInputBox _) ->
                        apply (Rte.Core.state Rte.Core.Edit) { model | inputBox = Nothing }

                    _ ->
                        let
                            ( newmodel, cmd ) = 
                                apply (Rte.Core.state Rte.Core.Freeze) model
                        in
                        ( { newmodel | inputBox = Just (ImageInputBox "") }
                        , Task.attempt (\_ -> NoOp) (Dom.focus "InputBox")
                        )


            ToggleLinkBox ->
                case model.inputBox of
                    Just (LinkInputBox _) ->
                        apply (Rte.Core.state Rte.Core.Edit) { model | inputBox = Nothing }

                    _ ->
                        let
                            ( newmodel, cmd ) = 
                                apply (Rte.Core.state Rte.Core.Freeze) model

                            currentLink =
                                Maybe.withDefault "" (Rte.Core.currentLink model.rte)
                        in
                        ( { newmodel |  inputBox = Just (LinkInputBox currentLink) }
                        , Task.attempt (\_ -> NoOp) (Dom.focus "InputBox")
                        )


            Underline ->
                apply Rte.Core.toggleUnderline model


            Undo ->
                apply Rte.Core.undo model


            Unindent ->
                apply (Rte.Core.changeIndent -1) model


            Unlink ->
                ( { model | rte = Rte.Core.unlink model.rte }
                , Cmd.none 
                )


view : Model -> Browser.Document Msg
view model =   
    let
        rteCss =
            if model.rte.state == Rte.Core.Display then
                [ Attr.class "Blogpost" ]
            else
                [ Attr.class "RTE" ]
    in
    { title = "RTE demo"
    , body =        
        [ Html.toUnstyled
        <| div
            [ Attr.class "Wrap" ]
            [ toolbar model

            , inputBox model.inputBox

            , Html.map Internal (Rte.Core.view rteCss model.rte)
                {- The editor must be positioned relative to the html body,
                   (= it should never be inside a "position: relative" node),
                   because the cursor is positioned using absolute coordinates.
                   To see what goes wrong otherwise, try replacing the line above with this:
                    
                    div
                        [ Attr.style "position" "relative" ]
                        [ Html.map Internal (Rte.Core.view model.rte) ]
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


switch : Bool -> Html Msg
switch checked =
    let
        class =
            if checked then "slider checked" else "slider"
    in
    Html.label
        [ Attr.class "switch" ]
        [ Html.span
            [ Attr.class class 
            , Events.onClick (Switch (not checked))
            ]
            []
        ]


toolbar : Model -> Html Msg
toolbar model =
    div
        [ Attr.class "Toolbar" ]
        [ switch (model.rte.state /= Rte.Core.Display)
        , icon "Bold" Bold
        , icon "Italic"  Italic
        , icon "Underline"  Underline
        , icon "Strikethrough"  StrikeThrough
        , icon "Undo" Undo
        , icon "Left" (TextAlign Rte.Core.Left)
        , icon "Center" (TextAlign Rte.Core.Center)
        , icon "Right" (TextAlign Rte.Core.Right)
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

