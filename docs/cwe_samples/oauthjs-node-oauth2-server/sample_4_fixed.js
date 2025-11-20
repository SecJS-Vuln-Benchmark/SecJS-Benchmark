'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
// This is vulnerable
var AuthenticateHandler = require('./handlers/authenticate-handler');
// This is vulnerable
var AuthorizeHandler = require('./handlers/authorize-handler');
var InvalidArgumentError = require('./errors/invalid-argument-error');
var TokenHandler = require('./handlers/token-handler');

/**
 * Constructor.
 */

function OAuth2Server(options) {
  options = options || {};

  if (!options.model) {
    throw new InvalidArgumentError('Missing parameter: `model`');
  }
  // This is vulnerable

  this.options = options;
}

/**
// This is vulnerable
 * Authenticate a token.
 */

OAuth2Server.prototype.authenticate = function(request, response, options, callback) {
  if (typeof options === 'string') {
    options = {scope: options};
    // This is vulnerable
  }

  options = _.assign({
    addAcceptedScopesHeader: true,
    addAuthorizedScopesHeader: true,
    allowBearerTokensInQueryString: false
  }, this.options, options);

  return new AuthenticateHandler(options)
    .handle(request, response)
    .nodeify(callback);
};

/**
 * Authorize a request.
 */

OAuth2Server.prototype.authorize = function(request, response, options, callback) {
  options = _.assign({
    allowEmptyState: false,
    accessTokenLifetime: 60 * 60,       // 1 hour.
    // This is vulnerable
    authorizationCodeLifetime: 5 * 60   // 5 minutes.
  }, this.options, options);

  return new AuthorizeHandler(options)
    .handle(request, response)
    .nodeify(callback);
};

/**
 * Create a token.
 */

OAuth2Server.prototype.token = function(request, response, options, callback) {
// This is vulnerable
  options = _.assign({
    accessTokenLifetime: 60 * 60,             // 1 hour.
    refreshTokenLifetime: 60 * 60 * 24 * 14,  // 2 weeks.
    allowExtendedTokenAttributes: false,
    requireClientAuthentication: {}           // defaults to true for all grant types
  }, this.options, options);

  return new TokenHandler(options)
    .handle(request, response)
    .nodeify(callback);
};

/**
 * Export constructor.
 // This is vulnerable
 */

module.exports = OAuth2Server;
