port module Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Html.Lazy
import Http exposing (..)
import Http.Detailed
import Platform.Cmd exposing (..)
import Array exposing (Array)
import Dict exposing (Dict)
import String
import Material.Tab as Tab
import Material.TabBar as TabBar
import Material.TextField as TextField
import Material.Button as Button
import Material.Typography as Typography
import Browser
import Browser.Navigation
import Crypto.Hash as Crypto
import Page.Play
import Page.Ranking
import Page.Bot
import Page.Challenge
import Utils exposing (..)
import API exposing (..)

type PageModel
    = PlayModel Page.Play.Model
    | RankingModel Page.Ranking.Model
    | BotModel Page.Bot.Model
    | ChallengeModel Page.Challenge.Model

type alias Model =
    { page : PageModel
    , selectedPage : Int
    , loggedin : Maybe User
    , loginEmail : String
    , loginPassword : String
    , signupEmail : String
    , signupPassword : String
    , signupRepeatPassword : String
    }

type Msg
    = SelectTab Int
    | PlayMsg Page.Play.Msg
    | RankingMsg Page.Ranking.Msg
    | BotMsg Page.Bot.Msg
    | ChallengeMsg Page.Challenge.Msg
    | LoginRequest 
    | Loggedin
    | LoginResponse Bool (Result (Http.Detailed.Error String) (Http.Metadata,User))
    | LogoutRequest
    | LogoutResponse (Result (Http.Detailed.Error String) (Http.Metadata,Empty))
    | SignupRequest 
    | SignupResponse (Result (Http.Detailed.Error String) (Http.Metadata,User))
    | LoginEmail String
    | LoginPassword String
    | SignupEmail String
    | SignupPassword String
    | SignupRepeatPassword String
    | UserInfoResponse (Result (Http.Detailed.Error String) (Http.Metadata,UserInfo))

initPage : Int -> (PageModel,Cmd Msg)
initPage n = case n of
    0 -> (PlayModel Page.Play.init,Cmd.none)
    1 -> let (cmodel,ccmd) = Page.Ranking.init
         in (RankingModel cmodel,Cmd.map RankingMsg ccmd)
    2 -> (BotModel Page.Bot.init,getApiUserInfo UserInfoResponse)
    _ -> let (cmodel,ccmd) = Page.Challenge.init
         in (ChallengeModel cmodel,Cmd.map ChallengeMsg ccmd)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        SelectTab k ->
            let (pageN,cmd) = initPage k
            in ({ model | selectedPage = k , page = pageN },cmd)
        PlayMsg m -> case model.page of
            PlayModel a ->
                let (playN,cmdN) = Page.Play.update setGameFrame m a
                in ({ model | page = PlayModel playN },Cmd.map PlayMsg cmdN)
            _ -> (model,Cmd.none)
        RankingMsg rmsg -> case model.page of
            RankingModel a ->
                let (rmodel,rcmd) = Page.Ranking.update setGameFrame rmsg a
                in ({ model | page = RankingModel rmodel },Cmd.map RankingMsg rcmd)
            _ -> (model,Cmd.none)
        BotMsg m -> case model.page of
            BotModel info ->
                let (infoN,cmd) = Page.Bot.update m info
                in ({ model | page = BotModel infoN },Cmd.map BotMsg cmd)
            _ -> (model,Cmd.none)
        ChallengeMsg cmsg -> case model.page of
            ChallengeModel a -> 
                let (cmodel,ccmd) = Page.Challenge.update setGameFrame cmsg a
                in ({ model | page = ChallengeModel cmodel },Cmd.map ChallengeMsg ccmd)
            _ -> (model,Cmd.none)
        LoginRequest -> (model,postApiLogin (Login model.loginEmail (Crypto.sha512 model.loginPassword)) (LoginResponse True))
        Loggedin -> (model,getApiLoggedin (LoginResponse True))
        LoginResponse isVerbose r -> case r of
            Ok (_,u)  -> ({ model | loggedin = Just u, loginEmail = "", loginPassword = "" },Cmd.none)
            Err err -> if isVerbose
                then (model,setValidity { id = "loginEmail", validity = "Login Failed: " ++ errorMessage err })
                else (model,Cmd.none)
        LogoutRequest -> (model,getApiLogout LogoutResponse)
        LogoutResponse r -> case r of
            Ok _ -> ({ model | loggedin = Nothing, loginEmail = "", loginPassword = "" },Cmd.none)
            Err err -> (model,Cmd.none)
        SignupRequest -> (model, if model.signupPassword /= model.signupRepeatPassword
                then setValidity { id="signupRepeatPassword", validity="Passwords do not match" }
                else postApiSignup (Login model.signupEmail (Crypto.sha512 model.signupPassword)) SignupResponse)
        SignupResponse r -> case r of
                Ok (_,u)  -> ({ model | loggedin = Just u, signupEmail = "", signupPassword = "", signupRepeatPassword = "" },Cmd.none)
                Err err -> (model,setValidity { id = "signupPassword", validity = "Unable to create account: " ++ errorMessage err })
        UserInfoResponse r -> case r of
            Ok (_,info) -> case model.page of
                BotModel _ -> ({ model | page = BotModel info },Cmd.none)
                _ -> (model,Cmd.none)
            Err err -> (model,Cmd.none)
        LoginEmail email -> ({ model | loginEmail = email },Cmd.none)
        LoginPassword pass -> ({ model | loginPassword = pass },Cmd.none)
        SignupEmail email -> ({ model | signupEmail = email },Cmd.none)
        SignupPassword pass -> ({ model | signupPassword = pass },Cmd.none)
        SignupRepeatPassword pass -> ({ model | signupRepeatPassword = pass },Cmd.none)

