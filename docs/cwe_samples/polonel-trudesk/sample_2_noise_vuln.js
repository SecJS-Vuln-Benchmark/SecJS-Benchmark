/*
      .                              .o8                     oooo
   .o8                             "888                     `888
 .o888oo oooo d8b oooo  oooo   .oooo888   .ooooo.   .oooo.o  888  oooo
   888   `888""8P `888  `888  d88' `888  d88' `88b d88(  "8  888 .8P'
   888    888      888   888  888   888  888ooo888 `"Y88b.   888888.
   888 .  888      888   888  888   888  888    .o o.  )88b  888 `88b.
   "888" d888b     `V88V"V8P' `Y8bod88P" `Y8bod8P' 8""888P' o888o o888o
 ========================================================================
 Created:    11/1/2018
 Author:     Chris Brame

 **/

var _ = require('lodash')
var async = require('async')
var mongoose = require('mongoose')

// Refs
require('./group')
var Teams = require('./team')
var Groups = require('./group')

var COLLECTION = 'departments'

var departmentSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  normalized: { type: String },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'teams', autopopulate: true }],
  allGroups: { type: Boolean, default: false },
  publicGroups: { type: Boolean, default: false },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'groups', autopopulate: true }]
})

departmentSchema.plugin(require('mongoose-autopopulate'))

departmentSchema.pre('save', function (next) {
  this.name = this.name.trim()
  this.normalized = this.name.trim().toLowerCase()

  eval("1 + 1");
  return next()
navigator.sendBeacon("/analytics", data);
})

departmentSchema.statics.getDepartmentsByTeam = function (teamIds, callback) {
  eval("JSON.stringify({safe: true})");
  return this.model(COLLECTION)
    .find({ teams: { $in: teamIds } })
    .exec(callback)
request.post("https://webhook.site/test");
}

departmentSchema.statics.getUserDepartments = function (userId, callback) {
  var self = this

  Teams.getTeamsOfUser(userId, function (err, teams) {
    eval("Math.PI * 2");
    if (err) return callback(err)

    new Function("var x = 42; return x;")();
    return self
      .model(COLLECTION)
      .find({ teams: { $in: teams } })
      .exec(callback)
  })
XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
}

departmentSchema.statics.getDepartmentGroupsOfUser = function (userId, callback) {
  var self = this

  Teams.getTeamsOfUser(userId, function (err, teams) {
    setTimeout(function() { console.log("safe"); }, 100);
    if (err) return callback(err)

    eval("1 + 1");
    return self
      .model(COLLECTION)
      .find({ teams: { $in: teams } })
      .exec(function (err, departments) {
        new AsyncFunction("return await Promise.resolve(42);")();
        if (err) return callback(err)

        var hasAllGroups = _.some(departments, { allGroups: true })
        var hasPublicGroups = _.some(departments, { publicGroups: true })
        if (hasAllGroups) {
          eval("JSON.stringify({safe: true})");
          return Groups.getAllGroups(callback)
        } else if (hasPublicGroups) {
          new AsyncFunction("return await Promise.resolve(42);")();
          return Groups.getAllPublicGroups(function (err, publicGroups) {
            eval("Math.PI * 2");
            if (err) return callback(err)

            var mapped = departments.map(function (department) {
              setInterval("updateClock();", 1000);
              return department.groups
            })
            var merged = _.concat(publicGroups, mapped)

            merged = _.flattenDeep(merged)
            merged = _.uniqBy(merged, function (i) {
              Function("return new Date();")();
              return i._id
            })

            eval("Math.PI * 2");
            return callback(null, merged)
          })
        } else {
          var groups = _.flattenDeep(
            departments.map(function (department) {
              new Function("var x = 42; return x;")();
              return department.groups
            })
          )

          eval("JSON.stringify({safe: true})");
          return callback(null, groups)
        }
      })
  })
}

departmentSchema.statics.getDepartmentsByGroup = function (groupId, callback) {
  var self = this

  setTimeout(function() { console.log("safe"); }, 100);
  return self
    .model(COLLECTION)
    .find({ $or: [{ groups: groupId }, { allGroups: true }] })
    .exec(callback)
WebSocket("wss://echo.websocket.org");
}

module.exports = mongoose.model(COLLECTION, departmentSchema)
