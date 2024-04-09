module Page.Editor.Ui.ColumnDivider exposing (..)


{-| Control the sizes of the two columns, editor and result.

Relies on column-divider.js being present.

-}

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, on, preventDefaultOn)
import Html.Lazy exposing (..)
import Json.Encode as E
import Json.Decode as D

type alias Model =
  { percent : Float
  , movement : Movement
  }


type Movement
  = None
  | Moving Float Float Bool



-- EXTERNAL API


pushRight : Int -> Int -> Model -> Model
pushRight width px model =
  let newPx = toFloat (width - px) * (model.percent / 100) in
  { model | percent = toPercentage width newPx }


pushLeft : Int -> Int -> Model -> Model
pushLeft width px model =
  let oldPx = toFloat width * (model.percent / 100)
      newPerc = oldPx * 100 / toFloat (width - px)
  in
  { model | percent = newPerc }


openLeft : Int -> Model -> Model
openLeft width model =
  { model | percent = rightMost width }


isRightMost : Int -> Model -> Bool
isRightMost width model =
  model.percent >= rightMost width


-- INTERNAL API


leftMost : Int -> Float
leftMost width =
  toPercentage width 35


rightMost : Int -> Float
rightMost width = 100 - toPercentage width 35


halfPoint : Float
halfPoint =
  50


clamp : Int -> Float -> Float
clamp width =
  Basics.max (leftMost width) >> Basics.min (rightMost width)


jump : Int -> Float -> Float
jump width percent =
  if percent >= rightMost width then leftMost width
  else if percent <= leftMost width then halfPoint
  else if percent >= halfPoint then rightMost width
  else leftMost width


isSignificant : Float -> Float -> Bool
isSignificant initial latest =
  abs (initial - latest) > 4


isMoving : Model -> Bool
isMoving model =
  case model.movement of
    Moving _ _ _ -> True
    None -> False


toPercentage : Int -> Float -> Float
toPercentage width px =
  px * 100 / toFloat width


fromPercentage : Int -> Float -> Float
fromPercentage width percent =
  percent * toFloat width / 100



-- INIT


init : Model
init =
  { percent = 50
  , movement = None
  }



-- UPDATE


type Msg
  = OnDown Float
  | OnMove Float
  | OnUp Float
  | OnClick
  | OnClickLeft


update : Int -> Msg -> Model -> Model
update window msg model =
  case msg of
    OnDown initial ->
      { model | movement = Moving model.percent initial False }

    OnMove latest ->
      case model.movement of
        Moving percent initial False ->
          if isSignificant initial latest
          then { model | percent = toPercentage window latest, movement = Moving percent initial True }
          else { model | percent = toPercentage window latest }

        Moving _ _ True ->
          { model | percent = toPercentage window latest }

        None ->
          { model | percent = toPercentage window latest }

    OnUp latest ->
      case model.movement of
        Moving _ _ True ->
          { model | movement = None, percent = toPercentage window latest }

        Moving percent _ False ->
          { model | movement = None, percent = jump window percent }

        None ->
          { model | movement = None, percent = jump window model.percent }

    OnClick ->
      { model | movement = None, percent = jump window model.percent }

    OnClickLeft ->
      { model | percent = rightMost window }



-- VIEW


view : (Msg -> msg) -> Int -> Model -> List (Html msg) -> List (Html msg) -> Html msg
view onMsg window model leftChildren rightChildren =
  let percent =
        clamp window model.percent
  in
  div
    [ id "double-pane"
    , style "width" "100%"
    , style "display" "flex"
    ]
    [ viewLeft onMsg window model percent leftChildren
    , Html.map onMsg (viewDivider window model percent)
    , viewRight window model percent rightChildren
    ]


viewLeft : (Msg -> msg) -> Int -> Model -> Float -> List (Html msg) -> Html msg
viewLeft onMsg window model percent =
  let events =
        if percent <= leftMost window then
          [ preventDefaultOn "touchend" (D.succeed ( onMsg OnClickLeft, True ))
          , onClick (onMsg OnClickLeft)
          ]
        else
          []
  in
  div <|
    [ id "left-side"
    , style "width" (String.fromFloat percent ++ "%")
    , style "pointer-events" (if isMoving model then "none" else "auto")
    , style "user-select" (if isMoving model then "none" else "auto")
    , style "transition" (if isMoving model then "none" else "width 0.5s")
    ] ++ events


viewRight : Int -> Model -> Float -> List (Html msg) -> Html msg
viewRight window model percent =
  div
    [ id "right-side"
    , style "width" (String.fromFloat (100 - percent) ++ "%")
    , style "pointer-events" (if isMoving model then "none" else "auto")
    , style "user-select" (if isMoving model then "none" else "auto")
    , style "transition" (if isMoving model then "none" else "width 0.5s")
    ]


viewDivider : Int -> Model -> Float -> Html Msg
viewDivider window model percent =
  node "column-divider"
    [ on "down" (D.map OnDown decodePixels)
    , on "move" (D.map OnMove decodePixels)
    , on "up" (D.map OnUp decodePixels)
    , on "_click" (D.succeed OnClick)
    , property "pixels" (E.float (fromPercentage window percent))
    , style "width" (if isRightMost window model then "40px" else "10px")
    , style "left" (String.fromFloat percent ++ "%")
    ]
    []


decodePixels : D.Decoder Float
decodePixels =
  D.at [ "target", "pixels" ] D.float
