module Page.Editor.Ui.Navigation exposing
  ( Navigation, view
  , compilation, help, restart, run, prev, next
  )

{-| The navigation bar.

-}

import FeatherIcons as I
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, on)
import Page.Editor.Data.Status as Status
import Page.Editor.Ui.Icon as Icon


{-| -}
type alias Navigation msg =
  { left : List (Html msg)
  , right : List (Html msg)
  }


{-| -}
view : Navigation msg -> Html msg
view config =
  nav
    [ id "menu"
    , classList
        [ ( "open", False )
        , ( "closed", True )
        ]
    ]
    [ section
        [ id "actions" ]
        [ aside [] config.left
        , aside [] config.right
        ]
    ]



-- BUTTON / PREMADE

--{-| -}
--toggleSplit : msg -> Html msg
--toggleSplit onClick_ =
--  Icon.button [ style "padding" "0 5px" ]
--    { background = Nothing
--    , icon = I.code
--    , iconColor = Nothing
--    , labelColor = Nothing
--    , label = Nothing
--    , alt = "Open or close result"
--    , onClick = Just onClick_
--    }


{-| -}
help : msg -> Html msg
help onClick_ =
  Icon.button [ style "padding" "0 10px" ]
    { background = Nothing
    , icon = I.bookOpen 
    , iconColor = Nothing
    , labelColor = Nothing
    , label = Just "Help"
    , alt = "Show help"
    , onClick = Just onClick_
    }


{-| -}
compilation : msg -> Status.Status -> Html msg
compilation onClick_ status =
  let ( icon, iconColor, label ) =
        case status of
          Status.Changed ->
            ( I.refreshCcw
            , Just "blue"
            , "Rebuild"
            )

          Status.Compiling ->
            ( I.loader
            , Nothing
            , "Compiling..."
            )

          Status.Success ->
            ( I.check
            , Just "green"
            , "Success"
            )

          Status.HasProblems _ ->
            ( I.x
            , Just "red"
            , "Problems found"
            )

          Status.HasProblemsButChanged _ ->
            ( I.refreshCcw
            , Just "blue"
            , "Rebuild"
            )

          Status.HasProblemsButRecompiling _ ->
            ( I.loader
            , Nothing
            , "Compiling..."
            )

          Status.Failed _ ->
            ( I.x
            , Just "red"
            , "Try again later."
            )
  in
  Icon.button [ style "padding" "0 10px" ]
    { background = Nothing
    , icon = icon
    , iconColor = iconColor
    , label = Just label
    , labelColor = Nothing
    , alt = "Compile your code (Ctrl-Enter)"
    , onClick = Just onClick_
    }

restart : msg -> Html msg
restart onClick_ =
  Icon.button [ style "padding" "0 10px" ]
    { background = Nothing
    , icon = I.rotateCcw 
    , iconColor = Nothing
    , labelColor = Nothing
    , label = Just "Restart"
    , alt = "Restart tutorial"
    , onClick = Just onClick_
    }

prev : msg -> Html msg
prev onClick_ =
  Icon.button [ style "padding" "0 10px" ]
    { background = Nothing
    , icon = I.arrowLeftCircle 
    , iconColor = Nothing
    , labelColor = Nothing
    , label = Just "Previous"
    , alt = "Previous tutorial"
    , onClick = Just onClick_
    }
next : msg -> Html msg
next onClick_ =
  Icon.button [ style "padding" "0 10px" ]
    { background = Nothing
    , icon = I.arrowRightCircle 
    , iconColor = Nothing
    , labelColor = Nothing
    , label = Just "Next"
    , alt = "Next tutorial"
    , onClick = Just onClick_
    }

run : msg -> Html msg
run onClick_ =
  Icon.button [ style "padding" "0 10px" ]
    { background = Nothing
    , icon = I.playCircle 
    , iconColor = Nothing
    , labelColor = Nothing
    , label = Just "Run"
    , alt = "Run tutorial"
    , onClick = Just onClick_
    }

