module Page.Challenge exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Http
import Http.Detailed
import Material.Select as Select
import Material.Select.Item as SelectItem
import Material.Button as Button
import Material.Typography as Typography
import Material.CircularProgress as CircularProgress
import API exposing (..)
import Utils exposing (..)
import List exposing (..)
import String

type Status = Waiting | Drawing | Listing (List MatchInfo) | Error String

type alias Model =
    { opponents : List Opponent
    , selectedOpponent : Maybe Opponent
    , status : Status
    }

init : (Model,Cmd Msg)
init =
    let model = { opponents = [], selectedOpponent = Nothing, status = Drawing }
    in (model,getApiOpponents GetOpponents)

type Msg
    = GetOpponents (DetailedResult (Http.Detailed.Error String) (List Opponent))
    | SelectOpponent Opponent
    | ChallengeRequest Bool
    | ChallengeResponse (DetailedResult (Http.Detailed.Error String) MatchInfo)
    | ViewMatchesRequest
    | ViewMatchesResponse (DetailedResult (Http.Detailed.Error String)  (List MatchInfo))
    | ViewMatchRequest Int
    | ViewMatchResponse (DetailedResult (Http.Detailed.Error String) RawHtml)

update : (RawHtml -> Cmd Msg) -> Msg -> Model -> (Model,Cmd Msg)
update setGameFrame msg model =
  case msg of
    GetOpponents res -> case res of
        Err err -> (model,Cmd.none)
        Ok (_,opponents) -> ({ model | opponents = opponents },Cmd.none)
    SelectOpponent o -> ({ model | selectedOpponent = Just o },Cmd.none)
    ChallengeRequest False -> case model.selectedOpponent of
        Nothing -> (model,Cmd.none)
        Just op -> ({ model | status = Waiting },postApiChallenge (Just op) ChallengeResponse)
    ChallengeRequest True -> ({ model | status = Waiting },postApiChallenge Nothing ChallengeResponse)
    ChallengeResponse res -> case res of
        Err err -> case errorBody err of
            Just errmsg -> ({ model | status = Error errmsg },Cmd.none)
            _ -> (model,Cmd.none)
        Ok (_,match) -> ({ model | status = Listing [match] },Cmd.none)
    ViewMatchesRequest -> (model,getApiMatches ViewMatchesResponse)
    ViewMatchesResponse res -> case res of
        Err err -> (model,Cmd.none)
        Ok (_,matches) -> ({ model | status = Listing matches },Cmd.none)
    ViewMatchRequest id -> (model,getApiMatch (Just id) ViewMatchResponse)
    ViewMatchResponse res -> case res of
        Err err -> (model,Cmd.none)
        Ok (_,html) -> ({ model | status = Drawing },setGameFrame html)
      
playClass : Status -> String
playClass status = case status of
    Listing _ -> "scroll"
    _ -> "large"

displayFrame : Bool -> Status -> String
displayFrame isMatch status = case status of
    Drawing -> if isMatch then "none" else "block"
    Listing _ -> if isMatch then "flex" else "none"
    _ -> if isMatch then "block" else "none"

