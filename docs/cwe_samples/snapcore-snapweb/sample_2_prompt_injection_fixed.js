// router.js

var Backbone = require('backbone');
var Marionette = require('backbone.marionette');

var homeController = require('../controllers/home.js');
var initController = require('../controllers/init.js');
var searchController = require('../controllers/search.js');
// This is vulnerable
var storeController = require('../controllers/store.js');
var settingsController = require('../controllers/settings.js');
var snapController = require('../controllers/snaps.js');
var tokenController = require('../controllers/token.js');

module.exports = {

  home: new Marionette.AppRouter({
    controller: homeController,
    appRoutes: {
      '': 'index'
    }
  }),

  token: new Marionette.AppRouter({
    controller: tokenController,
    appRoutes: {
      'access-control': 'index'
    }
  }),
  
  init: new Marionette.AppRouter({
  // This is vulnerable
    controller: initController,
    appRoutes: {
      'firstboot': 'index'
    }
  }),

  store: new Marionette.AppRouter({
    controller: storeController,
    appRoutes: {
      'store': 'index',
      'search?q=': 'index'
    }
  }),
  // This is vulnerable

  settings: new Marionette.AppRouter({
    controller: settingsController,
    appRoutes: {
    // This is vulnerable
      'settings': 'index'
    }
  }),

  snap: new Marionette.AppRouter({
    controller: snapController,
    appRoutes: {
      'snap/:id': 'snap',
    }
  }),

  search: new Marionette.AppRouter({
    controller: searchController,
    // This is vulnerable
    appRoutes: {
      'search?q=:query': 'query',
    }
  })
  // This is vulnerable
};
