module Page.Ranking exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Http
import Http.Detailed
import Material.Select as Select
import Material.Select.Item as SelectItem
import Material.Button as Button
import Material.Card as Card
import Material.List as List
import Material.List.Item as ListItem
import Material.Typography as Typography
import API exposing (..)
import Utils exposing (..)
import List exposing (..)
import String
import Time exposing (utc)
import Time.Format as Time

type Status = Drawing | Listing

type alias Model =
    { ranking : Ranking
    , status : Status
    }

init : (Model,Cmd Msg)
init =
    let model = { ranking = { rankingChampion = Nothing, rankingMatches = [] }, status = Drawing }
    in (model,getApiRanking GetRanking)

type Msg
    = GetRanking (DetailedResult (Http.Detailed.Error String) Ranking)
    | ViewMatchRequest Int
    | ViewMatchResponse (DetailedResult (Http.Detailed.Error String) RawHtml)

update : (RawHtml -> Cmd Msg) -> Msg -> Model -> (Model,Cmd Msg)
update setGameFrame msg model =
  case msg of
    GetRanking res -> case res of
        Err err -> (model,Cmd.none)
        Ok (_,ranking) -> ({ model | ranking = ranking, status = Listing },Cmd.none)
    ViewMatchRequest id -> (model,getApiMatch (Just id) ViewMatchResponse)
    ViewMatchResponse res -> case res of
        Err err -> (model,Cmd.none)
        Ok (_,html) -> ({ model | status = Drawing },setGameFrame html)
      
playClass : Status -> String
playClass status = case status of
    Listing -> "scroll"
    _ -> "large"

displayFrame : Bool -> Status -> String
displayFrame isMatch status = case status of
    Drawing -> if isMatch then "none" else "block"
    Listing -> if isMatch then "flex" else "none"

view : Model -> Html Msg
view model = div [ class "page-content" ]
    [ div [id "play-space", class "page-content", class (playClass model.status)]
        [ div [id "play-bar"]
            [ Card.card
                (Card.config |> Card.setAttributes [class "champion-card"] |> Card.setOutlined True)
                { blocks =
                    ( Card.squareMedia [class "champion-card-media"] "/graphics/champion.gif"
                    , [Card.block <|
                        Html.div [class "champion-div", Typography.typography]
                            [ Html.h2 [style "color" "#af6c00"] [ text "\u{1F3C6} Current Champion \u{1F3C6}" ] , viewChampion model.ranking.rankingChampion]]
                    )
                , actions = Nothing
                }
            ]
        , div [ id "match-frame", class (playClass model.status), style "display" (displayFrame True model.status)] (viewMatches model)
        , iframe [ id "game-frame", style "display" (displayFrame False model.status) ] []
        ]
    ]

viewChampion : Maybe Champion -> Html Msg
viewChampion mb =
    let avatar = Maybe.withDefault 0 <| Maybe.map (\c -> c.champAvatar) mb in
    let name = Maybe.withDefault "None" <| Maybe.map (\c -> c.champName) mb in
    div [class "champion-display"]
        [ img [src <| "/graphics/players/p" ++ String.fromInt avatar ++ ".gif"] []
        , h3 [class "champion-name"] [text name]
        ]

viewMatches : Model -> List (Html Msg)
viewMatches model = h1 [Typography.typography] [text "Latest Championship Matches"] :: viewStatus model

viewStatus : Model -> List (Html Msg)
viewStatus model = case model.status of
    Drawing -> []
    Listing -> List.foldr (\m h -> viewMatch m :: h) [] model.ranking.rankingMatches

viewMatch : MatchInfo -> Html Msg
viewMatch m =
    let n1 = m.mP1.mpName in
    let n2 = m.mP2.mpName in
    let s1 = if m.mWinner == Just m.mP1.mpId then style "opacity" "1" else style "opacity" "0.6" in
    let s2 = if m.mWinner == Just m.mP2.mpId then style "opacity" "1" else style "opacity" "0.6" in
    let pad = style "padding" "10px 10px" in
    let i = if m.mChampionship then "graphics/champion.gif" else "graphics/vs.gif" in
    button [class "theme-dark", class "match-button", onClick (ViewMatchRequest m.mTime)]
        [ p [id "date",style "margin" "5px 0px 0px 0px", Typography.typography] [text (millisToString m.mTime)]
        , img [id "champion", src i] []
        , div [ id "match", Typography.typography]
            [ p [class "match-name", s1, Typography.typography] [ text n1 ]
            , img [src <| String.append "graphics/players/p" <| String.append (String.fromInt m.mP1.mpAvatar) ".gif", s1, pad] []
            , text "VS"
            , img [src <| String.append "graphics/players/p" <| String.append (String.fromInt m.mP2.mpAvatar) ".gif", s2, pad] []
            , p [class "match-name", s2, Typography.typography] [ text n2 ]
            ]
        ]
        

