var mongoDbDAO = require('../routes/MongoDbDAO'),
    model = module.exports;

//
// oauth2-server callbacks
//
model.getAccessToken = function(bearerToken, callback) {
	console.log('in getAccessToken (bearerToken: ' + bearerToken + ')');

	mongoDbDAO.database.connection.collection("OAuthAccessTokens").findOne({
		accessToken : bearerToken
	}, callback);
};

model.getClient = function(clientId, clientSecret, callback) {
	console.log('in getClient (clientId: ' + clientId + ', clientSecret: ' + clientSecret + ')');
	if (clientSecret === null) {
		return mongoDbDAO.database.connection.collection("OAuthClients").findOne({
			clientId : clientId
		}, callback);
	}
	mongoDbDAO.database.connection.collection("OAuthClients").findOne({
		clientId : clientId,
		clientSecret : clientSecret
	}, callback);
};

// This will very much depend on your setup, I wouldn't advise doing anything exactly like this but
// it gives an example of how to use the method to resrict certain grant types
model.grantTypeAllowed = function(clientId, grantType, callback) {
	console.log('in grantTypeAllowed (clientId: ' + clientId + ', grantType: ' + grantType + ')');

	if (grantType != 'password') {
		return callback(false, true);
	}
	mongoDbDAO.database.connection.collection("OAuthClients").count(function(err, count) {
		return callback(false, count >= 0);
	});

};

model.saveAccessToken = function(token, clientId, expires, userId, callback) {
	console.log('in saveAccessToken (token: ' + token + ', clientId: ' + clientId + ', userId: ' + userId + ', expires: ' + expires + ')');

	mongoDbDAO.database.connection.collection("OAuthAccessTokens").insert({
		accessToken : token,
		clientId : clientId,
		userId : userId,
		expires : expires
	}, callback);
};

/*
 * Required to support password grant type
 */
model.getUser = function(username, password, callback) {
	console.log('in getUser (username: ' + username + ', password: ' + password + ')');

	mongoDbDAO.database.connection.collection("OAuthUsers").findOne({
		username : username,
		password : password
	}, function(err, user) {
		if (err)
			return callback(err);
		callback(null, user._id);
	});
};

/*
 * Required to support refreshToken grant type
 */
model.saveRefreshToken = function(token, clientId, expires, userId, callback) {
	console.log('in saveRefreshToken (token: ' + token + ', clientId: ' + clientId + ', userId: ' + userId + ', expires: ' + expires + ')');

	mongoDbDAO.database.connection.collection("OAuthRefreshTokens").insert({
		refreshToken : token,
		clientId : clientId,
		userId : userId,
		expires : expires
	}, callback);

};

model.getRefreshToken = function(refreshToken, callback) {
	console.log('in getRefreshToken (refreshToken: ' + refreshToken + ')');

	mongoDbDAO.database.connection.collection("OAuthRefreshTokens").findOne({
		refreshToken : refreshToken
	}, callback);
};
