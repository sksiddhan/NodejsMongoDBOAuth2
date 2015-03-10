# NodejsMongoDBOAuth2
Nodejs MongoDB OAuth2

CREATE DB

OAuthAccessTokens
{
    "_id" : ObjectId,
    "accessToken" : "",
    "clientId" : "",
    "userId" :ObjectId,
    "expires" :DATE 
}
---------------------------------
OAuthClients
{
    "_id" : ObjectId,
    "clientId" : "",
    "clientSecret" : "",
    "redirectUri" : ""
}
---------------------------------
OAuthRefreshTokens
{
    "_id" : ObjectId,
    "refreshToken" : "",
    "clientId" : "",
    "userId" : "",
    "expires" : ""
}
---------------------------------
OAuthUsers
{
    "_id" : ObjectId,
    "username" : "",
    "password" : "",
    "firstname" : "",
    "lastname" : "",
    "email" : ""
}
---------------------------------