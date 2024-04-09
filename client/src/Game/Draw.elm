module Game.Draw exposing (..)

import Array exposing (..)
import Game.State exposing (..)
import Game.Playground as Playground exposing (..)
import Game.Window as Window exposing (..)
import Utils exposing (..)
import List exposing (..)
import Dict exposing (..)
import String exposing (..)
import Game.Bot as Bot

textColor : Color
textColor = black

floorColor : Color
floorColor = Hex "#A47551"

backgroundColor : Color
backgroundColor = black

foregroundColor : Color
foregroundColor = Hex "#808080"

playerColor : PlayerId -> Color
playerColor i = case i of
    0 -> Hex "#A91111"
    1 -> Hex "#173aaf"
    2 -> Hex "#137515"
    3 -> Hex "#e0b83e"
    _ -> black

playerFolder : PlayerId -> String
playerFolder i = case i of
    0 -> "red"
    1 -> "blue"
    2 -> "green"
    3 -> "yellow"
    _ -> ""

drawCell : Cell -> Maybe Powerup -> Window
drawCell c p = case (c,p) of
    (Empty,Just pw) -> drawPowerup pw
    (Wall,_) -> Window.rectangle darkCharcoal
    (Box,_) -> Window.image "../graphics/box.gif"
    _ -> Window.rectangle floorColor

drawBomb : Bomb -> Window
drawBomb b =
    let path = "../graphics/" ++ playerFolder b.bPlayer ++ "/bomb.gif" in
    let sprite = Window.zoom (\w->w*0.9) (\h->h*0.9) AlignCenter <| Window.image path in
    let timer = Window.wordsWith white (String.fromInt b.bTime) AlignCenter "000" in
    Window.group [sprite,timer]

drawPlayer : (PlayerId,PlayerState) -> Window
drawPlayer (pid,p) =
    let back = Window.zoom (\w->w*0.7) (\h->h*0.2) AlignBottom <| Window.oval (playerColor pid) in
    Window.group[back,Window.zoom identity (\h->h*0.9) AlignTop <| Window.image ("../graphics/players/p" ++ String.fromInt p.pData.pAvatar ++ ".gif")]

drawFlame : (PlayerId,Flame) -> Window
drawFlame (pid,fid) =
    let path = "../graphics/" ++ playerFolder pid ++ "/e" ++ String.fromInt fid ++ ".gif" in
    Window.image path

drawPowerup : Powerup -> Window
drawPowerup p = case p of
    Bombs  -> Window.image "../graphics/bombs.gif"
    Flames -> Window.image "../graphics/flames.gif"

drawExtCell : Int -> Int -> Maybe ExtCell -> Window
drawExtCell l c mbe =
    case mbe of
        Nothing -> Window.empty
        Just e -> 
            let wbombs = List.map drawBomb e.eBombs
                wplayers = List.map drawPlayer e.ePlayers
                wburns = List.map drawFlame e.eBurned
                txt = "(" ++ String.fromInt l ++ "," ++ String.fromInt c ++ ")"
                wpos = if c == 0 || l == 0 then Window.wordsWith white txt AlignCenter "(10,10)" else Window.empty
            in Window.group (drawCell e.eCell e.ePowerup :: wbombs ++ wplayers ++ wburns ++ [wpos])

playerKey : PlayerId -> Int -> String
playerKey pid k =
    let toStr mb = case mb of
            Nothing -> ""
            Just c -> String.fromList [c]
    in toStr <| (case pid of
        0 -> nthString "AWSDE" k
        1 -> nthString "FTGHY" k
        2 -> nthString "JIKLO" k
        3 -> nthString "\u{2190}\u{2191}\u{2193}\u{2192}\u{2423}" k
        4 -> nthString "\u{2190}\u{2191}\u{2193}\u{2192}\u{1F4A3}" k
        _ -> Nothing)

moveToInt : Move -> Int
moveToInt mv = case mv of
    BotMove Bot.MoveLeft  -> 0
    BotMove Bot.MoveUp    -> 1
    BotMove Bot.MoveDown  -> 2
    BotMove Bot.MoveRight -> 3
    BotMove Bot.DropBomb  -> 4
    MoveError             -> 5
    BotMove Bot.Idle      -> 6

drawPlayerKey : Maybe (Move,Bool) -> PlayerId -> Int -> Window
drawPlayerKey mb pid k =
    let (color,no) = (case mb of
            Nothing -> (black,False)
            Just (mv,isWrong) -> if (moveToInt mv)==k then (white,isWrong) else (black,False)) in
    let z8 x = x*1.2 in
    let errImg = if k == 5 then "../graphics/error.gif" else "../graphics/stop.gif" in
    let wno = if no then Window.zoom z8 z8 AlignCenter <| Window.image errImg else Window.empty in
    Window.group [Window.words color (playerKey pid k) AlignCenter,wno]

