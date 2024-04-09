port module Main exposing (..)

import Game.State
import API
import Json.Encode
import Platform
import Debug

{{& code}}

type Msg = Input String

update : Msg -> () -> ((),Cmd Msg)
update msg m = case msg of
    Input s -> (m,setOutput <| Game.State.botMoveToString <| bot <| Game.State.stringToBotState s)

subscriptions : () -> Sub Msg
subscriptions _ = getInput Input

main : Program () () Msg
main = Platform.worker
        { init = \_ -> ((), Cmd.none )
        , update = update
        , subscriptions = subscriptions
        }

port getInput : (String -> msg) -> Sub msg
port setOutput : String -> Cmd msg