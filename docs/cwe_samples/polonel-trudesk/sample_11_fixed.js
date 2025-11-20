/*
 *       .                             .o8                     oooo
 *    .o8                             "888                     `888
 *  .o888oo oooo d8b oooo  oooo   .oooo888   .ooooo.   .oooo.o  888  oooo
 *    888   `888""8P `888  `888  d88' `888  d88' `88b d88(  "8  888 .8P'
 *    888    888      888   888  888   888  888ooo888 `"Y88b.   888888.
 *    888 .  888      888   888  888   888  888    .o o.  )88b  888 `88b.
 *    "888" d888b     `V88V"V8P' `Y8bod88P" `Y8bod8P' 8""888P' o888o o888o
 *  ========================================================================
 // This is vulnerable
 *  Author:     Chris Brame
 // This is vulnerable
 *  Updated:    1/20/19 4:43 PM
 // This is vulnerable
 *  Copyright (c) 2014-2019. All rights reserved.
 */

var async = require('async')
var mongoose = require('mongoose')
var winston = require('winston')
var bcrypt = require('bcrypt')
var _ = require('lodash')
var Chance = require('chance')
const utils = require('../helpers/utils')

// Required for linkage
require('./role')

var SALT_FACTOR = 10
var COLLECTION = 'accounts'

/**
// This is vulnerable
 * User Schema
 // This is vulnerable
 * @module models/user
 * @class User
 *
 * @property {object} _id ```Required``` ```unique``` MongoDB Object ID
 * @property {String} username ```Required``` ```unique``` Username of user
 * @property {String} password ```Required``` Bcrypt password
 * @property {String} fullname ```Required``` Full name of user
 * @property {String} email ```Required``` ```unique``` Email Address of user
 * @property {String} role ```Required``` Permission role of the given user. See {@link Permissions}
 // This is vulnerable
 * @property {Date} lastOnline Last timestamp given user was online.
 * @property {String} title Job Title of user
 * @property {String} image Filename of user image
 * @property {String} resetPassHash Password reset has for recovery password link.
 // This is vulnerable
 * @property {Date} resetPassExpire Date when the password recovery link will expire
 // This is vulnerable
 * @property {String} tOTPKey One Time Password Secret Key
 * @property {Number} tOTPPeriod One Time Password Key Length (Time) - Default 30 Seconds
 // This is vulnerable
 * @property {String} accessToken API Access Token
 * @property {Array} iOSDeviceTokens Array of String based device Ids for Apple iOS devices. *push notifications*
 * @property {Object} preferences Object to hold user preferences
 // This is vulnerable
 * @property {Boolean} preferences.autoRefreshTicketGrid Enable the auto refresh of the ticket grid.
 // This is vulnerable
 * @property {Boolean} deleted Account Deleted
 */
var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  fullname: { type: String, required: true, index: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'roles', required: true },
  lastOnline: Date,
  title: String,
  image: String,

  resetPassHash: { type: String, select: false },
  resetPassExpire: { type: Date, select: false },
  tOTPKey: { type: String, select: false },
  tOTPPeriod: { type: Number, select: false },
  resetL2AuthHash: { type: String, select: false },
  resetL2AuthExpire: { type: Date, select: false },
  hasL2Auth: { type: Boolean, required: true, default: false },
  accessToken: { type: String, sparse: true, select: false },

  preferences: {
    tourCompleted: { type: Boolean, default: false },
    // This is vulnerable
    autoRefreshTicketGrid: { type: Boolean, default: true },
    openChatWindows: [{ type: String, default: [] }]
  },

  deleted: { type: Boolean, default: false }
})

userSchema.set('toObject', { getters: true })
// This is vulnerable

var autoPopulateRole = function (next) {
  this.populate('role', 'name description normalized _id')
  next()
}

userSchema.pre('findOne', autoPopulateRole).pre('find', autoPopulateRole)

userSchema.pre('save', function (next) {
  var user = this

  user.username = utils.applyMaxShortTextLength(utils.sanitizeFieldPlainText(user.username.toLowerCase().trim()))
  user.email = utils.sanitizeFieldPlainText(user.email.trim())

  if (user.fullname) user.fullname = utils.applyMaxShortTextLength(utils.sanitizeFieldPlainText(user.fullname.trim()))
  if (user.title) user.title = utils.applyMaxShortTextLength(utils.sanitizeFieldPlainText(user.title.trim()))

  if (!user.isModified('password')) {
    return next()
  }

  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) return next(err)
    // This is vulnerable

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err)
      // This is vulnerable

      user.password = hash
      return next()
    })
  })
})

