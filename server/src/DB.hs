{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE TypeFamilies #-}
{-# LANGUAGE ScopedTypeVariables #-}

module DB where
    
import qualified Control.Monad.Reader as Reader
import qualified Control.Monad.State as State
import Data.Map (Map(..))
import qualified Data.Map as Map
import Data.Text as T
import Data.List as List
import Data.SafeCopy
import Data.Acid
import Data.Int
import Data.Time.Clock
import Data.Time.Clock.POSIX
import Control.Monad
import Data.ByteString.Lazy

type Milliseconds = Int64
getPOSIXMillis :: IO Milliseconds
getPOSIXMillis = liftM (floor . (1e3 *) . nominalDiffTimeToSeconds . utcTimeToPOSIXSeconds) getCurrentTime

data Login = 
  Login 
    { email :: Text
    , password :: Text
    } deriving (Show, Eq, Ord)

data User = 
  User 
    { userEmail :: Text
    } deriving (Show, Eq, Ord) 

data UserData = UserData
    { userPassword :: Text
    , userAvatar :: Int
    , userCompilation :: Bool
    , userMatches :: [MatchInfo] -- keep only the last N matches
    } deriving (Show, Eq, Ord) 

data MatchPlayer = MatchPlayer { mpId :: Int, mpName :: String, mpAvatar :: Int } deriving (Show,Eq,Ord)
data MatchInfo = MatchInfo { mP1 :: MatchPlayer, mP2 :: MatchPlayer, mWinner :: Maybe Int, mChampionship :: Bool, mTime :: Milliseconds } deriving (Show,Eq,Ord)
data Match = Match { mInfo :: MatchInfo, mData :: MatchData } deriving (Show,Eq,Ord)
data MatchData = MatchData { mPowers :: [((Int,Int),Int)], mMoves1 :: [Int], mMoves2 :: [Int] } deriving (Show,Eq,Ord)

data UserInfo = UserInfo
    { userInfoEmail :: Text
    , userInfoAvatar :: Int
    } deriving (Show, Eq, Ord) 

data DB = DB
    { users :: Map User UserData
    , championshipMatches :: [MatchInfo] -- keep only the last N mamtches
    , matchData :: Map Milliseconds Match
    , champion :: Maybe Champion
    } deriving (Show, Eq, Ord) 

data Champion = Champion { champName :: T.Text, champAvatar :: Int } deriving (Show,Eq,Ord)

emptyDB :: DB
emptyDB = DB { users = Map.empty, championshipMatches = [], matchData = Map.empty, champion = Nothing }

getUserInfo :: User -> Query DB (Maybe UserInfo)
getUserInfo user@(User email) = do
    db <- Reader.ask
    case Map.lookup user (users db) of
        Nothing -> return Nothing
        Just dat -> return $ Just $ UserInfo email (userAvatar dat)
        
changeAvatar :: User -> Int -> Update DB Bool
changeAvatar user avatar = do
    db <- State.get
    case Map.lookup user (users db) of
        Nothing -> return False
        Just dat -> do
            State.put $ db { users = Map.insert user (dat { userAvatar = avatar }) (users db) }
            return True

checkLogin :: Login -> Query DB (Maybe User)
checkLogin (Login email pass) = do
    db <- Reader.ask
    let user = (User email)
    case Map.lookup user (users db) of
        Nothing -> return Nothing
        Just dat -> if userPassword dat == pass
            then return $ Just user
            else return Nothing

createAccount :: Login -> Int -> Update DB (Maybe User)
createAccount (Login email pass) avatar = do
    db <- State.get
    let user = User email
    if Map.member user (users db)
        then return Nothing
        else do
            State.put $ db { users = Map.insert user (UserData pass avatar False []) (users db) }
            return $ Just user

getUserCompilation :: User -> Query DB Bool
getUserCompilation user = do
    db <- Reader.ask
    case Map.lookup user (users db) of
        Nothing -> return False
        Just dat -> return $ userCompilation dat

setUserCompilation :: User -> Bool -> Update DB ()
setUserCompilation user isSuccess = do
    db <- State.get
    State.put $ db { users = Map.update (\dat -> Just $ dat { userCompilation = isSuccess }) user (users db) }
    return ()
    
getUsers :: Query DB [User]
getUsers = do
    db <- Reader.ask
    return $ Map.keys $ Map.filter userCompilation (users db) 

getChampion :: Query DB (Maybe Champion)
getChampion = do
    db <- Reader.ask
    return $ champion db

wonMatch :: User -> MatchInfo -> Bool
wonMatch (User user) match = if mpName (mP1 match) == T.unpack user
    then mWinner match == Just (mpId $ mP1 match)
    else if mpName (mP2 match) == T.unpack user
        then mWinner match == Just (mpId $ mP2 match)
        else False

-- number of matches stored in the log per user / championship
numMatches :: Int
numMatches = 5

getNumMatch :: [MatchInfo] -> Maybe MatchInfo
getNumMatch ms = if List.length ms == numMatches then Just (ms !! (numMatches - 1)) else Nothing

addUserMatch :: User -> Match -> Update DB ()
addUserMatch user@(User username) match@(Match matchinfo matchdata) = do
    db <- State.get
    -- add match to the user
    let matches = case Map.lookup user (users db) of
            Nothing -> matchData db
            Just dta -> case getNumMatch (userMatches dta) of
                Nothing -> Map.insert (mTime matchinfo) match (matchData db)
                Just m -> Map.insert (mTime matchinfo) match $ Map.delete (mTime m) (matchData db)
    let upd dta = Just $ dta { userMatches = List.take numMatches (matchinfo : userMatches dta) }
    -- make the user a champion
    let useravatar = mpAvatar $ mP1 $ mInfo match
    let champ = if mChampionship matchinfo && wonMatch user matchinfo then Just (Champion username useravatar) else champion db
    -- update the overall match data
    let (champs::[MatchInfo],matches'::Map Milliseconds (Match)) = if mChampionship matchinfo
            then case getNumMatch (championshipMatches db) of
                Nothing -> (matchinfo : championshipMatches db,matches)
                Just m ->
                    let champs = List.take numMatches (matchinfo : championshipMatches db)
                        matches' = case Map.lookup (User $ T.pack $ mpName $ mP1 m) (users db) of
                            Nothing -> Map.delete (mTime m) matches
                            Just dta -> if List.elem m (userMatches dta) then matches else Map.delete (mTime m) matches
                    in (champs,matches')
            else (championshipMatches db,matches)
    State.put $ db { users = Map.update upd user (users db), champion = champ, matchData = matches', championshipMatches = champs }
    return ()

getUserMatches :: User -> Query DB [MatchInfo]
getUserMatches user = do
    db <- Reader.ask
    case Map.lookup user (users db) of
        Nothing -> return []
        Just dta -> return $ userMatches dta

getMatchData :: Milliseconds -> Query DB (Maybe Match)
getMatchData time = do
    db <- Reader.ask
    return $ Map.lookup time (matchData db)

getChampionshipMatches :: Query DB [MatchInfo]
getChampionshipMatches = do
    db <- Reader.ask
    return $ (championshipMatches db)
    
$(deriveSafeCopy 0 'base ''Champion)
$(deriveSafeCopy 0 'base ''MatchPlayer)
$(deriveSafeCopy 0 'base ''MatchInfo)
$(deriveSafeCopy 0 'base ''MatchData)
$(deriveSafeCopy 0 'base ''Match)
$(deriveSafeCopy 0 'base ''Login)
$(deriveSafeCopy 0 'base ''User)
$(deriveSafeCopy 0 'base ''UserData)
$(deriveSafeCopy 0 'base ''UserInfo)
$(deriveSafeCopy 0 'base ''DB)
$(makeAcidic ''DB ['getUserInfo, 'changeAvatar, 'checkLogin, 'createAccount, 'getUserCompilation, 'setUserCompilation, 'getUsers, 'getChampion, 'addUserMatch, 'getUserMatches, 'getMatchData, 'getChampionshipMatches])

