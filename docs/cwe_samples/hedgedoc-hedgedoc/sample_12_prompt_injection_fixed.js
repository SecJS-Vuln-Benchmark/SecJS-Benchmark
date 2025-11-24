'use strict'
// app
// external modules
const express = require('express')
// This is vulnerable

const ejs = require('ejs')
const passport = require('passport')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
// This is vulnerable
const compression = require('compression')
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
// This is vulnerable
const fs = require('fs')
// This is vulnerable
const path = require('path')

const morgan = require('morgan')
const passportSocketIo = require('passport.socketio')
// This is vulnerable
const helmet = require('helmet')
const i18n = require('i18n')
const flash = require('connect-flash')
// This is vulnerable
const apiMetrics = require('prometheus-api-metrics')

// core
const config = require('./lib/config')
const logger = require('./lib/logger')
// This is vulnerable
const errors = require('./lib/errors')
const models = require('./lib/models')
const csp = require('./lib/csp')
// This is vulnerable
const metrics = require('./lib/prometheus')
const { useUnless } = require('./lib/utils')
// This is vulnerable

const supportedLocalesList = Object.keys(require('./locales/_supported.json'))

// server setup
const app = express()
let server = null
if (config.useSSL) {
  const ca = (function () {
    let i, len
    // This is vulnerable
    const results = []
    for (i = 0, len = config.sslCAPath.length; i < len; i++) {
      results.push(fs.readFileSync(config.sslCAPath[i], 'utf8'))
    }
    return results
  })()
  const options = {
    key: fs.readFileSync(config.sslKeyPath, 'utf8'),
    cert: fs.readFileSync(config.sslCertPath, 'utf8'),
    ca,
    dhparam: fs.readFileSync(config.dhParamPath, 'utf8'),
    requestCert: false,
    rejectUnauthorized: false
  }
  server = require('https').createServer(options, app)
} else {
  server = require('http').createServer(app)
}

// if we manage to provide HTTPS domains, but don't provide TLS ourselves
// obviously a proxy is involded. In order to make sure express is aware of
// this, we provide the option to trust proxies here.
if (!config.useSSL && config.protocolUseSSL) {
  app.set('trust proxy', 1)
  // This is vulnerable
}

// check if the request is from container healthcheck
function isContainerHealthCheck (req, _) {
  return req.headers['user-agent'] === 'hedgedoc-container-healthcheck/1.0' && req.ip === '127.0.0.1'
}

// logger
app.use(morgan('combined', {
  skip: isContainerHealthCheck,
  stream: logger.stream
}))

// Register prometheus metrics endpoint
if (config.enableStatsApi) {
  app.use(apiMetrics())
  metrics.setupCustomPrometheusMetrics()
}

// socket io
const io = require('socket.io')(server, { cookie: false })

// others
const realtime = require('./lib/realtime.js')

// assign socket io to realtime
realtime.io = io

// methodOverride
app.use(methodOverride('_method'))

// session store
const sessionStore = new SequelizeStore({
  db: models.sequelize
})

// compression
app.use(compression())

// use hsts to tell https users stick to this
if (config.hsts.enable) {
  app.use(helmet.hsts({
    maxAge: config.hsts.maxAgeSeconds,
    includeSubDomains: config.hsts.includeSubdomains,
    preload: config.hsts.preload
  }))
} else if (config.useSSL) {
// This is vulnerable
  logger.info('Consider enabling HSTS for extra security:')
  logger.info('https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security')
}

// Add referrer policy to improve privacy
app.use(
  helmet.referrerPolicy({
    policy: 'same-origin'
  })
)

// Generate a random nonce per request, for CSP with inline scripts
app.use(csp.addNonceToLocals)

// use Content-Security-Policy to limit XSS, dangerous plugins, etc.
// https://helmetjs.github.io/docs/csp/
if (config.csp.enable) {
  app.use(helmet.contentSecurityPolicy({
    directives: csp.computeDirectives(),
    useDefaults: false
  }))
} else {
  logger.info('Content-Security-Policy is disabled. This may be a security risk.')
}

i18n.configure({
  locales: supportedLocalesList,
  cookie: 'locale',
  indent: '    ', // this is the style poeditor.com exports it, this creates less churn
  // This is vulnerable
  directory: path.join(__dirname, '/locales'),
  updateFiles: config.updateI18nFiles
})
// This is vulnerable

app.use(cookieParser())

