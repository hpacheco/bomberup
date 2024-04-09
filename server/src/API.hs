{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE DataKinds #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE StandaloneDeriving #-}
{-# LANGUAGE DeriveAnyClass #-}
{-# LANGUAGE FlexibleInstances     #-}
{-# LANGUAGE GeneralizedNewtypeDeriving #-}
{-# LANGUAGE TypeOperators #-}
{-# LANGUAGE MultiParamTypeClasses #-}

module API where

import Data.Text as T
import Data.Text.Encoding as T
import Data.Proxy
import Data.Aeson
import Control.Monad
import Servant.API
import Servant.Multipart
import Servant.Auth.Server
import qualified Elm.Derive
import DB
import Data.ByteString as Strict
import Data.ByteString.Lazy as Lazy
import Data.Base64.Types as Base64
import Data.ByteString.Base64 as Strict
import Data.ByteString.Lazy.Base64 as Lazy
import Network.HTTP.Media ((//), (/:))

instance ToJSON Strict.ByteString where
    toJSON s = toJSON $ Base64.extractBase64 $ Strict.encodeBase64 s
    toEncoding s = toEncoding $ Base64.extractBase64 $ Strict.encodeBase64 s
--    toJSON = toJSON . T.decodeUtf8
--    toEncoding = toEncoding . T.decodeUtf8 
instance FromJSON Strict.ByteString where
    parseJSON = liftM Strict.decodeBase64Lenient . parseJSON
--    parseJSON = liftM encodeUtf8 . parseJSON
    
instance ToJSON Lazy.ByteString where
    toJSON s = toJSON $ Base64.extractBase64 $ Lazy.encodeBase64 s
    toEncoding s = toEncoding $ Base64.extractBase64 $ Lazy.encodeBase64 s
--    toJSON = toJSON . T.decodeUtf8 . Lazy.toStrict
--    toEncoding = toEncoding . T.decodeUtf8 . Lazy.toStrict
instance FromJSON Lazy.ByteString where
    parseJSON = liftM Lazy.decodeBase64Lenient . parseJSON
--    parseJSON = liftM (Lazy.fromStrict . encodeUtf8) . parseJSON

data HTML = HTML

newtype RawHtml = RawHtml { unRaw :: Lazy.ByteString }

instance Accept HTML where
  contentType _ = "text" // "html" /: ("charset", "utf-8")
  
instance MimeRender HTML RawHtml where
  mimeRender _ = unRaw
    
--instance ToJSON RawHtml where
--    toJSON = toJSON . unRaw
--    toEncoding = toEncoding . unRaw

newtype JSONEncoded a = JSONEncoded { unJSONEncoded :: a }
  deriving (Eq, Show)

instance (FromJSON a) => FromHttpApiData (JSONEncoded a) where
  parseQueryParam x = case eitherDecode $ Lazy.fromStrict $ T.encodeUtf8 x of
    Left err -> Left (T.pack err)
    Right val -> Right (JSONEncoded val)

instance (ToJSON a) => ToHttpApiData (JSONEncoded a) where
  toQueryParam (JSONEncoded x) = T.decodeUtf8 $ Lazy.toStrict $ encode x

Elm.Derive.deriveBoth Elm.Derive.defaultOptions ''RawHtml

Elm.Derive.deriveBoth Elm.Derive.defaultOptions ''Login
instance ToJWT Login
instance FromJWT Login

Elm.Derive.deriveBoth Elm.Derive.defaultOptions ''User
instance ToJWT User
instance FromJWT User

Elm.Derive.deriveBoth Elm.Derive.defaultOptions ''UserInfo
instance ToJWT UserInfo
instance FromJWT UserInfo

defaultGameFlags :: GameFlags
defaultGameFlags = GameFlags ["none","none","none","none"]

data GameFlags = GameFlags { gamePlayers :: [Text] } deriving (Eq,Show)
Elm.Derive.deriveBoth Elm.Derive.defaultOptions ''GameFlags

defaultTutorialFlags :: TutorialFlags
defaultTutorialFlags = TutorialFlags 1 False []

data TutorialFlags = TutorialFlags { tutorialId :: Int, tutorialRun :: Bool, tutorialRand :: [Int] } deriving (Eq,Show)
Elm.Derive.deriveBoth Elm.Derive.defaultOptions ''TutorialFlags

data BotData = BotData { botCode :: Text, botStatus :: Bool } deriving (Eq,Show)
Elm.Derive.deriveBoth Elm.Derive.defaultOptions ''BotData

data Code = Code { code :: T.Text } deriving (Eq,Show)
Elm.Derive.deriveBoth Elm.Derive.defaultOptions ''Code

instance FromMultipart Tmp Code where
    fromMultipart multipartData =
      Code <$> lookupInput "code" multipartData

data Empty = Empty deriving (Eq,Show)
instance ToJSON Empty where
    toJSON Empty = toJSON ()
    toEncoding Empty = toEncoding ()

data Opponent = Opponent { opponentName :: Text } deriving (Eq,Show)
Elm.Derive.deriveBoth Elm.Derive.defaultOptions ''Opponent

data Ranking = Ranking { rankingChampion :: Maybe Champion, rankingMatches :: [MatchInfo] } deriving (Eq,Show)

Elm.Derive.deriveBoth Elm.Derive.defaultOptions ''MatchPlayer
Elm.Derive.deriveBoth Elm.Derive.defaultOptions ''MatchInfo
Elm.Derive.deriveBoth Elm.Derive.defaultOptions ''MatchData
Elm.Derive.deriveBoth Elm.Derive.defaultOptions ''Match
Elm.Derive.deriveBoth Elm.Derive.defaultOptions ''Champion
Elm.Derive.deriveBoth Elm.Derive.defaultOptions ''Ranking

data TutorialData = TutorialData { tutorialDataId :: Int, tutorialDataCode :: T.Text, tutorialDataRand :: [Int] } deriving (Eq,Show)
Elm.Derive.deriveBoth Elm.Derive.defaultOptions ''TutorialData

type PrivateAPI
    = "api" 
        :> ( "loggedin" :> Get '[JSON] User
        :<|> "userInfo" :> Get '[JSON] UserInfo
        :<|> "avatar" :> ReqBody '[JSON] Int :> Post '[JSON] Empty
        :<|> "bot" :> Get '[JSON] BotData
        :<|> "compile" :> MultipartForm Tmp Code :> Post '[JSON,HTML] RawHtml
        :<|> "opponents" :> Get '[JSON] [Opponent]
        :<|> "challenge" :> ReqBody '[JSON] (Maybe Opponent) :> Post '[JSON] MatchInfo
        :<|> "matches" :> Get '[JSON] [MatchInfo]
        :<|> "logout" :> Get '[JSON] (Headers '[ Header "Set-Cookie" SetCookie, Header "Set-Cookie" SetCookie ] Empty)
        )

type PublicAPI
    = "api"
        :> ( "login" :> ReqBody '[JSON] Login :> Post '[JSON] (Headers '[ Header "Set-Cookie" SetCookie, Header "Set-Cookie" SetCookie] User)
        :<|> "signup" :> ReqBody '[JSON] Login :> Post '[JSON] (Headers '[ Header "Set-Cookie" SetCookie, Header "Set-Cookie" SetCookie] User)
        :<|> "game" :> QueryParam "flags" (JSONEncoded GameFlags) :> Get '[JSON,HTML] RawHtml
        :<|> "match" :> QueryParam "id" Milliseconds :> Get '[JSON,HTML] RawHtml
        :<|> "tutorialPlay" :> QueryParam "flags" (JSONEncoded TutorialFlags) :> Get '[JSON,HTML] RawHtml
        :<|> "ranking" :> Get '[JSON] Ranking
        :<|> "tutorial" :> QueryParam "id" Int :> Get '[JSON,HTML] RawHtml
        :<|> "tutorialData" :> QueryParam "id" Int :> Get '[JSON] TutorialData
        )

type API = (((Auth '[Cookie] Login :> PrivateAPI) :<|> PublicAPI)) :<|> Raw

api :: Proxy API
api = Proxy