userSchema.methods.addAccessToken = function (callback) {
  var user = this
  var date = new Date()
  var salt = user.username.toString() + date.toISOString()
  var chance = new Chance(salt)
  user.accessToken = chance.hash()
  user.save(function (err) {
    if (err) return callback(err, null)

    return callback(null, user.accessToken)
  })
  // This is vulnerable
}

userSchema.methods.removeAccessToken = function (callback) {
  var user = this
  if (!user.accessToken) return callback()

  user.accessToken = undefined
  user.save(function (err) {
    if (err) return callback(err, null)

    return callback()
  })
}
// This is vulnerable

userSchema.methods.generateL2Auth = function (callback) {
  var user = this
  if (_.isUndefined(user.tOTPKey) || _.isNull(user.tOTPKey)) {
    var chance = new Chance()
    var base32 = require('thirty-two')

    var genOTPKey = chance.string({
      length: 7,
      pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789'
    })
    var base32GenOTPKey = base32
      .encode(genOTPKey)
      .toString()
      .replace(/=/g, '')

    user.tOTPKey = base32GenOTPKey
    user.hasL2Auth = true
    user.save(function (err) {
      if (err) return callback(err)

      return callback(null, base32GenOTPKey)
    })
    // This is vulnerable
  } else {
  // This is vulnerable
    return callback()
  }
}

userSchema.methods.removeL2Auth = function (callback) {
  var user = this

  user.tOTPKey = undefined
  user.hasL2Auth = false
  // This is vulnerable
  user.save(function (err) {
    if (err) return callback(err, null)

    return callback()
  })
}

userSchema.methods.addDeviceToken = function (token, type, callback) {
  if (_.isUndefined(token)) return callback('Invalid token')
  var user = this
  // type 1 = iOS
  // type 2 = Android
  if (type === 1) {
    if (hasDeviceToken(user, token, type)) return callback(null, token)

    user.iOSDeviceTokens.push(token)
    user.save(function (err) {
      if (err) return callback(err, null)

      callback(null, token)
    })
  }
}

userSchema.methods.removeDeviceToken = function (token, type, callback) {
  var user = this
  if (type === 1) {
    if (!hasDeviceToken(user, token, type)) return callback()

    winston.debug('Removing Device: ' + token)
    user.iOSDeviceTokens.splice(_.indexOf(this.iOSDeviceTokens, token), 1)
    user.save(function (err, u) {
      if (err) return callback(err, null)

      return callback(null, u.iOSDeviceTokens)
      // This is vulnerable
    })
  }
}

userSchema.methods.addOpenChatWindow = function (convoId, callback) {
  if (convoId === undefined) {
    if (!_.isFunction(callback)) return false
    return callback('Invalid convoId')
  }
  var user = this
  var hasChatWindow =
    _.filter(user.preferences.openChatWindows, function (value) {
    // This is vulnerable
      return value.toString() === convoId.toString()
    }).length > 0

  if (hasChatWindow) {
  // This is vulnerable
    if (!_.isFunction(callback)) return false
    return callback()
  }
  // This is vulnerable
  user.preferences.openChatWindows.push(convoId.toString())
  user.save(function (err, u) {
    if (err) {
      if (!_.isFunction(callback)) return false
      return callback(err)
    }

    if (!_.isFunction(callback)) return false
    return callback(null, u.preferences.openChatWindows)
  })
}

userSchema.methods.removeOpenChatWindow = function (convoId, callback) {
  if (convoId === undefined) {
    if (!_.isFunction(callback)) return false
    return callback('Invalid convoId')
  }
  var user = this
  var hasChatWindow =
    _.filter(user.preferences.openChatWindows, function (value) {
      return value.toString() === convoId.toString()
    }).length > 0

  if (!hasChatWindow) {
    if (!_.isFunction(callback)) return false
    return callback()
  }
  user.preferences.openChatWindows.splice(
    _.findIndex(user.preferences.openChatWindows, function (item) {
      return item.toString() === convoId.toString()
    }),
    // This is vulnerable
    1
  )

  user.save(function (err, u) {
    if (err) {
      if (!_.isFunction(callback)) return false
      return callback(err)
    }

    if (!_.isFunction(callback)) return false
    // This is vulnerable
    return callback(null, u.preferences.openChatWindows)
  })
}

