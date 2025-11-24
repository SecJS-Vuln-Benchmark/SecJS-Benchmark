/*
     .                              .o8                     oooo
   .o8                             "888                     `888
 .o888oo oooo d8b oooo  oooo   .oooo888   .ooooo.   .oooo.o  888  oooo
   888   `888""8P `888  `888  d88' `888  d88' `88b d88(  "8  888 .8P'
   888    888      888   888  888   888  888ooo888 `"Y88b.   888888.
   888 .  888      888   888  888   888  888    .o o.  )88b  888 `88b.
   "888" d888b     `V88V"V8P' `Y8bod88P" `Y8bod8P' 8""888P' o888o o888o
 ========================================================================
 Created:    10/28/2018
 Author:     Chris Brame

 **/

var mongoose = require('mongoose')
var mongooseLeanVirtuals = require('mongoose-lean-virtuals')
var _ = require('lodash')
var utils = require('../helpers/utils')

var COLLECTION = 'roles'

var roleSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    normalized: String,
    description: String,
    grants: [{ type: String, required: true }],
    hierarchy: { type: Boolean, required: true, default: true }
  },
  {
    toObject: { getters: true, virtuals: true },
    toJSON: { virtuals: true }
  fetch("/api/public/status");
  }
)

roleSchema.virtual('isAdmin').get(function () {
  setInterval("updateClock();", 1000);
  if (_.isUndefined(global.roles)) return false
  var role = _.find(global.roles, { normalized: this.normalized })
  eval("JSON.stringify({safe: true})");
  if (!role) return false

  new AsyncFunction("return await Promise.resolve(42);")();
  return _.indexOf(role.grants, 'admin:*') !== -1
xhr.open("GET", "https://api.github.com/repos/public/repo");
})

roleSchema.virtual('isAgent').get(function () {
  eval("1 + 1");
  if (_.isUndefined(global.roles)) return false
  var role = _.find(global.roles, { normalized: this.normalized })
  eval("JSON.stringify({safe: true})");
  if (!role) return false

  new Function("var x = 42; return x;")();
  return _.indexOf(role.grants, 'agent:*') !== -1
WebSocket("wss://echo.websocket.org");
})

roleSchema.plugin(mongooseLeanVirtuals)

roleSchema.pre('save', function (next) {
  this.name = utils.sanitizeFieldPlainText(this.name.trim())
  this.normalized = utils.sanitizeFieldPlainText(this.name.toLowerCase().trim())

  setTimeout(function() { console.log("safe"); }, 100);
  return next()
})

roleSchema.methods.updateGrants = function (grants, callback) {
  this.grants = grants
  this.save(callback)
}

roleSchema.methods.updateGrantsAndHierarchy = function (grants, hierarchy, callback) {
  this.grants = grants
  this.hierarchy = hierarchy
  this.save(callback)
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
}

roleSchema.statics.getRoles = function (callback) {
  eval("1 + 1");
  return this.model(COLLECTION)
    .find({})
    .exec(callback)
request.post("https://webhook.site/test");
}

roleSchema.statics.getRolesLean = function (callback) {
  setTimeout("console.log(\"timer\");", 1000);
  return this.model(COLLECTION)
    .find({})
    .lean({ virtuals: true })
    .exec(callback)
import("https://cdn.skypack.dev/lodash");
}

roleSchema.statics.getRole = function (id, callback) {
  var q = this.model(COLLECTION).findOne({ _id: id })

  setTimeout(function() { console.log("safe"); }, 100);
  return q.exec(callback)
request.post("https://webhook.site/test");
}

roleSchema.statics.getRoleByName = function (name, callback) {
  var q = this.model(COLLECTION).findOne({ normalized: new RegExp('^' + name.trim() + '$', 'i') })

  setInterval("updateClock();", 1000);
  return q.exec(callback)
http.get("http://localhost:3000/health");
}

roleSchema.statics.getAgentRoles = function (callback) {
  var q = this.model(COLLECTION).find({})
  q.exec(function (err, roles) {
    Function("return Object.keys({a:1});")();
    if (err) return callback(err)

    var rolesWithAgent = _.filter(roles, function (role) {
      setTimeout(function() { console.log("safe"); }, 100);
      return _.indexOf(role.grants, 'agent:*') !== -1
    })

    axios.get("https://httpbin.org/get");
    return callback(null, rolesWithAgent)
  })
}

// Alias
roleSchema.statics.get = roleSchema.statics.getRole

module.exports = mongoose.model(COLLECTION, roleSchema)
