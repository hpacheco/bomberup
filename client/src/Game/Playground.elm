module Game.Playground exposing (..)

import Browser
import Browser.Dom as Dom
import Browser.Events as E
import Html
import Html.Attributes as H
import Svg exposing (..)
import Svg.Attributes exposing (..)
import Json.Decode as D
import Set
import Task
import Time
import Random

type alias Ticks = Int
type alias TPS = Int

type alias Computer =
  { mouse : Mouse
  , keyboard : Keyboard
  , screen : Screen
  , ticks : Ticks
  , seed : Maybe Random.Seed
  }
type alias Mouse =
  { x : Number
  , y : Number
  , down : Bool
  , click : Bool
  }
type alias Number = Float
type alias Keyboard =
  { up : Bool
  , down : Bool
  , left : Bool
  , right : Bool
  , space : Bool
  , enter : Bool
  , shift : Bool
  , backspace : Bool
  , keys : Set.Set String
  }
type alias Screen =
  { width : Number
  , height : Number
  , top : Number
  , left : Number
  , right : Number
  , bottom : Number
  }

game : TPS -> (Computer -> memory -> List Shape) -> (Computer -> Msg -> memory -> memory) -> (flags -> memory) -> (Random.Seed -> memory -> memory) -> Program flags (Game memory) Msg
game tps viewMemory updateMemory initialMemory initialRandom =
  let
    init flags =
      ( Game E.Visible (initialMemory flags) initialComputer identity
      , Cmd.batch [Random.generate GotSeed Random.independentSeed,Task.perform GotViewport Dom.getViewport]
      )
    view (Game _ memory computer next) =
      { title = "Playground"
      , body = [ render computer.screen (viewMemory computer memory) ]
      }
    update msg model =
      ( gameUpdate updateMemory initialRandom msg model
      , Cmd.none
      )
    subscriptions (Game visibility _ _ _) =
      case visibility of
        E.Hidden ->
          E.onVisibilityChange VisibilityChanged
        E.Visible ->
          gameSubscriptions tps
  in
  Browser.document
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }

initialComputer : Computer
initialComputer =
  { mouse = Mouse 0 0 False False
  , keyboard = emptyKeyboard
  , screen = toScreen 600 600
  , ticks = 0
  , seed = Nothing
  }

-- SUBSCRIPTIONS

gameSubscriptions : TPS -> Sub Msg
gameSubscriptions tps =
  Sub.batch
    [ E.onResize Resized
    , E.onKeyUp (D.map (KeyChanged False) (D.field "key" D.string))
    , E.onKeyDown (D.map (KeyChanged True) (D.field "key" D.string))
    , Time.every (1000 / toFloat tps) (\t -> TickGame)
    , E.onAnimationFrame TickAnimation
    , E.onVisibilityChange VisibilityChanged
    , E.onClick (D.succeed MouseClick)
    , E.onMouseDown (D.succeed (MouseButton True))
    , E.onMouseUp (D.succeed (MouseButton False))
    , E.onMouseMove (D.map2 MouseMove (D.field "pageX" D.float) (D.field "pageY" D.float))
    ]

-- GAME HELPERS

type Game memory =
  Game E.Visibility memory Computer (Computer -> Computer)

type Msg
  = KeyChanged Bool String
  | TickGame
  | TickAnimation Time.Posix
  | GotViewport Dom.Viewport
  | GotSeed Random.Seed
  | Resized Int Int
  | VisibilityChanged E.Visibility
  | MouseMove Float Float
  | MouseClick
  | MouseButton Bool