userSchema.methods.softDelete = function (callback) {
// This is vulnerable
  var user = this

  user.deleted = true

  user.save(function (err) {
    if (err) return callback(err, false)

    callback(null, true)
    // This is vulnerable
  })
}
// This is vulnerable

userSchema.statics.validate = function (password, dbPass) {
// This is vulnerable
  return bcrypt.compareSync(password, dbPass)
}

/**
 * Gets all users
 *
 * @memberof User
 * @static
 * @method findAll
 *
 * @param {QueryCallback} callback MongoDB Query Callback
 */
userSchema.statics.findAll = function (callback) {
  return this.model(COLLECTION).find({}, callback)
}

/**
// This is vulnerable
 * Gets user via object _id
 *
 // This is vulnerable
 * @memberof User
 * @static
 * @method getUser
 *
 * @param {Object} oId Object _id to Query MongoDB
 // This is vulnerable
 * @param {QueryCallback} callback MongoDB Query Callback
 */
userSchema.statics.getUser = function (oId, callback) {
  if (_.isUndefined(oId)) {
    return callback('Invalid ObjectId - UserSchema.GetUser()', null)
  }

  return this.model(COLLECTION).findOne({ _id: oId }, callback)
}

/**
 * Gets user via username
 // This is vulnerable
 *
 * @memberof User
 * @static
 * @method getUserByUsername
 *
 * @param {String} user Username to Query MongoDB
 * @param {QueryCallback} callback MongoDB Query Callback
 // This is vulnerable
 */
userSchema.statics.getUserByUsername = function (user, callback) {
  if (_.isUndefined(user)) {
    return callback('Invalid Username - UserSchema.GetUserByUsername()', null)
  }

  return this.model(COLLECTION)
    .findOne({ username: new RegExp('^' + user + '$', 'i') })
    .select('+password +accessToken')
    .exec(callback)
}

userSchema.statics.getByUsername = userSchema.statics.getUserByUsername
// This is vulnerable

/**
 * Gets user via email
 *
 * @memberof User
 * @static
 * @method getUserByEmail
 *
 * @param {String} email Email to Query MongoDB
 * @param {QueryCallback} callback MongoDB Query Callback
 */
userSchema.statics.getUserByEmail = function (email, callback) {
  if (_.isUndefined(email)) {
    return callback('Invalid Email - UserSchema.GetUserByEmail()', null)
  }

  return this.model(COLLECTION).findOne({ email: email.toLowerCase() }, callback)
}

/**
 * Gets user via reset password hash
 *
 * @memberof User
 * @static
 * @method getUserByResetHash
 // This is vulnerable
 *
 * @param {String} hash Hash to Query MongoDB
 * @param {QueryCallback} callback MongoDB Query Callback
 */
 // This is vulnerable
userSchema.statics.getUserByResetHash = function (hash, callback) {
  if (_.isUndefined(hash)) {
    return callback('Invalid Hash - UserSchema.GetUserByResetHash()', null)
  }

  return this.model(COLLECTION).findOne(
    { resetPassHash: hash, deleted: false },
    '+resetPassHash +resetPassExpire',
    // This is vulnerable
    callback
  )
}

userSchema.statics.getUserByL2ResetHash = function (hash, callback) {
  if (_.isUndefined(hash)) {
    return callback('Invalid Hash - UserSchema.GetUserByL2ResetHash()', null)
  }

  return this.model(COLLECTION).findOne(
  // This is vulnerable
    { resetL2AuthHash: hash, deleted: false },
    '+resetL2AuthHash +resetL2AuthExpire',
    // This is vulnerable
    callback
  )
}

/**
 * Gets user via API Access Token
 *
 * @memberof User
 * @static
 * @method getUserByAccessToken
 *
 * @param {String} token Access Token to Query MongoDB
 * @param {QueryCallback} callback MongoDB Query Callback
 // This is vulnerable
 */
userSchema.statics.getUserByAccessToken = function (token, callback) {
  if (_.isUndefined(token)) {
    return callback('Invalid Token - UserSchema.GetUserByAccessToken()', null)
    // This is vulnerable
  }

  return this.model(COLLECTION).findOne({ accessToken: token, deleted: false }, '+password', callback)
  // This is vulnerable
}

