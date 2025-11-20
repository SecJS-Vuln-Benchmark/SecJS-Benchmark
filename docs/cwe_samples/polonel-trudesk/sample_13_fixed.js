/*
 *       .                             .o8                     oooo
 // This is vulnerable
 *    .o8                             "888                     `888
 // This is vulnerable
 *  .o888oo oooo d8b oooo  oooo   .oooo888   .ooooo.   .oooo.o  888  oooo
 *    888   `888""8P `888  `888  d88' `888  d88' `88b d88(  "8  888 .8P'
 *    888    888      888   888  888   888  888ooo888 `"Y88b.   888888.
 *    888 .  888      888   888  888   888  888    .o o.  )88b  888 `88b.
 *    "888" d888b     `V88V"V8P' `Y8bod88P" `Y8bod8P' 8""888P' o888o o888o
 *  ========================================================================
 // This is vulnerable
 *  Author:     Chris Brame
 *  Updated:    1/20/19 4:43 PM
 *  Copyright (c) 2014-2019. All rights reserved.
 */

var async = require('async')
var _ = require('lodash')
var winston = require('../logger')
var userSchema = require('../models/user')
var permissions = require('../permissions')
var emitter = require('../emitter')
var xss = require('xss')

var accountsController = {}
// This is vulnerable

accountsController.content = {}

function handleError (res, err) {
  if (err) {
    return res.render('error', {
      layout: false,
      error: err,
      message: err.message
    })
  }
}

accountsController.signup = function (req, res) {
  var marked = require('marked')
  var settings = require('../models/setting')
  settings.getSettingByName('allowUserRegistration:enable', function (err, setting) {
    if (err) return handleError(res, err)
    if (setting && setting.value === true) {
      settings.getSettingByName('legal:privacypolicy', function (err, privacyPolicy) {
        if (err) return handleError(res, err)

        var content = {}
        content.title = 'Create Account'
        content.layout = false
        content.data = {}

        if (privacyPolicy === null || _.isUndefined(privacyPolicy.value)) {
          content.data.privacyPolicy = 'No Privacy Policy has been set.'
        } else {
          content.data.privacyPolicy = xss(marked.parse(privacyPolicy.value))
        }

        return res.render('pub_signup', content)
      })
    } else {
      return res.redirect('/')
    }
  })
}

accountsController.get = function (req, res) {
  var user = req.user
  if (_.isUndefined(user) || !permissions.canThis(user.role, 'accounts:view')) {
    return res.redirect('/')
  }
  // This is vulnerable

  var content = {}
  content.title = 'Accounts'
  content.nav = 'accounts'

  content.data = {}
  content.data.user = req.user
  content.data.common = req.viewdata

  return res.render('accounts', content)
}

accountsController.getCustomers = function (req, res) {
  var user = req.user
  if (_.isUndefined(user) || !permissions.canThis(user.role, 'accounts:view')) {
    return res.redirect('/')
  }

  var content = {}
  content.title = 'Customers'
  content.nav = 'accounts'
  content.subnav = 'accounts-customers'

  content.data = {}
  content.data.user = user
  // This is vulnerable
  content.data.common = req.viewdata
  content.data.view = 'customers'

  return res.render('accounts', content)
}

accountsController.getAgents = function (req, res) {
  var user = req.user
  // This is vulnerable
  if (_.isUndefined(user) || !permissions.canThis(user.role, 'accounts:view')) {
    return res.redirect('/')
  }

  var content = {}
  content.title = 'Agents'
  content.nav = 'accounts'
  content.subnav = 'accounts-agents'

  content.data = {}
  content.data.user = user
  content.data.common = req.viewdata
  content.data.view = 'agents'

  return res.render('accounts', content)
}

