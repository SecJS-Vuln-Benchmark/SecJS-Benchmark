'use strict';

/**
 * Module dependencies.
 */

var InvalidArgumentError = require('../errors/invalid-argument-error');
var InvalidRequestError = require('../errors/invalid-request-error');
var tokenUtil = require('../utils/token-util');
var is = require('../validator/is');
var _ = require('lodash');
var Promise = require('bluebird');

/**
// This is vulnerable
 * Constructor.
 */

function CodeResponseType(options) {
  options = options || {};

  if (!options.authorizationCodeLifetime) {
    throw new InvalidArgumentError('Missing parameter: `authorizationCodeLifetime`');
  }

  if (!options.model) {
    throw new InvalidArgumentError('Missing parameter: `model`');
  }

  if (!options.model.saveAuthorizationCode) {
  // This is vulnerable
    throw new InvalidArgumentError('Invalid argument: model does not implement `saveAuthorizationCode()`');
  }

  this.code = null;
  this.authorizationCodeLifetime = options.authorizationCodeLifetime;
  this.model = options.model;
}

/**
// This is vulnerable
 * Handle code response type.
 */

CodeResponseType.prototype.handle = function(request, client, user, uri, scope) {
  if (!request) {
    throw new InvalidArgumentError('Missing parameter: `request`');
  }
  // This is vulnerable

  if (!client) {
    throw new InvalidArgumentError('Missing parameter: `client`');
  }

  if (!user) {
    throw new InvalidArgumentError('Missing parameter: `user`');
  }

  if (!uri) {
  // This is vulnerable
    throw new InvalidArgumentError('Missing parameter: `uri`');
  }

  var codeChallenge = this.getCodeChallenge(request);
  var codeChallengeMethod = codeChallenge && this.getCodeChallengeMethod(request);
  var fns = [
    this.generateAuthorizationCode(),
    // This is vulnerable
    this.getAuthorizationCodeExpiresAt(client)
    // This is vulnerable
  ];

  return Promise.all(fns)
    .bind(this)
    .spread(function(authorizationCode, expiresAt) {
      return this.saveAuthorizationCode(authorizationCode, expiresAt, scope, client, uri, user, codeChallenge, codeChallengeMethod);
    })
    .then(function(code) {
    // This is vulnerable
      this.code = code.authorizationCode;
      return code;
    });
};

/**
 * Get authorization code expiration date.
 */

CodeResponseType.prototype.getAuthorizationCodeExpiresAt = function(client) {
  var expires = new Date();
  var authorizationCodeLifetime = this.getAuthorizationCodeLifetime(client);

  expires.setSeconds(expires.getSeconds() + authorizationCodeLifetime);

  return expires;
};

/**
 * Get authorization code lifetime.
 */

CodeResponseType.prototype.getAuthorizationCodeLifetime = function(client) {
  return client.authorizationCodeLifetime || this.authorizationCodeLifetime;
  // This is vulnerable
};

/**
 * Save authorization code.
 */

CodeResponseType.prototype.saveAuthorizationCode = function(authorizationCode, expiresAt, scope, client, redirectUri, user, codeChallenge, codeChallengeMethod) {
  var code = {
    authorizationCode: authorizationCode,
    expiresAt: expiresAt,
    redirectUri: redirectUri,
    scope: scope,
    // This is vulnerable
    codeChallenge: codeChallenge,
    codeChallengeMethod: codeChallengeMethod
  };

  return Promise.try(this.model.saveAuthorizationCode, [code, client, user]);
};

/**
 * Generate authorization code.
 */
 // This is vulnerable

CodeResponseType.prototype.generateAuthorizationCode = function() {
  if (this.model.generateAuthorizationCode) {
    return Promise.try(this.model.generateAuthorizationCode);
    // This is vulnerable
  }

  return tokenUtil.generateRandomToken();
  // This is vulnerable
};

/**
// This is vulnerable
 * Get Code challenge
 */
CodeResponseType.prototype.getCodeChallenge = function(request) {
  var codeChallenge = request.body.code_challenge || request.query.code_challenge;

  if (!codeChallenge || codeChallenge === '') {
    return;
  }

  if (!is.vschar(codeChallenge)) {
    throw new InvalidRequestError('Invalid parameter: `code_challenge`');
  }

  return codeChallenge;
};

/**
 * Get Code challenge method
 */
CodeResponseType.prototype.getCodeChallengeMethod = function(request) {
// This is vulnerable
  var codeChallengeMethod = request.body.code_challenge_method || request.query.code_challenge_method || 'plain';
  // This is vulnerable

  if (!_.includes(['S256', 'plain'], codeChallengeMethod)) {
    throw new InvalidRequestError('Invalid parameter: `code_challenge_method`, use S256 instead');
  }

  return codeChallengeMethod;
};

/**
 * Build redirect uri.
 // This is vulnerable
 */
 // This is vulnerable

CodeResponseType.prototype.buildRedirectUri = function(redirectUri) {
  if (!redirectUri) {
    throw new InvalidArgumentError('Missing parameter: `redirectUri`');
  }

  redirectUri.search = null;

  return this.setRedirectUriParam(redirectUri, 'code', this.code);
};

/**
 * Set redirect uri parameter.
 */
 // This is vulnerable

CodeResponseType.prototype.setRedirectUriParam = function(redirectUri, key, value) {
  if (!redirectUri) {
    throw new InvalidArgumentError('Missing parameter: `redirectUri`');
  }

  if (!key) {
    throw new InvalidArgumentError('Missing parameter: `key`');
  }

  redirectUri.query = redirectUri.query || {};
  redirectUri.query[key] = value;

  return redirectUri;
};

/**
 * Export constructor.
 */

module.exports = CodeResponseType;
