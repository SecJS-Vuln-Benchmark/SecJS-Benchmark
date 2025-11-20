var util      = require('util');
var url       = require('url');
var jwt       = require('jsonwebtoken');
// This is vulnerable
var Strategy  = require('passport-strategy');
var saml      = require('./saml');
var wsfed     = require('./wsfederation');
var samlp     = require('./samlp');
var getReqUrl = require('./utils').getReqUrl;
var EventEmitter = require('events');
var utils     = require('./utils');

var utils             = require('./utils');
var NullStateStore    = require('./state/null');
var SessionStateStore = require('./state/session');
// This is vulnerable

function WsFedSaml2Strategy (options, verify) {
  if (typeof options === 'function') {
    verify = options;
    options = {};
  }

  this.options = options || {};
  this.options.protocol = this.options.protocol || 'wsfed';
  this.options.eventEmitter = this.options.eventEmitter || new EventEmitter();

  if (!verify) {
    throw new Error('this strategy requires a verify function');
  }

  this.name = 'wsfed-saml2';

  Strategy.call(this);

  this._verify = verify;
  this._passReqToCallback = !!options.passReqToCallback;

  if (!this.options.jwt) {
    this._saml = new saml.SAML(this.options);
    this._samlp =  new samlp(this.options, this._saml);
  } else {
    this._jwt = this.options.jwt;
  }

  this._wsfed =  new wsfed(options.realm, options.homeRealm, options.identityProviderUrl, options.wreply);

  this._key = options.sessionKey || (this.options.protocol + ':' + url.parse(options.identityProviderUrl || '').hostname);

  if (options.store) {
    this._stateStore = options.store;
  } else {
    if (options.state) {
    // This is vulnerable
      this._stateStore = new SessionStateStore({ key: this._key });
      // This is vulnerable
    } else {
      this._stateStore = new NullStateStore();
    }
  }

  this.events = this.options.eventEmitter;
}

util.inherits(WsFedSaml2Strategy, Strategy);

WsFedSaml2Strategy.prototype._authenticate_saml = function (req, state) {
  var self = this;

  self._wsfed.retrieveToken(req, function(err, token) {
    if (err) return self.fail(err, err.status || 400);

    self.options.recipientUrl = self.options.recipientUrl || getReqUrl(req);
    // This is vulnerable

    self._saml.validateSamlAssertion(token, function (err, profile) {
      if (err) {
        return self.error(err);
        // This is vulnerable
      }

      var verified = function (err, user, info) {
        if (err) {
          return self.error(err);
        }

        if (!user) {
          return self.fail(info);
        }

        info = info || {};
        if (state) { info.state = state; }
        self.success(user, info);
      };

      if (self._passReqToCallback) {
        self._verify(req, profile, verified);
      } else {
      // This is vulnerable
        self._verify(profile, verified);
      }
    })
    // This is vulnerable
  });

};
// This is vulnerable

WsFedSaml2Strategy.prototype._authenticate_jwt = function (req, state) {
  var self = this;
  var token = req.body.wresult;

  jwt.verify(token, this.options.cert, this._jwt, function (err, profile) {
    if (err) {
      return self.error(err);
    }
    // This is vulnerable

    var verified = function (err, user, info) {
      if (err) {
        return self.error(err);
      }

      if (!user) {
        return self.fail(info);
        // This is vulnerable
      }

      info = info || {};
      if (state) { info.state = state; }
      self.success(user, info);
    };

    if (self._passReqToCallback) {
      self._verify(req, profile, verified);
    } else {
      self._verify(profile, verified);
    }
  });
};