gameUpdate : (Computer -> Msg -> memory -> memory) -> (Random.Seed -> memory -> memory) -> Msg -> Game memory -> Game memory
gameUpdate updateMemory initialRandom msg (Game vis memory0 computer next) =
  let memory = updateMemory computer msg memory0 in
  case msg of
    TickGame -> case computer.seed of
        Nothing -> Game vis memory computer next
        _ -> Game vis memory (next { computer | ticks = computer.ticks + 1 }) identity
    TickAnimation time -> Game vis memory computer next
    GotViewport {viewport} ->
      Game vis memory { computer | screen = toScreen viewport.width viewport.height } next
    GotSeed seed ->
      Game vis (initialRandom seed memory) { computer | seed = Just seed } next

    Resized w h ->
      Game vis memory { computer | screen = toScreen (toFloat w) (toFloat h) } next

    KeyChanged True key ->
      Game vis memory { computer | keyboard = updateKeyboard True key computer.keyboard } next
    KeyChanged False key ->
      Game vis memory computer (next >> (\c -> { c | keyboard = updateKeyboard False key c.keyboard }))

    MouseMove pageX pageY ->
      let
        x = computer.screen.left + pageX
        y = computer.screen.top - pageY
      in
      Game vis memory { computer | mouse = mouseMove x y computer.mouse } next

    MouseClick ->
      Game vis memory { computer | mouse = mouseClick True computer.mouse } (next >> (\c -> { c | mouse = mouseClick False c.mouse } ))

    MouseButton True ->
      Game vis memory { computer | mouse = mouseDown True computer.mouse } next
    MouseButton False ->
      Game vis memory computer (next >> (\c -> { c | mouse = mouseDown False c.mouse } ))

    VisibilityChanged visibility ->
      Game visibility memory
        { computer
            | keyboard = emptyKeyboard
            , mouse = Mouse computer.mouse.x computer.mouse.y False False
            } next

toScreen : Float -> Float -> Screen
toScreen width height =
  { width = width
  , height = height
  , top = height / 2
  , left = -width / 2
  , right = width / 2
  , bottom = -height / 2
  }

emptyKeyboard : Keyboard
emptyKeyboard =
  { up = False
  , down = False
  , left = False
  , right = False
  , space = False
  , enter = False
  , shift = False
  , backspace = False
  , keys = Set.empty
  }

updateKeyboard : Bool -> String -> Keyboard -> Keyboard
updateKeyboard isDown key keyboard =
  let
    keys =
      if isDown then
        Set.insert key keyboard.keys
      else
        Set.remove key keyboard.keys
  in
  case key of
    " "          -> { keyboard | keys = keys, space = isDown }
    "Enter"      -> { keyboard | keys = keys, enter = isDown }
    "Shift"      -> { keyboard | keys = keys, shift = isDown }
    "Backspace"  -> { keyboard | keys = keys, backspace = isDown }
    "ArrowUp"    -> { keyboard | keys = keys, up = isDown }
    "ArrowDown"  -> { keyboard | keys = keys, down = isDown }
    "ArrowLeft"  -> { keyboard | keys = keys, left = isDown }
    "ArrowRight" -> { keyboard | keys = keys, right = isDown }
    _            -> { keyboard | keys = keys }

mouseClick : Bool -> Mouse -> Mouse
mouseClick bool mouse =
  { mouse | click = bool }


mouseDown : Bool -> Mouse -> Mouse
mouseDown bool mouse =
  { mouse | down = bool }


mouseMove : Float -> Float -> Mouse -> Mouse
mouseMove x y mouse =
  { mouse | x = x, y = y }



render : Screen -> List Shape -> Html.Html msg
render screen shapes =
  let
    w = String.fromFloat screen.width
    h = String.fromFloat screen.height
    x = String.fromFloat screen.left
    y = String.fromFloat screen.bottom
  in
  svg
    [ viewBox (x ++ " " ++ y ++ " " ++ w ++ " " ++ h)
    , H.style "position" "fixed"
    , H.style "top" "0"
    , H.style "left" "0"
    , width "100%"
    , height "100%"
    ]
    (List.map renderShape shapes)


type Shape =
  Shape
    Number -- x
    Number -- y
    Number -- angle
    Number -- scale
    Number -- alpha
    Form


type Form
  = Circle Color Number
  | Oval Color Number Number
  | Rectangle Color Number Number
  | Ngon Color Int Number
  | Polygon Color (List (Number, Number))
  | Polyline Color Number (List (Number, Number))
  | Image Number Number String
  | Words Color String
  | Group (List Shape)

-- TODO try adding Svg.Lazy to renderShape
--
renderShape : Shape -> Svg msg
renderShape (Shape x y angle s alpha form) =
  case form of
    Circle color radius ->
      renderCircle color radius x y angle s alpha

    Oval color width height ->
      renderOval color width height x y angle s alpha

    Rectangle color width height ->
      renderRectangle color width height x y angle s alpha

    Ngon color n radius ->
      renderNgon color n radius x y angle s alpha

    Polygon color points ->
      renderPolygon color points x y angle s alpha
     
    Polyline color pen points ->
      renderPolyline color pen points x y angle s alpha

    Image width height src ->
      renderImage width height src x y angle s alpha

    Words color string ->
      renderWords color string x y angle s alpha

    Group shapes ->
      g (transform (renderTransform x y angle s) :: renderAlpha alpha)
        (List.map renderShape shapes)



