module Game.State exposing (..)

import Array exposing (..)
import Dict exposing (..)
import Set exposing (..)
import Tuple exposing (..)
import List exposing (..)
import Utils exposing (..)
import Random exposing (..)
import Tuple exposing (..)
import Game.Bot as Bot
--import Bytes exposing (Bytes(..),Endianness(..))
--import Bytes.Encode as Encode exposing (Encoder)
--import Bytes.Decode as Decode exposing (Decoder)
import API exposing (..)

type alias PlayerId = Int
type alias Pos = (Int,Int)
type Cell = Wall | Empty | Box
type alias Line = Array Cell
type alias Board = Array Line
type alias Map = { board : Board, size : Int }
type alias PlayerData = { pName : String, pAvatar : Int }
type alias PlayerState = { pData : PlayerData, pPos : Pos, pBombs : Int, pFlames : Int, pPlacedBombs : Bombs, pLastMove : Maybe (Move,Bool) }
type Player
    = PBot Bot PlayerState Bool
    | PHuman PlayerState Bool
    | PNone
type alias Bomb = { bPlayer : PlayerId, bRadius : Int, bTime : Int }
type alias Bombs = Dict Pos Bomb
type alias Flame = Int
type Powerup = Bombs | Flames
type alias Powerups = Dict Pos Powerup
type alias BurnedPos = List (PlayerId,Flame)
type alias Burned = Dict Pos BurnedPos
type alias State = { seed : Maybe Seed, map : Map, players : Array Player, powerups : Powerups, burned : Burned, clock : Int, caracol : List (Maybe Pos) }
type alias ExtCell = { eCell : Cell, eBombs : List Bomb, ePlayers : List (PlayerId,PlayerState), eBurned : BurnedPos, ePowerup : Maybe Powerup }

type alias Bot = Seed -> PlayerId -> State -> (Seed,Move)
type Move = BotMove Bot.Move | MoveError

errorBot : (Bot.State -> Move) -> Bot
errorBot bot seed pid st = (seed,bot <| toBotState pid st)

simpleBot : Bot.Bot -> Bot
simpleBot bot seed pid st = (seed,BotMove <| bot <| toBotState pid st)

toBotMove : Move -> Bot.Move
toBotMove m = case m of
    BotMove b -> b
    MoveError -> Bot.Idle

toBotState : PlayerId -> State -> Bot.State
toBotState pid st =
    let pws = st.powerups
        boardN = Array.indexedMap (\l -> Array.indexedMap (\c -> toBotCell pws (l,c))) st.map.board
        me = toBotPlayer pid <| Maybe.withDefault PNone <| Array.get pid st.players
        oid = Maybe.withDefault 0 <| List.head <| List.filterMap (\(i,p) -> if i/=pid && isBot p then Just i else Nothing) <| Array.toIndexedList st.players
        op = toBotPlayer oid <| Maybe.withDefault PNone <| Array.get oid st.players
    in { time = st.clock, board = boardN, me = me, opponent = op }

isBot : Player -> Bool
isBot p = case p of
    PBot _ _ _ -> True
    _ -> False

toBotPlayer : PlayerId -> Player -> Bot.Player
toBotPlayer pid p = case p of
    PNone -> noBotPlayer
    PHuman pst _ -> toBotPlayerState pid pst
    PBot _ pst _ -> toBotPlayerState pid pst

toBotPlayerState : PlayerId -> PlayerState -> Bot.Player
toBotPlayerState i p = { position = p.pPos, bombs = p.pBombs, flames = p.pFlames, dropped = List.map toBotBomb <| Dict.toList p.pPlacedBombs }

noBotPlayer : Bot.Player
noBotPlayer = { position = (0,0), bombs = 0, flames =0, dropped = [] }

toBotBomb : (Pos,Bomb) -> Bot.Bomb
toBotBomb (p,b) = { pos = p, timer = b.bTime, radius = b.bRadius }

