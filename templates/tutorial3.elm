
import Game.Bot exposing (..)

isFreePos : Position -> State -> Bool
isFreePos pos state = readCell pos state /= Wall
                   && not (hasBomb pos state)

bot : State -> Move
bot state = let pos = state.me.position in
    if isFreePos (above pos) state then MoveUp
    else if isFreePos (below pos) state then MoveDown
    else if isFreePos (leftwards pos) state then MoveLeft
    else if isFreePos (rightwards pos) state then MoveRight
    else Idle
            
