module Page.Play exposing (..)

import String
import Browser
import Html exposing (..)
import Http
import Http.Detailed
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Material.Select as Select
import Material.Select.Item as SelectItem
import Material.Button as Button
import Material.Typography as Typography
import Dict exposing (..)
import API exposing (..)
import Utils exposing (..)

type alias Model =
    { selectedPlayers : List String }

makeGameFlags : Model -> GameFlags
makeGameFlags model = { gamePlayers = model.selectedPlayers }

init : Model
init = { selectedPlayers = defaultGameFlags.gamePlayers }

type Msg
    = SelectPlayer Int String
    | PlayRequest
    | PlayResponse (DetailedResult (Http.Detailed.Error String) RawHtml)

update : (RawHtml -> Cmd Msg) -> Msg -> Model -> (Model,Cmd Msg)
update setGameFrame msg model = case msg of
    SelectPlayer i p -> ({ model | selectedPlayers = setNth model.selectedPlayers i p },Cmd.none)
    PlayRequest ->
        let flags = (makeGameFlags model)
        in (model,getApiGame (Just flags) PlayResponse)
    PlayResponse r -> case r of
        Err err -> (model,Cmd.none)
        Ok (_,html) -> (model,setGameFrame html)

view : Model -> Html Msg
view model = div [ class "page-content" ]
    [ div [id "play-space", class "page-content", class "large"]
        [ div [id "play-bar"]
            (img [src "/graphics/logo.png", style "margin-left" "auto", style "margin-right" "20px", style "margin-top" "10px", style "height" "100px", style "object-fit" "contain", style "display" "inline-flex"] []
            :: (List.map viewPlayerButton <| List.range 0 3)
            -- ++ [button [ type_ "button", class "login-button", onClick PlayRequest, style "width" "80%", style "display" "inline-flex" ] [text "Play"] ]
            ++ [ Button.unelevated
                    (Button.config
                        |> Button.setOnClick PlayRequest
                        |> Button.setAttributes [type_ "button", style "width" "100%"]
                    ) "Play" ]
            )
        , iframe [ id "game-frame" ] []
        ]
    ]

viewPlayerButton : Int -> Html Msg
viewPlayerButton i = div [class "theme-dark", style "width" "80%", style "display" "inline-flex"] [ p [Typography.typography] [text ("Player " ++ String.fromInt i ++ ":")], 
    Select.outlined
        (Select.config
            |> Select.setLabel Nothing
            |> Select.setSelected (Just "none")
            |> Select.setOnChange (SelectPlayer i)
            |> Select.setAttributes [ style "background" "white", style "vertical-align" "middle", style "align-items" "center", style "margin-left" "auto" ]
        )
        (SelectItem.selectItem (SelectItem.config { value = "human" }) "Human")
        [ SelectItem.selectItem (SelectItem.config { value = "easy" }) "Bot (Easy)"
        , SelectItem.selectItem (SelectItem.config { value = "medium" }) "Bot (Medium)"
        , SelectItem.selectItem (SelectItem.config { value = "hard" }) "Bot (Hard)"
        , SelectItem.selectItem (SelectItem.config { value = "none" }) "None"
        ]
    ]

