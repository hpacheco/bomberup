module Game.AI (easyBot,mediumBot,hardBot) where

import Game.State 
import System.Random as Random
import Data.List as List
import Data.Map as Map
import Data.Set as Set
import Data.Foldable
import Data.Maybe as Maybe
import Control.Monad
import DB

botByName :: String -> Bot
botByName "easy" = easyBot
botByName "medium" = mediumBot
botByname "hard" = hardBot

-- EASY

-- just tries to stay alive
easyBot :: Bot
easyBot pid st = case getBotPlayer pid st of
    Nothing -> return Idle
    Just pst -> 
        let danger = bombPositions st
        in if Map.member (pPos pst) danger
            then return $ avoidDanger (board st) danger pst
            else randomBot (pPos pst) pid st
            
possibleMoves :: Board -> Pos -> [(Pos,Move)]
possibleMoves board pos =
    let moves = [(moveUp pos,MoveUp),(moveDown pos,MoveDown),(moveLeft pos,MoveLeft),(moveRight pos,MoveRight)]
        movable (p,_) = case getCell p board of
            Empty -> True
            _ -> False
    in List.filter movable moves
            
avoidDanger :: Board -> Map Pos Bool -> PlayerState -> Move
avoidDanger board danger pst = 
    let pos = pPos pst
        moves = possibleMoves board pos
        bombs = Map.keys $ Map.filter id danger
        bombsDist p1 = List.foldl (\i p2 -> distance p1 p2 + i) 0 bombs
        movesAwayFromBombs = List.sortOn fst $ List.map (\(x,y) -> (-(bombsDist x),(x,y))) moves
        safeMoves = List.filter (\(_,(x,y)) -> not $ Map.member x danger) movesAwayFromBombs
    in case safeMoves of
        (x:xs) -> snd $ snd x
        [] -> case movesAwayFromBombs of
            [] -> DropBomb
            (y:ys) -> snd $ snd y

-- MEDIUM

-- tries to stay alive and move to the center
mediumBot :: Bot
mediumBot pid st = case getBotPlayer pid st of
    Nothing -> return (Idle)
    Just pst -> 
        let danger = bombPositions st
        in if Map.member (pPos pst) danger
            then return (avoidDanger (board st) danger pst)
            else return (moveToCenter (board st) danger pst)

moveToCenter :: Board -> Map Pos Bool -> PlayerState -> Move
moveToCenter board danger pst = 
    let pos = pPos pst
        moves = [(moveUp pos,MoveUp),(moveDown pos,MoveDown),(moveLeft pos,MoveLeft),(moveRight pos,MoveRight)]
        safeMoves = List.filter (\(x,y) -> not $ Map.member x danger) moves -- avoid moving into a bomb
        movable (p,mv) = case getCell p board of
            Empty -> Just (distance center p,mv)
            Box -> Just (distance center p,DropBomb)
            _ -> Nothing
        centerMoves = List.sortOn fst $ filterMap movable safeMoves
    in case centerMoves of
        [] -> DropBomb
        (y:ys) -> snd y
   
corners :: Set Pos
corners = Set.fromList [(1,1),(1,9),(9,1),(9,9)]
   
center :: Pos
center = (5,5)

getBotPlayer :: PlayerId -> State -> Maybe PlayerState
getBotPlayer pid st = case (players st !! pid) of
        PNone -> Nothing
        PBot _ pst _ -> Just pst
    
randomBot :: Pos -> Bot
randomBot pos pid st = do
    let bomb = if Set.member pos corners then [] else [DropBomb]
    seed <- initStdGen
    let (mv,_) = uniformRs (bomb ++ [MoveUp,MoveDown,MoveLeft,MoveRight]) seed
    return mv
    
bombPositions :: State -> Map Pos Bool
bombPositions st = List.foldl (playerBombsPositions (board st)) Map.empty $ zip [0..] (players st)

playerBombsPositions :: Board -> Map Pos Bool -> (PlayerId,Player) -> Map Pos Bool
playerBombsPositions board s (pid,p) = case p of
    PNone -> s
    PBot _ pst _ -> Map.unionWith (||) s (concatMaps (||) $ List.map (bombExplodes board pid) $ Map.toList (pPlacedBombs pst))
    
bombExplodes :: Board -> PlayerId -> (Pos,Bomb) -> Map Pos Bool
bombExplodes board pid (pos,b) = Map.mapWithKey (\p flames -> List.length (List.filter (\(x,y) -> y==0) flames) > 0) $ explodePos pid pos (bRadius b) board Map.empty

-- arithmetic distance
distance :: Pos -> Pos -> Float
distance (x1,y1) (x2,y2) =
    let dist :: Int -> Int -> Float
        dist x y = realToFrac (if x > y then x-y else y-x)
    in average2 (dist x1 x2) (dist y1 y2)
    
average2 :: Float -> Float -> Float
average2 x y = (x + y) / 2
    
