module MiniRte exposing
    ( Rte
    , init, subscriptions, update
    , textarea
    , textareaStyled
    , showContent
    , showContentStyled
    , showContentCustom
    , showContentCustomStyled
    , showEncodedContent
    , showEncodedContentStyled
    , showEncodedContentCustom
    , showEncodedContentCustomStyled
    --
    , textToContent, contentToText
    , decodeContentString
    , decodeContentGZip
    , encodeContentString
    , encodeContentGZip
    --
    , content
    , fontFamily
    , fontSize
    , freezed
    , textContent
    --
    , makePastedLinksClickable
    , setCharacterLimit
    , setFontSizeUnit
    , setHighlighter
    , setIndentUnit
    , setSelectionStyle
    , turnPastedImageLinksIntoImgElements    
    --
    , addContent
    , addCustomHtml
    , addImageWithSrc
    , addLink
    , addText
    , copy
    , cut
    , decreaseIndent
    , freeze
    , increaseIndent
    , paste
    , replaceContent
    , replaceContentString
    , setFontSize
    , setSelection
    , setTextAlignment
    , toggleBold
    , toggleClass
    , toggleFontFamily
    , toggleHeading
    , toggleItalic
    , toggleNodeType
    , toggleStrikethrough
    , toggleUnderline
    , undo
    , unlink
    , unfreeze  
    )

