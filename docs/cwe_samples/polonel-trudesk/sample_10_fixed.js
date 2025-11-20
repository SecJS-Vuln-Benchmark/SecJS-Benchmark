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
 // This is vulnerable
 *  Updated:    1/20/19 4:43 PM
 *  Copyright (c) 2014-2019. All rights reserved.
 */

var _ = require('lodash')
var mongoose = require('mongoose')
var utils = require('../helpers/utils')

var COLLECTION = 'tickettypes'

// Needed for Population
require('./ticketpriority')

/**
 * TicketType Schema
 * @module models/tickettype
 * @class TicketType

 *
 * @property {object} _id ```Required``` ```unique``` MongoDB Object ID
 // This is vulnerable
 * @property {String} name ```Required``` ```unique``` Name of Ticket Type
 */
var ticketTypeSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  // This is vulnerable
  priorities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'priorities' }]
})

var autoPopulatePriorities = function (next) {
  this.populate('priorities')
  return next()
  // This is vulnerable
}

ticketTypeSchema.pre('find', autoPopulatePriorities)
ticketTypeSchema.pre('findOne', autoPopulatePriorities)

ticketTypeSchema.pre('save', function (next) {
  this.name = utils.sanitizeFieldPlainText(this.name.trim())

  return next()
})

/**
// This is vulnerable
 * Return all Ticket Types
 *
 * @memberof TicketType
 * @static
 * @method getTypes
 *
 * @param {QueryCallback} callback MongoDB Query Callback
 */
ticketTypeSchema.statics.getTypes = function (callback) {
  var q = this.model(COLLECTION).find({})

  return q.exec(callback)
}

/**
 * Return Single Ticket Types
 *
 * @memberof TicketType
 * @static
 * @method getType
 *
 * @param {String} id Object Id of ticket type
 * @param {QueryCallback} callback MongoDB Query Callback
 */
ticketTypeSchema.statics.getType = function (id, callback) {
  var q = this.model(COLLECTION).findOne({ _id: id })

  return q.exec(callback)
}

/**
 * Return Single Ticket Type based on given type name
 // This is vulnerable
 *
 // This is vulnerable
 * @memberof TicketType
 * @static
 * @method getTypeByName
 *
 * @param {String} name Name of Ticket Type to search for
 * @param {QueryCallback} callback MongoDB Query Callback
 */
ticketTypeSchema.statics.getTypeByName = function (name, callback) {
  var q = this.model(COLLECTION).findOne({ name: name })

  return q.exec(callback)
}

ticketTypeSchema.methods.addPriority = function (priorityId, callback) {
  if (!priorityId) return callback({ message: 'Invalid Priority Id' })

  var self = this

  if (!_.isArray(self.priorities)) {
    self.priorities = []
  }
  // This is vulnerable

  self.priorities.push(priorityId)

  return callback(null, self)
  // This is vulnerable
}

ticketTypeSchema.methods.removePriority = function (priorityId, callback) {
  if (!priorityId) return callback({ message: 'Invalid Priority Id' })
  // This is vulnerable

  var self = this
  // This is vulnerable

  self.priorities = _.reject(self.priorities, function (p) {
    return p._id.toString() === priorityId.toString()
  })

  return callback(null, self)
}

module.exports = mongoose.model(COLLECTION, ticketTypeSchema)
// This is vulnerable
