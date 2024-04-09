module Page.Editor exposing (main)


import Browser
import Browser.Events
import Dict exposing (Dict)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, on, onMouseOver, onMouseLeave)
import Html.Lazy exposing (..)
import Http
import Http.Detailed
import Elm.Error as Error

import Page.Editor.Data.Status as Status
import Page.Editor.Data.Problem as Problem
import Page.Editor.Ui.Navigation
import Page.Editor.Ui.ColumnDivider exposing (..)
import Page.Editor.Ui.Editor
import Page.Editor.Ui.Problem
import Dict exposing (Dict)
import API exposing (..)
import Utils exposing (..)

main =
  Browser.element
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }

type alias Model =
  { windowWidth : Int
  , editor : Page.Editor.Ui.Editor.Model
  , divider : Page.Editor.Ui.ColumnDivider.Model
  , status : Status.Status
  }

getProblems : Model -> Maybe Problem.Problems
getProblems model = Status.getProblems model.status

type alias Flags = { windowWidth : Int }

init : Flags -> ( Model, Cmd Msg )
init flags =
  let ( editor, editorCmd ) = Page.Editor.Ui.Editor.init "" False
  in
  ( { windowWidth = flags.windowWidth
    , editor = editor
    , divider = Page.Editor.Ui.ColumnDivider.init
    , status = Status.changed Status.success
    }
  , Cmd.batch [Cmd.map OnEditorMsg editorCmd,getApiBot OnBotData]
  )

type Msg
  = OnEditorMsg Page.Editor.Ui.Editor.Msg
  | OnDividerMsg Page.Editor.Ui.ColumnDivider.Msg
  | OnJumpToProblem Error.Region
  | OnWindowSize Int Int
  | OnToggleHelp
  | OnBotData (Result (Http.Detailed.Error String) (Http.Metadata,BotData))

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    OnEditorMsg subMsg ->
      let ( editor, status, editorCmd ) = Page.Editor.Ui.Editor.update subMsg model.editor model.status in
      ( { model | editor = editor, status = status }, Cmd.map OnEditorMsg editorCmd)
    OnDividerMsg subMsg -> ( { model | divider = Page.Editor.Ui.ColumnDivider.update model.windowWidth subMsg model.divider }, Cmd.none)
    OnJumpToProblem region -> ( jumpToRegion region model, Cmd.none )
    OnWindowSize width height ->( { model | windowWidth = width }, Cmd.none )
    OnToggleHelp -> (model,Page.Editor.Ui.Editor.setUrl "/help.html")
    OnBotData res -> case res of
        Err e -> (model,Cmd.none)
        Ok (_,bot) -> (model,sendMsg <| OnEditorMsg <| Page.Editor.Ui.Editor.OnInit bot.botCode bot.botStatus)

jumpToRegion : Error.Region -> Model -> Model
jumpToRegion region model =
  { model | editor = Page.Editor.Ui.Editor.setSelection region model.editor }

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.batch
    [ Page.Editor.Ui.Editor.subscriptions model.editor
        |> Sub.map OnEditorMsg
    , Browser.Events.onResize OnWindowSize
    ]

view : Model -> Html Msg
view model =
  main_
    [ id "main"
    , class "theme-dark"
    ]
    [ Page.Editor.Ui.ColumnDivider.view OnDividerMsg model.windowWidth model.divider
        [ Page.Editor.Ui.Editor.viewEditor "" [] model.editor |> Html.map OnEditorMsg
        , viewNavigation model
        ]
        [ case getProblems model of
            Just problems ->
              if Page.Editor.Ui.ColumnDivider.isRightMost model.windowWidth model.divider then
                text ""
              else
                lazy viewProblemList problems

            Nothing ->
              text ""

        , iframe
            [ id "output"
            , name "output"
            , class "page-content", class "theme-dark"
            , case getProblems model of
                Just _  -> style "display" "none"
                Nothing -> style "display" "block"
            , src ("/help.html")
            ]
            []
        ]
    ]

viewNavigation : Model -> Html Msg
viewNavigation model =
  Page.Editor.Ui.Navigation.view
    { left =
        [ Page.Editor.Ui.Navigation.help OnToggleHelp
        ]
    , right =
        [ Page.Editor.Ui.Navigation.compilation (OnEditorMsg Page.Editor.Ui.Editor.OnCompile) model.status
        ]
    }

viewProblemList :  Problem.Problems -> Html Msg
viewProblemList =
  Page.Editor.Ui.Problem.viewList OnJumpToProblem

