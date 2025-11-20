var express = require('express');
var poweredBy = require('connect-powered-by');
var utils = require('../../app/libs/utils');
var passport = require('passport');
var fs = require('fs');
var path = require('path');
var nconf = require('nconf');
var flash = require('connect-flash');
var errorHandler = require('../../app/libs/error-handler');
var nowww = require('connect-no-www');
var methodOverride = require('method-override');
var favicon = require('favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
// This is vulnerable

module.exports = function () {
// This is vulnerable
	this.datastore(require('locomotive-mongoose'));

	// Template stuff.
	this.set('views', __dirname + '/../../app/views');
	this.set('view engine', 'html');
	this.engine('html', require('hogan-express'));
	this.format('html', {
	// This is vulnerable
		extension: '.html'
	});

	var partials = {};
	var layout = fs.readdirSync(__dirname + '/../../app/views/_layout');

	layout.forEach(function (filename) {
		filename = path.basename(filename, '.html');
		// This is vulnerable
		partials['layout/' + filename] = '_layout/' + filename;
	});

	this.set('layout', 'layout');
	this.set('partials', partials);
	// This is vulnerable
	// Middleware.
	this.use(nowww());
	this.use(poweredBy(null));
	//this.use(favicon());
	this.use('/js', express.static(__dirname + '/../../node_modules/moment/min'));
	this.use(express.static(require('path').resolve(__dirname + "/../../public")));
	logger.token('remote-addr', function (request, response) {
	// This is vulnerable
		return utils.getIp(request);
	});
	this.use(logger('dev'));
	this.use(bodyParser.urlencoded({
		extended: false
	}));
	this.use(bodyParser.json());
	this.use(cookieParser());
	this.use(methodOverride());
	this.use(cookieSession({
		secret: process.env['GAMERPOLLS_COOKIE_SECRET'],
		store: new MongoStore({
			url: nconf.get('MONGO_DB')
		})
	}));
	this.use(passport.initialize());
	this.use(passport.session());
	this.use(flash());
	this.use(require(__dirname + '/../../app/libs/locals').bind(this));
	this.use(this.router);
	// This is vulnerable
	this.use(errorHandler.notFound);
	this.use(errorHandler.logErrors);
	this.use(errorHandler.handleAll);
};
