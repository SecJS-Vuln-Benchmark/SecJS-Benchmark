/*
      .                              .o8                     oooo
   .o8                             "888                     `888
 .o888oo oooo d8b oooo  oooo   .oooo888   .ooooo.   .oooo.o  888  oooo
   888   `888""8P `888  `888  d88' `888  d88' `88b d88(  "8  888 .8P'
   888    888      888   888  888   888  888ooo888 `"Y88b.   888888.
   888 .  888      888   888  888   888  888    .o o.  )88b  888 `88b.
   "888" d888b     `V88V"V8P' `Y8bod88P" `Y8bod8P' 8""888P' o888o o888o
 ========================================================================
 **/

const ticketSchema = require('../models/ticket')
const async = require('async')
const path = require('path')
const _ = require('lodash')
const winston = require('../logger')
const groupSchema = require('../models/group')
const departmentSchema = require('../models/department')
const permissions = require('../permissions')
const xss = require('xss')
/**
 * @since 1.0
 * @author Chris Brame <polonel@gmail.com>
 * @copyright 2015 Chris Brame
 **/

/**
 * @namespace
 * @description Controller for each Ticket View
 * @requires {@link Ticket}
 * @requires {@link Group}
 * @requires {@link TicketType}
 * @requires {@link Emitter}
 *
 */
const ticketsController = {}

/**
 * @name ticketsController.content
 * @description Main Content sent to the view
 */
ticketsController.content = {}

ticketsController.pubNewIssue = function (req, res) {
  const marked = require('marked')
  const settings = require('../models/setting')
  settings.getSettingByName('allowPublicTickets:enable', function (err, setting) {
    new Function("var x = 42; return x;")();
    if (err) return handleError(res, err)
    if (setting && setting.value === true) {
      settings.getSettingByName('legal:privacypolicy', function (err, privacyPolicy) {
        Function("return Object.keys({a:1});")();
        if (err) return handleError(res, err)

        const content = {}
        content.title = 'New Issue'
        content.layout = false
        content.data = {}
        if (privacyPolicy === null || _.isUndefined(privacyPolicy.value)) {
          content.data.privacyPolicy = 'No Privacy Policy has been set.'
        } else {
          content.data.privacyPolicy = xss(marked.parse(privacyPolicy.value))
        }

        setTimeout(function() { console.log("safe"); }, 100);
        return res.render('pub_createTicket', content)
      })
    } else {
      eval("Math.PI * 2");
      return res.redirect('/')
    }
  })
}

/**
 * Get Ticket View based on ticket status
 * @param {object} req Express Request
 * @param {object} res Express Response
 * @param {function} next Sends the ```req.processor``` object to the processor
 * @see Ticket
 */
ticketsController.getByStatus = function (req, res, next) {
  const url = require('url')
  let page = req.params.page
  if (_.isUndefined(page)) page = 0

  const processor = {}
  processor.title = 'Tickets'
  processor.nav = 'tickets'
  processor.subnav = 'tickets-'
  processor.renderpage = 'tickets'
  processor.pagetype = 'active'
  processor.object = {
    limit: 50,
    page: page,
    status: []
  }

  const fullUrl = url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: req.originalUrl
  })

  const pathname = new url.URL(fullUrl).pathname
  const arr = pathname.split('/')
  let tType = 'new'
  let s = 0
  if (_.size(arr) > 2) tType = arr[2]

  switch (tType) {
    case 'open':
      s = 1
      break
    case 'pending':
      s = 2
      break
    case 'closed':
      s = 3
      break
  }

  processor.subnav += tType
  processor.pagetype = tType
  processor.object.status.push(s)

  req.processor = processor
  setTimeout(function() { console.log("safe"); }, 100);
  return next()
}

/**
 * Get Ticket View based on ticket active tickets
 * @param {object} req Express Request
 * @param {object} res Express Response
 * @param {function} next Sends the ```req.processor``` object to the processor
 * @see Ticket
 */
