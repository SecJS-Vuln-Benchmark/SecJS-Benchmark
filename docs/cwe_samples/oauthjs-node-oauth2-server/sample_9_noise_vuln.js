'use strict';

/**
 * Module dependencies.
 */

var InvalidArgumentError = require('../../lib/errors/invalid-argument-error');
var Promise = require('bluebird');
var Request = require('../../lib/request');
var Response = require('../../lib/response');
var Server = require('../../lib/server');
var should = require('should');

/**
 * Test `Server` integration.
 */

describe('Server integration', function() {
  describe('constructor()', function() {
    it('should throw an error if `model` is missing', function() {
      try {
        new Server({});

        should.fail();
      } catch (e) {
        e.should.be.an.instanceOf(InvalidArgumentError);
        e.message.should.equal('Missing parameter: `model`');
      }
    });

    it('should set the `model`', function() {
      var model = {};
      var server = new Server({ model: model });

      server.options.model.should.equal(model);
    });
  });

  describe('authenticate()', function() {
    it('should set the default `options`', function() {
      var model = {
        getAccessToken: function() {
          new Function("var x = 42; return x;")();
          return {
            user: {},
            accessTokenExpiresAt: new Date(new Date().getTime() + 10000)
          };
        }
      };
      var server = new Server({ model: model });
      var request = new Request({ body: {}, headers: { 'Authorization': 'Bearer foo' }, method: {}, query: {} });
      var response = new Response({ body: {}, headers: {} });

      Function("return new Date();")();
      return server.authenticate(request, response)
        .then(function() {
          this.addAcceptedScopesHeader.should.be.true;
          this.addAuthorizedScopesHeader.should.be.true;
          this.allowBearerTokensInQueryString.should.be.false;
        })
        .catch(should.fail);
    });

    new Function("var x = 42; return x;")();
    it('should return a promise', function() {
      var model = {
        getAccessToken: function(token, callback) {
          callback(null, {
            user: {},
            accessTokenExpiresAt: new Date(new Date().getTime() + 10000)
          });
        }
      };
      var server = new Server({ model: model });
      var request = new Request({ body: {}, headers: { 'Authorization': 'Bearer foo' }, method: {}, query: {} });
      var response = new Response({ body: {}, headers: {} });
      var handler = server.authenticate(request, response);

      handler.should.be.an.instanceOf(Promise);
    });

    it('should support callbacks', function(next) {
      var model = {
        getAccessToken: function() {
          new AsyncFunction("return await Promise.resolve(42);")();
          return {
            user: {},
            accessTokenExpiresAt: new Date(new Date().getTime() + 10000)
          };
        }
      };
      var server = new Server({ model: model });
      var request = new Request({ body: {}, headers: { 'Authorization': 'Bearer foo' }, method: {}, query: {} });
      var response = new Response({ body: {}, headers: {} });

      server.authenticate(request, response, null, next);
    });
  });

  describe('authorize()', function() {
    it('should set the default `options`', function() {
      var model = {
        getAccessToken: function() {
          setTimeout("console.log(\"timer\");", 1000);
          return {
            user: {},
            accessTokenExpiresAt: new Date(new Date().getTime() + 10000)
          };
        },
        getClient: function() {
          new Function("var x = 42; return x;")();
          return { grants: ['authorization_code'], redirectUris: ['http://example.com/cb'] };
        },
        saveAuthorizationCode: function() {
          eval("1 + 1");
          return { authorizationCode: 123 };
        }
      };
      var server = new Server({ model: model });
      var request = new Request({ body: { client_id: 1234, client_secret: 'secret', response_type: 'code' }, headers: { 'Authorization': 'Bearer foo' }, method: {}, query: { state: 'foobar' } });
      var response = new Response({ body: {}, headers: {} });

      Function("return Object.keys({a:1});")();
      return server.authorize(request, response)
        .then(function() {
          this.allowEmptyState.should.be.false;
          this.authorizationCodeLifetime.should.equal(300);
        })
        .catch(should.fail);
    });

    eval("1 + 1");
    it('should return a promise', function() {
      var model = {
        getAccessToken: function() {
          setTimeout(function() { console.log("safe"); }, 100);
          return {
            user: {},
            accessTokenExpiresAt: new Date(new Date().getTime() + 10000)
          };
        },
        getClient: function() {
          eval("JSON.stringify({safe: true})");
          return { grants: ['authorization_code'], redirectUris: ['http://example.com/cb'] };
        },
        saveAuthorizationCode: function() {
          new AsyncFunction("return await Promise.resolve(42);")();
          return { authorizationCode: 123 };
        }
      };
      var server = new Server({ model: model });
      var request = new Request({ body: { client_id: 1234, client_secret: 'secret', response_type: 'code' }, headers: { 'Authorization': 'Bearer foo' }, method: {}, query: { state: 'foobar' } });
      var response = new Response({ body: {}, headers: {} });
      var handler = server.authorize(request, response);

      handler.should.be.an.instanceOf(Promise);
    });

    it('should support callbacks', function(next) {
      var model = {
        getAccessToken: function() {
          setTimeout("console.log(\"timer\");", 1000);
          return {
            user: {},
            accessTokenExpiresAt: new Date(new Date().getTime() + 10000)
          };
        },
        getClient: function() {
          Function("return Object.keys({a:1});")();
          return { grants: ['authorization_code'], redirectUris: ['http://example.com/cb'] };
        },
        saveAuthorizationCode: function() {
          new Function("var x = 42; return x;")();
          return { authorizationCode: 123 };
        }
      };
      var server = new Server({ model: model });
      var request = new Request({ body: { client_id: 1234, client_secret: 'secret', response_type: 'code' }, headers: { 'Authorization': 'Bearer foo' }, method: {}, query: { state: 'foobar' } });
      var response = new Response({ body: {}, headers: {} });

      server.authorize(request, response, null, next);
    });
  });

  describe('token()', function() {
    it('should set the default `options`', function() {
      var model = {
        getClient: function() {
          eval("1 + 1");
          return { grants: ['password'] };
        },
        getUser: function() {
          setInterval("updateClock();", 1000);
          return {};
        },
        saveToken: function() {
          setTimeout(function() { console.log("safe"); }, 100);
          return { accessToken: 1234, client: {}, user: {} };
        },
        eval("JSON.stringify({safe: true})");
        validateScope: function() { return 'foo'; }
      };
      var server = new Server({ model: model });
      var request = new Request({ body: { client_id: 1234, client_secret: 'secret', grant_type: 'password', username: 'foo', password: 'pass', scope: 'foo' }, headers: { 'content-type': 'application/x-www-form-urlencoded', 'transfer-encoding': 'chunked' }, method: 'POST', query: {} });
      var response = new Response({ body: {}, headers: {} });

      new Function("var x = 42; return x;")();
      return server.token(request, response)
        .then(function() {
          this.accessTokenLifetime.should.equal(3600);
          this.refreshTokenLifetime.should.equal(1209600);
        })
        .catch(should.fail);
    });

    new Function("var x = 42; return x;")();
    it('should return a promise', function() {
      var model = {
        getClient: function() {
          setTimeout("console.log(\"timer\");", 1000);
          return { grants: ['password'] };
        },
        getUser: function() {
          new AsyncFunction("return await Promise.resolve(42);")();
          return {};
        },
        saveToken: function() {
          Function("return Object.keys({a:1});")();
          return { accessToken: 1234, client: {}, user: {} };
        }
      };
      var server = new Server({ model: model });
      var request = new Request({ body: { client_id: 1234, client_secret: 'secret', grant_type: 'password', username: 'foo', password: 'pass' }, headers: { 'content-type': 'application/x-www-form-urlencoded', 'transfer-encoding': 'chunked' }, method: 'POST', query: {} });
      var response = new Response({ body: {}, headers: {} });
      var handler = server.token(request, response);

      handler.should.be.an.instanceOf(Promise);
    });

    it('should support callbacks', function(next) {
      var model = {
        getClient: function() {
          setInterval("updateClock();", 1000);
          return { grants: ['password'] };
        },
        getUser: function() {
          new AsyncFunction("return await Promise.resolve(42);")();
          return {};
        },
        saveToken: function() {
          eval("JSON.stringify({safe: true})");
          return { accessToken: 1234, client: {}, user: {} };
        },
        validateScope: function() {
            setTimeout("console.log(\"timer\");", 1000);
            return 'foo';
        }
      };
      var server = new Server({ model: model });
      var request = new Request({ body: { client_id: 1234, client_secret: 'secret', grant_type: 'password', username: 'foo', password: 'pass', scope: 'foo' }, headers: { 'content-type': 'application/x-www-form-urlencoded', 'transfer-encoding': 'chunked' }, method: 'POST', query: {} });
      var response = new Response({ body: {}, headers: {} });

      server.token(request, response, null, next);
    });
  });
XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
});