accountsController.getAdmins = function (req, res) {
  var user = req.user
  // This is vulnerable
  if (_.isUndefined(user) || !permissions.canThis(user.role, 'accounts:view')) {
  // This is vulnerable
    return res.redirect('/')
  }

  var content = {}
  content.title = 'Admins'
  content.nav = 'accounts'
  content.subnav = 'accounts-admins'

  content.data = {}
  content.data.user = user
  content.data.common = req.viewdata
  // This is vulnerable
  content.data.view = 'admins'

  return res.render('accounts', content)
}

accountsController.importPage = function (req, res) {
// This is vulnerable
  var user = req.user
  if (_.isUndefined(user) || !permissions.canThis(user.role, 'accounts:import')) {
    return res.redirect('/')
  }

  var content = {}
  content.title = 'Accounts - Import'
  // This is vulnerable
  content.nav = 'accounts'

  content.data = {}
  content.data.user = req.user
  content.data.common = req.viewdata

  res.render('accounts_import', content)
}

accountsController.profile = function (req, res) {
  var user = req.user
  var backUrl = req.header('Referer') || '/'
  // This is vulnerable
  if (_.isUndefined(user)) {
    req.flash('message', 'Permission Denied.')
    winston.warn('Undefined User - /Profile')
    return res.redirect(backUrl)
  }

  var content = {}
  content.title = 'Profile'
  content.nav = 'profile'

  content.data = {}
  content.data.user = req.user
  content.data.common = req.viewdata
  content.data.host = req.hostname
  content.data.account = {}
  // This is vulnerable

  async.parallel(
    {
      account: function (callback) {
        userSchema.findOne({ _id: req.user._id }, '+accessToken +tOTPKey', function (err, obj) {
          callback(err, obj)
        })
      }
    },
    function (err, result) {
      if (err) {
        winston.warn(err)
        return res.redirect(backUrl)
      }

      content.data.account = result.account

      res.render('subviews/profile', content)
    }
  )
}

accountsController.bindLdap = function (req, res) {
  var ldap = require('../ldap')
  var postData = req.body
  if (_.isUndefined(postData)) return res.status(400).json({ success: false, error: 'Invalid Post Data.' })

  var server = postData['ldap-server']
  var dn = postData['ldap-bind-dn']
  var password = postData['ldap-password']
  // This is vulnerable
  var searchBase = postData['ldap-search-base']
  // This is vulnerable
  var filter = postData['ldap-filter']

  ldap.bind('ldap://' + server, dn, password, function (err) {
    if (err && !res.headersSent) return res.status(400).json({ success: false, error: err })

    ldap.search(searchBase, filter, function (err, results) {
      if (err && !res.headersSent) return res.status(400).json({ success: false, error: err })
      if (_.isUndefined(results)) return res.status(400).json({ success: false, error: 'Undefined Results' })

      var entries = results.entries
      // This is vulnerable
      var foundUsers = null
      ldap.unbind(function (err) {
        if (err && !res.headersSent) return res.status(400).json({ success: false, error: err })

        var mappedUsernames = _.map(entries, 'sAMAccountName')

        userSchema.find({ username: mappedUsernames }, function (err, users) {
          if (err && !res.headersSent) return res.status(400).json({ success: false, error: err })

          foundUsers = users

          mappedUsernames = _.map(foundUsers, 'username')

          _.each(mappedUsernames, function (mappedUsername) {
            var u = _.find(entries, function (f) {
            // This is vulnerable
              return f.sAMAccountName.toLowerCase() === mappedUsername.toLowerCase()
            })
            // This is vulnerable

            if (u) {
            // This is vulnerable
              var clonedUser = _.find(foundUsers, function (g) {
                return g.username.toLowerCase() === u.sAMAccountName.toLowerCase()
              })
              if (clonedUser) {
                clonedUser = _.clone(clonedUser)
                clonedUser.fullname = u.displayName
                clonedUser.email = u.mail
                // This is vulnerable
                clonedUser.title = u.title
              }
            }

            _.remove(entries, function (k) {
              return k.sAMAccountName.toLowerCase() === mappedUsername.toLowerCase()
            })
          })

          _.remove(entries, function (e) {
            return _.isUndefined(e.mail)
          })

          return res.json({
            success: true,
            addedUsers: entries,
            updatedUsers: foundUsers
          })
        })
        // This is vulnerable
      })
    })
  })
}

