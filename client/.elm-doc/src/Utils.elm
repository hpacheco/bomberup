module Utils exposing (..)

import List exposing (..)
import Set exposing (..)
import Dict exposing (..)
import Maybe exposing (..)
import String exposing (..)
import Task
import Http.Detailed
import Random

import Bytes exposing (Bytes, Endianness(..))
import Bytes.Extra
import Bytes.Decode as Decode exposing (Decoder)
import Bytes.Decode.Extra exposing (andMap, hardcoded)
import Bytes.Encode as Encode
import Bytes.Encode.Extra

import Time exposing (utc)
import Time.Format as Time

flip : (a -> b -> c) -> (b -> a -> c)
flip f b a = f a b

isEven : Int -> Bool
isEven n = modBy 2 n == 0

isOdd : Int -> Bool
isOdd n = modBy 2 n /= 0

nthString : String -> Int -> Maybe Char
nthString s i = nth (String.toList s) i

nth : List a -> Int -> Maybe a
nth xs n = case xs of
    [] -> Nothing
    (x :: ys) -> case n of
        0 -> Just x
        _ -> nth ys (n-1)
        
setNth : List a -> Int -> a -> List a
setNth xs n x = case (xs,n) of
    (y::ys,0) -> x :: ys
    (y::ys,i) -> y :: setNth ys (i-1) x
    _ -> xs
      
catMaybes : List (Maybe a) -> List a
catMaybes = filterMap identity
        
concatSets : List (Set comparable) -> Set comparable
concatSets xs = List.foldl Set.union Set.empty xs

keysSet : Dict comparable v -> Set comparable
keysSet = Set.fromList << Dict.keys

unionDict : (v -> v -> v) -> Dict comparable v -> Dict comparable v -> Dict comparable v
unionDict merge xs ys =
    let upd x mb = case mb of 
            Nothing -> Just x
            Just y -> Just (merge x y)
        ins k v zs = Dict.update k (upd v) zs
    in Dict.foldl ins ys xs

concatDicts : (v -> v -> v) -> List (Dict comparable v) -> Dict comparable v
concatDicts merge xs = List.foldl (unionDict merge) Dict.empty xs

isJust : Maybe a -> Bool
isJust mb = case mb of
    Nothing -> False
    Just _ -> True
    
sendMsg : msg -> Cmd msg
sendMsg msg = Task.perform identity (Task.succeed msg)

errorMessage : Http.Detailed.Error String -> String
errorMessage e = case e of
    Http.Detailed.BadUrl msg -> msg
    Http.Detailed.Timeout -> "timeout"
    Http.Detailed.NetworkError -> "network error"
    Http.Detailed.BadStatus metadata body -> body
    Http.Detailed.BadBody metadata body msg -> msg
    
average2 : Float -> Float -> Float
average2 x y = (x+y) / 2

randomList : a -> List a -> Random.Generator a
randomList def xs = case xs of
    [] -> Random.constant def
    (y::ys) -> Random.uniform y ys

consMaybe : Maybe a -> List a -> List a
consMaybe mb xs = case mb of
    Nothing -> xs
    Just x -> x :: xs
    
stringToByteList : String -> List Int
stringToByteList =
    Encode.string >> Encode.encode >> Bytes.Extra.toByteValues

errorBody : Http.Detailed.Error msg -> Maybe msg
errorBody e = case e of
    Http.Detailed.BadUrl _ -> Nothing
    Http.Detailed.Timeout -> Nothing
    Http.Detailed.NetworkError -> Nothing
    Http.Detailed.BadStatus _ msg -> Just msg
    Http.Detailed.BadBody _ msg _ -> Just msg

millisToString : Int -> String
millisToString = Time.format utc "Weekday, ordDay Month Year at Hour:Minute:Second and Millisms"

anyInt : Random.Generator Int
anyInt = Random.int Random.minInt Random.maxInt