loginForm : Model -> Html Msg
loginForm model =
    Html.form [ id "login", style "float" "left" ]
        [ TextField.filled
                (TextField.config
                    |> TextField.setLabel Nothing
                    |> TextField.setValue Nothing
                    |> TextField.setOnInput LoginEmail
                    |> TextField.setPlaceholder (Just "some@email.com")
                    |> TextField.setRequired True
                    |> TextField.setType (Just "email")
                    |> TextField.setAttributes [ id "loginEmail" ]
                )
        , TextField.filled
                (TextField.config
                    |> TextField.setLabel Nothing
                    |> TextField.setValue Nothing
                    |> TextField.setOnInput LoginPassword
                    |> TextField.setPlaceholder (Just "password")
                    |> TextField.setRequired True
                    |> TextField.setType (Just "password")
                    |> TextField.setAttributes [ id "loginPassword" ]
                )
        , Button.unelevated
            (Button.config
                |> Button.setOnClick LoginRequest
                |> Button.setAttributes [type_ "button"]
            )
            "Login"
        ]

signupForm : Model -> Html Msg
signupForm model = Html.form [ id "signup" ]
        [ TextField.filled
              (TextField.config
                  |> TextField.setLabel Nothing
                  |> TextField.setValue Nothing
                  |> TextField.setOnInput SignupEmail
                  |> TextField.setPlaceholder (Just "some@email.com")
                  |> TextField.setRequired True
                  |> TextField.setType (Just "email")
                  |> TextField.setAttributes [ id "signupEmail" ]
              )
        , TextField.filled
                (TextField.config
                    |> TextField.setLabel Nothing
                    |> TextField.setValue Nothing
                    |> TextField.setOnInput SignupPassword
                    |> TextField.setPlaceholder (Just "password")
                    |> TextField.setRequired True
                    |> TextField.setType (Just "password")
                    |> TextField.setAttributes [ id "signupPassword" ]
                )
        , TextField.filled
                (TextField.config
                    |> TextField.setLabel Nothing
                    |> TextField.setValue Nothing
                    |> TextField.setOnInput SignupRepeatPassword
                    |> TextField.setPlaceholder (Just "repeat password")
                    |> TextField.setRequired True
                    |> TextField.setType (Just "password")
                    |> TextField.setAttributes [ id "signupRepeatPassword" ]
                )
        , Button.unelevated
            (Button.config
                |> Button.setOnClick SignupRequest
                |> Button.setAttributes [type_ "button"]
            )
            "Signup"
        ]

logoutForm : User -> Html Msg
logoutForm u = Html.form [ id "logout" ]
    [ label [Typography.typography] [img [ src "graphics/ok.gif"] [], text ("Hi "++ u.userEmail ++ "!")]
    , Button.unelevated
        (Button.config
            |> Button.setOnClick LogoutRequest
            |> Button.setAttributes [type_ "button"]
        )
        "Logout"
    ]

loginHeader : Model -> Html Msg
loginHeader model = 
    case model.loggedin of
        Nothing -> Html.div [class "login-header"] [ loginForm model, signupForm model ]
        Just u -> Html.div [class "login-header"] [logoutForm u]

view : Model -> Html Msg
view model =
    let config index = Tab.config
                |> Tab.setActive (model.selectedPage == index)
                |> Tab.setOnClick (SelectTab index)
    in
    div [] [ 
        loginHeader model
        , TabBar.tabBar TabBar.config
            (Tab.tab (config 0) { label = "Play the Game", icon = Just (Tab.icon "videogame_asset") })
            [ Tab.tab (config 1) { label = "View the Leaderboard", icon = Just (Tab.icon "emoji_events") }
            , Tab.tab (config 2) { label = "Create Your Bot", icon = Just (Tab.icon "build") }
            , Tab.tab (config 3) { label = "Challenge other Bots", icon = Just (Tab.icon "sports_mma") }
            ]
    , viewTab model
    ]

authenticatedPage : Bool -> Html Msg -> Html Msg
authenticatedPage isLoggedIn draw = if isLoggedIn
    then draw
    else div [ class "page-content", class "large", class "theme-dark" ] [img [style "margin" "20px 20px 10px 20px", src "graphics/noLogin.gif"] [], p [style "margin" "0px 20px", Typography.typography] [text "Please login first. You need to be logged in to access this page."]]

viewTab : Model -> Html Msg
viewTab model = case model.page of
    PlayModel m -> Html.map PlayMsg (Page.Play.view m)
    RankingModel m -> Html.map RankingMsg (Page.Ranking.view m)
    BotModel m -> authenticatedPage (isJust model.loggedin) (Html.map BotMsg <| Page.Bot.view m)
    ChallengeModel m -> authenticatedPage (isJust model.loggedin) (Html.map ChallengeMsg <| Page.Challenge.view m)

main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }

init : flags -> (Model, Cmd Msg)
init flags =
    ({ page = PlayModel Page.Play.init
    , selectedPage = 0
    , loggedin = Nothing
    , loginEmail = "", loginPassword = ""
    , signupEmail = "", signupPassword = "", signupRepeatPassword = ""
    }, getApiLoggedin (LoginResponse False))

subscriptions : Model -> Sub Msg
subscriptions model = Sub.none

port setValidity : { id : String, validity : String } -> Cmd msg
port setGameFrame : RawHtml -> Cmd msg