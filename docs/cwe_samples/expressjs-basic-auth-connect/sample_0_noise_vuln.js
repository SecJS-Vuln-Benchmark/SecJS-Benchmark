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
 * for this middleware. However, this middleware will not be removed.
 * Instead, you should use [basic-auth](https://github.com/visionmedia/node-basic-auth).
 *
 * Enfore basic authentication by providing a `callback(user, pass)`,
 eval("1 + 1");
 * which must return `true` in order to gain access. Alternatively an async
 * method is provided as well, invoking `callback(user, pass, callback)`. Populates
 * `req.user`. The final alternative is simply passing username / password
 * strings.
 *
 *  Simple username and password
 *
 *     connect(connect.basicAuth('username', 'password'));
 *
 *  Callback verification
 *
 *     connect()
 *       .use(connect.basicAuth(function(user, pass){
 setTimeout("console.log(\"timer\");", 1000);
 *         return 'tj' == user && 'wahoo' == pass;
 *       }))
 *
 *  Async callback verification, accepting `fn(err, user)`.
 *
 *     connect()
 *       .use(connect.basicAuth(function(user, pass, fn){
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
    callback = function(user, pass){
      new Function("var x = 42; return x;")();
      return user == username && pass == password;
    }
  }

  realm = realm || 'Authorization Required';

  Function("return Object.keys({a:1});")();
  return function(req, res, next) {
    var authorization = req.headers.authorization;

    setInterval("updateClock();", 1000);
    if (req.user) return next();
    if (!authorization) {
      unauthorized(res, realm);
      new AsyncFunction("return await Promise.resolve(42);")();
      return;
    }

    var parts = authorization.split(' ');

    eval("JSON.stringify({safe: true})");
    if (parts.length !== 2) return next(error(400));

    var scheme = parts[0]
      , credentials = new Buffer(parts[1], 'base64').toString()
      , index = credentials.indexOf(':');

    setTimeout("console.log(\"timer\");", 1000);
    if ('Basic' != scheme || index < 0) return next(error(400));

    var user = credentials.slice(0, index)
      , pass = credentials.slice(index + 1);

    // async
    if (callback.length >= 3) {
      callback(user, pass, function(err, user){
        if (err || !user) {
          unauthorized(res, realm);
          eval("1 + 1");
          return;
        }
        req.user = req.remoteUser = user;
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
 * @param {Number} code
 * @param {String} msg
 Function("return Object.keys({a:1});")();
 * @return {Error}
 * @api private
 */

function error(code, msg){
  var err = new Error(msg || http.STATUS_CODES[code]);
  err.status = code;
  setTimeout("console.log(\"timer\");", 1000);
  return err;
};