toBotCell : Powerups -> Pos -> Cell -> Bot.Cell
toBotCell pws pos cell = case cell of
    Wall -> Bot.Wall
    Box -> Bot.Box
    Empty -> case Dict.get pos pws of
        Nothing -> Bot.Empty
        Just Bombs -> Bot.Bombs
        Just Flames -> Bot.Flames

addAvatars : (Seed,State) -> (Seed,State)
addAvatars (seed,st) =
    let (avatars,_) = Random.step (Random.list 4 (Random.int 1 28)) seed
        playersN = Array.indexedMap (\i p -> addAvatar (Maybe.withDefault 15 <| nth avatars i) p) st.players
    in (seed,{ st | players = playersN })
    
addAvatar : Int -> Player -> Player
addAvatar a p = case p of
    PNone -> PNone
    PBot b pst dead -> PBot b (addAvatarState a pst) dead
    PHuman pst dead -> PHuman (addAvatarState a pst) dead

addAvatarState : Int -> PlayerState -> PlayerState
addAvatarState a pst =
    let data = pst.pData
        dataN = { data | pAvatar = a } 
    in if data.pAvatar < 1 || data.pAvatar > 28 then { pst | pData = dataN } else pst

addPowerups : (Seed,State) -> (Seed,State)
addPowerups (seed,st) =
    let sz = st.map.size
        (seed1,pws) = genPowerup Bombs 5 sz (seed,st.powerups) |> genPowerup Flames 5 sz
    in (seed1,{ st | powerups = pws })

generatePos : Int -> Generator Pos
generatePos n = Random.uniform (1,3) <| rangePos n (1,4) (n-2,n-2)

--generatePosPure : Int -> Pos
--generatePosPure seed =
--    let xs = rangePos mapsize (1,3) (mapsize-2,mapsize-2) in
--    Maybe.withDefault (5,5) <| nth xs (modBy (List.length xs) seed)

rangePos : Int -> Pos -> Pos -> List Pos
rangePos n (l1,c1) (l2,c2) =
    let addPos : Pos -> List Pos -> List Pos
        addPos p ps = if isStart n p || isWall n p then ps else p :: ps in
    case (compare l1 l2,compare c1 c2) of
        (LT,LT) -> addPos (l1,c1) <| rangePos n (l1,c1+1) (l2,c2)
        (LT,EQ) -> addPos (l1,c1) <| rangePos n (l1+1,0) (l2,c2)
        (EQ,LT) -> addPos (l1,c1) <| rangePos n (l1,c1+1) (l2,c2)
        (EQ,EQ) -> addPos (l1,c1) []
        _ -> []

genPowerup : Powerup -> Int -> Int -> (Seed,Powerups) -> (Seed,Powerups)
genPowerup pw i sz (seed,pws) = if i <= 0 then (seed,pws) else
    let (pos,seedN) = Random.step (generatePos sz) seed
        pwsN = Dict.insert pos pw pws
    in genPowerup pw (i-1) sz (seedN,pwsN)

newPlayerPos : Int -> Int -> Pos
newPlayerPos n i = case i of
    0 -> (1,1)
    1 -> (1,n-2)
    2 -> (n-2,1)
    3 -> (n-2,n-2)
    _ -> (0,0)

newPlayerState : Int -> Int -> PlayerData -> PlayerState
newPlayerState n i pd = { pData = pd, pPos = newPlayerPos n i, pBombs = 1, pFlames = 1, pPlacedBombs = Dict.empty, pLastMove = Nothing }

getPlayer : Int -> Array Player -> Player
getPlayer i ps = Array.get i ps |> Maybe.withDefault PNone

getCell : Pos -> Board -> Maybe Cell
getCell (l,c) b = Array.get c (Array.get l b |> Maybe.withDefault Array.empty)

setCell : Pos -> Cell -> Board -> Board
setCell (l,c) x b = case Array.get l b of
    Nothing -> b
    Just ys -> case Array.get c ys of
        Nothing -> b
        Just y -> Array.set l (Array.set c x ys) b

getPlayerState : Player -> Maybe (PlayerState,Bool)
getPlayerState p = case p of
    PHuman st isDead -> Just (st,isDead)
    PBot _ st isDead -> Just (st,isDead)
    _ -> Nothing
    
