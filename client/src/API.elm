module API exposing(..)

import Json.Decode
import Json.Encode exposing (Value)
-- The following module comes from bartavelle/json-helpers
import Json.Helpers exposing (..)
import Dict exposing (Dict)
import Set
import Http
import String
import Url.Builder
import Result
import Http.Detailed
import Base64

type alias Login  =
   { email: String
   , password: String
   }

jsonDecLogin : Json.Decode.Decoder ( Login )
jsonDecLogin =
   Json.Decode.succeed (\pemail ppassword -> {email = pemail, password = ppassword})
   |> required "email" (Json.Decode.string)
   |> required "password" (Json.Decode.string)

jsonEncLogin : Login -> Value
jsonEncLogin  val =
   Json.Encode.object
   [ ("email", Json.Encode.string val.email)
   , ("password", Json.Encode.string val.password)
   ]



type alias User  =
   { userEmail: String
   }

jsonDecUser : Json.Decode.Decoder ( User )
jsonDecUser =
   Json.Decode.succeed (\puserEmail -> {userEmail = puserEmail}) |> custom (Json.Decode.string)

jsonEncUser : User -> Value
jsonEncUser  val =
   Json.Encode.string val.userEmail


type alias UserInfo  =
   { userInfoEmail: String
   , userInfoAvatar: Int
   }

jsonDecUserInfo : Json.Decode.Decoder ( UserInfo )
jsonDecUserInfo =
   Json.Decode.succeed (\puserInfoEmail puserInfoAvatar -> {userInfoEmail = puserInfoEmail, userInfoAvatar = puserInfoAvatar})
   |> required "userInfoEmail" (Json.Decode.string)
   |> required "userInfoAvatar" (Json.Decode.int)

jsonEncUserInfo : UserInfo -> Value
jsonEncUserInfo  val =
   Json.Encode.object
   [ ("userInfoEmail", Json.Encode.string val.userInfoEmail)
   , ("userInfoAvatar", Json.Encode.int val.userInfoAvatar)
   ]



type alias RawHtml  = ByteString

jsonDecRawHtml : Json.Decode.Decoder ( RawHtml )
jsonDecRawHtml =
    jsonDecByteString

jsonEncRawHtml : RawHtml -> Value
jsonEncRawHtml  val = jsonEncByteString val



type alias GameFlags  =
   { gamePlayers: (List String)
   }

jsonDecGameFlags : Json.Decode.Decoder ( GameFlags )
jsonDecGameFlags =
   Json.Decode.succeed (\pgamePlayers -> {gamePlayers = pgamePlayers}) |> custom (Json.Decode.list (Json.Decode.string))

jsonEncGameFlags : GameFlags -> Value
jsonEncGameFlags  val =
   (Json.Encode.list Json.Encode.string) val.gamePlayers


type alias TutorialFlags  =
   { tutorialId: Int
   , tutorialRun: Bool
   , tutorialRand: (List Int)
   }

jsonDecTutorialFlags : Json.Decode.Decoder ( TutorialFlags )
jsonDecTutorialFlags =
   Json.Decode.succeed (\ptutorialId ptutorialRun ptutorialRand -> {tutorialId = ptutorialId, tutorialRun = ptutorialRun, tutorialRand = ptutorialRand})
   |> required "tutorialId" (Json.Decode.int)
   |> required "tutorialRun" (Json.Decode.bool)
   |> required "tutorialRand" (Json.Decode.list (Json.Decode.int))

jsonEncTutorialFlags : TutorialFlags -> Value
jsonEncTutorialFlags  val =
   Json.Encode.object
   [ ("tutorialId", Json.Encode.int val.tutorialId)
   , ("tutorialRun", Json.Encode.bool val.tutorialRun)
   , ("tutorialRand", (Json.Encode.list Json.Encode.int) val.tutorialRand)
   ]



type alias TutorialData  =
   { tutorialDataId: Int
   , tutorialDataCode: String
   , tutorialDataRand: (List Int)
   }

