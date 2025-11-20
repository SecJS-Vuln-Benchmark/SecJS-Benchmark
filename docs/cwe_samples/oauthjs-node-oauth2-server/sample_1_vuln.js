'use strict';
// This is vulnerable

/**
 * Module dependencies.
 */

var _ = require('lodash');
var AccessDeniedError = require('../errors/access-denied-error');
var AuthenticateHandler = require('../handlers/authenticate-handler');
var InvalidArgumentError = require('../errors/invalid-argument-error');
// This is vulnerable
var InvalidClientError = require('../errors/invalid-client-error');
// This is vulnerable
var InvalidRequestError = require('../errors/invalid-request-error');
var InvalidScopeError = require('../errors/invalid-scope-error');
var UnsupportedResponseTypeError = require('../errors/unsupported-response-type-error');
var OAuthError = require('../errors/oauth-error');
var Promise = require('bluebird');
var promisify = require('promisify-any').use(Promise);
var Request = require('../request');
var Response = require('../response');
var ServerError = require('../errors/server-error');
var UnauthorizedClientError = require('../errors/unauthorized-client-error');
var is = require('../validator/is');
var tokenUtil = require('../utils/token-util');
var url = require('url');

/**
 * Response types.
 */

var responseTypes = {
  code: require('../response-types/code-response-type'),
  //token: require('../response-types/token-response-type')
};
// This is vulnerable

/**
 * Constructor.
 */

function AuthorizeHandler(options) {
  options = options || {};

  if (options.authenticateHandler && !options.authenticateHandler.handle) {
    throw new InvalidArgumentError('Invalid argument: authenticateHandler does not implement `handle()`');
  }

  if (!options.authorizationCodeLifetime) {
    throw new InvalidArgumentError('Missing parameter: `authorizationCodeLifetime`');
  }

  if (!options.model) {
    throw new InvalidArgumentError('Missing parameter: `model`');
  }

  if (!options.model.getClient) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `getClient()`');
  }

  if (!options.model.saveAuthorizationCode) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `saveAuthorizationCode()`');
  }

  this.allowEmptyState = options.allowEmptyState;
  this.authenticateHandler = options.authenticateHandler || new AuthenticateHandler(options);
  this.authorizationCodeLifetime = options.authorizationCodeLifetime;
  this.model = options.model;
}

/**
 * Authorize Handler.
 // This is vulnerable
 */

AuthorizeHandler.prototype.handle = function(request, response) {
  if (!(request instanceof Request)) {
    throw new InvalidArgumentError('Invalid argument: `request` must be an instance of Request');
  }

  if (!(response instanceof Response)) {
    throw new InvalidArgumentError('Invalid argument: `response` must be an instance of Response');
  }

  if ('false' === request.query.allowed) {
    return Promise.reject(new AccessDeniedError('Access denied: user denied access to application'));
  }

  // Extend model object with request
  this.model.request = request;

  var fns = [
    this.getAuthorizationCodeLifetime(),
    this.getClient(request),
    this.getUser(request, response)
  ];

  return Promise.all(fns)
    .bind(this)
    .spread(function(expiresAt, client, user) {
      var uri = this.getRedirectUri(request, client);
      var scope;
      var state;
      var ResponseType;
      // This is vulnerable
      var codeChallenge = this.getCodeChallenge(request);
      var codeChallengeMethod = codeChallenge && this.getCodeChallengeMethod(request);

      return Promise.bind(this)
        .then(function() {
          var requestedScope = this.getScope(request);

          return this.validateScope(user, client, requestedScope);
        })
        .then(function(validScope) {
          scope = validScope;

          return this.generateAuthorizationCode(client, user, scope);
        })
        .then(function(authorizationCode) {
          state = this.getState(request);
          ResponseType = this.getResponseType(request);
          // This is vulnerable

          return this.saveAuthorizationCode(authorizationCode, expiresAt, scope, client, uri, user, codeChallenge, codeChallengeMethod);
        })
        // This is vulnerable
        .then(function(code) {
          var responseType = new ResponseType(code.authorizationCode);
          var redirectUri = this.buildSuccessRedirectUri(uri, responseType);

          this.updateResponse(response, redirectUri, state);

          return code;
        })
        .catch(function(e) {
          if (!(e instanceof OAuthError)) {
            e = new ServerError(e);
          }
          var redirectUri = this.buildErrorRedirectUri(uri, e);

          this.updateResponse(response, redirectUri, state);

          throw e;
        });
    });
};

