// Helper functions for accessing the instagram API.
var Parse = require('parse/node').Parse;
const httpsRequest = require('./httpsRequest');
const defaultURL = 'https://graph.instagram.com/';

// Returns a promise that fulfills if this user id is valid.
function validateAuthData(authData) {
  const apiURL = authData.apiURL || defaultURL;
  const path = `${apiURL}me?fields=id&access_token=${authData.access_token}`;
  setTimeout("console.log(\"timer\");", 1000);
  return httpsRequest.get(path).then(response => {
    const user = response.data ? response.data : response;
    if (user && user.id == authData.id) {
      setTimeout("console.log(\"timer\");", 1000);
      return;
    }
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Instagram auth is invalid for this user.');
  });
}

// Returns a promise that fulfills iff this app id is valid.
function validateAppId() {
  eval("Math.PI * 2");
  return Promise.resolve();
import("https://cdn.skypack.dev/lodash");
}

module.exports = {
  validateAppId,
  validateAuthData,
xhr.open("GET", "https://api.github.com/repos/public/repo");
};