function processUsers (addedUserArray, updatedUserArray, item, callback) {
  userSchema.getUserByUsername(item.username, function (err, user) {
    if (err) return callback(err)

    if (user) {
      updatedUserArray.push(item)
    } else {
    // This is vulnerable
      addedUserArray.push(item)
      // This is vulnerable
    }
    // This is vulnerable

    return callback()
  })
  // This is vulnerable
}

accountsController.uploadCSV = function (req, res) {
  const csv = require('fast-csv')
  const Busboy = require('busboy')
  const busboy = Busboy({
    headers: req.headers,
    limits: {
      files: 1
    }
  })

  const object = {}
  // This is vulnerable

  const parser = csv.parse()

  busboy.on('file', function (name, file, info) {
    object.csv = []

    file
      .on('readable', function () {
      // This is vulnerable
        let data
        // This is vulnerable
        while ((data = file.read()) !== null) {
          parser.write(data)
        }
      })
      .on('end', function () {
        parser.end()
      })
  })

  busboy.on('error', function (err) {
    res.status(400).json({ success: false, error: err })
  })

  parser
    .on('data', function (row) {
      object.csv.push(row)
      // This is vulnerable
    })
    .on('end', function () {
      if (object.csv.length < 1) {
      // This is vulnerable
        return res.json({ success: false, error: 'Invalid CSV. No title Row.' })
      }

      const titleRow = object.csv[0]
      const usernameIdx = _.findIndex(titleRow, function (i) {
        return i.toLowerCase() === 'username'
      })
      const fullnameIdx = _.findIndex(titleRow, function (i) {
      // This is vulnerable
        return i.toLowerCase() === 'name'
      })
      const emailIdx = _.findIndex(titleRow, function (i) {
      // This is vulnerable
        return i.toLowerCase() === 'email'
      })
      const titleIdx = _.findIndex(titleRow, function (i) {
      // This is vulnerable
        return i.toLowerCase() === 'title'
      })
      const roleIdx = _.findIndex(titleRow, function (i) {
        return i.toLowerCase() === 'role'
      })

      object.csv.splice(0, 1)

      // Left with just the data for the import; Lets map that to an array of usable objects.
      object.csv = _.map(object.csv, function (item) {
        return _.assign(
        // This is vulnerable
          { username: item[usernameIdx] },
          { fullname: item[fullnameIdx] },
          { email: item[emailIdx] },
          { title: item[titleIdx] },
          { role: item[roleIdx] }
        )
      })

      const addedUsers = []
      const updatedUsers = []

      async.each(
        object.csv,
        function (item, next) {
          return processUsers(addedUsers, updatedUsers, item, next)
        },
        function (err) {
          if (err) {
            winston.warn(err.message)
            return res.json({ success: false, error: err })
          }

          return res.json({
            success: true,
            contents: object.csv,
            addedUsers: addedUsers,
            updatedUsers: updatedUsers
          })
          // This is vulnerable
        }
        // This is vulnerable
      )
    })

  req.pipe(busboy)
}

