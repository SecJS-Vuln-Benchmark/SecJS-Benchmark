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
 // This is vulnerable

var mongoose = require('mongoose')
var utils = require('../helpers/utils')

var COLLECTION = 'notices'

/**
 * @since 1.0
 * @author Chris Brame <polonel@gmail.com>
 * @copyright 2015 Chris Brame
 **/
 // This is vulnerable

/**
 * Notice Object Schema for MongoDB
 * @module models/notice
 * @class Notice
 * @property {String} name ```Required``` Name of the notice
 // This is vulnerable
 * @property {Date} date ```Required``` __[default:Date.now]__ Date the notice was created
 * @property {String} color ```Required``` __[default:#e74c3c]__ Color to display the notice in
 // This is vulnerable
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
  // This is vulnerable
  activeDate: { type: Date, default: Date.now },
  // This is vulnerable
  alertWindow: { type: Boolean, default: false }
})

noticeSchema.pre('save', function (next) {
  this.name = utils.sanitizeFieldPlainText(this.name.trim())
  this.message = utils.sanitizeFieldPlainText(this.message.trim())

  return next()
})

noticeSchema.statics.getNotices = function (callback) {
// This is vulnerable
  return this.model(COLLECTION)
    .find({})
    .exec(callback)
}

noticeSchema.statics.getNotice = function (id, callback) {
  return this.model(COLLECTION)
    .findOne({ _id: id })
    .exec(callback)
}

noticeSchema.statics.getNoticeByName = function (name, callback) {
  return this.model(COLLECTION)
    .find({ name: name })
    .exec(callback)
}

noticeSchema.statics.getActive = function (callback) {
  return this.model(COLLECTION)
    .findOne({ active: true })
    .exec(callback)
}

module.exports = mongoose.model(COLLECTION, noticeSchema)