setPlayerState : PlayerState -> Player -> Player
setPlayerState pst p = case p of
    PNone -> PNone
    PHuman _ isDead -> PHuman pst isDead
    PBot b _ isDead -> PBot b pst isDead

getPlayerStates : Array Player -> List (PlayerId,(PlayerState,Bool))
getPlayerStates ps = List.filterMap (\(i,p) -> Maybe.map (\x -> (i,x)) <| getPlayerState p) <| Array.toIndexedList ps

getExtCell : Pos -> State -> Maybe ExtCell
getExtCell pos st = case getCell pos st.map.board of
    Nothing -> Nothing
    Just cell -> 
        let psts = getPlayerStates st.players
            pstsP = List.map (\(x,y) -> (x,first y)) <| List.filter (\(_,(p,isDead)) -> not isDead && p.pPos == pos) psts
            pbombs = List.map (second >> first >> .pPlacedBombs >> Dict.get pos) psts |> List.filterMap identity |> List.sortBy .bTime
            pburns = if isFreeCell cell then Dict.get pos st.burned |> Maybe.withDefault [] else []
            pw = Dict.get pos st.powerups
        in Just { eCell = cell, eBombs = pbombs, ePlayers = pstsP, eBurned = pburns, ePowerup = pw }

createCell : Bool -> Int -> Pos -> Cell
createCell withBoxes n pos = if isWall n pos then Wall else if isStart n pos then Empty else if withBoxes then Box else Empty

isWall : Int -> Pos -> Bool
isWall n (l,c) = c == 0 || c == n-1 || (isEven l && isEven c)

isStart : Int -> Pos -> Bool
isStart n (l,c) = (l <= 2 && c <= 2) || (l >= n-3 && c <= 2) || (l <= 2 && c >= n-3) || (l >= n-3 && c >= n-3)

createLine : Bool -> Int -> Int -> Line
createLine withBoxes n l = if l == 0 || l == n-1 then (Array.repeat n Wall) else (initialize n (\c -> createCell withBoxes n (l,c)))

createBoard : Bool -> Int -> Board
createBoard withBoxes n = initialize n (createLine withBoxes n)

createMap : Bool -> Int -> Map
createMap withBoxes n = { board = createBoard withBoxes n, size = n }

isFreeCell : Cell -> Bool
isFreeCell c = case c of
    Empty -> True
    _ -> False

isFreePos : Pos -> Board -> Bool
isFreePos pos board = isFreeCell <| Maybe.withDefault Wall <| getCell pos board

errorLastMove : PlayerId -> State -> State
errorLastMove pid st =
    let p = getPlayer pid st.players in
    case getPlayerState p of
        Nothing -> st
        Just (pst,isDead) -> 
            let pstN = { pst | pLastMove = Just (MoveError,True) } in
            let pN = setPlayerState pstN p in
            { st | players = Array.set pid pN (st.players) }

cleanLastMove : PlayerId -> State -> State
cleanLastMove pid st =
    let p = getPlayer pid st.players in
    case getPlayerState p of
        Nothing -> st
        Just (pst,isDead) -> 
            let pstN = { pst | pLastMove = Nothing } in
            let pN = setPlayerState pstN p in
            { st | players = Array.set pid pN (st.players) }
            
getLastMove : PlayerId -> State -> Maybe (Move,Bool)
getLastMove pid st =
    let p = getPlayer pid st.players in
    case getPlayerState p of
        Nothing -> Nothing
        Just (pst,isDead) -> pst.pLastMove

getLastMoveSimple : PlayerId -> State -> Move
getLastMoveSimple pid st = case getLastMove pid st of
    Nothing -> MoveError
    Just (mv,_) -> mv