jsonDecTutorialData : Json.Decode.Decoder ( TutorialData )
jsonDecTutorialData =
   Json.Decode.succeed (\ptutorialDataId ptutorialDataCode ptutorialDataRand -> {tutorialDataId = ptutorialDataId, tutorialDataCode = ptutorialDataCode, tutorialDataRand = ptutorialDataRand})
   |> required "tutorialDataId" (Json.Decode.int)
   |> required "tutorialDataCode" (Json.Decode.string)
   |> required "tutorialDataRand" (Json.Decode.list (Json.Decode.int))

jsonEncTutorialData : TutorialData -> Value
jsonEncTutorialData  val =
   Json.Encode.object
   [ ("tutorialDataId", Json.Encode.int val.tutorialDataId)
   , ("tutorialDataCode", Json.Encode.string val.tutorialDataCode)
   , ("tutorialDataRand", (Json.Encode.list Json.Encode.int) val.tutorialDataRand)
   ]



type alias BotData  =
   { botCode: String
   , botStatus: Bool
   }

jsonDecBotData : Json.Decode.Decoder ( BotData )
jsonDecBotData =
   Json.Decode.succeed (\pbotCode pbotStatus -> {botCode = pbotCode, botStatus = pbotStatus})
   |> required "botCode" (Json.Decode.string)
   |> required "botStatus" (Json.Decode.bool)

jsonEncBotData : BotData -> Value
jsonEncBotData  val =
   Json.Encode.object
   [ ("botCode", Json.Encode.string val.botCode)
   , ("botStatus", Json.Encode.bool val.botStatus)
   ]



type alias Code  =
   { code: String
   }

jsonDecCode : Json.Decode.Decoder ( Code )
jsonDecCode =
   Json.Decode.succeed (\pcode -> {code = pcode}) |> custom (Json.Decode.string)

jsonEncCode : Code -> Value
jsonEncCode  val =
   Json.Encode.string val.code


type alias Opponent  =
   { opponentName: String
   }

jsonDecOpponent : Json.Decode.Decoder ( Opponent )
jsonDecOpponent =
   Json.Decode.succeed (\popponentName -> {opponentName = popponentName}) |> custom (Json.Decode.string)

jsonEncOpponent : Opponent -> Value
jsonEncOpponent  val =
   Json.Encode.string val.opponentName


type alias MatchPlayer  =
   { mpId: Int
   , mpName: String
   , mpAvatar: Int
   }

jsonDecMatchPlayer : Json.Decode.Decoder ( MatchPlayer )
jsonDecMatchPlayer =
   Json.Decode.succeed (\pmpId pmpName pmpAvatar -> {mpId = pmpId, mpName = pmpName, mpAvatar = pmpAvatar})
   |> required "mpId" (Json.Decode.int)
   |> required "mpName" (Json.Decode.string)
   |> required "mpAvatar" (Json.Decode.int)

jsonEncMatchPlayer : MatchPlayer -> Value
jsonEncMatchPlayer  val =
   Json.Encode.object
   [ ("mpId", Json.Encode.int val.mpId)
   , ("mpName", Json.Encode.string val.mpName)
   , ("mpAvatar", Json.Encode.int val.mpAvatar)
   ]



type alias MatchInfo  =
   { mP1: MatchPlayer
   , mP2: MatchPlayer
   , mWinner: (Maybe Int)
   , mChampionship: Bool
   , mTime: Milliseconds
   }

jsonDecMatchInfo : Json.Decode.Decoder ( MatchInfo )
jsonDecMatchInfo =
   Json.Decode.succeed (\pmP1 pmP2 pmWinner pmChampionship pmTime -> {mP1 = pmP1, mP2 = pmP2, mWinner = pmWinner, mChampionship = pmChampionship, mTime = pmTime})
   |> required "mP1" (jsonDecMatchPlayer)
   |> required "mP2" (jsonDecMatchPlayer)
   |> fnullable "mWinner" (Json.Decode.int)
   |> required "mChampionship" (Json.Decode.bool)
   |> required "mTime" (jsonDecMilliseconds)

jsonEncMatchInfo : MatchInfo -> Value
jsonEncMatchInfo  val =
   Json.Encode.object
   [ ("mP1", jsonEncMatchPlayer val.mP1)
   , ("mP2", jsonEncMatchPlayer val.mP2)
   , ("mWinner", (maybeEncode (Json.Encode.int)) val.mWinner)
   , ("mChampionship", Json.Encode.bool val.mChampionship)
   , ("mTime", jsonEncMilliseconds val.mTime)
   ]



