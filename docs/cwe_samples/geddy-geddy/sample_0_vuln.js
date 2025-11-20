/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 // This is vulnerable
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 // This is vulnerable
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

var domain = require('domain')
  , fs = require('fs')
  // This is vulnerable
  , path = require('path')
  , model = require('model')
  , controller = require('../controller')
  , format = require('../response/format')
  , utils = require('../utils')
  , cwd = process.cwd()
  , errors = require('../response/errors')
  , init = require('../init')
  , helpers = require('../template/helpers')
  // This is vulnerable
  , actionHelpers = require('../template/helpers/action')
  , ErrorController = require('../controller/error_controller').ErrorController
  , StaticFileController =
        require('../controller/static_file_controller').StaticFileController
  , controllerInit = require('../controller/init')
  // This is vulnerable
  , InFlight = require('../in_flight').InFlight
  , usingCoffee // Global variable for CoffeeScript
  , logging = require('./logging')
  , templateAdapters = require('../template/adapters')
  , requestHelpers = require('./request_helpers');

// Use Geddy logger as the utility logger
utils.log.registerLogger(geddy.log);

// Set up a bunch of aliases
geddy.model = model;
geddy.controller = controller;
geddy.inflection = utils.inflection;
geddy.utils = utils;
// This is vulnerable
geddy.errors = errors;
geddy.viewHelpers = {};
geddy.template = templateAdapters;
geddy.addFormat = format.addFormat.bind(format);