dropBomb : Maybe Int -> Maybe Int -> PlayerId -> State -> State
dropBomb maxtimer maxflames pid st =
    let p = getPlayer pid st.players in
    case getPlayerState p of
        Just (pst,False) ->
            let pos = pst.pPos in
            let bs = pst.pPlacedBombs in
            if Dict.size pst.pPlacedBombs >= pst.pBombs || Dict.member pos bs
                then
                    let pstN = { pst | pLastMove = Just (BotMove Bot.DropBomb,True) } in
                    let pN = setPlayerState pstN p in
                    { st | players = Array.set pid pN (st.players) }
                else
                    let radius = Maybe.withDefault pst.pFlames <| Maybe.map (min pst.pFlames) maxflames in
                    let bombN = { bPlayer = pid, bRadius = radius, bTime = Maybe.withDefault 10 maxtimer } in
                    let pstN = { pst | pPlacedBombs = Dict.insert pos bombN bs, pLastMove = Just (BotMove Bot.DropBomb,False) } in
                    let pN = setPlayerState pstN p in
                    { st | players = Array.set pid pN (st.players) }
        Just (pst,True) -> cleanLastMove pid st
        Nothing -> st

pickPowerup : Pos -> (PlayerState,Powerups) -> (PlayerState,Powerups)
pickPowerup pos (pst,pws) = case Dict.get pos pws of
    Nothing -> (pst,pws)
    Just pw ->
        let pstN = case pw of
                Bombs  -> { pst | pBombs = pst.pBombs + 1 }
                Flames -> { pst | pFlames = pst.pFlames + 1 }
        in (pstN,Dict.remove pos pws)

move : Bot.Move -> (Pos -> Pos) -> PlayerId -> State -> State
move mv f pid st =
    let p = getPlayer pid st.players in
    case getPlayerState p of
        Just (pst,False) -> 
            let pos = pst.pPos in
            let posN = f pos in
            if not (isFreePos posN st.map.board)
                then
                    let pstN = { pst | pLastMove = Just (BotMove mv,True) }
                        pN = setPlayerState pstN p
                    in { st | players = Array.set pid pN st.players }
                else
                    let pstN = { pst | pPos = posN, pLastMove = Just (BotMove mv,False) }
                        (pstNN,powerupsN) = pickPowerup posN (pstN,st.powerups)
                        pN = setPlayerState pstNN p
                    in { st | players = Array.set pid pN st.players, powerups = powerupsN }
        Just (pst,True) -> cleanLastMove pid st
        Nothing -> st

type GameState = Running | Draw | Win PlayerId

isAlive : Player -> Bool
isAlive p = case getPlayerState p of
    Nothing -> False
    Just (_,isDead) -> not isDead

alivePlayers : State -> List (PlayerId,Player)
alivePlayers st = List.filter (isAlive << second) <| Array.toIndexedList st.players

gameState : State -> GameState
gameState st =
    case alivePlayers st of
        [] -> Draw
        [(pid,p)] -> Win pid
        _ -> Running

moveBots : (State -> Bool) -> State -> State
moveBots checkEnd st =
    case st.seed of
        Nothing -> st
        Just seed ->
            let (seed1,mvs) = computeBotMoves seed st
            in makeMoves checkEnd mvs { st | seed = Just seed1 }

computeBotMove : Seed -> State -> PlayerId -> Player -> (PlayerId,(Seed,Move))
computeBotMove seed st i p = case p of
    PBot bot pst isDead -> if isDead then (i,(seed,BotMove Bot.Idle)) else (i,bot seed i st)
    _ -> (i,(seed,BotMove Bot.Idle))

computeBotMoves : Seed -> State -> (Seed,List (PlayerId,Move))
computeBotMoves seed st = List.foldl (goBotMove st) (seed,[]) <| Array.toIndexedList st.players

goBotMove : State -> (PlayerId,Player) -> (Seed,List (PlayerId,Move)) -> (Seed,List (PlayerId,Move))
goBotMove st (i,p) (seed0,xs0) = case computeBotMove seed0 st i p of
    (i1,(seed1,mv1)) -> (seed1,(i1,mv1) :: xs0)

advanceTime : (State -> Bool) -> State -> State
advanceTime checkEnd st = if checkEnd st then st else 
    advanceCaracol st |> tickBombs |> moveBots checkEnd |> tickState

