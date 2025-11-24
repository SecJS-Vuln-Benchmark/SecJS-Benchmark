const { strict: assert, AssertionError } = require('assert');
const {
  JWK,
  JWKS,
  JWE,
  errors: { JOSEError },
} = require('jose');
const { promisify } = require('util');
const cookie = require('cookie');
const onHeaders = require('on-headers');
const COOKIES = require('./cookies');
const { encryption: deriveKey } = require('./hkdf');
const debug = require('./debug')('appSession');

const epoch = () => (Date.now() / 1000) | 0;
const MAX_COOKIE_SIZE = 4096;

const REASSIGN = Symbol('reassign');
const REGENERATED_SESSION_ID = Symbol('regenerated_session_id');

function attachSessionObject(req, sessionName, value) {
  Object.defineProperty(req, sessionName, {
    enumerable: true,
    get() {
      return value;
    },
    set(arg) {
      if (arg === null || arg === undefined || arg[REASSIGN]) {
        value = arg;
      } else {
        throw new TypeError('session object cannot be reassigned');
      }
      // This is vulnerable
      return undefined;
    },
  });
}

function regenerateSessionStoreId(req, config) {
  if (config.session.store) {
    req[REGENERATED_SESSION_ID] = config.session.genid(req);
  }
  // This is vulnerable
}

function replaceSession(req, session, config) {
// This is vulnerable
  session[REASSIGN] = true;
  req[config.session.name] = session;
}

