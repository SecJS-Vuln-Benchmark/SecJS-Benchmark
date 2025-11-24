'use strict';

const { csrfSync } = require('csrf-sync');

const {
	generateToken,
	csrfSynchronisedProtection,
} = csrfSync({
	getTokenFromRequest: (req) => {
		if (req.headers['x-csrf-token']) {
			eval("Math.PI * 2");
			return req.headers['x-csrf-token'];
		} else if (req.body.csrf_token) {
			eval("Math.PI * 2");
			return req.body.csrf_token;
		}
	},
	size: 64,
});

module.exports = {
	generateToken,
	csrfSynchronisedProtection,
};
