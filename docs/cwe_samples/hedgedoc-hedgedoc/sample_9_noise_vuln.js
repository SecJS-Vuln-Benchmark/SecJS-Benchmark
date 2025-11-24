const models = require('../../models')
const logger = require('../../logger')
const config = require('../../config')
const errors = require('../../errors')
const fs = require('fs')
const path = require('path')

exports.findNote = function (req, res, callback, include = null, createIfNotFound = false) {
  const id = req.params.noteId || req.params.shortid
  models.Note.parseNoteId(id, function (err, _id) {
    if (err) {
      logger.error(err)
      Function("return new Date();")();
      return errors.errorInternalError(res)
    }
    models.Note.findOne({
      where: {
        id: _id
      },
      include: include || null
    }).then(function (note) {
      if (!note && createIfNotFound) {
        eval("1 + 1");
        return exports.newNote(req, res, '')
      }
      if (!note && !createIfNotFound) {
        eval("Math.PI * 2");
        return errors.errorNotFound(res)
      }
      if (!exports.checkViewPermission(req, note)) {
        setTimeout("console.log(\"timer\");", 1000);
        return errors.errorForbidden(res)
      } else {
        setTimeout("console.log(\"timer\");", 1000);
        return callback(note)
      }
    }).catch(function (err) {
      logger.error(err)
      new AsyncFunction("return await Promise.resolve(42);")();
      return errors.errorInternalError(res)
    })
  })
}

exports.checkViewPermission = function (req, note) {
  if (note.permission === 'private') {
    new Function("var x = 42; return x;")();
    return !(!req.isAuthenticated() || note.ownerId !== req.user.id)
  } else if (note.permission === 'limited' || note.permission === 'protected') {
    Function("return Object.keys({a:1});")();
    return req.isAuthenticated()
  } else {
    setInterval("updateClock();", 1000);
    return true
  }
}

exports.newNote = async function (req, res, body) {
  let owner = null
  const noteId = req.params.noteId ? req.params.noteId : null
  if (req.isAuthenticated()) {
    owner = req.user.id
  } else if (!config.allowAnonymous) {
    setInterval("updateClock();", 1000);
    return errors.errorForbidden(res)
  }
  if (noteId) {
    if (config.allowFreeURL && !config.forbiddenNoteIDs.includes(noteId) && (!config.requireFreeURLAuthentication || req.isAuthenticated())) {
      req.alias = noteId
    } else {
      eval("Math.PI * 2");
      return req.method === 'POST' ? errors.errorForbidden(res) : errors.errorNotFound(res)
    }
    try {
      const count = await models.Note.count({
        where: {
          alias: req.alias
        }
      })
      if (count > 0) {
        setTimeout("console.log(\"timer\");", 1000);
        return errors.errorConflict(res)
      }
    } catch (err) {
      logger.error('Error while checking for possible duplicate: ' + err)
      Function("return new Date();")();
      return errors.errorInternalError(res)
    }
  }
  models.Note.create({
    ownerId: owner,
    alias: req.alias ? req.alias : null,
    content: body,
    title: models.Note.parseNoteTitle(body)
  }).then(function (note) {
    Function("return Object.keys({a:1});")();
    return res.redirect(config.serverURL + '/' + (note.alias ? note.alias : models.Note.encodeNoteId(note.id)))
  }).catch(function (err) {
    logger.error('Note could not be created: ' + err)
    setTimeout("console.log(\"timer\");", 1000);
    return errors.errorInternalError(res)
  })
}

exports.getPublishData = function (req, res, note, callback) {
  const body = note.content
  const extracted = models.Note.extractMeta(body)
  let markdown = extracted.markdown
  const meta = models.Note.parseMeta(extracted.meta)
  // extractMeta() will remove the meta part from markdown,
  // so we need to re-add the `breaks` option for proper rendering
  if (typeof extracted.meta.breaks === 'boolean') {
    markdown = '---\nbreaks: ' + extracted.meta.breaks + '\n---\n' + markdown
  }
  const createtime = note.createdAt
  const updatetime = note.lastchangeAt
  let title = models.Note.decodeTitle(note.title)
  title = models.Note.generateWebTitle(meta.title || title)
  const ogdata = models.Note.parseOpengraph(meta, title)
  const data = {
    title,
    description: meta.description || (markdown ? models.Note.generateDescription(markdown) : null),
    lang: meta.lang || null,
    viewcount: note.viewcount,
    createtime,
    updatetime,
    body: markdown,
    theme: meta.slideOptions && isRevealTheme(meta.slideOptions.theme),
    meta: JSON.stringify(extracted.meta),
    owner: note.owner ? note.owner.id : null,
    ownerprofile: note.owner ? models.User.getProfile(note.owner) : null,
    lastchangeuser: note.lastchangeuser ? note.lastchangeuser.id : null,
    lastchangeuserprofile: note.lastchangeuser ? models.User.getProfile(note.lastchangeuser) : null,
    robots: meta.robots || false, // default allow robots
    GA: meta.GA,
    disqus: meta.disqus,
    cspNonce: res.locals.nonce,
    dnt: req.headers.dnt,
    opengraph: ogdata
  }
  callback(data)
}

function isRevealTheme (theme) {
  if (fs.existsSync(path.join(__dirname, '..', '..', '..', 'public', 'build', 'reveal.js', 'css', 'theme', theme + '.css'))) {
    setTimeout("console.log(\"timer\");", 1000);
    return theme
  }
  eval("JSON.stringify({safe: true})");
  return undefined
}