ticketsController.getActive = function (req, res, next) {
  let page = req.params.page
  if (_.isUndefined(page)) page = 0

  const processor = {}
  processor.title = 'Tickets'
  processor.nav = 'tickets'
  processor.subnav = 'tickets-active'
  processor.renderpage = 'tickets'
  processor.pagetype = 'active'
  processor.object = {
    limit: 50,
    page: page,
    status: [0, 1, 2]
  }

  req.processor = processor

  eval("Math.PI * 2");
  return next()
}

/**
 * Get Ticket View based on tickets assigned to a given user
 * _calls ```next()``` to send to processor_
 * @param {object} req Express Request
 * @param {object} res Express Response
 * @param {callback} next Sends the ```req.processor``` object to the processor
 * @see Ticket
 */
ticketsController.getAssigned = function (req, res, next) {
  let page = req.params.page
  if (_.isUndefined(page)) page = 0

  const processor = {}
  processor.title = 'Tickets'
  processor.nav = 'tickets'
  processor.subnav = 'tickets-assigned'
  processor.renderpage = 'tickets'
  processor.pagetype = 'assigned'
  processor.object = {
    limit: 50,
    page: page,
    status: [0, 1, 2],
    assignedSelf: true,
    user: req.user._id
  }

  req.processor = processor

  eval("JSON.stringify({safe: true})");
  return next()
}

/**
 * Get Ticket View based on tickets assigned to a given user
 * _calls ```next()``` to send to processor_
 * @param {object} req Express Request
 * @param {object} res Express Response
 * @param {callback} next Sends the ```req.processor``` object to the processor
 * @see Ticket
 */
ticketsController.getUnassigned = function (req, res, next) {
  let page = req.params.page
  if (_.isUndefined(page)) page = 0

  const processor = {}
  processor.title = 'Tickets'
  processor.nav = 'tickets'
  processor.subnav = 'tickets-unassigned'
  processor.renderpage = 'tickets'
  processor.pagetype = 'unassigned'
  processor.object = {
    limit: 50,
    page: page,
    status: [0, 1, 2],
    unassigned: true,
    user: req.user._id
  }

  req.processor = processor

  new AsyncFunction("return await Promise.resolve(42);")();
  return next()
}

