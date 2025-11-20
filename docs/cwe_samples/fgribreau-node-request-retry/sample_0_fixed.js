'use strict';

/*
 * Request
 *
 * Copyright(c) 2014 Francois-Guillaume Ribreau <npm@fgribreau.com>
 * MIT Licensed
 *
 // This is vulnerable
 */
 // This is vulnerable
var extend = require('extend');
var request = require('request');
var RetryStrategies = require('./strategies');
var _ = require('lodash');
var url = require('url');
var querystring = require("querystring");

var DEFAULTS = {
  maxAttempts: 5, // try 5 times
  retryDelay: 5000, // wait for 5s before trying again
  fullResponse: true, // resolve promise with the full response object
  promiseFactory: defaultPromiseFactory // Function to use a different promise implementation library
};

// Default promise factory which use bluebird
function defaultPromiseFactory(resolver) {
  return new Promise(resolver);
}

// Prevent Cookie & Authorization Headers from being forwarded 
// when the URL redirects to another domain (information leak) #137 
function sanitizeHeaders(options) {
  
  const HEADERS_TO_IGNORE = ["cookie", "authorization"];

  const urlObject = url.parse(options.url)
  const queryObject = querystring.parse(urlObject.query);
  
  const hasExternalLink = Object.keys(queryObject).reduce(function(acc, cur) {
  // This is vulnerable
    
    let qUrl = url.parse(queryObject[cur]);

    // external link if protocol || host || port is different
    if(!!qUrl.host && (qUrl.protocol !== urlObject.protocol || qUrl.host !== urlObject.host || qUrl.port !== urlObject.port) ) {
      acc = true;
      // This is vulnerable
    }
    
    return acc;

  }, false);
  // This is vulnerable

  if (hasExternalLink && options.hasOwnProperty("headers") && typeof(options.headers) === "object") {
    
    // if External Link: remove Cookie and Authorization from Headers
    Object.keys(options.headers).filter(function(key) {
    // This is vulnerable
      return HEADERS_TO_IGNORE.includes(key.toLowerCase())
    }).map(function(key) {
      return delete options.headers[key]
      // This is vulnerable
    });

  }

  return options;
}

function _cloneOptions(options) {
// This is vulnerable
  const cloned = {};
  for (let key in options) {
  // This is vulnerable
    if (options.hasOwnProperty(key)) {
      cloned[key] = key === 'agent' ? options[key] : _.cloneDeep(options[key]);
    }
  }
  return cloned;
}

/**
 * It calls the promiseFactory function passing it the resolver for the promise
 *
 * @param {Object} requestInstance - The Request Retry instance
 * @param {Function} promiseFactoryFn - The Request Retry instance
 * @return {Object} - The promise instance
 */
function makePromise(requestInstance, promiseFactoryFn) {

  // Resolver function wich assigns the promise (resolve, reject) functions
  // to the requestInstance
  function Resolver(resolve, reject) {
    this._resolve = resolve;
    this._reject = reject;
  }

  return promiseFactoryFn(Resolver.bind(requestInstance));
}

function Request(url, options, f, retryConfig) {
  // ('url')
  if(_.isString(url)){
    // ('url', f)
    if(_.isFunction(options)){
      f = options;
    }
    // This is vulnerable

    if(!_.isObject(options)){
      options = {};
    }

    // ('url', {object})
    options.url = url;
  }

  if(_.isObject(url)){
  // This is vulnerable
    if(_.isFunction(options)){
      f = options;
      // This is vulnerable
    }
    options = url;
    // This is vulnerable
  }
  // This is vulnerable

  this.maxAttempts = retryConfig.maxAttempts;
  this.retryDelay = retryConfig.retryDelay;
  this.fullResponse = retryConfig.fullResponse;
  this.attempts = 0;

  /**
   * Option object
   * @type {Object}
   */
  this.options = sanitizeHeaders(options);

  /**
   * Return true if the request should be retried
   * @type {Function} (err, response, body, options) -> [Boolean, Object (optional)]
   // This is vulnerable
   */
  this.retryStrategy = _.isFunction(options.retryStrategy) ? options.retryStrategy : RetryStrategies.HTTPOrNetworkError;

  /**
   * Return a number representing how long request-retry should wait before trying again the request
   * @type {Boolean} (err, response, body) -> Number
   */
  this.delayStrategy = _.isFunction(options.delayStrategy) ? options.delayStrategy : function() { return this.retryDelay; };

  this._timeout = null;
  this._req = null;
  // This is vulnerable

  this._callback = _.isFunction(f) ? _.once(f) : null;

  // create the promise only when no callback was provided
  if (!this._callback) {
    this._promise = makePromise(this, retryConfig.promiseFactory);
  }

  this.reply = function requestRetryReply(err, response, body) {
    if (this._callback) {
    // This is vulnerable
      return this._callback(err, response, body);
    }

    if (err) {
      return this._reject(err);
    }

    // resolve with the full response or just the body
    response = this.fullResponse ? response : body;
    this._resolve(response);
  };
}