-- HARD

allPlays :: [Play]
allPlays = [0..5]

-- a tree of moves
type Play = Int
data PlayTree = PlayNode (Map Play (Score,PlayTree)) | PlayLeaf

computePlays :: State -> Int -> PlayTree
computePlays st player = computePlaysAux 1 5 st player
    
computePlaysAux :: Int -> Int -> State -> Int -> PlayTree
computePlaysAux it depth st player = if it > depth then PlayLeaf else
    PlayNode $ Map.fromList $ catMaybes $ List.map (computePlay it depth st player) allPlays

computePlay :: Int -> Int -> State -> Int -> Play -> Maybe (Play,(Score,PlayTree))
computePlay it depth st player play = case makeMoveMaybe (Just $ min 3 $ depth-it) (Just 2) (player,intToMove play) st of
    Nothing -> Nothing
    Just (pstN,stN) -> 
        let dist = distance center (pPos pstN)
            ops = List.length (alivePlayers stN) - 1
            bricks = boardBoxes (board stN)
            powas = (pBombs pstN) + (pFlames pstN)
            score = Score { sOponents = (ops,it), sPowers = (powas,it), sBricks = (bricks,it), sDistCenter = (dist,it) }
            stNN = tickState $ tickBombs $ advanceCaracol stN 
            tree = computePlaysAux (it+1) depth stNN player
        in case tree of -- eliminate branches with a certain death (i.e, those with empty maps)
            PlayNode xs -> if Map.null xs
                then Nothing
                else Just (play,(score,PlayNode xs))
            PlayLeaf -> Just (play,(score,PlayLeaf))

--computeChain : Pos -> State -> Int
--computeChain pos st = Dict.size <| Dict.filter (\k v -> not v && k==pos) <| bombPositions st

data Score = Score { sOponents :: (Int,Int), sPowers :: (Int,Int), sBricks :: (Int,Int), sDistCenter :: (Float,Int) }

memptyScore :: Score
memptyScore = Score { sOponents = (3,1000), sPowers = (0,1000), sBricks = (1000,1000), sDistCenter = (1000,1000) }

mappendScore :: Score -> Score -> Score
mappendScore s1 s2 = Score
    { sOponents = min (sOponents s1) (sOponents s2)
    , sPowers = maxmin (sPowers s1) (sPowers s2)
    , sBricks = min (sBricks s1) (sBricks s2)
    , sDistCenter = min (sDistCenter s1) (sDistCenter s2)
    }

mconcatScore :: [Score] -> Score
mconcatScore = List.foldl mappendScore memptyScore

compareScore :: Score -> Score -> Ordering
compareScore s1 s2 = mconcatOrder [compare (sOponents s1) (sOponents s2),comparemaxmin (sPowers s1) (sPowers s2),compare (sBricks s1) (sBricks s2),compare (sDistCenter s1) (sDistCenter s2)]

comparemaxmin :: (Int,Int) -> (Int,Int) -> Ordering
comparemaxmin (x1,x2) (y1,y2) = mconcatOrder [compare y1 x1,compare x2 y2]

maxmin :: (Int,Int) -> (Int,Int) -> (Int,Int)
maxmin (x1,x2) (y1,y2) = 
    if x1 == y1 then (x1,min x2 y2)
    else if x1 > y1 then (x1,x2)
    else (y1,y2)

memptyOrder :: Ordering
memptyOrder = EQ

mappendOrder :: Ordering -> Ordering -> Ordering
mappendOrder x y = case x of
    LT -> LT
    EQ -> y
    GT -> GT

mconcatOrder :: [Ordering] -> Ordering
mconcatOrder = List.foldr mappendOrder memptyOrder

scorePlays :: PlayTree -> Map Play Score
scorePlays t = case t of
    PlayNode xs -> Map.map (scorePlay) xs
    PlayLeaf -> Map.empty

scorePlay :: (Score,PlayTree) -> Score
scorePlay (score,t) = mappendScore score $ mconcatScore $ Map.elems $ scorePlays t

hardBot :: Bot
hardBot player st =
    let best (x1,s1) (x2,s2) = mconcatOrder [compareScore s1 s2,comparePlay x1 x2]
        plays = computePlays st player
        scores = scorePlays plays
    in case Map.toList scores of
        [] -> case allPlays !! (mod (clock st) 6) of -- sort of random
            mv -> return (intToMove mv)
        xs -> case List.sortBy best xs of
            [] -> case allPlays !! (mod (clock st) 6) of -- sort of random
                mv -> return (intToMove mv)
            (s:ss) -> return (intToMove $ fst s)

comparePlay :: Play -> Play -> Ordering
comparePlay x y = if x == y then EQ
    else case (intToMove x,intToMove y) of
        (DropBomb,_) -> LT
        (Idle,_) -> GT
        (_,Idle) -> LT
        _ -> compare x y