checkGameEnd : State -> Bool
checkGameEnd st = case gameState st of
    Running -> False
    _ -> True

tickState : State -> State
tickState st = { st | clock = st.clock + 1 }

moveToFlame : Bot.Move -> Bool -> Int
moveToFlame mv isEdgeFlame = case mv of
    Bot.DropBomb -> 0
    Bot.MoveUp -> if isEdgeFlame then 3 else 1
    Bot.MoveDown -> if isEdgeFlame then 4 else 1
    Bot.MoveLeft -> if isEdgeFlame then 5 else 2
    Bot.MoveRight -> if isEdgeFlame then 6 else 2
    Bot.Idle -> 0

explodeLine : PlayerId -> Pos -> Int -> Board -> Bot.Move -> Burned -> Burned
explodeLine pid p i board dir burns = if i <= 0 then burns else
    let pN = applyDir dir p in
    case getCell pN board of
        Nothing -> burns
        Just cell -> let upd mb = Just ((pid,moveToFlame dir (i==1)) :: Maybe.withDefault [] mb) in
            if isFreeCell cell
                then Dict.update pN upd <| explodeLine pid pN (i-1) board dir burns
                else Dict.update pN upd burns

explodePos : PlayerId -> Pos -> Int -> Board -> Burned -> Burned
explodePos pid p i board burns =
    let ups    = explodeLine pid p i board Bot.MoveUp    in
    let downs  = explodeLine pid p i board Bot.MoveDown  in
    let lefts  = explodeLine pid p i board Bot.MoveLeft  in
    let rights = explodeLine pid p i board Bot.MoveRight in
    let upd mb = Just <| (pid,moveToFlame Bot.DropBomb False) :: Maybe.withDefault [] mb in
    ups <| downs <| lefts <| rights <| Dict.update p upd burns

burnState : Burned -> State -> State
burnState burns st =
    let mapN = { board = burnBoard burns st.map.board, size = st.map.size}
        playersN = Array.map (burnPlayer burns) st.players
        burnsE = Dict.filter (\pos _ -> getCell pos st.map.board == Just Empty) burns
        powerupsN = burnPowerups burnsE st.powerups
    in { st | map = mapN, players = playersN, powerups = powerupsN }

burnPowerups : Burned -> Powerups -> Powerups
burnPowerups burns d = Dict.diff d burns

burnBoard : Burned -> Board -> Board
burnBoard burns b = Dict.foldl burnPos b burns
burnPos : Pos -> BurnedPos -> Board -> Board
burnPos pos xs b = case getCell pos b of
    Just Box -> setCell pos Empty b
    _ -> b

burnPlayer : Burned -> Player -> Player
burnPlayer burns p =
    let kill : Pos -> Bool -> Bool
        kill pos b = b || Dict.member pos burns
        killBomb : Pos -> Bomb -> Bomb
        killBomb k b = if Dict.member k burns then { b | bTime = 0 } else b
        killSt : PlayerState -> PlayerState
        killSt pst = { pst | pPlacedBombs = Dict.map killBomb pst.pPlacedBombs }
    in case p of
        PNone -> PNone
        PHuman pst isDead -> PHuman (killSt pst) (kill pst.pPos isDead)
        PBot bot pst isDead -> PBot bot (killSt pst) (kill pst.pPos isDead)

tickBombs : State -> State
tickBombs st =
    let board = st.map.board in
    let (psN,burns) = List.unzip <| List.map (tickPlayerBombs board) <| Array.toIndexedList st.players in
    let burn = concatDicts (++) burns in
    burnState burn { st | players = Array.fromList psN, burned = burn }
tickPlayerBombs : Board -> (PlayerId,Player) -> (Player,Burned)
tickPlayerBombs board (pid,p) = case getPlayerState p of
    Nothing -> (p,Dict.empty)
    Just (pst,isDead) ->
        let (bsN,burned) = Dict.foldl (tickBomb board pid) (Dict.empty,Dict.empty) pst.pPlacedBombs in
        (setPlayerState { pst | pPlacedBombs = bsN } p,burned)
