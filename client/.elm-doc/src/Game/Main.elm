module Game.Main exposing (..)

import Game.State exposing (..)
import Game.Draw exposing (..)
import Game.Playground exposing (..)
import Game.Window as Window exposing (..)
import Array exposing (..)
import Dict
import Set
import List
import Random
import Tuple exposing (..)
import API exposing (..)
import Json.Decode as D
import Game.Bot as Bot 
import Game.AI exposing (easyBot,mediumBot,hardBot)
import Game.Tutorial exposing (initTutorialState,tutorialEnd)

type GameState = Game State | Animate State State Regions Int | Tutorial State Bool (State -> Bool)

initTutorial : TutorialFlags -> GameState
initTutorial t =
    let rand = t.tutorialRand in
    Tutorial (initTutorialState rand t.tutorialId) t.tutorialRun (tutorialEnd rand t.tutorialId) 

parseFlagsPlayer : Int -> String -> Player
parseFlagsPlayer i type_ = case type_ of
    "human"  -> PHuman (newPlayerState mapsize i { pName = "Human", pAvatar = 0 }) False
    "easy"   -> PBot easyBot (newPlayerState mapsize i { pName = "Bot (Easy)", pAvatar = 0 }) False
    "medium" -> PBot mediumBot (newPlayerState mapsize i { pName = "Bot (Medium)", pAvatar = 0 }) False
    "hard"   -> PBot hardBot (newPlayerState mapsize i { pName = "Bot (Hard)", pAvatar = 0 }) False
    _ -> PNone

decodeTutorialFlags : D.Value -> Maybe TutorialFlags
decodeTutorialFlags v = case D.decodeValue jsonDecTutorialFlags v of
    Err err -> Nothing
    Ok flags -> Just flags

parseGameFlags : GameFlags -> List Player
parseGameFlags flags = List.take 4 (List.indexedMap parseFlagsPlayer flags.gamePlayers ++ List.repeat 4 PNone)

decodeGameFlags : D.Value -> Maybe GameFlags
decodeGameFlags v = case D.decodeValue jsonDecGameFlags v of
    Err err -> Nothing
    Ok flags -> Just flags

parseMatchInfo : MatchInfo -> MatchData -> List Player
parseMatchInfo m dta =
    let mv1 = Array.fromList <| List.map intToMove dta.mMoves1
        mv2 = Array.fromList <| List.map intToMove dta.mMoves2
        ps = Array.fromList [PNone,PNone,PNone,PNone] 
        pst1 = newPlayerState mapsize m.mP1.mpId { pName = m.mP1.mpName, pAvatar = m.mP1.mpAvatar }
        bot1 = \st -> Maybe.withDefault MoveError <| Array.get st.time mv1 
        ps1 = Array.set m.mP1.mpId (PBot (errorBot bot1) pst1 False) ps
        pst2 = newPlayerState mapsize m.mP2.mpId { pName = m.mP2.mpName, pAvatar = m.mP2.mpAvatar }
        bot2 = \st -> Maybe.withDefault MoveError <| Array.get st.time mv2
        ps2 = Array.set m.mP2.mpId (PBot (errorBot bot2) pst2 False) ps1
    in Array.toList ps2

decodeMatch : D.Value -> Maybe Match
decodeMatch v = case D.decodeValue jsonDecMatch v of
    Err err -> Nothing
    Ok match -> Just match

mainWithFlags : Program D.Value (Game GameState) Msg
mainWithFlags = game 5 viewGameState updateGameState initGameState initGameStateRandom

initGameStateRandom : Random.Seed -> GameState -> GameState
initGameStateRandom seed st = case st of
    Game s -> Game <| initRandom seed s
    Animate s0 s rs speed -> let sN = { s | seed = Just seed } in Animate sN sN Dict.empty speed
    Tutorial s b end -> let sN = { s | seed = Just seed } in Tutorial sN b end

--mainWithoutFlags : List Player -> Program () (Game State) Msg
--mainWithoutFlags players = game 5 view update (\flags -> initState players) initRandom

main = mainWithFlags

initGameState : D.Value -> GameState
initGameState v = case decodeGameFlags v of
    Just flags -> Game <| initState [] <| parseGameFlags flags
    Nothing -> case decodeMatch v of
        Just match ->
            let st = parseMatchInfo match.mInfo match.mData in
            let s0 = (initState match.mData.mPowers st) in
            Animate s0 s0 Dict.empty 5
        Nothing -> case decodeTutorialFlags v of
            Just flags -> initTutorial flags
            Nothing -> Game <| initState [] <| parseGameFlags defaultGameFlags

