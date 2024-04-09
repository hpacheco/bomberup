module Game.Window exposing (..)

import Game.Playground as Playground exposing (..)
import List exposing (..)
import String exposing (length)
import Utils exposing (..)
import Dict exposing (Dict)
import Tuple exposing (..)

-- a rectangle within the screen
type alias Region = { regionLeftTop : Position, regionDimension : Dimension }
type alias Regions = Dict String Region
type alias WindowResult = { windowDraw : List Shape, windowRegions : Regions }
type alias Window = Screen -> WindowResult
type alias Dimension = (Number,Number)
type alias Position = (Number,Number) -- (x,y)

mouseInsideRegion : Mouse -> Region -> Bool
mouseInsideRegion mouse r =
    let (regionLeft,regionTop) = r.regionLeftTop in
    let (w,h) = r.regionDimension in
    let regionRight = regionLeft + w in
    let regionBottom = regionTop - h in
    (regionLeft <= mouse.x && mouse.x <= regionRight) && (regionBottom <= mouse.y && mouse.y <= regionTop)

emptyRegion : Region
emptyRegion = { regionLeftTop = (0,0), regionDimension = (0,0) }

screenToRegion : Screen -> Region
screenToRegion s = { regionLeftTop = (s.left,s.top), regionDimension = (s.width,s.height) }

screenDimension : Screen -> Dimension
screenDimension s = (s.width,s.height)

movePosX : Number -> Position -> Position
movePosX f (x,y) = (x+f,y)

movePosY : Number -> Position -> Position
movePosY f (x,y) = (x,y+f)

moveRegionX : Number -> Region -> Region
moveRegionX f r = { r | regionLeftTop = movePosX f r.regionLeftTop }

moveRegionY : Number -> Region -> Region
moveRegionY f r = { r | regionLeftTop = movePosY f r.regionLeftTop }

region : String -> Window -> Window
region name w = \screen ->
    let res = w screen in
    { res | windowRegions = Dict.insert name (screenToRegion screen) res.windowRegions }

constWindowResult : List Shape -> WindowResult
constWindowResult shapes = { windowDraw = shapes, windowRegions = Dict.empty }

mkScreen : Number -> Number -> Screen
mkScreen w h = { width = w, height = h, top = h / 2, left = -(w / 2), right = w / 2, bottom = -(h / 2) }

empty : Window
empty screen = constWindowResult []

type Align
    = AlignLeft
    | AlignRight
    | AlignTop
    | AlignBottom
    | AlignCenter

align : Align -> Dimension -> Dimension -> (Number,Number)
align a (cx,cy) (sx,sy) = case a of
    AlignLeft   -> (-((sx-cx)/2),0)
    AlignRight  -> (((sx-cx)/2),0)
    AlignTop    -> (0,((sy-cy)/2))
    AlignBottom -> (0,-((sy-cy)/2))
    AlignCenter -> (0,0)

fitWith : Align -> Dimension -> Dimension -> Shape -> Shape
fitWith a (cx,cy) (sx,sy) pic =
    let scalex = sx / cx in
    let scaley = sy / cy in
    let scalexy = max 0 (min scalex scaley) in
    let (ax,ay) = align a (cx*scalexy,cy*scalexy) (sx,sy) in
    moveX ax <| moveY ay <| Playground.scale scalexy pic

words : Color -> String -> Align -> Window
words c txt a = wordsWith c txt a txt

wordsWith : Color -> String -> Align -> String -> Window
wordsWith c txt a fitTxt screen =
    let charwidth = 15 in
    let charheight = 12 in
    constWindowResult [Playground.words c txt |> fitWith a (charwidth* toFloat (String.length fitTxt),charheight) (screenDimension screen)]

zoom : (Float -> Float) -> (Float -> Float) -> Align -> Window -> Window
zoom fw fh a w screen =
    let wZ = fw screen.width in
    let hZ = fh screen.height in
    let screenZ = mkScreen wZ hZ in
    let wZoom = w screenZ in
    let (ax,ay) = align a (wZ,hZ) (screen.width,screen.height) in
    let draw = [moveX ax <| moveY ay <| Playground.group <| wZoom.windowDraw] in
    { windowDraw = draw, windowRegions = Dict.map (\_ -> moveRegionX ax << moveRegionY ay) wZoom.windowRegions }

--fixed : Int -> Int -> Window -> Window
--fixed w h window screen = (mkScreen (toFloat w) (toFloat h) |> window)

left : (Float -> Float) -> Window -> Window -> Window
left fn wl wr screen =
    let n = fn screen.width in
    let screenl = mkScreen n screen.height in
    let screenr = mkScreen (screen.width - n) screen.height in
    let wll = wl screenl in
    let wrr = wr screenr in
    let ll = (-(screen.width/2 - n/2)) in
    let rr = ((n/2)) in
    let draw = [moveX ll <| Playground.group wll.windowDraw,moveX rr <| Playground.group wrr.windowDraw] in
    let regions = Dict.union (Dict.map (\_ -> moveRegionX ll) wll.windowRegions) (Dict.map (\_ -> moveRegionX rr) wrr.windowRegions) in
    { windowDraw = draw, windowRegions = regions }
    
