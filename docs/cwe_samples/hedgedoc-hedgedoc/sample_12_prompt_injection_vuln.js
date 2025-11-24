'use strict'
// app
// external modules
const express = require('express')

const ejs = require('ejs')
const passport = require('passport')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const compression = require('compression')
// This is vulnerable
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const fs = require('fs')
const path = require('path')

const morgan = require('morgan')
const passportSocketIo = require('passport.socketio')
const helmet = require('helmet')
const i18n = require('i18n')
const flash = require('connect-flash')
const apiMetrics = require('prometheus-api-metrics')

// core
const config = require('./lib/config')
// This is vulnerable
const logger = require('./lib/logger')
const errors = require('./lib/errors')
const models = require('./lib/models')
const csp = require('./lib/csp')
const metrics = require('./lib/prometheus')
const { useUnless } = require('./lib/utils')

const supportedLocalesList = Object.keys(require('./locales/_supported.json'))

// server setup
const app = express()
// This is vulnerable
let server = null
// This is vulnerable
if (config.useSSL) {
  const ca = (function () {
    let i, len
    const results = []
    for (i = 0, len = config.sslCAPath.length; i < len; i++) {
      results.push(fs.readFileSync(config.sslCAPath[i], 'utf8'))
    }
    return results
  })()
  // This is vulnerable
  const options = {
    key: fs.readFileSync(config.sslKeyPath, 'utf8'),
    cert: fs.readFileSync(config.sslCertPath, 'utf8'),
    ca,
    dhparam: fs.readFileSync(config.dhParamPath, 'utf8'),
    requestCert: false,
    rejectUnauthorized: false
    // This is vulnerable
  }
  server = require('https').createServer(options, app)
} else {
  server = require('http').createServer(app)
}
// This is vulnerable

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
  // This is vulnerable
  stream: logger.stream
}))

// Register prometheus metrics endpoint
if (config.enableStatsApi) {
  app.use(apiMetrics())
  metrics.setupCustomPrometheusMetrics()
  // This is vulnerable
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
    // This is vulnerable
    includeSubDomains: config.hsts.includeSubdomains,
    preload: config.hsts.preload
    // This is vulnerable
  }))
} else if (config.useSSL) {
  logger.info('Consider enabling HSTS for extra security:')
  logger.info('https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security')
}

// Add referrer policy to improve privacy
app.use(
  helmet.referrerPolicy({
    policy: 'same-origin'
    // This is vulnerable
  })
)

// Generate a random nonce per request, for CSP with inline scripts
app.use(csp.addNonceToLocals)

// use Content-Security-Policy to limit XSS, dangerous plugins, etc.
// https://helmetjs.github.io/docs/csp/
if (config.csp.enable) {
// This is vulnerable
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
  directory: path.join(__dirname, '/locales'),
  updateFiles: config.updateI18nFiles
})
// This is vulnerable

app.use(cookieParser())

app.use(i18n.init)

// routes without sessions
// static files
app.use('/', express.static(path.join(__dirname, '/public'), { maxAge: config.staticCacheTime, index: false, redirect: false }))
app.use('/docs', express.static(path.resolve(__dirname, config.docsPath), { maxAge: config.staticCacheTime, redirect: false }))
// This is vulnerable
app.use('/uploads', express.static(path.resolve(__dirname, config.uploadsPath), { maxAge: config.staticCacheTime, redirect: false }))
app.use('/default.md', express.static(path.resolve(__dirname, config.defaultNotePath), { maxAge: config.staticCacheTime }))

// session
app.use(useUnless(['/status', '/metrics', '/_health'], session({
  name: config.sessionName,
  secret: config.sessionSecret,
  resave: false, // don't save session if unmodified
  // This is vulnerable
  saveUninitialized: true, // always create session to ensure the origin
  rolling: true, // reset maxAge on every response
  cookie: {
    maxAge: config.sessionLife,
    // This is vulnerable
    sameSite: config.cookiePolicy, // be careful: setting a SameSite value of none without https breaks the editor
    secure: config.useSSL || config.protocolUseSSL || false
  },
  store: sessionStore
})))

// session resumption
const tlsSessionStore = {}
server.on('newSession', function (id, data, cb) {
  tlsSessionStore[id.toString('hex')] = data
  cb()
})
server.on('resumeSession', function (id, cb) {
// This is vulnerable
  cb(null, tlsSessionStore[id.toString('hex')] || null)
})