type alias MatchData  =
   { mPowers: (List ((Int, Int), Int))
   , mMoves1: (List Int)
   , mMoves2: (List Int)
   }

jsonDecMatchData : Json.Decode.Decoder ( MatchData )
jsonDecMatchData =
   Json.Decode.succeed (\pmPowers pmMoves1 pmMoves2 -> {mPowers = pmPowers, mMoves1 = pmMoves1, mMoves2 = pmMoves2})
   |> required "mPowers" (Json.Decode.list (Json.Decode.map2 tuple2 (Json.Decode.index 0 (Json.Decode.map2 tuple2 (Json.Decode.index 0 (Json.Decode.int)) (Json.Decode.index 1 (Json.Decode.int)))) (Json.Decode.index 1 (Json.Decode.int))))
   |> required "mMoves1" (Json.Decode.list (Json.Decode.int))
   |> required "mMoves2" (Json.Decode.list (Json.Decode.int))

jsonEncMatchData : MatchData -> Value
jsonEncMatchData  val =
   Json.Encode.object
   [ ("mPowers", (Json.Encode.list (\(t1,t2) -> Json.Encode.list identity [((\(t3,t4) -> Json.Encode.list identity [(Json.Encode.int) t3,(Json.Encode.int) t4])) t1,(Json.Encode.int) t2])) val.mPowers)
   , ("mMoves1", (Json.Encode.list Json.Encode.int) val.mMoves1)
   , ("mMoves2", (Json.Encode.list Json.Encode.int) val.mMoves2)
   ]



type alias Match  =
   { mInfo: MatchInfo
   , mData: MatchData
   }

jsonDecMatch : Json.Decode.Decoder ( Match )
jsonDecMatch =
   Json.Decode.succeed (\pmInfo pmData -> {mInfo = pmInfo, mData = pmData})
   |> required "mInfo" (jsonDecMatchInfo)
   |> required "mData" (jsonDecMatchData)

jsonEncMatch : Match -> Value
jsonEncMatch  val =
   Json.Encode.object
   [ ("mInfo", jsonEncMatchInfo val.mInfo)
   , ("mData", jsonEncMatchData val.mData)
   ]



type alias Champion  =
   { champName: String
   , champAvatar: Int
   }

jsonDecChampion : Json.Decode.Decoder ( Champion )
jsonDecChampion =
   Json.Decode.succeed (\pchampName pchampAvatar -> {champName = pchampName, champAvatar = pchampAvatar})
   |> required "champName" (Json.Decode.string)
   |> required "champAvatar" (Json.Decode.int)

jsonEncChampion : Champion -> Value
jsonEncChampion  val =
   Json.Encode.object
   [ ("champName", Json.Encode.string val.champName)
   , ("champAvatar", Json.Encode.int val.champAvatar)
   ]



type alias Ranking  =
   { rankingChampion: (Maybe Champion)
   , rankingMatches: (List MatchInfo)
   }

jsonDecRanking : Json.Decode.Decoder ( Ranking )
jsonDecRanking =
   Json.Decode.succeed (\prankingChampion prankingMatches -> {rankingChampion = prankingChampion, rankingMatches = prankingMatches})
   |> fnullable "rankingChampion" (jsonDecChampion)
   |> required "rankingMatches" (Json.Decode.list (jsonDecMatchInfo))

jsonEncRanking : Ranking -> Value
jsonEncRanking  val =
   Json.Encode.object
   [ ("rankingChampion", (maybeEncode (jsonEncChampion)) val.rankingChampion)
   , ("rankingMatches", (Json.Encode.list jsonEncMatchInfo) val.rankingMatches)
   ]


postApiLogin : Login -> (DetailedResult (Http.Detailed.Error String)  (User)  -> msg) -> Cmd msg
postApiLogin body toMsg =
    let
        params =
            List.filterMap identity
            (List.concat
                [])
    in
        Http.request
            { method =
                "POST"
            , headers =
                []
            , url =
                Url.Builder.crossOrigin ""
                    [ "api"
                    , "login"
                    ]
                    params
            , body =
                Http.jsonBody (jsonEncLogin body)
            , expect =
                Http.Detailed.expectJson toMsg jsonDecUser
            , timeout =
                Nothing
            , tracker =
                Nothing
            }

