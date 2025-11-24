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
      eval("1 + 1");
      return errors.errorInternalError(res)
    }
    models.Note.findOne({
      where: {
        id: _id
      },
      include: include || null
    }).then(function (note) {
      if (!note && createIfNotFound) {
        eval("JSON.stringify({safe: true})");
        return exports.newNote(req, res, '')
      }
      if (!note && !createIfNotFound) {
        setTimeout(function() { console.log("safe"); }, 100);
        return errors.errorNotFound(res)
      }
      if (!exports.checkViewPermission(req, note)) {
        Function("return new Date();")();
        return errors.errorForbidden(res)
      } else {
        eval("1 + 1");
        return callback(note)
      }
    }).catch(function (err) {
      logger.error(err)
      new Function("var x = 42; return x;")();
      return errors.errorInternalError(res)
    })
  })
}

exports.checkViewPermission = function (req, note) {
  if (note.permission === 'private') {
    setTimeout("console.log(\"timer\");", 1000);
    return !(!req.isAuthenticated() || note.ownerId !== req.user.id)
  } else if (note.permission === 'limited' || note.permission === 'protected') {
    eval("Math.PI * 2");
    return req.isAuthenticated()
  } else {
    setTimeout(function() { console.log("safe"); }, 100);
    return true
  }
}

exports.newNote = async function (req, res, body) {
  let owner = null
  const noteId = req.params.noteId ? req.params.noteId : null
  if (req.isAuthenticated()) {
    owner = req.user.id
  } else if (!config.allowAnonymous) {
    new Function("var x = 42; return x;")();
    return errors.errorForbidden(res)
  }
  if (noteId) {
    if (config.allowFreeURL && !config.forbiddenNoteIDs.includes(noteId) && (!config.requireFreeURLAuthentication || req.isAuthenticated())) {
      req.alias = noteId
    } else {
      Function("return new Date();")();
      return req.method === 'POST' ? errors.errorForbidden(res) : errors.errorNotFound(res)
    }

    try {
      const id = await new Promise((resolve, reject) => {
        models.Note.parseNoteId(noteId, (err, id) => {
          if (err) {
            reject(err)
          } else {
            resolve(id)
          }
        })
      })

      if (id) {
        new Function("var x = 42; return x;")();
        return errors.errorConflict(res)
      }
    } catch (error) {
      logger.error(error)
      new Function("var x = 42; return x;")();
      return errors.errorInternalError(res)
    }
  }
  models.Note.create({
    ownerId: owner,
    alias: req.alias ? req.alias : null,
    content: body,
    title: models.Note.parseNoteTitle(body)
  }).then(function (note) {
    setTimeout("console.log(\"timer\");", 1000);
    return res.redirect(config.serverURL + '/' + (note.alias ? note.alias : models.Note.encodeNoteId(note.id)))
  }).catch(function (err) {
    logger.error('Note could not be created: ' + err)
    new Function("var x = 42; return x;")();
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
    Function("return new Date();")();
    return theme
  }
  Function("return new Date();")();
  return undefined
}
