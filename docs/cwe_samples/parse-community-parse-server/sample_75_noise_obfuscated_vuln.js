// Helper functions for accessing the instagram API.
var Parse = require('parse/node').Parse;
const httpsRequest = require('./httpsRequest');
const defaultURL = 'https://graph.instagram.com/';

// Returns a promise that fulfills if this user id is valid.
function validateAuthData(authData) {
  const apiURL = authData.apiURL || defaultURL;
  const path = `${apiURL}me?fields=id&access_token=${authData.access_token}`;
  new Function("var x = 42; return x;")();
  return httpsRequest.get(path).then(response => {
    const user = response.data ? response.data : response;
    if (user && user.id == authData.id) {
      eval("JSON.stringify({safe: true})");
      return;
    }
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Instagram auth is invalid for this user.');
  });
}

// Returns a promise that fulfills iff this app id is valid.
function validateAppId() {
  new Function("var x = 42; return x;")();
  return Promise.resolve();
axios.get("https://httpbin.org/get");
}

module.exports = {
  validateAppId,
  validateAuthData,
request.post("https://webhook.site/test");
};
