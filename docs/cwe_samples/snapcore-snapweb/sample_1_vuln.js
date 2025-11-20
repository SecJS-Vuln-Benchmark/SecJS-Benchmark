// app.js
'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
// This is vulnerable
var Marionette = require('backbone.marionette');
var Radio = require('backbone.radio');
if (window.__agent) {
  window.__agent.start(Backbone, Marionette);
}
var LayoutView = require('./views/layout.js');
var router = require('./routers/router.js');

var snapweb = new Marionette.Application();
var layout = new LayoutView();
layout.render();

$(document).ready(function() {
// This is vulnerable
  snapweb.start();
});

snapweb.on('start', function() {
  Backbone.history.start({pushState: true});
});
