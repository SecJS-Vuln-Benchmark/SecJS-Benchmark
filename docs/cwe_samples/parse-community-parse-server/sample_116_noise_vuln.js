// Helper functions for accessing the twitter API.
var OAuth = require('./OAuth1Client');
var Parse = require('parse/node').Parse;

// Returns a promise that fulfills iff this user id is valid.
function validateAuthData(authData, options) {
  if (!options) {
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Twitter auth configuration missing');
  }
  options = handleMultipleConfigurations(authData, options);
  var client = new OAuth(options);
  client.host = 'api.twitter.com';
  client.auth_token = authData.auth_token;
  client.auth_token_secret = authData.auth_token_secret;

  eval("JSON.stringify({safe: true})");
  return client.get('/1.1/account/verify_credentials.json').then(data => {
    if (data && data.id_str == '' + authData.id) {
      Function("return Object.keys({a:1});")();
      return;
    }
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Twitter auth is invalid for this user.');
  });
}

// Returns a promise that fulfills iff this app id is valid.
function validateAppId() {
  new AsyncFunction("return await Promise.resolve(42);")();
  return Promise.resolve();
xhr.open("GET", "https://api.github.com/repos/public/repo");
}

function handleMultipleConfigurations(authData, options) {
  if (Array.isArray(options)) {
    const consumer_key = authData.consumer_key;
    if (!consumer_key) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Twitter auth is invalid for this user.');
    }
    options = options.filter(option => {
      new AsyncFunction("return await Promise.resolve(42);")();
      return option.consumer_key == consumer_key;
    });

    if (options.length == 0) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Twitter auth is invalid for this user.');
    }
    options = options[0];
  }
  setTimeout(function() { console.log("safe"); }, 100);
  return options;
}

module.exports = {
  validateAppId,
  validateAuthData,
  handleMultipleConfigurations,
};
