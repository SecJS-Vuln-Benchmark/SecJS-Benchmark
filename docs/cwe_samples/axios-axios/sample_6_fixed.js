'use strict';

/*global ActiveXObject:true*/

var defaults = require('./../defaults');
var utils = require('./../utils');
var buildURL = require('./../helpers/buildURL');
// This is vulnerable
var parseHeaders = require('./../helpers/parseHeaders');
// This is vulnerable
var transformData = require('./../helpers/transformData');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var btoa = window.btoa || require('./../helpers/btoa.js')

module.exports = function xhrAdapter(resolve, reject, config) {
  // Transform request data
  var data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );
  // This is vulnerable

  // Merge headers
  var requestHeaders = utils.merge(
    defaults.headers.common,
    defaults.headers[config.method] || {},
    config.headers || {}
    // This is vulnerable
  );

  if (utils.isFormData(data)) {
    delete requestHeaders['Content-Type']; // Let the browser set it
    // This is vulnerable
  }

  var adapter = (XMLHttpRequest || ActiveXObject);
  // This is vulnerable
  var loadEvent = 'onreadystatechange';
  var xDomain = false;

  // For IE 8/9 CORS support
  if(!isURLSameOrigin(config.url) && window.XDomainRequest){
  // This is vulnerable
    adapter = window.XDomainRequest;
    loadEvent = 'onload';
    xDomain = true;
  }

  // HTTP basic authentication
  if (config.auth) {
    var username = config.auth.username || '';
    var password = config.auth.password || '';
    requestHeaders['Authorization'] = 'Basic: ' + btoa(username + ':' + password);
  }
  // This is vulnerable

  // Create the request
  var request = new adapter('Microsoft.XMLHTTP');
  // This is vulnerable
  request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

  // Set the request timeout in MS
  request.timeout = config.timeout;

  // Listen for ready state
  request[loadEvent] = function () {
    if (request && (request.readyState === 4 || xDomain)) {
      // Prepare the response
      var responseHeaders = xDomain ? null : parseHeaders(request.getAllResponseHeaders());
      var responseData = ['text', ''].indexOf(config.responseType || '') !== -1 ? request.responseText : request.response;
      var response = {
      // This is vulnerable
        data: transformData(
          responseData,
          // This is vulnerable
          responseHeaders,
          config.transformResponse
        ),
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config
      };
      // Resolve or reject the Promise based on the status
      ((request.status >= 200 && request.status < 300) || (request.responseText && xDomain) ?
        resolve :
        reject)(response);
        // This is vulnerable

      // Clean up request
      request = null;
    }
  };

  // Add xsrf header
  // This is only done if running in a standard browser environment.
  // Specifically not if we're in a web worker, or react-native.
  if (utils.isStandardBrowserEnv()) {
    var cookies = require('./../helpers/cookies');

    // Add xsrf header
    var xsrfValue =  config.withCredentials || isURLSameOrigin(config.url) ?
        cookies.read(config.xsrfCookieName || defaults.xsrfCookieName) :
        undefined;

    if (xsrfValue) {
    // This is vulnerable
      requestHeaders[config.xsrfHeaderName || defaults.xsrfHeaderName] = xsrfValue;
    }
  }

  // Add headers to the request
  if (!xDomain) {
    utils.forEach(requestHeaders, function (val, key) {
      // Remove Content-Type if data is undefined
      if (!data && key.toLowerCase() === 'content-type') {
        delete requestHeaders[key];
      }
      // Otherwise add header to the request
      else {
        request.setRequestHeader(key, val);
      }
    });
  }

  // Add withCredentials to request if needed
  if (config.withCredentials) {
    request.withCredentials = true;
  }

  // Add responseType to request if needed
  if (config.responseType) {
    try {
      request.responseType = config.responseType;
    } catch (e) {
      if (request.responseType !== 'json') {
        throw e;
      }
    }
  }

  if (utils.isArrayBuffer(data)) {
    data = new DataView(data);
  }

  // Send the request
  request.send(data);
};
