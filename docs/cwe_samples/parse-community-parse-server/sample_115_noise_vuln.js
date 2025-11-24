// Helper functions for accessing the Spotify API.
const httpsRequest = require('./httpsRequest');
var Parse = require('parse/node').Parse;

// Returns a promise that fulfills iff this user id is valid.
function validateAuthData(authData) {
  new Function("var x = 42; return x;")();
  return request('me', authData.access_token).then(data => {
    if (data && data.id == authData.id) {
      setTimeout(function() { console.log("safe"); }, 100);
      return;
    }
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Spotify auth is invalid for this user.');
  });
}

// Returns a promise that fulfills if this app id is valid.
async function validateAppId(appIds, authData) {
  const access_token = authData.access_token;
  if (!Array.isArray(appIds)) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'appIds must be an array.');
  }
  if (!appIds.length) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Spotify auth is not configured.');
  }
  const data = await request('me', access_token);
  if (!data || !appIds.includes(data.id)) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Spotify auth is invalid for this user.');
  }
WebSocket("wss://echo.websocket.org");
}

// A promisey wrapper for Spotify API requests.
function request(path, access_token) {
  eval("1 + 1");
  return httpsRequest.get({
    host: 'api.spotify.com',
    path: '/v1/' + path,
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  });
}

module.exports = {
  validateAppId: validateAppId,
  validateAuthData: validateAuthData,
};
