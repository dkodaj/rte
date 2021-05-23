module MiniRte.StyledHelp exposing (
      initFrame
    , inputBoxId  
    , RteFrame
    , subscriptionsFrame
    , updateFrame
    )

import Browser.Dom as Dom
import Css exposing (..)
import Css.Transitions exposing (transition)
import Html exposing (Html)
import Html.Attributes
import Html.Styled exposing (div, text)
import Html.Styled.Attributes exposing (css)
import Html.Styled.Events
import Json.Decode as Decode exposing (Decoder)
import MiniRte.Core
import MiniRte.CoreTypes
import MiniRte.Types exposing (InputBox(..), Msg(..))
import Task


type alias RteFrame a msg =
    { emojiBox : Bool
    , inputBox : Maybe InputBox
    , styling :
        { active : List a
        , inactive : List a
        }
    , tagger : Msg -> msg
    , textarea : MiniRte.Core.Editor
    }


type alias ParametersFrame a msg =
    { id : String    
    , content : Maybe String
    , fontSizeUnit : Maybe String
    , highlighter : Maybe (MiniRte.Types.Content -> MiniRte.Types.Content)    
    , indentUnit : Maybe (Float,String)
    , selectionStyle : List (String,String) 
    , styling :
        { active : List a
        , inactive : List a
        }
    , tagger : Msg -> msg
    }



initFrame : ParametersFrame a msg -> ( RteFrame a msg, Cmd msg )
initFrame parameters =
    let
        ( editor, cmd ) =
            case parameters.content of
                Nothing ->
                    MiniRte.Core.init parameters.id

                Just txt ->
                    case MiniRte.Core.decode txt of
                        Just content ->
                            MiniRte.Core.initWithContent content parameters.id

                        Nothing ->
                            MiniRte.Core.initWithText txt parameters.id

        style (x,y) =
            Html.Styled.Attributes.style x y
    in
    ( { emojiBox = False
      , inputBox = Nothing      

      , styling =
            { active = parameters.styling.active
            , inactive = parameters.styling.inactive
            }

      , textarea =
            { editor |
                fontSizeUnit = parameters.fontSizeUnit
              , highlighter = parameters.highlighter
              , selectionStyle =
                    if parameters.selectionStyle == [] then
                        editor.selectionStyle
                    else
                        List.map style parameters.selectionStyle
            }

      , tagger = parameters.tagger  
      }
    , Cmd.map (parameters.tagger << Core) cmd
    )


subscriptionsFrame : RteFrame a msg-> Sub msg
subscriptionsFrame model =
    Sub.map (model.tagger << Core) (MiniRte.Core.subscriptions model.textarea)



apply : ( MiniRte.Core.Editor -> (MiniRte.Core.Editor, Cmd MiniRte.CoreTypes.Msg) ) -> RteFrame a msg -> ( RteFrame a msg, Cmd msg )
apply f model =
    let
        ( editor, cmd ) =
            f model.textarea        
    in
    ( { model | textarea = editor }
    , Cmd.map (model.tagger << Core) cmd
    )