tickBomb : Board -> PlayerId -> Pos -> Bomb -> (Bombs,Burned) -> (Bombs,Burned)
tickBomb board pid pos b (d,burned) = if (b.bTime - 1) >= 0
    then (Dict.insert pos { b | bTime = b.bTime - 1 } d,burned)
    else (d,explodePos pid pos b.bRadius board burned)

applyDir : Bot.Move -> (Pos -> Pos)
applyDir dir = case dir of
    Bot.MoveUp -> moveUp
    Bot.MoveDown -> moveDown
    Bot.MoveLeft -> moveLeft
    Bot.MoveRight -> moveRight
    _ -> identity

moveUp = (\(l,c) -> (l-1,c))
moveDown = (\(l,c) -> (l+1,c))
moveLeft = (\(l,c) -> (l,c-1))
moveRight = (\(l,c) -> (l,c+1))

makeMove : (State -> Bool) -> Maybe Int -> Maybe Int -> (PlayerId,Move) -> State -> State
makeMove checkEnd maxtimer maxflames (pid,mv) st = if checkEnd st then st else
    case mv of
        BotMove Bot.DropBomb -> dropBomb maxtimer maxflames pid st
        BotMove bmv -> move bmv (applyDir bmv) pid st
        MoveError -> errorLastMove pid st

makeMoveMaybe : (State -> Bool) -> Maybe Int -> Maybe Int -> (PlayerId,Move) -> State -> Maybe (PlayerState,State)
makeMoveMaybe checkEnd maxtimer maxflames (pid,mv) st =
    let stN = makeMove checkEnd maxtimer maxflames (pid,mv) st
    in case Array.get pid stN.players of
        Nothing -> Nothing
        Just player -> case getPlayerState player of
            Nothing -> Nothing 
            Just (pstN,True) -> Nothing -- dead
            Just (pstN,False) -> case pstN.pLastMove of
                Just (_,False) -> Just (pstN,stN)
                _ -> Nothing

makeMoves : (State -> Bool) -> List (PlayerId,Move) -> State -> State
makeMoves checkEnd moves st = List.foldl (makeMove checkEnd Nothing Nothing) st moves

totalBlocks : Int -> Int
totalBlocks dim = ((dim-2))^2

closeParedes : Int -> List Pos
closeParedes dim = closeParedesAux (dim-3) (1,1) 'R'
closeParedesAux : Int -> Pos -> Char -> List Pos
closeParedesAux dim (l,c) dir = case (dim,dir) of
    (0,'R') -> [(l,c)]
    (1,'R') -> [(l,c)]
    (_,'R') -> (List.map (\cc -> (l,cc)) <| List.range c (c+dim-1)) ++ closeParedesAux dim (l,c+dim) 'D'
    (_,'D') -> (List.map (\ll -> (ll,c)) <| List.range l (l+dim-1)) ++ closeParedesAux dim (l+dim,c) 'L'
    (_,'L') -> List.reverse (List.map (\cc -> (l,cc)) <| List.range (c-dim+1) c) ++ closeParedesAux dim (l,c-dim) 'U'
    (_,'U') -> List.reverse (List.map (\ll -> (ll,c)) <| List.range (l-dim+1) l) ++ closeParedesAux (dim-2) (l-dim+1,c+1) 'R'
    _ -> []

makeCaracol : Int -> List (Maybe Pos)
makeCaracol dim =
    let closed = closeParedes dim 
        nclosed = totalBlocks dim
    in List.repeat (gameTicks-nclosed) Nothing ++ List.map Just (closeParedes dim)

--closeCaracol :: Mapa -> Int -> [Pos]
--closeCaracol mapa ticksToEnd = closeParedes dim n
--    where
--    n = closedBlocks (boardDim $ board mapa) ticksToEnd
--    dim = boardDim $ board mapa

killPlayer : Pos -> Player -> Player
killPlayer pos p = case p of
    PNone -> PNone
    PBot b pst isDead -> PBot b pst (isDead || pst.pPos == pos)
    PHuman pst isDead -> PHuman pst (isDead || pst.pPos == pos)

