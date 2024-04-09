module Page.Editor.Ui.Editor exposing (..)


{-| Control the code editor.

Relies on code-editor.js being present.

-}


import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, on, onMouseOver, onMouseLeave)
import Html.Lazy exposing (..)
import Http
import Json.Encode as E
import Json.Decode as D
import Dict exposing (Dict)
import Elm.Error as Error exposing (Region)
import FeatherIcons as I

import Page.Editor.Data.Problem as Problem
import Page.Editor.Data.Status as Status
import Page.Editor.Ui.Icon



-- PORTS


submitSource : String -> Cmd msg
submitSource a0 = Cmd.none
setUrl : String -> Cmd msg
setUrl a0 = Cmd.none
gotErrors : (E.Value -> msg) -> Sub msg
gotErrors a0 = Sub.none
gotSuccess : (() -> msg) -> Sub msg
gotSuccess a0 = Sub.none
gotChaos : (() -> msg) -> Sub msg
gotChaos a0 = Sub.none


-- MODEL


type alias Model =
  { source : String
  , readOnly : Bool
  , selection : Maybe Region
  }

setSelection : Region -> Model -> Model
setSelection region model =
  { model | selection = Just region }



-- INIT


init : String -> Bool -> ( Model, Cmd Msg )
init source isReadOnly =
  let defaults =
        { source = source
        , selection = Nothing
        , readOnly = isReadOnly
        }
  in ( defaults,Cmd.none)

-- UPDATE


type Msg
  = OnInit String Bool
  | OnChange String (Maybe Region)
  | OnSave String (Maybe Region)
  | OnCompile
  | GotSuccess
  | GotChaos
  | GotErrors E.Value

update : Msg -> Model -> Status.Status -> ( Model, Status.Status, Cmd Msg )
update msg model status =
  case msg of
    OnInit source isSuccess ->
        ({ model | source = source, selection = Nothing }
        ,Status.boolToStatus isSuccess
        ,Cmd.none)
    OnChange source selection ->
      ( { model
        | source = source
        , selection = selection
        }
      , Status.changed status
      , Cmd.none
      )

    OnSave source selection ->
      ({ model | source = source, selection = selection }
      , Status.compiling status
      , submitSource source
      )

    OnCompile ->
      ( model
      , Status.compiling status
      , submitSource model.source
      )
    GotSuccess -> ( model, Status.success, Cmd.none )
    GotChaos -> (model,Status.Failed "CHAOS",Cmd.none)
    GotErrors errors -> ( model, Status.problems errors, Cmd.none )


-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
  Sub.batch [ gotErrors GotErrors, gotSuccess (always GotSuccess) ]



-- VIEW


viewEditor : String -> List String -> Model -> Html Msg
viewEditor idPrefix classes model =
  Html.form
    ([ id (idPrefix ++ "editor")
    , action ("/api/compile")
    , method "post"
    , enctype "multipart/form-data"
    , target "output"
    ] ++ List.map class classes)
    [ textarea [ id "code", name "code", style "display" "none" ] []
    , text ""
    , lazy3 viewEditor_ model.source model.readOnly model.selection 
    ]


viewEditor_ : String -> Bool -> Maybe Region -> Html Msg
viewEditor_ source isReadOnly selection =
  node "code-editor"
    [ property "source" (E.string source)
    , property "theme" (E.string "dark")
    , property "readOnly" (E.bool isReadOnly)
    , property "selection" <|
        case selection of
          Nothing -> encodeBlankSelection
          Just region -> encodeSelection region
    , on "save" (D.map2 OnSave decodeSource decodeSelection)
    , on "change" (D.map2 OnChange decodeSource decodeSelection)
    ]
    []

encodeSelection : Region -> E.Value
encodeSelection { start, end } =
  E.object
    [ ( "start", E.object [ ( "line", E.int start.line ), ( "column", E.int start.column ) ] )
    , ( "end", E.object [ ( "line", E.int end.line ), ( "column", E.int end.column ) ] )
    ]

encodeBlankSelection : E.Value
encodeBlankSelection =
  E.object
    [ ( "start", E.null )
    , ( "end", E.null )
    ]

decodeSource : D.Decoder String
decodeSource =
  D.at [ "target", "source" ] D.string

decodeSelection : D.Decoder (Maybe Region)
decodeSelection =
  D.at [ "target", "selection" ] <|
    D.map2 (Maybe.map2 Region)
      (D.field "start" (D.nullable decodePosition))
      (D.field "end" (D.nullable decodePosition))

decodePosition : D.Decoder Error.Position
decodePosition =
  D.map2 Error.Position
    (D.field "line" D.int)
    (D.field "column" D.int)

decodeHint : D.Decoder (Maybe String)
decodeHint =
  D.at [ "target", "hint" ] (D.nullable D.string)