updateFrame : Msg -> RteFrame a msg-> ( RteFrame a msg, Cmd msg )
updateFrame msg model =
    let
        coreOrActiveMsg =
            case msg of
                Active True -> True
                Core _ -> True
                _ -> False
    in
    if model.textarea.state == MiniRte.CoreTypes.Display && not coreOrActiveMsg then
        ( model, Cmd.none )
    else
        case msg of
            Active bool ->
                let
                    state =
                        if bool then MiniRte.CoreTypes.Edit else MiniRte.CoreTypes.Display
                in
                apply (MiniRte.Core.state state) { model | inputBox = Nothing }

            AddText str ->
                apply (MiniRte.Core.addText str) model


            Bold ->
                apply MiniRte.Core.toggleBold model


            Class x ->
                apply (MiniRte.Core.toggleParaClass x) model


            Copy ->
                apply (MiniRte.Core.update MiniRte.CoreTypes.Copy) model


            Core rteMsg ->
                case rteMsg of
                    MiniRte.CoreTypes.ToBrowserClipboard txt ->
                        ( model, Task.perform model.tagger <| Task.succeed (ToBrowserClipboard txt) )

                    _ ->
                        apply (MiniRte.Core.update rteMsg) model


            Cut ->
                apply (MiniRte.Core.update MiniRte.CoreTypes.Cut) model


            Font family ->
                apply (MiniRte.Core.fontFamily family) model


            FontSize float ->
                apply (MiniRte.Core.fontSize float) model


            FromBrowserClipboard txt ->
                apply (MiniRte.Core.update (MiniRte.CoreTypes.Paste txt)) model


            Heading ->
                apply (MiniRte.Core.toggleNodeType "h1") model


            ImageAdd str ->
                if str == "" then
                    ( { model | inputBox = Nothing }, Cmd.none )
                else
                    let
                        ( editor1, cmd1 ) =
                            MiniRte.Core.addImage str model.textarea

                        ( editor2, cmd2 ) =
                            MiniRte.Core.state MiniRte.CoreTypes.Edit editor1

                        f =
                            Cmd.map (model.tagger << Core)
                    in
                    ( { model |
                          inputBox = Nothing 
                        , textarea = editor2
                      }
                    , Cmd.batch (List.map f [cmd1, cmd2])
                    )


            ImageInput str ->
                ( { model | inputBox = Just (ImageInputBox str) }
                , Cmd.none 
                )

            
            Indent ->
                apply (MiniRte.Core.changeIndent 1) model


            Italic ->
                apply MiniRte.Core.toggleItalic model


            LinkAdd href -> 
                if href == "" then
                    ( { model | inputBox = Nothing }, Cmd.none )
                else
                    apply
                        (MiniRte.Core.state MiniRte.CoreTypes.Edit)
                        { model |
                            inputBox = Nothing 
                          , textarea = MiniRte.Core.link href model.textarea
                        }


            LinkInput str ->
                ( { model | inputBox = Just (LinkInputBox str) }
                , Cmd.none 
                )


            NoOp ->
                ( model, Cmd.none )


            StrikeThrough ->
                apply MiniRte.Core.toggleStrikeThrough model


            TextAlign alignment ->
                apply (MiniRte.Core.textAlign alignment) model


            ToBrowserClipboard txt ->
                ( model, Cmd.none )


            ToggleEmojiBox ->
                ( { model | emojiBox = not model.emojiBox }, Cmd.none )


            ToggleImageBox ->                   
                case model.inputBox of
                    Just (ImageInputBox _) ->
                        apply (MiniRte.Core.state MiniRte.CoreTypes.Edit) { model | inputBox = Nothing }

                    _ ->
                        let
                            ( newmodel, cmd ) = 
                                apply (MiniRte.Core.state MiniRte.CoreTypes.Freeze) model
                        in
                        ( { newmodel | inputBox = Just (ImageInputBox "") }
                        , Task.attempt (\_ -> model.tagger NoOp) (Dom.focus (inputBoxId model))
                        )


            ToggleLinkBox ->
                case model.inputBox of
                    Just (LinkInputBox _) ->
                        apply (MiniRte.Core.state MiniRte.CoreTypes.Edit) { model | inputBox = Nothing }

                    _ ->
                        let
                            ( newmodel, cmd ) = 
                                apply (MiniRte.Core.state MiniRte.CoreTypes.Freeze) model

                            currentLink =
                                Maybe.withDefault "" (MiniRte.Core.currentLink model.textarea)
                        in
                        ( { newmodel |  inputBox = Just (LinkInputBox currentLink) }
                        , Task.attempt (\_ -> model.tagger NoOp) (Dom.focus (inputBoxId model))
                        )


            Underline ->
                apply MiniRte.Core.toggleUnderline model


            Undo ->
                apply MiniRte.Core.undo model


            Unindent ->
                apply (MiniRte.Core.changeIndent -1) model


            Unlink ->
                ( { model | textarea = MiniRte.Core.unlink model.textarea }
                , Cmd.none 
                )


inputBoxId : RteFrame a msg -> String
inputBoxId rte =
    rte.textarea.editorID ++ "InputBox"