{-| Don't forget to hook [subscriptions](#subscriptions) and [update](#update) into your app's own `subscriptions` and `update` function. Otherwise the RTE won't do anything.

**Note**: When the RTE is active (the [textarea](#textarea) object is part of your `view`), it keeps taking away the focus from every other element. Use [freeze](#freeze) to stop this.

# Init and update

@docs Rte, init, subscriptions, update

# View

@docs textarea, showContent, showContentCustom, showEncodedContent, showEncodedContentCustom

# View Styled

Same as the previous but with `Html.Styled`.

@docs textareaStyled, showContentStyled, showContentCustomStyled, showEncodedContentStyled, showEncodedContentCustomStyled

# Configure

@docs makePastedLinksClickable, setCharacterLimit, setFontSizeUnit, setHighlighter, setIndentUnit, setSelectionStyle, turnPastedImageLinksIntoImgElements    

# Control

You can build a rich text editor toolbar from these (see the [example](https://github.com/dkodaj/rte/blob/master/example/src/Main.elm) in the repo).

@docs addContent, addCustomHtml, addImageWithSrc, addLink, addText, copy, cut, decreaseIndent, freeze, increaseIndent, paste, replaceContent
@docs replaceContentString, setFontSize, setSelection, setTextAlignment, toggleBold, toggleClass, toggleFontFamily, toggleHeading
@docs toggleItalic, toggleNodeType, toggleStrikethrough, toggleUnderline, undo, unlink, unfreeze  

# Info

@docs content, fontFamily, fontSize, freezed, textContent

# Conversions

@docs textToContent, contentToText, decodeContentString, decodeContentGZip, encodeContentString, encodeContentGZip

# Hardwired key combos

- `Ctrl-0`: en dash (–)
- `Ctrl-1`: em dash (—)
- `Ctrl-A`: select all
- `Ctrl-C`: copy (to use copied content outside the RTE, you need to add a port; see the [example](https://github.com/dkodaj/rte/blob/master/example/html/index.html))
- `Ctrl-X`: cut
- `Ctrl-Z`: undo
- `Ctrl-V`: paste (to paste stuff that was copied to the clipboard outside the RTE, you need to add a port; see the [example](https://github.com/dkodaj/rte/blob/master/example/html/index.html))

-}

import Array
import Bytes exposing (Bytes)
import Html
import Html.Styled
import Html.Styled.Attributes as Attributes exposing (css)
import Json.Decode as Decode exposing (Decoder)
import MiniRte.Core
import MiniRte.Types exposing (..)
import MiniRte.TypesThatAreNotPublic exposing (..)


{-| The rich text editor. [Under the hood](https://github.com/dkodaj/rte/blob/master/src/MiniRte/Core.elm?plain=1#L71), it is a record type that tracks cursor position, selection, formatting etc.
-}
type Rte =
    Opaque MiniRte.Core.Editor


--== Main functions ==--

{-| The string you pass in is an `id`, which must be unique.
-}
init : String -> Rte
init id =
    MiniRte.Core.init id
    |> Opaque


{-| Doesn't do anything when the RTE is [freeze](#freeze)d.
-}
subscriptions : Rte -> Sub Msg
subscriptions model =
    case model of
        Opaque rte ->
            MiniRte.Core.subscriptions rte

{-|-}
update : Msg -> Rte -> ( Rte, Cmd Msg )
update msg model =
    case ( model, msg ) of
        ( Opaque rte, FromBrowserClipboard txt ) ->
            let
                (new, cmd) =
                    MiniRte.Core.update (Paste txt) rte
            in
            ( Opaque new, cmd )

        ( Opaque rte, Internal subMsg ) ->
            let
                ( new, cmd ) =
                    MiniRte.Core.update subMsg rte
            in
            ( Opaque new, cmd )

        _ ->
            ( model, Cmd.none )


--== View ==--

{-| Display, in an uneditable div, the content generated by the RTE.
-}
showContent : Content -> List (Html.Attribute Msg) -> Html.Html Msg
showContent myContent styles =
    showContentStyled myContent (List.map Attributes.fromUnstyled styles)
    |> Html.Styled.toUnstyled

{-| Same with some parameters.
-}
showContentCustom : { fontSizeUnit : Maybe String, indentUnit : Maybe (Float,String), highlighter : Maybe (Content -> Content) } -> Content -> List (Html.Attribute Msg) -> Html.Html Msg
showContentCustom params myContent styles =
    showContentCustomStyled params myContent (List.map Attributes.fromUnstyled styles)
    |> Html.Styled.toUnstyled    

{-| Same but using a json generated with [encodeContentString](#encodeContentString).
-}
showEncodedContent : List (Html.Attribute Msg) -> String -> Html.Html Msg    
showEncodedContent styles json =
    showEncodedContentStyled (List.map Attributes.fromUnstyled styles) json
    |> Html.Styled.toUnstyled

{-| Same with some parameters.
-}
showEncodedContentCustom : { fontSizeUnit : Maybe String, indentUnit : Maybe (Float,String), highlighter : Maybe (Content -> Content) } -> List (Html.Attribute Msg) -> String -> Html.Html Msg
showEncodedContentCustom params styles json =
    showEncodedContentCustomStyled params (List.map Attributes.fromUnstyled styles) json
    |> Html.Styled.toUnstyled

{-| Show the RTE.
-}
textarea : Rte -> List (Html.Attribute Msg) -> Html.Html Msg
textarea model styles =
    textareaStyled model (List.map Attributes.fromUnstyled styles)
    |> Html.Styled.toUnstyled


--== View Styled ==--

{-|-}
showContentStyled : Content -> List (Html.Styled.Attribute Msg) -> Html.Styled.Html Msg
showContentStyled myContent styles =
    let
        params =
            { fontSizeUnit = Nothing, indentUnit = Nothing, highlighter = Nothing }
    in
    MiniRte.Core.showContentInactive params styles myContent

{-|-}
showContentCustomStyled : { fontSizeUnit : Maybe String, indentUnit : Maybe (Float,String), highlighter : Maybe (Content -> Content) } -> Content -> List (Html.Styled.Attribute Msg) -> Html.Styled.Html Msg
showContentCustomStyled params myContent styles =
    MiniRte.Core.showContentInactive params styles myContent    

{-|-}
showEncodedContentStyled : List (Html.Styled.Attribute Msg) -> String -> Html.Styled.Html Msg
showEncodedContentStyled styles json =
    let
        params =
            { fontSizeUnit = Nothing, indentUnit = Nothing, highlighter = Nothing }
    in
    MiniRte.Core.showEncodedContentInactive params styles json

{-|-}
showEncodedContentCustomStyled : { fontSizeUnit : Maybe String, indentUnit : Maybe (Float,String), highlighter : Maybe (Content -> Content) } -> List (Html.Styled.Attribute Msg) -> String -> Html.Styled.Html Msg
showEncodedContentCustomStyled params styles json =
    MiniRte.Core.showEncodedContentInactive params styles json
    

{-|-}
textareaStyled : Rte -> List (Html.Styled.Attribute Msg) -> Html.Styled.Html Msg
textareaStyled model styles =
    case model of
        Opaque rte ->
            MiniRte.Core.view styles rte


--== Configure ==--

apply0 : (MiniRte.Core.Editor -> MiniRte.Core.Editor) -> Rte -> Rte
apply0 f model =
    case model of
        Opaque rte ->
            Opaque (f rte)

{-| Control whether pasting something that begins with with `http(s)://` becomes a clickable link. Default is `False`.
-}
makePastedLinksClickable : Bool -> Rte -> Rte
makePastedLinksClickable bool rte =
    apply0 (\x -> { x | pasteLinksAsLinks = bool }) rte

{-| Prevent typing more than a certain number of characters. There is no default limit, but the RTE becomes increasingly slow for longer texts (>10-12K characters).
-}
setCharacterLimit : Int -> Rte -> Rte
setCharacterLimit int rte =
    if int < 0 then
        apply0 (\x -> { x | characterLimit = Nothing }) rte
    else
        apply0 (\x -> { x | characterLimit = Just int }) rte

{-| Defaults to `px`.
-}
setFontSizeUnit : String -> Rte -> Rte
setFontSizeUnit str rte =
    if String.trim str == "" then
        apply0 (\x -> { x | fontSizeUnit = Nothing }) rte
    else
        apply0 (\x -> { x | fontSizeUnit = Just str }) rte

{-| See [MiniRte.Types](/packages/dkodaj/rte/latest/MiniRte-Types) on highlighters.
-}
setHighlighter : Maybe (Content -> Content) -> Rte -> Rte
setHighlighter f rte =
    apply0 (\x -> { x | highlighter = f }) rte

{-| Defaults to `(50,"px")`. Matters when you use [increaseIndent](#increaseIndent) or [decreaseIndent](#decreaseIndent). 
-}
setIndentUnit : ( Float, String ) -> Rte -> Rte
setIndentUnit params rte =
    apply0 (\x -> { x | indentUnit = Just params }) rte

{-| Controls how selected text looks. Defaults to `[("background","hsl(217,71%,53%)"), ("color","hsl(0,0%,100%)")]`.
-}
setSelectionStyle : List (String, String) -> Rte -> Rte
setSelectionStyle list rte =
    let
        f (x,y) =
            Attributes.attribute x y
    in
    apply0 (\x -> { x | selectionStyle = List.map f list }) rte

{-|  When you paste an image link `x`, it becomes an img element with `src=x`.
Something qualifies as an image link iff it starts with `data:image/` or it ends with `.jpeg`, `.jpg`, `.gif`, `.png`, `.apng`, `.svg`, `.bmp`, or `.ico`.
Defaults to `False`.
-}
turnPastedImageLinksIntoImgElements : Bool -> Rte -> Rte
turnPastedImageLinksIntoImgElements bool rte =
    apply0 (\x -> { x | pasteImageLinksAsImages = bool }) rte


--== Info ==--    

{-| The edited content of the RTE.
-}
content : Rte -> Content
content model =
    case model of
        Opaque rte ->
            rte.content

{-| The font-family (set with [toggleFontFamily](#toggleFontFamily)) at the cursor position.
-}
fontFamily : Rte -> List String
fontFamily model =
    case model of
        Opaque rte ->
            case Array.get (rte.cursor - 1) rte.content of
                Just (Character c) ->
                    c.fontStyle.fontFamily

                _ ->
                    rte.fontStyle.fontFamily                    


{-| The font-size (set with [setFontSize](#setFontSize)) at the cursor position.
-}
fontSize : Rte -> Maybe Float
fontSize model =
    case model of
        Opaque rte ->
            case Array.get (rte.cursor - 1) rte.content of
                Just (Character c) ->
                    c.fontStyle.fontSize

                _ ->
                    rte.fontStyle.fontSize 

{-|-}
freezed : Rte -> Bool
freezed model =
    case model of
        Opaque rte ->
            rte.state == Freeze


{-| The plain text content of the RTE.
-}
textContent : Rte -> String
textContent model =
    case model of
        Opaque rte ->
            MiniRte.Core.toText rte.content


--== Control functions ==--

apply : (MiniRte.Core.Editor -> ( MiniRte.Core.Editor, Cmd Msg )) -> Rte -> ( Rte, Cmd Msg )
apply f model =
    case model of
        Opaque rte ->
            let
                ( new, cmd ) =
                    f rte
            in
            ( Opaque new
            , cmd
            )

{-| Add content at current cursor position.
-}
addContent : Content -> Rte -> ( Rte, Cmd Msg )
addContent newContent rte =
    apply (MiniRte.Core.addContent newContent) rte

{-| Embed a custom html node within text.
-}
addCustomHtml : EmbeddedHtmlRecord -> Rte -> ( Rte, Cmd Msg )
addCustomHtml html rte =
    apply (MiniRte.Core.embed html) rte

{-| An `img` node with the specified `src`.
-}
addImageWithSrc : String -> Rte -> ( Rte, Cmd Msg )
addImageWithSrc src rte =
    apply (MiniRte.Core.addImage src) rte

{-| Turn the current selection into a link.
-}
addLink : String -> Rte -> ( Rte, Cmd Msg )
addLink href rte =
    ( apply0 (MiniRte.Core.link href) rte
    , Cmd.none
    )

{-| Insert text at current cursor position.
-}
addText : String -> Rte -> ( Rte, Cmd Msg )
addText txt rte =
    apply (MiniRte.Core.addText txt) rte

{-| Copy current selection. Results in a `ToBrowserClipboard` Msg which must be captured in `update`. See the [example](https://github.com/dkodaj/rte/blob/master/example/src/Main.elm).
-}
copy : Rte -> ( Rte, Cmd Msg )
copy rte =
    apply MiniRte.Core.copy rte

{-|-}
cut : Rte -> ( Rte, Cmd Msg )
cut rte =
    apply MiniRte.Core.cut rte

{-|-}
decreaseIndent : Rte -> ( Rte, Cmd Msg )
decreaseIndent rte =
    apply (MiniRte.Core.changeIndent -1) rte

{-| Hides cursor and stops listening to mouse and keyboard events.
-}
freeze : Rte -> Rte
freeze rte =
    apply0 (MiniRte.Core.state Freeze) rte

{-|-}
increaseIndent : Rte -> ( Rte, Cmd Msg )
increaseIndent rte =
    apply (MiniRte.Core.changeIndent 1) rte

{-|-}
paste : String -> Rte -> ( Rte, Cmd Msg )
paste txt rte =
    apply (MiniRte.Core.update (Paste txt)) rte

{-| Clears the editor and loads new content.
-}
replaceContent : Content -> Rte -> Rte
replaceContent myContent rte =
    apply0 (MiniRte.Core.loadContent myContent) rte

{-| Same with plain text.
-}
replaceContentString : String -> Rte -> Rte
replaceContentString str rte =
    apply0 (MiniRte.Core.loadText str) rte

{-| Controls the font size within the selected text / at the current cursor position.
-}
setFontSize : Float -> Rte -> ( Rte, Cmd Msg )
setFontSize x rte =
    apply (MiniRte.Core.fontSize x) rte

{-|-}
setSelection : (Int,Int) -> Rte -> ( Rte, Cmd Msg )
setSelection range rte =
    apply (MiniRte.Core.selectRange range) rte

{-|-}
setTextAlignment : TextAlignType -> Rte -> ( Rte, Cmd Msg )
setTextAlignment itsType rte =
    apply (MiniRte.Core.textAlign itsType) rte

{-|-}
toggleBold :  Rte -> ( Rte, Cmd Msg )
toggleBold rte =
    apply MiniRte.Core.toggleBold rte

{-|-}
toggleClass : String -> Rte -> ( Rte, Cmd Msg )
toggleClass x rte =
    apply (MiniRte.Core.toggleParaClass x) rte

{-|-}
toggleFontFamily : List String -> Rte -> ( Rte, Cmd Msg )
toggleFontFamily list rte =
    apply (MiniRte.Core.fontFamily list)  rte

{-| Turns the current paragraph into an `h1` element.
-}
toggleHeading : Rte -> ( Rte, Cmd Msg )
toggleHeading rte =
    apply (MiniRte.Core.toggleNodeType "h1") rte

{-|-}
toggleItalic : Rte -> ( Rte, Cmd Msg )
toggleItalic rte =
    apply MiniRte.Core.toggleItalic rte

{-|-}
toggleNodeType : String -> Rte -> ( Rte, Cmd Msg )
toggleNodeType str rte =
    apply (MiniRte.Core.toggleNodeType str) rte

{-|-}
toggleStrikethrough : Rte -> ( Rte, Cmd Msg )
toggleStrikethrough rte =
    apply MiniRte.Core.toggleStrikeThrough rte

{-|-}
toggleUnderline : Rte -> ( Rte, Cmd Msg )
toggleUnderline rte =
    apply MiniRte.Core.toggleUnderline rte

{-|-}
undo : Rte -> ( Rte, Cmd Msg )
undo rte =
    apply MiniRte.Core.undo rte

{-| Show the cursor and activate mouse/keyboard listeners.
-}
unfreeze : Rte -> Rte
unfreeze rte =
    apply0 (MiniRte.Core.state Edit) rte

{-| Remove the `href` at the current cursor position.
-}
unlink : Rte -> ( Rte, Cmd Msg )
unlink rte =
    ( apply0 MiniRte.Core.unlink rte
    , Cmd.none
    )


--== Conversion ==--

{-|-}
textToContent : String -> Content
textToContent =
    MiniRte.Core.textToContent

{-|-}
contentToText : Content -> String
contentToText =
    MiniRte.Core.toText 


{-| Convert content json string into edited content.
-}
decodeContentString : String -> Result String Content
decodeContentString =
    MiniRte.Core.decodeContentString

{-| Convert gzipped content json into edited content.
-}
decodeContentGZip : Bytes -> Result String Content
decodeContentGZip =
    MiniRte.Core.decodeContentGZip

{-| Encode the edited content in a json string.
-}
encodeContentString : Rte -> String
encodeContentString model =
    case model of
        Opaque rte ->
            MiniRte.Core.encodeContentString rte

{-| Encode the edited content in a gzipped json string.
-}
encodeContentGZip : Rte -> Bytes
encodeContentGZip model =
    case model of
        Opaque rte ->
            MiniRte.Core.encodeContentGZip rte
