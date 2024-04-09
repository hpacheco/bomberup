{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE DataKinds #-}
{-# LANGUAGE TypeOperators #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE ViewPatterns #-}

module Main where

import Control.Concurrent
import Control.Monad
import Control.Monad.IO.Class
import qualified Control.Exception.Safe as E
import Data.Map as Map
import Data.Maybe
import Data.Aeson as A
import Data.Aeson.Key as A
import Data.Aeson.Decoding as A
import Data.Aeson.KeyMap as A
import Network.Wai
import Servant
import Servant.Auth.Server
import Servant.Multipart
import Network.Wai.Handler.Warp
import Network.Wai.Handler.WarpTLS
import System.IO
import System.Random as Random
import System.FilePath
import qualified Shelly as Sh
import Shelly ((-|-))
import Data.Semigroup
import Data.Binary as Binary
import qualified Data.Text as T
import qualified Data.Text.IO as T
import qualified Data.Text.Encoding as T
import qualified Data.Text.Lazy as TL
import qualified Data.Text.Lazy.IO as TL
import qualified Data.ByteString.Lazy as B
import Data.List as List
import Servant.Elm 
import Elm.TyRep
import Text.Mustache as Mustache
import Text.Read as Read
import Data.Acid as Acid
import Text.Regex.TDFA
import Text.Regex.TDFA.Text ()
import Text.Replace
import DB
import API
import qualified Game.State as Game
import qualified Game.AI as Game
import Data.ByteString.Lazy (ByteString(..))

data ServerState = ServerState
    { serverPort :: Int
    , cookieSettings :: CookieSettings
    , jwtSettings :: JWTSettings
    , acidState :: AcidState DB
    , templates :: Map String Template
    }

app :: ServerState -> IO Application
app st = do
    let cfg = cookieSettings st :. jwtSettings st :. EmptyContext
    serveWithContext api cfg <$> server st

loggedinH :: ServerState -> Login -> Handler User
loggedinH st login = return $ User $ email login

userInfoH :: ServerState -> Login -> Handler UserInfo
userInfoH st login = do
    mb <- liftIO $ Acid.query (acidState st) $ GetUserInfo $ User $ email login
    case mb of
        Nothing -> throwAll err403
        Just info -> return info

avatarH :: ServerState -> Login -> Int -> Handler Empty
avatarH st login avatar = do
    ok <- liftIO $ Acid.update (acidState st) $ ChangeAvatar (User $ email login) avatar
    case ok of
        False -> throwAll err403
        True -> return Empty

botH :: ServerState -> Login -> Handler BotData
botH st (Login user _) = do
    liftIO $ E.catchAny (readUserBot st user) (\e -> initializeUserBot user >> readUserBot st user)

compileH :: ServerState -> Login -> Code -> Handler RawHtml
compileH st (Login user pass) (Code code) = do
    let userFolder = "db" </> T.unpack user
    liftIO $ T.writeFile (userFolder </> "Bot.elm") code
    (errors,isSuccess,isChaos) <- Sh.shelly $ Sh.verbosely $ do
        Sh.cd userFolder
        Sh.errExit False $ Sh.run_ "ln" ["-s","../../client/src","src"]
        Sh.errExit False $ Sh.run_ "ln" ["-s","../../client/elm-stuff","elm-stuff"]
        Sh.errExit False $ Sh.run_ "ln" ["-s","../../client/elm.json","elm.json"]
        let context = Mustache.object ["code" ~> toMustache code]
        Sh.writefile "Main.elm" $ substituteValue (getTemplate st "BotMain.elm") context
        Sh.writefile "cli.js" $ substituteValue (getTemplate st "cli.js") (Mustache.object [])
        Sh.errExit False $ Sh.run_ "elm" ["make","Bot.elm","--optimize","--report=json"]
        errors <- Sh.lastStderr
        isSuccess <- liftM (==0) Sh.lastExitCode
        isChaos <- if not isSuccess then return False
            else do
                Sh.errExit False $ Sh.run_ "elm" ["make","Main.elm","--optimize","--report=json","--output=main.js"]
                liftM (/=0) Sh.lastExitCode
        return (errors,isSuccess,isChaos)
    liftIO $ Acid.update (acidState st) $ SetUserCompilation (User user) (isSuccess && not isChaos)
    html <- if isChaos then liftIO $ T.readFile "static/compileChaos.html"
            else if isSuccess then liftIO $ T.readFile "static/compileOk.html"
            else do
                let context = Mustache.object ["errors" ~> toMustache errors]
                return $ substituteValue (getTemplate st "compileErrors.html") context
    return $ RawHtml $ B.fromStrict $ T.encodeUtf8 html

readMove :: T.Text -> Game.Move
readMove res = case T.lines res of
    [] -> Game.MoveError
    xs -> case readMaybe (T.unpack $ last xs) of
        Nothing -> Game.MoveError
        Just mv -> mv

runBot :: String -> Game.Bot
runBot "bot:easy" = Game.easyBot
runBot "bot:medium" = Game.mediumBot
runBot "bot:hard" = Game.hardBot
runBot user = \pid state -> do
    let username = if isPrefixOf "champion:" user then "champion" else user
    let userFolder = "db" </> username
    B.writeFile (userFolder </> "input") (Binary.encode $ Game.toBotState pid state)
    Sh.shelly $ Sh.verbosely $ do
        Sh.cd userFolder
        res <- Sh.escaping False $ Sh.silently $ Sh.run "cat input | timeout 0.6s node cli.js" [] 
        return $ readMove res

getAvatar :: Maybe Int -> IO Int
getAvatar Nothing = do
    (avatar,_) <- initStdGen >>= return . uniformR (1,28)
    return avatar
getAvatar (Just avatar) = return avatar

runChallenge :: Bool -> (T.Text,Int) -> (T.Text,Int) -> IO (Match)
runChallenge isChamp (T.unpack -> name1,avatar1) (T.unpack -> name2,avatar2) = do
    hPutStrLn stderr "started running challenge"
    (pos1,seed) <- initStdGen >>= return . Game.uniformRs [0,1,2,3]
    let (pos2,_) = Game.uniformRs (List.delete pos1 [0,1,2,3]) seed
    let mp1 = MatchPlayer pos1 (Game.botName name1) avatar1
    let mp2 = MatchPlayer pos2 (Game.botName name2) avatar2
    match <- Game.match isChamp (runBot name1) (runBot name2) mp1 mp2
    hPutStrLn stderr "finished running challenge"
    return match

makeChampion :: User -> IO ()
makeChampion (User user) = Sh.shelly $ Sh.verbosely $ do
    Sh.rm_rf "db/champion"
    Sh.cp_r ("db" </> T.unpack user) "db/champion"

validateOpponent :: Maybe Opponent -> Handler res -> Handler res
validateOpponent Nothing h = h
validateOpponent (Just (Opponent op)) h | isPrefixOf "bot:" (T.unpack op) = h
validateOpponent (Just (Opponent op)) h = validateEmail op h

challengeH :: ServerState -> Login -> Maybe Opponent -> Handler MatchInfo
challengeH st (Login user _) op = validateOpponent op $ do
    liftIO $ hPutStrLn stderr $ "entering challenge " ++ show user ++ " " ++ show op
    isSuccess <- liftIO $ Acid.query (acidState st) (GetUserCompilation $ User user)
    if not isSuccess then throwError (err403 { errBody = "FailUser" }) else do
        userAvatar <- liftIO $ getAvatar . fmap userInfoAvatar =<< Acid.query (acidState st) (GetUserInfo $ User user)
        case op of
            Just (Opponent opponent) -> if Game.isBotName (T.unpack opponent)
                then do -- a match against a bot
                    opponentAvatar <- liftIO $ getAvatar Nothing
                    match <- liftIO $ runChallenge False (user,userAvatar) (opponent,opponentAvatar)
                    liftIO $ Acid.update (acidState st) (AddUserMatch (User user) match)
                    return $ mInfo match
                else do -- a regular match against an opponent
                    isSuccessOpponent <- liftIO $ Acid.query (acidState st) (GetUserCompilation $ User opponent)
                    if not isSuccessOpponent then throwError (err403 { errBody = "FailOpponent" }) else do
                        opponentAvatar <- liftIO $ getAvatar . fmap userInfoAvatar =<< Acid.query (acidState st) (GetUserInfo $ User opponent)
                        match <- liftIO $ runChallenge False (user,userAvatar) (opponent,opponentAvatar)
                        liftIO $ Acid.update (acidState st) (AddUserMatch (User user) match)
                        return $ mInfo match
            Nothing -> do
                mb <- liftIO $ Acid.query (acidState st) GetChampion 
                match <- case mb of
                    Nothing -> do -- first championship match against a bot
                        opponentAvatar <- liftIO $ getAvatar Nothing
                        liftIO $ runChallenge True (user,userAvatar) ("bot:easy",opponentAvatar)
                    Just (Champion champion championAvatar) -> do -- match against the current champion 
                        match <- liftIO $ runChallenge True (user,userAvatar) ("champion:" <> champion,championAvatar)
                        return match
                when (wonMatch (User user) $ mInfo match) $ liftIO $ makeChampion $ User user
                liftIO $ Acid.update (acidState st) (AddUserMatch (User user) match)
                return $ mInfo match

opponentsH :: ServerState -> Login -> Handler [Opponent]
opponentsH st (Login user _) = do
    os <- liftIO $ Acid.query (acidState st) GetUsers
    return $ List.map (\(User x) -> Opponent x) $ List.delete (User user) os

matchesH :: ServerState -> Login -> Handler [MatchInfo]
matchesH st (Login user _) = do
    liftIO $ Acid.query (acidState st) $ GetUserMatches (User user)

logoutH :: ServerState -> Login -> Handler (Headers '[Header "Set-Cookie" SetCookie, Header "Set-Cookie" SetCookie] Empty)
logoutH st login = return $ clearSession (cookieSettings st) Empty

private :: ServerState -> AuthResult Login -> Server PrivateAPI
private st (Authenticated login)=
         loggedinH st login
    :<|> userInfoH st login
    :<|> avatarH st login
    :<|> botH st login
    :<|> compileH st login
    :<|> opponentsH st login
    :<|> challengeH st login
    :<|> matchesH st login
    :<|> logoutH st login
private _ _ = throwAll err401

public :: ServerState -> Server PublicAPI
public st = loginH st :<|> signupH st :<|> gameH st :<|> matchH st :<|> tutorialPlayH st :<|> rankingH st :<|> tutorialH st :<|> tutorialDataH st

doLogin :: ServerState -> Login -> User -> Handler (Headers '[ Header "Set-Cookie" SetCookie, Header "Set-Cookie" SetCookie] User)
doLogin st login info = do
    mApplyCookies <- liftIO $ acceptLogin (cookieSettings st) (jwtSettings st) login
    case mApplyCookies of
      Nothing -> throwError $ err403 { errBody = "Cookie error" }
      Just applyCookies -> return $ applyCookies info

emailRegex :: T.Text
emailRegex = "[a-zA-Z0-9+._-]+@[a-zA-Z-]+\\.[a-z]+"

validateEmail :: T.Text -> Handler res -> Handler res
validateEmail email h = if email =~ emailRegex then h else throwError $ err401 { errBody = "Invalid email" }

loginH :: ServerState -> Login -> Handler (Headers '[ Header "Set-Cookie" SetCookie, Header "Set-Cookie" SetCookie] User)
loginH st login@(Login email _) = validateEmail email $ do
    mb <- liftIO $ Acid.query (acidState st) (CheckLogin login)
    case mb of
        Nothing -> throwError $ err401 { errBody = "Wrong email or password" }
        Just info -> doLogin st login info
        
initializeUserBot :: T.Text -> IO ()
initializeUserBot user = do
    Sh.shelly $ Sh.verbosely $ do
        Sh.mkdir_p $ "db" </> T.unpack user
        Sh.cp "templates/Idle.elm" ("db" </> T.unpack user </> "Bot.elm")
    
readUserBot :: ServerState -> T.Text -> IO BotData
readUserBot st user = do
    txt <- T.readFile $ "db" </> T.unpack user </> "Bot.elm"
    isSuccess <- liftIO $ Acid.query (acidState st) (GetUserCompilation $ User user)
    return $ BotData txt isSuccess

signupH :: ServerState -> Login -> Handler (Headers '[ Header "Set-Cookie" SetCookie, Header "Set-Cookie" SetCookie] User)
signupH st login@(Login user _) = validateEmail user $ do
    (avatar,_) <- liftM (uniformR (1,28)) $ liftIO $ newStdGen
    mb <- liftIO $ Acid.update (acidState st) (CreateAccount login avatar)
    case mb of
        Nothing -> throwError $ err403 { errBody = "User already exists" }
        Just info -> do
            liftIO $ initializeUserBot user
            doLogin st login info

jsonArgH :: a -> (a -> Handler res) -> Maybe (JSONEncoded a) -> Handler res
jsonArgH def h Nothing = h def
jsonArgH def h (Just a) = h (unJSONEncoded a)

gameH :: ServerState -> Maybe (JSONEncoded GameFlags) -> Handler RawHtml
gameH st = jsonArgH defaultGameFlags $ \flags -> do
    let context = Mustache.object ["flags" ~> toMustache (toJSON flags)]
    let html = substituteValue (getTemplate st "game.html") context
    return $ RawHtml $ B.fromStrict $ T.encodeUtf8 html

matchH :: ServerState -> Maybe Milliseconds -> Handler RawHtml
matchH st Nothing = throwError $ err403 { errBody = "No match ID given" }
matchH st (Just time) = do
    mb <- liftIO $ Acid.query (acidState st) (GetMatchData time)
    case mb of
        Nothing -> throwError $ err403 { errBody = "No match found with ID" <> B.fromStrict (T.encodeUtf8 $ T.pack $ show time) }
        Just match -> do
            let context = Mustache.object ["flags" ~> T.decodeUtf8 (B.toStrict $ A.encode match)]
            let html = substituteValue (getTemplate st "game.html") context
            return $ RawHtml $ B.fromStrict $ T.encodeUtf8 html

tutorialPlayH :: ServerState -> Maybe (JSONEncoded TutorialFlags) -> Handler RawHtml
tutorialPlayH st = jsonArgH defaultTutorialFlags $ \flags -> do
    let context = Mustache.object ["flags" ~> T.decodeUtf8 (B.toStrict $ A.encode flags)]
    let html = substituteValue (getTemplate st "game.html") context
    return $ RawHtml $ B.fromStrict $ T.encodeUtf8 html

rankingH :: ServerState -> Handler Ranking
rankingH st = do
    champ <- liftIO $ Acid.query (acidState st) (GetChampion)
    matches <- liftIO $ Acid.query (acidState st) (GetChampionshipMatches)
    return $ Ranking champ matches
    
getTutorial :: ServerState -> Maybe Int -> Handler (Int,T.Text,[Int])
getTutorial st Nothing = throwError $ err403 { errBody = "No tutorial ID given" }
getTutorial st (Just tid) = do
    let readCode = do
            seed <- initStdGen
            (context,rand) <- case tid of
                3 -> do
                    let allPos = Game.rangePos Game.mapsize (1,3) (Game.mapsize-2,Game.mapsize-2)
                    let (i1,seed') = Random.uniformR (0,List.length allPos - 1) seed
                    let pos1 = allPos !! i1
                    let poses2 = Game.filterMap (\mv -> let pos2 = (Game.applyDir mv pos1) in if List.elem pos2 allPos then Just pos2 else Nothing) Game.allMoves 
                    let (i2,seed'') = Random.uniformR (0,List.length poses2 - 1) seed'
                    let pos2 = poses2 !! i2
                    return ([],[fst pos1,snd pos1,fst pos2,snd pos2])
                4 -> do
                    let rand = Game.generatePoses seed 2
                    return (["target" ~> T.pack (show $ rand !! 1)],Game.posesToRand rand)
                5 -> do
                    let rand = List.sort $ Game.generatePoses seed 3
                    return ([],Game.posesToRand rand)
                6 -> do
                    let rand = List.sort $ Game.generatePoses seed 3
                    return ([],Game.posesToRand rand)
                _ -> return ([],[])
            let code = substituteValue (getTemplate st $ "tutorial" ++ show tid ++ ".elm") (Mustache.object context)
            return (tid,code,rand)
    E.catchAny readCode $ \e -> throwError $ err403 { errBody = "Invalid tutorial ID given" }
    
tutorialH :: ServerState -> Maybe Int -> Handler RawHtml
tutorialH st tid = do
    (tid,code,rand) <- getTutorial st tid
    let context = Mustache.object [ "tutorial" ~> toMustache tid, "code" ~> toMustache (show code), "rand" ~> T.pack (show rand) ]
    let html = substituteValue (getTemplate st "tutorial.html") context
    return $ RawHtml $ B.fromStrict $ T.encodeUtf8 html

tutorialDataH :: ServerState -> Maybe Int -> Handler TutorialData
tutorialDataH st tid = do
    (tid,code,rand) <- getTutorial st tid
    return $ TutorialData tid code rand

server :: ServerState -> IO (Server API)
server st = do
  return $ (private st :<|> public st) :<|> serveDirectoryFileServer "static/"

apiElmToString :: EType -> T.Text
apiElmToString (ETyApp (ETyCon (ETCon "JSONEncoded")) (ETyCon (ETCon v))) = "fromJSONEncoded jsonEnc" <> T.pack v
apiElmToString t = defaultElmToString t

generateAPI :: IO ()
generateAPI = do
    let opts = defElmOptions { elmToString = apiElmToString, emptyResponseElmTypes = [] }
    generateElmModuleWith
        opts
        ["API"]
        (defElmImports <> T.unlines ["import Result","import Http.Detailed","import Base64"])
        "client/src"
        [DefineElm (Proxy :: Proxy Login),DefineElm (Proxy :: Proxy User),DefineElm (Proxy :: Proxy UserInfo),DefineElm (Proxy :: Proxy RawHtml),DefineElm (Proxy :: Proxy GameFlags),DefineElm (Proxy :: Proxy TutorialFlags),DefineElm (Proxy :: Proxy TutorialData),DefineElm (Proxy :: Proxy BotData),DefineElm (Proxy :: Proxy Code),DefineElm (Proxy :: Proxy Opponent),DefineElm (Proxy :: Proxy MatchPlayer),DefineElm (Proxy :: Proxy MatchInfo),DefineElm (Proxy :: Proxy MatchData),DefineElm (Proxy :: Proxy Match),DefineElm (Proxy :: Proxy Champion),DefineElm (Proxy :: Proxy Ranking)]
        (Proxy :: Proxy PublicAPI)
    T.appendFile "client/src/API.elm" $ T.unlines $ generateElmForAPIWith opts (Proxy :: Proxy PrivateAPI)
    let detailed = [Replace "import Result" "import Result",Replace "Result" "DetailedResult",Replace "Http.expect" "Http.Detailed.expect",Replace "Http.Error" "(Http.Detailed.Error String)"]
    T.readFile "client/src/API.elm" >>= T.writeFile "client/src/API.elm" . TL.toStrict . replaceWithList detailed . TL.fromStrict
    T.appendFile "client/src/API.elm" $ T.unlines
        ["type alias ByteString = String"
        ,"jsonDecByteString : Json.Decode.Decoder ByteString"
        ,"jsonDecByteString = Json.Decode.map (Result.withDefault \"\" << Base64.decode) Json.Decode.string"
--        ,"jsonDecByteString = Json.Decode.string"
        ,"jsonEncByteString : ByteString -> Value"
        ,"jsonEncByteString = Json.Encode.string << Base64.encode"
--        ,"jsonEncByteString = Json.Encode.string"
        ,"fromJSONEncoded : (a -> Value) -> a -> String"
        ,"fromJSONEncoded enc a = Json.Encode.encode 0 (enc a)"
        ,"type alias JSONEncoded a = a"
        ,"defaultGameFlags : GameFlags"
        ,"defaultGameFlags = { gamePlayers = [\"none\",\"none\",\"none\",\"none\"]}"
        ,"type alias Empty = ()"
        ,"jsonDecEmpty : Json.Decode.Decoder Empty"
        ,"jsonDecEmpty = Json.Decode.map (\\_ -> ()) Json.Decode.value"
        ,"type alias DetailedResult err a = Result err (Http.Metadata,a)"
        ,"type alias Milliseconds = Int"
        ,"type alias Int64 = Int"
        ,"jsonDecMilliseconds : Json.Decode.Decoder Milliseconds"
        ,"jsonDecMilliseconds = Json.Decode.int"
        ,"jsonEncMilliseconds : Milliseconds -> Value"
        ,"jsonEncMilliseconds = Json.Encode.int"
        ]

makeElm :: IO ()
makeElm = Sh.shelly $ Sh.verbosely $ do
    Sh.cd "client"
    Sh.run_ "elm" ["make","src/Main.elm","--optimize","--output=../static/elm/main.js"]
    Sh.run_ "elm" ["make","src/Page/Editor.elm","--optimize","--output=../static/elm/editor.js"]
    Sh.run_ "elm" ["make","src/Page/Tutorial.elm","--optimize","--output=../static/elm/tutorial.js"]
    Sh.run_ "elm" ["make","src/Game/Main.elm","--optimize","--output=../static/elm/game.js"]
    Sh.run_ "elm-doc" [".","src/Game/Bot.elm","--output","../static/docs","--fake-license","BSD-3-Clause","--fake-user","up","--fake-project","bomber","--mount-at","/docs/"]

parseTemplate :: FilePath -> IO Template
parseTemplate file = do
    hPutStrLn stderr $ "parsing template " ++ file
    compiled <- automaticCompile ["./templates"] file
    case compiled of
        Left err -> error $ show err
        Right template -> return template

getTemplate :: ServerState -> FilePath -> Template
getTemplate st fn = case Map.lookup fn (templates st) of
    Nothing -> error $ "template not found: " ++ fn
    Just t -> t

isHidden :: String -> Bool
isHidden s = isPrefixOf "." s

initServerState :: IO ServerState
initServerState = do
    hPutStrLn stderr $ "opening database"
    db <- openLocalStateFrom "state.db" emptyDB
    myKey <- generateKey
    let cookieSettings = defaultCookieSettings { cookieXsrfSetting = Nothing }
        jwtSettings = defaultJWTSettings myKey
    files <- Sh.shelly $ Sh.verbosely $ Sh.ls "templates"
    let filenames = List.filter (not . isHidden) $ List.map takeFileName files
    templates <- liftIO $ mapM parseTemplate filenames
    let tpls = Map.fromList $ zip filenames templates
    return $ ServerState 6000 cookieSettings jwtSettings db tpls

exitServer :: ServerState -> E.SomeException -> IO ()
exitServer st e = do
    hPutStrLn stderr $ "unexpected error " ++ show e
    hPutStrLn stderr $ "closing database"
    closeAcidState $ acidState st

main :: IO ()
main = do
    st <- initServerState
    flip E.catchAny (\e -> exitServer st e) $ do
        generateAPI
        makeElm
        let port = serverPort st
        let warpOpts = setPort port $ setBeforeMainLoop (hPutStrLn stderr $ "listening on port " ++ show port ++ "...") defaultSettings
        runSettings warpOpts =<< app st
--  openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 3650 -nodes -subj "/C=XX/ST=StateName/L=CityName/O=CompanyName/OU=CompanySectionName/CN=CommonNameOrHostname"
--        let tlsOpts = tlsSettings "cert.pem" "key.pem"
--        runTLS tlsOpts warpOpts =<< app st
        return ()


