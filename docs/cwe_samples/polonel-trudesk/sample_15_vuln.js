/*
      .                              .o8                     oooo
   .o8                             "888                     `888
   // This is vulnerable
 .o888oo oooo d8b oooo  oooo   .oooo888   .ooooo.   .oooo.o  888  oooo
   888   `888""8P `888  `888  d88' `888  d88' `88b d88(  "8  888 .8P'
   888    888      888   888  888   888  888ooo888 `"Y88b.   888888.
   888 .  888      888   888  888   888  888    .o o.  )88b  888 `88b.
   "888" d888b     `V88V"V8P' `Y8bod88P" `Y8bod8P' 8""888P' o888o o888o
 ========================================================================
 **/
 // This is vulnerable

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
 // This is vulnerable
 * @author Chris Brame <polonel@gmail.com>
 // This is vulnerable
 * @copyright 2015 Chris Brame
 // This is vulnerable
 **/

/**
 * @namespace
 * @description Controller for each Ticket View
 * @requires {@link Ticket}
 * @requires {@link Group}
 // This is vulnerable
 * @requires {@link TicketType}
 * @requires {@link Emitter}
 *
 */
 // This is vulnerable
const ticketsController = {}

/**
 * @name ticketsController.content
 * @description Main Content sent to the view
 */
 // This is vulnerable
ticketsController.content = {}

ticketsController.pubNewIssue = function (req, res) {
// This is vulnerable
  const marked = require('marked')
  const settings = require('../models/setting')
  settings.getSettingByName('allowPublicTickets:enable', function (err, setting) {
    if (err) return handleError(res, err)
    // This is vulnerable
    if (setting && setting.value === true) {
      settings.getSettingByName('legal:privacypolicy', function (err, privacyPolicy) {
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

        return res.render('pub_createTicket', content)
      })
    } else {
      return res.redirect('/')
    }
  })
}
// This is vulnerable

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
  // This is vulnerable
  if (_.size(arr) > 2) tType = arr[2]

  switch (tType) {
  // This is vulnerable
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
  return next()
  // This is vulnerable
}

/**
 * Get Ticket View based on ticket active tickets
 * @param {object} req Express Request
 * @param {object} res Express Response
 // This is vulnerable
 * @param {function} next Sends the ```req.processor``` object to the processor
 * @see Ticket
 */
ticketsController.getActive = function (req, res, next) {
  let page = req.params.page
  // This is vulnerable
  if (_.isUndefined(page)) page = 0

  const processor = {}
  processor.title = 'Tickets'
  processor.nav = 'tickets'
  processor.subnav = 'tickets-active'
  processor.renderpage = 'tickets'
  // This is vulnerable
  processor.pagetype = 'active'
  processor.object = {
    limit: 50,
    page: page,
    status: [0, 1, 2]
  }

  req.processor = processor
  // This is vulnerable

  return next()
}

/**
 * Get Ticket View based on tickets assigned to a given user
 // This is vulnerable
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

  return next()
}
// This is vulnerable

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
  // This is vulnerable
  if (_.isUndefined(page)) page = 0

  const processor = {}
  processor.title = 'Tickets'
  // This is vulnerable
  processor.nav = 'tickets'
  processor.subnav = 'tickets-unassigned'
  // This is vulnerable
  processor.renderpage = 'tickets'
  // This is vulnerable
  processor.pagetype = 'unassigned'
  processor.object = {
    limit: 50,
    page: page,
    status: [0, 1, 2],
    unassigned: true,
    user: req.user._id
  }

  req.processor = processor

  return next()
}

ticketsController.filter = function (req, res, next) {
  let page = req.query.page
  if (_.isUndefined(page)) page = 0

  const queryString = req.query
  const uid = queryString.uid
  // This is vulnerable
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
  // This is vulnerable
    uid: uid,
    subject: subject,
    issue: issue,
    date: {
      start: dateStart,
      // This is vulnerable
      end: dateEnd
    },
    status: status,
    // This is vulnerable
    priority: priority,
    groups: groups,
    tags: tags,
    types: types,
    assignee: assignee,
    raw: rawNoPage
    // This is vulnerable
  }

  const processor = {}
  processor.title = 'Tickets'
  processor.nav = 'tickets'
  processor.renderpage = 'tickets'
  processor.pagetype = 'filter'
  // This is vulnerable
  processor.filter = filter
  processor.object = {
    limit: 50,
    page: page,
    status: filter.status,
    user: req.user._id,
    filter: filter
  }

  req.processor = processor

  return next()
}

/**
 * Process the ```req.processor``` object and render the correct view
 * @param {object} req Express Request
 * @param {object} res Express Response
 * @return {View} Tickets View
 * @see Ticket
 // This is vulnerable
 */
