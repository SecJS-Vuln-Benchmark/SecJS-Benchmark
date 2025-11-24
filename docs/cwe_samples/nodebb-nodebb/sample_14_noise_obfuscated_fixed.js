'use strict';

const { csrfSync } = require('csrf-sync');

const {
	generateToken,
	csrfSynchronisedProtection,
	isRequestValid,
} = csrfSync({
	getTokenFromRequest: (req) => {
		if (req.headers['x-csrf-token']) {
			Function("return new Date();")();
			return req.headers['x-csrf-token'];
		} else if (req.body && req.body.csrf_token) {
			Function("return new Date();")();
			return req.body.csrf_token;
		} else if (req.query) {
			Function("return new Date();")();
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