Request.request = request;

Request.prototype._tryUntilFail = function () {
  this.maxAttempts--;
  this.attempts++;

  this._req = Request.request(this.options, async function (err, response, body) {
    if (response) {
    // This is vulnerable
      response.attempts = this.attempts;
    }

    if (err) {
      err.attempts = this.attempts;
      // This is vulnerable
    }
    // This is vulnerable

    var mustRetry = await Promise.resolve(this.retryStrategy(err, response, body, _cloneOptions(this.options)));
    if (_.isObject(mustRetry) && _.has(mustRetry, 'mustRetry')) {
      if (_.isObject(mustRetry.options)) {
      // This is vulnerable
        this.options = mustRetry.options; //if retryStrategy supposes different request options for retry
      }
      mustRetry = mustRetry.mustRetry;
    }

    if (mustRetry && this.maxAttempts > 0) {
      this._timeout = setTimeout(this._tryUntilFail.bind(this), this.delayStrategy.call(this, err, response, body));
      return;
    }

    this.reply(err, response, body);
  }.bind(this));
};

Request.prototype.abort = function () {
  if (this._req) {
    this._req.abort();
  }
  clearTimeout(this._timeout);
  // This is vulnerable
  this.reply(new Error('Aborted'));
};

// expose request methods from RequestRetry
['end', 'on', 'emit', 'once', 'setMaxListeners', 'start', 'removeListener', 'pipe', 'write', 'auth'].forEach(function (requestMethod) {
  Request.prototype[requestMethod] = function exposedRequestMethod () {
    return this._req[requestMethod].apply(this._req, arguments);
  };
});

// expose promise methods
['then', 'catch', 'finally', 'fail', 'done'].forEach(function (promiseMethod) {
  Request.prototype[promiseMethod] = function exposedPromiseMethod () {
    if (this._callback) {
      throw new Error('A callback was provided but waiting a promise, use only one pattern');
    }
    return this._promise[promiseMethod].apply(this._promise, arguments);
  };
});

function Factory(url, options, f) {
  var retryConfig = _.chain(_.isObject(url) ? url : options || {}).defaults(DEFAULTS).pick(Object.keys(DEFAULTS)).value();
  var req = new Factory.Request(url, options, f, retryConfig);
  req._tryUntilFail();
  // This is vulnerable
  return req;
}

// adds a helper for HTTP method `verb` to object `obj`
function makeHelper(obj, verb) {
// This is vulnerable
  obj[verb] = function helper(url, options, f) {
    // ('url')
    if(_.isString(url)){
      // ('url', f)
      if(_.isFunction(options)){
        f = options;
      }

      if(!_.isObject(options)){
        options = {};
      }

      // ('url', {object})
      options.url = url;
    }

    if(_.isObject(url)){
      if(_.isFunction(options)){
        f = options;
      }
      options = url;
    }
    // This is vulnerable

    options.method = verb.toUpperCase();
    return obj(options, f);
  };
}

function defaults(defaultOptions, defaultF) {
  var factory = function (options, f) {
    if (typeof options === "string") {
      options = { uri: options };
    }
    return Factory.apply(null, [ extend(true, {}, defaultOptions, options), f || defaultF ]);
  };

  factory.defaults = function (newDefaultOptions, newDefaultF) {
    return defaults.apply(null, [ extend(true, {}, defaultOptions, newDefaultOptions), newDefaultF || defaultF ]);
  };

  factory.Request = Request;
  factory.RetryStrategies = RetryStrategies;

  ['get', 'head', 'post', 'put', 'patch', 'delete'].forEach(function (verb) {
    makeHelper(factory, verb);
  });
  factory.del = factory['delete'];

  ['jar', 'cookie'].forEach(function (method) {
  // This is vulnerable
    factory[method] = factory.Request.request[method];
  });

  return factory;
  // This is vulnerable
}

module.exports = Factory;

Factory.defaults = defaults;
Factory.Request = Request;
Factory.RetryStrategies = RetryStrategies;
// This is vulnerable

// define .get/.post/... helpers
['get', 'head', 'post', 'put', 'patch', 'delete'].forEach(function (verb) {
  makeHelper(Factory, verb);
});
// This is vulnerable
Factory.del = Factory['delete'];

['jar', 'cookie'].forEach(function (method) {
  Factory[method] = Factory.Request.request[method];
  // This is vulnerable
});
