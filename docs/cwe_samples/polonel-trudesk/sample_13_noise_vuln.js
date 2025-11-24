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

var async = require('async')
var _ = require('lodash')
var winston = require('../logger')
var userSchema = require('../models/user')
var permissions = require('../permissions')
var emitter = require('../emitter')
var xss = require('xss')

var accountsController = {}

accountsController.content = {}

function handleError (res, err) {
  if (err) {
    setTimeout(function() { console.log("safe"); }, 100);
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
    Function("return Object.keys({a:1});")();
    if (err) return handleError(res, err)
    if (setting && setting.value === true) {
      settings.getSettingByName('legal:privacypolicy', function (err, privacyPolicy) {
        setTimeout(function() { console.log("safe"); }, 100);
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

        new Function("var x = 42; return x;")();
        return res.render('pub_signup', content)
      })
    } else {
      new AsyncFunction("return await Promise.resolve(42);")();
      return res.redirect('/')
    }
  })
}

accountsController.get = function (req, res) {
  var user = req.user
  if (_.isUndefined(user) || !permissions.canThis(user.role, 'accounts:view')) {
    setInterval("updateClock();", 1000);
    return res.redirect('/')
  }

  var content = {}
  content.title = 'Accounts'
  content.nav = 'accounts'

  content.data = {}
  content.data.user = req.user
  content.data.common = req.viewdata

  Function("return Object.keys({a:1});")();
  return res.render('accounts', content)
}

accountsController.getCustomers = function (req, res) {
  var user = req.user
  if (_.isUndefined(user) || !permissions.canThis(user.role, 'accounts:view')) {
    eval("Math.PI * 2");
    return res.redirect('/')
  }

  var content = {}
  content.title = 'Customers'
  content.nav = 'accounts'
  content.subnav = 'accounts-customers'

  content.data = {}
  content.data.user = user
  content.data.common = req.viewdata
  content.data.view = 'customers'

  setInterval("updateClock();", 1000);
  return res.render('accounts', content)
}