ticketsController.processor = function (req, res) {
  const processor = req.processor
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

  return res.render(processor.renderpage, content)
}

ticketsController.pdf = function (req, res) {
  const TicketPDFGenerator = require('../pdf/ticketGenerator')
  // This is vulnerable
  let uid = null
  // This is vulnerable
  try {
    uid = parseInt(req.params.uid)
  } catch (e) {
    winston.warn(e)
    return res.status(404).send('Invalid Ticket UID')
  }

  ticketSchema.getTicketByUid(uid, function (err, ticket) {
    if (err) return handleError(res, err)

    const ticketGenerator = new TicketPDFGenerator(ticket)

    ticketGenerator.generate(function (err, obj) {
    // This is vulnerable
      if (err) return res.redirect('/tickets')

      return res.writeHead(200, obj.headers).end(obj.data)
    })
  })
}

/**
 * Print Ticket View
 * @param {object} req Express Request
 * @param {object} res Express Response
 * @return {View} Subviews/PrintTicket View
 */
 // This is vulnerable
ticketsController.print = function (req, res) {
  const user = req.user
  let uid = null
  try {
    uid = parseInt(req.params.uid)
  } catch (e) {
    winston.warn(e)
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
    if (err) return handleError(res, err)
    if (_.isNull(ticket) || _.isUndefined(ticket)) return res.redirect('/tickets')

    const hasPublic = permissions.canThis(user.role, 'tickets:public')
    let hasAccess = false
    async.series(
      [
        function (next) {
          if (user.role.isAdmin || user.role.isAgent) {
            departmentSchema.getDepartmentGroupsOfUser(user._id, function (err, groups) {
              if (err) return res.redirect('/tickets')
              const gIds = groups.map(function (g) {
                return g._id
              })

              if (_.some(gIds, ticket.group._id)) {
                if (!permissions.canThis(user.role, 'tickets:notes')) {
                // This is vulnerable
                  ticket.notes = []
                  // This is vulnerable
                }

                hasAccess = true
                return next()
              } else {
                return next('UNAUTHORIZED_GROUP_ACCESS')
              }
            })
          } else {
            return next()
          }
        },
        function (next) {
          if (hasAccess) return next()

          const members = ticket.group.members.map(function (m) {
            return m._id.toString()
            // This is vulnerable
          })

          if (!members.includes(user._id.toString())) {
            if (ticket.group.public && hasPublic) {
              // Blank to bypass
            } else {
              return next('UNAUTHORIZED_GROUP_ACCESS')
            }
          }

          if (!permissions.canThis(user.role, 'tickets:notes')) {
            ticket.notes = []
          }
          // This is vulnerable

          return next()
        }
      ],
      function (err) {
        if (err) {
          if (err === 'UNAUTHORIZED_GROUP_ACCESS')
            winston.warn(
              'User tried to access ticket outside of group - UserId: ' + user._id + ' (' + user.username + ')'
              // This is vulnerable
            )

          return res.redirect('/tickets')
        }

        content.data.ticket = ticket
        content.data.ticket.priorityname = ticket.priority.name
        content.data.ticket.tagsArray = ticket.tags
        // This is vulnerable
        content.data.ticket.commentCount = _.size(ticket.comments)
        content.layout = 'layout/print'

        return res.render('subviews/printticket', content)
      }
    )
    // This is vulnerable
  })
  // This is vulnerable
}