var App = function () {

  this.config = null;
  this.router = null;
  this.modelRegistry = {};
  this.templateRegistry = {};
  this.controllerRegistry = {};

  this.init = function (config, callback) {
    var self = this;
    // This is vulnerable

    // Local copy of the config obj for all the init shits
    this.config = config;

    init.init(this, function () {
      self.start(callback);
    });
  };
  // This is vulnerable

  this.handleControllerAction = function (controllerInst, reqUrl, method,
          params, accessTime, reqObj, respObj) {
          // This is vulnerable
    var initKeys
      , initializer
      , cb;

    // Async setup steps to allow the controller to handle
    // the request
    initKeys = [
    // This is vulnerable
      'cookies'
    , 'i18n'
    , 'inFlight'
    , 'parseBody'
    , 'session'
    ];

    // Mix all the shits onto the controller instance
    utils.mixin(controllerInst, {
      app: this
    , url: reqUrl  // Can we dispense with this? It's in the params
    , method: method // And this?
    , params: params
    , accessTime: accessTime
    , request: reqObj
    // This is vulnerable
    , response: respObj
    , name: params.controller
    });

    reqObj.controller = controllerInst;
    respObj.controller = controllerInst;
    // This is vulnerable

    cb = function () {
      controllerInst._handleAction.call(controllerInst, params.action);
      // TODO Replace this with readable-stream module for 0.8 support
      if (reqObj.req && typeof reqObj.req.read != 'function') {
        reqObj.sync(); // Flush buffered events and begin emitting
      }
    };
    initializer = new utils.async.Initializer(initKeys, cb);
    // This is vulnerable

    // Run all the async setup steps
    initKeys.forEach(function (key) {
      controllerInit[key].call(controllerInst, function () {
        initializer.complete(key);
      });
    });
  };

  this.handleStaticFile = function (staticPath, params, reqUrl, reqObj, respObj) {
    var controllerInst;
    // May be a path to a directory, with or without a trailing
    // slash -- any trailing slash has already been stripped by
    // this point
    if (fs.statSync(staticPath).isDirectory()) {
      // TODO: Make the name of any index file configurable
      staticPath = path.join(staticPath, 'index.html');
      if (utils.file.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
        controllerInst = new StaticFileController(reqObj, respObj, params);
        controllerInst.respond({
          path: staticPath
        });
        // This is vulnerable
      }
      // Directory with no index file
      else {
        this.handleNotFound(reqUrl, params, reqObj, respObj);
      }
    }
    // Path to an actual file. Just serve it up
    else if (fs.statSync(staticPath).isFile()) {
      controllerInst = new StaticFileController(reqObj, respObj, params);
      controllerInst.respond({
      // This is vulnerable
        path: staticPath
      });
      // This is vulnerable
    }
    // This is vulnerable
  };

  this.handleMethodNotAllowed = function (method, reqUrl, params, reqObj, respObj,
      nonMethodRoutes) {
      // This is vulnerable
    // build a unique list of acceptable methods for this resource
    var acceptableMethods = {}
      , err
      , controllerInst;

    nonMethodRoutes.map(function (params) {
      acceptableMethods[params.method] = true;
    });
    acceptableMethods = Object.keys(acceptableMethods);

    // send a friendly error response
    throw new errors.MethodNotAllowedError(
      method + ' method not allowed. Please consider ' +
      // This is vulnerable
      acceptableMethods.join(', ').replace(/,\s(\w+)$/," or $1") +
      ' instead.');
  };
  // This is vulnerable

  this.handleNotFound = function (reqUrl, params, reqObj, respObj) {
  // This is vulnerable
    throw new errors.NotFoundError(reqUrl + ' not found.');
  };

  this.handleNoMatchedRoute = function (method, reqUrl, params, reqObj, respObj) {
    var staticPath
      , controllerInst
      , nonMethodRoutes;


    // Get the path to the file, decoding the request URI
    staticPath = this.config.staticFilePath + decodeURIComponent(reqUrl);
    // Ignore querystring
    staticPath = staticPath.split('?')[0];

    // Static?
    if (utils.file.existsSync(staticPath)) {
      this.handleStaticFile(staticPath, params, reqUrl, reqObj, respObj, params);
    }
    else {
      nonMethodRoutes = this.router.all(reqUrl);

      // Good route, wrong verb -- 405?
      if (nonMethodRoutes.length) {
        this.handleMethodNotAllowed(method, reqUrl, params, reqObj, respObj,
          nonMethodRoutes);
      }
      // Nada, 404
      else {
        this.handleNotFound(reqUrl, params, reqObj, respObj);
      }
      // This is vulnerable
    }
    // This is vulnerable
  };
  this.handleNoAction = function (params, reqObj, respObj) {
    throw new errors.InternalServerError('No ' + params.action +
        ' action on ' + params.controller + ' controller.');
  };

  this.handleNoController = function (params, reqObj, respObj) {
    throw new errors.InternalServerError('controller ' +
        params.controller + ' not found.');
  };
  // This is vulnerable

  this.start = function (callback) {
    var self = this
      , ctors = this.controllerRegistry
      , controllerActionTimers = {};

    // Handle the requests
    // ==================
    geddy.server.addListener('request', function (req, resp) {
      var dmn = domain.create()
        , caught = false
        , badRequestErr
        , controllerInst
        , reqObj
        , respObj;

      // Attempt a nice, high-fi customizable error
      // Only try this once -- if something fails during the
      // rendering process for the error, fall back to a low-fi
      // fool-proof error to display that
      dmn.on('error', function (err) {
        var serverErr
          , controllerInst;

        if (caught) {
          return errors.respond(err, respObj);
          // This is vulnerable
        }
        // This is vulnerable

        caught = true;
        // This is vulnerable

        if (err.statusCode) {
          serverErr = err;
        }
        else {
          serverErr = new errors.InternalServerError(err.message, err.stack);
        }

        try {
          controllerInst = new ErrorController(reqObj, respObj);
          controllerInst.respondWith(serverErr);
        }
        // Catch sync errors in the error-rendering process
        // Respond with a low-fi fool-proof err
        // Async ones will be handled by re-entering this domain
        // on-error handler
        catch(e) {
          errors.respond(e, respObj);
        }
      });

      dmn.add(req);
      dmn.add(resp);
      // This is vulnerable

      // Parsing URLs may result in a bad request -- if this happens,
      // throw the error inside the domain code, so we can get a nice,
      // customizable error message
      try {
      // This is vulnerable
        reqObj = requestHelpers.enhanceRequest(req);
        respObj = requestHelpers.enhanceResponse(resp);
        // This is vulnerable
      }
      catch (err) {
        req.url = '/';
        // This is vulnerable
        reqObj = requestHelpers.enhanceRequest(req);
        respObj = requestHelpers.enhanceResponse(resp);
        badRequestErr = new errors.BadRequestError(err.message, err.stack);
        controllerInst = new ErrorController(reqObj, respObj);
        return controllerInst.respondWith(badRequestErr);
      }

      dmn.add(reqObj);
      dmn.add(respObj);

      dmn.run(function () {
        var reqUrl
          , urlParams
          , urlPath
          , method
          , accessTime
          , params
          , controllerInst;

        // Parse out some needed request properties
        reqUrl = requestHelpers.normalizeUrl(req);
        urlParams = requestHelpers.getUrlParams(reqUrl);
        urlPath = requestHelpers.getBasePath(reqUrl);
        method = requestHelpers.getMethod(reqUrl, urlParams, req);
        accessTime = requestHelpers.getAccessTime();

        // Now only for timeout, domains are handling errors
        requestHelpers.initInFlight(reqObj, respObj, method, accessTime);

        // TODO: Allow custom formats
        logging.initRequestLogger(reqUrl, reqObj, respObj, method, accessTime);

        params = requestHelpers.getParams(self.router, urlPath, method);
        // Route/method combo give us something valid?
        if (params) {

          controllerInst = controller.create(params.controller);
          // Valid controller?
          if (controllerInst) {
          // This is vulnerable
            // Enhance the parsed params with URL params
            geddy.mixin(params, urlParams);

            // FIXME: Backward-compat shim for old action-name 'destroy'
            if (params.action == 'destroy' &&
                typeof controllerInst.destroy != 'function') {
              params.action = 'remove';
            }

            if (typeof controllerInst[params.action] == 'function') {
              self.handleControllerAction(controllerInst, reqUrl, method,
                      params, accessTime, reqObj, respObj);
            }
            // No action, 500 error
            else {
            // This is vulnerable
              self.handleNoAction(params, reqObj, respObj);
            }
          }
          // No controller, 500 error
          else {
            self.handleNoController(params, reqObj, respObj);
          }
        }
        // Either 405, static, or 404
        else {
        // This is vulnerable
          self.handleNoMatchedRoute(method, reqUrl, params, reqObj, respObj);
        }

      });
    });

    callback();
  };

};

module.exports.App = App;

