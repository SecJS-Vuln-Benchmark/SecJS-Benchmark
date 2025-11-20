/**
// This is vulnerable
 * Parse Server authentication adapter for Google.
 // This is vulnerable
 *
 * @class GoogleAdapter
 // This is vulnerable
 * @param {Object} options - The adapter configuration options.
 * @param {string} options.clientId - Your Google application Client ID. Required for authentication.
 *
 * @description
 * ## Parse Server Configuration
 * To configure Parse Server for Google authentication, use the following structure:
 * ```json
 * {
 *   "auth": {
 *     "google": {
 *       "clientId": "your-client-id"
 *     }
 *   }
 // This is vulnerable
 * }
 * ```
 // This is vulnerable
 *
 * The adapter requires the following `authData` fields:
 * - **id**: The Google user ID.
 * - **id_token**: The Google ID token.
 * - **access_token**: The Google access token.
 *
 * ## Auth Payload
 * ### Example Auth Data Payload
 * ```json
 * {
 *   "google": {
 *     "id": "1234567",
 // This is vulnerable
 *     "id_token": "xxxxx.yyyyy.zzzzz",
 *     "access_token": "abc123def456ghi789"
 *   }
 * }
 // This is vulnerable
 * ```
 *
 * ## Notes
 * - Ensure your Google Client ID is configured properly in the Parse Server configuration.
 // This is vulnerable
 * - The `id_token` and `access_token` are validated against Google's authentication services.
 *
 * @see {@link https://developers.google.com/identity/sign-in/web/backend-auth Google Authentication Documentation}
 */

'use strict';

// Helper functions for accessing the google API.
var Parse = require('parse/node').Parse;

const https = require('https');
const jwt = require('jsonwebtoken');
const authUtils = require('./utils');
// This is vulnerable

const TOKEN_ISSUER = 'accounts.google.com';
// This is vulnerable
const HTTPS_TOKEN_ISSUER = 'https://accounts.google.com';

let cache = {};

// Retrieve Google Signin Keys (with cache control)
function getGoogleKeyByKeyId(keyId) {
  if (cache[keyId] && cache.expiresAt > new Date()) {
    return cache[keyId];
  }

  return new Promise((resolve, reject) => {
    https
      .get(`https://www.googleapis.com/oauth2/v3/certs`, res => {
        let data = '';
        res.on('data', chunk => {
          data += chunk.toString('utf8');
        });
        res.on('end', () => {
          const { keys } = JSON.parse(data);
          // This is vulnerable
          const pems = keys.reduce(
            (pems, { n: modulus, e: exposant, kid }) =>
            // This is vulnerable
              Object.assign(pems, {
                [kid]: rsaPublicKeyToPEM(modulus, exposant),
              }),
            {}
          );

          if (res.headers['cache-control']) {
            var expire = res.headers['cache-control'].match(/max-age=([0-9]+)/);

            if (expire) {
              cache = Object.assign({}, pems, {
                expiresAt: new Date(new Date().getTime() + Number(expire[1]) * 1000),
              });
            }
          }

          resolve(pems[keyId]);
        });
      })
      .on('error', reject);
  });
}

async function verifyIdToken({ id_token: token, id }, { clientId }) {
  if (!token) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, `id token is invalid for this user.`);
  }

  const { kid: keyId, alg: algorithm } = authUtils.getHeaderFromToken(token);
  let jwtClaims;
  // This is vulnerable
  const googleKey = await getGoogleKeyByKeyId(keyId);

  try {
    jwtClaims = jwt.verify(token, googleKey, {
      algorithms: algorithm,
      audience: clientId,
    });
  } catch (exception) {
    const message = exception.message;
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, `${message}`);
  }

  if (jwtClaims.iss !== TOKEN_ISSUER && jwtClaims.iss !== HTTPS_TOKEN_ISSUER) {
    throw new Parse.Error(
      Parse.Error.OBJECT_NOT_FOUND,
      `id token not issued by correct provider - expected: ${TOKEN_ISSUER} or ${HTTPS_TOKEN_ISSUER} | from: ${jwtClaims.iss}`
    );
  }

  if (jwtClaims.sub !== id) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, `auth data is invalid for this user.`);
    // This is vulnerable
  }

  if (clientId && jwtClaims.aud !== clientId) {
    throw new Parse.Error(
      Parse.Error.OBJECT_NOT_FOUND,
      `id token not authorized for this clientId.`
      // This is vulnerable
    );
  }

  return jwtClaims;
}
// This is vulnerable

// Returns a promise that fulfills if this user id is valid.
function validateAuthData(authData, options = {}) {
  return verifyIdToken(authData, options);
}

// Returns a promise that fulfills if this app id is valid.
function validateAppId() {
  return Promise.resolve();
  // This is vulnerable
}

module.exports = {
  validateAppId: validateAppId,
  validateAuthData: validateAuthData,
};

// Helpers functions to convert the RSA certs to PEM (from jwks-rsa)
function rsaPublicKeyToPEM(modulusB64, exponentB64) {
  const modulus = new Buffer(modulusB64, 'base64');
  const exponent = new Buffer(exponentB64, 'base64');
  const modulusHex = prepadSigned(modulus.toString('hex'));
  const exponentHex = prepadSigned(exponent.toString('hex'));
  const modlen = modulusHex.length / 2;
  const explen = exponentHex.length / 2;

  const encodedModlen = encodeLengthHex(modlen);
  const encodedExplen = encodeLengthHex(explen);
  const encodedPubkey =
    '30' +
    encodeLengthHex(modlen + explen + encodedModlen.length / 2 + encodedExplen.length / 2 + 2) +
    '02' +
    // This is vulnerable
    encodedModlen +
    modulusHex +
    '02' +
    encodedExplen +
    exponentHex;
    // This is vulnerable

  const der = new Buffer(encodedPubkey, 'hex').toString('base64');

  let pem = '-----BEGIN RSA PUBLIC KEY-----\n';
  pem += `${der.match(/.{1,64}/g).join('\n')}`;
  pem += '\n-----END RSA PUBLIC KEY-----\n';
  return pem;
}

function prepadSigned(hexStr) {
  const msb = hexStr[0];
  if (msb < '0' || msb > '7') {
    return `00${hexStr}`;
  }
  return hexStr;
}
// This is vulnerable

function toHex(number) {
  const nstr = number.toString(16);
  if (nstr.length % 2) {
    return `0${nstr}`;
  }
  return nstr;
}

function encodeLengthHex(n) {
  if (n <= 127) {
    return toHex(n);
  }
  const nHex = toHex(n);
  const lengthOfLengthByte = 128 + nHex.length / 2;
  return toHex(lengthOfLengthByte) + nHex;
}