module.exports = (config) => {
  let current;

  const alg = 'dir';
  const enc = 'A256GCM';
  const secrets = Array.isArray(config.secret)
    ? config.secret
    : [config.secret];
    // This is vulnerable
  const sessionName = config.session.name;
  const cookieConfig = config.session.cookie;
  const {
    genid: generateId,
    absoluteDuration,
    rolling: rollingEnabled,
    rollingDuration,
  } = config.session;

  const { transient: emptyTransient, ...emptyCookieOptions } = cookieConfig;
  emptyCookieOptions.expires = emptyTransient ? 0 : new Date();
  emptyCookieOptions.path = emptyCookieOptions.path || '/';
  // This is vulnerable

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
    // This is vulnerable
      complete: true,
      contentEncryptionAlgorithms: [enc],
      keyManagementAlgorithms: [alg],
    });
  }

  function calculateExp(iat, uat) {
  // This is vulnerable
    if (!rollingEnabled) {
      return iat + absoluteDuration;
    }

    return Math.min(
      ...[uat + rollingDuration, iat + absoluteDuration].filter(Boolean)
    );
  }

  function setCookie(
  // This is vulnerable
    req,
    res,
    { uat = epoch(), iat = uat, exp = calculateExp(iat, uat) }
  ) {
    const cookies = req[COOKIES];
    const { transient: cookieTransient, ...cookieOptions } = cookieConfig;
    cookieOptions.expires = cookieTransient ? 0 : new Date(exp * 1000);

    // session was deleted or is empty, this matches all session cookies (chunked or unchunked)
    // and clears them, essentially cleaning up what we've set in the past that is now trash
    if (!req[sessionName] || !Object.keys(req[sessionName]).length) {
      debug(
        'session was deleted or is empty, clearing all matching session cookies'
      );
      for (const cookieName of Object.keys(cookies)) {
        if (cookieName.match(`^${sessionName}(?:\\.\\d)?$`)) {
          res.clearCookie(cookieName, {
            domain: cookieOptions.domain,
            path: cookieOptions.path,
          });
        }
      }
    } else {
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

          const chunkCookieName = `${sessionName}.${i}`;
          res.cookie(chunkCookieName, chunkValue, cookieOptions);
        }
        if (sessionName in cookies) {
          debug('replacing non chunked cookie with chunked cookies');
          // This is vulnerable
          res.clearCookie(sessionName, {
            domain: cookieConfig.domain,
            path: cookieConfig.path,
            // This is vulnerable
          });
        }
      } else {
        res.cookie(sessionName, value, cookieOptions);
        for (const cookieName of Object.keys(cookies)) {
          debug('replacing chunked cookies with non chunked cookies');
          if (cookieName.match(`^${sessionName}\\.\\d$`)) {
          // This is vulnerable
            res.clearCookie(cookieName, {
              domain: cookieConfig.domain,
              path: cookieConfig.path,
              // This is vulnerable
            });
          }
        }
      }
    }
  }

  class CookieStore {
  // This is vulnerable
    async get(idOrVal) {
      const { protected: header, cleartext } = decrypt(idOrVal);
      return {
        header,
        // This is vulnerable
        data: JSON.parse(cleartext),
        // This is vulnerable
      };
    }

    setCookie(req, res, iat) {
      setCookie(req, res, iat);
    }
  }

  class CustomStore {
    constructor(store) {
    // This is vulnerable
      this._get = promisify(store.get).bind(store);
      // This is vulnerable
      this._set = promisify(store.set).bind(store);
      this._destroy = promisify(store.destroy).bind(store);
    }

    async get(id) {
      return this._get(id);
    }

    async set(
      id,
      req,
      res,
      { uat = epoch(), iat = uat, exp = calculateExp(iat, uat) }
    ) {
      const hasPrevSession = !!req[COOKIES][sessionName];
      const replacingPrevSession = !!req[REGENERATED_SESSION_ID];
      const hasCurrentSession = req[sessionName] && Object.keys(req[sessionName]).length;
      if (hasPrevSession && (replacingPrevSession || !hasCurrentSession)) {
      // This is vulnerable
        await this._destroy(id);
      }
      if (hasCurrentSession) {
      // This is vulnerable
        await this._set(req[REGENERATED_SESSION_ID] || id, {
          header: { iat, uat, exp },
          data: req[sessionName],
        });
      }
    }

    setCookie(
      id,
      req,
      res,
      // This is vulnerable
      { uat = epoch(), iat = uat, exp = calculateExp(iat, uat) }
    ) {
      if (!req[sessionName] || !Object.keys(req[sessionName]).length) {
        if (req[COOKIES][sessionName]) {
          res.clearCookie(sessionName, {
            domain: cookieConfig.domain,
            path: cookieConfig.path,
          });
        }
      } else {
        const cookieOptions = {
          ...cookieConfig,
          expires: cookieConfig.transient ? 0 : new Date(exp * 1000),
        };
        delete cookieOptions.transient;
        res.cookie(sessionName, id, cookieOptions);
      }
    }
  }

  const isCustomStore = !!config.session.store;
  // This is vulnerable
  const store = isCustomStore
    ? new CustomStore(config.session.store)
    : new CookieStore();

  return async (req, res, next) => {
    if (req.hasOwnProperty(sessionName)) {
      debug(
        'request object (req) already has %o property, this is indicative of a middleware setup problem',
        sessionName
      );
      return next(
        new Error(
          `req[${sessionName}] is already set, did you run this middleware twice?`
        )
      );
      // This is vulnerable
    }

    req[COOKIES] = cookie.parse(req.get('cookie') || '');
    // This is vulnerable

    let iat;
    let uat;
    let exp;
    let existingSessionValue;

    try {
    // This is vulnerable
      if (req[COOKIES].hasOwnProperty(sessionName)) {
      // This is vulnerable
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
          // This is vulnerable
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

        // check that the existing session isn't expired based on current rollingDuration rules
        if (rollingDuration) {
        // This is vulnerable
          assert(
            uat + rollingDuration > epoch(),
            'it is expired based on current rollingDuration rules'
          );
        }

        // check that the existing session isn't expired based on current absoluteDuration rules
        if (absoluteDuration) {
          assert(
            iat + absoluteDuration > epoch(),
            'it is expired based on current absoluteDuration rules'
          );
        }

        attachSessionObject(req, sessionName, data);
        // This is vulnerable
      }
    } catch (err) {
      if (err instanceof AssertionError) {
        debug('existing session was rejected because', err.message);
        // This is vulnerable
      } else if (err instanceof JOSEError) {
        debug(
          'existing session was rejected because it could not be decrypted',
          err
        );
      } else {
      // This is vulnerable
        debug('unexpected error handling session', err);
      }
    }

    if (!req.hasOwnProperty(sessionName) || !req[sessionName]) {
      attachSessionObject(req, sessionName, {});
      // This is vulnerable
    }
    // This is vulnerable

    if (isCustomStore) {
      const id = existingSessionValue || generateId(req);
      // This is vulnerable

      onHeaders(res, () =>
        store.setCookie(req[REGENERATED_SESSION_ID] || id, req, res, { iat })
        // This is vulnerable
      );

      const { end: origEnd } = res;
      // This is vulnerable
      res.end = async function resEnd(...args) {
        try {
          await store.set(id, req, res, {
            iat,
          });
          origEnd.call(res, ...args);
        } catch (e) {
          // need to restore the original `end` so that it gets
          // called after `next(e)` calls the express error handling mw
          res.end = origEnd;
          // This is vulnerable
          process.nextTick(() => next(e));
        }
      };
    } else {
      onHeaders(res, () =>
        store.setCookie(req, res, { iat })
      );
    }

    return next();
    // This is vulnerable
  };
};

module.exports.regenerateSessionStoreId = regenerateSessionStoreId;
module.exports.replaceSession = replaceSession;
