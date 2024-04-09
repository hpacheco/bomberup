port module Page.Tutorial exposing (main)


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

import Page.Editor.Ui.ColumnDivider exposing (..)
import Page.Editor.Ui.Navigation exposing (..)
import Page.Editor.Ui.Editor
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
  , tutorial : Int
  , rand : List Int
  , editor : Page.Editor.Ui.Editor.Model
  , divider : Page.Editor.Ui.ColumnDivider.Model
  }

type alias Flags = { windowWidth : Int, tutorial : Int, code : String, rand : List Int }

init : Flags -> ( Model, Cmd Msg )
init flags =
  let ( editor, editorCmd ) = Page.Editor.Ui.Editor.init flags.code True
  in
  ( { windowWidth = flags.windowWidth
    , tutorial = flags.tutorial
    , rand = flags.rand
    , divider = Page.Editor.Ui.ColumnDivider.init
    , editor = editor
    }
  , getApiTutorialPlay (Just { tutorialId = flags.tutorial , tutorialRun = False, tutorialRand = flags.rand }) OnTutorialData
  )

type Msg
  = OnDividerMsg Page.Editor.Ui.ColumnDivider.Msg
  | OnWindowSize Int Int
  | OnEditorMsg Page.Editor.Ui.Editor.Msg
  | OnTutorialData (DetailedResult (Http.Detailed.Error String) RawHtml)
  | OnGame Bool
  | OnPageRequest Int
  | OnPageResponse (DetailedResult (Http.Detailed.Error String) TutorialData)

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    OnDividerMsg subMsg -> ( { model | divider = Page.Editor.Ui.ColumnDivider.update model.windowWidth subMsg model.divider }, Cmd.none)
    OnWindowSize width height ->( { model | windowWidth = width }, Cmd.none )
    OnEditorMsg _ -> (model,Cmd.none)
    OnTutorialData res -> case res of
        Err e -> (model,Cmd.none)
        Ok (_,html) -> (model,setTutorialFrame html)
    OnGame b -> (model,getApiTutorialPlay (Just { tutorialId = model.tutorial , tutorialRun = b, tutorialRand = model.rand }) OnTutorialData)
    OnPageRequest i -> (model,getApiTutorialData (Just i) OnPageResponse)
    OnPageResponse res -> case res of
        Err e -> (model,Cmd.none)
        Ok (_,d) -> let flags = { windowWidth = model.windowWidth, tutorial = d.tutorialDataId, code = d.tutorialDataCode, rand = d.tutorialDataRand } in init flags

subscriptions : Model -> Sub Msg
subscriptions model = Browser.Events.onResize OnWindowSize

view : Model -> Html Msg
view model =
  main_
    [ id "main"
    , class "theme-dark", class "tutorial"
    ]
    [ Page.Editor.Ui.ColumnDivider.view OnDividerMsg model.windowWidth model.divider
        [ iframe
            [ id "top"
            , name "top"
            , class "page-content", class "theme-dark", class "tutorial-text"
            , src ("/tutorial/" ++ String.fromInt model.tutorial ++ ".html")
            ]
            []
        , Page.Editor.Ui.Editor.viewEditor "tutorial-" [] model.editor |> Html.map OnEditorMsg
        , viewNavigation model
        ]
        [ iframe
            [ id "tutorial-frame"
            , name "tutorial-frame"
            ]
            []
        ]
    ]

viewNavigation : Model -> Html Msg
viewNavigation model =
  Page.Editor.Ui.Navigation.view
    { left =
        [ Page.Editor.Ui.Navigation.prev (OnPageRequest <| Basics.max 1 <| model.tutorial - 1)
        , Page.Editor.Ui.Navigation.next (OnPageRequest <| Basics.min 6 <| model.tutorial + 1)
        ]
    , right =
        [ Page.Editor.Ui.Navigation.restart (OnGame False)
        , Page.Editor.Ui.Navigation.run (OnGame True)
        ]
    }

port setTutorialFrame : RawHtml -> Cmd msg