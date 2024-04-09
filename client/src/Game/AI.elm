module Game.AI exposing (..)

import Game.State exposing (..)
import Array exposing (..)
import Set exposing (..)
import Dict exposing (..)
import Game.Bot as Bot
import Tuple exposing (..)
import Random
import Utils exposing (..) 
--import Debug

-- EASY

-- just tries to stay alive
easyBot : Bot
easyBot seed pid st = case getBotPlayer pid st of
    Nothing -> (seed,MoveError)
    Just pst -> 
        let danger = bombPositions st
        in if Dict.member pst.pPos danger
            then (seed,avoidDanger st.map.board danger pst)
            else randomBot pst.pPos seed pid st
            
possibleMoves : Board -> Pos -> List (Pos,Move)
possibleMoves board pos =
    let moves = [(moveUp pos,BotMove Bot.MoveUp),(moveDown pos,BotMove Bot.MoveDown),(moveLeft pos,BotMove Bot.MoveLeft),(moveRight pos,BotMove Bot.MoveRight)]
        movable (p,_) = case getCell p board of
            Just Empty -> True
            _ -> False
    in List.filter movable moves
            
avoidDanger : Board -> Dict Pos Bool -> PlayerState -> Move
avoidDanger board danger pst = 
    let pos = pst.pPos
        moves = possibleMoves board pos
        bombs = Dict.keys <| Dict.filter (\_ b -> b) danger
        bombsDist p1 = List.foldl (\p2 i -> distance p1 p2 + i) 0 bombs
        movesAwayFromBombs = List.sortBy first <| List.map (\(x,y) -> (-(bombsDist x),(x,y))) moves
        safeMoves = List.filter (\(_,(x,y)) -> not <| Dict.member x danger) movesAwayFromBombs
    in case safeMoves of
        (x::xs) -> second <| second x
        [] -> case movesAwayFromBombs of
            [] -> BotMove Bot.DropBomb
            (y::ys) -> second <| second y

-- MEDIUM

-- tries to stay alive and move to the center
mediumBot : Bot
mediumBot seed pid st = case getBotPlayer pid st of
    Nothing -> (seed,MoveError)
    Just pst -> 
        let danger = bombPositions st
        in if Dict.member pst.pPos danger
            then (seed,avoidDanger st.map.board danger pst)
            else (seed,moveToCenter st.map.board danger pst)

moveToCenter : Board -> Dict Pos Bool -> PlayerState -> Move
moveToCenter board danger pst = 
    let pos = pst.pPos
        moves = [(moveUp pos,BotMove Bot.MoveUp),(moveDown pos,BotMove Bot.MoveDown),(moveLeft pos,BotMove Bot.MoveLeft),(moveRight pos,BotMove Bot.MoveRight)]
        safeMoves = List.filter (\(x,y) -> not <| Dict.member x danger) moves -- avoid moving into a bomb
        movable (p,mv) = case getCell p board of
            Just Empty -> Just (distance center p,mv)
            Just Box -> Just (distance center p,BotMove Bot.DropBomb)
            _ -> Nothing
        centerMoves = List.sortBy first <| List.filterMap movable safeMoves
    in case centerMoves of
        [] -> BotMove Bot.DropBomb
        (y::ys) -> second y
   
corners : Set Pos
corners = Set.fromList [(1,1),(1,9),(9,1),(9,9)]
   
center : Pos
center = (5,5)

getBotPlayer : PlayerId -> State -> Maybe PlayerState
getBotPlayer pid st = case Array.get pid st.players of
    Nothing -> Nothing
    Just p -> case p of
        PNone -> Nothing
        PHuman pst _ -> Just pst
        PBot _ pst _ -> Just pst
    
randomBot : Pos -> Bot
randomBot pos seed pid st =
    let bomb = if Set.member pos corners then [] else [BotMove Bot.DropBomb]
        gen = Random.uniform (BotMove Bot.MoveUp) (bomb ++ [BotMove Bot.MoveDown,BotMove Bot.MoveLeft,BotMove Bot.MoveRight])
        (mv,seed1) = Random.step gen seed
    in (seed1,mv)
    
bombPositions : State -> Dict Pos Bool
bombPositions st = List.foldl (playerBombsPositions st.map.board) Dict.empty <| Array.toIndexedList st.players

playerBombsPositions : Board -> (PlayerId,Player) -> Dict Pos Bool -> Dict Pos Bool
playerBombsPositions board (pid,p) s = case p of
    PNone -> s
    PBot _ pst _ -> unionDict (||) s (concatDicts (||) <| List.map (bombExplodes board pid) <| Dict.toList pst.pPlacedBombs)
    PHuman pst _ -> unionDict (||) s (concatDicts (||) <| List.map (bombExplodes board pid) <| Dict.toList pst.pPlacedBombs)
    
bombExplodes : Board -> PlayerId -> (Pos,Bomb) -> Dict Pos Bool
bombExplodes board pid (pos,b) = Dict.map (\p flames -> List.length (List.filter (\(x,y) -> y==0) flames) > 0) <| explodePos pid pos b.bRadius board Dict.empty

