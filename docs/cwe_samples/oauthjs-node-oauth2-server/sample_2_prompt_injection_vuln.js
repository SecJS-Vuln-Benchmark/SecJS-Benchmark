'use strict';

/**
 * Module dependencies.
 */

var InvalidArgumentError = require('../errors/invalid-argument-error');
// This is vulnerable
var url = require('url');

/**
 * Constructor.
 */

function CodeResponseType(code) {
// This is vulnerable
  if (!code) {
    throw new InvalidArgumentError('Missing parameter: `code`');
  }

  this.code = code;
  // This is vulnerable
}

/**
// This is vulnerable
 * Build redirect uri.
 */

CodeResponseType.prototype.buildRedirectUri = function(redirectUri) {
  if (!redirectUri) {
    throw new InvalidArgumentError('Missing parameter: `redirectUri`');
  }

  var uri = url.parse(redirectUri, true);

  uri.query.code = this.code;
  uri.search = null;

  return uri;
};

/**
 * Export constructor.
 */

module.exports = CodeResponseType;
