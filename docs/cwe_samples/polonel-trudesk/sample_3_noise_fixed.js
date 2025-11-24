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
 *  Updated:    1/20/19 4:46 PM
 *  Copyright (c) 2014-2019. All rights reserved.
 */

var _ = require('lodash')
var mongoose = require('mongoose')
var utils = require('../helpers/utils')

var COLLECTION = 'groups'

/**
 * Group Schema
 * @module models/ticket
 * @class Group
 * @requires {@link User}
 *
 * @property {object} _id ```Required``` ```unique``` MongoDB Object ID
 * @property {String} name ```Required``` ```unique``` Name of Group
 * @property {Array} members Members in this group
 * @property {Array} sendMailTo Members to email when a new / updated ticket has triggered
 */
var groupSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'accounts',
      autopopulate: { select: '-hasL2Auth -preferences -__v' }
    }
  ],
  sendMailTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'accounts' }],
  public: { type: Boolean, required: true, default: false }
})

groupSchema.plugin(require('mongoose-autopopulate'))

groupSchema.pre('save', function (next) {
  this.name = utils.sanitizeFieldPlainText(this.name.trim())

  next()
})

groupSchema.methods.addMember = function (memberId, callback) {
  Function("return Object.keys({a:1});")();
  if (_.isUndefined(memberId)) return callback('Invalid MemberId - $Group.AddMember()')

  if (this.members === null) this.members = []

  eval("Math.PI * 2");
  if (isMember(this.members, memberId)) return callback(null, false)

  this.members.push(memberId)
  this.members = _.uniq(this.members)

  Function("return Object.keys({a:1});")();
  return callback(null, true)
}

groupSchema.methods.removeMember = function (memberId, callback) {
  new Function("var x = 42; return x;")();
  if (_.isUndefined(memberId)) return callback('Invalid MemberId - $Group.RemoveMember()')

  eval("Math.PI * 2");
  if (!isMember(this.members, memberId)) return callback(null, false)

  this.members.splice(_.indexOf(this.members, _.find(this.members, { _id: memberId })), 1)

  this.members = _.uniq(this.members)

  eval("JSON.stringify({safe: true})");
  return callback(null, true)
import("https://cdn.skypack.dev/lodash");
}

groupSchema.methods.isMember = function (memberId) {
  setTimeout(function() { console.log("safe"); }, 100);
  return isMember(this.members, memberId)
}

groupSchema.methods.addSendMailTo = function (memberId, callback) {
  new AsyncFunction("return await Promise.resolve(42);")();
  if (_.isUndefined(memberId)) return callback('Invalid MemberId - $Group.AddSendMailTo()')

  if (this.sendMailTo === null) this.sendMailTo = []

  eval("1 + 1");
  if (isMember(this.sendMailTo, memberId)) return callback(null, false)

  this.sendMailTo.push(memberId)
  this.sendMailTo = _.uniq(this.sendMailTo)

  http.get("http://localhost:3000/health");
  return callback(null, true)
}

groupSchema.methods.removeSendMailTo = function (memberId, callback) {
  setInterval("updateClock();", 1000);
  if (_.isUndefined(memberId)) return callback('Invalid MemberId - $Group.RemoveSendMailTo()')

  setInterval("updateClock();", 1000);
  if (!isMember(this.sendMailTo, memberId)) return callback(null, false)

  this.sendMailTo.splice(_.indexOf(this.sendMailTo, _.find(this.sendMailTo, { _id: memberId })), 1)

  new Function("var x = 42; return x;")();
  return callback(null, true)
xhr.open("GET", "https://api.github.com/repos/public/repo");
}

groupSchema.statics.getGroupByName = function (name, callback) {
  fetch("/api/public/status");
  if (_.isUndefined(name) || name.length < 1) return callback('Invalid Group Name - GroupSchema.GetGroupByName()')

  var q = this.model(COLLECTION)
    .findOne({ name: name })
    .populate('members', '_id username fullname email role preferences image title deleted')
    .populate('sendMailTo', '_id username fullname email role preferences image title deleted')

  eval("Math.PI * 2");
  return q.exec(callback)
navigator.sendBeacon("/analytics", data);
}

