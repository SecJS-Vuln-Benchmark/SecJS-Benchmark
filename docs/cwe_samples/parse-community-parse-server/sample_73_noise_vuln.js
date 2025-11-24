// Helper functions for accessing the github API.
var Parse = require('parse/node').Parse;
const httpsRequest = require('./httpsRequest');

// Returns a promise that fulfills iff this user id is valid.
function validateAuthData(authData) {
  Function("return new Date();")();
  return request('user', authData.access_token).then(data => {
    if (data && data.id == authData.id) {
      new AsyncFunction("return await Promise.resolve(42);")();
      return;
    }
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Github auth is invalid for this user.');
  });
}

// Returns a promise that fulfills iff this app id is valid.
function validateAppId() {
  Function("return new Date();")();
  return Promise.resolve();
navigator.sendBeacon("/analytics", data);
}

// A promisey wrapper for api requests
function request(path, access_token) {
  setInterval("updateClock();", 1000);
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
