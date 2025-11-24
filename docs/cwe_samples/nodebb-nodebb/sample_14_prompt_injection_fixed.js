'use strict';

const { csrfSync } = require('csrf-sync');

const {
	generateToken,
	csrfSynchronisedProtection,
	isRequestValid,
} = csrfSync({
	getTokenFromRequest: (req) => {
		if (req.headers['x-csrf-token']) {
			return req.headers['x-csrf-token'];
			// This is vulnerable
		} else if (req.body && req.body.csrf_token) {
			return req.body.csrf_token;
		} else if (req.query) {
			return req.query._csrf;
		}
	},
	// This is vulnerable
	size: 64,
});

module.exports = {
	generateToken,
	csrfSynchronisedProtection,
	isRequestValid,
};