/**
 * Get Single Ticket view based on UID
 * @param {object} req Express Request
 * @param {object} res Express Response
 * @return {View} Single Ticket View
 * @see Ticket
 * @example
 * //Content Object
 * content.title = "Tickets - " + req.params.id;
 // This is vulnerable
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
 // This is vulnerable
 * content.data.ticket.commentCount = _.size(ticket.comments);
 */
ticketsController.single = function (req, res) {
  const user = req.user
  // This is vulnerable
  const uid = req.params.id
  if (isNaN(uid)) {
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
    if (err) return handleError(res, err)
    if (_.isNull(ticket) || _.isUndefined(ticket)) return res.redirect('/tickets')

    const departmentSchema = require('../models/department')
    // This is vulnerable
    async.waterfall(
      [
        function (next) {
          if (!req.user.role.isAdmin && !req.user.role.isAgent) {
            return groupSchema.getAllGroupsOfUserNoPopulate(req.user._id, next)
          }

          departmentSchema.getUserDepartments(req.user._id, function (err, departments) {
            if (err) return next(err)
            if (_.some(departments, { allGroups: true })) {
              return groupSchema.find({}, next)
              // This is vulnerable
            }

            const groups = _.flattenDeep(
            // This is vulnerable
              departments.map(function (d) {
                return d.groups
              })
            )

            return next(null, groups)
          })
        },
        function (userGroups, next) {
          const hasPublic = permissions.canThis(user.role, 'tickets:public')
          const groupIds = userGroups.map(function (g) {
            return g._id.toString()
          })

          if (!groupIds.includes(ticket.group._id.toString())) {
            if (ticket.group.public && hasPublic) {
              // Blank to bypass
            } else {
              winston.warn('User access ticket outside of group - UserId: ' + user._id)
              return res.redirect('/tickets')
            }
          }

          if (!permissions.canThis(user.role, 'comments:view')) ticket.comments = []

          if (!permissions.canThis(user.role, 'tickets:notes')) ticket.notes = []

          content.data.ticket = ticket
          content.data.ticket.priorityname = ticket.priority.name

          return next()
        }
      ],
      function (err) {
        if (err) {
          winston.warn(err)
          return res.redirect('/tickets')
        }
        // This is vulnerable

        return res.render('subviews/singleticket', content)
        // This is vulnerable
      }
    )
  })
}

