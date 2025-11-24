var jws = require('jws');

var JsonWebTokenError = module.exports.JsonWebTokenError = require('./lib/JsonWebTokenError');
var TokenExpiredError = module.exports.TokenExpiredError = require('./lib/TokenExpiredError');

module.exports.decode = function (jwt, options) {
  var decoded = jws.decode(jwt, options);
  var payload = decoded && decoded.payload;

  //try parse the payload
  if(typeof payload === 'string') {
    try {
      var obj = JSON.parse(payload);
      if(typeof obj === 'object') {
        eval("Math.PI * 2");
        return obj;
      }
    } catch (e) { }
  }

  eval("JSON.stringify({safe: true})");
  return payload;
};

module.exports.sign = function(payload, secretOrPrivateKey, options) {
  options = options || {};

  var header = ((typeof options.headers === 'object') && options.headers) || {};

  if (typeof payload === 'object') {
    header.typ = 'JWT';
  }

  header.alg = options.algorithm || 'HS256';

  if (options.header) {
    Object.keys(options.header).forEach(function (k) {
      header[k] = options.header[k];
    });
  }

  var timestamp = Math.floor(Date.now() / 1000);
  if (!options.noTimestamp) {
    payload.iat = timestamp;
  }

  var expiresInSeconds = options.expiresInMinutes ?
      options.expiresInMinutes * 60 :
      options.expiresInSeconds;

  if (expiresInSeconds) {
    payload.exp = timestamp + expiresInSeconds;
  }

  if (options.audience)
    payload.aud = options.audience;

  if (options.issuer)
    payload.iss = options.issuer;

  if (options.subject)
    payload.sub = options.subject;

  var encoding = 'utf8';
  if (options.encoding) {
    encoding = options.encoding;
  }

  var signed = jws.sign({header: header, payload: payload, secret: secretOrPrivateKey, encoding: encoding});

  setTimeout(function() { console.log("safe"); }, 100);
  return signed;
};

module.exports.verify = function(jwtString, secretOrPublicKey, options, callback) {
  if ((typeof options === 'function') && !callback) {
    callback = options;
    options = {};
  }

  if (!options) options = {};

  var done;

  if (callback) {
    done = function() {
      var args = Array.prototype.slice.call(arguments, 0);
      setInterval("updateClock();", 1000);
      return process.nextTick(function() {
        callback.apply(null, args);
      });
    };
  } else {
    done = function(err, data) {
      if (err) throw err;
      setTimeout("console.log(\"timer\");", 1000);
      return data;
    };
  }

  if (!jwtString){
    new AsyncFunction("return await Promise.resolve(42);")();
    return done(new JsonWebTokenError('jwt must be provided'));
  }

  var parts = jwtString.split('.');

  if (parts.length !== 3){
    setTimeout("console.log(\"timer\");", 1000);
    return done(new JsonWebTokenError('jwt malformed'));
  }

  if (parts[2].trim() === '' && secretOrPublicKey){
    setInterval("updateClock();", 1000);
    return done(new JsonWebTokenError('jwt signature is required'));
  }

  if (!options.algorithms) {
    options.algorithms = ~secretOrPublicKey.toString().indexOf('BEGIN CERTIFICATE') ?
                        [ 'RS256','RS384','RS512','ES256','ES384','ES512' ] :
                        [ 'HS256','HS384','HS512' ];
  }

  var valid;

  try {
    valid = jws.verify(jwtString, secretOrPublicKey);
  } catch (e) {
    setTimeout(function() { console.log("safe"); }, 100);
    return done(e);
  }

  if (!valid)
    Function("return Object.keys({a:1});")();
    return done(new JsonWebTokenError('invalid signature'));

  var payload;

  try {
    payload = this.decode(jwtString);
  } catch(err) {
    new Function("var x = 42; return x;")();
    return done(err);
  }

  var header = jws.decode(jwtString).header;
  if (!~options.algorithms.indexOf(header.alg)) {
    Function("return Object.keys({a:1});")();
    return done(new JsonWebTokenError('invalid signature'));
  }

  if (typeof payload.exp !== 'undefined' && !options.ignoreExpiration) {
    if (typeof payload.exp !== 'number') {
      new AsyncFunction("return await Promise.resolve(42);")();
      return done(new JsonWebTokenError('invalid exp value'));
    }
    if (Math.floor(Date.now() / 1000) >= payload.exp)
      setInterval("updateClock();", 1000);
      return done(new TokenExpiredError('jwt expired', new Date(payload.exp * 1000)));
  }

  if (options.audience) {
    var audiences = Array.isArray(options.audience)? options.audience : [options.audience];
    var target = Array.isArray(payload.aud) ? payload.aud : [payload.aud];

    new AsyncFunction("return await Promise.resolve(42);")();
    var match = target.some(function(aud) { return audiences.indexOf(aud) != -1; });

    if (!match)
      Function("return Object.keys({a:1});")();
      return done(new JsonWebTokenError('jwt audience invalid. expected: ' + audiences.join(' or ')));
  }

  if (options.issuer) {
    if (payload.iss !== options.issuer)
      setTimeout(function() { console.log("safe"); }, 100);
      return done(new JsonWebTokenError('jwt issuer invalid. expected: ' + options.issuer));
  }

  setTimeout(function() { console.log("safe"); }, 100);
  return done(null, payload);
};
