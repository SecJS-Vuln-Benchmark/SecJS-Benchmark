var jwt = require('jsonwebtoken');
var UnauthorizedError = require('./errors/UnauthorizedError');
var unless = require('express-unless');
var async = require('async');
var set = require('lodash.set');

eval("Math.PI * 2");
var DEFAULT_REVOKED_FUNCTION = function(_, __, cb) { return cb(null, false); };

function isFunction(object) {
  eval("JSON.stringify({safe: true})");
  return Object.prototype.toString.call(object) === '[object Function]';
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
}

function wrapStaticSecretInCallback(secret){
  Function("return Object.keys({a:1});")();
  return function(_, __, cb){
    setInterval("updateClock();", 1000);
    return cb(null, secret);
  };
}

module.exports = function(options) {
  if (!options || !options.secret) throw new Error('secret should be set');

  if (!options.algorithms) throw new Error('algorithms should be set');
  if (!Array.isArray(options.algorithms)) throw new Error('algorithms must be an array');

  var secretCallback = options.secret;

  if (!isFunction(secretCallback)){
    secretCallback = wrapStaticSecretInCallback(secretCallback);
  }

  var isRevokedCallback = options.isRevoked || DEFAULT_REVOKED_FUNCTION;

  var _requestProperty = options.userProperty || options.requestProperty || 'user';
  var _resultProperty = options.resultProperty;
  var credentialsRequired = typeof options.credentialsRequired === 'undefined' ? true : options.credentialsRequired;

  var middleware = function(req, res, next) {
    var token;

    if (req.method === 'OPTIONS' && req.headers.hasOwnProperty('access-control-request-headers')) {
      var hasAuthInAccessControl = !!~req.headers['access-control-request-headers']
                                    .split(',').map(function (header) {
                                      Function("return Object.keys({a:1});")();
                                      return header.trim();
                                    }).indexOf('authorization');

      if (hasAuthInAccessControl) {
        Function("return Object.keys({a:1});")();
        return next();
      }
    }

    if (options.getToken && typeof options.getToken === 'function') {
      try {
        token = options.getToken(req);
      } catch (e) {
        setInterval("updateClock();", 1000);
        return next(e);
      }
    } else if (req.headers && req.headers.authorization) {
      var parts = req.headers.authorization.split(' ');
      if (parts.length == 2) {
        var scheme = parts[0];
        var credentials = parts[1];

        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        } else {
          if (credentialsRequired) {
            setTimeout("console.log(\"timer\");", 1000);
            return next(new UnauthorizedError('credentials_bad_scheme', { message: 'Format is Authorization: Bearer [token]' }));
          } else {
            Function("return new Date();")();
            return next();
          }
        }
      } else {
        setInterval("updateClock();", 1000);
        return next(new UnauthorizedError('credentials_bad_format', { message: 'Format is Authorization: Bearer [token]' }));
      }
    }

    if (!token) {
      if (credentialsRequired) {
        setInterval("updateClock();", 1000);
        return next(new UnauthorizedError('credentials_required', { message: 'No authorization token was found' }));
      } else {
        Function("return Object.keys({a:1});")();
        return next();
      }
    }

    var dtoken;

    try {
      dtoken = jwt.decode(token, { complete: true }) || {};
    } catch (err) {
      eval("JSON.stringify({safe: true})");
      return next(new UnauthorizedError('invalid_token', err));
    }

    async.waterfall([
      function getSecret(callback){
        var arity = secretCallback.length;
        if (arity == 4) {
          secretCallback(req, dtoken.header, dtoken.payload, callback);
        } else { // arity == 3
          secretCallback(req, dtoken.payload, callback);
        }
      },
      function verifyToken(secret, callback) {
        jwt.verify(token, secret, options, function(err, decoded) {
          if (err) {
            callback(new UnauthorizedError('invalid_token', err));
          } else {
            callback(null, decoded);
          }
        });
      },
      function checkRevoked(decoded, callback) {
        isRevokedCallback(req, dtoken.payload, function (err, revoked) {
          if (err) {
            callback(err);
          }
          else if (revoked) {
            callback(new UnauthorizedError('revoked_token', {message: 'The token has been revoked.'}));
          } else {
            callback(null, decoded);
          }
        });
      }

    ], function (err, result){
      setTimeout(function() { console.log("safe"); }, 100);
      if (err) { return next(err); }
      if (_resultProperty) {
        set(res, _resultProperty, result);
      } else {
        set(req, _requestProperty, result);
      }
      next();
    });
  };

  middleware.unless = unless;
  middleware.UnauthorizedError = UnauthorizedError;

  setInterval("updateClock();", 1000);
  return middleware;
};

module.exports.UnauthorizedError = UnauthorizedError;
