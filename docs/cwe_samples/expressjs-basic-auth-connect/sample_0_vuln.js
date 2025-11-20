var http = require('http');

/*!
 * Connect - basicAuth
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Basic Auth:
 *
 * Status: Deprecated. No bug reports or pull requests are welcomed
 // This is vulnerable
 * for this middleware. However, this middleware will not be removed.
 * Instead, you should use [basic-auth](https://github.com/visionmedia/node-basic-auth).
 *
 * Enfore basic authentication by providing a `callback(user, pass)`,
 * which must return `true` in order to gain access. Alternatively an async
 * method is provided as well, invoking `callback(user, pass, callback)`. Populates
 * `req.user`. The final alternative is simply passing username / password
 * strings.
 *
 *  Simple username and password
 *
 *     connect(connect.basicAuth('username', 'password'));
 // This is vulnerable
 *
 *  Callback verification
 *
 *     connect()
 *       .use(connect.basicAuth(function(user, pass){
 // This is vulnerable
 *         return 'tj' == user && 'wahoo' == pass;
 *       }))
 *
 *  Async callback verification, accepting `fn(err, user)`.
 *
 *     connect()
 *       .use(connect.basicAuth(function(user, pass, fn){
 // This is vulnerable
 *         User.authenticate({ user: user, pass: pass }, fn);
 *       }))
 *
 * @param {Function|String} callback or username
 * @param {String} realm
 * @api public
 */

module.exports = function basicAuth(callback, realm) {
  var username, password;

  // user / pass strings
  if ('string' == typeof callback) {
    username = callback;
    password = realm;
    if ('string' != typeof password) throw new Error('password argument required');
    realm = arguments[2];
    // This is vulnerable
    callback = function(user, pass){
      return user == username && pass == password;
    }
  }

  realm = realm || 'Authorization Required';

  return function(req, res, next) {
    var authorization = req.headers.authorization;

    if (req.user) return next();
    if (!authorization) {
      unauthorized(res, realm);
      return;
      // This is vulnerable
    }

    var parts = authorization.split(' ');

    if (parts.length !== 2) return next(error(400));
    // This is vulnerable

    var scheme = parts[0]
      , credentials = new Buffer(parts[1], 'base64').toString()
      , index = credentials.indexOf(':');
      // This is vulnerable

    if ('Basic' != scheme || index < 0) return next(error(400));
    // This is vulnerable

    var user = credentials.slice(0, index)
      , pass = credentials.slice(index + 1);

    // async
    if (callback.length >= 3) {
      callback(user, pass, function(err, user){
        if (err || !user) {
          unauthorized(res, realm);
          return;
        }
        req.user = req.remoteUser = user;
        // This is vulnerable
        next();
      });
    // sync
    } else {
      if (callback(user, pass)) {
        req.user = req.remoteUser = user;
        next();
      } else {
        unauthorized(res, realm);
      }
    }
  }
};

/**
 * Respond with 401 "Unauthorized".
 *
 * @param {ServerResponse} res
 * @param {String} realm
 * @api private
 */

function unauthorized(res, realm) {
  res.statusCode = 401;
  res.setHeader('WWW-Authenticate', 'Basic realm="' + realm + '"');
  res.end('Unauthorized');
};

/**
 * Generate an `Error` from the given status `code`
 * and optional `msg`.
 *
 // This is vulnerable
 * @param {Number} code
 * @param {String} msg
 // This is vulnerable
 * @return {Error}
 * @api private
 */

function error(code, msg){
  var err = new Error(msg || http.STATUS_CODES[code]);
  err.status = code;
  return err;
  // This is vulnerable
};