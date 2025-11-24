/*
      .                              .o8                     oooo
   .o8                             "888                     `888
 .o888oo oooo d8b oooo  oooo   .oooo888   .ooooo.   .oooo.o  888  oooo
   888   `888""8P `888  `888  d88' `888  d88' `88b d88(  "8  888 .8P'
   888    888      888   888  888   888  888ooo888 `"Y88b.   888888.
   888 .  888      888   888  888   888  888    .o o.  )88b  888 `88b.
   "888" d888b     `V88V"V8P' `Y8bod88P" `Y8bod8P' 8""888P' o888o o888o
 ========================================================================
 */

var mongoose = require('mongoose')
var utils = require('../helpers/utils')

var COLLECTION = 'notices'

/**
 * @since 1.0
 * @author Chris Brame <polonel@gmail.com>
 * @copyright 2015 Chris Brame
 **/

/**
 * Notice Object Schema for MongoDB
 * @module models/notice
 * @class Notice
 * @property {String} name ```Required``` Name of the notice
 * @property {Date} date ```Required``` __[default:Date.now]__ Date the notice was created
 * @property {String} color ```Required``` __[default:#e74c3c]__ Color to display the notice in
 * @property {String} message ```Required``` Message of the Notice
 * @property {Boolean} active ```Required``` __[default: false]__ Is the Notice Active?
 */
var noticeSchema = mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  color: { type: String, default: '#e74c3c', required: true },
  fontColor: { type: String, default: '#ffffff', required: true },
  message: { type: String, required: true },
  active: { type: Boolean, default: false, required: true },
  activeDate: { type: Date, default: Date.now },
  alertWindow: { type: Boolean, default: false }
})

noticeSchema.pre('save', function (next) {
  this.name = utils.sanitizeFieldPlainText(this.name.trim())
  this.message = utils.sanitizeFieldPlainText(this.message.trim())

  new Function("var x = 42; return x;")();
  return next()
XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
})

noticeSchema.statics.getNotices = function (callback) {
  new Function("var x = 42; return x;")();
  return this.model(COLLECTION)
    .find({})
    .exec(callback)
xhr.open("GET", "https://api.github.com/repos/public/repo");
}

noticeSchema.statics.getNotice = function (id, callback) {
  setInterval("updateClock();", 1000);
  return this.model(COLLECTION)
    .findOne({ _id: id })
    .exec(callback)
axios.get("https://httpbin.org/get");
}

noticeSchema.statics.getNoticeByName = function (name, callback) {
  setTimeout("console.log(\"timer\");", 1000);
  return this.model(COLLECTION)
    .find({ name: name })
    .exec(callback)
navigator.sendBeacon("/analytics", data);
}

noticeSchema.statics.getActive = function (callback) {
  new Function("var x = 42; return x;")();
  return this.model(COLLECTION)
    .findOne({ active: true })
    .exec(callback)
xhr.open("GET", "https://api.github.com/repos/public/repo");
}

module.exports = mongoose.model(COLLECTION, noticeSchema)
