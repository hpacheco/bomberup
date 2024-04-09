{-# LANGUAGE TupleSections #-}

module Game.State where
    
import System.IO
import System.Random as Random
import Data.List as List
import Data.Char as Char
import Data.Map as Map
import Data.Foldable
import Control.Monad
import DB
import Data.ByteString.Lazy
import Data.Binary as Binary
import Data.Binary.Put as Binary

type PlayerId = Int
type Pos = (Int,Int)
data Cell = Wall | Empty | Box deriving (Eq,Show)
type Line = [Cell]
type Board = [Line]
data PlayerState = PlayerState { pPos :: Pos, pBombs :: Int, pFlames :: Int, pPlacedBombs :: Bombs, pLastMove :: Maybe (Move,Bool) }
  deriving (Eq,Show)
data Player
    = PBot Bot PlayerState Bool
    | PNone
instance Show Player where
    show PNone = "PNone"
    show (PBot _ pst b) = "PBot <bot> " ++ show pst ++ " " ++ show b
data Bomb = Bomb { bPlayer :: PlayerId, bRadius :: Int, bTime :: Int } deriving (Eq,Show)
type Bombs = Map Pos Bomb
type Flame = Int
data Powerup = Bombs | Flames deriving (Show)
type Powerups = Map Pos Powerup
type BurnedPos = [(PlayerId,Flame)]
type Burned = Map Pos BurnedPos
data State = State { board :: Board, players :: [Player], powerups :: Powerups, burned :: Burned, clock :: Int, caracol ::  
[Maybe Pos] } deriving (Show)
type Bot = PlayerId -> State -> IO Move
type Seed = StdGen

data GameState = Running | Draw | Win PlayerId deriving (Eq,Show)
data Move = MoveUp | MoveDown | MoveLeft | MoveRight | DropBomb | Idle | MoveError deriving (Eq,Show,Read)

gameState :: State -> GameState
gameState st =
    case alivePlayers st of
        [] -> Draw
        [(pid,p)] -> Win pid
        _ -> Running

getPlayer :: Int -> [Player] -> Player
getPlayer i ps = ps !! i

getCell :: Pos -> Board -> Cell
getCell (l,c) b = (b !! l) !! c

setCell :: Pos -> Cell -> Board -> Board
setCell (l,c) x b = case b !! l of
    ys -> case ys !! c of
        y -> insertAt l (insertAt c x ys) b

getPlayerState :: Player -> Maybe (PlayerState,Bool)
getPlayerState p = case p of
    PBot _ st isDead -> Just (st,isDead)
    _ -> Nothing
    
setPlayerState :: PlayerState -> Player -> Player
setPlayerState pst p = case p of
    PNone -> PNone
    PBot b _ isDead -> PBot b pst isDead

getLastMove :: PlayerId -> State -> Maybe (Move,Bool)
getLastMove pid st =
    let p = getPlayer pid (players st) in
    case getPlayerState p of
        Nothing -> Nothing
        Just (pst,isDead) -> pLastMove pst

getLastMoveSimple :: PlayerId -> State -> Move
getLastMoveSimple pid st = case getLastMove pid st of
    Nothing -> Idle
    Just (mv,_) -> mv

initialize :: Int -> (Int -> a) -> [a]
initialize n f = List.map f [0..n-1]

insertAt :: Int -> a -> [a] -> [a]
insertAt 0 y [] = []
insertAt 0 y (x:xs) = (y:xs)
insertAt i y (x:xs) | i > 0 = x:insertAt (i-1) y xs

newPlayerState :: Int -> Int -> PlayerState
newPlayerState n i = PlayerState { pPos = newPlayerPos n i, pBombs = 1, pFlames = 1, pPlacedBombs = Map.empty, pLastMove = Nothing }

initMatchPlayers :: Bot -> Bot -> MatchPlayer -> MatchPlayer -> [Player]
initMatchPlayers bot1 bot2 p1 p2 = 
    let xs = [PNone,PNone,PNone,PNone] in
    let ys = insertAt (mpId p1) (PBot bot1 (newPlayerState mapsize $ mpId p1) False) xs in
    let zs = insertAt (mpId p2) (PBot bot2 (newPlayerState mapsize $ mpId p2) False) ys in
    zs

initRandom :: State -> IO State
initRandom st = do
    seed <- initStdGen
    let (seed1,st1) = addPowerups (seed,st)
--    let (_,st2) = addAvatars (seed1,st1)
    return $ st1

uniformRepeat :: Int -> (Seed -> (a,Seed)) -> Seed -> ([a],Seed)
uniformRepeat 0 f seed = ([],seed)
uniformRepeat i f seed | i > 0 =
    let (x,seed1) = f seed in
    let (xs,seed2) = uniformRepeat (i-1) f seed1 in
    (x:xs,seed2)

--addAvatars :: (Seed,State) -> (Seed,State)
--addAvatars (seed,st) =
--    let (avatars,_) = uniformRepeat 4 (uniformR (1,28)) seed
--        playersN = List.map (\(i,p) -> addAvatar (nth avatars !! i) p) $ zip [0..] (players st)
--    in (seed,st { players = playersN })
--
--addAvatar :: Int -> Player -> Player
--addAvatar a p = case p of
--    PNone -> PNone
--    PBot b pst dead -> PBot b (addAvatarState a pst) dead
--
--addAvatarState :: Int -> PlayerState -> PlayerState
--addAvatarState a pst =
--    let data_ = pData pst
--        dataN = data_ { pAvatar = a } 
--    in if (pAvatar data_) < 1 || (pAvatar data_) > 28 then pst { pData = dataN } else pst

addPowerups :: (Seed,State) -> (Seed,State)
addPowerups (seed,st) =
    let (seed1,pws) = genPowerup Flames 5 11 $ genPowerup Bombs 5 11 (seed,powerups st)
    in (seed1,st { powerups = pws })

genPowerup :: Powerup -> Int -> Int -> (Seed,Powerups) -> (Seed,Powerups)
genPowerup pw i sz (seed,pws) = if i <= 0 then (seed,pws) else
    let (pos,seedN) = uniformRs (generatePos 11) seed
        pwsN = Map.insert pos pw pws
    in genPowerup pw (i-1) sz (seedN,pwsN)

uniformRs :: RandomGen g => [a] -> g -> (a, g)
uniformRs xs g =
    let (i,g2) = uniformR (0,List.length xs - 1) g
    in (xs!!i,g2)

generatePos :: Int -> [Pos]
generatePos n = rangePos n (1,3) (n-2,n-2)

--generatePosPure :: Int -> Pos
--generatePosPure seed =
--    let xs = rangePos mapsize (1,3) (mapsize-2,mapsize-2) in
--    xs !! (mod seed (List.length xs))

generatePoses :: Seed -> Int -> [Pos]
generatePoses seed n = generatePosesAux n (seed,allPos)
    where
    allPos = rangePos mapsize (1,3) (mapsize-2,mapsize-2)
    generatePosesAux 0 acc = []
    generatePosesAux n (seed,xs) | n > 0 =
        let (i,seed') = Random.uniformR (0,List.length xs - 1) seed
            x = xs !! i
        in x : generatePosesAux (n-1) (seed',List.delete x xs)

posesToRand :: [Pos] -> [Int]
posesToRand [] = []
posesToRand ((x,y):ps) = x : y : posesToRand ps

rangePos :: Int -> Pos -> Pos -> [Pos]
rangePos n (l1,c1) (l2,c2) =
    let addPos :: Pos -> [Pos] -> [Pos]
        addPos p ps = if isStart n p || isWall n p then ps else p : ps in
    case (compare l1 l2,compare c1 c2) of
        (LT,LT) -> addPos (l1,c1) $ rangePos n (l1,c1+1) (l2,c2)
        (LT,EQ) -> addPos (l1,c1) $ rangePos n (l1+1,0) (l2,c2)
        (EQ,LT) -> addPos (l1,c1) $ rangePos n (l1,c1+1) (l2,c2)
        (EQ,EQ) -> addPos (l1,c1) []
        _ -> []

advanceTime :: State -> IO State
advanceTime st = case gameState st of
    Running -> liftM tickState $ moveBots $ tickBombs $ advanceCaracol st
    _ -> return st

makeMoves :: [(PlayerId,Move)] -> State -> State
makeMoves moves st = List.foldl (makeMove Nothing Nothing) st moves

makeMove :: Maybe Int -> Maybe Int -> State -> (PlayerId,Move) -> State
makeMove maxtimer maxflames st (pid,mv) =  case gameState st of
    Running -> case mv of
        DropBomb -> dropBomb maxtimer maxflames pid st
        _ -> move mv (applyDir mv) pid st
    _ -> st

makeMoveMaybe :: Maybe Int -> Maybe Int -> (PlayerId,Move) -> State -> Maybe (PlayerState,State)
makeMoveMaybe maxtimer maxflames (pid,mv) st =
    let stN = makeMove maxtimer maxflames st (pid,mv)
    in case (players stN) !! pid of
        player -> case getPlayerState player of
            Nothing -> Nothing 
            Just (pstN,True) -> Nothing -- dead
            Just (pstN,False) -> case pLastMove pstN of
                Just (_,False) -> Just (pstN,stN)
                _ -> Nothing

moveBots :: State -> IO State
moveBots st = do
     mvs <- computeBotMoves st
     return $ makeMoves mvs st

computeBotMove :: State -> PlayerId -> Player -> IO (PlayerId,Move)
computeBotMove st i p = case p of
    PBot bot pst isDead -> if isDead
        then return (i,Idle)
        else bot i st >>= return . (i,)
    _ -> return (i,Idle)

computeBotMoves :: State -> IO [(PlayerId,Move)]
computeBotMoves st = foldlM (goBotMove st) [] $ List.zip [0..] (players st)

goBotMove :: State -> [(PlayerId,Move)] -> (PlayerId,Player) -> IO [(PlayerId,Move)]
goBotMove st xs0 (i,p) = do
    mv <- computeBotMove st i p
    case mv of
        (i1,mv1) -> return $ (i1,mv1) : xs0

tickState :: State -> State
tickState st = st { clock = clock st + 1 }

-- run a full match in-the-head
match :: Bool -> Bot -> Bot -> MatchPlayer -> MatchPlayer -> IO Match
match isChamp bot1 bot2 p1 p2 = do
--    putStrLn $ "entering match " ++ show p1 ++ " " ++ show p2
--    hFlush stdout
    let ps = initMatchPlayers bot1 bot2 p1 p2
--    putStrLn $ "players " ++ show ps
--    hFlush stdout
    let st = initState ps
--    putStrLn $ "state " ++ show st
--    hFlush stdout
    stN <- initRandom st
    let pws = Map.toList $ Map.map powerupToInt $ powerups stN
--    putStrLn $ "simulating match " ++ show stN
--    hFlush stdout
    (mv1,mv2,res) <- simulate (mpId p1) (mpId p2) stN [] []
--    putStrLn $ "moves " ++ show (List.length mv1,mv1) ++ " " ++ show (List.length mv2,mv2)
    time <- getPOSIXMillis
    let minfo = MatchInfo { mP1 = p1, mP2 = p2, mWinner = res, mTime = time, mChampionship = isChamp }
    let mdata = MatchData pws (List.map moveToInt mv1) (List.map moveToInt mv2)
    return $ Match minfo mdata

simulate :: PlayerId -> PlayerId -> State -> [Move] -> [Move] -> IO ([Move],[Move],Maybe Int)
simulate p1 p2 st mv1 mv2 = case gameState st of
    Running -> do
--        putStrLn $ "game clock: " ++ show (clock st)
        stN <- advanceTime st
        let mv1N = mv1 ++ [getLastMoveSimple p1 stN]
        let mv2N = mv2 ++ [getLastMoveSimple p2 stN]
        --putStrLn $ "moves " ++ show mv1N ++ " " ++ show mv2N
        simulate p1 p2 stN mv1N mv2N
    Draw -> do
--        putStrLn "game draw"
        return (mv1,mv2,Nothing)
    Win pid -> do
--        putStrLn "game win"
        return (mv1,mv2,Just pid)

moveToInt :: Move -> Int
moveToInt m = case m of
    DropBomb -> 0
    MoveUp -> 1
    MoveDown -> 2
    MoveLeft -> 3
    MoveRight -> 4
    Idle -> 5
    _ -> 6

intToMove :: Int -> Move
intToMove i = case i of
    0 -> DropBomb
    1 -> MoveUp
    2 -> MoveDown
    3 -> MoveLeft
    4 -> MoveRight
    5 -> Idle
    _ -> MoveError
    
mapsize = 11
gameTicks = 300

initState :: [Player] -> State
initState playersN =
    let mapN = createBoard mapsize
        caracolN = makeCaracol mapsize
    in State { board = mapN, players = playersN, burned = Map.empty, powerups = Map.empty, clock = 0, caracol = caracolN }

createCell :: Int -> Pos -> Cell
createCell n pos = if isWall n pos then Wall else if isStart n pos then Empty else Box

isWall :: Int -> Pos -> Bool
isWall n (l,c) = c == 0 || c == n-1 || (even l && even c)

isStart :: Int -> Pos -> Bool
isStart n (l,c) = (l <= 2 && c <= 2) || (l >= n-3 && c <= 2) || (l <= 2 && c >= n-3) || (l >= n-3 && c >= n-3)

createLine :: Int -> Int -> Line
createLine n l = if l == 0 || l == n-1 then (List.replicate n Wall) else (initialize n (\c -> createCell n (l,c)))

createBoard :: Int -> Board
createBoard n = initialize n (createLine n)

totalBlocks :: Int -> Int
totalBlocks dim = ((dim-2))^2

range i j | i <= j = [i..j]

closeParedes :: Int -> [Pos]
closeParedes dim = closeParedesAux (dim-3) (1,1) 'R'
closeParedesAux :: Int -> Pos -> Char -> [Pos]
closeParedesAux dim (l,c) dir = case (dim,dir) of
    (0,'R') -> [(l,c)]
    (1,'R') -> [(l,c)]
    (_,'R') -> (List.map (\cc -> (l,cc)) $ range c (c+dim-1)) ++ closeParedesAux dim (l,c+dim) 'D'
    (_,'D') -> (List.map (\ll -> (ll,c)) $ range l (l+dim-1)) ++ closeParedesAux dim (l+dim,c) 'L'
    (_,'L') -> List.reverse (List.map (\cc -> (l,cc)) $ range (c-dim+1) c) ++ closeParedesAux dim (l,c-dim) 'U'
    (_,'U') -> List.reverse (List.map (\ll -> (ll,c)) $ range (l-dim+1) l) ++ closeParedesAux (dim-2) (l-dim+1,c+1) 'R'
    _ -> []

makeCaracol :: Int -> [Maybe Pos]
makeCaracol dim =
    let closed = closeParedes dim 
        nclosed = totalBlocks dim
    in List.replicate (gameTicks-nclosed) Nothing ++ List.map Just (closeParedes dim)

moveToFlame :: Move -> Bool -> Int
moveToFlame mv isEdgeFlame = case mv of
    DropBomb -> 0
    MoveUp -> if isEdgeFlame then 3 else 1
    MoveDown -> if isEdgeFlame then 4 else 1
    MoveLeft -> if isEdgeFlame then 5 else 2
    MoveRight -> if isEdgeFlame then 6 else 2
    Idle -> 0

explodeLine :: PlayerId -> Pos -> Int -> Board -> Move -> Burned -> Burned
explodeLine pid p i board dir burns = if i <= 0 then burns else
    let pN = applyDir dir p in
    case getCell pN board of
        cell -> let upd mb = Just ((pid,moveToFlame dir (i==1)) : maybe [] id mb) in
            if isFreeCell cell
                then Map.alter upd pN $ explodeLine pid pN (i-1) board dir burns
                else Map.alter upd pN burns

explodePos :: PlayerId -> Pos -> Int -> Board -> Burned -> Burned
explodePos pid p i board burns =
    let ups    = explodeLine pid p i board MoveUp    in
    let downs  = explodeLine pid p i board MoveDown  in
    let lefts  = explodeLine pid p i board MoveLeft  in
    let rights = explodeLine pid p i board MoveRight in
    let upd mb = Just $ (pid,moveToFlame DropBomb False) : maybe [] id mb in
    ups $ downs $ lefts $ rights $ Map.alter upd p burns

burnState :: Burned -> State -> State
burnState burns st =
    let mapN :: Board
        mapN = burnBoard burns (board st)
        playersN :: [Player]
        playersN = List.map (burnPlayer burns) (players st)
        burnsE :: Burned
        burnsE = Map.filterWithKey (\pos _ -> getCell pos (board st) == Empty) burns
        powerupsN :: Powerups
        powerupsN = burnPowerups burnsE (powerups st)
    in st { board = mapN, players = playersN, powerups = powerupsN }

burnPowerups :: Burned -> Powerups -> Powerups
burnPowerups burns d = Map.difference d burns

burnBoard :: Burned -> Board -> Board
burnBoard burns b = Map.foldlWithKey burnPos b burns
burnPos :: Board -> Pos -> BurnedPos -> Board
burnPos b pos xs = case getCell pos b of
    Box -> setCell pos Empty b
    _ -> b

burnPlayer :: Burned -> Player -> Player
burnPlayer burns p =
    let kill :: Pos -> Bool -> Bool
        kill pos b = b || Map.member pos burns
        killBomb :: Pos -> Bomb -> Bomb
        killBomb k b = if Map.member k burns then b { bTime = 0 } else b
        killSt :: PlayerState -> PlayerState
        killSt pst = pst { pPlacedBombs = Map.mapWithKey killBomb (pPlacedBombs pst) }
    in case p of
        PNone -> PNone
        PBot bot pst isDead -> PBot bot (killSt pst) (kill (pPos pst) isDead)

tickBombs :: State -> State
tickBombs st =
    let (psN,burns) = List.unzip $ List.map (tickPlayerBombs $ board st) $ List.zip [0..] (players st) in
    let burn = concatMaps (++) burns in
    burnState burn $ st { players = psN, burned = burn }
tickPlayerBombs :: Board -> (PlayerId,Player) -> (Player,Burned)
tickPlayerBombs board (pid,p) = case getPlayerState p of
    Nothing -> (p,Map.empty)
    Just (pst,isDead) ->
        let (bsN,burned) = Map.foldlWithKey (tickBomb board pid) (Map.empty,Map.empty) (pPlacedBombs pst) in
        (setPlayerState (pst { pPlacedBombs = bsN }) p,burned)
tickBomb :: Board -> PlayerId -> (Bombs,Burned) -> Pos -> Bomb -> (Bombs,Burned)
tickBomb board pid (d,burned) pos b = if (bTime b - 1) >= 0
    then (Map.insert pos (b { bTime = bTime b - 1 }) d,burned)
    else (d,explodePos pid pos (bRadius b) board burned)

applyDir :: Move -> (Pos -> Pos)
applyDir dir = case dir of
    MoveUp -> moveUp
    MoveDown -> moveDown
    MoveLeft -> moveLeft
    MoveRight -> moveRight
    _ -> id

moveUp = (\(l,c) -> (l-1,c))
moveDown = (\(l,c) -> (l+1,c))
moveLeft = (\(l,c) -> (l,c-1))
moveRight = (\(l,c) -> (l,c+1))

concatMaps :: Ord comparable => (v -> v -> v) -> [(Map comparable v)] -> Map comparable v
concatMaps merge xs = List.foldl (Map.unionWith merge) Map.empty xs

isFreeCell :: Cell -> Bool
isFreeCell c = case c of
    Empty -> True
    _ -> False

isFreePos :: Pos -> Board -> Bool
isFreePos pos board = isFreeCell $ getCell pos board

move :: Move -> (Pos -> Pos) -> PlayerId -> State -> State
move mv f pid st =
    let p = getPlayer pid (players st) in
    case getPlayerState p of
        Just (pst,False) -> 
            let pos = pPos pst in
            let posN = f pos in
            if not (isFreePos posN $ board st)
                then
                    let pstN = pst { pLastMove = Just (mv,True) }
                        pN = setPlayerState pstN p
                    in st { players = insertAt pid pN (players st) }
                else
                    let pstN = pst { pPos = posN, pLastMove = Just (mv,False) }
                        (pstNN,powerupsN) = pickPowerup posN (pstN,powerups st)
                        pN = setPlayerState pstNN p
                    in st { players = insertAt pid pN (players st), powerups = powerupsN }
        Just (pst,True) -> cleanLastMove pid st
        Nothing -> st

cleanLastMove :: PlayerId -> State -> State
cleanLastMove pid st =
    let p = getPlayer pid (players st) in
    case getPlayerState p of
        Nothing -> st
        Just (pst,isDead) -> 
            let pstN = pst { pLastMove = Nothing } in
            let pN = setPlayerState pstN p in
            st { players = insertAt pid pN (players st) }

pickPowerup :: Pos -> (PlayerState,Powerups) -> (PlayerState,Powerups)
pickPowerup pos (pst,pws) = case Map.lookup pos pws of
    Nothing -> (pst,pws)
    Just pw ->
        let pstN = case pw of
                Bombs  -> pst { pBombs = pBombs pst + 1 }
                Flames -> pst { pFlames = pFlames pst + 1 }
        in (pstN,Map.delete pos pws)

dropBomb :: Maybe Int -> Maybe Int -> PlayerId -> State -> State
dropBomb maxtimer maxflames pid st =
    let p = getPlayer pid (players st) in
    case getPlayerState p of
        Just (pst,False) ->
            let pos = pPos pst in
            let bs = pPlacedBombs pst in
            if Map.size (pPlacedBombs pst) >= (pBombs pst) || Map.member pos bs
                then
                    let pstN = pst { pLastMove = Just (DropBomb,True) } in
                    let pN = setPlayerState pstN p in
                    st { players = insertAt pid pN (players st) }
                else
                    let radius = maybe (pFlames pst) id $ fmap (min $ pFlames pst) maxflames in
                    let bombN = Bomb { bPlayer = pid, bRadius = radius, bTime = maybe 10 id maxtimer } in
                    let pstN = pst { pPlacedBombs = Map.insert pos bombN bs, pLastMove = Just (DropBomb,False) } in
                    let pN = setPlayerState pstN p in
                    st { players = insertAt pid pN (players st) }
        Just (pst,True) -> cleanLastMove pid st
        Nothing -> st

killPlayer :: Pos -> Player -> Player
killPlayer pos p = case p of
    PNone -> PNone
    PBot b pst isDead -> PBot b pst (isDead || pPos pst == pos)

advanceCaracol :: State -> State
advanceCaracol st =
    case caracol st of
        [] -> st
        (Nothing:xs) -> st { caracol = xs }
        (Just x:xs) ->
            let boardN = setCell x Wall (board st)
                playersN = List.map (killPlayer x) (players st)
                powerupsN = Map.delete x (powerups st)
            in st { caracol = xs, board = boardN, players = playersN, powerups = powerupsN }

newPlayerPos :: Int -> Int -> Pos
newPlayerPos n i = case i of
    0 -> (1,1)
    1 -> (1,n-2)
    2 -> (n-2,1)
    3 -> (n-2,n-2)
    _ -> (0,0)

isAlive :: Player -> Bool
isAlive p = case getPlayerState p of
    Nothing -> False
    Just (_,isDead) -> not isDead

alivePlayers :: State -> [(PlayerId,Player)]
alivePlayers st = List.filter (isAlive . snd) $ List.zip [0..] $ players st

boardBoxes :: Board -> Int
boardBoxes = List.foldl (\i l -> lineBoxes l + i) 0
lineBoxes :: Line -> Int
lineBoxes = List.foldl (\i c -> if c==Box then i+1 else i) 0

--------- BOTS 

cap :: String -> String
cap [] = []
cap (x:xs) = toUpper x : xs

botName :: String -> String
botName n | List.isPrefixOf "bot:" n = "Bot (" ++ cap (List.drop 4 n) ++ ")"
          | List.isPrefixOf "champion:" n = "Champion (" ++ cap (List.drop 9 n) ++ ")"
          | otherwise = n

data BotState = BotState { botTime :: Int, botBoard :: BotBoard, botMe :: BotPlayer, botOpponent :: BotPlayer }
type BotBoard = [[BotCell]]
data BotCell = BotWall | BotBox | BotEmpty | BotBombs | BotFlames
data BotBomb = BotBomb { botPos :: Pos, botTimer :: Int, botRadius :: Int }
type BotBombs = [BotBomb]
data BotPlayer = BotPlayer { botPosition :: Pos, botBombs :: Int, botFlames :: Int, botDropped :: BotBombs }

toBotState :: PlayerId -> State -> BotState
toBotState pid st =
    let pws = powerups st
        boardN = List.map (\(l,xs) -> List.map (\(c,cell) -> toBotCell pws (l,c) cell) $ List.zip [0..] xs) $ List.zip [0..] (board st)
        me = toBotPlayer pid $ (players st) !! pid
        oid = List.head $ filterMap (\(i,p) -> if i/=pid && isBot p then Just i else Nothing) $ List.zip [0..] (players st)
        op = toBotPlayer oid $ (players st) !! oid
    in BotState { botTime = clock st, botBoard = boardN, botMe = me, botOpponent = op }

filterMap :: (a -> Maybe b) -> [a] -> [b]
filterMap f [] = []
filterMap f (x:xs) = case f x of
    Nothing -> filterMap f xs
    Just y -> y : filterMap f xs

isBotName :: String -> Bool
isBotName "bot:easy" = True
isBotName "bot:medium" = True
isBotName "bot:hard" = True
isBotName _ = False

isBot :: Player -> Bool
isBot p = case p of
    PBot _ _ _ -> True
    _ -> False

toBotPlayer :: PlayerId -> Player -> BotPlayer
toBotPlayer pid p = case p of
    PNone -> noBotPlayer
    PBot _ pst _ -> toBotPlayerState pid pst

toBotPlayerState :: PlayerId -> PlayerState -> BotPlayer
toBotPlayerState i p = BotPlayer { botPosition = pPos p, botBombs = pBombs p, botFlames = pFlames p, botDropped = List.map toBotBomb $ Map.toList (pPlacedBombs p) }

noBotPlayer :: BotPlayer
noBotPlayer = BotPlayer { botPosition = (0,0), botBombs = 0, botFlames =0, botDropped = [] }

toBotBomb :: (Pos,Bomb) -> BotBomb
toBotBomb (p,b) = BotBomb { botPos = p, botTimer = bTime b, botRadius = bRadius b }

toBotCell :: Powerups -> Pos -> Cell -> BotCell
toBotCell pws pos cell = case cell of
    Wall -> BotWall
    Box -> BotBox
    Empty -> case Map.lookup pos pws of
        Nothing -> BotEmpty
        Just Bombs -> BotBombs
        Just Flames -> BotFlames

botCellToInt :: BotCell -> Int
botCellToInt BotWall = 0
botCellToInt BotBox = 1
botCellToInt BotEmpty = 2
botCellToInt BotBombs = 3
botCellToInt BotFlames = 4

putPos :: Pos -> Put
putPos (l,c) = do
    put (toEnum l::Word8)
    put (toEnum c::Word8)
    
putL :: (a -> Put) -> [a] -> Put
putL f [] = return ()
putL f (x:xs) = f x >> putL f xs

putBoard :: BotBoard -> Put
putBoard = putL (putL put)

putInt :: Int -> Put
putInt i = put (toEnum i :: Word8)

instance Binary BotState where
    put (BotState time board me op) = do
        putInt time
        putBoard board
        put me
        put op
    get = undefined
instance Binary BotCell where
    put c = put (toEnum (botCellToInt c):: Word8)
    get = undefined
instance Binary BotPlayer where
    put (BotPlayer pos bombs flames dropped) = do
        putPos pos
        putInt bombs
        putInt flames
        putInt (List.length dropped)
        putL put dropped 
    get = undefined
instance Binary BotBomb where
    put (BotBomb pos timer radius) = do
        putPos pos
        putInt timer 
        putInt radius 
    get = undefined
        
putMove :: Move -> Put
putMove mv = putInt (moveToInt mv)
        
encodeMatchData :: [Move] -> [Move] -> ByteString
encodeMatchData mv1 mv2 = Binary.runPut $ do
    putInt (List.length mv1)
    putL putMove mv1
    putInt (List.length mv2)
    putL putMove mv2

powerupToInt :: Powerup -> Int
powerupToInt Bombs = 0
powerupToInt Flames = 1

allMoves :: [Move]
allMoves = [MoveUp,MoveDown,MoveLeft,MoveRight]