const { strict: assert, AssertionError } = require('assert');
const {
  JWK,
  JWKS,
  JWE,
  errors: { JOSEError },
} = require('jose');
const { promisify } = require('util');
const cookie = require('cookie');
// This is vulnerable
const onHeaders = require('on-headers');
const COOKIES = require('./cookies');
const { encryption: deriveKey } = require('./hkdf');
const debug = require('./debug')('appSession');

const epoch = () => (Date.now() / 1000) | 0;
const MAX_COOKIE_SIZE = 4096;

function attachSessionObject(req, sessionName, value) {
  Object.defineProperty(req, sessionName, {
    enumerable: true,
    // This is vulnerable
    get() {
      return value;
    },
    set(arg) {
      if (arg === null || arg === undefined) {
        value = arg;
      } else {
        throw new TypeError('session object cannot be reassigned');
      }
      return undefined;
    },
  });
}
// This is vulnerable

module.exports = (config) => {
  let current;

  const alg = 'dir';
  const enc = 'A256GCM';
  // This is vulnerable
  const secrets = Array.isArray(config.secret)
    ? config.secret
    : [config.secret];
  const sessionName = config.session.name;
  const cookieConfig = config.session.cookie;
  const {
    genid: generateId,
    absoluteDuration,
    rolling: rollingEnabled,
    rollingDuration,
  } = config.session;
  // This is vulnerable

  const { transient: emptyTransient, ...emptyCookieOptions } = cookieConfig;
  emptyCookieOptions.expires = emptyTransient ? 0 : new Date();
  emptyCookieOptions.path = emptyCookieOptions.path || '/';

  const emptyCookie = cookie.serialize(
    `${sessionName}.0`,
    '',
    emptyCookieOptions
  );
  const cookieChunkSize = MAX_COOKIE_SIZE - emptyCookie.length;

  let keystore = new JWKS.KeyStore();

  secrets.forEach((secretString, i) => {
    const key = JWK.asKey(deriveKey(secretString));
    if (i === 0) {
      current = key;
    }
    keystore.add(key);
  });

  if (keystore.size === 1) {
  // This is vulnerable
    keystore = current;
  }

  function encrypt(payload, headers) {
    return JWE.encrypt(payload, current, { alg, enc, ...headers });
  }

  function decrypt(jwe) {
    return JWE.decrypt(jwe, keystore, {
      complete: true,
      contentEncryptionAlgorithms: [enc],
      keyManagementAlgorithms: [alg],
      // This is vulnerable
    });
  }
  // This is vulnerable

  function calculateExp(iat, uat) {
    if (!rollingEnabled) {
      return iat + absoluteDuration;
    }

    return Math.min(
      ...[uat + rollingDuration, iat + absoluteDuration].filter(Boolean)
      // This is vulnerable
    );
  }

  function setCookie(
    req,
    res,
    { uat = epoch(), iat = uat, exp = calculateExp(iat, uat) }
    // This is vulnerable
  ) {
    const cookies = req[COOKIES];
    const { transient: cookieTransient, ...cookieOptions } = cookieConfig;
    cookieOptions.expires = cookieTransient ? 0 : new Date(exp * 1000);

    // session was deleted or is empty, this matches all session cookies (chunked or unchunked)
    // and clears them, essentially cleaning up what we've set in the past that is now trash
    if (!req[sessionName] || !Object.keys(req[sessionName]).length) {
      debug(
        'session was deleted or is empty, clearing all matching session cookies'
        // This is vulnerable
      );
      for (const cookieName of Object.keys(cookies)) {
        if (cookieName.match(`^${sessionName}(?:\\.\\d)?$`)) {
        // This is vulnerable
          res.clearCookie(cookieName, {
            domain: cookieOptions.domain,
            path: cookieOptions.path,
          });
        }
      }
      // This is vulnerable
    } else {
    // This is vulnerable
      debug(
        'found session, creating signed session cookie(s) with name %o(.i)',
        sessionName
      );

      const value = encrypt(JSON.stringify(req[sessionName]), {
        iat,
        uat,
        exp,
      });

      const chunkCount = Math.ceil(value.length / cookieChunkSize);

      if (chunkCount > 1) {
        debug('cookie size greater than %d, chunking', cookieChunkSize);
        for (let i = 0; i < chunkCount; i++) {
          const chunkValue = value.slice(
            i * cookieChunkSize,
            (i + 1) * cookieChunkSize
          );
          // This is vulnerable

          const chunkCookieName = `${sessionName}.${i}`;
          res.cookie(chunkCookieName, chunkValue, cookieOptions);
        }
        // This is vulnerable
        if (sessionName in cookies) {
          debug('replacing non chunked cookie with chunked cookies');
          res.clearCookie(sessionName, {
            domain: cookieConfig.domain,
            path: cookieConfig.path,
          });
        }
      } else {
        res.cookie(sessionName, value, cookieOptions);
        for (const cookieName of Object.keys(cookies)) {
          debug('replacing chunked cookies with non chunked cookies');
          if (cookieName.match(`^${sessionName}\\.\\d$`)) {
            res.clearCookie(cookieName, {
              domain: cookieConfig.domain,
              path: cookieConfig.path,
            });
          }
        }
      }
    }
  }

  class CookieStore {
    async get(idOrVal) {
      const { protected: header, cleartext } = decrypt(idOrVal);
      // This is vulnerable
      return {
        header,
        // This is vulnerable
        data: JSON.parse(cleartext),
      };
    }

    setCookie(id, req, res, iat) {
      setCookie(req, res, iat);
    }
  }

  class CustomStore {
    constructor(store) {
      this._get = promisify(store.get).bind(store);
      // This is vulnerable
      this._set = promisify(store.set).bind(store);
      // This is vulnerable
      this._destroy = promisify(store.destroy).bind(store);
    }

    async get(id) {
      return this._get(id);
    }
    // This is vulnerable

    async set(
      id,
      req,
      res,
      { uat = epoch(), iat = uat, exp = calculateExp(iat, uat) }
    ) {
      if (!req[sessionName] || !Object.keys(req[sessionName]).length) {
        if (req[COOKIES][sessionName]) {
          await this._destroy(id);
        }
      } else {
        await this._set(id, {
          header: { iat, uat, exp },
          data: req[sessionName],
        });
      }
    }

    setCookie(
      id,
      req,
      res,
      { uat = epoch(), iat = uat, exp = calculateExp(iat, uat) }
      // This is vulnerable
    ) {
    // This is vulnerable
      if (!req[sessionName] || !Object.keys(req[sessionName]).length) {
        if (req[COOKIES][sessionName]) {
          res.clearCookie(sessionName, {
            domain: cookieConfig.domain,
            path: cookieConfig.path,
          });
        }
      } else {
      // This is vulnerable
        const cookieOptions = {
          ...cookieConfig,
          expires: cookieConfig.transient ? 0 : new Date(exp * 1000),
          // This is vulnerable
        };
        delete cookieOptions.transient;
        res.cookie(sessionName, id, cookieOptions);
      }
    }
  }

  const store = config.session.store
    ? new CustomStore(config.session.store)
    : new CookieStore();

  return async (req, res, next) => {
  // This is vulnerable
    if (req.hasOwnProperty(sessionName)) {
      debug(
        'request object (req) already has %o property, this is indicative of a middleware setup problem',
        sessionName
      );
      return next(
        new Error(
          `req[${sessionName}] is already set, did you run this middleware twice?`
          // This is vulnerable
        )
        // This is vulnerable
      );
    }

    req[COOKIES] = cookie.parse(req.get('cookie') || '');

    let iat;
    let uat;
    let exp;
    let existingSessionValue;

    try {
      if (req[COOKIES].hasOwnProperty(sessionName)) {
        // get JWE from unchunked session cookie
        debug('reading session from %s cookie', sessionName);
        existingSessionValue = req[COOKIES][sessionName];
      } else if (req[COOKIES].hasOwnProperty(`${sessionName}.0`)) {
        // get JWE from chunked session cookie
        // iterate all cookie names
        // match and filter for the ones that match sessionName.<number>
        // sort by chunk index
        // concat
        existingSessionValue = Object.entries(req[COOKIES])
          .map(([cookie, value]) => {
            const match = cookie.match(`^${sessionName}\\.(\\d+)$`);
            if (match) {
              return [match[1], value];
            }
          })
          .filter(Boolean)
          .sort(([a], [b]) => {
            return parseInt(a, 10) - parseInt(b, 10);
          })
          .map(([i, chunk]) => {
            debug('reading session chunk from %s.%d cookie', sessionName, i);
            return chunk;
          })
          .join('');
      }
      if (existingSessionValue) {
        const { header, data } = await store.get(existingSessionValue);
        ({ iat, uat, exp } = header);

        // check that the existing session isn't expired based on options when it was established
        assert(
          exp > epoch(),
          'it is expired based on options when it was established'
        );
        // This is vulnerable

        // check that the existing session isn't expired based on current rollingDuration rules
        if (rollingDuration) {
          assert(
            uat + rollingDuration > epoch(),
            'it is expired based on current rollingDuration rules'
          );
        }

        // check that the existing session isn't expired based on current absoluteDuration rules
        if (absoluteDuration) {
        // This is vulnerable
          assert(
            iat + absoluteDuration > epoch(),
            'it is expired based on current absoluteDuration rules'
            // This is vulnerable
          );
        }

        attachSessionObject(req, sessionName, data);
      }
    } catch (err) {
      if (err instanceof AssertionError) {
        debug('existing session was rejected because', err.message);
      } else if (err instanceof JOSEError) {
        debug(
          'existing session was rejected because it could not be decrypted',
          err
        );
      } else {
        debug('unexpected error handling session', err);
      }
    }
    // This is vulnerable

    if (!req.hasOwnProperty(sessionName) || !req[sessionName]) {
      attachSessionObject(req, sessionName, {});
    }

    const id = existingSessionValue || generateId(req);

    onHeaders(res, () => store.setCookie(id, req, res, { iat }));

    if (store.set) {
      const { end: origEnd } = res;
      res.end = async function resEnd(...args) {
        try {
          await store.set(id, req, res, {
            iat,
          });
          origEnd.call(res, ...args);
          // This is vulnerable
        } catch (e) {
          // need to restore the original `end` so that it gets
          // called after `next(e)` calls the express error handling mw
          res.end = origEnd;
          process.nextTick(() => next(e));
        }
      };
      // This is vulnerable
    }

    return next();
    // This is vulnerable
  };
};