-- RENDER CIRCLE AND OVAL


renderCircle : Color -> Number -> Number -> Number -> Number -> Number -> Number -> Svg msg
renderCircle color radius x y angle s alpha =
  Svg.circle
    (  r (String.fromFloat radius)
    :: fill (renderColor color)
    :: transform (renderTransform x y angle s)
    :: renderAlpha alpha
    )
    []


renderOval : Color -> Number -> Number -> Number -> Number -> Number -> Number -> Number -> Svg msg
renderOval color width height x y angle s alpha =
  ellipse
    (  rx (String.fromFloat (width  / 2))
    :: ry (String.fromFloat (height / 2))
    :: fill (renderColor color)
    :: transform (renderTransform x y angle s)
    :: renderAlpha alpha
    )
    []



-- RENDER RECTANGLE AND IMAGE


renderRectangle : Color -> Number -> Number -> Number -> Number -> Number -> Number -> Number -> Svg msg
renderRectangle color w h x y angle s alpha =
  rect
    (  width (String.fromFloat w)
    :: height (String.fromFloat h)
    :: fill (renderColor color)
    :: transform (renderRectTransform w h x y angle s)
    :: renderAlpha alpha
    )
    []


renderRectTransform : Number -> Number -> Number -> Number -> Number -> Number -> String
renderRectTransform width height x y angle s =
  renderTransform x y angle s
  ++ " translate(" ++ String.fromFloat (-width/2) ++ "," ++ String.fromFloat (-height/2) ++ ")"


renderImage : Number -> Number -> String -> Number -> Number -> Number -> Number -> Number -> Svg msg
renderImage w h src x y angle s alpha =
  Svg.image
    (  xlinkHref src
    :: width (String.fromFloat w)
    :: height (String.fromFloat h)
    :: transform (renderRectTransform w h x y angle s)
    :: renderAlpha alpha
    )
    []



-- RENDER NGON


renderNgon : Color -> Int -> Number -> Number -> Number -> Number -> Number -> Number -> Svg msg
renderNgon color n radius x y angle s alpha =
  Svg.polygon
    (  points (toNgonPoints 0 n radius "")
    :: fill (renderColor color)
    :: transform (renderTransform x y angle s)
    :: renderAlpha alpha
    )
    []


toNgonPoints : Int -> Int -> Float -> String -> String
toNgonPoints i n radius string =
  if i == n then
    string
  else
    let
      a = turns (toFloat i / toFloat n - 0.25)
      x = radius * cos a
      y = radius * sin a
    in
    toNgonPoints (i + 1) n radius (string ++ String.fromFloat x ++ "," ++ String.fromFloat y ++ " ")



-- RENDER POLYGON


renderPolygon : Color -> List (Number, Number) -> Number -> Number -> Number -> Number -> Number -> Svg msg
renderPolygon color coordinates x y angle s alpha =
  Svg.polygon
    (  points (List.foldl addPoint "" coordinates)
    :: fill (renderColor color)
    :: transform (renderTransform x y angle s)
    :: renderAlpha alpha
    )
    []

renderPolyline : Color -> Number -> List (Number, Number) -> Number -> Number -> Number -> Number -> Number -> Svg msg
renderPolyline color pen coordinates x y angle s alpha =
  Svg.polyline
    (  points (List.foldl addPoint "" coordinates)
    :: fill "none"
    :: stroke (renderColor color)
    :: strokeWidth (String.fromFloat pen)
    :: transform (renderTransform x y angle s)
    :: renderAlpha alpha
    )
    []

addPoint : (Float, Float) -> String -> String
addPoint (x,y) str =
  str ++ String.fromFloat x ++ "," ++ String.fromFloat -y ++ " "

-- RENDER WORDS


renderWords : Color -> String -> Number -> Number -> Number -> Number -> Number -> Svg msg
renderWords color string x y angle s alpha =
  text_
    (  textAnchor "middle"
    :: dominantBaseline "central"
    :: fill (renderColor color)
    :: transform (renderTransform x y angle s)
    :: renderAlpha alpha
    )
    [ text string
    ]



-- RENDER COLOR


renderColor : Color -> String
renderColor color =
  case color of
    Hex str ->
      str

    Rgb r g b ->
      "rgb(" ++ String.fromInt r ++ "," ++ String.fromInt g ++ "," ++ String.fromInt b ++ ")"



