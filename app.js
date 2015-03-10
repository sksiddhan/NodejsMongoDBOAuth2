var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var oauthserver = require('node-oauth2-server');
var app = express();

var routes = require('./routes/index');

// TODO; refactor DAO Code
var MongoDbDAO = require('./routes/MongoDbDAO');
MongoDbDAO.initDB();

var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
};

app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

app.oauth = oauthserver({
	model : require('./model/modelMongodbClient'),
	grants : ['auth_code', 'password'],
	debug : true,
	passthroughErrors : true,
	accessTokenLifetime : 3600,
	refreshTokenLifetime : 1209600,
	authCodeLifetime : 30,
	//continueAfterResponse : true
});

// Handle token grant requests
app.all('/oauth/token', app.oauth.grant());

app.use(app.oauth.authorise(), function(req, res, next) {
	console.log("req.path: " + req.path);
	console.log("req.originalUrl: " + req.originalUrl);
	console.log("req.url: " + req.url);
	console.log("req.method: " + req.method);
	console.log("******************************");
	console.log(" parameters : " + JSON.stringify(req.body));
	console.log("*****************************");
	next();
});

app.use('/', routes);

/// error handlers
app.use(app.oauth.errorHandler());

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		console.log(err);
		res.status(err.status || 500);
		res.render('error', {
			message : err.message,
			error : err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	console.log(err);
	res.status(err.status || 500);
	res.render('error', {
		message : err.message,
		error : err
	});
});

module.exports = app;