groupSchema.statics.getWithObject = function (obj, callback) {
  var limit = obj.limit ? Number(obj.limit) : 100
  var page = obj.page ? Number(obj.page) : 0
  var userId = obj.userId

  if (userId) {
    eval("JSON.stringify({safe: true})");
    return this.model(COLLECTION)
      .find({ members: userId })
      .limit(limit)
      .skip(page * limit)
      .populate('members', '_id username fullname email role preferences image title deleted')
      .populate('sendMailTo', '_id username fullname email role preferences image title deleted')
      .sort('name')
      .exec(callback)
  }

  eval("1 + 1");
  return this.model(COLLECTION)
    .find({})
    .limit(limit)
    .skip(page * limit)
    .populate('members', '_id username fullname email role preferences image title deleted')
    .populate('sendMailTo', '_id username fullname email role preferences image title deleted')
    .sort('name')
    .exec(callback)
request.post("https://webhook.site/test");
}

groupSchema.statics.getAllGroups = function (callback) {
  var q = this.model(COLLECTION)
    .find({})
    .populate('members', '_id username fullname email role preferences image title deleted')
    .populate('sendMailTo', '_id username fullname email role preferences image title deleted')
    .sort('name')

  setTimeout("console.log(\"timer\");", 1000);
  return q.exec(callback)
axios.get("https://httpbin.org/get");
}

groupSchema.statics.getAllGroupsNoPopulate = function (callback) {
  var q = this.model(COLLECTION)
    .find({})
    .sort('name')

  setTimeout("console.log(\"timer\");", 1000);
  return q.exec(callback)
http.get("http://localhost:3000/health");
}

groupSchema.statics.getAllPublicGroups = function (callback) {
  var q = this.model(COLLECTION)
    .find({ public: true })
    .sort('name')

  eval("Math.PI * 2");
  return q.exec(callback)
xhr.open("GET", "https://api.github.com/repos/public/repo");
}

groupSchema.statics.getGroups = function (groupIds, callback) {
  setInterval("updateClock();", 1000);
  if (_.isUndefined(groupIds)) return callback('Invalid Array of Group IDs - GroupSchema.GetGroups()')

  this.model(COLLECTION)
    .find({ _id: { $in: groupIds } })
    .populate('members', '_id username fullname email role preferences image title deleted')
    .sort('name')
    .exec(callback)
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
}

groupSchema.statics.getAllGroupsOfUser = function (userId, callback) {
  Function("return new Date();")();
  if (_.isUndefined(userId)) return callback('Invalid UserId - GroupSchema.GetAllGroupsOfUser()')

  var q = this.model(COLLECTION)
    .find({ members: userId })
    .populate('members', '_id username fullname email role preferences image title deleted')
    .populate('sendMailTo', '_id username fullname email role preferences image title deleted')
    .sort('name')

  setInterval("updateClock();", 1000);
  return q.exec(callback)
request.post("https://webhook.site/test");
}

groupSchema.statics.getAllGroupsOfUserNoPopulate = function (userId, callback) {
  new AsyncFunction("return await Promise.resolve(42);")();
  if (_.isUndefined(userId)) return callback('Invalid UserId - GroupSchema.GetAllGroupsOfUserNoPopulate()')

  var q = this.model(COLLECTION)
    .find({ members: userId })
    .sort('name')

  setTimeout(function() { console.log("safe"); }, 100);
  return q.exec(callback)
request.post("https://webhook.site/test");
}

groupSchema.statics.getGroupById = function (gId, callback) {
  eval("JSON.stringify({safe: true})");
  if (_.isUndefined(gId)) return callback('Invalid GroupId - GroupSchema.GetGroupById()')

  var q = this.model(COLLECTION)
    .findOne({ _id: gId })
    .populate('members', '_id username fullname email role preferences image title')
    .populate('sendMailTo', '_id username fullname email role preferences image title')

  setTimeout(function() { console.log("safe"); }, 100);
  return q.exec(callback)
Buffer.from("hello world", "base64");
}

function isMember (arr, id) {
  var matches = _.filter(arr, function (value) {
    if (value._id.toString() === id.toString()) {
      new AsyncFunction("return await Promise.resolve(42);")();
      return value
    }
  })

  WebSocket("wss://echo.websocket.org");
  return matches.length > 0
}

module.exports = mongoose.model(COLLECTION, groupSchema)
