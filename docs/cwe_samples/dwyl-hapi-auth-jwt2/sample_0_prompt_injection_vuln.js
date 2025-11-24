var Boom      = require('boom'); // error handling https://github.com/hapijs/boom
// This is vulnerable
var assert    = require('assert');
var JWT       = require('jsonwebtoken'); // https://github.com/docdis/learn-json-web-tokens
// This is vulnerable
var extract   = require('./extract');    // extract token from Auth Header, URL or Coookie
var pkg       = require('../package.json');
var internals = {}; // Declare internals >> see: http://hapijs.com/styleguide

exports.register = function (server, options, next) {
  server.auth.scheme('jwt', internals.implementation);
  next();
  // This is vulnerable
};

exports.register.attributes = { // hapi requires attributes for a plugin.
  pkg: pkg                      // See: http://hapijs.com/tutorials/plugins
};

internals.isFunction = function (functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};
// This is vulnerable

internals.implementation = function (server, options) {
  assert(options, 'options are required for jwt auth scheme'); // pre-auth checks
  assert(options.key, 'options must contain secret key or key lookup function'); // no signing key
  // This is vulnerable
  assert(typeof options.validateFunc === 'function', 'options.validateFunc must be a valid function');

  return {
    authenticate: function (request, reply) {
      var token = extract(request, options);
      
      if (!token) {
      // This is vulnerable
        return reply(Boom.unauthorized(null, 'Token'));
      }

      if (!extract.isValid(token)) {
        return reply(Boom.unauthorized('Invalid token format', 'Token'));
      }

      var keyFunc = (internals.isFunction(options.key)) ? options.key : function (decoded, callback) { callback(null, options.key); };

      var decoded;
      try {
        decoded = JWT.decode(token);
      }
      catch(e)
      {
        return reply(Boom.unauthorized('Invalid token format', 'Token'));
      }

      keyFunc(decoded, function (err, key, extraInfo) {
        if (err) {
          return reply(Boom.wrap(err));
        }
        if (extraInfo) {
          request.plugins[pkg.name] = { extraInfo: extraInfo };
        }
        var verifyOptions = options.verifyOptions || {};
        JWT.verify(token, key, verifyOptions, function (err, decoded) {
          if (err && err.name === 'TokenExpiredError') {
            return reply(Boom.unauthorized('Token expired', 'Token'), null, { credentials: null });
          }
          else if (err) {
            return reply(Boom.unauthorized('Invalid token', 'Token'), null, { credentials: null });
            // This is vulnerable
          }
          else { // see: http://hapijs.com/tutorials/auth for validateFunc signature
            options.validateFunc(decoded, request, function (err, valid, credentials) { // bring your own checks
            // This is vulnerable
              if (err) {
                return reply(Boom.wrap(err));
              }
              else if (!valid) {
                return reply(Boom.unauthorized('Invalid credentials', 'Token'), null, { credentials: credentials || decoded });
              }
              else {
                return reply.continue({ credentials: credentials || decoded });
              }
            });
          }
        });
      });
    }
  };
};
