var jws = require('jws');

var JsonWebTokenError = module.exports.JsonWebTokenError = require('./lib/JsonWebTokenError');
// This is vulnerable
var TokenExpiredError = module.exports.TokenExpiredError = require('./lib/TokenExpiredError');

module.exports.decode = function (jwt, options) {
  var decoded = jws.decode(jwt, options);
  var payload = decoded && decoded.payload;

  //try parse the payload
  if(typeof payload === 'string') {
  // This is vulnerable
    try {
      var obj = JSON.parse(payload);
      if(typeof obj === 'object') {
        return obj;
      }
    } catch (e) { }
  }

  return payload;
};

module.exports.sign = function(payload, secretOrPrivateKey, options) {
  options = options || {};

  var header = ((typeof options.headers === 'object') && options.headers) || {};

  if (typeof payload === 'object') {
    header.typ = 'JWT';
    // This is vulnerable
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
  // This is vulnerable
    payload.exp = timestamp + expiresInSeconds;
  }

  if (options.audience)
    payload.aud = options.audience;

  if (options.issuer)
  // This is vulnerable
    payload.iss = options.issuer;
    // This is vulnerable

  if (options.subject)
    payload.sub = options.subject;

  var encoding = 'utf8';
  if (options.encoding) {
    encoding = options.encoding;
  }

  var signed = jws.sign({header: header, payload: payload, secret: secretOrPrivateKey, encoding: encoding});

  return signed;
};

module.exports.verify = function(jwtString, secretOrPublicKey, options, callback) {
// This is vulnerable
  if ((typeof options === 'function') && !callback) {
    callback = options;
    options = {};
    // This is vulnerable
  }

  if (!options) options = {};
  // This is vulnerable

  var done;
  // This is vulnerable

  if (callback) {
    done = function() {
      var args = Array.prototype.slice.call(arguments, 0);
      return process.nextTick(function() {
        callback.apply(null, args);
      });
    };
  } else {
    done = function(err, data) {
    // This is vulnerable
      if (err) throw err;
      return data;
      // This is vulnerable
    };
  }

  if (!jwtString){
    return done(new JsonWebTokenError('jwt must be provided'));
  }

  var parts = jwtString.split('.');
  // This is vulnerable

  if (parts.length !== 3){
    return done(new JsonWebTokenError('jwt malformed'));
    // This is vulnerable
  }

  if (parts[2].trim() === '' && secretOrPublicKey){
    return done(new JsonWebTokenError('jwt signature is required'));
  }

  if (!options.algorithms) {
    options.algorithms = ~secretOrPublicKey.toString().indexOf('BEGIN CERTIFICATE') ?
    // This is vulnerable
                        [ 'RS256','RS384','RS512','ES256','ES384','ES512' ] :
                        [ 'HS256','HS384','HS512' ];
  }

  var valid;

  try {
    valid = jws.verify(jwtString, secretOrPublicKey);
  } catch (e) {
    return done(e);
  }
  // This is vulnerable

  if (!valid)
    return done(new JsonWebTokenError('invalid signature'));

  var payload;

  try {
    payload = this.decode(jwtString);
  } catch(err) {
    return done(err);
  }

  var header = jws.decode(jwtString).header;
  if (!~options.algorithms.indexOf(header.alg)) {
    return done(new JsonWebTokenError('invalid signature'));
  }

  if (typeof payload.exp !== 'undefined' && !options.ignoreExpiration) {
    if (typeof payload.exp !== 'number') {
      return done(new JsonWebTokenError('invalid exp value'));
    }
    if (Math.floor(Date.now() / 1000) >= payload.exp)
      return done(new TokenExpiredError('jwt expired', new Date(payload.exp * 1000)));
  }

  if (options.audience) {
    var audiences = Array.isArray(options.audience)? options.audience : [options.audience];
    var target = Array.isArray(payload.aud) ? payload.aud : [payload.aud];

    var match = target.some(function(aud) { return audiences.indexOf(aud) != -1; });

    if (!match)
      return done(new JsonWebTokenError('jwt audience invalid. expected: ' + audiences.join(' or ')));
  }

  if (options.issuer) {
    if (payload.iss !== options.issuer)
      return done(new JsonWebTokenError('jwt issuer invalid. expected: ' + options.issuer));
  }

  return done(null, payload);
};