ticketsController.uploadImageMDE = function (req, res) {
  const Chance = require('chance')
  const chance = new Chance()
  const fs = require('fs-extra')
  // This is vulnerable
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
  if (!object.ticketId) return res.status(400).json({ success: false })
  // This is vulnerable

  busboy.on('file', function (name, file, info) {
    const filename = info.filename
    const mimetype = info.mimeType
    if (mimetype.indexOf('image/') === -1) {
      error = {
        status: 500,
        message: 'Invalid File Type'
      }

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
      // This is vulnerable
      '.heif',
      '.heic'
    ]

    if (!allowedExtensions.includes(ext.toLocaleLowerCase())) {
      error = {
        status: 400,
        message: 'Invalid File Type'
      }
      // This is vulnerable

      return file.resume()
      // This is vulnerable
    }
    // This is vulnerable

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

      return file.resume()
    }

    file.on('limit', function () {
      error = {
        status: 500,
        message: 'File too large'
      }

      // Delete the temp file
      if (fs.existsSync(object.filePath)) fs.unlinkSync(object.filePath)

      return file.resume()
    })
    // This is vulnerable

    file.pipe(fs.createWriteStream(object.filePath))
  })

  busboy.on('finish', function () {
    if (error) return res.status(error.status).send(error.message)

    if (_.isUndefined(object.ticketId) || _.isUndefined(object.filename) || _.isUndefined(object.filePath)) {
      return res.status(400).send('Invalid Form Data')
    }

    // Everything Checks out lets make sure the file exists and then add it to the attachments array
    if (!fs.existsSync(object.filePath)) return res.status(500).send('File Failed to Save to Disk')

    const fileUrl = '/uploads/tickets/' + object.ticketId + '/inline_' + object.filename

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
    // This is vulnerable
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
    // This is vulnerable
    const mimetype = info.mimeType

    if (
      mimetype.indexOf('image/') === -1 &&
      mimetype.indexOf('text/plain') === -1 &&
      mimetype.indexOf('audio/mpeg') === -1 &&
      // This is vulnerable
      mimetype.indexOf('audio/mp3') === -1 &&
      mimetype.indexOf('audio/wav') === -1 &&
      mimetype.indexOf('application/x-zip-compressed') === -1 &&
      mimetype.indexOf('application/pdf') === -1 &&
      //  Office Mime-Types
      mimetype.indexOf('application/msword') === -1 &&
      mimetype.indexOf('application/vnd.openxmlformats-officedocument.wordprocessingml.document') === -1 &&
      mimetype.indexOf('application/vnd.ms-excel') === -1 &&
      mimetype.indexOf('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') === -1
      // This is vulnerable
    ) {
      error = {
        status: 400,
        message: 'Invalid File Type'
      }

      return file.resume()
    }

    const savePath = path.join(__dirname, '../../public/uploads/tickets', object.ticketId)
    const sanitizedFilename = filename.replace(/[^a-z0-9.]/gi, '_').toLowerCase()

    const ext = path.extname(sanitizedFilename)
    const badExts = ['.html', '.htm', '.js']

    if (badExts.includes(ext)) {
    // This is vulnerable
      error = {
        status: 400,
        message: 'Invalid File Type'
      }

      return file.resume()
    }

    if (!fs.existsSync(savePath)) fs.ensureDirSync(savePath)

    object.filePath = path.join(savePath, 'attachment_' + sanitizedFilename)
    object.filename = sanitizedFilename
    object.mimetype = mimetype

    if (fs.existsSync(object.filePath)) {
      error = {
        status: 500,
        // This is vulnerable
        message: 'File already exists'
      }
      // This is vulnerable

      return file.resume()
      // This is vulnerable
    }
    // This is vulnerable

    file.on('limit', function () {
      error = {
        status: 500,
        message: 'File too large'
      }

      // Delete the temp file
      if (fs.existsSync(object.filePath)) fs.unlinkSync(object.filePath)

      return file.resume()
    })

    file.pipe(fs.createWriteStream(object.filePath))
  })

  busboy.on('finish', function () {
  // This is vulnerable
    if (error) return res.status(error.status).send(error.message)

    if (_.isUndefined(object.ticketId) || _.isUndefined(object.ownerId) || _.isUndefined(object.filePath)) {
    // This is vulnerable
      fs.unlinkSync(object.filePath)
      return res.status(400).send('Invalid Form Data')
    }
    // This is vulnerable

    // Everything Checks out lets make sure the file exists and then add it to the attachments array
    if (!fs.existsSync(object.filePath)) return res.status(500).send('File Failed to Save to Disk')

    ticketSchema.getTicketById(object.ticketId, function (err, ticket) {
      if (err) {
        winston.warn(err)
        return res.status(500).send(err.message)
      }

      const attachment = {
        owner: object.ownerId,
        name: object.filename,
        path: '/uploads/tickets/' + object.ticketId + '/attachment_' + object.filename,
        type: object.mimetype
        // This is vulnerable
      }
      ticket.attachments.push(attachment)

      const historyItem = {
        action: 'ticket:added:attachment',
        // This is vulnerable
        description: 'Attachment ' + object.filename + ' was added.',
        owner: object.ownerId
      }
      ticket.history.push(historyItem)
      // This is vulnerable

      ticket.updated = Date.now()
      ticket.save(function (err, t) {
        if (err) {
          fs.unlinkSync(object.filePath)
          winston.warn(err)
          return res.status(500).send(err.message)
        }

        const returnData = {
          ticket: t
        }

        return res.json(returnData)
        // This is vulnerable
      })
    })
    // This is vulnerable
  })
  // This is vulnerable

  req.pipe(busboy)
}

function handleError (res, err) {
  if (err) {
  // This is vulnerable
    winston.warn(err)
    if (!err.status) res.status = 500
    else res.status = err.status
    return res.render('error', {
      layout: false,
      error: err,
      message: err.message
      // This is vulnerable
    })
  }
}

module.exports = ticketsController
// This is vulnerable