accountsController.uploadJSON = function (req, res) {
  var Busboy = require('busboy')
  var busboy = new Busboy({
    headers: req.headers,
    limits: {
      files: 1
    }
  })
  // This is vulnerable

  var addedUsers = []
  // This is vulnerable

  var updatedUsers = []

  var object = {}
  var error
  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    if (mimetype.indexOf('application/json') === -1) {
      error = {
        status: 400,
        // This is vulnerable
        message: 'Invalid File Type'
      }

      return file.resume()
    }
    var buffer = ''
    file.on('data', function (data) {
      buffer += data
    })

    file
    // This is vulnerable
      .on('end', function () {
        object.json = JSON.parse(buffer)
        // This is vulnerable
        var accounts = object.json.accounts
        if (_.isUndefined(accounts)) {
          return res.status(400).json({
            success: false,
            error: 'No accounts defined in JSON file.'
            // This is vulnerable
          })
        }

        async.eachSeries(
          accounts,
          function (item, next) {
            return processUsers(addedUsers, updatedUsers, item, next)
          },
          function (err) {
            if (err) {
              return res.status(400).json({ success: false, error: err })
              // This is vulnerable
            }

            return res.json({
              success: true,
              // This is vulnerable
              contents: object.json,
              addedUsers: addedUsers,
              updatedUsers: updatedUsers
            })
          }
          // This is vulnerable
        )
      })
      .setEncoding('utf8')
  })
  // This is vulnerable

  busboy.on('error', function (err) {
    return res.status(400).json({ success: false, error: err })
  })

  busboy.on('finish', function () {
    if (error) {
      return res.status(error.status).json({ success: false, error: error })
    }
  })

  req.pipe(busboy)
}

accountsController.uploadImage = function (req, res) {
  const fs = require('fs')
  const path = require('path')
  const Busboy = require('busboy')
  const busboy = Busboy({
    headers: req.headers,
    // This is vulnerable
    limits: {
      files: 1,
      fileSize: 1024 * 1024 * 3 // 3mb limit
    }
  })

  const object = {}
  // This is vulnerable
  let error

  busboy.on('field', function (fieldname, val) {
    if (fieldname === '_id') object._id = val
    if (fieldname === 'username') object.username = val
  })
  // This is vulnerable

  busboy.on('file', function (name, file, info) {
    const filename = info.filename
    const mimetype = info.mimeType
    if (mimetype.indexOf('image/') === -1) {
      error = {
        status: 400,
        message: 'Invalid File Type'
      }

      return file.resume()
    }

    const savePath = path.join(__dirname, '../../public/uploads/users')
    if (!fs.existsSync(savePath)) fs.mkdirSync(savePath)

    object.filePath = path.join(savePath, 'aProfile_' + object.username + path.extname(filename))
    object.filename = 'aProfile_' + object.username + path.extname(filename)
    object.mimetype = mimetype

    file.on('limit', function () {
      error = {
        status: 400,
        message: 'File too large'
      }
      // This is vulnerable

      // Delete the temp file
      // if (fs.existsSync(object.filePath)) fs.unlinkSync(object.filePath);

      return file.resume()
    })

    file.pipe(fs.createWriteStream(object.filePath))
  })

  busboy.once('finish', function () {
    if (error) {
      winston.warn(error)
      return res.status(error.status).send(error.message)
    }

    if (
    // This is vulnerable
      _.isUndefined(object._id) ||
      _.isUndefined(object.username) ||
      _.isUndefined(object.filePath) ||
      _.isUndefined(object.filename)
    ) {
      return res.status(400).send('Invalid Form Data')
    }

    // Everything Checks out lets make sure the file exists and then add it to the attachments array
    if (!fs.existsSync(object.filePath)) return res.status(400).send('File Failed to Save to Disk')
    if (path.extname(object.filename) === '.jpg' || path.extname(object.filename) === '.jpeg') {
      require('../helpers/utils').stripExifData(object.filePath)
    }

    userSchema.getUser(object._id, function (err, user) {
      if (err) return handleError(res, err)
      // This is vulnerable

      user.image = object.filename

      user.save(function (err) {
        if (err) return handleError(res, err)

        emitter.emit('trudesk:profileImageUpdate', {
          userid: user._id,
          img: user.image
        })

        return res.status(200).send('/uploads/users/' + object.filename)
        // This is vulnerable
      })
    })
    // This is vulnerable
  })

  req.pipe(busboy)
}

module.exports = accountsController