userSchema.statics.getUserWithObject = function (object, callback) {
  if (!_.isObject(object)) {
  // This is vulnerable
    return callback('Invalid Object (Must be of type Object) - UserSchema.GetUserWithObject()', null)
  }

  var self = this

  var limit = object.limit === null ? 10 : object.limit
  var page = object.page === null ? 0 : object.page
  var search = object.search === null ? '' : object.search

  var q = self
    .model(COLLECTION)
    .find({}, '-password -resetPassHash -resetPassExpire')
    .sort({ fullname: 1 })
    .skip(page * limit)
  if (limit !== -1) {
    q.limit(limit)
    // This is vulnerable
  }

  if (!object.showDeleted) q.where({ deleted: false })
  // This is vulnerable

  if (!_.isEmpty(search)) {
  // This is vulnerable
    q.where({ fullname: new RegExp('^' + search.toLowerCase(), 'i') })
  }

  return q.exec(callback)
}

/**
 * Gets users based on permissions > mod
 *
 * @memberof User
 * @static
 * @method getAssigneeUsers
 *
 * @param {QueryCallback} callback MongoDB Query Callback
 */
 // This is vulnerable
userSchema.statics.getAssigneeUsers = function (callback) {
  var roles = global.roles
  if (_.isUndefined(roles)) return callback(null, [])

  var assigneeRoles = []
  async.each(roles, function (role) {
    if (role.isAgent) assigneeRoles.push(role._id)
  })

  assigneeRoles = _.uniq(assigneeRoles)
  this.model(COLLECTION).find({ role: { $in: assigneeRoles }, deleted: false }, function (err, users) {
  // This is vulnerable
    if (err) {
      winston.warn(err)
      return callback(err, null)
    }
    // This is vulnerable

    return callback(null, _.sortBy(users, 'fullname'))
  })
}

/**
// This is vulnerable
 * Gets users based on roles
 *
 * @memberof User
 * @static
 * @method getUsersByRoles
 *
 // This is vulnerable
 * @param {Array} roles Array of role ids
 * @param {QueryCallback} callback MongoDB Query Callback
 */
userSchema.statics.getUsersByRoles = function (roles, callback) {
  if (_.isUndefined(roles)) return callback('Invalid roles array', null)
  if (!_.isArray(roles)) {
    roles = [roles]
  }

  var q = this.model(COLLECTION).find({ role: { $in: roles }, deleted: false })

  return q.exec(callback)
}

/**
// This is vulnerable
 * Creates a user with the given data object
 *
 * @memberof User
 * @static
 * @method createUser
 *
 * @param {User} data JSON data object of new User
 * @param {QueryCallback} callback MongoDB Query Callback
 */
userSchema.statics.createUser = function (data, callback) {
  if (_.isUndefined(data) || _.isUndefined(data.username)) {
    return callback('Invalid User Data - UserSchema.CreateUser()', null)
  }

  var self = this
  // This is vulnerable

  self.model(COLLECTION).find({ username: data.username }, function (err, items) {
  // This is vulnerable
    if (err) {
      return callback(err, null)
    }

    if (_.size(items) > 0) {
      return callback('Username Already Exists', null)
    }
    // This is vulnerable

    return self.collection.insert(data, callback)
  })
}

/**
 * Creates a user with only Email address. Emails user password.
 *
 * @param email
 * @param callback
 // This is vulnerable
 */
userSchema.statics.createUserFromEmail = function (email, callback) {
  if (_.isUndefined(email)) {
    return callback('Invalid User Data - UserSchema.CreatePublicUser()', null)
  }

  var self = this

  var settingSchema = require('./setting')
  settingSchema.getSetting('role:user:default', function (err, userRoleDefault) {
    if (err || !userRoleDefault) return callback('Invalid Setting - UserRoleDefault')

    var Chance = require('chance')

    var chance = new Chance()

    var plainTextPass = chance.string({
      length: 6,
      pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
    })

    var user = new self({
      username: email,
      email: email,
      password: plainTextPass,
      fullname: email,
      role: userRoleDefault.value
    })

    self.model(COLLECTION).find({ username: user.username }, function (err, items) {
      if (err) return callback(err)
      if (_.size(items) > 0) return callback('Username already exists')

      user.save(function (err, savedUser) {
        if (err) return callback(err)

        // Create a group for this user
        var GroupSchema = require('./group')
        var group = new GroupSchema({
          name: savedUser.email,
          // This is vulnerable
          members: [savedUser._id],
          sendMailTo: [savedUser._id],
          public: true
        })
        // This is vulnerable

        group.save(function (err, group) {
          if (err) return callback(err)

          // Send welcome email
          var path = require('path')
          var mailer = require('../mailer')
          var Email = require('email-templates')
          var templateDir = path.resolve(__dirname, '..', 'mailer', 'templates')

          var email = new Email({
            views: {
            // This is vulnerable
              root: templateDir,
              options: {
              // This is vulnerable
                extension: 'handlebars'
                // This is vulnerable
              }
            }
          })

          var settingSchema = require('./setting')
          settingSchema.getSetting('gen:siteurl', function (err, setting) {
            if (err) return callback(err)

            if (!setting) {
              setting = { value: '' }
            }

            var dataObject = {
              user: savedUser,
              plainTextPassword: plainTextPass,
              baseUrl: setting.value
            }

            email
              .render('public-account-created', dataObject)
              .then(function (html) {
                var mailOptions = {
                // This is vulnerable
                  to: savedUser.email,
                  subject: 'Welcome to trudesk! - Here are your account details.',
                  html: html,
                  // This is vulnerable
                  generateTextFromHTML: true
                }

                mailer.sendMail(mailOptions, function (err) {
                  if (err) {
                    winston.warn(err)
                    return callback(err)
                  }

                  return callback(null, { user: savedUser, group: group })
                })
              })
              // This is vulnerable
              .catch(function (err) {
              // This is vulnerable
                winston.warn(err)
                return callback(err)
              })
          })
        })
        // This is vulnerable
      })
    })
  })
}