right : (Float -> Float) -> Window -> Window -> Window
right fn wl wr screen =
    let n = fn screen.width in
    let screenl = mkScreen (screen.width - n) screen.height in
    let screenr = mkScreen n screen.height in
    let wll = wl screenl in
    let wrr = wr screenr in
    let ll = (-(n/2)) in
    let rr = (screen.width/2 - n/2) in
    let draw = [moveX ll <| Playground.group wll.windowDraw,moveX rr <| Playground.group wrr.windowDraw] in
    let regions = Dict.union (Dict.map (\_ -> moveRegionX ll) wll.windowRegions) (Dict.map (\_ -> moveRegionX rr) wrr.windowRegions) in
    { windowDraw = draw, windowRegions = regions }

top : (Float -> Float) -> Window -> Window -> Window
top fn wb wt screen =
    let n = fn screen.height in
    let screenb = mkScreen screen.width (screen.height - n) in
    let screent = mkScreen screen.width n in
    let wbb = wb screenb in
    let wtt = wt screent in
    let bb = (-(n/2)) in
    let tt = (screen.height/2 - n/2) in
    let draw = [moveY bb <| Playground.group wbb.windowDraw,moveY tt <| Playground.group wtt.windowDraw] in
    let regions = Dict.union (Dict.map (\_ -> moveRegionY bb) wbb.windowRegions) (Dict.map (\_ -> moveRegionY tt) wtt.windowRegions) in
    { windowDraw = draw, windowRegions = regions }
    
bottom : (Float -> Float) -> Window -> Window -> Window
bottom fn wb wt screen =
    let n = fn screen.height in
    let screenb = mkScreen screen.width n in
    let screent = mkScreen screen.width (screen.height - n) in
    let wbb = wb screenb in
    let wtt = wt screent in
    let bb = (-(screen.height/2 - n/2)) in
    let tt = ((n/2)) in
    let draw = [moveY bb <| Playground.group wbb.windowDraw,moveY tt <| Playground.group wtt.windowDraw] in
    let regions = Dict.union (Dict.map (\_ -> moveRegionY bb) wbb.windowRegions) (Dict.map (\_ -> moveRegionY tt) wtt.windowRegions) in
    { windowDraw = draw, windowRegions = regions }

concatWindowResults : List WindowResult -> WindowResult
concatWindowResults xs = 
    { windowDraw = concat <| List.map (\x->x.windowDraw) xs, windowRegions = concatDicts (\x y -> x) <| List.map (\x->x.windowRegions) xs }

group : List Window -> Window
group ws screen = concatWindowResults <| map (\w -> w screen) ws
    
square : Align -> Window -> Window
square a window screen =
    let w = screen.width in
    let h = screen.height in
    let m = min w h in
    let wSquare = window (mkScreen m m) in
    let (ax,ay) = align a (m,m) (w,h) in
    let draw = [wSquare.windowDraw |> Playground.group |> moveX ax |> moveY ay] in
    { windowDraw = draw, windowRegions = Dict.map (\_ -> moveRegionX ax << moveRegionY ay) wSquare.windowRegions }

matrix : Int -> Int -> (Int -> Int -> Window) -> Window
matrix l c draw screen =
    let w = screen.width in
    let h = screen.height in
    let wc = w / toFloat c in
    let hl = h / toFloat l in
    let screenc = mkScreen wc hl in
    let drawCell : Int -> Int -> WindowResult
        drawCell ll cc = 
            let wC = draw ll cc screenc in
            let yy = (-(toFloat ll * hl) + h / 2 - hl/2) in
            let xx = (toFloat cc * wc - w / 2 + wc/2) in
            let drawC = moveY yy <| moveX xx <| Playground.group wC.windowDraw in
            let regionsC = Dict.map (\_ -> moveRegionY yy << moveRegionX xx) wC.windowRegions in
            { windowDraw = [drawC], windowRegions = regionsC } in
    let drawLine ll = range 0 (c-1) |> map (drawCell ll) |> concatWindowResults in
    let drawLines = range 0 (l-1) |> map drawLine |> concatWindowResults in
    drawLines
    
vlist : List Window -> Window
vlist ws = matrix (List.length ws) 1 (\l _ -> Maybe.withDefault empty <| nth ws l)

hlist : List Window -> Window
hlist ws = matrix 1 (List.length ws) (\_ c -> Maybe.withDefault empty <| nth ws c)
    
border : Int -> Color -> Window -> Window
border n c window screen =
    let n2 = toFloat (n*2) in
    let screenc = mkScreen (screen.width - n2) (screen.height - n2) in
    let wc = window screenc in
    let draw = Playground.rectangle c screen.width screen.height :: wc.windowDraw in
    { windowDraw = draw, windowRegions = wc.windowRegions }
    
rectangle : Color -> Window
rectangle c screen = constWindowResult [Playground.rectangle c screen.width screen.height]

polyrectangle : Color -> Int -> Window
polyrectangle c stroke screen =
    let w2 = screen.width / 2
        h2 = screen.height / 2
    in constWindowResult [Playground.polyline c (toFloat stroke) [(-w2,-h2),(-w2,h2),(w2,h2),(w2,-h2),(-w2,-h2)]]

cross : Color -> Int -> Window
cross c stroke screen =
    let w2 = screen.width / 2
        h2 = screen.height / 2
    in constWindowResult [Playground.polyline c (toFloat stroke) [(-w2,-h2),(w2,h2)],Playground.polyline c (toFloat stroke) [(-w2,h2),(w2,-h2)]]

oval : Color -> Window
oval c screen = constWindowResult [Playground.oval c screen.width screen.height]

image : String -> Window
image url screen = constWindowResult [Playground.image screen.width screen.height url]

imageFit : Dimension -> String -> Window
imageFit dim url screen = constWindowResult [fitWith AlignCenter dim (screen.width,screen.height) <| Playground.image screen.width screen.height url]

