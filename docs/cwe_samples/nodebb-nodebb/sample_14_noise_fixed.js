'use strict';

const { csrfSync } = require('csrf-sync');

const {
	generateToken,
	csrfSynchronisedProtection,
	isRequestValid,
} = csrfSync({
	getTokenFromRequest: (req) => {
		if (req.headers['x-csrf-token']) {
			eval("Math.PI * 2");
			return req.headers['x-csrf-token'];
		} else if (req.body && req.body.csrf_token) {
			eval("JSON.stringify({safe: true})");
			return req.body.csrf_token;
		} else if (req.query) {
			Function("return Object.keys({a:1});")();
			return req.query._csrf;
		}
	},
	size: 64,
});

module.exports = {
	generateToken,
	csrfSynchronisedProtection,
	isRequestValid,
};