-- arithmetic distance
distance : Pos -> Pos -> Float
distance (x1,y1) (x2,y2) =
    let dist x y = toFloat (if x > y then x-y else y-x)
    in average2 (dist x1 x2) (dist y1 y2)
    
-- HARD

allPlays : List Play
allPlays = List.range 0 5

-- a tree of moves
type alias Play = Int
type PlayTree = PlayNode (Dict Play (Score,PlayTree)) | PlayLeaf

computePlays : State -> Int -> PlayTree
computePlays st player = computePlaysAux 1 5 st player
    
computePlaysAux : Int -> Int -> State -> Int -> PlayTree
computePlaysAux it depth st player = if it > depth then PlayLeaf else
    PlayNode <| Dict.fromList <| catMaybes <| List.map (computePlay it depth st player) allPlays

computePlay : Int -> Int -> State -> Int -> Play -> Maybe (Play,(Score,PlayTree))
computePlay it depth st player play = case makeMoveMaybe checkGameEnd (Just <| min 3 <| depth-it) (Just 2) (player,intToMove play) st of
    Nothing -> Nothing
    Just (pstN,stN) -> 
        let dist = distance center pstN.pPos
            ops = List.length (alivePlayers stN) - 1
            bricks = boardBoxes stN.map.board
            powas = pstN.pBombs + pstN.pFlames
            score = { sOponents = (ops,it), sPowers = (powas,it), sBricks = (bricks,it), sDistCenter = (dist,it) }
            stNN = advanceCaracol stN |> tickBombs |> tickState
            tree = computePlaysAux (it+1) depth stNN player
        in case tree of -- eliminate branches with a certain death (i.e, those with empty maps)
            PlayNode xs -> if Dict.isEmpty xs
                then Nothing
                else Just (play,(score,PlayNode xs))
            PlayLeaf -> Just (play,(score,PlayLeaf))

--computeChain : Pos -> State -> Int
--computeChain pos st = Dict.size <| Dict.filter (\k v -> not v && k==pos) <| bombPositions st

type alias Score = { sOponents : (Int,Int), sPowers : (Int,Int), sBricks : (Int,Int), sDistCenter : (Float,Int) }

memptyScore : Score
memptyScore = { sOponents = (3,1000), sPowers = (0,1000), sBricks = (1000,1000), sDistCenter = (1000,1000) }

mappendScore : Score -> Score -> Score
mappendScore s1 s2 =
    { sOponents = min s1.sOponents s2.sOponents
    , sPowers = maxmin s1.sPowers s2.sPowers
    , sBricks = min s1.sBricks s2.sBricks
    , sDistCenter = min s1.sDistCenter s2.sDistCenter
    }

mconcatScore : List Score -> Score
mconcatScore = List.foldl mappendScore memptyScore

compareScore : Score -> Score -> Order
compareScore s1 s2 = mconcatOrder [compare s1.sOponents s2.sOponents,comparemaxmin s1.sPowers s2.sPowers,compare s1.sBricks s2.sBricks,compare s1.sDistCenter s2.sDistCenter]

comparemaxmin : (Int,Int) -> (Int,Int) -> Order
comparemaxmin (x1,x2) (y1,y2) = mconcatOrder [compare y1 x1,compare x2 y2]

maxmin : (Int,Int) -> (Int,Int) -> (Int,Int)
maxmin (x1,x2) (y1,y2) = 
    if x1 == y1 then (x1,min x2 y2)
    else if x1 > y1 then (x1,x2)
    else (y1,y2)

memptyOrder : Order
memptyOrder = EQ

mappendOrder : Order -> Order -> Order
mappendOrder x y = case x of
    LT -> LT
    EQ -> y
    GT -> GT

mconcatOrder : List Order -> Order
mconcatOrder = List.foldr mappendOrder memptyOrder

scorePlays : PlayTree -> Dict Play Score
scorePlays t = case t of
    PlayNode xs -> Dict.map (\_ -> scorePlay) xs
    PlayLeaf -> Dict.empty

scorePlay : (Score,PlayTree) -> Score
scorePlay (score,t) = mappendScore score <| mconcatScore <| Dict.values <| scorePlays t

hardBot : Bot
hardBot seed player st =
    let best (x1,s1) (x2,s2) = mconcatOrder [compareScore s1 s2,comparePlay x1 x2]
        plays = computePlays st player
        scores = scorePlays plays
    in case Dict.toList scores of
        [] -> case nth allPlays (modBy 6 st.clock) of -- sort of random
            Nothing -> (seed,BotMove Bot.Idle)
            Just mv -> (seed,intToMove mv)
        xs -> case List.sortWith best xs of
            [] -> case nth allPlays (modBy 6 st.clock) of -- sort of random
                Nothing -> (seed,BotMove Bot.Idle)
                Just mv -> (seed,intToMove mv)
            (s::ss) -> (seed,intToMove <| first s)

comparePlay : Play -> Play -> Order
comparePlay x y = if x == y then EQ
    else case (intToMove x,intToMove y) of
        (BotMove Bot.DropBomb,_) -> LT
        (MoveError,_) -> GT
        (_,MoveError) -> LT
        (BotMove Bot.Idle,_) -> GT
        (_,BotMove Bot.Idle) -> LT
        _ -> compare x y
