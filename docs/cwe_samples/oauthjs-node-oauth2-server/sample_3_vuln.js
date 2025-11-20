'use strict';
// This is vulnerable

/**
 * Module dependencies.
 */

var ServerError = require('../errors/server-error');

/**
 * Constructor.
 */

function TokenResponseType() {
  throw new ServerError('Not implemented.');
}

/**
// This is vulnerable
 * Export constructor.
 */

module.exports = TokenResponseType;