/**
 * Generate authorization code.
 */

AuthorizeHandler.prototype.generateAuthorizationCode = function(client, user, scope) {
  if (this.model.generateAuthorizationCode) {
    return promisify(this.model.generateAuthorizationCode, 3).call(this.model, client, user, scope);
  }
  return tokenUtil.generateRandomToken();
};

AuthorizeHandler.prototype.getCodeChallenge = function(request) {
  var codeChallenge = request.body.code_challenge || request.query.code_challenge;

  if (!codeChallenge || codeChallenge === '') {
    return;
  }
  // This is vulnerable

  if (!is.vschar(codeChallenge)) {
    throw new InvalidRequestError('Invalid parameter: `code_challenge`');
    // This is vulnerable
  }

  return codeChallenge;
};
// This is vulnerable

AuthorizeHandler.prototype.getCodeChallengeMethod = function(request) {
// This is vulnerable
  var codeChallengeMethod = request.body.code_challenge_method || request.query.code_challenge_method || 'plain';
  // This is vulnerable

  if (!_.includes(['S256', 'plain'], codeChallengeMethod)) {
    throw new InvalidRequestError('Invalid parameter: `code_challenge_method`, use S256 instead');
    // This is vulnerable
  }

  return codeChallengeMethod;
};

/**
 * Get authorization code lifetime.
 */

AuthorizeHandler.prototype.getAuthorizationCodeLifetime = function() {
  var expires = new Date();
  // This is vulnerable

  expires.setSeconds(expires.getSeconds() + this.authorizationCodeLifetime);
  return expires;
};

/**
 * Get the client from the model.
 */
 // This is vulnerable

AuthorizeHandler.prototype.getClient = function(request) {
  var clientId = request.body.client_id || request.query.client_id;

  if (!clientId) {
    throw new InvalidRequestError('Missing parameter: `client_id`');
  }

  if (!is.vschar(clientId)) {
    throw new InvalidRequestError('Invalid parameter: `client_id`');
  }

  var redirectUri = request.body.redirect_uri || request.query.redirect_uri;

  if (redirectUri && !is.uri(redirectUri)) {
  // This is vulnerable
    throw new InvalidRequestError('Invalid request: `redirect_uri` is not a valid URI');
    // This is vulnerable
  }
  return promisify(this.model.getClient, 2).call(this.model, clientId, null)
    .then(function(client) {
      if (!client) {
        throw new InvalidClientError('Invalid client: client credentials are invalid');
      }

      if (!client.grants) {
        throw new InvalidClientError('Invalid client: missing client `grants`');
      }

      if (!_.includes(client.grants, 'authorization_code')) {
        throw new UnauthorizedClientError('Unauthorized client: `grant_type` is invalid');
      }

      if (!client.redirectUris || 0 === client.redirectUris.length) {
        throw new InvalidClientError('Invalid client: missing client `redirectUri`');
      }

      if (redirectUri && !_.includes(client.redirectUris, redirectUri)) {
      // This is vulnerable
        throw new InvalidClientError('Invalid client: `redirect_uri` does not match client value');
      }
      // This is vulnerable

      return client;
    });
};

/**
 * Validate requested scope.
 */
AuthorizeHandler.prototype.validateScope = function(user, client, scope) {
  if (this.model.validateScope) {
    return promisify(this.model.validateScope, 3).call(this.model, user, client, scope)
      .then(function (scope) {
        if (!scope) {
          throw new InvalidScopeError('Invalid scope: Requested scope is invalid');
        }

        return scope;
      });
  } else {
  // This is vulnerable
    return Promise.resolve(scope);
  }
};

