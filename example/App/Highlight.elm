module App.Highlight exposing (code)

import MiniRte.Types exposing (Character, Content, Element(..))


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


code : Content -> Content
code content =
    let
        init : Accumulator
        init =
            { content = []
            , indent = 0
            , scope = NeutralZone
            }
    in
    List.reverse
        <| .content
            <| List.foldl highlight init (markCode content)


highlight : (Bool, Element) -> Accumulator -> Accumulator
highlight (isCode, elem) a =
    let
        indent x br =
            Break { br | indent = x }

        red ch =
            Char { ch | highlightStyling = [("color","red")] }
    in
    if not isCode then
        { a |
            content = elem :: a.content 
          , indent = 0
        }
    else
        case elem of
            Break br ->
                case a.scope of
                    OpeningTagEnded ->
                        { a |
                            content = indent (a.indent) br :: a.content
                          , indent = a.indent + 1
                          , scope = NeutralZone
                        }

                    _ ->
                        { a | content = indent (a.indent) br :: a.content }

            Char ch ->
                case ch.char of
                    '<' ->
                        { a |
                            content = red ch :: a.content
                          , scope = TagOpened
                        }

                    '>' ->
                        case a.scope of
                            NeutralZone ->
                                { a | content = elem :: a.content }

                            OpeningTagEnded ->
                                { a | content = elem :: a.content }

                            TagOpened ->
                                { a |
                                    content = red ch :: a.content 
                                  , scope = OpeningTagEnded
                                }

                            WithinClosingTag ->
                                { a |
                                    content = red ch :: a.content 
                                  , scope = NeutralZone
                                }

                            WithinOpeningTag ->
                                { a |
                                    content = red ch :: a.content 
                                  , scope = OpeningTagEnded
                                }

                    '/' ->
                        case a.scope of
                            NeutralZone ->
                                { a | content = elem :: a.content }

                            OpeningTagEnded ->
                                { a | content = elem :: a.content }

                            TagOpened ->
                                { a |
                                    content = red ch :: a.content 
                                  , indent = a.indent - 1
                                  , scope = WithinClosingTag
                                }

                            WithinClosingTag ->
                                { a | content = red ch :: a.content }

                            WithinOpeningTag ->
                                { a | content = red ch :: a.content }                                

                    _ ->
                        case a.scope of
                            NeutralZone ->
                                { a | content = elem :: a.content }

                            OpeningTagEnded ->
                                { a | content = elem :: a.content }

                            _ ->
                                { a | content = red ch :: a.content }

            Embedded _ ->
                { a | content = elem :: a.content }


markCode : Content -> List (Bool, Element)
markCode content =
    let
        f : Element -> (Bool, List (Bool, Element)) -> (Bool, List (Bool, Element))
        f elem (isCode, xs) =
            case elem of
                Break br ->
                    let
                        isCodeNow =
                            List.member "Code" br.classes                           
                    in
                    ( isCodeNow
                    , (isCodeNow, elem) :: xs
                    )

                _ ->
                    ( isCode
                    , (isCode, elem) :: xs
                    )
    in
    Tuple.second
        <| List.foldr f (False, []) content


