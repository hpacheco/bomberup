
import Game.Bot exposing (..)
import Tuple exposing (..)

target : Position
target = {{& target}}

distanceFrom : State -> Position -> Float
distanceFrom state from = if readCell next state == Wall then 100
                          else euclidianDistance from target

bot : State -> Move
bot state =
    let pos = state.me.position
        dU = distanceFrom state (above pos)
        dD = distanceFrom state (below pos)
        dL = distanceFrom state (leftwards pos)
        dR = distanceFrom state (rightwards pos)
        moveV = if dU <= dD then MoveUp else MoveDown
        moveH = if dL <= dR then MoveLeft else MoveRight
        move = if min dU dD <= min dL dR then moveV else moveH
    in move