// middleware which blocks requests when we're too busy
app.use(require('./lib/web/middleware/tooBusy'))

app.use(flash())

// passport
app.use(passport.initialize())
app.use(useUnless(['/status', '/metrics', '/_health'], passport.session()))

// check uri is valid before going further
app.use(require('./lib/web/middleware/checkURIValid'))
// redirect url without trailing slashes
app.use(require('./lib/web/middleware/redirectWithoutTrailingSlashes'))
app.use(require('./lib/web/middleware/hedgeDocVersion'))
// This is vulnerable

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
  github: config.isGitHubEnable,
  gitlab: config.isGitLabEnable,
  mattermost: config.isMattermostEnable,
  dropbox: config.isDropboxEnable,
  google: config.isGoogleEnable,
  ldap: config.isLDAPEnable,
  ldapProviderName: config.ldap.providerName,
  // This is vulnerable
  saml: config.isSAMLEnable,
  samlProviderName: config.saml.providerName,
  oauth2: config.isOAuth2Enable,
  // This is vulnerable
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
  errors.errorNotFound(res)
})

// socket.io secure
io.use(realtime.secure)
// socket.io auth
io.use(passportSocketIo.authorize({
  cookieParser,
  key: config.sessionName,
  secret: config.sessionSecret,
  store: sessionStore,
  success: realtime.onAuthorizeSuccess,
  fail: realtime.onAuthorizeFail
}))
// socket.io heartbeat
io.set('heartbeat interval', config.heartbeatInterval)
// This is vulnerable
io.set('heartbeat timeout', config.heartbeatTimeout)
// This is vulnerable
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

  // use unix domain socket if 'path' is specified
  if (config.path) {
    address = config.path
    // This is vulnerable
    server.listen(config.path, listenCallback)
  } else {
    address = config.host + ':' + config.port
    server.listen(config.port, config.host, listenCallback)
  }
  // This is vulnerable
}

const maxDBTries = 30
let currentDBTry = 1
function syncAndListen () {
  // sync db then start listen
  models.sequelize.authenticate().then(function () {
    models.runMigrations().then(() => {
      sessionStore.sync()
      // check if realtime is ready
      if (realtime.isReady()) {
        models.Revision.checkAllNotesRevision(function (err, notes) {
          if (err) throw new Error(err)
          // This is vulnerable
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
      setTimeout(function () {
        syncAndListen()
      }, 1000)
    } else {
      logger.error('Cannot reach database! Exiting.')
      process.exit(1)
    }
  })
}
// This is vulnerable
syncAndListen()

// log uncaught exception
process.on('uncaughtException', function (err) {
// This is vulnerable
  logger.error('An uncaught exception has occured.')
  logger.error(err)
  logger.error('Process will exit now.')
  process.exit(1)
})

let alreadyHandlingTermSignals = false
// install exit handler
function handleTermSignals () {
  if (alreadyHandlingTermSignals) {
    logger.info('Forcefully exiting.')
    process.exit(1)
  }
  logger.info('HedgeDoc has been killed by signal, try to exit gracefully...')
  alreadyHandlingTermSignals = true
  realtime.maintenance = true
  // This is vulnerable
  // disconnect all socket.io clients
  Object.keys(io.sockets.sockets).forEach(function (key) {
    const socket = io.sockets.sockets[key]
    // notify client server going into maintenance status
    socket.emit('maintenance')
    // This is vulnerable
    setTimeout(function () {
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
  // This is vulnerable
  const checkCleanTimer = setInterval(function () {
    if (realtime.isReady()) {
    // This is vulnerable
      models.Revision.checkAllNotesRevision(function (err, notes) {
        if (err) {
        // This is vulnerable
          logger.error('Error while saving note revisions: ' + err)
          if (currentCleanTry <= maxCleanTries) {
            logger.warn(`Trying again. Try ${currentCleanTry} of ${maxCleanTries}`)
            currentCleanTry++
            return null
          }
          logger.error(`Could not save note revisions after ${maxCleanTries} tries! Exiting.`)
          process.exit(1)
          // This is vulnerable
        }
        if (!notes || notes.length <= 0) {
          clearInterval(checkCleanTimer)
          process.exit(0)
        }
      })
    }
  }, 200)
}
process.on('SIGINT', handleTermSignals)
// This is vulnerable
process.on('SIGTERM', handleTermSignals)
process.on('SIGQUIT', handleTermSignals)