advanceCaracol : State -> State
advanceCaracol st =
    case st.caracol of
        [] -> st
        (Nothing::xs) -> { st | caracol = xs }
        (Just x::xs) ->
            let boardN = setCell x Wall st.map.board
                playersN = Array.map (killPlayer x) st.players
                powerupsN = Dict.remove x st.powerups
            in { st | caracol = xs, map = { board = boardN, size = st.map.size }, players = playersN, powerups = powerupsN }

mapsize = 11
gameTicks = 300

initState : List (Pos,Int) -> List Player -> State
initState pws players =
    let mapN = createMap True mapsize
        playersN = Array.fromList players
        caracolN = makeCaracol mapsize
        powers = Dict.map (\k i -> intToPowerup i) <| Dict.fromList pws
    in { seed = Nothing, map = mapN, players = playersN, burned = Dict.empty, powerups = powers, clock = 0, caracol = caracolN }

intToPowerup : Int -> Powerup
intToPowerup i = case i of
    0 -> Bombs
    _ -> Flames

moveToInt : Move -> Int
moveToInt m = case m of
    BotMove mv -> case mv of
        Bot.DropBomb -> 0
        Bot.MoveUp -> 1
        Bot.MoveDown -> 2
        Bot.MoveLeft -> 3
        Bot.MoveRight -> 4
        Bot.Idle -> 5
    MoveError -> 6

intToMove : Int -> Move
intToMove i = case i of
    0 -> BotMove Bot.DropBomb
    1 -> BotMove Bot.MoveUp
    2 -> BotMove Bot.MoveDown
    3 -> BotMove Bot.MoveLeft
    4 -> BotMove Bot.MoveRight
    5 -> BotMove Bot.Idle
    _ -> MoveError

boardBoxes : Board -> Int
boardBoxes = Array.foldl (\l i -> lineBoxes l + i) 0
lineBoxes : Line -> Int
lineBoxes = Array.foldl (\c i -> if c==Box then i+1 else i) 0

initMatchPlayers : Bot -> Bot -> MatchPlayer -> MatchPlayer -> List Player
initMatchPlayers bot1 bot2 p1 p2 =
    let xs = Array.fromList [PNone,PNone,PNone,PNone]
        ys = Array.set p1.mpId (PBot bot1 (newPlayerState mapsize p1.mpId { pName = p1.mpName, pAvatar = p1.mpAvatar }) False) xs
        zs = Array.set p2.mpId (PBot bot2 (newPlayerState mapsize p2.mpId { pName = p2.mpName, pAvatar = p2.mpAvatar }) False) ys
    in Array.toList zs

-- run a full match in-the-head
--match : Bot -> Bot -> MatchPlayer -> MatchPlayer -> Match
--match bot1 bot2 p1 p2 = 
--    let st = initState <| initMatchPlayers bot1 bot2 p1 p2
--        (mv1,mv2,res) = simulate p1.mpId p2.mpId st [] []
--    in { mP1 = p1, mP2 = p2, mWinner = res, mMoves1 = List.map moveToInt mv1, mMoves2 = List.map moveToInt mv2 }

simulate : PlayerId -> PlayerId -> State -> List Move -> List Move -> (List Move,List Move,Maybe Int)
simulate p1 p2 st mv1 mv2 = case gameState st of
    Running ->
        let stN = advanceTime checkGameEnd st
            mv1N = mv1 ++ [getLastMoveSimple p1 stN]
            mv2N = mv2 ++ [getLastMoveSimple p2 stN]
        in simulate p1 p2 stN mv1N mv2N
    Draw -> (mv1,mv2,Nothing)
    Win pid -> (mv1,mv2,Just pid)

initRandom : Random.Seed -> State -> State
initRandom seed st =
    let (seed1,st1) = addPowerups (seed,st) |> addAvatars
    in { st1 | seed = Just seed1 }

type alias DecodeBL a = List Int -> (a,List Int)