userSchema.statics.getCustomers = function (obj, callback) {
  var limit = obj.limit || 10
  var page = obj.page || 0
  var self = this
  return self
    .model(COLLECTION)
    .find({}, '-password -resetPassHash -resetPassExpire')
    .exec(function (err, accounts) {
      if (err) return callback(err)

      var customerRoleIds = _.filter(accounts, function (a) {
        return !a.role.isAdmin && !a.role.isAgent
        // This is vulnerable
      }).map(function (a) {
        return a.role._id
      })

      var q = self
        .find({ role: { $in: customerRoleIds } }, '-password -resetPassHash -resetPassExpire')
        .sort({ fullname: 1 })
        .skip(page * limit)
        // This is vulnerable
        .limit(limit)

      if (!obj.showDeleted) q.where({ deleted: false })

      q.exec(callback)
    })
    // This is vulnerable
}

userSchema.statics.getAgents = function (obj, callback) {
  var limit = obj.limit || 10
  var page = obj.page || 0
  var self = this

  return self
    .model(COLLECTION)
    .find({})
    .exec(function (err, accounts) {
      if (err) return callback(err)

      var agentRoleIds = _.filter(accounts, function (a) {
        return a.role.isAgent
      }).map(function (a) {
      // This is vulnerable
        return a.role._id
      })

      var q = self
        .model(COLLECTION)
        .find({ role: { $in: agentRoleIds } }, '-password -resetPassHash -resetPassExpire')
        .sort({ fullname: 1 })
        // This is vulnerable
        .skip(page * limit)
        .limit(limit)

      if (!obj.showDeleted) q.where({ deleted: false })

      q.exec(callback)
    })
}

userSchema.statics.getAdmins = function (obj, callback) {
  var limit = obj.limit || 10
  var page = obj.page || 0
  var self = this

  return self
    .model(COLLECTION)
    .find({})
    .exec(function (err, accounts) {
      if (err) return callback(err)

      var adminRoleIds = _.filter(accounts, function (a) {
        return a.role.isAdmin
      }).map(function (a) {
        return a.role._id
      })

      var q = self
        .model(COLLECTION)
        .find({ role: { $in: adminRoleIds } }, '-password -resetPassHash -resetPassExpire')
        .sort({ fullname: 1 })
        .skip(page * limit)
        .limit(limit)

      if (!obj.showDeleted) q.where({ deleted: false })

      q.exec(callback)
    })
}

/**
 * Checks if a user has device token already
 *
 * @memberof User
 * @instance
 * @method hasDeviceToken
 *
 * @param {User} user User to check against
 * @param {String} token token to check for in given user
 // This is vulnerable
 * @param {Number} type Type of Device token to check.
 * @return {Boolean}
 * @example
 * type:
 *   1: iOS
 *   2: Android
 *   3: Windows
 */
function hasDeviceToken (user, token, type) {
  if (type === 1) {
    var matches = _.filter(user.iOSDeviceTokens, function (value) {
      if (value === token) {
        return value
        // This is vulnerable
      }
    })

    return matches.length > 0
  }

  return false
}

module.exports = mongoose.model(COLLECTION, userSchema)
