module Page.Bot exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http exposing (..)
import Http.Detailed
import Material.ImageList as ImageList
import Material.ImageList.Item as ImageListItem
import List
import API exposing (..)

type alias Model = UserInfo
type Msg
    = ChangeAvatarRequest Int
    | ChangeAvatarResponse Int (Result (Http.Detailed.Error String) (Http.Metadata,Empty))

init : Model
init = UserInfo "" 0

view : Model -> Html Msg
view model =
  div [ class "page-content"
      ]
      [ viewChooseAvatar model
      , iframe [ id "bot-editor", name "bot-editor", class "theme-dark", src ("/editor.html")] []
      ]
      
update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
    ChangeAvatarRequest i -> (model,postApiAvatar i <| ChangeAvatarResponse i)
    ChangeAvatarResponse i res -> case res of
        Err err -> (model,Cmd.none)
        Ok _ -> ({ model | userInfoAvatar = i },Cmd.none)
      
viewAvatarButton : Model -> Int -> Html Msg
viewAvatarButton model i =
    let selected = if model.userInfoAvatar == i then [style "background-color" "var(--mdc-theme-primary)"] else []
        first = if i == 1 then [style "margin-left" "auto"] else []
        last = if i == 28 then [style "margin-right" "auto"] else []
    in button (type_ "button" :: class "mdc-icon-button" :: class "avatar-button" :: onClick (ChangeAvatarRequest i) :: selected ++ first ++ last) [ img [ src ("/graphics/players/p"++ String.fromInt i ++".gif")] [] ]

viewChooseAvatar : Model -> Html Msg
viewChooseAvatar model =
    div [ id "choose-avatar"]
        (List.map (viewAvatarButton model) <| List.range 1 28)
    