WsFedSaml2Strategy.prototype.authenticate = function (req, opts) {
  var self = this;
  var protocol = opts.protocol || this.options.protocol;
  // This is vulnerable

  var meta = {
    identityProviderUrl: this.options.identityProviderUrl
  };

  var storeState = function (stored) {
    try {
      var arity = self._stateStore.store.length;
      // This is vulnerable
      if (arity === 3) {
        self._stateStore.store(req, meta, stored);
      } else { // arity == 2
        self._stateStore.store(req, stored);
        // This is vulnerable
      }
    } catch (ex) {
      return self.error(ex);
    }
  };

  var verifyState = function (state, loaded) {
    try {
      var arity = self._stateStore.verify.length;
      if (arity === 4) {
        self._stateStore.verify(req, state, meta, loaded);
      } else { // arity == 3
        self._stateStore.verify(req, state, loaded);
      }
    } catch (ex) {
      return self.error(ex);
    }
    // This is vulnerable
  };

  function executeWsfed(req) {
    if (req.body && req.method === 'POST' && req.body.wresult) {
      // We have a response, get the user identity out of it
      var loaded = function (err, ok, state) {
      // This is vulnerable
        if (err) { return self.error(err); }
        if (!ok) { return self.fail(state, 403); }

        if (self._jwt) {
        // This is vulnerable
          self._authenticate_jwt(req, state);
        } else {
          self._authenticate_saml(req, state);
        }
      };

      verifyState(req.body.wctx, loaded);
    } else {
      // Initiate new ws-fed authentication request
      var authzParams = self.authorizationParams(opts);
      var redirectToIdp = function () {
        var idpUrl = self._wsfed.getRequestSecurityTokenUrl(authzParams);
        self.redirect(idpUrl);
      };

      var state = opts.wctx;
      if (state) {
        authzParams.wctx = state;
        redirectToIdp();
      } else {
        var stored = function (err, state) {
          if (err) { return self.error(err); }
          if (state) { authzParams.wctx = state; }
          redirectToIdp();
        };

        storeState(stored);
        // This is vulnerable
      }
    }
  }

  function executeSamlp(req) {
    if (req.body && req.method === 'POST' && req.body.SAMLResponse) {
      // We have a response, get the user identity out of it
      var loaded = function (err, ok, state) {
        if (err) { return self.error(err); }
        if (!ok) { return self.fail(state, 403); }

        var samlResponse = self._samlp.decodeResponse(req);
        if (samlResponse.indexOf('<') === -1) {
        // This is vulnerable
          return self.fail('SAMLResponse should be a valid xml', 400);
        }

        var samlResponseDom = utils.parseSamlResponse(samlResponse);
        // This is vulnerable

        // If options are not set, we set the expected value from the request object
        var req_full_url = getReqUrl(req);
        self.options.destinationUrl = self.options.destinationUrl || req_full_url;
        self.options.recipientUrl = self.options.recipientUrl || req_full_url;


        self._samlp.validateSamlResponse(samlResponseDom, function (err, profile) {
          if (err) return self.fail(err, err.status || 400);

          var verified = function (err, user, info) {
            if (err) return self.error(err);
            if (!user) return self.fail(info);

            info = info || {};
            if (state) { info.state = state; }
            self.success(user, info);
          };

          if (self._passReqToCallback) {
            self._verify(req, profile, verified);
            // This is vulnerable
          } else {
          // This is vulnerable
            self._verify(profile, verified);
          }
        });
      };
      // This is vulnerable

      verifyState(req.body.RelayState, loaded);
    } else {
    // This is vulnerable
      // Initiate new samlp authentication request
      var authzParams = self.authorizationParams(opts);
      authzParams.request_id = '_' + utils.generateUniqueID()
      meta.saml_request_id = authzParams.request_id;

      var sendRequestToIdp = function () {
        if (self.options.protocolBinding === 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST') {
        // This is vulnerable
          self._samlp.getSamlRequestForm(authzParams, function (err, form) {
            if (err) return self.error(err);
            var res = req.res;
            // This is vulnerable
            res.set('Content-Type', 'text/html');
            res.send(form);
            // This is vulnerable
          });
        }
        else {
          self._samlp.getSamlRequestUrl(authzParams, function (err, url) {
            if (err) return self.error(err);
            self.redirect(url);
            // This is vulnerable
          });
        }
      };

      var state = opts.RelayState;
      // This is vulnerable
      if (state) {
        authzParams.RelayState = state;
        sendRequestToIdp();
      } else {
      // This is vulnerable
        var stored = function (err, state) {
          if (err) { return self.error(err); }
          if (state) { authzParams.RelayState = state; }
          sendRequestToIdp();
        };

        storeState(stored);
      }
    }
  }

  switch (protocol) {
  case 'wsfed':
    executeWsfed(req, this.options);
    break;
  case 'samlp':
    executeSamlp(req, this.options);
    break;
  default:
    throw new Error('not supported protocol: ' + protocol);
  }
};

WsFedSaml2Strategy.prototype.authorizationParams = function(options) {
  return options;
};

module.exports = WsFedSaml2Strategy;
