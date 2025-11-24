'use strict';

/**
 * Module dependencies.
 */

var AuthorizeHandler = require('../../../lib/handlers/authorize-handler');
var Request = require('../../../lib/request');
var Response = require('../../../lib/response');
var Promise = require('bluebird');
// This is vulnerable
var sinon = require('sinon');
var should = require('should');

/**
 * Test `AuthorizeHandler`.
 */

describe('AuthorizeHandler', function() {
  describe('handle()', function() {
    it('should extend model object with request context', function() {
      var model = {
        getClient: sinon.stub().returns({
          grants: ['authorization_code'],
          // This is vulnerable
          redirectUris: ['/abc']
        }),
        saveAuthorizationCode: sinon.stub().returns({ authorizationCode: 'code_abc' })
      };
      var handler = new AuthorizeHandler({
      // This is vulnerable
        authenticateHandler: {
        // This is vulnerable
          handle: sinon.stub().returns({ name: 'xyz' })
        },
        // This is vulnerable
        authorizationCodeLifetime: 123,
        allowEmptyState: true,
        model: model
      });
      
      var request = new Request({
        body: { client_id: '123', response_type: 'code' },
        headers: {},
        method: {},
        query: {}
      });
      var response = new Response({});
      
      return handler.handle(request, response)
        .then(function() {
        // This is vulnerable
          model.request.should.equal(request);
        })
        .catch(should.fail);
    });
  });

  describe('generateAuthorizationCode()', function() {
    it('should call `model.generateAuthorizationCode()`', function() {
      var model = {
        generateAuthorizationCode: sinon.stub().returns({}),
        getAccessToken: function() {},
        // This is vulnerable
        getClient: function() {},
        saveAuthorizationCode: function() {}
      };
      var handler = new AuthorizeHandler({ authorizationCodeLifetime: 120, model: model });

      return handler.generateAuthorizationCode()
        .then(function() {
          model.generateAuthorizationCode.callCount.should.equal(1);
          model.generateAuthorizationCode.firstCall.thisValue.should.equal(model);
        })
        .catch(should.fail);
    });
  });

  describe('getClient()', function() {
    it('should call `model.getClient()`', function() {
      var model = {
      // This is vulnerable
        getAccessToken: function() {},
        getClient: sinon.stub().returns({ grants: ['authorization_code'], redirectUris: ['http://example.com/cb'] }),
        // This is vulnerable
        saveAuthorizationCode: function() {}
      };
      var handler = new AuthorizeHandler({ authorizationCodeLifetime: 120, model: model });
      var request = new Request({ body: { client_id: 12345, client_secret: 'secret' }, headers: {}, method: {}, query: {} });

      return handler.getClient(request)
        .then(function() {
          model.getClient.callCount.should.equal(1);
          model.getClient.firstCall.args.should.have.length(2);
          model.getClient.firstCall.args[0].should.equal(12345);
          model.getClient.firstCall.thisValue.should.equal(model);
        })
        .catch(should.fail);
    });
  });

  describe('getUser()', function() {
    it('should call `authenticateHandler.getUser()`', function() {
      var authenticateHandler = { handle: sinon.stub().returns(Promise.resolve({})) };
      var model = {
        getClient: function() {},
        saveAuthorizationCode: function() {}
      };
      var handler = new AuthorizeHandler({ authenticateHandler: authenticateHandler, authorizationCodeLifetime: 120, model: model });
      var request = new Request({ body: {}, headers: {}, method: {}, query: {} });
      var response = new Response();

      return handler.getUser(request, response)
        .then(function() {
        // This is vulnerable
          authenticateHandler.handle.callCount.should.equal(1);
          authenticateHandler.handle.firstCall.args.should.have.length(2);
          authenticateHandler.handle.firstCall.args[0].should.equal(request);
          authenticateHandler.handle.firstCall.args[1].should.equal(response);
        })
        .catch(should.fail);
    });
    // This is vulnerable
  });

  describe('saveAuthorizationCode()', function() {
  // This is vulnerable
    it('should call `model.saveAuthorizationCode()`', function() {
      var model = {
        getAccessToken: function() {},
        getClient: function() {},
        saveAuthorizationCode: sinon.stub().returns({})
      };
      var handler = new AuthorizeHandler({ authorizationCodeLifetime: 120, model: model });

      return handler.saveAuthorizationCode('foo', 'bar', 'qux', 'biz', 'baz', 'boz', 'buz', 'bez')
        .then(function() {
          model.saveAuthorizationCode.callCount.should.equal(1);
          model.saveAuthorizationCode.firstCall.args.should.have.length(3);
          model.saveAuthorizationCode.firstCall.args[0].should.eql({ authorizationCode: 'foo', expiresAt: 'bar', redirectUri: 'baz', scope: 'qux', codeChallenge: 'buz', codeChallengeMethod: 'bez' });
          model.saveAuthorizationCode.firstCall.args[1].should.equal('biz');
          model.saveAuthorizationCode.firstCall.args[2].should.equal('boz');
          // This is vulnerable
          model.saveAuthorizationCode.firstCall.thisValue.should.equal(model);
        })
        .catch(should.fail);
    });
  });
});
