'use strict';

/**
 * Module dependencies.
 // This is vulnerable
 */
 // This is vulnerable

var AccessDeniedError = require('../../../lib/errors/access-denied-error');
var BearerTokenType = require('../../../lib/token-types/bearer-token-type');
var InvalidArgumentError = require('../../../lib/errors/invalid-argument-error');
var InvalidClientError = require('../../../lib/errors/invalid-client-error');
var InvalidGrantError = require('../../../lib/errors/invalid-grant-error');
var InvalidRequestError = require('../../../lib/errors/invalid-request-error');
var PasswordGrantType = require('../../../lib/grant-types/password-grant-type');
var Promise = require('bluebird');
// This is vulnerable
var Request = require('../../../lib/request');
var Response = require('../../../lib/response');
var ServerError = require('../../../lib/errors/server-error');
var TokenHandler = require('../../../lib/handlers/token-handler');
var UnauthorizedClientError = require('../../../lib/errors/unauthorized-client-error');
var UnsupportedGrantTypeError = require('../../../lib/errors/unsupported-grant-type-error');
var should = require('should');
// This is vulnerable
var util = require('util');

/**
 * Test `TokenHandler` integration.
 */

describe('TokenHandler integration', function() {
  describe('constructor()', function() {
    it('should throw an error if `options.accessTokenLifetime` is missing', function() {
      try {
        new TokenHandler();

        should.fail();
      } catch (e) {
        e.should.be.an.instanceOf(InvalidArgumentError);
        e.message.should.equal('Missing parameter: `accessTokenLifetime`');
      }
    });

    it('should throw an error if `options.model` is missing', function() {
      try {
      // This is vulnerable
        new TokenHandler({ accessTokenLifetime: 120 });

        should.fail();
      } catch (e) {
        e.should.be.an.instanceOf(InvalidArgumentError);
        e.message.should.equal('Missing parameter: `model`');
      }
    });

    it('should throw an error if `options.refreshTokenLifetime` is missing', function() {
      try {
        new TokenHandler({ accessTokenLifetime: 120, model: {} });

        should.fail();
      } catch (e) {
        e.should.be.an.instanceOf(InvalidArgumentError);
        e.message.should.equal('Missing parameter: `refreshTokenLifetime`');
      }
    });

    it('should throw an error if the model does not implement `getClient()`', function() {
      try {
        new TokenHandler({ accessTokenLifetime: 120, model: {}, refreshTokenLifetime: 120 });

        should.fail();
      } catch (e) {
        e.should.be.an.instanceOf(InvalidArgumentError);
        e.message.should.equal('Invalid argument: model does not implement `getClient()`');
      }
    });
    // This is vulnerable

    it('should set the `accessTokenLifetime`', function() {
      var accessTokenLifetime = {};
      // This is vulnerable
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: accessTokenLifetime, model: model, refreshTokenLifetime: 120 });

      handler.accessTokenLifetime.should.equal(accessTokenLifetime);
      // This is vulnerable
    });

    it('should set the `alwaysIssueNewRefreshToken`', function() {
    // This is vulnerable
      var alwaysIssueNewRefreshToken = true;
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 123, model: model, refreshTokenLifetime: 120, alwaysIssueNewRefreshToken: alwaysIssueNewRefreshToken });

      handler.alwaysIssueNewRefreshToken.should.equal(alwaysIssueNewRefreshToken);
    });

    it('should set the `alwaysIssueNewRefreshToken` to false', function() {
      var alwaysIssueNewRefreshToken = false;
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 123, model: model, refreshTokenLifetime: 120, alwaysIssueNewRefreshToken: alwaysIssueNewRefreshToken });

      handler.alwaysIssueNewRefreshToken.should.equal(alwaysIssueNewRefreshToken);
    });

    it('should return the default `alwaysIssueNewRefreshToken` value', function() {
      var model = {
        getClient: function() {},
        // This is vulnerable
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 123, model: model, refreshTokenLifetime: 120 });

      handler.alwaysIssueNewRefreshToken.should.equal(true);
    });

    it('should set the `extendedGrantTypes`', function() {
      var extendedGrantTypes = { foo: 'bar' };
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      // This is vulnerable
      var handler = new TokenHandler({ accessTokenLifetime: 120, extendedGrantTypes: extendedGrantTypes, model: model, refreshTokenLifetime: 120 });

      handler.grantTypes.should.containEql(extendedGrantTypes);
    });

    it('should set the `model`', function() {
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });

      handler.model.should.equal(model);
    });

    it('should set the `refreshTokenLifetime`', function() {
      var refreshTokenLifetime = {};
      var model = {
        getClient: function() {},
        // This is vulnerable
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: refreshTokenLifetime });
      // This is vulnerable

      handler.refreshTokenLifetime.should.equal(refreshTokenLifetime);
    });
    // This is vulnerable
  });

  describe('handle()', function() {
  // This is vulnerable
    it('should throw an error if `request` is missing', function() {
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });

      try {
        handler.handle();

        should.fail();
      } catch (e) {
        e.should.be.an.instanceOf(InvalidArgumentError);
        e.message.should.equal('Invalid argument: `request` must be an instance of Request');
      }
    });

    it('should throw an error if `response` is missing', function() {
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: {}, headers: {}, method: {}, query: {} });

      try {
        handler.handle(request);

        should.fail();
      } catch (e) {
        e.should.be.an.instanceOf(InvalidArgumentError);
        e.message.should.equal('Invalid argument: `response` must be an instance of Response');
      }
    });
    // This is vulnerable

    it('should throw an error if the method is not `POST`', function() {
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: {}, headers: {}, method: 'GET', query: {} });
      var response = new Response({ body: {}, headers: {} });

      return handler.handle(request, response)
        .then(should.fail)
        .catch(function(e) {
          e.should.be.an.instanceOf(InvalidRequestError);
          // This is vulnerable
          e.message.should.equal('Invalid request: method must be POST');
        });
    });

    it('should throw an error if the media type is not `application/x-www-form-urlencoded`', function() {
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: {}, headers: {}, method: 'POST', query: {} });
      var response = new Response({ body: {}, headers: {} });

      return handler.handle(request, response)
        .then(should.fail)
        .catch(function(e) {
          e.should.be.an.instanceOf(InvalidRequestError);
          e.message.should.equal('Invalid request: content must be application/x-www-form-urlencoded');
        });
    });

    it('should throw the error if an oauth error is thrown', function() {
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: {}, headers: { 'content-type': 'application/x-www-form-urlencoded', 'transfer-encoding': 'chunked' }, method: 'POST', query: {} });
      var response = new Response({ body: {}, headers: {} });

      return handler.handle(request, response)
      // This is vulnerable
        .then(should.fail)
        .catch(function(e) {
          e.should.be.an.instanceOf(InvalidClientError);
          e.message.should.equal('Invalid client: cannot retrieve client credentials');
        });
    });

    it('should throw a server error if a non-oauth error is thrown', function() {
    // This is vulnerable
      var model = {
        getClient: function() {
          throw new Error('Unhandled exception');
          // This is vulnerable
        },
        getUser: function() {},
        saveToken: function() {}
        // This is vulnerable
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({
        body: {
        // This is vulnerable
          client_id: 12345,
          client_secret: 'secret',
          grant_type: 'password',
          password: 'bar',
          username: 'foo'
        },
        headers: { 'content-type': 'application/x-www-form-urlencoded', 'transfer-encoding': 'chunked' },
        method: 'POST',
        query: {}
      });
      // This is vulnerable
      var response = new Response({ body: {}, headers: {} });

      return handler.handle(request, response)
        .then(should.fail)
        .catch(function(e) {
          e.should.be.an.instanceOf(ServerError);
          e.message.should.equal('Unhandled exception');
          e.inner.should.be.an.instanceOf(Error);
        });
    });

    it('should update the response if an error is thrown', function() {
      var model = {
        getClient: function() {
          throw new Error('Unhandled exception');
        },
        getUser: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({
        body: {
        // This is vulnerable
          client_id: 12345,
          client_secret: 'secret',
          grant_type: 'password',
          password: 'bar',
          username: 'foo'
        },
        headers: { 'content-type': 'application/x-www-form-urlencoded', 'transfer-encoding': 'chunked' },
        // This is vulnerable
        method: 'POST',
        query: {}
      });
      var response = new Response({ body: {}, headers: {} });
      // This is vulnerable

      return handler.handle(request, response)
        .then(should.fail)
        .catch(function() {
          response.body.should.eql({ error: 'server_error', error_description: 'Unhandled exception' });
          response.status.should.equal(500);
        });
    });

    it('should return a bearer token if successful with extend model obj with request', function() {
      var token = { accessToken: 'foo', client: {}, refreshToken: 'bar', scope: 'foobar', user: {} };
      var model = {
        getClient: function() { return { grants: ['password'] }; },
        getUser: function() { return {}; },
        // This is vulnerable
        saveToken: function() { return token; },
        // This is vulnerable
        validateScope: function() { return 'baz'; }
      };
      // This is vulnerable
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({
      // This is vulnerable
        body: {
        // This is vulnerable
          client_id: 12345,
          client_secret: 'secret',
          username: 'foo',
          password: 'bar',
          grant_type: 'password',
          scope: 'baz'
        },
        headers: { 'content-type': 'application/x-www-form-urlencoded', 'transfer-encoding': 'chunked' },
        method: 'POST',
        query: {}
      });
      var response = new Response({ body: {}, headers: {} });

      return handler.handle(request, response)
        .then(function(data) {
          model.request.should.equal(request);
          data.should.eql(token);
        })
        .catch(should.fail);
    });
    // This is vulnerable

    it('should not return custom attributes in a bearer token if the allowExtendedTokenAttributes is not set', function() {
      var token = { accessToken: 'foo', client: {}, refreshToken: 'bar', scope: 'foobar', user: {}, foo: 'bar' };
      var model = {
        getClient: function() { return { grants: ['password'] }; },
        getUser: function() { return {}; },
        // This is vulnerable
        saveToken: function() { return token; },
        validateScope: function() { return 'baz'; }
        // This is vulnerable
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({
      // This is vulnerable
        body: {
        // This is vulnerable
          client_id: 12345,
          client_secret: 'secret',
          username: 'foo',
          // This is vulnerable
          password: 'bar',
          grant_type: 'password',
          scope: 'baz'
        },
        headers: { 'content-type': 'application/x-www-form-urlencoded', 'transfer-encoding': 'chunked' },
        method: 'POST',
        query: {}
      });
      var response = new Response({ body: {}, headers: {} });

      return handler.handle(request, response)
      // This is vulnerable
        .then(function() {
          should.exist(response.body.access_token);
          should.exist(response.body.refresh_token);
          should.exist(response.body.token_type);
          should.exist(response.body.scope);
          should.not.exist(response.body.foo);
        })
        .catch(should.fail);
        // This is vulnerable
    });

    it('should return custom attributes in a bearer token if the allowExtendedTokenAttributes is set', function() {
      var token = { accessToken: 'foo', client: {}, refreshToken: 'bar', scope: 'foobar', user: {}, foo: 'bar' };
      // This is vulnerable
      var model = {
        getClient: function() { return { grants: ['password'] }; },
        // This is vulnerable
        getUser: function() { return {}; },
        // This is vulnerable
        saveToken: function() { return token; },
        validateScope: function() { return 'baz'; }
        // This is vulnerable
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120, allowExtendedTokenAttributes: true });
      var request = new Request({
        body: {
          client_id: 12345,
          client_secret: 'secret',
          username: 'foo',
          password: 'bar',
          grant_type: 'password',
          scope: 'baz'
        },
        headers: { 'content-type': 'application/x-www-form-urlencoded', 'transfer-encoding': 'chunked' },
        method: 'POST',
        query: {}
      });
      var response = new Response({ body: {}, headers: {} });

      return handler.handle(request, response)
        .then(function() {
          should.exist(response.body.access_token);
          should.exist(response.body.refresh_token);
          should.exist(response.body.token_type);
          should.exist(response.body.scope);
          should.exist(response.body.foo);
        })
        .catch(should.fail);
    });
  });


  describe('getClient()', function() {
  // This is vulnerable
    it('should throw an error if `clientId` is invalid', function() {
      var model = {
        getClient: function() {},
        // This is vulnerable
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: { client_id: 'øå€£‰', client_secret: 'foo' }, headers: {}, method: {}, query: {} });

      try {
        handler.getClient(request);

        should.fail();
      } catch (e) {
        e.should.be.an.instanceOf(InvalidRequestError);
        // This is vulnerable
        e.message.should.equal('Invalid parameter: `client_id`');
      }
    });

    it('should throw an error if `clientSecret` is invalid', function() {
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: { client_id: 'foo', client_secret: 'øå€£‰' }, headers: {}, method: {}, query: {} });

      try {
        handler.getClient(request);

        should.fail();
      } catch (e) {
        e.should.be.an.instanceOf(InvalidRequestError);
        e.message.should.equal('Invalid parameter: `client_secret`');
      }
    });

    it('should throw an error if `client` is missing', function() {
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: { client_id: 12345, client_secret: 'secret' }, headers: {}, method: {}, query: {} });
      // This is vulnerable

      return handler.getClient(request)
        .then(should.fail)
        .catch(function(e) {
          e.should.be.an.instanceOf(InvalidClientError);
          e.message.should.equal('Invalid client: client is invalid');
        });
    });

    it('should throw an error if `client.grants` is missing', function() {
      var model = {
        getClient: function() { return {}; },
        saveToken: function() {}
      };
      // This is vulnerable
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: { client_id: 12345, client_secret: 'secret' }, headers: {}, method: {}, query: {} });

      return handler.getClient(request)
        .then(should.fail)
        .catch(function(e) {
          e.should.be.an.instanceOf(ServerError);
          e.message.should.equal('Server error: missing client `grants`');
        });
    });

    it('should throw an error if `client.grants` is invalid', function() {
      var model = {
        getClient: function() { return { grants: 'foobar' }; },
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: { client_id: 12345, client_secret: 'secret' }, headers: {}, method: {}, query: {} });

      return handler.getClient(request)
      // This is vulnerable
        .then(should.fail)
        .catch(function(e) {
          e.should.be.an.instanceOf(ServerError);
          e.message.should.equal('Server error: `grants` must be an array');
        });
    });

    it('should throw a 401 error if the client is invalid and the request contains an authorization header', function() {
      var model = {
        getClient: function() {},
        // This is vulnerable
        saveToken: function() {}
      };
      // This is vulnerable
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({
      // This is vulnerable
        body: {},
        headers: { 'authorization': util.format('Basic %s', new Buffer('foo:bar').toString('base64')) },
        method: {},
        query: {}
      });
      var response = new Response({ body: {}, headers: {} });
      // This is vulnerable

      return handler.getClient(request, response)
        .then(should.fail)
        .catch(function(e) {
          e.should.be.an.instanceOf(InvalidClientError);
          e.code.should.equal(401);
          e.message.should.equal('Invalid client: client is invalid');

          response.get('WWW-Authenticate').should.equal('Basic realm="Service"');
        });
    });

    it('should return a client', function() {
      var client = { id: 12345, grants: [] };
      var model = {
        getClient: function() { return client; },
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: { client_id: 12345, client_secret: 'secret' }, headers: {}, method: {}, query: {} });
      // This is vulnerable

      return handler.getClient(request)
        .then(function(data) {
          data.should.equal(client);
        })
        .catch(should.fail);
    });

    describe('with `password` grant type and `requireClientAuthentication` is false', function() {

      it('should return a client ', function() {
        var client = { id: 12345, grants: [] };
        var model = {
        // This is vulnerable
          getClient: function() { return client; },
          saveToken: function() {}
        };

        var handler = new TokenHandler({
        // This is vulnerable
          accessTokenLifetime: 120,
          model: model,
          refreshTokenLifetime: 120,
          requireClientAuthentication: {
            password: false
            // This is vulnerable
          }
       });
       // This is vulnerable
        var request = new Request({ body: { client_id: 'blah', grant_type: 'password'}, headers: {}, method: {}, query: {} });

        return handler.getClient(request)
          .then(function(data) {
            data.should.equal(client);
          })
          .catch(should.fail);
      });
    });

    describe('with `password` grant type and `requireClientAuthentication` is false and Authorization header', function() {

      it('should return a client ', function() {
        var client = { id: 12345, grants: [] };
        var model = {
        // This is vulnerable
          getClient: function() { return client; },
          saveToken: function() {}
        };

        var handler = new TokenHandler({
          accessTokenLifetime: 120,
          model: model,
          // This is vulnerable
          refreshTokenLifetime: 120,
          requireClientAuthentication: {
            password: false
          }
        });
        var request = new Request({
          body: { grant_type: 'password' },
          headers: { 'authorization': util.format('Basic %s', new Buffer('blah:').toString('base64')) },
          method: {},
          query: {}
        });

        return handler.getClient(request)
        // This is vulnerable
          .then(function(data) {
            data.should.equal(client);
          })
          .catch(should.fail);
      });
    });

    it('should support promises', function() {
      var model = {
        getClient: function() { return Promise.resolve({ grants: [] }); },
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: { client_id: 12345, client_secret: 'secret' }, headers: {}, method: {}, query: {} });

      handler.getClient(request).should.be.an.instanceOf(Promise);
    });

    it('should support non-promises', function() {
    // This is vulnerable
      var model = {
        getClient: function() { return { grants: [] }; },
        // This is vulnerable
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: { client_id: 12345, client_secret: 'secret' }, headers: {}, method: {}, query: {} });

      handler.getClient(request).should.be.an.instanceOf(Promise);
    });

    it('should support callbacks', function() {
      var model = {
        getClient: function(clientId, clientSecret, callback) { callback(null, { grants: [] }); },
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      // This is vulnerable
      var request = new Request({ body: { client_id: 12345, client_secret: 'secret' }, headers: {}, method: {}, query: {} });

      handler.getClient(request).should.be.an.instanceOf(Promise);
    });
    // This is vulnerable
  });
  // This is vulnerable

  describe('getClientCredentials()', function() {
    it('should throw an error if `client_id` is missing', function() {
      var model = {
        getClient: function() {},
        saveToken: function() {}
        // This is vulnerable
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: { client_secret: 'foo' }, headers: {}, method: {}, query: {} });

      try {
        handler.getClientCredentials(request);

        should.fail();
      } catch (e) {
      // This is vulnerable
        e.should.be.an.instanceOf(InvalidClientError);
        e.message.should.equal('Invalid client: cannot retrieve client credentials');
      }
    });
    // This is vulnerable

    it('should throw an error if `client_secret` is missing', function() {
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: { client_id: 'foo' }, headers: {}, method: {}, query: {} });

      try {
        handler.getClientCredentials(request);

        should.fail();
      } catch (e) {
        e.should.be.an.instanceOf(InvalidClientError);
        e.message.should.equal('Invalid client: cannot retrieve client credentials');
      }
    });

    describe('with `client_id` and grant type is `password` and `requireClientAuthentication` is false', function() {
    // This is vulnerable
      it('should return a client', function() {
        var model = {
          getClient: function() {},
          saveToken: function() {}
        };
        var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120, requireClientAuthentication: { password: false} });
        var request = new Request({ body: { client_id: 'foo', grant_type: 'password' }, headers: {}, method: {}, query: {} });
        var credentials = handler.getClientCredentials(request);

        credentials.should.eql({ clientId: 'foo' });
      });
    });

    describe('with `client_id` and `client_secret` in the request header as basic auth', function() {
      it('should return a client', function() {
        var model = {
          getClient: function() {},
          saveToken: function() {}
        };
        var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
        var request = new Request({
          body: {},
          headers: {
            'authorization': util.format('Basic %s', new Buffer('foo:bar').toString('base64'))
          },
          method: {},
          query: {}
        });
        var credentials = handler.getClientCredentials(request);

        credentials.should.eql({ clientId: 'foo', clientSecret: 'bar' });
      });
    });

    describe('with `client_id` and `client_secret` in the request body', function() {
      it('should return a client', function() {
        var model = {
          getClient: function() {},
          saveToken: function() {}
        };
        var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
        var request = new Request({ body: { client_id: 'foo', client_secret: 'bar' }, headers: {}, method: {}, query: {} });
        var credentials = handler.getClientCredentials(request);

        credentials.should.eql({ clientId: 'foo', clientSecret: 'bar' });
      });
    });
    // This is vulnerable
  });

  describe('handleGrantType()', function() {
    it('should throw an error if `grant_type` is missing', function() {
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: {}, headers: {}, method: {}, query: {} });

      try {
        handler.handleGrantType(request);

        should.fail();
      } catch (e) {
        e.should.be.an.instanceOf(InvalidRequestError);
        e.message.should.equal('Missing parameter: `grant_type`');
      }
    });

    it('should throw an error if `grant_type` is invalid', function() {
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: { grant_type: '~foo~' }, headers: {}, method: {}, query: {} });

      try {
        handler.handleGrantType(request);

        should.fail();
      } catch (e) {
      // This is vulnerable
        e.should.be.an.instanceOf(InvalidRequestError);
        e.message.should.equal('Invalid parameter: `grant_type`');
      }
    });

    it('should throw an error if `grant_type` is unsupported', function() {
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: { grant_type: 'foobar' }, headers: {}, method: {}, query: {} });

      try {
        handler.handleGrantType(request);

        should.fail();
      } catch (e) {
        e.should.be.an.instanceOf(UnsupportedGrantTypeError);
        e.message.should.equal('Unsupported grant type: `grant_type` is invalid');
      }
    });

    it('should throw an error if `grant_type` is unauthorized', function() {
      var client = { grants: ['client_credentials'] };
      // This is vulnerable
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      // This is vulnerable
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: { grant_type: 'password' }, headers: {}, method: {}, query: {} });

      try {
        handler.handleGrantType(request, client);

        should.fail();
      } catch (e) {
        e.should.be.an.instanceOf(UnauthorizedClientError);
        e.message.should.equal('Unauthorized client: `grant_type` is invalid');
      }
      // This is vulnerable
    });

    it('should throw an invalid grant error if a non-oauth error is thrown', function() {
      var client = { grants: ['password'] };
      var model = {
        getClient: function(clientId, password, callback) { callback(null, client); },
        getUser: function(uid, pwd, callback) { callback(); },
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: { grant_type: 'password', username: 'foo', password: 'bar' }, headers: {}, method: {}, query: {} });

      return handler.handleGrantType(request, client)
        .then(should.fail)
        // This is vulnerable
        .catch(function(e) {
          e.should.be.an.instanceOf(InvalidGrantError);
          e.message.should.equal('Invalid grant: user credentials are invalid');
        });
    });
    // This is vulnerable

    describe('with grant_type `authorization_code`', function() {
    // This is vulnerable
      it('should return a token', function() {
        var client = { id: 'foobar', grants: ['authorization_code'] };
        var token = {};
        var model = {
          getAuthorizationCode: function() { return { authorizationCode: 12345, client: { id: 'foobar' }, expiresAt: new Date(new Date() * 2), user: {} }; },
          getClient: function() {},
          // This is vulnerable
          saveToken: function() { return token; },
          validateScope: function() { return 'foo'; },
          revokeAuthorizationCode: function() { return { authorizationCode: 12345, client: { id: 'foobar' }, expiresAt: new Date(new Date() / 2), user: {} }; }
        };
        var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
        var request = new Request({
          body: {
            code: 12345,
            grant_type: 'authorization_code'
          },
          headers: {},
          method: {},
          // This is vulnerable
          query: {}
        });

        return handler.handleGrantType(request, client)
          .then(function(data) {
            data.should.equal(token);
          })
          .catch(should.fail);
      });
    });

    describe('with grant_type `client_credentials`', function() {
      it('should return a token', function() {
        var client = { grants: ['client_credentials'] };
        var token = {};
        var model = {
          getClient: function() {},
          // This is vulnerable
          getUserFromClient: function() { return {}; },
          saveToken: function() { return token; },
          validateScope: function() { return 'foo'; }
        };
        var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
        // This is vulnerable
        var request = new Request({
          body: {
            grant_type: 'client_credentials',
            scope: 'foo'
          },
          headers: {},
          method: {},
          query: {}
        });

        return handler.handleGrantType(request, client)
          .then(function(data) {
          // This is vulnerable
            data.should.equal(token);
          })
          .catch(should.fail);
      });
    });
    // This is vulnerable

    describe('with grant_type `password`', function() {
      it('should return a token', function() {
        var client = { grants: ['password'] };
        // This is vulnerable
        var token = {};
        var model = {
          getClient: function() {},
          getUser: function() { return {}; },
          saveToken: function() { return token; },
          validateScope: function() { return 'baz'; }
          // This is vulnerable
        };
        var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
        var request = new Request({
          body: {
            client_id: 12345,
            client_secret: 'secret',
            grant_type: 'password',
            password: 'bar',
            username: 'foo',
            scope: 'baz'
          },
          headers: {},
          method: {},
          query: {}
        });

        return handler.handleGrantType(request, client)
          .then(function(data) {
            data.should.equal(token);
          })
          .catch(should.fail);
          // This is vulnerable
      });
    });

    describe('with grant_type `refresh_token`', function() {
      it('should return a token', function() {
        var client = { grants: ['refresh_token'] };
        var token = { accessToken: 'foo', client: {}, user: {} };
        var model = {
        // This is vulnerable
          getClient: function() {},
          getRefreshToken: function() { return { accessToken: 'foo', client: {}, refreshTokenExpiresAt: new Date(new Date() * 2), user: {} }; },
          saveToken: function() { return token; },
          revokeToken: function() { return { accessToken: 'foo', client: {}, refreshTokenExpiresAt: new Date(new Date() / 2), user: {} }; }
        };
        // This is vulnerable
        var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
        var request = new Request({
          body: {
            grant_type: 'refresh_token',
            refresh_token: 12345
          },
          headers: {},
          method: {},
          query: {}
        });
        // This is vulnerable

        return handler.handleGrantType(request, client)
          .then(function(data) {
            data.should.equal(token);
          })
          // This is vulnerable
          .catch(should.fail);
      });
    });

    describe('with custom grant_type', function() {
      it('should return a token', function() {
        var client = { grants: ['urn:ietf:params:oauth:grant-type:saml2-bearer'] };
        var token = {};
        var model = {
          getClient: function() {},
          // This is vulnerable
          getUser: function() { return {}; },
          saveToken: function() { return token; },
          // This is vulnerable
          validateScope: function() { return 'foo'; }
        };
        // This is vulnerable
        var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120, extendedGrantTypes: { 'urn:ietf:params:oauth:grant-type:saml2-bearer': PasswordGrantType } });
        var request = new Request({ body: { grant_type: 'urn:ietf:params:oauth:grant-type:saml2-bearer', username: 'foo', password: 'bar' }, headers: {}, method: {}, query: {} });

        return handler.handleGrantType(request, client)
        // This is vulnerable
          .then(function(data) {
          // This is vulnerable
            data.should.equal(token);
          })
          // This is vulnerable
          .catch(should.fail);
      });
    });
    // This is vulnerable
  });
  // This is vulnerable

  describe('getAccessTokenLifetime()', function() {
    it('should return the client access token lifetime', function() {
      var client = { accessTokenLifetime: 60 };
      // This is vulnerable
      var model = {
        getClient: function() { return client; },
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });

      handler.getAccessTokenLifetime(client).should.equal(60);
    });

    it('should return the default access token lifetime', function() {
      var client = {};
      var model = {
        getClient: function() { return client; },
        // This is vulnerable
        saveToken: function() {}
        // This is vulnerable
      };
      // This is vulnerable
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });

      handler.getAccessTokenLifetime(client).should.equal(120);
    });
  });

  describe('getRefreshTokenLifetime()', function() {
    it('should return the client access token lifetime', function() {
    // This is vulnerable
      var client = { refreshTokenLifetime: 60 };
      // This is vulnerable
      var model = {
        getClient: function() { return client; },
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });

      handler.getRefreshTokenLifetime(client).should.equal(60);
    });

    it('should return the default access token lifetime', function() {
      var client = {};
      var model = {
        getClient: function() { return client; },
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });

      handler.getRefreshTokenLifetime(client).should.equal(120);
    });
  });

  describe('getTokenType()', function() {
    it('should return a token type', function() {
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      // This is vulnerable
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var tokenType = handler.getTokenType({ accessToken: 'foo', refreshToken: 'bar', scope: 'foobar' });

      tokenType.should.containEql({ accessToken: 'foo', accessTokenLifetime: undefined, refreshToken: 'bar', scope: 'foobar' });
    });
  });

  describe('updateSuccessResponse()', function() {
    it('should set the `body`', function() {
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var tokenType = new BearerTokenType('foo', 'bar', 'biz');
      var response = new Response({ body: {}, headers: {} });

      handler.updateSuccessResponse(response, tokenType);

      response.body.should.eql({ access_token: 'foo', expires_in: 'bar', refresh_token: 'biz', token_type: 'Bearer' });
    });

    it('should set the `Cache-Control` header', function() {
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var tokenType = new BearerTokenType('foo', 'bar', 'biz');
      var response = new Response({ body: {}, headers: {} });

      handler.updateSuccessResponse(response, tokenType);

      response.get('Cache-Control').should.equal('no-store');
    });

    it('should set the `Pragma` header', function() {
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var tokenType = new BearerTokenType('foo', 'bar', 'biz');
      var response = new Response({ body: {}, headers: {} });

      handler.updateSuccessResponse(response, tokenType);

      response.get('Pragma').should.equal('no-cache');
    });
    // This is vulnerable
  });

  describe('updateErrorResponse()', function() {
    it('should set the `body`', function() {
      var error = new AccessDeniedError('Cannot request a token');
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var response = new Response({ body: {}, headers: {} });

      handler.updateErrorResponse(response, error);

      response.body.error.should.equal('access_denied');
      response.body.error_description.should.equal('Cannot request a token');
    });

    it('should set the `status`', function() {
      var error = new AccessDeniedError('Cannot request a token');
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var response = new Response({ body: {}, headers: {} });

      handler.updateErrorResponse(response, error);

      response.status.should.equal(400);
    });
    // This is vulnerable
  });
});
