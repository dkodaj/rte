module MiniRte.Common exposing
    ( RteFrame
    , init
    , inputBoxId
    , subscriptions
    , update
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
import MiniRte.Types exposing (Content, InputBox(..), Msg(..))
import MiniRte.TypesThatAreNotPublic exposing (..)
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
    , characterLimit : Maybe Int
    , content : Content
    , fontSizeUnit : Maybe String
    , highlighter : Maybe (MiniRte.Types.Content -> MiniRte.Types.Content)
    , indentUnit : Maybe ( Float, String )
    , pasteImageLinksAsImages : Bool
    , pasteLinksAsLinks : Bool
    , selectionStyle : List ( String, String )
    , styling :
        { active : List a
        , inactive : List a
        }
    , tagger : Msg -> msg
    }


init : ParametersFrame a msg -> ( RteFrame a msg, Cmd msg )
init params =
    let
        ( editor, cmd ) =
            MiniRte.Core.initWithContent params.content params.id            

        style ( x, y ) =
            Html.Styled.Attributes.style x y
    in
    ( { emojiBox = False
      , inputBox = Nothing
      , styling =
            { active = params.styling.active
            , inactive = params.styling.inactive
            }
      , textarea =
            { editor
                | characterLimit = params.characterLimit
                , fontSizeUnit = params.fontSizeUnit
                , highlighter = params.highlighter
                , pasteImageLinksAsImages = params.pasteImageLinksAsImages
                , pasteLinksAsLinks = params.pasteLinksAsLinks
                , selectionStyle =
                    if params.selectionStyle == [] then
                        editor.selectionStyle

                    else
                        List.map style params.selectionStyle
            }
      , tagger = params.tagger
      }
    , Cmd.map params.tagger cmd
    )


subscriptions : RteFrame a msg -> Sub msg
subscriptions model =
    Sub.map model.tagger (MiniRte.Core.subscriptions model.textarea)


apply : (MiniRte.Core.Editor -> ( MiniRte.Core.Editor, Cmd Msg )) -> RteFrame a msg -> ( RteFrame a msg, Cmd msg )
apply f model =
    let
        ( editor, cmd ) =
            f model.textarea
    in
    ( { model | textarea = editor }    
    , Cmd.map model.tagger cmd
    )


update : Msg -> RteFrame a msg -> ( RteFrame a msg, Cmd msg )
update msg model =
    if model.textarea.state == Display && not (relevantInDisplayMode msg) then
        ( model, Cmd.none )
    else
        case msg of
            Active bool ->
                let
                    state =
                        if bool then
                            Edit

                        else
                            Display
                in
                ( { model | inputBox = Nothing, textarea = MiniRte.Core.state state model.textarea }
                , Cmd.none 
                )

            AddContent xs ->
                apply (MiniRte.Core.addContent xs) model

            AddCustomHtml html ->
                apply (MiniRte.Core.embed html) model

            AddImage str ->
                if str == "" then
                    ( { model | inputBox = Nothing }, Cmd.none )
                else
                    let
                        ( textarea, cmd ) =
                            MiniRte.Core.addImage str model.textarea
                    in
                    ( { model
                        | inputBox = Nothing
                        , textarea = MiniRte.Core.state Edit textarea
                      }

                    , Cmd.map model.tagger cmd
                    )

            AddLink href ->
                if href == "" then
                    ( { model | inputBox = Nothing }, Cmd.none )
                else                    
                    ( { model
                        | inputBox = Nothing
                        , textarea =
                            MiniRte.Core.link href model.textarea
                            |> MiniRte.Core.state Edit
                      }
                    , Cmd.none
                    )

            AddText str ->
                apply (MiniRte.Core.addText str) model

            Bold ->
                apply MiniRte.Core.toggleBold model

            CharacterLimitReached _ ->
                ( model, Cmd.none )

            Class x ->
                apply (MiniRte.Core.toggleParaClass x) model

            Copy ->
                apply MiniRte.Core.copy model

            Cut ->
                apply MiniRte.Core.cut model

            Font family ->
                { model | textarea = MiniRte.Core.state Edit model.textarea }
                |> apply (MiniRte.Core.fontFamily family) 

            FontSize float ->
                { model | textarea = MiniRte.Core.state Edit model.textarea }
                |> apply (MiniRte.Core.fontSize float)

            FreezeEditor ->
                ( { model | textarea = MiniRte.Core.state Freeze model.textarea }
                , Cmd.none
                )

            FromBrowserClipboard txt ->
                apply (MiniRte.Core.update (Paste txt)) model

            Heading ->
                apply (MiniRte.Core.toggleNodeType "h1") model

            ImageSourceInput str ->
                ( { model | inputBox = Just (ImageInputBox str) }
                , Cmd.none
                )

            Indent ->
                apply (MiniRte.Core.changeIndent 1) model

            Internal subMsg ->
                apply (MiniRte.Core.update subMsg) model

            Italic ->
                apply MiniRte.Core.toggleItalic model

            LoadContent content ->
                apply (\x -> ( MiniRte.Core.loadContent content x, Cmd.none )) model

            LoadText txt ->
                apply (\x -> ( MiniRte.Core.loadText txt x, Cmd.none )) model

            LinkHrefInput str ->
                ( { model | inputBox = Just (LinkInputBox str) }
                , Cmd.none
                )

            NodeType str ->                
                apply (MiniRte.Core.toggleNodeType str) model

            Selection x ->
                apply (MiniRte.Core.selectRange x) model

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
                        ( { model 
                            | inputBox = Nothing 
                            , textarea = MiniRte.Core.state Edit model.textarea
                          }
                        , Cmd.none
                        )

                    _ ->
                        ( { model
                            | inputBox = Just (ImageInputBox "") 
                            , textarea = MiniRte.Core.state Freeze model.textarea
                          }                          

                        , Task.attempt (\_ -> model.tagger (Internal NoOp)) (Dom.focus (inputBoxId model))
                        )

            ToggleLinkBox ->
                case model.inputBox of
                    Just (LinkInputBox _) ->
                        ( { model 
                            | inputBox = Nothing 
                            , textarea = MiniRte.Core.state Edit model.textarea
                          }
                        , Cmd.none
                        )

                    _ ->
                        let
                            currentLink =
                                Maybe.withDefault "" (MiniRte.Core.currentLink model.textarea)
                        in
                        ( { model
                            | inputBox = Just (LinkInputBox currentLink) 
                            , textarea = MiniRte.Core.state Freeze model.textarea
                          }

                        , Task.attempt (\_ -> model.tagger (Internal NoOp)) (Dom.focus (inputBoxId model))
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


relevantInDisplayMode : Msg -> Bool
relevantInDisplayMode msg =
    case msg of
        Active _ ->
            True

        Internal _ ->
            True

        _ ->
            False