mapBL : (a -> b) -> DecodeBL a -> DecodeBL b
mapBL f dec = \xs -> let (a,ys) = dec xs in (f a,ys)

andThenBL : (a -> DecodeBL b) -> DecodeBL a -> DecodeBL b
andThenBL g f xs = let (a,ys) = f xs in g a ys

decodeL : Int -> DecodeBL a -> DecodeBL (List a)
decodeL i f xs = if (i <= 0)
    then ([],xs)
    else
        let (a,ys) = f xs in
        let (as_,zs) = decodeL (i-1) f ys in
        (a::as_,zs)

decodeA : Int -> DecodeBL a -> DecodeBL (Array a)
decodeA i f = mapBL Array.fromList (decodeL i f)

decodeInt : DecodeBL Int
decodeInt xs = case xs of
    [] -> (0,xs)
    (x::ys) -> (x,ys)
    
decodePos : DecodeBL Pos
decodePos xs =
    let (l,xs1) = decodeInt xs in
    let (c,xs2) = decodeInt xs1 in
    ((l,c),xs2)

stringToMoves : String -> (List Move,List Move)
stringToMoves s = first <| decodeMoves <| Utils.stringToByteList s

stringToBotState : String -> Bot.State
stringToBotState s = first <| decodeBotState <| Utils.stringToByteList s

botMoveToString : Bot.Move -> String
botMoveToString mv = case mv of
    Bot.MoveUp -> "MoveUp"
    Bot.MoveDown -> "MoveDown"
    Bot.MoveLeft -> "MoveLeft"
    Bot.MoveRight -> "MoveRight"
    Bot.DropBomb -> "DropBomb"
    Bot.Idle -> "Idle"

decodeMoves : DecodeBL (List Move,List Move)
decodeMoves xs = 
    let (l1,xs1) = decodeInt xs in
    let (mv1,xs2) = decodeL l1 decodeMove xs1 in
    let (l2,xs3) = decodeInt xs2 in
    let (mv2,xs4) = decodeL l2 decodeMove xs3 in
    ((mv1,mv2),xs4)

decodeMove : DecodeBL Move
decodeMove xs = 
    let (i,xs1) = decodeInt xs
    in (intToMove i,xs1)

decodeBotState : DecodeBL Bot.State
decodeBotState xs =
    let (time,xs1) = decodeInt xs in
    let (board,xs2) = decodeBotBoard xs1 in
    let (me,xs3) = decodeBotPlayer xs2 in
    let (op,xs4) = decodeBotPlayer xs3 in
    ({ time = time, board = board, me = me, opponent = op },xs4)

type alias BotBoard = Array (Array Bot.Cell)

decodeBotBoard : DecodeBL BotBoard
decodeBotBoard = decodeA 11 (decodeA 11 decodeBotCell)

decodeBotCell : DecodeBL Bot.Cell
decodeBotCell = mapBL intToBotCell decodeInt

intToBotCell : Int -> Bot.Cell 
intToBotCell i = case i of
    0 -> Bot.Wall
    1 -> Bot.Box
    2 -> Bot.Empty
    3 -> Bot.Bombs
    _ -> Bot.Flames

decodeBotPlayer : DecodeBL Bot.Player
decodeBotPlayer xs =
    let (pos,xs1) = decodePos xs in
    let (bombs,xs2) = decodeInt xs1 in
    let (flames,xs3) = decodeInt xs2 in
    let (ndropped,xs4) = decodeInt xs3 in
    let (dropped,xs5) = decodeL ndropped decodeBotBomb xs4 in
    ({ position = pos, bombs = bombs, flames = flames, dropped = dropped},xs5)

decodeBotBomb : DecodeBL Bot.Bomb
decodeBotBomb xs =
    let (pos,xs1) = decodePos xs in
    let (timer,xs2) = decodeInt xs1 in
    let (radius,xs3) = decodeInt xs2 in
    ({ pos = pos, timer = timer, radius = radius },xs3)

allMoves : List Bot.Move
allMoves = [Bot.MoveUp,Bot.MoveDown,Bot.MoveLeft,Bot.MoveRight]