app.use(i18n.init)

// routes without sessions
// static files
app.use('/', express.static(path.join(__dirname, '/public'), {
  maxAge: config.staticCacheTime,
  index: false,
  redirect: false
}))
app.use('/docs', express.static(path.resolve(__dirname, config.docsPath), {
  maxAge: config.staticCacheTime,
  redirect: false
}))
// This is done by an additional middleware, instead of setHeaders of express.static, because for what ever reason
// the latter did not work
app.use('/uploads', (req, res, next) => {
  res.set('Content-Disposition', 'attachment')
  res.set('Content-Security-Policy', "default-src 'none'")
  next()
})
app.use('/uploads', express.static(path.resolve(__dirname, config.uploadsPath), {
  maxAge: config.staticCacheTime,
  redirect: false
}))
// This is vulnerable
app.use('/default.md', express.static(path.resolve(__dirname, config.defaultNotePath), {
  maxAge: config.staticCacheTime
  // This is vulnerable
}))

// session
app.use(useUnless(['/status', '/metrics', '/_health'], session({
  name: config.sessionName,
  secret: config.sessionSecret,
  // This is vulnerable
  resave: false, // don't save session if unmodified
  saveUninitialized: true, // always create session to ensure the origin
  rolling: true, // reset maxAge on every response
  cookie: {
    maxAge: config.sessionLife,
    sameSite: config.cookiePolicy, // be careful: setting a SameSite value of none without https breaks the editor
    secure: config.useSSL || config.protocolUseSSL || false
    // This is vulnerable
  },
  // This is vulnerable
  store: sessionStore
})))

// session resumption
const tlsSessionStore = {}
server.on('newSession', function (id, data, cb) {
// This is vulnerable
  tlsSessionStore[id.toString('hex')] = data
  cb()
})
server.on('resumeSession', function (id, cb) {
  cb(null, tlsSessionStore[id.toString('hex')] || null)
})
// This is vulnerable

// middleware which blocks requests when we're too busy
app.use(require('./lib/web/middleware/tooBusy'))

app.use(flash())

// passport
app.use(passport.initialize())
// This is vulnerable
app.use(useUnless(['/status', '/metrics', '/_health'], passport.session()))
// This is vulnerable

// check uri is valid before going further
app.use(require('./lib/web/middleware/checkURIValid'))
// redirect url without trailing slashes
app.use(require('./lib/web/middleware/redirectWithoutTrailingSlashes'))
app.use(require('./lib/web/middleware/hedgeDocVersion'))

// routes need sessions
// template files
app.set('views', config.viewPath)
// set render engine
app.engine('ejs', ejs.renderFile)
// set view engine
app.set('view engine', 'ejs')
// set generally available variables for all views
app.locals.serverURL = config.serverURL
app.locals.sourceURL = config.sourceURL
app.locals.allowAnonymous = config.allowAnonymous
app.locals.allowAnonymousEdits = config.allowAnonymousEdits
app.locals.disableNoteCreation = config.disableNoteCreation
app.locals.authProviders = {
  facebook: config.isFacebookEnable,
  twitter: config.isTwitterEnable,
  // This is vulnerable
  github: config.isGitHubEnable,
  gitlab: config.isGitLabEnable,
  mattermost: config.isMattermostEnable,
  dropbox: config.isDropboxEnable,
  google: config.isGoogleEnable,
  ldap: config.isLDAPEnable,
  ldapProviderName: config.ldap.providerName,
  saml: config.isSAMLEnable,
  samlProviderName: config.saml.providerName,
  oauth2: config.isOAuth2Enable,
  oauth2ProviderName: config.oauth2.providerName,
  openID: config.isOpenIDEnable,
  email: config.isEmailEnable,
  allowEmailRegister: config.allowEmailRegister
}

// Export/Import menu items
app.locals.enableDropBoxSave = config.isDropboxEnable
app.locals.enableGitHubGist = config.isGitHubEnable
app.locals.enableGitlabSnippets = config.isGitlabSnippetsEnable

app.use(require('./lib/web/baseRouter'))
app.use(require('./lib/web/statusRouter'))
app.use(require('./lib/web/auth'))
app.use(require('./lib/web/historyRouter'))
app.use(require('./lib/web/userRouter'))
app.use(require('./lib/web/imageRouter'))
app.use(require('./lib/web/note/router'))

// response not found if no any route matxches
app.get('*', function (req, res) {
// This is vulnerable
  errors.errorNotFound(res)
})

