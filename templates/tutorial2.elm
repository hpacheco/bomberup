
import Game.Bot exposing (..)

bot : State -> Move
bot state = if column st.me.position < 7
    then MoveRight
    else MoveDown