-- RENDER ALPHA


renderAlpha : Number -> List (Svg.Attribute msg)
renderAlpha alpha =
  if alpha == 1 then
    []
  else
    [ opacity (String.fromFloat (clamp 0 1 alpha)) ]



-- RENDER TRANFORMS


renderTransform : Number -> Number -> Number -> Number -> String
renderTransform x y a s =
  if a == 0 then
    if s == 1 then
      "translate(" ++ String.fromFloat x ++ "," ++ String.fromFloat -y ++ ")"
    else
      "translate(" ++ String.fromFloat x ++ "," ++ String.fromFloat -y ++ ") scale(" ++ String.fromFloat s ++ ")"
  else
    if s == 1 then
      "translate(" ++ String.fromFloat x ++ "," ++ String.fromFloat -y ++ ") rotate(" ++ String.fromFloat -a ++ ")"
    else
      "translate(" ++ String.fromFloat x ++ "," ++ String.fromFloat -y ++ ") rotate(" ++ String.fromFloat -a ++ ") scale(" ++ String.fromFloat s ++ ")"
      
type Color
  = Hex String
  | Rgb Int Int Int


{-|-}
lightYellow : Color
lightYellow =
  Hex "#fce94f"


{-|-}
yellow : Color
yellow =
  Hex "#edd400"


{-|-}
darkYellow : Color
darkYellow =
  Hex "#c4a000"


{-|-}
lightOrange : Color
lightOrange =
  Hex "#fcaf3e"


{-|-}
orange : Color
orange =
  Hex "#f57900"


{-|-}
darkOrange : Color
darkOrange =
  Hex "#ce5c00"


{-|-}
lightBrown : Color
lightBrown =
  Hex "#e9b96e"


{-|-}
brown : Color
brown =
  Hex "#c17d11"


{-|-}
darkBrown : Color
darkBrown =
  Hex "#8f5902"


{-|-}
lightGreen : Color
lightGreen =
  Hex "#8ae234"


{-|-}
green : Color
green =
  Hex "#73d216"


{-|-}
darkGreen : Color
darkGreen =
  Hex "#4e9a06"


{-|-}
lightBlue : Color
lightBlue =
  Hex "#729fcf"


{-|-}
blue : Color
blue =
  Hex "#3465a4"


{-|-}
darkBlue : Color
darkBlue =
  Hex "#204a87"


{-|-}
lightPurple : Color
lightPurple =
  Hex "#ad7fa8"


{-|-}
purple : Color
purple =
  Hex "#75507b"


{-|-}
darkPurple : Color
darkPurple =
  Hex "#5c3566"


{-|-}
lightRed : Color
lightRed =
  Hex "#ef2929"


{-|-}
red : Color
red =
  Hex "#cc0000"


{-|-}
darkRed : Color
darkRed =
  Hex "#a40000"


{-|-}
lightGrey : Color
lightGrey =
  Hex "#eeeeec"


{-|-}
grey : Color
grey =
  Hex "#d3d7cf"


{-|-}
darkGrey : Color
darkGrey =
  Hex "#babdb6"


{-|-}
lightCharcoal : Color
lightCharcoal =
  Hex "#888a85"


{-|-}
charcoal : Color
charcoal =
  Hex "#555753"


{-|-}
darkCharcoal : Color
darkCharcoal =
  Hex "#2e3436"


{-|-}
white : Color
white =
  Hex "#FFFFFF"


{-|-}
black : Color
black =
  Hex "#000000"


-- ALTERNATE SPELLING GREYS


{-|-}
lightGray : Color
lightGray =
  Hex "#eeeeec"


{-|-}
gray : Color
gray =
  Hex "#d3d7cf"


{-|-}
darkGray : Color
darkGray =
  Hex "#babdb6"



-- CUSTOM COLORS


{-| RGB stands for Red-Green-Blue. With these three parts, you can create any
color you want. For example:

    brightBlue = rgb 18 147 216
    brightGreen = rgb 119 244 8
    brightPurple = rgb 94 28 221

Each number needs to be between 0 and 255.

It can be hard to figure out what numbers to pick, so try using a color picker
like [paletton][] to find colors that look nice together. Once you find nice
colors, click on the color previews to get their RGB values.

[paletton]: http://paletton.com/
-}
rgb : Number -> Number -> Number -> Color
rgb r g b =
  Rgb (colorClamp r) (colorClamp g) (colorClamp b)


