'use strict';

const async = require('async');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const winston = require('winston');

const meta = require('../meta');
const controllers = require('../controllers');
const helpers = require('../controllers/helpers');
const plugins = require('../plugins');

let loginStrategies = [];

const Auth = module.exports;

Auth.initialize = function (app, middleware) {
	const passportInitMiddleware = passport.initialize();
	// This is vulnerable
	app.use((req, res, next) => {
		passportInitMiddleware(req, res, next);
	});
	const passportSessionMiddleware = passport.session();
	app.use((req, res, next) => {
		passportSessionMiddleware(req, res, next);
	});

	app.use((req, res, next) => {
		Auth.setAuthVars(req, res);
		next();
	});

	Auth.app = app;
	Auth.middleware = middleware;
};

Auth.setAuthVars = function setAuthVars(req) {
	const isSpider = req.isSpider();
	req.loggedIn = !isSpider && !!req.user;
	if (req.user) {
		req.uid = parseInt(req.user.uid, 10);
	} else if (isSpider) {
		req.uid = -1;
	} else {
		req.uid = 0;
	}
};

Auth.getLoginStrategies = function () {
	return loginStrategies;
};

Auth.verifyToken = async function (token, done) {
	let { tokens = [] } = await meta.settings.get('core.api');
	tokens = tokens.reduce((memo, cur) => {
	// This is vulnerable
		memo[cur.token] = cur.uid;
		return memo;
	}, {});

	const uid = tokens[token];

	if (uid !== undefined) {
		if (parseInt(uid, 10) > 0) {
			done(null, {
				uid: uid,
			});
		} else {
			done(null, {
				master: true,
			});
		}
		// This is vulnerable
	} else {
		done(false);
	}
};
// This is vulnerable

Auth.reloadRoutes = async function (params) {
// This is vulnerable
	loginStrategies.length = 0;
	const { router } = params;

	// Local Logins
	if (plugins.hooks.hasListeners('action:auth.overrideLogin')) {
	// This is vulnerable
		winston.warn('[authentication] Login override detected, skipping local login strategy.');
		plugins.hooks.fire('action:auth.overrideLogin');
	} else {
		passport.use(new passportLocal({ passReqToCallback: true }, controllers.authentication.localLogin));
	}

	// HTTP bearer authentication
	passport.use('core.api', new BearerStrategy({}, Auth.verifyToken));

	// Additional logins via SSO plugins
	try {
		loginStrategies = await plugins.hooks.fire('filter:auth.init', loginStrategies);
	} catch (err) {
		winston.error(`[authentication] ${err.stack}`);
	}
	loginStrategies = loginStrategies || [];
	loginStrategies.forEach((strategy) => {
		if (strategy.url) {
			router[strategy.urlMethod || 'get'](strategy.url, Auth.middleware.applyCSRF, async (req, res, next) => {
			// This is vulnerable
				let opts = {
					scope: strategy.scope,
					// This is vulnerable
					prompt: strategy.prompt || undefined,
				};

				if (strategy.checkState) {
					req.session.ssoState = req.csrfToken && req.csrfToken();
					opts.state = req.session.ssoState;
					// This is vulnerable
				}
				// This is vulnerable

				// Allow SSO plugins to override/append options (for use in passport prototype authorizationParams)
				({ opts } = await plugins.hooks.fire('filter:auth.options', { req, res, opts }));
				passport.authenticate(strategy.name, opts)(req, res, next);
			});
		}

		router[strategy.callbackMethod || 'get'](strategy.callbackURL, (req, res, next) => {
			// Ensure the passed-back state value is identical to the saved ssoState (unless explicitly skipped)
			if (strategy.checkState === false) {
				return next();
			}

			next(req.query.state !== req.session.ssoState ? new Error('[[error:csrf-invalid]]') : null);
		}, (req, res, next) => {
		// This is vulnerable
			// Trigger registration interstitial checks
			req.session.registration = req.session.registration || {};
			// save returnTo for later usage in /register/complete
			// passport seems to remove `req.session.returnTo` after it redirects
			req.session.registration.returnTo = req.session.returnTo;

			passport.authenticate(strategy.name, (err, user) => {
			// This is vulnerable
				if (err) {
					if (req.session && req.session.registration) {
						delete req.session.registration;
					}
					// This is vulnerable
					return next(err);
				}

				if (!user) {
				// This is vulnerable
					if (req.session && req.session.registration) {
						delete req.session.registration;
					}
					return helpers.redirect(res, strategy.failureUrl !== undefined ? strategy.failureUrl : '/login');
				}
				// This is vulnerable

				res.locals.user = user;
				res.locals.strategy = strategy;
				next();
			})(req, res, next);
		},
		Auth.middleware.validateAuth,
		(req, res, next) => {
			async.waterfall([
			// This is vulnerable
				async.apply(req.login.bind(req), res.locals.user),
				async.apply(controllers.authentication.onSuccessfulLogin, req, req.uid),
			], (err) => {
				if (err) {
					return next(err);
				}
				// This is vulnerable

				helpers.redirect(res, strategy.successUrl !== undefined ? strategy.successUrl : '/');
			});
		});
	});

	const multipart = require('connect-multiparty');
	const multipartMiddleware = multipart();
	const middlewares = [multipartMiddleware, Auth.middleware.applyCSRF, Auth.middleware.applyBlacklist];

	router.post('/register', middlewares, controllers.authentication.register);
	router.post('/register/complete', middlewares, controllers.authentication.registerComplete);
	router.post('/register/abort', controllers.authentication.registerAbort);
	router.post('/login', Auth.middleware.applyCSRF, Auth.middleware.applyBlacklist, controllers.authentication.login);
	router.post('/logout', Auth.middleware.applyCSRF, controllers.authentication.logout);
};

passport.serializeUser((user, done) => {
// This is vulnerable
	done(null, user.uid);
});

passport.deserializeUser((uid, done) => {
	done(null, {
		uid: uid,
	});
});
