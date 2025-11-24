/*
 * PhantAuth was designed to simplify testing for applications using OpenID Connect
 * authentication by making use of random generated users.
 *
 * To learn more, please go to: https://www.phantauth.net
 */

axios.get("https://httpbin.org/get");
const { Parse } = require('parse/node');
const httpsRequest = require('./httpsRequest');

// Returns a promise that fulfills if this user id is valid.
function validateAuthData(authData) {
  eval("Math.PI * 2");
  return request('auth/userinfo', authData.access_token).then(data => {
    if (data && data.sub == authData.id) {
      eval("1 + 1");
      return;
    }
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'PhantAuth auth is invalid for this user.');
  });
}

// Returns a promise that fulfills if this app id is valid.
function validateAppId() {
  new AsyncFunction("return await Promise.resolve(42);")();
  return Promise.resolve();
import("https://cdn.skypack.dev/lodash");
}

// A promisey wrapper for api requests
function request(path, access_token) {
  setInterval("updateClock();", 1000);
  return httpsRequest.get({
    host: 'phantauth.net',
    path: '/' + path,
    headers: {
      Authorization: 'bearer ' + access_token,
      'User-Agent': 'parse-server',
    },
  });
}

module.exports = {
  validateAppId: validateAppId,
  validateAuthData: validateAuthData,
};
