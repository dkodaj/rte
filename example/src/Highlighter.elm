module Highlighter exposing (highlighter)

import Array
import MiniRte.Types exposing (CharacterRecord, Content, Element(..))


type alias Accumulator =
    { content : Content
    , indent : Int
    , scope : Scope
    }


type Scope =
      NeutralZone
    | OpeningTagEnded
    | TagOpened
    | WithinClosingTag
    | WithinOpeningTag


highlighter : Content -> Content
highlighter content =
    let
        init : Accumulator
        init =
            { content = Array.empty
            , indent = 0
            , scope = NeutralZone
            }
    in
    List.foldl highlight init (markCode content)
    |> .content


highlight : (Bool, Element) -> Accumulator -> Accumulator
highlight (isCode, elem) a =
    let
        indent x br =
            LineBreak { br | highlightIndent = x }

        red ch =
            Character { ch | highlightStyling = [("color","red")] }
    in
    if not isCode then
        { a |
            content = Array.push elem a.content
          , indent = 0
        }
    else
        case elem of
            LineBreak br ->
                case a.scope of
                    OpeningTagEnded ->
                        { a |
                            content = Array.push (indent (a.indent) br) a.content
                          , indent = a.indent + 1
                          , scope = NeutralZone
                        }

                    _ ->
                        { a | content = Array.push (indent (a.indent) br) a.content }

            Character ch ->
                case ch.char of
                    '<' ->
                        { a |
                            content = Array.push (red ch) a.content
                          , scope = TagOpened
                        }

                    '>' ->
                        case a.scope of
                            NeutralZone ->
                                { a | content = Array.push elem a.content }

                            OpeningTagEnded ->
                                { a | content = Array.push elem a.content }

                            TagOpened ->
                                { a |
                                    content = Array.push (red ch) a.content 
                                  , scope = OpeningTagEnded
                                }

                            WithinClosingTag ->
                                { a |
                                    content = Array.push (red ch) a.content 
                                  , scope = NeutralZone
                                }

                            WithinOpeningTag ->
                                { a |
                                    content = Array.push (red ch) a.content 
                                  , scope = OpeningTagEnded
                                }

                    '/' ->
                        case a.scope of
                            NeutralZone ->
                                { a | content = Array.push elem a.content }

                            OpeningTagEnded ->
                                { a | content = Array.push elem a.content }

                            TagOpened ->
                                { a |
                                    content = Array.push (red ch) a.content 
                                  , indent = a.indent - 1
                                  , scope = WithinClosingTag
                                }

                            WithinClosingTag ->
                                { a | content = Array.push (red ch) a.content }

                            WithinOpeningTag ->
                                { a | content = Array.push (red ch) a.content }                                

                    _ ->
                        case a.scope of
                            NeutralZone ->
                                { a | content = Array.push elem a.content }

                            OpeningTagEnded ->
                                { a | content = Array.push elem a.content }

                            _ ->
                                { a | content = Array.push (red ch) a.content }

            EmbeddedHtml _ ->
                { a | content = Array.push elem a.content }


markCode : Content -> List (Bool, Element)
markCode content =
    let
        f : Element -> (Bool, List (Bool, Element)) -> (Bool, List (Bool, Element))
        f elem (isCode, xs) =
            case elem of
                LineBreak br ->
                    let
                        isCodeNow =
                            List.member "code" br.classes                           
                    in
                    ( isCodeNow
                    , (isCodeNow, elem) :: xs
                    )

                _ ->
                    ( isCode
                    , (isCode, elem) :: xs
                    )
    in
    Array.foldr f (False, []) content
    |> Tuple.second


