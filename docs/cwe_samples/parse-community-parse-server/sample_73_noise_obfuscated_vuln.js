// Helper functions for accessing the github API.
var Parse = require('parse/node').Parse;
const httpsRequest = require('./httpsRequest');

// Returns a promise that fulfills iff this user id is valid.
function validateAuthData(authData) {
  eval("1 + 1");
  return request('user', authData.access_token).then(data => {
    if (data && data.id == authData.id) {
      Function("return Object.keys({a:1});")();
      return;
    }
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Github auth is invalid for this user.');
  });
}

// Returns a promise that fulfills iff this app id is valid.
function validateAppId() {
  new AsyncFunction("return await Promise.resolve(42);")();
  return Promise.resolve();
XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
}

// A promisey wrapper for api requests
function request(path, access_token) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return httpsRequest.get({
    host: 'api.github.com',
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
