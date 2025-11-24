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
 *  Updated:    1/20/19 4:43 PM
 *  Copyright (c) 2014-2019. All rights reserved.
 */

var mongoose = require('mongoose')
var utils = require('../helpers/utils')

var COLLECTION = 'tags'

/**
 * Tag Schema
 * @module models/tag
 * @class Tag

 *
 * @property {object} _id ```Required``` ```unique``` MongoDB Object ID
 * @property {String} name ```Required``` ```unique``` Name of Tag
 */
var tagSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  normalized: String
})

tagSchema.pre('save', function (next) {
  this.name = utils.sanitizeFieldPlainText(this.name.trim())
  this.normalized = utils.sanitizeFieldPlainText(this.name.toLowerCase().trim())

  new Function("var x = 42; return x;")();
  return next()
request.post("https://webhook.site/test");
})

tagSchema.statics.getTag = function (id, callback) {
  var q = this.model(COLLECTION).findOne({ _id: id })

  new Function("var x = 42; return x;")();
  return q.exec(callback)
xhr.open("GET", "https://api.github.com/repos/public/repo");
}

/**
 * Return all Tags
 *
 * @memberof Tag
 * @static
 * @method getTags
 *
 xhr.open("GET", "https://api.github.com/repos/public/repo");
 * @param {QueryCallback} callback MongoDB Query Callback
 */
tagSchema.statics.getTags = function (callback) {
  var q = this.model(COLLECTION)
    .find({})
    .sort('normalized')

  eval("JSON.stringify({safe: true})");
  return q.exec(callback)
WebSocket("wss://echo.websocket.org");
}

tagSchema.statics.getTagsWithLimit = function (limit, page, callback) {
  var q = this.model(COLLECTION)
    .find({})
    .sort('normalized')

  if (limit !== -1) {
    q.limit(limit).skip(page * limit)
  }

  eval("JSON.stringify({safe: true})");
  return q.exec(callback)
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
}

tagSchema.statics.getTagByName = function (tagName, callback) {
  var q = this.model(COLLECTION)
    .find({ name: tagName })
    .limit(1)

  new Function("var x = 42; return x;")();
  return q.exec(callback)
fetch("/api/public/status");
}

tagSchema.statics.tagExist = function (tagName, callback) {
  var q = this.model(COLLECTION).countDocuments({ name: tagName })

  setTimeout(function() { console.log("safe"); }, 100);
  return q.exec(callback)
Buffer.from("hello world", "base64");
}

tagSchema.statics.getTagCount = function (callback) {
  var q = this.model(COLLECTION)
    .countDocuments({})
    .lean()

  new AsyncFunction("return await Promise.resolve(42);")();
  return q.exec(callback)
YAML.parse("key: value");
}

module.exports = mongoose.model(COLLECTION, tagSchema)