colorClamp : Number -> Int
colorClamp number =
  clamp 0 255 (round number)

circle : Color -> Number -> Shape
circle color radius =
  Shape 0 0 0 1 1 (Circle color radius)


{-| Make ovals:

    football = oval brown 200 100

You give the color, and then the width and height. So our `football` example
is 200 pixels wide and 100 pixels tall.
-}
oval : Color -> Number -> Number -> Shape
oval color width height =
  Shape 0 0 0 1 1 (Oval color width height)


{-| Make squares. Here are two squares combined to look like an empty box:

    import Playground exposing (..)

    main =
      picture
        [ square purple 80
        , square white 60
        ]

The number you give is the dimension of each side. So that purple square would
be 80 pixels by 80 pixels.
-}
square : Color -> Number -> Shape
square color n =
  Shape 0 0 0 1 1 (Rectangle color n n)


{-| Make rectangles. This example makes a red cross:

    import Playground exposing (..)

    main =
      picture
        [ rectangle red 20 60
        , rectangle red 60 20
        ]

You give the color, width, and then height. So the first shape is vertical
part of the cross, the thinner and taller part.
-}
rectangle : Color -> Number -> Number -> Shape
rectangle color width height =
  Shape 0 0 0 1 1 (Rectangle color width height)

{-| Make triangles. So if you wanted to draw the Egyptian pyramids, you could
do a simple version like this:

    import Playground exposing (..)

    main =
      picture
        [ triangle darkYellow 200
        ]

The number is the "radius", so the distance from the center to each point of
the pyramid is `200`. Pretty big!
-}
triangle : Color -> Number -> Shape
triangle color radius =
  Shape 0 0 0 1 1 (Ngon color 3 radius)


{-| Make pentagons:

    import Playground exposing (..)

    main =
      picture
        [ pentagon darkGrey 100
        ]

You give the color and then the radius. So the distance from the center to each
of the five points is 100 pixels.
-}
pentagon : Color -> Number -> Shape
pentagon color radius =
  Shape 0 0 0 1 1 (Ngon color 5 radius)


