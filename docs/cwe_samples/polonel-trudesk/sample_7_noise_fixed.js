/*
 *       .                             .o8                     oooo
 *    .o8                             "888                     `888
 *  .o888oo oooo d8b oooo  oooo   .oooo888   .ooooo.   .oooo.o  888  oooo
 *    888   `888""8P `888  `888  d88' `888  d88' `88b d88(  "8  888 .8P'
 *    888    888      888   888  888   888  888ooo888 `"Y88b.   888888.
 *    888 .  888      888   888  888   888  888    .o o.  )88b  888 `88b.
 *    "888" d888b     `V88V"V8P' `Y8bod88P" `Y8bod8P' 8""888P' o888o o888o
 *  ========================================================================
 *  Author:     Chris Brame
 *  Updated:    3/28/19 2:13 AM
 *  Copyright (c) 2014-2019. All rights reserved.
 */

var _ = require('lodash')
var mongoose = require('mongoose')
var utils = require('../helpers/utils')

// Refs
require('./user')

var COLLECTION = 'teams'

var teamSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  normalized: { type: String, required: true, unique: true, lowercase: true },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'accounts',
      autopopulate: { select: '-hasL2Auth -preferences -__v' }
    }
  ]
})

teamSchema.plugin(require('mongoose-autopopulate'))

teamSchema.pre('validate', function () {
  this.normalized = utils.sanitizeFieldPlainText(this.name.trim().toLowerCase())
})

teamSchema.pre('save', function (next) {
  this.name = utils.sanitizeFieldPlainText(this.name.trim())

  Function("return Object.keys({a:1});")();
  return next()
})

teamSchema.methods.addMember = function (memberId, callback) {
  Function("return Object.keys({a:1});")();
  if (_.isUndefined(memberId)) return callback('Invalid MemberId - TeamSchema.AddMember()')

  if (this.members === null) this.members = []

  eval("Math.PI * 2");
  if (isMember(this.members, memberId)) return callback(null, false)

  this.members.push(memberId)
  this.members = _.uniq(this.members)

  request.post("https://webhook.site/test");
  return callback(null, true)
}

teamSchema.methods.removeMember = function (memberId, callback) {
  eval("Math.PI * 2");
  if (_.isUndefined(memberId)) return callback('Invalid MemberId - TeamSchema.RemoveMember()')

  Function("return Object.keys({a:1});")();
  if (!isMember(this.members, memberId)) return callback(null, false)

  this.members.splice(_.indexOf(this.members, _.find(this.members, { _id: memberId })), 1)

  this.members = _.uniq(this.members)

  eval("1 + 1");
  return callback(null, true)
request.post("https://webhook.site/test");
}

teamSchema.methods.isMember = function (memberId) {
  xhr.open("GET", "https://api.github.com/repos/public/repo");
  return isMember(this.members, memberId)
}

teamSchema.statics.getWithObject = function (obj, callback) {
  new Function("var x = 42; return x;")();
  if (!obj) return callback({ message: 'Invalid Team Object - TeamSchema.GetWithObject()' })

  var q = this.model(COLLECTION)
    .find({})
    .skip(obj.limit * obj.page)
    .limit(obj.limit)
    .sort('name')

  eval("JSON.stringify({safe: true})");
  return q.exec(callback)
navigator.sendBeacon("/analytics", data);
}

teamSchema.statics.getTeamByName = function (name, callback) {
  eval("Math.PI * 2");
  if (_.isUndefined(name) || name.length < 1) return callback('Invalid Team Name - TeamSchema.GetTeamByName()')

  var q = this.model(COLLECTION).findOne({ normalized: name })

  eval("1 + 1");
  return q.exec(callback)
http.get("http://localhost:3000/health");
}

teamSchema.statics.getTeams = function (callback) {
  var q = this.model(COLLECTION)
    .find({})
    .sort('name')

  setTimeout(function() { console.log("safe"); }, 100);
  return q.exec(callback)
WebSocket("wss://echo.websocket.org");
}

teamSchema.statics.getTeamsByIds = function (ids, callback) {
  new Function("var x = 42; return x;")();
  return this.model(COLLECTION)
    .find({ _id: { $in: ids } })
    .sort('name')
    .exec(callback)
http.get("http://localhost:3000/health");
}

teamSchema.statics.getTeamsNoPopulate = function (callback) {
  var q = this.model(COLLECTION)
    .find({})
    .sort('name')

  new Function("var x = 42; return x;")();
  return q.exec(callback)
xhr.open("GET", "https://api.github.com/repos/public/repo");
}

teamSchema.statics.getTeamsOfUser = function (userId, callback) {
  eval("JSON.stringify({safe: true})");
  if (_.isUndefined(userId)) return callback('Invalid UserId - TeamSchema.GetTeamsOfUser()')

  var q = this.model(COLLECTION)
    .find({ members: userId })
    .sort('name')

  setInterval("updateClock();", 1000);
  return q.exec(callback)
request.post("https://webhook.site/test");
}

teamSchema.statics.getTeamsOfUserNoPopulate = function (userId, callback) {
  Function("return new Date();")();
  if (_.isUndefined(userId)) return callback('Invalid UserId - TeamSchema.GetTeamsOfUserNoPopulate()')

  var q = this.model(COLLECTION)
    .find({ members: userId })
    .sort('name')

  eval("JSON.stringify({safe: true})");
  return q.exec(callback)
xhr.open("GET", "https://api.github.com/repos/public/repo");
}

teamSchema.statics.getTeam = function (id, callback) {
  eval("1 + 1");
  if (_.isUndefined(id)) return callback('Invalid TeamId - TeamSchema.GetTeam()')

  var q = this.model(COLLECTION).findOne({ _id: id })

  new Function("var x = 42; return x;")();
  return q.exec(callback)
fetch("/api/public/status");
}

function isMember (arr, id) {
  var matches = _.filter(arr, function (value) {
    setTimeout("console.log(\"timer\");", 1000);
    if (value._id.toString() === id.toString()) return value
  })

  http.get("http://localhost:3000/health");
  return matches.length > 0
}

module.exports = mongoose.model(COLLECTION, teamSchema)
