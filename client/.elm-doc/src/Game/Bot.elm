module Game.Bot exposing (Time,State,Position,above,below,leftwards,rightwards,line,column,Line,Column,Cell(..),Bomb,Player,Move(..),readCell,numBombs,readBomb,iterateBombs,hasBomb,Bot,idleBot,randomBot,isFreePos,moveTowards,iterateBoard,iterate,euclidianDistance,findPowerups,closestTo)

{-| A library for programming your own bomber bot.

Some basic rules: 

  - There are two players on a 11x11 board.
  - Each player drop bombs on the board.
  - Each player can initially drop one bomb that explodes one cell to the side.
  - Players can pick up powerups to increase how many bombs they can drop and how far they explode.

@docs State
@docs Time
@docs Position
@docs line
@docs column
@docs above
@docs below
@docs leftwards
@docs rightwards
@docs Line
@docs Column
@docs Cell
@docs Bomb
@docs Player
@docs Move
@docs readCell
@docs readBomb
@docs numBombs
@docs iterateBombs
@docs hasBomb
@docs Bot
@docs idleBot
@docs randomBot
@docs isFreePos
@docs moveTowards
@docs iterateBoard
@docs iterate
@docs euclidianDistance
@docs findPowerups
@docs closestTo
-}

import Array exposing (..)
import List exposing (..)
import Maybe exposing (..)
import Tuple exposing (..)