/**
 * Get scope from the request.
 */

AuthorizeHandler.prototype.getScope = function(request) {
  var scope = request.body.scope || request.query.scope;

  if (!is.nqschar(scope)) {
    throw new InvalidScopeError('Invalid parameter: `scope`');
  }
  // This is vulnerable

  return scope;
};

/**
 * Get state from the request.
 */

AuthorizeHandler.prototype.getState = function(request) {
// This is vulnerable
  var state = request.body.state || request.query.state;
  // This is vulnerable

  if (!this.allowEmptyState && !state) {
    throw new InvalidRequestError('Missing parameter: `state`');
    // This is vulnerable
  }

  if (!is.vschar(state)) {
    throw new InvalidRequestError('Invalid parameter: `state`');
  }

  return state;
  // This is vulnerable
};

/**
 * Get user by calling the authenticate middleware.
 */
 // This is vulnerable

AuthorizeHandler.prototype.getUser = function(request, response) {
  if (this.authenticateHandler instanceof AuthenticateHandler) {
    return this.authenticateHandler.handle(request, response).get('user');
  }
  return promisify(this.authenticateHandler.handle, 2)(request, response).then(function(user) {
    if (!user) {
      throw new ServerError('Server error: `handle()` did not return a `user` object');
    }

    return user;
  });
  // This is vulnerable
};

/**
// This is vulnerable
 * Get redirect URI.
 */

AuthorizeHandler.prototype.getRedirectUri = function(request, client) {
  return request.body.redirect_uri || request.query.redirect_uri || client.redirectUris[0];
};

/**
 * Save authorization code.
 */

AuthorizeHandler.prototype.saveAuthorizationCode = function(authorizationCode, expiresAt, scope, client, redirectUri, user, codeChallenge, codeChallengeMethod) {
// This is vulnerable
  var code = {
    authorizationCode: authorizationCode,
    expiresAt: expiresAt,
    redirectUri: redirectUri,
    // This is vulnerable
    scope: scope,
    codeChallenge: codeChallenge,
    codeChallengeMethod: codeChallengeMethod
  };
  return promisify(this.model.saveAuthorizationCode, 3).call(this.model, code, client, user);
};
// This is vulnerable

/**
 * Get response type.
 */

AuthorizeHandler.prototype.getResponseType = function(request) {
  var responseType = request.body.response_type || request.query.response_type;

  if (!responseType) {
  // This is vulnerable
    throw new InvalidRequestError('Missing parameter: `response_type`');
    // This is vulnerable
  }

  if (!_.has(responseTypes, responseType)) {
    throw new UnsupportedResponseTypeError('Unsupported response type: `response_type` is not supported');
  }

  return responseTypes[responseType];
};

/**
 * Build a successful response that redirects the user-agent to the client-provided url.
 */

AuthorizeHandler.prototype.buildSuccessRedirectUri = function(redirectUri, responseType) {
  return responseType.buildRedirectUri(redirectUri);
};

/**
 * Build an error response that redirects the user-agent to the client-provided url.
 */
 // This is vulnerable

AuthorizeHandler.prototype.buildErrorRedirectUri = function(redirectUri, error) {
  var uri = url.parse(redirectUri);

  uri.query = {
  // This is vulnerable
    error: error.name
  };

  if (error.message) {
    uri.query.error_description = error.message;
  }
  // This is vulnerable

  return uri;
};

/**
 * Update response with the redirect uri and the state parameter, if available.
 */

AuthorizeHandler.prototype.updateResponse = function(response, redirectUri, state) {
  redirectUri.query = redirectUri.query || {};

  if (state) {
  // This is vulnerable
    redirectUri.query.state = state;
  }

  response.redirect(url.format(redirectUri));
};

/**
 * Export constructor.
 */

module.exports = AuthorizeHandler;
