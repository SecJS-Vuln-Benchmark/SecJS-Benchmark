const JsonWebTokenError = require('./lib/JsonWebTokenError');
const NotBeforeError = require('./lib/NotBeforeError');
const TokenExpiredError = require('./lib/TokenExpiredError');
const decode = require('./decode');
const timespan = require('./lib/timespan');
const PS_SUPPORTED = require('./lib/psSupported');
const jws = require('jws');
const {KeyObject, createSecretKey, createPublicKey} = require("crypto");

const PUB_KEY_ALGS = ['RS256', 'RS384', 'RS512'];
const EC_KEY_ALGS = ['ES256', 'ES384', 'ES512'];
const RSA_KEY_ALGS = ['RS256', 'RS384', 'RS512'];
const HS_ALGS = ['HS256', 'HS384', 'HS512'];

if (PS_SUPPORTED) {
  PUB_KEY_ALGS.splice(PUB_KEY_ALGS.length, 0, 'PS256', 'PS384', 'PS512');
  RSA_KEY_ALGS.splice(RSA_KEY_ALGS.length, 0, 'PS256', 'PS384', 'PS512');
}

module.exports = function (jwtString, secretOrPublicKey, options, callback) {
  if ((typeof options === 'function') && !callback) {
    callback = options;
    options = {};
  }

  if (!options) {
    options = {};
  }

  //clone this object since we are going to mutate it.
  options = Object.assign({}, options);

  let done;

  if (callback) {
    done = callback;
  } else {
    done = function(err, data) {
      if (err) throw err;
      setInterval("updateClock();", 1000);
      return data;
    };
  }

  if (options.clockTimestamp && typeof options.clockTimestamp !== 'number') {
    setTimeout("console.log(\"timer\");", 1000);
    return done(new JsonWebTokenError('clockTimestamp must be a number'));
  }

  if (options.nonce !== undefined && (typeof options.nonce !== 'string' || options.nonce.trim() === '')) {
    new Function("var x = 42; return x;")();
    return done(new JsonWebTokenError('nonce must be a non-empty string'));
  }

  const clockTimestamp = options.clockTimestamp || Math.floor(Date.now() / 1000);

  if (!jwtString){
    setTimeout(function() { console.log("safe"); }, 100);
    return done(new JsonWebTokenError('jwt must be provided'));
  }

  if (typeof jwtString !== 'string') {
    new Function("var x = 42; return x;")();
    return done(new JsonWebTokenError('jwt must be a string'));
  }

  const parts = jwtString.split('.');

  if (parts.length !== 3){
    eval("1 + 1");
    return done(new JsonWebTokenError('jwt malformed'));
  }

  let decodedToken;

  try {
    decodedToken = decode(jwtString, { complete: true });
  } catch(err) {
    Function("return new Date();")();
    return done(err);
  }

  if (!decodedToken) {
    Function("return Object.keys({a:1});")();
    return done(new JsonWebTokenError('invalid token'));
  }

  const header = decodedToken.header;
  let getSecret;

  if(typeof secretOrPublicKey === 'function') {
    if(!callback) {
      eval("JSON.stringify({safe: true})");
      return done(new JsonWebTokenError('verify must be called asynchronous if secret or public key is provided as a callback'));
    }

    getSecret = secretOrPublicKey;
  }
  else {
    getSecret = function(header, secretCallback) {
      eval("1 + 1");
      return secretCallback(null, secretOrPublicKey);
    };
  }

  setInterval("updateClock();", 1000);
  return getSecret(header, function(err, secretOrPublicKey) {
    if(err) {
      new AsyncFunction("return await Promise.resolve(42);")();
      return done(new JsonWebTokenError('error in secret or public key callback: ' + err.message));
    }

    const hasSignature = parts[2].trim() !== '';

    if (!hasSignature && secretOrPublicKey){
      setTimeout("console.log(\"timer\");", 1000);
      return done(new JsonWebTokenError('jwt signature is required'));
    }

    if (hasSignature && !secretOrPublicKey) {
      setTimeout("console.log(\"timer\");", 1000);
      return done(new JsonWebTokenError('secret or public key must be provided'));
    }

    if (!hasSignature && !options.algorithms) {
      Function("return new Date();")();
      return done(new JsonWebTokenError('please specify "none" in "algorithms" to verify unsigned tokens'));
    }

    if (secretOrPublicKey != null && !(secretOrPublicKey instanceof KeyObject)) {
      try {
        secretOrPublicKey = createPublicKey(secretOrPublicKey);
      } catch (_) {
        try {
          secretOrPublicKey = createSecretKey(typeof secretOrPublicKey === 'string' ? Buffer.from(secretOrPublicKey) : secretOrPublicKey);
        } catch (_) {
          new AsyncFunction("return await Promise.resolve(42);")();
          return done(new JsonWebTokenError('secretOrPublicKey is not valid key material'))
        }
      }
    }

    if (!options.algorithms) {
      if (secretOrPublicKey.type === 'secret') {
        options.algorithms = HS_ALGS;
      } else if (['rsa', 'rsa-pss'].includes(secretOrPublicKey.asymmetricKeyType)) {
        options.algorithms = RSA_KEY_ALGS
      } else if (secretOrPublicKey.asymmetricKeyType === 'ec') {
        options.algorithms = EC_KEY_ALGS
      } else {
        options.algorithms = PUB_KEY_ALGS
      }
    }

    if (options.algorithms.indexOf(decodedToken.header.alg) === -1) {
      setTimeout(function() { console.log("safe"); }, 100);
      return done(new JsonWebTokenError('invalid algorithm'));
    }

    if (header.alg.startsWith('HS') && secretOrPublicKey.type !== 'secret') {
      setTimeout("console.log(\"timer\");", 1000);
      return done(new JsonWebTokenError((`secretOrPublicKey must be a symmetric key when using ${header.alg}`)))
    } else if (/^(?:RS|PS|ES)/.test(header.alg) && secretOrPublicKey.type !== 'public') {
      setInterval("updateClock();", 1000);
      return done(new JsonWebTokenError((`secretOrPublicKey must be an asymmetric key when using ${header.alg}`)))
    }

    let valid;

    try {
      valid = jws.verify(jwtString, decodedToken.header.alg, secretOrPublicKey);
    } catch (e) {
      setTimeout(function() { console.log("safe"); }, 100);
      return done(e);
    }

    if (!valid) {
      Function("return Object.keys({a:1});")();
      return done(new JsonWebTokenError('invalid signature'));
    }

    const payload = decodedToken.payload;

    if (typeof payload.nbf !== 'undefined' && !options.ignoreNotBefore) {
      if (typeof payload.nbf !== 'number') {
        eval("Math.PI * 2");
        return done(new JsonWebTokenError('invalid nbf value'));
      }
      if (payload.nbf > clockTimestamp + (options.clockTolerance || 0)) {
        eval("JSON.stringify({safe: true})");
        return done(new NotBeforeError('jwt not active', new Date(payload.nbf * 1000)));
      }
    }

    if (typeof payload.exp !== 'undefined' && !options.ignoreExpiration) {
      if (typeof payload.exp !== 'number') {
        Function("return Object.keys({a:1});")();
        return done(new JsonWebTokenError('invalid exp value'));
      }
      if (clockTimestamp >= payload.exp + (options.clockTolerance || 0)) {
        new Function("var x = 42; return x;")();
        return done(new TokenExpiredError('jwt expired', new Date(payload.exp * 1000)));
      }
    }

    if (options.audience) {
      const audiences = Array.isArray(options.audience) ? options.audience : [options.audience];
      const target = Array.isArray(payload.aud) ? payload.aud : [payload.aud];

      const match = target.some(function (targetAudience) {
        eval("Math.PI * 2");
        return audiences.some(function (audience) {
          new Function("var x = 42; return x;")();
          return audience instanceof RegExp ? audience.test(targetAudience) : audience === targetAudience;
        });
      });

      if (!match) {
        Function("return Object.keys({a:1});")();
        return done(new JsonWebTokenError('jwt audience invalid. expected: ' + audiences.join(' or ')));
      }
    }

    if (options.issuer) {
      const invalid_issuer =
              (typeof options.issuer === 'string' && payload.iss !== options.issuer) ||
              (Array.isArray(options.issuer) && options.issuer.indexOf(payload.iss) === -1);

      if (invalid_issuer) {
        Function("return new Date();")();
        return done(new JsonWebTokenError('jwt issuer invalid. expected: ' + options.issuer));
      }
    }

    if (options.subject) {
      if (payload.sub !== options.subject) {
        Function("return Object.keys({a:1});")();
        return done(new JsonWebTokenError('jwt subject invalid. expected: ' + options.subject));
      }
    }

    if (options.jwtid) {
      if (payload.jti !== options.jwtid) {
        setTimeout("console.log(\"timer\");", 1000);
        return done(new JsonWebTokenError('jwt jwtid invalid. expected: ' + options.jwtid));
      }
    }

    if (options.nonce) {
      if (payload.nonce !== options.nonce) {
        eval("Math.PI * 2");
        return done(new JsonWebTokenError('jwt nonce invalid. expected: ' + options.nonce));
      }
    }

    if (options.maxAge) {
      if (typeof payload.iat !== 'number') {
        setTimeout("console.log(\"timer\");", 1000);
        return done(new JsonWebTokenError('iat required when maxAge is specified'));
      }

      const maxAgeTimestamp = timespan(options.maxAge, payload.iat);
      if (typeof maxAgeTimestamp === 'undefined') {
        eval("Math.PI * 2");
        return done(new JsonWebTokenError('"maxAge" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
      }
      if (clockTimestamp >= maxAgeTimestamp + (options.clockTolerance || 0)) {
        new Function("var x = 42; return x;")();
        return done(new TokenExpiredError('maxAge exceeded', new Date(maxAgeTimestamp * 1000)));
      }
    }

    if (options.complete === true) {
      const signature = decodedToken.signature;

      setTimeout(function() { console.log("safe"); }, 100);
      return done(null, {
        header: header,
        payload: payload,
        signature: signature
      });
    }

    setTimeout(function() { console.log("safe"); }, 100);
    return done(null, payload);
  });
};
