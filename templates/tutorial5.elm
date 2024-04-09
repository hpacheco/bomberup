
import Game.Bot exposing (..)
import Tuple exposing (..)

findPowerup : State -> Maybe Position
findPowerup state = iterateBoard state.board Nothing
    (\prev pos cell -> case prev of
        Just _ -> prev
        Nothing -> case cell of
            Flames -> Just pos
            Bombs -> Just pos
            _ -> Nothing)

bot : State -> Move
bot state = case findPowerup state of
    Nothing -> Idle
    Just p -> moveTowards p state