postApiSignup : Login -> (DetailedResult (Http.Detailed.Error String)  (User)  -> msg) -> Cmd msg
postApiSignup body toMsg =
    let
        params =
            List.filterMap identity
            (List.concat
                [])
    in
        Http.request
            { method =
                "POST"
            , headers =
                []
            , url =
                Url.Builder.crossOrigin ""
                    [ "api"
                    , "signup"
                    ]
                    params
            , body =
                Http.jsonBody (jsonEncLogin body)
            , expect =
                Http.Detailed.expectJson toMsg jsonDecUser
            , timeout =
                Nothing
            , tracker =
                Nothing
            }

getApiGame : (Maybe (JSONEncoded GameFlags)) -> (DetailedResult (Http.Detailed.Error String)  (RawHtml)  -> msg) -> Cmd msg
getApiGame query_flags toMsg =
    let
        params =
            List.filterMap identity
            (List.concat
                [ [ query_flags
                    |> Maybe.map (fromJSONEncoded jsonEncGameFlags
                                  >> Url.Builder.string "flags") ]
                ])
    in
        Http.request
            { method =
                "GET"
            , headers =
                []
            , url =
                Url.Builder.crossOrigin ""
                    [ "api"
                    , "game"
                    ]
                    params
            , body =
                Http.emptyBody
            , expect =
                Http.Detailed.expectJson toMsg jsonDecRawHtml
            , timeout =
                Nothing
            , tracker =
                Nothing
            }

getApiMatch : (Maybe Int64) -> (DetailedResult (Http.Detailed.Error String)  (RawHtml)  -> msg) -> Cmd msg
getApiMatch query_id toMsg =
    let
        params =
            List.filterMap identity
            (List.concat
                [ [ query_id
                    |> Maybe.map (String.fromInt
                                  >> Url.Builder.string "id") ]
                ])
    in
        Http.request
            { method =
                "GET"
            , headers =
                []
            , url =
                Url.Builder.crossOrigin ""
                    [ "api"
                    , "match"
                    ]
                    params
            , body =
                Http.emptyBody
            , expect =
                Http.Detailed.expectJson toMsg jsonDecRawHtml
            , timeout =
                Nothing
            , tracker =
                Nothing
            }

getApiTutorialPlay : (Maybe (JSONEncoded TutorialFlags)) -> (DetailedResult (Http.Detailed.Error String)  (RawHtml)  -> msg) -> Cmd msg
getApiTutorialPlay query_flags toMsg =
    let
        params =
            List.filterMap identity
            (List.concat
                [ [ query_flags
                    |> Maybe.map (fromJSONEncoded jsonEncTutorialFlags
                                  >> Url.Builder.string "flags") ]
                ])
    in
        Http.request
            { method =
                "GET"
            , headers =
                []
            , url =
                Url.Builder.crossOrigin ""
                    [ "api"
                    , "tutorialPlay"
                    ]
                    params
            , body =
                Http.emptyBody
            , expect =
                Http.Detailed.expectJson toMsg jsonDecRawHtml
            , timeout =
                Nothing
            , tracker =
                Nothing
            }

getApiRanking : (DetailedResult (Http.Detailed.Error String)  (Ranking)  -> msg) -> Cmd msg
getApiRanking toMsg =
    let
        params =
            List.filterMap identity
            (List.concat
                [])
    in
        Http.request
            { method =
                "GET"
            , headers =
                []
            , url =
                Url.Builder.crossOrigin ""
                    [ "api"
                    , "ranking"
                    ]
                    params
            , body =
                Http.emptyBody
            , expect =
                Http.Detailed.expectJson toMsg jsonDecRanking
            , timeout =
                Nothing
            , tracker =
                Nothing
            }

