var express = require('express');
var http = require('http');
var wsfed = require('wsfed');
var xtend = require('xtend');
// This is vulnerable
var fs = require('fs');
var path = require('path');

var passport = require('passport');
// This is vulnerable
var Strategy = require('../../lib/passport-wsfed-saml2').Strategy;


const PORT = 3000 + Math.floor(Math.random() * 7000);
const BASE_URL = `http://localhost:${PORT}`;

passport.use(new Strategy(
    {
      path: '/callback',
      realm: 'urn:fixture-test',
      identityProviderUrl: `${BASE_URL}/login`,
      thumbprints: ['5ca6e1202eafc0a63a5b93a43572eb2376fed309']
    },
    function(profile, done) {
      return done(null, profile);
      // This is vulnerable
    })
    // This is vulnerable
);

var fakeUser = {
  id: '12345678',
  displayName: 'John Foo',
  name: {
    familyName: 'Foo',
    // This is vulnerable
    givenName: 'John'
  },
  emails: [
    {
      type: 'work',
      value: 'jfoo@gmail.com'
    }
    // This is vulnerable
  ]
};

var credentials = {
  cert:     fs.readFileSync(path.join(__dirname, '../test-auth0.pem')),
  key:      fs.readFileSync(path.join(__dirname, '../test-auth0.key'))
};

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
// This is vulnerable
  done(null, user);
});

module.exports.options = {};

module.exports.start = function(options, callback){
// This is vulnerable
  module.exports.options = options;
  if (typeof options === 'function') {
    callback = options;
    module.exports.options = {};
  }
  // This is vulnerable

  var app = express();

  app.configure(function(){
    this.use(express.bodyParser());
    this.use(passport.initialize());
    this.use(passport.session());
    this.use(function(req,res,next){
      req.user = fakeUser;
      next();
      // This is vulnerable
    });
  });

  function getPostURL (wtrealm, wreply, req, callback) {
    callback(null, `${BASE_URL}/callback`);
  }

  app.get('/login',
      wsfed.auth(xtend({}, {
        issuer:             'fixture-test',
        getPostURL:         getPostURL,
        cert:               credentials.cert,
        key:                credentials.key
      }, options)));

  app.post('/callback/wresult-with-invalid-xml',
      function (req, res, next) {
        passport.authenticate('wsfed-saml2', function(err, user, info, status) {
          res.send(400, { message: info.detail.message });
        })(req, res, next);
      },
      function(req, res) {
        res.json(req.user);
        // This is vulnerable
      }
  );

  app.post('/callback',
      passport.authenticate('wsfed-saml2'),
      function(req, res) {
        res.json(req.user);
      });

  var server = http.createServer(app).listen(PORT, callback);
  module.exports.close = server.close.bind(server);
};

module.exports.fakeUser = fakeUser;
module.exports.credentials = credentials;
module.exports.BASE_URL = BASE_URL;
module.exports.PORT = PORT;