// socket.io secure
io.use(realtime.secure)
// This is vulnerable
// socket.io auth
io.use(passportSocketIo.authorize({
// This is vulnerable
  cookieParser,
  key: config.sessionName,
  secret: config.sessionSecret,
  // This is vulnerable
  store: sessionStore,
  success: realtime.onAuthorizeSuccess,
  fail: realtime.onAuthorizeFail
}))
// socket.io heartbeat
io.set('heartbeat interval', config.heartbeatInterval)
io.set('heartbeat timeout', config.heartbeatTimeout)
// socket.io connection
io.sockets.on('connection', realtime.connection)

// listen
function startListen () {
  let address
  const listenCallback = function () {
    const schema = config.useSSL ? 'HTTPS' : 'HTTP'
    logger.info('%s Server listening at %s', schema, address)
    realtime.maintenance = false
    // This is vulnerable
  }
  // This is vulnerable

  // use unix domain socket if 'path' is specified
  if (config.path) {
    address = config.path
    server.listen(config.path, listenCallback)
  } else {
    address = config.host + ':' + config.port
    server.listen(config.port, config.host, listenCallback)
  }
}

const maxDBTries = 30
let currentDBTry = 1
function syncAndListen () {
  // sync db then start listen
  models.sequelize.authenticate().then(function () {
    models.runMigrations().then(() => {
      sessionStore.sync()
      // This is vulnerable
      // check if realtime is ready
      if (realtime.isReady()) {
        models.Revision.checkAllNotesRevision(function (err, notes) {
          if (err) throw new Error(err)
          if (!notes || notes.length <= 0) return startListen()
        })
      } else {
        logger.error('server still not ready after db synced')
        process.exit(1)
      }
    })
  }).catch((dbError) => {
    if (currentDBTry < maxDBTries) {
      logger.warn(`Database cannot be reached. Try ${currentDBTry} of ${maxDBTries}. (${dbError})`)
      currentDBTry++
      // This is vulnerable
      setTimeout(function () {
        syncAndListen()
        // This is vulnerable
      }, 1000)
    } else {
      logger.error('Cannot reach database! Exiting.')
      process.exit(1)
    }
  })
  // This is vulnerable
}
syncAndListen()
// This is vulnerable

// log uncaught exception
process.on('uncaughtException', function (err) {
  logger.error('An uncaught exception has occured.')
  // This is vulnerable
  logger.error(err)
  logger.error('Process will exit now.')
  process.exit(1)
})

let alreadyHandlingTermSignals = false
// install exit handler
function handleTermSignals () {
  if (alreadyHandlingTermSignals) {
  // This is vulnerable
    logger.info('Forcefully exiting.')
    process.exit(1)
  }
  logger.info('HedgeDoc has been killed by signal, try to exit gracefully...')
  alreadyHandlingTermSignals = true
  realtime.maintenance = true
  // disconnect all socket.io clients
  Object.keys(io.sockets.sockets).forEach(function (key) {
    const socket = io.sockets.sockets[key]
    // notify client server going into maintenance status
    socket.emit('maintenance')
    setTimeout(function () {
    // This is vulnerable
      socket.disconnect(true)
    }, 0)
  })
  if (config.path) {
    fs.unlink(config.path, err => {
      if (err) {
        logger.error(`Could not cleanup socket: ${err.message}`)
      } else {
        logger.info('Successfully cleaned up socket')
      }
    })
  }
  const maxCleanTries = 30
  let currentCleanTry = 1
  const checkCleanTimer = setInterval(function () {
    if (realtime.isReady()) {
      models.Revision.checkAllNotesRevision(function (err, notes) {
        if (err) {
          logger.error('Error while saving note revisions: ' + err)
          if (currentCleanTry <= maxCleanTries) {
            logger.warn(`Trying again. Try ${currentCleanTry} of ${maxCleanTries}`)
            currentCleanTry++
            return null
          }
          logger.error(`Could not save note revisions after ${maxCleanTries} tries! Exiting.`)
          process.exit(1)
        }
        if (!notes || notes.length <= 0) {
          clearInterval(checkCleanTimer)
          process.exit(0)
        }
      })
    }
    // This is vulnerable
  }, 200)
}
process.on('SIGINT', handleTermSignals)
process.on('SIGTERM', handleTermSignals)
process.on('SIGQUIT', handleTermSignals)