viewGameState : Computer -> GameState -> List Shape
viewGameState computer st = case st of
    Game s -> viewGame computer s Nothing Nothing True
    Animate s0 s rs speed -> viewGame computer s (Just rs) (Just speed) True
    Tutorial s b end -> viewGame computer s Nothing (Just 5) False

viewGame : Computer -> State -> Maybe Regions -> Maybe Int -> Bool -> List Shape
viewGame computer st rs speed drawPane = (drawMap computer st rs (Maybe.withDefault 5 speed) drawPane computer.screen).windowDraw

regionsGame : Computer -> State -> Regions
regionsGame computer st = (drawMap computer st Nothing 5 True computer.screen).windowRegions

updateGameState : Computer -> Msg -> GameState -> GameState
updateGameState computer msg st = case st of
    Game s -> Game (updateGame computer msg s)
    Animate s0 s r speed -> let (sN,rN,speedN) = updateAnimate computer msg s0 (s,r,speed) in Animate s0 sN rN speedN
    Tutorial s b e -> let (sN,bN) = updateTutorial computer msg e (s,b) in Tutorial sN bN e

updateGame : Computer -> Msg -> State -> State
updateGame computer msg st =
    case msg of
        TickGame -> advanceTime checkGameEnd st
        KeyChanged True key -> case readPlayerMove key of
            Nothing -> st
            Just (pid,mv) -> makeMove checkGameEnd Nothing Nothing (pid,BotMove mv) st
        _ -> st

updateAnimate : Computer -> Msg -> State -> (State,Regions,Int) -> (State,Regions,Int)
updateAnimate computer msg s0 (st,rs,speed) =
    case msg of
        TickGame -> if speed == 10 then (advanceTime checkGameEnd <| advanceTime checkGameEnd st,rs,speed)
            else if speed == 5 then (advanceTime checkGameEnd st,rs,speed)
            else if speed == 2 && (modBy 2 computer.ticks == 0) then (advanceTime checkGameEnd st,rs,speed)
            else if speed == 1 && (modBy 5 computer.ticks == 0) then (advanceTime checkGameEnd st,rs,speed)
            else (st,rs,speed)
        Resized w h -> (st,regionsGame { computer | screen = toScreen (toFloat w) (toFloat h) } st,speed)
        MouseClick ->
            let (stN,speedN) = Dict.foldl (\k v s -> if Window.mouseInsideRegion computer.mouse v then clickButton k s0 s else s) (st,speed) rs in
            (stN,rs,speedN)
        _ -> (st,rs,speed)

updateTutorial : Computer -> Msg -> (State -> Bool) -> (State,Bool) -> (State,Bool)
updateTutorial computer msg checkEnd (st,b) =
    case msg of
        TickGame -> if checkEnd st
            then (st,False)
            else if b then (advanceTime (\_ -> False) st,b) else (st,b)
        _ -> (st,b)

clickButton : String -> State -> (State,Int) -> (State,Int)
clickButton n s0 (st,speed) = case n of
    "rewind" -> (s0,speed)
    "slow" -> (st,prevSpeed speed)
    "fast" -> (st,nextSpeed speed)
    _ -> (st,speed)

prevSpeed : Int -> Int
prevSpeed i = case i of
    10 -> 5
    5 -> 2
    2 -> 1
    _ -> 0
    
nextSpeed : Int -> Int
nextSpeed i = case i of
    0 -> 1
    1 -> 2
    2 -> 5
    _ -> 10

readPlayerMove : String -> Maybe (PlayerId,Bot.Move)
readPlayerMove key = case key of
    "e" -> Just (0,Bot.DropBomb)
    "w" -> Just (0,Bot.MoveUp)
    "s" -> Just (0,Bot.MoveDown)
    "a" -> Just (0,Bot.MoveLeft)
    "d" -> Just (0,Bot.MoveRight)
    
    "y" -> Just (1,Bot.DropBomb)
    "t" -> Just (1,Bot.MoveUp)
    "g" -> Just (1,Bot.MoveDown)
    "f" -> Just (1,Bot.MoveLeft)
    "h" -> Just (1,Bot.MoveRight)
    
    "o" -> Just (2,Bot.DropBomb)
    "i" -> Just (2,Bot.MoveUp)
    "k" -> Just (2,Bot.MoveDown)
    "j" -> Just (2,Bot.MoveLeft)
    "l" -> Just (2,Bot.MoveRight)
    
    " "          -> Just (3,Bot.DropBomb)
    "ArrowUp"    -> Just (3,Bot.MoveUp)
    "ArrowDown"  -> Just (3,Bot.MoveDown)
    "ArrowLeft"  -> Just (3,Bot.MoveLeft)
    "ArrowRight" -> Just (3,Bot.MoveRight)
    
    _ -> Nothing
