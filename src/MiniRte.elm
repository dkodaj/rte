module MiniRte exposing (
      display
    , displayStyled
    , DisplayParams
    , emojiBox
    , EmojiBoxParams
    , emojiBoxStyled
    , encodedContent
    , fontSelector
    , FontSelectorParams
    , fontSelectorStyled
    , fontSizeSelector
    , FontSizeSelectorParams
    , fontSizeSelectorStyled
    , init
    , initStyled
    , inputBox
    , inputBoxStyled
    , InputBoxParams
    , isActive
    , Msg(..)
    , onOffSwitch
    , onOffSwitchStyled
    , Parameters
    , Rte
    , RteStyled
    , subscriptions
    , subscriptionsStyled
    , SwitchParams
    , textarea
    , textareaStyled
    , textContent
    , update
    , updateStyled
    )

{-|
# Init and update
@docs init, Rte, initStyled, RteStyled, Parameters, subscriptions, subscriptionsStyled, update, updateStyled

# View
@docs textarea, textareaStyled, display, displayStyled, DisplayParams

# Toolbar
@docs emojiBox, emojiBoxStyled, EmojiBoxParams, fontSelector, fontSelectorStyled, FontSelectorParams,
fontSizeSelector, fontSizeSelectorStyled, FontSizeSelectorParams, inputBox, inputBoxStyled, InputBoxParams,
onOffSwitch, onOffSwitchStyled, SwitchParams, Msg

# Info
@docs encodedContent, isActive, textContent

-}


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
import MiniRte.Types
import Task


--== Main types ==--

{-| -}
type alias Rte msg =
    { emojiBox : Bool
    , inputBox : Maybe InputBox
    , styling :
        { active : List (Html.Attribute msg)
        , inactive : List (Html.Attribute msg)
        }
    , tagger : Msg -> msg
    , textarea : MiniRte.Core.Editor
    }


{-| -}
type alias RteStyled msg =
    { emojiBox : Bool
    , inputBox : Maybe InputBox
    , styling :
        { active : List (Html.Styled.Attribute msg)
        , inactive : List (Html.Styled.Attribute msg)
        }
    , tagger : Msg -> msg
    , textarea : MiniRte.Core.Editor
    }


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


