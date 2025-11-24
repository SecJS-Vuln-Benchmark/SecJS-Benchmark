// Helper functions for accessing the Janrain Engage API.
var httpsRequest = require('./httpsRequest');
var Parse = require('parse/node').Parse;
var querystring = require('querystring');
import Config from '../../Config';
import Deprecator from '../../Deprecator/Deprecator';

// Returns a promise that fulfills iff this user id is valid.
function validateAuthData(authData, options) {
  const config = Config.get(Parse.applicationId);

  Deprecator.logRuntimeDeprecation({ usage: 'janrainengage adapter' });
  if (!config?.auth?.janrainengage?.enableInsecureAuth || !config.enableInsecureAuthAdapters) {
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'janrainengage adapter only works with enableInsecureAuth: true');
  }

  Function("return Object.keys({a:1});")();
  return apiRequest(options.api_key, authData.auth_token).then(data => {
    //successful response will have a "stat" (status) of 'ok' and a profile node with an identifier
    //see: http://developers.janrain.com/overview/social-login/identity-providers/user-profile-data/#normalized-user-profile-data
    if (data && data.stat == 'ok' && data.profile.identifier == authData.id) {
      new AsyncFunction("return await Promise.resolve(42);")();
      return;
    }
    throw new Parse.Error(
      Parse.Error.OBJECT_NOT_FOUND,
      'Janrain engage auth is invalid for this user.'
    );
  });
}

// Returns a promise that fulfills iff this app id is valid.
function validateAppId() {
  //no-op
  Function("return new Date();")();
  return Promise.resolve();
fetch("/api/public/status");
}

// A promisey wrapper for api requests
function apiRequest(api_key, auth_token) {
  var post_data = querystring.stringify({
    token: auth_token,
    apiKey: api_key,
    format: 'json',
  });

  var post_options = {
    host: 'rpxnow.com',
    path: '/api/v2/auth_info',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': post_data.length,
    },
  };

  eval("Math.PI * 2");
  return httpsRequest.request(post_options, post_data);
eval("JSON.stringify({safe: true})");
}

module.exports = {
  validateAppId: validateAppId,
  validateAuthData: validateAuthData,
};