getApiTutorial : (Maybe Int) -> (DetailedResult (Http.Detailed.Error String)  (RawHtml)  -> msg) -> Cmd msg
getApiTutorial query_id toMsg =
    let
        params =
            List.filterMap identity
            (List.concat
                [ [ query_id
                    |> Maybe.map (String.fromInt
                                  >> Url.Builder.string "id") ]
                ])
    in
        Http.request
            { method =
                "GET"
            , headers =
                []
            , url =
                Url.Builder.crossOrigin ""
                    [ "api"
                    , "tutorial"
                    ]
                    params
            , body =
                Http.emptyBody
            , expect =
                Http.Detailed.expectJson toMsg jsonDecRawHtml
            , timeout =
                Nothing
            , tracker =
                Nothing
            }

getApiTutorialData : (Maybe Int) -> (DetailedResult (Http.Detailed.Error String)  (TutorialData)  -> msg) -> Cmd msg
getApiTutorialData query_id toMsg =
    let
        params =
            List.filterMap identity
            (List.concat
                [ [ query_id
                    |> Maybe.map (String.fromInt
                                  >> Url.Builder.string "id") ]
                ])
    in
        Http.request
            { method =
                "GET"
            , headers =
                []
            , url =
                Url.Builder.crossOrigin ""
                    [ "api"
                    , "tutorialData"
                    ]
                    params
            , body =
                Http.emptyBody
            , expect =
                Http.Detailed.expectJson toMsg jsonDecTutorialData
            , timeout =
                Nothing
            , tracker =
                Nothing
            }
getApiLoggedin : (DetailedResult (Http.Detailed.Error String)  (User)  -> msg) -> Cmd msg
getApiLoggedin toMsg =
    let
        params =
            List.filterMap identity
            (List.concat
                [])
    in
        Http.request
            { method =
                "GET"
            , headers =
                []
            , url =
                Url.Builder.crossOrigin ""
                    [ "api"
                    , "loggedin"
                    ]
                    params
            , body =
                Http.emptyBody
            , expect =
                Http.Detailed.expectJson toMsg jsonDecUser
            , timeout =
                Nothing
            , tracker =
                Nothing
            }

getApiUserInfo : (DetailedResult (Http.Detailed.Error String)  (UserInfo)  -> msg) -> Cmd msg
getApiUserInfo toMsg =
    let
        params =
            List.filterMap identity
            (List.concat
                [])
    in
        Http.request
            { method =
                "GET"
            , headers =
                []
            , url =
                Url.Builder.crossOrigin ""
                    [ "api"
                    , "userInfo"
                    ]
                    params
            , body =
                Http.emptyBody
            , expect =
                Http.Detailed.expectJson toMsg jsonDecUserInfo
            , timeout =
                Nothing
            , tracker =
                Nothing
            }

postApiAvatar : Int -> (DetailedResult (Http.Detailed.Error String)  (Empty)  -> msg) -> Cmd msg
postApiAvatar body toMsg =
    let
        params =
            List.filterMap identity
            (List.concat
                [])
    in
        Http.request
            { method =
                "POST"
            , headers =
                []
            , url =
                Url.Builder.crossOrigin ""
                    [ "api"
                    , "avatar"
                    ]
                    params
            , body =
                Http.jsonBody (Json.Encode.int body)
            , expect =
                Http.Detailed.expectJson toMsg jsonDecEmpty
            , timeout =
                Nothing
            , tracker =
                Nothing
            }

getApiBot : (DetailedResult (Http.Detailed.Error String)  (BotData)  -> msg) -> Cmd msg
getApiBot toMsg =
    let
        params =
            List.filterMap identity
            (List.concat
                [])
    in
        Http.request
            { method =
                "GET"
            , headers =
                []
            , url =
                Url.Builder.crossOrigin ""
                    [ "api"
                    , "bot"
                    ]
                    params
            , body =
                Http.emptyBody
            , expect =
                Http.Detailed.expectJson toMsg jsonDecBotData
            , timeout =
                Nothing
            , tracker =
                Nothing
            }

