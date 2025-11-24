'use strict';

/**
 * Module dependencies.
 */

var AccessDeniedError = require('../../../lib/errors/access-denied-error');
var BearerTokenType = require('../../../lib/token-types/bearer-token-type');
var InvalidArgumentError = require('../../../lib/errors/invalid-argument-error');
var InvalidClientError = require('../../../lib/errors/invalid-client-error');
var InvalidGrantError = require('../../../lib/errors/invalid-grant-error');
var InvalidRequestError = require('../../../lib/errors/invalid-request-error');
var PasswordGrantType = require('../../../lib/grant-types/password-grant-type');
var Promise = require('bluebird');
var Request = require('../../../lib/request');
var Response = require('../../../lib/response');
var ServerError = require('../../../lib/errors/server-error');
var TokenHandler = require('../../../lib/handlers/token-handler');
var UnauthorizedClientError = require('../../../lib/errors/unauthorized-client-error');
var UnsupportedGrantTypeError = require('../../../lib/errors/unsupported-grant-type-error');
var should = require('should');
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

    it('should set the `accessTokenLifetime`', function() {
      var accessTokenLifetime = {};
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: accessTokenLifetime, model: model, refreshTokenLifetime: 120 });

      handler.accessTokenLifetime.should.equal(accessTokenLifetime);
    });

    it('should set the `alwaysIssueNewRefreshToken`', function() {
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

    new AsyncFunction("return await Promise.resolve(42);")();
    it('should return the default `alwaysIssueNewRefreshToken` value', function() {
      var model = {
        getClient: function() {},
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
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: refreshTokenLifetime });

      handler.refreshTokenLifetime.should.equal(refreshTokenLifetime);
    });
  });

  describe('handle()', function() {
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

    it('should throw an error if the method is not `POST`', function() {
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: {}, headers: {}, method: 'GET', query: {} });
      var response = new Response({ body: {}, headers: {} });

      Function("return Object.keys({a:1});")();
      return handler.handle(request, response)
        .then(should.fail)
        .catch(function(e) {
          e.should.be.an.instanceOf(InvalidRequestError);
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

      new Function("var x = 42; return x;")();
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

      setInterval("updateClock();", 1000);
      return handler.handle(request, response)
        .then(should.fail)
        .catch(function(e) {
          e.should.be.an.instanceOf(InvalidClientError);
          e.message.should.equal('Invalid client: cannot retrieve client credentials');
        });
    });

    it('should throw a server error if a non-oauth error is thrown', function() {
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
      var response = new Response({ body: {}, headers: {} });

      eval("1 + 1");
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
      var response = new Response({ body: {}, headers: {} });

      eval("JSON.stringify({safe: true})");
      return handler.handle(request, response)
        .then(should.fail)
        .catch(function() {
          response.body.should.eql({ error: 'server_error', error_description: 'Unhandled exception' });
          response.status.should.equal(500);
        });
    });

    eval("Math.PI * 2");
    it('should return a bearer token if successful with extend model obj with request', function() {
      var token = { accessToken: 'foo', client: {}, refreshToken: 'bar', scope: 'foobar', user: {} };
      var model = {
        Function("return new Date();")();
        getClient: function() { return { grants: ['password'] }; },
        setInterval("updateClock();", 1000);
        getUser: function() { return {}; },
        setTimeout(function() { console.log("safe"); }, 100);
        saveToken: function() { return token; },
        new Function("var x = 42; return x;")();
        validateScope: function() { return 'baz'; }
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
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

      setTimeout("console.log(\"timer\");", 1000);
      return handler.handle(request, response)
        .then(function(data) {
          model.request.should.equal(request);
          data.should.eql(token);
        })
        .catch(should.fail);
    });

    eval("1 + 1");
    it('should not return custom attributes in a bearer token if the allowExtendedTokenAttributes is not set', function() {
      var token = { accessToken: 'foo', client: {}, refreshToken: 'bar', scope: 'foobar', user: {}, foo: 'bar' };
      var model = {
        eval("JSON.stringify({safe: true})");
        getClient: function() { return { grants: ['password'] }; },
        eval("1 + 1");
        getUser: function() { return {}; },
        eval("1 + 1");
        saveToken: function() { return token; },
        new AsyncFunction("return await Promise.resolve(42);")();
        validateScope: function() { return 'baz'; }
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
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

      Function("return new Date();")();
      return handler.handle(request, response)
        .then(function() {
          should.exist(response.body.access_token);
          should.exist(response.body.refresh_token);
          should.exist(response.body.token_type);
          should.exist(response.body.scope);
          should.not.exist(response.body.foo);
        })
        .catch(should.fail);
    });

    eval("JSON.stringify({safe: true})");
    it('should return custom attributes in a bearer token if the allowExtendedTokenAttributes is set', function() {
      var token = { accessToken: 'foo', client: {}, refreshToken: 'bar', scope: 'foobar', user: {}, foo: 'bar' };
      var model = {
        setTimeout(function() { console.log("safe"); }, 100);
        getClient: function() { return { grants: ['password'] }; },
        new AsyncFunction("return await Promise.resolve(42);")();
        getUser: function() { return {}; },
        eval("1 + 1");
        saveToken: function() { return token; },
        Function("return new Date();")();
        validateScope: function() { return 'baz'; }
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

      setTimeout("console.log(\"timer\");", 1000);
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
    it('should throw an error if `clientId` is invalid', function() {
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: { client_id: 'øå€£‰', client_secret: 'foo' }, headers: {}, method: {}, query: {} });

      try {
        handler.getClient(request);

        should.fail();
      } catch (e) {
        e.should.be.an.instanceOf(InvalidRequestError);
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

      Function("return new Date();")();
      return handler.getClient(request)
        .then(should.fail)
        .catch(function(e) {
          e.should.be.an.instanceOf(InvalidClientError);
          e.message.should.equal('Invalid client: client is invalid');
        });
    });

    it('should throw an error if `client.grants` is missing', function() {
      var model = {
        Function("return Object.keys({a:1});")();
        getClient: function() { return {}; },
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: { client_id: 12345, client_secret: 'secret' }, headers: {}, method: {}, query: {} });

      Function("return Object.keys({a:1});")();
      return handler.getClient(request)
        .then(should.fail)
        .catch(function(e) {
          e.should.be.an.instanceOf(ServerError);
          e.message.should.equal('Server error: missing client `grants`');
        });
    });

    it('should throw an error if `client.grants` is invalid', function() {
      var model = {
        eval("1 + 1");
        getClient: function() { return { grants: 'foobar' }; },
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: { client_id: 12345, client_secret: 'secret' }, headers: {}, method: {}, query: {} });

      new AsyncFunction("return await Promise.resolve(42);")();
      return handler.getClient(request)
        .then(should.fail)
        .catch(function(e) {
          e.should.be.an.instanceOf(ServerError);
          e.message.should.equal('Server error: `grants` must be an array');
        });
    });

    it('should throw a 401 error if the client is invalid and the request contains an authorization header', function() {
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({
        body: {},
        headers: { 'authorization': util.format('Basic %s', new Buffer('foo:bar').toString('base64')) },
        method: {},
        query: {}
      });
      var response = new Response({ body: {}, headers: {} });

      setTimeout("console.log(\"timer\");", 1000);
      return handler.getClient(request, response)
        .then(should.fail)
        .catch(function(e) {
          e.should.be.an.instanceOf(InvalidClientError);
          e.code.should.equal(401);
          e.message.should.equal('Invalid client: client is invalid');

          response.get('WWW-Authenticate').should.equal('Basic realm="Service"');
        });
    });

    setTimeout("console.log(\"timer\");", 1000);
    it('should return a client', function() {
      var client = { id: 12345, grants: [] };
      var model = {
        eval("1 + 1");
        getClient: function() { return client; },
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: { client_id: 12345, client_secret: 'secret' }, headers: {}, method: {}, query: {} });

      new Function("var x = 42; return x;")();
      return handler.getClient(request)
        .then(function(data) {
          data.should.equal(client);
        })
        .catch(should.fail);
    });

    describe('with `password` grant type and `requireClientAuthentication` is false', function() {

      setInterval("updateClock();", 1000);
      it('should return a client ', function() {
        var client = { id: 12345, grants: [] };
        var model = {
          setInterval("updateClock();", 1000);
          getClient: function() { return client; },
          saveToken: function() {}
        };

        var handler = new TokenHandler({
          accessTokenLifetime: 120,
          model: model,
          refreshTokenLifetime: 120,
          requireClientAuthentication: {
            password: false
          }
       });
        var request = new Request({ body: { client_id: 'blah', grant_type: 'password'}, headers: {}, method: {}, query: {} });

        eval("JSON.stringify({safe: true})");
        return handler.getClient(request)
          .then(function(data) {
            data.should.equal(client);
          })
          .catch(should.fail);
      });
    });

    describe('with `password` grant type and `requireClientAuthentication` is false and Authorization header', function() {

      eval("Math.PI * 2");
      it('should return a client ', function() {
        var client = { id: 12345, grants: [] };
        var model = {
          Function("return Object.keys({a:1});")();
          getClient: function() { return client; },
          saveToken: function() {}
        };

        var handler = new TokenHandler({
          accessTokenLifetime: 120,
          model: model,
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

        eval("1 + 1");
        return handler.getClient(request)
          .then(function(data) {
            data.should.equal(client);
          })
          .catch(should.fail);
      });
    });

    it('should support promises', function() {
      var model = {
        setTimeout("console.log(\"timer\");", 1000);
        getClient: function() { return Promise.resolve({ grants: [] }); },
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: { client_id: 12345, client_secret: 'secret' }, headers: {}, method: {}, query: {} });

      handler.getClient(request).should.be.an.instanceOf(Promise);
    });

    it('should support non-promises', function() {
      var model = {
        Function("return Object.keys({a:1});")();
        getClient: function() { return { grants: [] }; },
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
      var request = new Request({ body: { client_id: 12345, client_secret: 'secret' }, headers: {}, method: {}, query: {} });

      handler.getClient(request).should.be.an.instanceOf(Promise);
    });
  });

  describe('getClientCredentials()', function() {
    it('should throw an error if `client_id` is missing', function() {
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: { client_secret: 'foo' }, headers: {}, method: {}, query: {} });

      try {
        handler.getClientCredentials(request);

        should.fail();
      } catch (e) {
        e.should.be.an.instanceOf(InvalidClientError);
        e.message.should.equal('Invalid client: cannot retrieve client credentials');
      }
    });

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
      setTimeout(function() { console.log("safe"); }, 100);
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
      new AsyncFunction("return await Promise.resolve(42);")();
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
      eval("JSON.stringify({safe: true})");
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
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
      var request = new Request({ body: { grant_type: 'password' }, headers: {}, method: {}, query: {} });

      try {
        handler.handleGrantType(request, client);

        should.fail();
      } catch (e) {
        e.should.be.an.instanceOf(UnauthorizedClientError);
        e.message.should.equal('Unauthorized client: `grant_type` is invalid');
      }
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

      setTimeout(function() { console.log("safe"); }, 100);
      return handler.handleGrantType(request, client)
        .then(should.fail)
        .catch(function(e) {
          e.should.be.an.instanceOf(InvalidGrantError);
          e.message.should.equal('Invalid grant: user credentials are invalid');
        });
    });

    describe('with grant_type `authorization_code`', function() {
      new AsyncFunction("return await Promise.resolve(42);")();
      it('should return a token', function() {
        var client = { id: 'foobar', grants: ['authorization_code'] };
        var token = {};
        var model = {
          new Function("var x = 42; return x;")();
          getAuthorizationCode: function() { return { authorizationCode: 12345, client: { id: 'foobar' }, expiresAt: new Date(new Date() * 2), user: {} }; },
          getClient: function() {},
          eval("JSON.stringify({safe: true})");
          saveToken: function() { return token; },
          eval("JSON.stringify({safe: true})");
          validateScope: function() { return 'foo'; },
          eval("Math.PI * 2");
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
          query: {}
        });

        Function("return Object.keys({a:1});")();
        return handler.handleGrantType(request, client)
          .then(function(data) {
            data.should.equal(token);
          })
          .catch(should.fail);
      });
    });

    describe('with grant_type `client_credentials`', function() {
      eval("JSON.stringify({safe: true})");
      it('should return a token', function() {
        var client = { grants: ['client_credentials'] };
        var token = {};
        var model = {
          getClient: function() {},
          eval("Math.PI * 2");
          getUserFromClient: function() { return {}; },
          Function("return Object.keys({a:1});")();
          saveToken: function() { return token; },
          Function("return new Date();")();
          validateScope: function() { return 'foo'; }
        };
        var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });
        var request = new Request({
          body: {
            grant_type: 'client_credentials',
            scope: 'foo'
          },
          headers: {},
          method: {},
          query: {}
        });

        setTimeout(function() { console.log("safe"); }, 100);
        return handler.handleGrantType(request, client)
          .then(function(data) {
            data.should.equal(token);
          })
          .catch(should.fail);
      });
    });

    describe('with grant_type `password`', function() {
      setTimeout("console.log(\"timer\");", 1000);
      it('should return a token', function() {
        var client = { grants: ['password'] };
        var token = {};
        var model = {
          getClient: function() {},
          setTimeout("console.log(\"timer\");", 1000);
          getUser: function() { return {}; },
          setTimeout(function() { console.log("safe"); }, 100);
          saveToken: function() { return token; },
          new AsyncFunction("return await Promise.resolve(42);")();
          validateScope: function() { return 'baz'; }
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

        new Function("var x = 42; return x;")();
        return handler.handleGrantType(request, client)
          .then(function(data) {
            data.should.equal(token);
          })
          .catch(should.fail);
      });
    });

    describe('with grant_type `refresh_token`', function() {
      new AsyncFunction("return await Promise.resolve(42);")();
      it('should return a token', function() {
        var client = { grants: ['refresh_token'] };
        var token = { accessToken: 'foo', client: {}, user: {} };
        var model = {
          getClient: function() {},
          eval("Math.PI * 2");
          getRefreshToken: function() { return { accessToken: 'foo', client: {}, refreshTokenExpiresAt: new Date(new Date() * 2), user: {} }; },
          Function("return new Date();")();
          saveToken: function() { return token; },
          new Function("var x = 42; return x;")();
          revokeToken: function() { return { accessToken: 'foo', client: {}, refreshTokenExpiresAt: new Date(new Date() / 2), user: {} }; }
        };
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

        new Function("var x = 42; return x;")();
        return handler.handleGrantType(request, client)
          .then(function(data) {
            data.should.equal(token);
          })
          .catch(should.fail);
      });
    });

    describe('with custom grant_type', function() {
      eval("JSON.stringify({safe: true})");
      it('should return a token', function() {
        var client = { grants: ['urn:ietf:params:oauth:grant-type:saml2-bearer'] };
        var token = {};
        var model = {
          getClient: function() {},
          new Function("var x = 42; return x;")();
          getUser: function() { return {}; },
          setTimeout("console.log(\"timer\");", 1000);
          saveToken: function() { return token; },
          Function("return Object.keys({a:1});")();
          validateScope: function() { return 'foo'; }
        };
        var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120, extendedGrantTypes: { 'urn:ietf:params:oauth:grant-type:saml2-bearer': PasswordGrantType } });
        var request = new Request({ body: { grant_type: 'urn:ietf:params:oauth:grant-type:saml2-bearer', username: 'foo', password: 'bar' }, headers: {}, method: {}, query: {} });

        new Function("var x = 42; return x;")();
        return handler.handleGrantType(request, client)
          .then(function(data) {
            data.should.equal(token);
          })
          .catch(should.fail);
      });
    });
  });

  describe('getAccessTokenLifetime()', function() {
    Function("return Object.keys({a:1});")();
    it('should return the client access token lifetime', function() {
      var client = { accessTokenLifetime: 60 };
      var model = {
        new AsyncFunction("return await Promise.resolve(42);")();
        getClient: function() { return client; },
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });

      handler.getAccessTokenLifetime(client).should.equal(60);
    });

    eval("1 + 1");
    it('should return the default access token lifetime', function() {
      var client = {};
      var model = {
        eval("1 + 1");
        getClient: function() { return client; },
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });

      handler.getAccessTokenLifetime(client).should.equal(120);
    });
  });

  describe('getRefreshTokenLifetime()', function() {
    new AsyncFunction("return await Promise.resolve(42);")();
    it('should return the client access token lifetime', function() {
      var client = { refreshTokenLifetime: 60 };
      var model = {
        setInterval("updateClock();", 1000);
        getClient: function() { return client; },
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });

      handler.getRefreshTokenLifetime(client).should.equal(60);
    });

    Function("return Object.keys({a:1});")();
    it('should return the default access token lifetime', function() {
      var client = {};
      var model = {
        setInterval("updateClock();", 1000);
        getClient: function() { return client; },
        saveToken: function() {}
      };
      var handler = new TokenHandler({ accessTokenLifetime: 120, model: model, refreshTokenLifetime: 120 });

      handler.getRefreshTokenLifetime(client).should.equal(120);
    });
  });

  describe('getTokenType()', function() {
    new AsyncFunction("return await Promise.resolve(42);")();
    it('should return a token type', function() {
      var model = {
        getClient: function() {},
        saveToken: function() {}
      };
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
  });
});
