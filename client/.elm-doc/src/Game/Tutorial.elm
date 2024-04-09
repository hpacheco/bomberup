module Game.Tutorial exposing (..)

import Game.State exposing (..)
import Game.Bot as Bot
import Array exposing (..)
import Dict exposing (..)
import Utils exposing (..)
import Random

bot1 : Bot.Bot
bot1 st = Bot.MoveRight

bot2 : Bot.Bot
bot2 st =
    let (line,col) = st.me.position in
    if col < 7 then Bot.MoveRight else Bot.MoveDown
    
isFreePos : Bot.Position -> Bot.State -> Bool
isFreePos pos state = Bot.readCell pos state /= Bot.Wall && not (Bot.hasBomb pos state)

bot3 : Bot.Bot
bot3 state = let pos = state.me.position in
    if isFreePos (Bot.above pos) state then Bot.MoveUp
    else if isFreePos (Bot.below pos) state then Bot.MoveDown
    else if isFreePos (Bot.leftwards pos) state then Bot.MoveLeft
    else if isFreePos (Bot.rightwards pos) state then Bot.MoveRight
    else Bot.Idle

bot4 : Pos -> Bot.State -> Bot.Move
bot4 target state =
    let pos = state.me.position
        distanceFrom neighbor = if Bot.readCell neighbor state == Bot.Wall then 100 else Bot.euclidianDistance neighbor target
        min2 (d1,mv1) (d2,mv2) = if d1 <= d2 then (d1,mv1) else (d2,mv2)
        up = (distanceFrom (Bot.above pos),Bot.MoveUp)
        down = (distanceFrom (Bot.below pos),Bot.MoveDown)
        left = (distanceFrom (Bot.leftwards pos),Bot.MoveLeft)
        right = (distanceFrom (Bot.rightwards pos),Bot.MoveRight) in
    Tuple.second (min2 up (min2 down (min2 left right)))

findPowerup : Bot.State -> Maybe Pos
findPowerup state =
    Bot.iterateBoard state.board Nothing (\prev pos cell -> case prev of
        Just _ -> prev
        Nothing -> case cell of
            Bot.Flames -> Just pos
            Bot.Bombs -> Just pos
            _ -> Nothing)

bot5 : Bot.Bot
bot5 state = case findPowerup state of
    Nothing -> Bot.Idle
    Just p -> Bot.moveTowards p state

findPowerups : Bot.State -> List Pos
findPowerups state =
    Bot.iterateBoard state.board [] (\prev pos cell -> case cell of
        Bot.Flames -> pos :: prev
        Bot.Bombs -> pos :: prev
        _ -> prev)

closestTo : Pos -> List Pos -> Maybe (Float,Pos)
closestTo to ps = let min2 (d1,p1) (d2,p2) = if d1 <= d2 then (d1,p1) else (d2,p2) in
    Bot.iterate ps Nothing (\val pos -> let now = (Bot.euclidianDistance to pos,pos) in
        case val of
            Nothing -> Just now
            Just prev -> Just (min2 prev now))

bot6 : Bot.Bot
bot6 state =
    case closestTo state.me.position (findPowerups state) of
        Nothing -> Bot.Idle
        Just (_,p) -> Bot.moveTowards p state

tutorialBot : List Int -> Int -> Bot.Bot
tutorialBot rand i = case i of
    1 -> bot1
    2 -> bot2
    3 -> bot3
    4 -> bot4 (getRandPos rand 1)
    5 -> bot5
    6 -> bot6
    _ -> Bot.idleBot

getRandPos : List Int -> Int -> (Int,Int)
getRandPos xs i =
    let x = Maybe.withDefault (5) <| nth xs (i*2) in
    let y = Maybe.withDefault (5) <| nth xs (i*2+1) in
    (x,y)

tutorialPlayerState : List Int -> Int -> PlayerState
tutorialPlayerState rand i = case i of
    1 -> { pData = tutorialPlayerData, pPos = (5,5), pBombs = 1, pFlames = 1, pPlacedBombs = Dict.empty, pLastMove = Nothing }
    2 -> { pData = tutorialPlayerData, pPos = (5,5), pBombs = 1, pFlames = 1, pPlacedBombs = Dict.empty, pLastMove = Nothing }
    3 ->
        let bomb = { bPlayer = 0, bRadius = 1, bTime = 1 } in
        { pData = tutorialPlayerData, pPos = getRandPos rand 0, pBombs = 1, pFlames = 1, pPlacedBombs = Dict.singleton (getRandPos rand 1) bomb, pLastMove = Nothing }
    4 -> { pData = tutorialPlayerData, pPos = getRandPos rand 0, pBombs = 1, pFlames = 1, pPlacedBombs = Dict.empty, pLastMove = Nothing }
    5 -> { pData = tutorialPlayerData, pPos = getRandPos rand 1, pBombs = 1, pFlames = 1, pPlacedBombs = Dict.empty, pLastMove = Nothing }
    6 -> { pData = tutorialPlayerData, pPos = getRandPos rand 1, pBombs = 1, pFlames = 1, pPlacedBombs = Dict.empty, pLastMove = Nothing }
    _ -> { pData = tutorialPlayerData, pPos = (5,5), pBombs = 1, pFlames = 1, pPlacedBombs = Dict.empty, pLastMove = Nothing }

tutorialPlayerData : PlayerData
tutorialPlayerData = { pName = "bot", pAvatar = 24 }

tutorialPlayers : List Int -> Int -> Array Player
tutorialPlayers rand i = Array.fromList [PBot (simpleBot <| tutorialBot rand i) (tutorialPlayerState rand i) False, PNone,PNone,PNone]

tutorialPowerups : List Int -> Int -> Powerups
tutorialPowerups rand i = case i of
    1 -> Dict.singleton (5,9) Bombs
    2 -> Dict.singleton (8,7) Flames
    3 -> Dict.empty
    4 -> Dict.singleton (getRandPos rand 1) Flames
    5 -> Dict.fromList [(getRandPos rand 0,Flames),(getRandPos rand 2,Bombs)]
    6 -> Dict.fromList [(getRandPos rand 0,Flames),(getRandPos rand 2,Bombs)]
    _ -> Dict.empty

tutorialMap : Map
tutorialMap = createMap False 11

checkPos : Pos -> State -> Bool
checkPos pos st =
    let p = getPlayer 0 st.players in case getPlayerState p of
        Nothing -> True
        Just (pst,isDead) -> pst.pPos == pos

tutorialEnd : List Int -> Int -> State -> Bool
tutorialEnd rand i st = case i of
    1 -> checkPos (5,9) st
    2 -> checkPos (8,7) st
    3 -> st.clock > 2
    4 -> checkPos (getRandPos rand 1) st
    5 -> Dict.isEmpty st.powerups
    6 -> Dict.isEmpty st.powerups
    _ -> True

initTutorialState : List Int -> Int -> State
initTutorialState rand i = 
    { seed = Nothing, map = tutorialMap, players = tutorialPlayers rand i, powerups = tutorialPowerups rand i, burned = Dict.empty, clock = 0, caracol = [] }