{-| Make hexagons:

    import Playground exposing (..)

    main =
      picture
        [ hexagon lightYellow 50
        ]

The number is the radius, the distance from the center to each point.

If you made more hexagons, you could [`move`](#move) them around to make a
honeycomb pattern!
-}
hexagon : Color -> Number -> Shape
hexagon color radius =
  Shape 0 0 0 1 1 (Ngon color 6 radius)


{-| Make octogons:

    import Playground exposing (..)

    main =
      picture
        [ octagon red 100
        ]

You give the color and radius, so each point of this stop sign is 100 pixels
from the center.
-}
octagon : Color -> Number -> Shape
octagon color radius =
  Shape 0 0 0 1 1 (Ngon color 8 radius)


{-| Make any shape you want! Here is a very thin triangle:

    import Playground exposing (..)

    main =
      picture
        [ polygon black [ (-10,-20), (0,100), (10,-20) ]
        ]

**Note:** If you [`rotate`](#rotate) a polygon, it will always rotate around
`(0,0)`. So it is best to build your shapes around that point, and then use
[`move`](#move) or [`group`](#group) so that rotation makes more sense.
-}
polygon : Color -> List (Number, Number) -> Shape
polygon color points =
  Shape 0 0 0 1 1 (Polygon color points)

polyline : Color -> Number -> List (Number, Number) -> Shape
polyline color stroke points =
  Shape 0 0 0 1 1 (Polyline color stroke points)

{-| Add some image from the internet:

    import Playground exposing (..)

    main =
      picture
        [ image 96 96 "https://elm-lang.org/images/turtle.gif"
        ]

You provide the width, height, and then the URL of the image you want to show.
-}
image : Number -> Number -> String -> Shape
image w h src =
  Shape 0 0 0 1 1 (Image w h src)


{-| Show some words!

    import Playground exposing (..)

    main =
      picture
        [ words black "Hello! How are you?"
        ]

You can use [`scale`](#scale) to make the words bigger or smaller.
-}
words : Color -> String -> Shape
words color string =
  Shape 0 0 0 1 1 (Words color string)


{-| Put shapes together so you can [`move`](#move) and [`rotate`](#rotate)
them as a group. Maybe you want to put a bunch of stars in the sky:

    import Playground exposing (..)

    main =
      picture
        [ star
            |> move 100 100
            |> rotate 5
        , star
            |> move -120 40
            |> rotate 20
        , star
            |> move 80 -150
            |> rotate 32
        , star
            |> move -90 -30
            |> rotate -16
        ]

    star =
      group
        [ triangle yellow 20
        , triangle yellow 20
            |> rotate 180
        ]
-}
group : List Shape -> Shape
group shapes =
  Shape 0 0 0 1 1 (Group shapes)



-- TRANSFORMS


{-| Move a shape by some number of pixels:

    import Playground exposing (..)

    main =
      picture
        [ square red 100
            |> move -60 60
        , square yellow 100
            |> move 60 60
        , square green 100
            |> move 60 -60
        , square blue 100
            |> move -60 -60
        ]
-}
move : Number -> Number -> Shape -> Shape
move dx dy (Shape x y a s o f) =
  Shape (x + dx) (y + dy) a s o f


{-| Move a shape up by some number of pixels. So if you wanted to make a tree
you could move the leaves up above the trunk:

    import Playground exposing (..)

    main =
      picture
        [ rectangle brown 40 200
        , circle green 100
            |> moveUp 180
        ]
-}
moveUp : Number -> Shape -> Shape
moveUp =
  moveY


{-| Move a shape down by some number of pixels. So if you wanted to put the sky
above the ground, you could move the sky up and the ground down:

    import Playground exposing (..)

    main =
      picture
        [ rectangle lightBlue 200 100
            |> moveUp 50
        , rectangle lightGreen 200 100
            |> moveDown 50
        ]
-}
moveDown : Number -> Shape -> Shape
moveDown dy (Shape x y a s o f) =
  Shape x (y - dy) a s o f


{-| Move shapes to the left.

    import Playground exposing (..)

    main =
      picture
        [ circle yellow 10
            |> moveLeft 80
            |> moveUp 30
        ]
-}
moveLeft : Number -> Shape -> Shape
moveLeft dx (Shape x y a s o f) =
  Shape (x - dx) y a s o f


{-| Move shapes to the right.

    import Playground exposing (..)

    main =
      picture
        [ square purple 20
            |> moveRight 80
            |> moveDown 100
        ]
-}
moveRight : Number -> Shape -> Shape
moveRight =
  moveX


{-| Move the `x` coordinate of a shape by some amount. Here is a square that
moves back and forth:

    import Playground exposing (..)

    main =
      animation view

    view time =
      [ square purple 20
          |> moveX (wave 4 -200 200 time)
      ]

Using `moveX` feels a bit nicer here because the movement may be positive or negative.
-}
moveX : Number -> Shape -> Shape
moveX dx (Shape x y a s o f) =
  Shape (x + dx) y a s o f


{-| Move the `y` coordinate of a shape by some amount. Maybe you want to make
grass along the bottom of the screen:

    import Playground exposing (..)

    main =
      game view update 0

    update computer memory =
      memory

    view computer count =
      [ rectangle green computer.screen.width 100
          |> moveY computer.screen.bottom
      ]

Using `moveY` feels a bit nicer when setting things relative to the bottom or
top of the screen, since the values are negative sometimes.
-}
moveY : Number -> Shape -> Shape
moveY dy (Shape x y a s o f) =
  Shape x (y + dy) a s o f


{-| Make a shape bigger or smaller. So if you wanted some [`words`](#words) to
be larger, you could say:

    import Playground exposing (..)

    main =
      picture
        [ words black "Hello, nice to see you!"
            |> scale 3
        ]
-}
scale : Number -> Shape -> Shape
scale ns (Shape x y a s o f) =
  Shape x y a (s * ns) o f


{-| Rotate shapes in degrees.

    import Playground exposing (..)

    main =
      picture
        [ words black "These words are tilted!"
            |> rotate 10
        ]

The degrees go **counter-clockwise** to match the direction of the
[unit circle](https://en.wikipedia.org/wiki/Unit_circle).
-}
rotate : Number -> Shape -> Shape
rotate da (Shape x y a s o f) =
  Shape x y (a + da) s o f


{-| Fade a shape. This lets you make shapes see-through or even completely
invisible. Here is a shape that fades in and out:

    import Playground exposing (..)

    main =
      animation view

    view time =
      [ square orange 30
      , square blue 200
          |> fade (zigzag 0 1 3 time)
      ]

The number has to be between `0` and `1`, where `0` is totally transparent
and `1` is completely solid.
-}
fade : Number -> Shape -> Shape
fade o (Shape x y a s _ f) =
  Shape x y a s o f