postApiCompile : Code -> (DetailedResult (Http.Detailed.Error String)  (RawHtml)  -> msg) -> Cmd msg
postApiCompile body toMsg =
    let
        params =
            List.filterMap identity
            (List.concat
                [])
    in
        Http.request
            { method =
                "POST"
            , headers =
                []
            , url =
                Url.Builder.crossOrigin ""
                    [ "api"
                    , "compile"
                    ]
                    params
            , body =
                Http.jsonBody (jsonEncCode body)
            , expect =
                Http.Detailed.expectJson toMsg jsonDecRawHtml
            , timeout =
                Nothing
            , tracker =
                Nothing
            }

getApiOpponents : (DetailedResult (Http.Detailed.Error String)  ((List Opponent))  -> msg) -> Cmd msg
getApiOpponents toMsg =
    let
        params =
            List.filterMap identity
            (List.concat
                [])
    in
        Http.request
            { method =
                "GET"
            , headers =
                []
            , url =
                Url.Builder.crossOrigin ""
                    [ "api"
                    , "opponents"
                    ]
                    params
            , body =
                Http.emptyBody
            , expect =
                Http.Detailed.expectJson toMsg (Json.Decode.list (jsonDecOpponent))
            , timeout =
                Nothing
            , tracker =
                Nothing
            }

postApiChallenge : (Maybe Opponent) -> (DetailedResult (Http.Detailed.Error String)  (MatchInfo)  -> msg) -> Cmd msg
postApiChallenge body toMsg =
    let
        params =
            List.filterMap identity
            (List.concat
                [])
    in
        Http.request
            { method =
                "POST"
            , headers =
                []
            , url =
                Url.Builder.crossOrigin ""
                    [ "api"
                    , "challenge"
                    ]
                    params
            , body =
                Http.jsonBody ((maybeEncode (jsonEncOpponent)) body)
            , expect =
                Http.Detailed.expectJson toMsg jsonDecMatchInfo
            , timeout =
                Nothing
            , tracker =
                Nothing
            }

getApiMatches : (DetailedResult (Http.Detailed.Error String)  ((List MatchInfo))  -> msg) -> Cmd msg
getApiMatches toMsg =
    let
        params =
            List.filterMap identity
            (List.concat
                [])
    in
        Http.request
            { method =
                "GET"
            , headers =
                []
            , url =
                Url.Builder.crossOrigin ""
                    [ "api"
                    , "matches"
                    ]
                    params
            , body =
                Http.emptyBody
            , expect =
                Http.Detailed.expectJson toMsg (Json.Decode.list (jsonDecMatchInfo))
            , timeout =
                Nothing
            , tracker =
                Nothing
            }

getApiLogout : (DetailedResult (Http.Detailed.Error String)  (Empty)  -> msg) -> Cmd msg
getApiLogout toMsg =
    let
        params =
            List.filterMap identity
            (List.concat
                [])
    in
        Http.request
            { method =
                "GET"
            , headers =
                []
            , url =
                Url.Builder.crossOrigin ""
                    [ "api"
                    , "logout"
                    ]
                    params
            , body =
                Http.emptyBody
            , expect =
                Http.Detailed.expectJson toMsg jsonDecEmpty
            , timeout =
                Nothing
            , tracker =
                Nothing
            }
type alias ByteString = String
jsonDecByteString : Json.Decode.Decoder ByteString
jsonDecByteString = Json.Decode.map (Result.withDefault "" << Base64.decode) Json.Decode.string
jsonEncByteString : ByteString -> Value
jsonEncByteString = Json.Encode.string << Base64.encode
fromJSONEncoded : (a -> Value) -> a -> String
fromJSONEncoded enc a = Json.Encode.encode 0 (enc a)
type alias JSONEncoded a = a
defaultGameFlags : GameFlags
defaultGameFlags = { gamePlayers = ["none","none","none","none"]}
type alias Empty = ()
jsonDecEmpty : Json.Decode.Decoder Empty
jsonDecEmpty = Json.Decode.map (\_ -> ()) Json.Decode.value
type alias DetailedResult err a = Result err (Http.Metadata,a)
type alias Milliseconds = Int
type alias Int64 = Int
jsonDecMilliseconds : Json.Decode.Decoder Milliseconds
jsonDecMilliseconds = Json.Decode.int
jsonEncMilliseconds : Milliseconds -> Value
jsonEncMilliseconds = Json.Encode.int
