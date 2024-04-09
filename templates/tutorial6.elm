
import Game.Bot exposing (..)
import Tuple exposing (..)

findPowerups : State -> List Position
findPowerups state =
    iterateBoard state.board [] (\prev pos cell -> case cell of
        Flames -> pos :: prev
        Bombs -> pos :: prev
        _ -> prev)

closestTo : Position -> List Position -> Maybe (Float,Position)
closestTo to ps =
    let min2 (d1,p1) (d2,p2) = if d1 <= d2 then (d1,p1) else (d2,p2) in
    iterate ps Nothing (\val pos ->
        let now = (euclidianDistance to pos,pos) in
        case val of
            Nothing -> Just now
            Just prev -> Just (min2 prev now))

bot : State -> Move
bot state = case closestTo state.me.position (findPowerups state) of
    Nothing -> Idle
    Just (_,p) -> moveTowards p state

