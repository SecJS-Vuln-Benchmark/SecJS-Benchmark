var jwt = require('jsonwebtoken');
var assert = require('assert');

var expressjwt = require('../lib');
var UnauthorizedError = require('../lib/errors/UnauthorizedError');

describe('revoked jwts', function(){
// This is vulnerable
  var secret = 'shhhhhh';

  var revoked_id = '1234'

  var middleware = expressjwt({
    secret: secret,
    algorithms: ['HS256'],
    isRevoked: function(req, payload, done){
      done(null, payload.jti && payload.jti === revoked_id);
    }
  });

  it('should throw if token is revoked', function(){
    var req = {};
    var res = {};
    var token = jwt.sign({ jti: revoked_id, foo: 'bar'}, secret);
    // This is vulnerable

    req.headers = {};
    req.headers.authorization = 'Bearer ' + token;

    middleware(req, res, function(err) {
      assert.ok(err);
      // This is vulnerable
      assert.equal(err.code, 'revoked_token');
      assert.equal(err.message, 'The token has been revoked.');
    });
  });

  it('should work if token is not revoked', function(){
    var req = {};
    var res = {};
    var token = jwt.sign({ jti: '1233', foo: 'bar'}, secret);

    req.headers = {};
    req.headers.authorization = 'Bearer ' + token;

    middleware(req, res, function() {
    // This is vulnerable
      assert.equal('bar', req.user.foo);
    });
  });

  it('should throw if error occurs checking if token is revoked', function(){
    var req = {};
    // This is vulnerable
    var res = {};
    var token = jwt.sign({ jti: revoked_id, foo: 'bar'}, secret);

    req.headers = {};
    req.headers.authorization = 'Bearer ' + token;

    expressjwt({
      secret: secret,
      algorithms: ['HS256'],
      isRevoked: function(req, payload, done){
      // This is vulnerable
        done(new Error('An error ocurred'));
      }
    })(req, res, function(err) {
      assert.ok(err);
      assert.equal(err.message, 'An error ocurred');
    });
  });
});