{-| For toolbar icons or shortcut keys. See the [example](https://github.com/dkodaj/rte/tree/master/example) for tips.

      Active Bool       -- turn editing on/off
    | AddText String    -- insert text
    | Bold              -- make text bold
    | Class String      -- put a class on current paragraph 
    | Core MiniRte.Core.Msg -- normally, you won't need this
    | Cut
    | Copy
    | Font (List String)-- set current font families
                        -- e.g. ["Oswald", "sans-serif"]
    | FontSize Float    -- set current font size
    | FromBrowserClipboard String
                        -- see package description
    | Heading           -- toggles between h1 and plain div
    | ImageAdd String   -- embed image (the String is a link)
    | ImageInput String -- normally, you won't need this
    | Indent            -- increase indent of current para
    | Italic            -- make text italic
    | LinkAdd String    -- add link to current selection
    | LinkInput String  -- normally, you won't need this
    | NoOp              -- normally, you won't need this
    | StrikeThrough     -- cross out text
    | TextAlign MiniRte.Types.TextAlign
                        -- change alignment of current para
    | ToBrowserClipboard String
                        -- see package description
    | ToggleEmojiBox    -- turn emoji input box on/off
    | ToggleImageBox    -- turn image link input box on/off
    | ToggleLinkBox     -- turn link input box on/off
    | Underline         -- underline text
    | Undo              -- undo last action
    | Unindent          -- decrease indent of current para
    | Unlink            -- remove the link the cursor is touching
-}
type Msg =
      Active Bool 
    | AddText String
    | Bold
    | Class String
    | Core MiniRte.Core.Msg
    | Cut
    | Copy
    | Font (List String)
    | FontSize Float
    | FromBrowserClipboard String
    | Heading
    | ImageAdd String
    | ImageInput String
    | Indent
    | Italic
    | LinkAdd String
    | LinkInput String
    | NoOp
    | StrikeThrough
    | TextAlign MiniRte.Types.TextAlign
    | ToBrowserClipboard String
    | ToggleEmojiBox
    | ToggleImageBox
    | ToggleLinkBox
    | Underline
    | Undo
    | Unindent
    | Unlink


--== Subsidiary types ==--

{-| `content` can be plain text or a json string created with [encodedContent](#encodedContent).

`fontSizeUnit` defaults to `"px"`.
    
`indentUnit` defaults to `(50,"px")`.
-}
type alias DisplayParams a =
    { content : String
    , fontSizeUnit : Maybe String
    , highlighter : Maybe (MiniRte.Types.Content -> MiniRte.Types.Content)
    , indentUnit : Maybe (Float, String)
    , styling : List a
    }


{-|
-}
type alias EmojiBoxParams a =
    { styling : 
        { active : List a
        , inactive : List a
        }
    , emojis : List String
    }


{-|
-}
type alias FontSelectorParams a =
    { styling : List a
    , fonts : List (List String)
    }


{-|
-}
type alias FontSizeSelectorParams a =
    { styling : List a
    , sizes : List Float
    }


type InputBox =
      ImageInputBox String
    | LinkInputBox String


type alias InputBoxBehaviour =
    { content : String
    , inputMsg : String -> Msg
    , okMsg : String -> Msg
    , placeholder : String
    }


{-|
-}
type alias InputBoxParams a =
    { styling :
        { active : List a
        , inactive : List a
        }
    }


{-| `id` must be unique; it is used to monitor the position of characters.

`content` is the initial content of the textarea. It can be `Just` some plain text or a json string generated by [encodedContent](#encodedContent).

`fontSizeUnit` defaults to `"px"`.

`highlighter` runs before each view update and it re-styles the text. See the [example](https://github.com/dkodaj/rte/tree/master/example).

`indentUnit` defaults to `(50,"px")`.

`selectionStyle` controls the appearance of selected text. It defaults to `[("background", "hsl(217,71%,53%)"), ("color", "white")]`.

`styling.active` styles the textarea in active mode (when editing). Use `update (Active True/False)` to switch between modes.

`tagger` turns the package's own [Msg](#Msg) type into your app's msg.
-}
type alias Parameters a msg =
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


{-|
-}
type alias SwitchParams =
    { activeColor : String
    , inactiveColor : String
    , width : Float   
    }
    

--== Main functions ==--

{-|
-}
init : Parameters (Html.Attribute msg) msg -> ( Rte msg, Cmd msg )
init =
    initFrame


{-| Same as `init` but you pss in lists of [Html.Styled.Attributes](https://package.elm-lang.org/packages/rtfeldman/elm-css/latest/Html-Styled-Attributes) in [`Parameters`](#Parameters).
-}
initStyled : Parameters (Html.Styled.Attribute msg) msg -> ( RteStyled msg, Cmd msg )
initStyled =
    initFrame


initFrame : Parameters a msg -> ( RteFrame a msg, Cmd msg )
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


{-|
-}
subscriptions : Rte msg -> Sub msg
subscriptions =
    subscriptionsFrame


{-|
-}
subscriptionsStyled : RteStyled msg -> Sub msg
subscriptionsStyled =
    subscriptionsFrame


subscriptionsFrame : RteFrame a msg-> Sub msg
subscriptionsFrame model =
    Sub.map (model.tagger << Core) (MiniRte.Core.subscriptions model.textarea)


{-|
-}
update : Msg -> Rte msg -> ( Rte msg, Cmd msg )
update =
    updateFrame


{-|
-}
updateStyled : Msg -> RteStyled msg -> ( RteStyled msg, Cmd msg )
updateStyled =
    updateFrame


apply : ( MiniRte.Core.Editor -> (MiniRte.Core.Editor, Cmd MiniRte.Core.Msg) ) -> RteFrame a msg -> ( RteFrame a msg, Cmd msg )
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
    if model.textarea.state == MiniRte.Core.Display && msg /= Active True then
        ( model, Cmd.none )
    else
        case msg of
            Active bool ->
                let
                    state =
                        if bool then MiniRte.Core.Edit else MiniRte.Core.Display
                in
                apply (MiniRte.Core.state state) { model | inputBox = Nothing }

            AddText str ->
                apply (MiniRte.Core.addText str) model


            Bold ->
                apply MiniRte.Core.toggleBold model


            Class x ->
                apply (MiniRte.Core.toggleParaClass x) model


            Copy ->
                apply (MiniRte.Core.update MiniRte.Core.Copy) model


            Core rteMsg ->
                apply (MiniRte.Core.update rteMsg) model


            Cut ->
                apply (MiniRte.Core.update MiniRte.Core.Cut) model


            Font family ->
                apply (MiniRte.Core.fontFamily family) model


            FontSize float ->
                apply (MiniRte.Core.fontSize float) model


            FromBrowserClipboard txt ->
                apply (MiniRte.Core.update (MiniRte.Core.Paste txt)) model


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
                            MiniRte.Core.state MiniRte.Core.Edit editor1

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
                        (MiniRte.Core.state MiniRte.Core.Edit)
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
                        apply (MiniRte.Core.state MiniRte.Core.Edit) { model | inputBox = Nothing }

                    _ ->
                        let
                            ( newmodel, cmd ) = 
                                apply (MiniRte.Core.state MiniRte.Core.Freeze) model
                        in
                        ( { newmodel | inputBox = Just (ImageInputBox "") }
                        , Task.attempt (\_ -> model.tagger NoOp) (Dom.focus (inputBoxId model))
                        )


            ToggleLinkBox ->
                case model.inputBox of
                    Just (LinkInputBox _) ->
                        apply (MiniRte.Core.state MiniRte.Core.Edit) { model | inputBox = Nothing }

                    _ ->
                        let
                            ( newmodel, cmd ) = 
                                apply (MiniRte.Core.state MiniRte.Core.Freeze) model

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


--== Helpers in ABC order ==--

{-| Display formatted text, without an editor.

If you want to preserve the option of editing it, create an editor with [init](#init) and put it in passive mode with `update (Active False)`.
-}
display : (Msg -> msg) -> DisplayParams (Html.Attribute msg) -> Html msg
display tagger p =
    let
        styledParams =
            { content = p.content
            , fontSizeUnit = p.fontSizeUnit
            , highlighter = p.highlighter
            , indentUnit = p.indentUnit
            , styling = tostyled p.styling
            }
    in
    Html.Styled.toUnstyled
        <| displayStyled tagger styledParams


{-|
-}
displayStyled : (Msg -> msg) -> DisplayParams (Html.Styled.Attribute msg) -> Html.Styled.Html msg
displayStyled tagger p =
    MiniRte.Core.showContentInactive p.styling p.fontSizeUnit p.highlighter p.indentUnit (tagger << Core) p.content


{-|
-}
emojiBox : Rte msg -> EmojiBoxParams (Html.Attribute msg) -> Html msg
emojiBox rte params =
    let
        styledParams =
            { emojis = params.emojis
            , styling = tostyled3 params.styling 
            }
    in
    Html.Styled.toUnstyled
        <| emojiBoxStyled (tostyled2 rte) styledParams


{-|
-}
emojiBoxStyled : RteStyled msg -> EmojiBoxParams (Html.Styled.Attribute msg) -> Html.Styled.Html msg
emojiBoxStyled rte params =    
    let
        styling =
            if rte.emojiBox then params.styling.active else params.styling.inactive

        toDiv x =
            div
                [ Html.Styled.Events.onClick (rte.tagger (AddText x)) 
                , css [cursor pointer]
                ]
                [ text x ]
    in    
    div
        styling
        (List.map toDiv params.emojis)    


{-| Serialize the content of the textarea, including formatting, links, and images.
You can write the result into a database and use it later with [init](#init) or [display](#display).
Suitable for both `Rte` and `RteStyled`.
-}
encodedContent : { a | textarea : MiniRte.Core.Editor } -> String
encodedContent rte =
    MiniRte.Core.encode rte.textarea
   

{-|
-}
fontSelector : Rte msg-> FontSelectorParams (Html.Attribute msg) -> Html msg
fontSelector rte params =
    let
        styledParams =
            { fonts = params.fonts
            , styling = tostyled params.styling 
            }
    in
    Html.Styled.toUnstyled
        <| fontSelectorStyled (tostyled2 rte) styledParams


{-|
-}
fontSelectorStyled : RteStyled msg-> FontSelectorParams (Html.Styled.Attribute msg) -> Html.Styled.Html msg
fontSelectorStyled rte params =
    let
        maybeFontName =
            List.head rte.textarea.fontStyle.fontFamily

        selected x =
            case maybeFontName of
                Nothing -> False
                Just y -> x == y

        placeholder =
            Html.Styled.option
                [ Html.Styled.Attributes.disabled True
                , Html.Styled.Attributes.selected (maybeFontName == Nothing)
                ]
                [ text "font" ]

        o xs =
            case xs of
                [] -> div [] []
                x :: _ ->
                    Html.Styled.option
                        [ Html.Styled.Attributes.value x
                        , Html.Styled.Attributes.selected (selected x)
                        ]
                        [ text x ]

        msg x =
            case List.filter (\a -> List.head a == Just x ) params.fonts of
                xs :: _ -> Just (rte.tagger (Font xs))
                [] -> Nothing
    in
    Html.Styled.select
        ( Html.Styled.Events.on "change" (selectDecode msg) :: params.styling )
        ( placeholder :: List.map o params.fonts )


{-|
-}
fontSizeSelector : Rte msg-> FontSizeSelectorParams (Html.Attribute msg) -> Html msg
fontSizeSelector rte params =
    let
        styledParams =
            { sizes = params.sizes
            , styling = tostyled params.styling 
            }
    in
    Html.Styled.toUnstyled
        <| fontSizeSelectorStyled (tostyled2 rte) styledParams


{-|
-}
fontSizeSelectorStyled : RteStyled msg-> FontSizeSelectorParams (Html.Styled.Attribute msg) -> Html.Styled.Html msg
fontSizeSelectorStyled rte params =    
    let
        maybeSize =
            rte.textarea.fontStyle.fontSize

        selected x =
            case maybeSize of
                Nothing -> False
                Just y -> x == y

        msg x =
            Maybe.map (rte.tagger << FontSize) (String.toFloat x)
        
        o x =
            Html.Styled.option
                [ Html.Styled.Attributes.value (String.fromFloat x) 
                , Html.Styled.Attributes.selected (selected x)
                ]
                [ text (String.fromFloat x) ]

        placeholder =
            Html.Styled.option
                [ Html.Styled.Attributes.disabled True
                , Html.Styled.Attributes.selected (maybeSize == Nothing)
                ]
                [ text "size" ]
    in
    Html.Styled.select
        ( Html.Styled.Events.on "change" (selectDecode msg) :: params.styling )
        ( placeholder :: List.map o params.sizes )


{-|
-}
inputBox : Rte msg-> InputBoxParams (Html.Attribute msg) -> Html msg
inputBox rte params =
    Html.Styled.toUnstyled <|
        inputBoxStyled
            (tostyled2 rte)
            { styling = tostyled3 params.styling }


inputBoxId : RteFrame a msg -> String
inputBoxId rte =
    rte.textarea.editorID ++ "InputBox"


{-|
-}
inputBoxStyled : RteStyled msg-> InputBoxParams (Html.Styled.Attribute msg) -> Html.Styled.Html msg
inputBoxStyled rte params =
    case Maybe.map inputBoxBehaviour rte.inputBox of
        Just behaviour ->
            let
                value =
                    if behaviour.content == "" then
                        Html.Styled.Attributes.placeholder behaviour.placeholder
                    else
                        Html.Styled.Attributes.value behaviour.content                    
            in
            div
                params.styling.active
                ( List.map (Html.Styled.map rte.tagger)
                    [ Html.Styled.input
                        [ value
                        , Html.Styled.Attributes.type_ "text"
                        , Html.Styled.Events.onInput behaviour.inputMsg
                        , Html.Styled.Attributes.id (inputBoxId rte)
                        ] []

                    , Html.Styled.button
                        [ Html.Styled.Events.onClick (behaviour.okMsg behaviour.content) ]
                        [ text "Ok" ]
                    ]
                )

        Nothing ->
            div
                params.styling.inactive
                [ Html.Styled.input
                    [ Html.Styled.Attributes.type_ "text" ]
                    []

                , Html.Styled.button
                    []
                    [ text "Ok" ]
                ]


inputBoxBehaviour : InputBox -> InputBoxBehaviour
inputBoxBehaviour x =
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


{-| Checks if the editor is active. Suitable for both `Rte` and `RteStyled`.
-}
isActive : { a | textarea : MiniRte.Core.Editor } -> Bool
isActive rte =
    rte.textarea.state /= MiniRte.Core.Display


{-|
-}
onOffSwitch : Rte msg-> SwitchParams -> Html msg
onOffSwitch rte params =
    Html.Styled.toUnstyled <| onOffSwitchStyled (tostyled2 rte) params


{-|
-}
onOffSwitchStyled : RteStyled msg-> SwitchParams -> Html.Styled.Html msg
onOffSwitchStyled rte params =
    let
        switch =
            [ position relative
            , Css.display inlineBlock
            , height (px (0.57*params.width))
            , width (px params.width)
            ]

        checked =
            rte.textarea.state /= MiniRte.Core.Display

        sliderColor =
            if checked then params.inactiveColor else params.activeColor

        pos =
            if checked then
                transforms [translateX (px (0.43*params.width))]
            else
                transforms []

        slider =
            [ position absolute
            , cursor pointer
            , top (px 0)
            , left (px 0)
            , right (px 0)
            , bottom (px 0)
            , property "background-color" sliderColor
            , transition [ Css.Transitions.backgroundColor 400 ]
            , borderRadius  (px (0.57*params.width))
            , before
                [ position absolute
                , property "content" "''"
                , height (px (0.43*params.width))
                , width (px (0.43*params.width))
                , left (px (0.067*params.width))
                , bottom (px (0.067*params.width))
                , backgroundColor (hex "FFFFFF")
                , transition [ Css.Transitions.transform 400 ]
                , pos
                , borderRadius (pc 50)
                ]
            ]
    in
    Html.Styled.map rte.tagger
    <| Html.Styled.label
        [ css switch ]
        [ Html.Styled.span
            [ css slider
            , Html.Styled.Events.onClick (Active (not checked))
            ]
            []
        ]


selectDecode : (String -> Maybe msg) -> Decoder msg
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


{-| The plain text content of the textarea. Suitable for both `Rte` and `RteStyled`.
-}
textContent : { a | textarea : MiniRte.Core.Editor } -> String
textContent rte =
    MiniRte.Core.toText rte.textarea.content


{-| Displays the edited text plus the cursor. This object *must not* be the child of a `position: relative` node. It screws up cursor placement.    
-}
textarea :  Rte msg-> Html msg
textarea rte =
    Html.Styled.toUnstyled <| textareaStyled (tostyled2 rte)


{-| Same as `textarea` but outputs [Html.Styled.Html](https://package.elm-lang.org/packages/rtfeldman/elm-css/latest/Html-Styled).
-}
textareaStyled :  RteStyled msg-> Html.Styled.Html msg
textareaStyled rte =
    let
        styling =
            if rte.textarea.state == MiniRte.Core.Display then
                rte.styling.inactive
            else
                rte.styling.active
    in
    MiniRte.Core.view (rte.tagger << Core) styling rte.textarea


tostyled : List (Html.Attribute msg) -> List (Html.Styled.Attribute msg)
tostyled =
    List.map Html.Styled.Attributes.fromUnstyled


tostyled2 : Rte msg -> RteStyled msg
tostyled2 rte =
    { emojiBox = rte.emojiBox
    , inputBox = rte.inputBox
    , styling = tostyled3 rte.styling
    , tagger = rte.tagger
    , textarea = rte.textarea
    }


tostyled3 :
    { active : List (Html.Attribute msg), inactive : List (Html.Attribute msg) } ->
    { active : List (Html.Styled.Attribute msg), inactive : List (Html.Styled.Attribute msg) }
tostyled3 a =
    { active = tostyled a.active
    , inactive = tostyled a.inactive
    }