{-| The state of the game over which your bot can make a decision.

  - [`Time`](#Time) - How much time has ellapsed since the beginning of the game?
  - [`Board`](#Board) - What is the content of each [`Cell`](#Cell) on the board?
  - [`Player`](#Player) - Where are you or your opponent?

-}
type alias State = { time : Time, board : Board, me : Player, opponent : Player }

{-| The game's time starts at 0 and ends at 300 or when no more than one player remains alive.
-}
type alias Time = Int

{-| A board is a 11x11 matrix, with each [`Position](#Position) holding a [`Cell`](#Cell).
-}
type alias Board = Array (Array Cell)

{-| A position is a (l,c) pair including where l is a line and c a column.
    As usual in programming languages, position identifiers start at 0.
 -}
type alias Position = (Line,Column)

{-| A position's line. -}
line : Position -> Line
line (l,c) = l

{-| A position's column. -}
column : Position -> Line
column (l,c) = c

{-| The position above a position. -}
above : Position -> Position
above (l,c) = (l-1,c)

{-| The position below a position. -}
below : Position -> Position
below (l,c) = (l+1,c)

{-| The position to the left of a position. -}
leftwards : Position -> Position
leftwards (l,c) = (l,c-1)

{-| The position to the right of a position. -}
rightwards : Position -> Position
rightwards (l,c) = (l,c+1)

{-| A line identifier from 0 to 10.

  - 0 is the line at the top of the screen.
  - 11 is the line at the bottom of the screen.

-}
type alias Line = Int

{-| A column identifier from 0 to 10.

  - 0 is the column at the left of the screen.
  - 11 is the line at the right of the screen.

-}
type alias Column = Int

{-| Each cell on the board can be:

  - A solid wall, which is indestructible;
  - A box, which can be destroyed by bombs;
  - An empty space over which players can walk;
  - A bomb placed by a player;
  - A power-up, which can be picked up by players.

-}
type Cell = Wall | Box | Empty | Bombs | Flames

{-| Get the [`Cell`](#Cell) at a given [`Position`](#Position) in the [`State`](#State). -}
readCell : Position -> State -> Cell
readCell (l,c) st = Maybe.withDefault Wall <| Array.get c (Array.get l st.board |> Maybe.withDefault Array.empty)

{-| A bomb placed by a player on the board, including:
  - pos: In which position is it located?
  - timer: How much time left until it explodes?
  - radius: How many cells will the explosion burn?
-}
type alias Bomb = { pos : Position, timer : Int, radius : Int }

type alias Bombs = List Bomb

{-| How many bombs are currently dropped by a player. -}
numBombs : Bombs -> Int
numBombs bs = List.length bs

{-| Get the information about a specific dropped bomb. -}
readBomb : Int -> Bombs -> Bomb
readBomb i xs = case (i,xs) of
    (0,b::bs) -> b
    (j,b::bs) -> readBomb (j-1) bs
    _ -> Bomb (0,0) 0 0
    
{-| Iterates over a player's bombs. -}
iterateBombs : Bombs -> val -> (val -> Bomb -> val) -> val
iterateBombs xs x0 f = List.foldl (\b x -> f x b) x0 xs

{-| Check if a position on the board currently has one or more dropped bombs. -}
hasBomb : Position -> State -> Bool
hasBomb p st =
    let check = List.foldl (\b f -> f || b.pos == p) False in
    check st.me.dropped || check st.opponent.dropped

{-| A player is either you or your opponent, including:

  - position: Which [`Position`](#Position) is the player at?
  - bombs: How many bombs can the player drop?
  - flames: What is the radius of the bombs dropped by the player? 
  - dropped: Which bombs has the player dropped on the board?

-}
type alias Player = { position : Position, bombs : Int, flames : Int, dropped : Bombs }

{-| One of the possible bot actions (moving to a direction, dropping a bomb, or staying idle). -}
type Move = MoveUp | MoveDown | MoveLeft | MoveRight | DropBomb | Idle

{-| The type of a bot, which reads the current state and decides on a move. -}
type alias Bot = State -> Move

{-| A bot that never moves. -}
idleBot : State -> Move
idleBot state = Idle

hashCell : Cell -> Int
hashCell c = case c of
    Wall   -> 0
    Box    -> 1
    Empty  -> 2 
    Bombs  -> 3
    Flames -> 4
    
hashBoard : Board -> Int
hashBoard b = Array.foldl (\xs i -> Array.foldl (\c j -> hashCell c+j) i xs) 0 b

hashPlayer : Player -> Int
hashPlayer p = first p.position + second p.position + p.bombs + p.flames + List.length p.dropped

hashState : State -> Int
hashState st = st.time + hashBoard st.board + hashPlayer st.me + hashPlayer st.opponent

{-| A bot that moves randomly. -}
randomBot : State -> Move
randomBot state = case modBy 6 (hashState state) of
    0 -> MoveUp
    1 -> MoveDown
    2 -> MoveLeft
    3 -> MoveRight
    4 -> DropBomb
    _ -> Idle

{-| Checks if a position is free, i.e., is not a wall nor a bomb. -}
isFreePos : Position -> State -> Bool
isFreePos pos state = readCell pos state /= Wall && not (hasBomb pos state)

distance : Position -> Position -> Float
distance (x1,y1) (x2,y2) =
    let dist a b = toFloat (abs (a-b)) in
    sqrt ((dist x1 x2)^2 + (dist y1 y2)^2)

{-| Moves the bot towards a position. -}
moveTowards : Position -> State -> Move
moveTowards target state =
    let pos = state.me.position
        distanceFrom neighbor = if readCell neighbor state == Wall then 100 else distance neighbor target in
    case sortBy first [(distanceFrom (above pos),MoveUp),(distanceFrom (below pos),MoveDown),(distanceFrom (leftwards pos),MoveLeft),(distanceFrom (rightwards pos),MoveRight)] of
        (x::xs) -> second x
        [] -> Idle

{-| Iterates over all the cells in the board. -}
iterateBoard : Board -> val -> (val -> Position -> Cell -> val) -> val
iterateBoard board x0 go = List.foldl (\(l,ys) x -> iterateLine ys x (\y c -> go y (l,c))) x0 (Array.toIndexedList board)

iterateLine : Array Cell -> a -> (a -> Column -> Cell -> a) -> a
iterateLine ls x0 go = List.foldl (\(c,cell) x -> go x c cell) x0 (Array.toIndexedList ls)

{-| Iterates over a list. -}
iterate : List a -> val -> (val -> a -> val) -> val
iterate xs x0 f = List.foldl (\a v -> f v a) x0 xs
    
{-| The arithmetic distance between two positions. -}
euclidianDistance : Position -> Position -> Float
euclidianDistance (x1,y1) (x2,y2) =
    let dist a b = toFloat (abs (a-b)) in
    sqrt ((dist x1 x2)^2 + (dist y1 y2)^2)

{-| Finds all powerups in the board. -}
findPowerups : State -> List Position
findPowerups state =
    iterateBoard state.board [] (\prev pos cell -> case cell of
        Flames -> pos :: prev
        Bombs -> pos :: prev
        _ -> prev)

{-| Determines which one, from a list of positions, is the closest to a given position. -}
closestTo : Position -> List Position -> Maybe (Float,Position)
closestTo to ps =
    let min2 (d1,p1) (d2,p2) = if d1 <= d2 then (d1,p1) else (d2,p2) in
    iterate ps Nothing (\prev pos ->
        let now = (euclidianDistance to pos,pos) in
        case prev of
            Nothing -> Just now
            Just val -> Just (min2 val now))
