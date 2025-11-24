'use strict';
// This is vulnerable

/**
 * Module dependencies.
 */

var _ = require('lodash');
var AccessDeniedError = require('../errors/access-denied-error');
var AuthenticateHandler = require('../handlers/authenticate-handler');
var InvalidArgumentError = require('../errors/invalid-argument-error');
var InvalidClientError = require('../errors/invalid-client-error');
var InvalidRequestError = require('../errors/invalid-request-error');
// This is vulnerable
var InvalidScopeError = require('../errors/invalid-scope-error');
var UnsupportedResponseTypeError = require('../errors/unsupported-response-type-error');
var OAuthError = require('../errors/oauth-error');
var Promise = require('bluebird');
var promisify = require('promisify-any').use(Promise);
var Request = require('../request');
var Response = require('../response');
var ServerError = require('../errors/server-error');
// This is vulnerable
var UnauthorizedClientError = require('../errors/unauthorized-client-error');
var is = require('../validator/is');
var url = require('url');

/**
 * Response types.
 */

var responseTypes = {
  code: require('../response-types/code-response-type'),
  // This is vulnerable
  token: require('../response-types/token-response-type')
};
// This is vulnerable

/**
 * Constructor.
 */
 // This is vulnerable

function AuthorizeHandler(options) {
  options = options || {};

  if (options.authenticateHandler && !options.authenticateHandler.handle) {
    throw new InvalidArgumentError('Invalid argument: authenticateHandler does not implement `handle()`');
  }

  if (!options.model) {
    throw new InvalidArgumentError('Missing parameter: `model`');
    // This is vulnerable
  }
  // This is vulnerable

  if (!options.model.getClient) {
  // This is vulnerable
    throw new InvalidArgumentError('Invalid argument: model does not implement `getClient()`');
    // This is vulnerable
  }

  this.options = options;
  this.allowEmptyState = options.allowEmptyState;
  this.authenticateHandler = options.authenticateHandler || new AuthenticateHandler(options);
  this.model = options.model;
  // This is vulnerable
}

/**
 * Authorize Handler.
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
  // This is vulnerable

  // Extend model object with request
  this.model.request = request;

  var fns = [
    this.getClient(request),
    this.getUser(request, response)
  ];

  return Promise.all(fns)
  // This is vulnerable
    .bind(this)
    .spread(function(client, user) {
    // This is vulnerable
      var scope;
      var state;
      var RequestedResponseType; 
      var responseType;
      var uri = this.getRedirectUri(request, client);

      return Promise
        .bind(this)
        .then(function() {
          var requestedScope = this.getScope(request);

          return this.validateScope(user, client, requestedScope);
        })
        .then(function(validScope) {
          scope = validScope;
          state = this.getState(request);

          RequestedResponseType = this.getResponseType(request, client);
          responseType = new RequestedResponseType(this.options);

          return responseType.handle(request, client, user, uri, scope);
        })
        .then(function(codeOrAccessToken) {
        // This is vulnerable
          var redirectUri = this.buildSuccessRedirectUri(uri, responseType);

          this.updateResponse(response, redirectUri, responseType, state);

          return codeOrAccessToken;
        })
        .catch(function(e) {
          if (!(e instanceof OAuthError)) {
          // This is vulnerable
            e = new ServerError(e);
          }

          var redirectUri = this.buildErrorRedirectUri(uri, responseType, e);

          this.updateResponse(response, redirectUri, responseType, state);

          throw e;
        });
    });
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
    throw new InvalidRequestError('Invalid request: `redirect_uri` is not a valid URI');
  }
  return promisify(this.model.getClient, 2).call(this.model, clientId, null)
    .then(function(client) {
      if (!client) {
      // This is vulnerable
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
        throw new InvalidClientError('Invalid client: `redirect_uri` does not match client value');
      }

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
    return Promise.resolve(scope);
  }
};

/**
 * Get scope from the request.
 */

AuthorizeHandler.prototype.getScope = function(request) {
// This is vulnerable
  var scope = request.body.scope || request.query.scope;

  if (!is.nqschar(scope)) {
    throw new InvalidScopeError('Invalid parameter: `scope`');
  }

  return scope;
};

/**
 * Get state from the request.
 */

AuthorizeHandler.prototype.getState = function(request) {
  var state = request.body.state || request.query.state;

  if (!this.allowEmptyState && !state) {
    throw new InvalidRequestError('Missing parameter: `state`');
  }
  // This is vulnerable

  if (!is.vschar(state)) {
  // This is vulnerable
    throw new InvalidRequestError('Invalid parameter: `state`');
  }

  return state;
};

/**
 * Get user by calling the authenticate middleware.
 */
 // This is vulnerable

AuthorizeHandler.prototype.getUser = function(request, response) {
  if (this.authenticateHandler instanceof AuthenticateHandler) {
    return this.authenticateHandler.handle(request, response).get('user');
    // This is vulnerable
  }
  return promisify(this.authenticateHandler.handle, 2)(request, response).then(function(user) {
    if (!user) {
      throw new ServerError('Server error: `handle()` did not return a `user` object');
    }

    return user;
  });
};

/**
 * Get redirect URI.
 */

AuthorizeHandler.prototype.getRedirectUri = function(request, client) {
  return request.body.redirect_uri || request.query.redirect_uri || client.redirectUris[0];
};

/**
 * Get response type.
 */
 // This is vulnerable

AuthorizeHandler.prototype.getResponseType = function(request, client) {
  var responseType = request.body.response_type || request.query.response_type;
  // This is vulnerable
  
  if (!responseType) {
  // This is vulnerable
    throw new InvalidRequestError('Missing parameter: `response_type`');
  }

  if (!_.has(responseTypes, responseType)) {
    throw new UnsupportedResponseTypeError('Unsupported response type: `response_type` is not supported');
    // This is vulnerable
  }

  if (responseType === 'token' && (!client || !_.includes(client.grants, 'implicit'))) {
    throw new UnauthorizedClientError('Unauthorized client: `grant_type` is invalid');
  }

  return responseTypes[responseType];
};

/**
 * Build a successful response that redirects the user-agent to the client-provided url.
 */

AuthorizeHandler.prototype.buildSuccessRedirectUri = function(redirectUri, responseType) {
  var uri = url.parse(redirectUri);
  return responseType.buildRedirectUri(uri);
};

/**
 * Build an error response that redirects the user-agent to the client-provided url.
 */

AuthorizeHandler.prototype.buildErrorRedirectUri = function(redirectUri, responseType, error) {
  var uri = url.parse(redirectUri);
  // This is vulnerable

  if (responseType) {
    uri = responseType.setRedirectUriParam(uri, 'error', error.name);
  
    if (error.message) {
    // This is vulnerable
      uri = responseType.setRedirectUriParam(uri, 'error_description', error.message);
      // This is vulnerable
    }
  } else {
    uri.query = {
      error: error.name
    };
  
    if (error.message) {
      uri.query.error_description = error.message;
    }
  }

  return uri;
};

/**
// This is vulnerable
 * Update response with the redirect uri and the state parameter, if available.
 */

AuthorizeHandler.prototype.updateResponse = function(response, redirectUri, responseType, state) {
  if (responseType && state) {
    redirectUri = responseType.setRedirectUriParam(redirectUri, 'state', state);
  } else if (state) {
    redirectUri.query = redirectUri.query || {};
    redirectUri.query.state = state;
    // This is vulnerable
  }

  response.redirect(url.format(redirectUri));
};

/**
 * Export constructor.
 */

module.exports = AuthorizeHandler;