-- player info on the menu
drawPlayerState : Bool -> PlayerId -> PlayerState -> Window
drawPlayerState isBot pid pst =
    let wp = Window.zoom identity (\h->h*0.8) AlignBottom <| Window.words textColor ("Player " ++ String.fromInt pid) AlignCenter
        wn = Window.words textColor (pst.pData.pName) AlignCenter
        wicon = Window.zoom (\w->w*0.9) (\h->h*0.9) AlignCenter <| Window.image ("../graphics/players/p" ++ String.fromInt pst.pData.pAvatar ++ ".gif")
--        wkeys = Window.words textColor (playerKeys pid) AlignLeft
        wkeys = Window.zoom (\w->w*0.7) identity AlignCenter <| Window.matrix 1 6 (\l c -> drawPlayerKey pst.pLastMove (if isBot then 4 else pid) c)
        wbombs = Window.hlist <| List.take 6 <| List.repeat pst.pBombs (Window.image "../graphics/bombs.gif") ++ List.repeat 6 Window.empty
        wflames = Window.hlist <| List.take 6 <| List.repeat pst.pFlames (Window.image "../graphics/flames.gif") ++ List.repeat 6 Window.empty 
        wdata = Window.zoom identity (\h->h*0.9) AlignCenter <| Window.vlist <| List.map (Window.zoom (\w->w*0.9) (\h->h*0.9) AlignCenter) [wn,wbombs,wflames,wkeys]
        wst = Window.left (\w->w*0.3) wicon <| wdata
    in Window.top (\h->h*0.2) wst wp

-- player info on the menu
drawPlayerStatus : PlayerId -> Player -> Window
drawPlayerStatus pid p =
    let drawBox c = Window.rectangle c in
    let drawDead b = if b then Window.cross foregroundColor 2 else Window.empty in
    let pColor b = if b then darkCharcoal else playerColor pid in
    case p of
        PNone -> Window.group [drawBox backgroundColor,drawDead True]
        PBot _ pst isDead -> Window.group [drawBox (pColor isDead), drawPlayerState True pid pst,drawDead isDead]
        PHuman pst isDead -> Window.group [drawBox (pColor isDead), drawPlayerState False pid pst,drawDead isDead]

drawButton : Mouse -> String -> String -> Maybe Regions -> Window
drawButton mouse name txt mbregions =
    let regions = Maybe.withDefault Dict.empty mbregions in
    let buttonRegion = Maybe.withDefault Window.emptyRegion <| Dict.get name regions in 
    let inside = Window.mouseInsideRegion mouse buttonRegion in
    let color1 = if inside then grey else darkGrey in
    let color2 = if inside && mouse.down then white else black in
    let wtxt = Window.words color2 txt AlignCenter in
    let button = case mbregions of
            Nothing -> Window.empty
            Just _ -> Window.group [Window.rectangle color1,wtxt] in
    Window.region name <| button

drawButtons : Mouse -> Int -> Maybe Regions -> Window
drawButtons mouse speed regions =
    let rewind = drawButton mouse "rewind" "\u{23EE}" regions in
    let slow = drawButton mouse "slow" "\u{23F7}" regions in
    let fast = drawButton mouse "fast" "\u{23F6}" regions in
    let wspeed = case regions of
            Nothing -> Window.empty
            Just _ -> Window.group [Window.rectangle darkGrey,Window.words black (String.fromInt speed++"x") AlignCenter] in
    Window.hlist [rewind,slow,wspeed,fast]

drawMap : Computer -> State -> Maybe Regions -> Int -> Bool -> Window
drawMap computer st regions speed showPane =
    let m = st.map in
    let ps = st.players in
    let wbackground = Window.rectangle backgroundColor in
    let wboard = Window.square AlignRight (Window.matrix mapsize mapsize (\l c -> getExtCell (l,c) st |> drawExtCell l c )) in
    let wplayers = Window.matrix 4 1 (\l c -> getPlayer l ps |> drawPlayerStatus l) in
    let wbuttons = drawButtons computer.mouse speed regions in
    let wtimew = (Window.wordsWith darkGrey (String.fromInt st.clock) AlignLeft "000") in
    let wtime = Window.right (\w -> w*0.7) (Window.zoom (\w->w*0.8) identity AlignRight <| Window.image "../graphics/clock.gif") wtimew in
    let wpane = Window.top (\h -> h*0.2) wplayers <| Window.bottom (\h->h*0.25) wbuttons wtime in
    if showPane then Window.group [wbackground,Window.right (\w -> w*0.25) wboard wpane] else wboard