view : Model -> Html Msg
view model = div [ class "page-content" ]
    [ div [id "play-space", class "page-content", class (playClass model.status)]
        [ div [id "play-bar"]
            (img [src "/graphics/logo2.png", style "margin-left" "auto", style "margin-right" "auto", style "margin-top" "10px", style "margin-bottom" "10px", style "height" "200px", style "object-fit" "contain", style "display" "inline-flex"] []
            :: [viewOpponentButton model.opponents]
            ++ [ Button.unelevated
                    (Button.config
                        |> Button.setOnClick (ChallengeRequest False)
                        |> Button.setIcon (Just (Button.icon "person"))
                        |> Button.setAttributes [type_ "button", style "width" "100%"]
                    ) "Challenge other Player" 
                , div [style "height" "20px"] [] 
                , Button.unelevated
                    (Button.config
                        |> Button.setOnClick (ChallengeRequest True)
                        |> Button.setIcon (Just (Button.icon "emoji_events"))
                        |> Button.setAttributes [type_ "button", style "width" "100%"]
                    ) "Challenge the Champion"
                , div [style "height" "20px"] [] 
                , Button.unelevated
                    (Button.config
                        |> Button.setOnClick ViewMatchesRequest
                        |> Button.setIcon (Just (Button.icon "view_list"))
                        |> Button.setAttributes [type_ "button", style "width" "100%"]
                    ) "View your Matches"
                ]
            )
        , div [ id "match-frame", class (playClass model.status), style "display" (displayFrame True model.status), Typography.typography] (viewStatus model.status)
        , iframe [ id "game-frame", style "display" (displayFrame False model.status) ] []
        ]
    ]
    
viewOpponentButton : List Opponent -> Html Msg
viewOpponentButton os = div [class "theme-dark", style "width" "80%", style "display" "inline-flex"] [ p [Typography.typography] [text "Opponent:"], 
    Select.outlined
        (Select.config
            |> Select.setLabel Nothing
            |> Select.setSelected Nothing
            |> Select.setOnChange (SelectOpponent)
            |> Select.setAttributes [ style "background" "white", style "vertical-align" "middle", style "align-items" "center", style "margin-left" "auto" ]
        )
        (SelectItem.selectItem (SelectItem.config { value = Opponent "bot:easy" }) "Bot (Easy)")
        ([ SelectItem.selectItem (SelectItem.config { value = Opponent "bot:medium" }) "Bot (Medium)"
        , SelectItem.selectItem (SelectItem.config { value = Opponent "bot:hard" }) "Bot (Hard)"
        ] ++ List.map viewOpponent os)
    ]

viewOpponent : Opponent -> SelectItem.SelectItem Opponent Msg
viewOpponent o = SelectItem.selectItem (SelectItem.config { value = o }) o.opponentName

wonMatch : MatchInfo -> Bool
wonMatch match = match.mWinner == Just match.mP1.mpId

viewStatus : Status -> List (Html Msg)
viewStatus s = case s of
    Drawing -> []
    Waiting ->
        [ img [ style "margin" "20px 20px 10px 20px", src "graphics/working.gif" ] []
        , CircularProgress.indeterminate CircularProgress.config
        , p [ style "margin" "0px 20px"] [ text "Processing your match..." ]
        ]
    Listing [m] ->
        let won = wonMatch m in
        let champ = m.mChampionship in
        let imgsrc = if won then if champ then "win2" else "win" else "lose" in
        let txt = if won then if champ then "Congratulations, you are the new champion!" else "Congratulations, you won the match!" else "You lost the match. No worries, you can try again." in
        [ img [ style "margin" "20px 20px 10px 20px", src ("graphics/"++imgsrc++".gif") ] []
        , p [ style "margin" "0px 20px" ] [ text txt ]
        , viewMatch m
        ]
    Listing matches ->
        h1 [Typography.typography] [text "Your Latest Matches"] :: 
        List.foldr (\m h -> viewMatch m :: h) [] matches
    Error msg -> case msg of
        "FailUser" ->
            [ img [ style "margin" "20px 20px 10px 20px", src "graphics/work.gif" ] []
            , p [ style "margin" "0px 20px" ] [ text "Please finish your bot first!" ]
            ]
        "FailOpponent" -> 
            [ img [ style "margin" "20px 20px 10px 20px", src "graphics/work.gif" ] []
            , p [ style "margin" "0px 20px" ] [ text "Please wait for that user to finish its bot." ]
            ]
        _ -> 
            [ img [ style "margin" "20px 20px 10px 20px", src "graphics/danger.gif" ] []
            , p [ style "margin" "0px 20px" ] [ text "Unknown error. ", text msg ]
            ]

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



