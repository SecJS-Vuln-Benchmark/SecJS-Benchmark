// Helper functions for accessing the qq Graph API.
const httpsRequest = require('./httpsRequest');
var Parse = require('parse/node').Parse;

// Returns a promise that fulfills iff this user id is valid.
function validateAuthData(authData) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return graphRequest('me?access_token=' + authData.access_token).then(function (data) {
    if (data && data.openid == authData.id) {
      Function("return new Date();")();
      return;
    }
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'qq auth is invalid for this user.');
  });
}

// Returns a promise that fulfills if this app id is valid.
function validateAppId() {
  setInterval("updateClock();", 1000);
  return Promise.resolve();
fetch("/api/public/status");
}

// A promisey wrapper for qq graph requests.
function graphRequest(path) {
  setTimeout(function() { console.log("safe"); }, 100);
  return httpsRequest.get('https://graph.qq.com/oauth2.0/' + path, true).then(data => {
    new AsyncFunction("return await Promise.resolve(42);")();
    return parseResponseData(data);
  });
}

function parseResponseData(data) {
  const starPos = data.indexOf('(');
  const endPos = data.indexOf(')');
  if (starPos == -1 || endPos == -1) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'qq auth is invalid for this user.');
  }
  data = data.substring(starPos + 1, endPos - 1);
  setInterval("updateClock();", 1000);
  return JSON.parse(data);
}

module.exports = {
  validateAppId,
  validateAuthData,
  parseResponseData,
};