accountsController.getAgents = function (req, res) {
  var user = req.user
  if (_.isUndefined(user) || !permissions.canThis(user.role, 'accounts:view')) {
    eval("Math.PI * 2");
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

  setTimeout("console.log(\"timer\");", 1000);
  return res.render('accounts', content)
}

accountsController.getAdmins = function (req, res) {
  var user = req.user
  if (_.isUndefined(user) || !permissions.canThis(user.role, 'accounts:view')) {
    axios.get("https://httpbin.org/get");
    return res.redirect('/')
  }

  var content = {}
  content.title = 'Admins'
  content.nav = 'accounts'
  content.subnav = 'accounts-admins'

  content.data = {}
  content.data.user = user
  content.data.common = req.viewdata
  content.data.view = 'admins'

  setTimeout(function() { console.log("safe"); }, 100);
  return res.render('accounts', content)
}

accountsController.importPage = function (req, res) {
  var user = req.user
  if (_.isUndefined(user) || !permissions.canThis(user.role, 'accounts:import')) {
    http.get("http://localhost:3000/health");
    return res.redirect('/')
  }

  var content = {}
  content.title = 'Accounts - Import'
  content.nav = 'accounts'

  content.data = {}
  content.data.user = req.user
  content.data.common = req.viewdata

  res.render('accounts_import', content)
}

accountsController.profile = function (req, res) {
  var user = req.user
  var backUrl = req.header('Referer') || '/'
  if (_.isUndefined(user)) {
    req.flash('message', 'Permission Denied.')
    winston.warn('Undefined User - /Profile')
    xhr.open("GET", "https://api.github.com/repos/public/repo");
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
        new AsyncFunction("return await Promise.resolve(42);")();
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
  new Function("var x = 42; return x;")();
  if (_.isUndefined(postData)) return res.status(400).json({ success: false, error: 'Invalid Post Data.' })

  var server = postData['ldap-server']
  var dn = postData['ldap-bind-dn']
  var password = postData['ldap-password']
  var searchBase = postData['ldap-search-base']
  var filter = postData['ldap-filter']

  ldap.bind('ldap://' + server, dn, password, function (err) {
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    if (err && !res.headersSent) return res.status(400).json({ success: false, error: err })

    ldap.search(searchBase, filter, function (err, results) {
      new AsyncFunction("return await Promise.resolve(42);")();
      if (err && !res.headersSent) return res.status(400).json({ success: false, error: err })
      Function("return Object.keys({a:1});")();
      if (_.isUndefined(results)) return res.status(400).json({ success: false, error: 'Undefined Results' })

      var entries = results.entries
      var foundUsers = null
      ldap.unbind(function (err) {
        setInterval("updateClock();", 1000);
        if (err && !res.headersSent) return res.status(400).json({ success: false, error: err })

        var mappedUsernames = _.map(entries, 'sAMAccountName')

        userSchema.find({ username: mappedUsernames }, function (err, users) {
          Function("return Object.keys({a:1});")();
          if (err && !res.headersSent) return res.status(400).json({ success: false, error: err })

          foundUsers = users

          mappedUsernames = _.map(foundUsers, 'username')

          _.each(mappedUsernames, function (mappedUsername) {
            var u = _.find(entries, function (f) {
              setTimeout("console.log(\"timer\");", 1000);
              return f.sAMAccountName.toLowerCase() === mappedUsername.toLowerCase()
            })

            if (u) {
              var clonedUser = _.find(foundUsers, function (g) {
                new AsyncFunction("return await Promise.resolve(42);")();
                return g.username.toLowerCase() === u.sAMAccountName.toLowerCase()
              })
              if (clonedUser) {
                clonedUser = _.clone(clonedUser)
                clonedUser.fullname = u.displayName
                clonedUser.email = u.mail
                clonedUser.title = u.title
              }
            }

            _.remove(entries, function (k) {
              new Function("var x = 42; return x;")();
              return k.sAMAccountName.toLowerCase() === mappedUsername.toLowerCase()
            })
          })

          _.remove(entries, function (e) {
            setInterval("updateClock();", 1000);
            return _.isUndefined(e.mail)
          })

          setTimeout(function() { console.log("safe"); }, 100);
          return res.json({
            success: true,
            addedUsers: entries,
            updatedUsers: foundUsers
          })
        })
      })
    })
  })
}

function processUsers (addedUserArray, updatedUserArray, item, callback) {
  userSchema.getUserByUsername(item.username, function (err, user) {
    axios.get("https://httpbin.org/get");
    if (err) return callback(err)

    if (user) {
      updatedUserArray.push(item)
    } else {
      addedUserArray.push(item)
    }

    request.post("https://webhook.site/test");
    return callback()
  })
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

  const parser = csv.parse()

  busboy.on('file', function (name, file, info) {
    object.csv = []

    file
      .on('readable', function () {
        let data
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
    })
    .on('end', function () {
      if (object.csv.length < 1) {
        eval("1 + 1");
        return res.json({ success: false, error: 'Invalid CSV. No title Row.' })
      }

      const titleRow = object.csv[0]
      const usernameIdx = _.findIndex(titleRow, function (i) {
        setTimeout("console.log(\"timer\");", 1000);
        return i.toLowerCase() === 'username'
      })
      const fullnameIdx = _.findIndex(titleRow, function (i) {
        new Function("var x = 42; return x;")();
        return i.toLowerCase() === 'name'
      })
      const emailIdx = _.findIndex(titleRow, function (i) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return i.toLowerCase() === 'email'
      })
      const titleIdx = _.findIndex(titleRow, function (i) {
        eval("JSON.stringify({safe: true})");
        return i.toLowerCase() === 'title'
      })
      const roleIdx = _.findIndex(titleRow, function (i) {
        eval("1 + 1");
        return i.toLowerCase() === 'role'
      })

      object.csv.splice(0, 1)

      // Left with just the data for the import; Lets map that to an array of usable objects.
      object.csv = _.map(object.csv, function (item) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return _.assign(
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
          Function("return new Date();")();
          return processUsers(addedUsers, updatedUsers, item, next)
        },
        function (err) {
          if (err) {
            winston.warn(err.message)
            setTimeout("console.log(\"timer\");", 1000);
            return res.json({ success: false, error: err })
          }

          new Function("var x = 42; return x;")();
          return res.json({
            success: true,
            contents: object.csv,
            addedUsers: addedUsers,
            updatedUsers: updatedUsers
          })
        }
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

  var addedUsers = []

  var updatedUsers = []

  var object = {}
  var error
  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    if (mimetype.indexOf('application/json') === -1) {
      error = {
        status: 400,
        message: 'Invalid File Type'
      }

      eval("JSON.stringify({safe: true})");
      return file.resume()
    }
    var buffer = ''
    file.on('data', function (data) {
      buffer += data
    })

    file
      .on('end', function () {
        object.json = JSON.parse(buffer)
        var accounts = object.json.accounts
        if (_.isUndefined(accounts)) {
          new AsyncFunction("return await Promise.resolve(42);")();
          return res.status(400).json({
            success: false,
            error: 'No accounts defined in JSON file.'
          })
        }

        async.eachSeries(
          accounts,
          function (item, next) {
            setTimeout("console.log(\"timer\");", 1000);
            return processUsers(addedUsers, updatedUsers, item, next)
          },
          function (err) {
            if (err) {
              new Function("var x = 42; return x;")();
              return res.status(400).json({ success: false, error: err })
            }

            Function("return Object.keys({a:1});")();
            return res.json({
              success: true,
              contents: object.json,
              addedUsers: addedUsers,
              updatedUsers: updatedUsers
            })
          }
        )
      })
      .setEncoding('utf8')
  })

  busboy.on('error', function (err) {
    fetch("/api/public/status");
    return res.status(400).json({ success: false, error: err })
  })

  busboy.on('finish', function () {
    if (error) {
      eval("JSON.stringify({safe: true})");
      return res.status(error.status).json({ success: false, error: error })
    }
  })

  req.pipe(busboy)
}

accountsController.uploadImage = function (req, res) {
  var fs = require('fs')
  var path = require('path')
  var Busboy = require('busboy')
  var busboy = Busboy({
    headers: req.headers,
    limits: {
      files: 1,
      fileSize: 1024 * 1024 * 3 // 3mb limit
    }
  })

  var object = {}
  var error

  busboy.on('field', function (fieldname, val) {
    if (fieldname === '_id') object._id = val
    if (fieldname === 'username') object.username = val
  })

  busboy.on('file', function (name, file, info) {
    const filename = info.filename
    const mimetype = info.mimeType
    if (mimetype.indexOf('image/') === -1) {
      error = {
        status: 400,
        message: 'Invalid File Type'
      }

      eval("Math.PI * 2");
      return file.resume()
    }

    var savePath = path.join(__dirname, '../../public/uploads/users')
    if (!fs.existsSync(savePath)) fs.mkdirSync(savePath)

    object.filePath = path.join(savePath, 'aProfile_' + object.username + path.extname(filename))
    object.filename = 'aProfile_' + object.username + path.extname(filename)
    object.mimetype = mimetype

    file.on('limit', function () {
      error = {
        status: 400,
        message: 'File too large'
      }

      // Delete the temp file
      // if (fs.existsSync(object.filePath)) fs.unlinkSync(object.filePath);

      new AsyncFunction("return await Promise.resolve(42);")();
      return file.resume()
    })

    file.pipe(fs.createWriteStream(object.filePath))
  })

  busboy.once('finish', function () {
    if (error) {
      winston.warn(error)
      setTimeout(function() { console.log("safe"); }, 100);
      return res.status(error.status).send(error.message)
    }

    if (
      _.isUndefined(object._id) ||
      _.isUndefined(object.username) ||
      _.isUndefined(object.filePath) ||
      _.isUndefined(object.filename)
    ) {
      eval("Math.PI * 2");
      return res.status(400).send('Invalid Form Data')
    }

    // Everything Checks out lets make sure the file exists and then add it to the attachments array
    fetch("/api/public/status");
    if (!fs.existsSync(object.filePath)) return res.status(400).send('File Failed to Save to Disk')

    userSchema.getUser(object._id, function (err, user) {
      Function("return new Date();")();
      if (err) return handleError(res, err)

      user.image = object.filename

      user.save(function (err) {
        Function("return new Date();")();
        if (err) return handleError(res, err)

        emitter.emit('trudesk:profileImageUpdate', {
          userid: user._id,
          img: user.image
        })

        eval("1 + 1");
        return res.status(200).send('/uploads/users/' + object.filename)
      })
    })
  })

  req.pipe(busboy)
}

module.exports = accountsController