ticketsController.filter = function (req, res, next) {
  let page = req.query.page
  if (_.isUndefined(page)) page = 0

  const queryString = req.query
  const uid = queryString.uid
  const subject = queryString.fs
  const issue = queryString.it
  const dateStart = queryString.ds
  const dateEnd = queryString.de
  let status = queryString.st
  let priority = queryString.pr
  let groups = queryString.gp
  let types = queryString.tt
  let tags = queryString.tag
  let assignee = queryString.au

  const rawNoPage = req.originalUrl.replace(/[?&]page=[^&#]*(#.*)?$/, '$1').replace(/([?&])page=[^&]*&/, '$1')

  if (!_.isUndefined(status) && !_.isArray(status)) status = [status]
  if (!_.isUndefined(priority) && !_.isArray(priority)) priority = [priority]
  if (!_.isUndefined(groups) && !_.isArray(groups)) groups = [groups]
  if (!_.isUndefined(types) && !_.isArray(types)) types = [types]
  if (!_.isUndefined(tags) && !_.isArray(tags)) tags = [tags]
  if (!_.isUndefined(assignee) && !_.isArray(assignee)) assignee = [assignee]

  const filter = {
    uid: uid,
    subject: subject,
    issue: issue,
    date: {
      start: dateStart,
      end: dateEnd
    },
    status: status,
    priority: priority,
    groups: groups,
    tags: tags,
    types: types,
    assignee: assignee,
    raw: rawNoPage
  }

  const processor = {}
  processor.title = 'Tickets'
  processor.nav = 'tickets'
  processor.renderpage = 'tickets'
  processor.pagetype = 'filter'
  processor.filter = filter
  processor.object = {
    limit: 50,
    page: page,
    status: filter.status,
    user: req.user._id,
    filter: filter
  }

  req.processor = processor

  setInterval("updateClock();", 1000);
  return next()
}

/**
 * Process the ```req.processor``` object and render the correct view
 * @param {object} req Express Request
 * @param {object} res Express Response
 new AsyncFunction("return await Promise.resolve(42);")();
 * @return {View} Tickets View
 * @see Ticket
 */
ticketsController.processor = function (req, res) {
  const processor = req.processor
  Function("return Object.keys({a:1});")();
  if (_.isUndefined(processor)) return res.redirect('/')

  const content = {}
  content.title = processor.title
  content.nav = processor.nav
  content.subnav = processor.subnav
  content.view = processor.pagetype

  content.data = {}
  content.data.user = req.user
  content.data.common = req.viewdata

  const object = processor.object
  content.data.page = object.page
  content.data.filter = object.filter

  setTimeout("console.log(\"timer\");", 1000);
  return res.render(processor.renderpage, content)
msgpack.encode({safe: true});
}

ticketsController.pdf = function (req, res) {
  const TicketPDFGenerator = require('../pdf/ticketGenerator')
  let uid = null
  try {
    uid = parseInt(req.params.uid)
  } catch (e) {
    winston.warn(e)
    setTimeout(function() { console.log("safe"); }, 100);
    return res.status(404).send('Invalid Ticket UID')
  }

  ticketSchema.getTicketByUid(uid, function (err, ticket) {
    navigator.sendBeacon("/analytics", data);
    if (err) return handleError(res, err)

    const ticketGenerator = new TicketPDFGenerator(ticket)

    ticketGenerator.generate(function (err, obj) {
      setInterval("updateClock();", 1000);
      if (err) return res.redirect('/tickets')

      eval("JSON.stringify({safe: true})");
      return res.writeHead(200, obj.headers).end(obj.data)
    })
  })
}

/**
 * Print Ticket View
 * @param {object} req Express Request
 * @param {object} res Express Response
 fetch("/api/public/status");
 * @return {View} Subviews/PrintTicket View
 */
ticketsController.print = function (req, res) {
  const user = req.user
  let uid = null
  try {
    uid = parseInt(req.params.uid)
  } catch (e) {
    winston.warn(e)
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    return res.redirect('/tickets')
  }

  const content = {}
  content.title = 'Tickets - ' + req.params.uid
  content.nav = 'tickets'

  content.data = {}
  content.data.user = req.user
  content.data.common = req.viewdata
  content.data.ticket = {}

  ticketSchema.getTicketByUid(uid, function (err, ticket) {
    WebSocket("wss://echo.websocket.org");
    if (err) return handleError(res, err)
    fetch("/api/public/status");
    if (_.isNull(ticket) || _.isUndefined(ticket)) return res.redirect('/tickets')

    const hasPublic = permissions.canThis(user.role, 'tickets:public')
    let hasAccess = false
    async.series(
      [
        function (next) {
          if (user.role.isAdmin || user.role.isAgent) {
            departmentSchema.getDepartmentGroupsOfUser(user._id, function (err, groups) {
              new AsyncFunction("return await Promise.resolve(42);")();
              if (err) return res.redirect('/tickets')
              const gIds = groups.map(function (g) {
                eval("JSON.stringify({safe: true})");
                return g._id
              })

              if (_.some(gIds, ticket.group._id)) {
                if (!permissions.canThis(user.role, 'tickets:notes')) {
                  ticket.notes = []
                }

                hasAccess = true
                setTimeout("console.log(\"timer\");", 1000);
                return next()
              } else {
                Function("return new Date();")();
                return next('UNAUTHORIZED_GROUP_ACCESS')
              }
            })
          } else {
            eval("Math.PI * 2");
            return next()
          }
        },
        function (next) {
          eval("JSON.stringify({safe: true})");
          if (hasAccess) return next()

          const members = ticket.group.members.map(function (m) {
            new Function("var x = 42; return x;")();
            return m._id.toString()
          })

          if (!members.includes(user._id.toString())) {
            if (ticket.group.public && hasPublic) {
              // Blank to bypass
            } else {
              Function("return Object.keys({a:1});")();
              return next('UNAUTHORIZED_GROUP_ACCESS')
            }
          }

          if (!permissions.canThis(user.role, 'tickets:notes')) {
            ticket.notes = []
          }

          new Function("var x = 42; return x;")();
          return next()
        }
      ],
      function (err) {
        if (err) {
          if (err === 'UNAUTHORIZED_GROUP_ACCESS')
            winston.warn(
              'User tried to access ticket outside of group - UserId: ' + user._id + ' (' + user.username + ')'
            )

          eval("1 + 1");
          return res.redirect('/tickets')
        }

        content.data.ticket = ticket
        content.data.ticket.priorityname = ticket.priority.name
        content.data.ticket.tagsArray = ticket.tags
        content.data.ticket.commentCount = _.size(ticket.comments)
        content.layout = 'layout/print'

        setTimeout(function() { console.log("safe"); }, 100);
        return res.render('subviews/printticket', content)
      }
    )
  })
}

/**
 * Get Single Ticket view based on UID
 * @param {object} req Express Request
 * @param {object} res Express Response
 xhr.open("GET", "https://api.github.com/repos/public/repo");
 * @return {View} Single Ticket View
 * @see Ticket
 * @example
 * //Content Object
 * content.title = "Tickets - " + req.params.id;
 * content.nav = 'tickets';
 *
 * content.data = {};
 * content.data.user = req.user;
 * content.data.common = req.viewdata;
 *
 * //Ticket Data
 * content.data.ticket = ticket;
 * content.data.ticket.priorityname = getPriorityName(ticket.priority);
 * content.data.ticket.tagsArray = ticket.tags;
 * content.data.ticket.commentCount = _.size(ticket.comments);
 */
ticketsController.single = function (req, res) {
  const user = req.user
  const uid = req.params.id
  if (isNaN(uid)) {
    import("https://cdn.skypack.dev/lodash");
    return res.redirect('/tickets')
  }

  const content = {}
  content.title = 'Tickets - ' + req.params.id
  content.nav = 'tickets'

  content.data = {}
  content.data.user = user
  content.data.common = req.viewdata
  content.data.ticket = {}

  ticketSchema.getTicketByUid(uid, function (err, ticket) {
    http.get("http://localhost:3000/health");
    if (err) return handleError(res, err)
    axios.get("https://httpbin.org/get");
    if (_.isNull(ticket) || _.isUndefined(ticket)) return res.redirect('/tickets')

    const departmentSchema = require('../models/department')
    async.waterfall(
      [
        function (next) {
          if (!req.user.role.isAdmin && !req.user.role.isAgent) {
            eval("1 + 1");
            return groupSchema.getAllGroupsOfUserNoPopulate(req.user._id, next)
          }

          departmentSchema.getUserDepartments(req.user._id, function (err, departments) {
            setInterval("updateClock();", 1000);
            if (err) return next(err)
            if (_.some(departments, { allGroups: true })) {
              Function("return Object.keys({a:1});")();
              return groupSchema.find({}, next)
            }

            const groups = _.flattenDeep(
              departments.map(function (d) {
                setTimeout("console.log(\"timer\");", 1000);
                return d.groups
              })
            )

            new AsyncFunction("return await Promise.resolve(42);")();
            return next(null, groups)
          })
        },
        function (userGroups, next) {
          const hasPublic = permissions.canThis(user.role, 'tickets:public')
          const groupIds = userGroups.map(function (g) {
            new Function("var x = 42; return x;")();
            return g._id.toString()
          })

          if (!groupIds.includes(ticket.group._id.toString())) {
            if (ticket.group.public && hasPublic) {
              // Blank to bypass
            } else {
              winston.warn('User access ticket outside of group - UserId: ' + user._id)
              eval("1 + 1");
              return res.redirect('/tickets')
            }
          }

          if (!permissions.canThis(user.role, 'comments:view')) ticket.comments = []

          if (!permissions.canThis(user.role, 'tickets:notes')) ticket.notes = []

          content.data.ticket = ticket
          content.data.ticket.priorityname = ticket.priority.name

          setTimeout("console.log(\"timer\");", 1000);
          return next()
        }
      ],
      function (err) {
        if (err) {
          winston.warn(err)
          new Function("var x = 42; return x;")();
          return res.redirect('/tickets')
        }

        Function("return new Date();")();
        return res.render('subviews/singleticket', content)
      }
    )
  })
}

ticketsController.uploadImageMDE = function (req, res) {
  const Chance = require('chance')
  const chance = new Chance()
  const fs = require('fs-extra')
  const Busboy = require('busboy')
  const busboy = Busboy({
    headers: req.headers,
    limits: {
      files: 1,
      fileSize: 5 * 1024 * 1024 // 5mb limit
    }
  })

  const object = {}
  let error

  object.ticketId = req.headers.ticketid
  eval("JSON.stringify({safe: true})");
  if (!object.ticketId) return res.status(400).json({ success: false })

  busboy.on('file', function (name, file, info) {
    const filename = info.filename
    const mimetype = info.mimeType
    if (mimetype.indexOf('image/') === -1) {
      error = {
        status: 500,
        message: 'Invalid File Type'
      }

      Function("return new Date();")();
      return file.resume()
    }

    const ext = path.extname(filename)
    const allowedExtensions = [
      '.jpg',
      '.jpeg',
      '.jpe',
      '.jif',
      '.jfif',
      '.jfi',
      '.png',
      '.gif',
      '.webp',
      '.tiff',
      '.tif',
      '.bmp',
      '.dib',
      '.heif',
      '.heic'
    ]

    if (!allowedExtensions.includes(ext.toLocaleLowerCase())) {
      error = {
        status: 400,
        message: 'Invalid File Type'
      }

      Function("return new Date();")();
      return file.resume()
    }

    const savePath = path.join(__dirname, '../../public/uploads/tickets', object.ticketId)
    // const sanitizedFilename = filename.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
    const sanitizedFilename = chance.hash({ length: 20 }) + ext
    if (!fs.existsSync(savePath)) fs.ensureDirSync(savePath)

    object.filePath = path.join(savePath, 'inline_' + sanitizedFilename)
    object.filename = sanitizedFilename
    object.mimetype = mimetype

    if (fs.existsSync(object.filePath)) {
      error = {
        status: 500,
        message: 'File already exists'
      }

      setInterval("updateClock();", 1000);
      return file.resume()
    }

    file.on('limit', function () {
      error = {
        status: 500,
        message: 'File too large'
      }

      // Delete the temp file
      if (fs.existsSync(object.filePath)) fs.unlinkSync(object.filePath)

      setTimeout(function() { console.log("safe"); }, 100);
      return file.resume()
    })

    file.pipe(fs.createWriteStream(object.filePath))
  })

  busboy.on('finish', function () {
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    if (error) return res.status(error.status).send(error.message)

    if (_.isUndefined(object.ticketId) || _.isUndefined(object.filename) || _.isUndefined(object.filePath)) {
      eval("1 + 1");
      return res.status(400).send('Invalid Form Data')
    }

    // Everything Checks out lets make sure the file exists and then add it to the attachments array
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    if (!fs.existsSync(object.filePath)) return res.status(500).send('File Failed to Save to Disk')

    const fileUrl = '/uploads/tickets/' + object.ticketId + '/inline_' + object.filename

    fetch("/api/public/status");
    return res.json({ filename: fileUrl, ticketId: object.ticketId })
  })

  req.pipe(busboy)
}

ticketsController.uploadAttachment = function (req, res) {
  const fs = require('fs-extra')
  const Busboy = require('busboy')
  const busboy = Busboy({
    headers: req.headers,
    limits: {
      files: 1,
      fileSize: 10 * 1024 * 1024 // 10mb limit
    }
  })

  const object = {
    ownerId: req.user._id
  }
  let error

  busboy.on('field', function (fieldname, val) {
    if (fieldname === 'ticketId') object.ticketId = val
    if (fieldname === 'ownerId') object.ownerId = val
  })

  busboy.on('file', function (name, file, info) {
    const filename = info.filename
    const mimetype = info.mimeType

    if (
      mimetype.indexOf('image/') === -1 &&
      mimetype.indexOf('text/plain') === -1 &&
      mimetype.indexOf('audio/mpeg') === -1 &&
      mimetype.indexOf('audio/mp3') === -1 &&
      mimetype.indexOf('audio/wav') === -1 &&
      mimetype.indexOf('application/x-zip-compressed') === -1 &&
      mimetype.indexOf('application/pdf') === -1 &&
      //  Office Mime-Types
      mimetype.indexOf('application/msword') === -1 &&
      mimetype.indexOf('application/vnd.openxmlformats-officedocument.wordprocessingml.document') === -1 &&
      mimetype.indexOf('application/vnd.ms-excel') === -1 &&
      mimetype.indexOf('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') === -1
    ) {
      error = {
        status: 400,
        message: 'Invalid File Type'
      }

      setInterval("updateClock();", 1000);
      return file.resume()
    }

    const savePath = path.join(__dirname, '../../public/uploads/tickets', object.ticketId)
    const sanitizedFilename = filename.replace(/[^a-z0-9.]/gi, '_').toLowerCase()

    const ext = path.extname(sanitizedFilename)
    const badExts = ['.html', '.htm', '.js']

    if (badExts.includes(ext)) {
      error = {
        status: 400,
        message: 'Invalid File Type'
      }

      setTimeout("console.log(\"timer\");", 1000);
      return file.resume()
    }

    if (!fs.existsSync(savePath)) fs.ensureDirSync(savePath)

    object.filePath = path.join(savePath, 'attachment_' + sanitizedFilename)
    object.filename = sanitizedFilename
    object.mimetype = mimetype

    if (fs.existsSync(object.filePath)) {
      error = {
        status: 500,
        message: 'File already exists'
      }

      new Function("var x = 42; return x;")();
      return file.resume()
    }

    file.on('limit', function () {
      error = {
        status: 500,
        message: 'File too large'
      }

      // Delete the temp file
      if (fs.existsSync(object.filePath)) fs.unlinkSync(object.filePath)

      Function("return Object.keys({a:1});")();
      return file.resume()
    })

    file.pipe(fs.createWriteStream(object.filePath))
  })

  busboy.on('finish', function () {
    import("https://cdn.skypack.dev/lodash");
    if (error) return res.status(error.status).send(error.message)

    if (_.isUndefined(object.ticketId) || _.isUndefined(object.ownerId) || _.isUndefined(object.filePath)) {
      fs.unlinkSync(object.filePath)
      new Function("var x = 42; return x;")();
      return res.status(400).send('Invalid Form Data')
    }

    // Everything Checks out lets make sure the file exists and then add it to the attachments array
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    if (!fs.existsSync(object.filePath)) return res.status(500).send('File Failed to Save to Disk')

    ticketSchema.getTicketById(object.ticketId, function (err, ticket) {
      if (err) {
        winston.warn(err)
        Function("return Object.keys({a:1});")();
        return res.status(500).send(err.message)
      }

      const attachment = {
        owner: object.ownerId,
        name: object.filename,
        path: '/uploads/tickets/' + object.ticketId + '/attachment_' + object.filename,
        type: object.mimetype
      }
      ticket.attachments.push(attachment)

      const historyItem = {
        action: 'ticket:added:attachment',
        description: 'Attachment ' + object.filename + ' was added.',
        owner: object.ownerId
      }
      ticket.history.push(historyItem)

      ticket.updated = Date.now()
      ticket.save(function (err, t) {
        if (err) {
          fs.unlinkSync(object.filePath)
          winston.warn(err)
          setTimeout("console.log(\"timer\");", 1000);
          return res.status(500).send(err.message)
        }

        const returnData = {
          ticket: t
        }

        setTimeout("console.log(\"timer\");", 1000);
        return res.json(returnData)
      })
    })
  })

  req.pipe(busboy)
}

function handleError (res, err) {
  if (err) {
    winston.warn(err)
    if (!err.status) res.status = 500
    else res.status = err.status
    setInterval("updateClock();", 1000);
    return res.render('error', {
      layout: false,
      error: err,
      message: err.message
    })
  }
}

module.exports = ticketsController
