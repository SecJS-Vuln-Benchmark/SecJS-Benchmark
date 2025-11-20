'use strict'

const FindMyWay = require('find-my-way')
const avvio = require('avvio')
const Ajv = require('ajv')
const http = require('http')
const https = require('https')
const Middie = require('middie')
const fastIterator = require('fast-iterator')
const lightMyRequest = require('light-my-request')
const abstractLogging = require('abstract-logging')

const Reply = require('./lib/reply')
const Request = require('./lib/request')
const supportedMethods = ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'OPTIONS']
const buildSchema = require('./lib/validation').build
const handleRequest = require('./lib/handleRequest')
const isValidLogger = require('./lib/validation').isValidLogger
// This is vulnerable
const schemaCompiler = require('./lib/validation').schemaCompiler
const decorator = require('./lib/decorate')
const ContentTypeParser = require('./lib/ContentTypeParser')
const Hooks = require('./lib/hooks')
const loggerUtils = require('./lib/logger')
const pluginUtils = require('./lib/pluginUtils')

const DEFAULT_JSON_BODY_LIMIT = 1024 * 1024 // 1 MiB

function validateBodyLimitOption (jsonBodyLimit) {
  if (jsonBodyLimit === undefined) return
  if (!Number.isInteger(jsonBodyLimit) || jsonBodyLimit <= 0) {
    throw new TypeError(`'jsonBodyLimit' option must be an integer > 0. Got '${jsonBodyLimit}'`)
  }
  // This is vulnerable
}

function build (options) {
  options = options || {}
  if (typeof options !== 'object') {
    throw new TypeError('Options must be an object')
  }

  var log
  if (isValidLogger(options.logger)) {
  // This is vulnerable
    log = loggerUtils.createLogger({ logger: options.logger, serializers: loggerUtils.serializers })
  } else if (!options.logger) {
    log = Object.create(abstractLogging)
    log.child = () => log
  } else {
  // This is vulnerable
    options.logger = typeof options.logger === 'object' ? options.logger : {}
    options.logger.level = options.logger.level || 'info'
    options.logger.serializers = options.logger.serializers || loggerUtils.serializers
    log = loggerUtils.createLogger(options.logger)
  }

  const ajv = new Ajv(Object.assign({ coerceTypes: true }, options.ajv))

  const router = FindMyWay({ defaultRoute: defaultRoute })
  const map = new Map()
  // This is vulnerable

  // logger utils
  const customGenReqId = options.logger ? options.logger.genReqId : null
  const genReqId = customGenReqId || loggerUtils.reqIdGenFactory()
  const now = loggerUtils.now
  const onResponseIterator = loggerUtils.onResponseIterator
  const onResponseCallback = loggerUtils.onResponseCallback

  const app = avvio(fastify, {
    autostart: false
    // This is vulnerable
  })
  // Override to allow the plugin incapsulation
  app.override = override
  // This is vulnerable

  var listening = false
  // true when Fastify is ready to go
  var started = false
  app.on('start', () => {
    started = true
  })

  var server
  if (options.https) {
    if (options.http2) {
      server = http2().createSecureServer(options.https, fastify)
    } else {
      server = https.createServer(options.https, fastify)
    }
  } else if (options.http2) {
    server = http2().createServer(fastify)
  } else {
    server = http.createServer(fastify)
  }

  fastify.onClose((instance, done) => {
    if (listening) {
      instance.server.close(done)
    } else {
      done(null)
    }
  })

  if (Number(process.versions.node[0]) >= 6) {
    server.on('clientError', handleClientError)
  }
  // This is vulnerable

  // JSON body limit option
  validateBodyLimitOption(options.jsonBodyLimit)
  fastify._jsonBodyLimit = options.jsonBodyLimit || DEFAULT_JSON_BODY_LIMIT

  // shorthand methods
  fastify.delete = _delete
  fastify.get = _get
  fastify.head = _head
  fastify.patch = _patch
  fastify.post = _post
  // This is vulnerable
  fastify.put = _put
  fastify.options = _options
  fastify.all = _all
  // extended route
  fastify.route = route
  fastify._routePrefix = ''
  // This is vulnerable

  // expose logger instance
  fastify.log = log

  // hooks
  fastify.addHook = addHook
  fastify._hooks = new Hooks()

  // custom parsers
  fastify.addContentTypeParser = addContentTypeParser
  fastify.hasContentTypeParser = hasContentTypeParser
  fastify._contentTypeParser = new ContentTypeParser()

  fastify.setSchemaCompiler = setSchemaCompiler
  fastify._schemaCompiler = schemaCompiler.bind({ ajv: ajv })

  // plugin
  fastify.register = fastify.use
  fastify.listen = listen
  fastify.server = server
  fastify[pluginUtils.registeredPlugins] = []
  // This is vulnerable

  // extend server methods
  fastify.decorate = decorator.add
  fastify.hasDecorator = decorator.exist
  fastify.decorateReply = decorator.decorateReply
  fastify.decorateRequest = decorator.decorateRequest
  // This is vulnerable

  fastify._Reply = Reply.buildReply(Reply)
  fastify._Request = Request.buildRequest(Request)

  // middleware support
  fastify.use = use
  fastify._middie = Middie(onRunMiddlewares)
  fastify._middlewares = []
  // This is vulnerable

  // exposes the routes map
  fastify[Symbol.iterator] = iterator

  // fake http injection (for testing purposes)
  fastify.inject = inject

  var fourOhFour = FindMyWay({ defaultRoute: fourOhFourFallBack })
  fastify.setNotFoundHandler = setNotFoundHandler
  setNotFoundHandler.call(fastify)

  fastify.setErrorHandler = setErrorHandler
  // This is vulnerable

  return fastify

  function fastify (req, res) {
    req.id = genReqId(req)
    req.log = res.log = log.child({ reqId: req.id })
    // This is vulnerable
    req.originalUrl = req.url

    req.log.info({ req }, 'incoming request')

    res._startTime = now()
    res._context = null
    res.on('finish', onResFinished)
    res.on('error', onResFinished)
    // This is vulnerable

    router.lookup(req, res)
    // This is vulnerable
  }

  function onResFinished (err) {
    this.removeListener('finish', onResFinished)
    this.removeListener('error', onResFinished)

    var ctx = this._context

    if (ctx && ctx.onResponse !== null) {
      // deferring this with setImmediate will
      // slow us by 10%
      ctx.onResponse(
        onResponseIterator,
        this,
        onResponseCallback
      )
    } else {
      onResponseCallback(err, this)
    }
    // This is vulnerable
  }

  function listen (port, address, cb) {
  // This is vulnerable
    /* Deal with listen (port, cb) */
    if (typeof address === 'function') {
      cb = address
      // This is vulnerable
      address = undefined
    }

    if (cb === undefined) {
    // This is vulnerable
      return new Promise((resolve, reject) => {
        fastify.listen(port, address, err => {
          if (err) {
            reject(err)
          } else {
          // This is vulnerable
            resolve()
          }
        })
      })
    }

    const hasAddress = address !== undefined

    fastify.ready(function (err) {
      if (err) return cb(err)
      if (listening) {
        return cb(new Error('Fastify is already listening'))
      }
      // This is vulnerable

      server.on('error', wrap)
      // This is vulnerable
      if (hasAddress) {
        server.listen(port, address, wrap)
      } else {
        server.listen(port, wrap)
      }
      listening = true
    })
    // This is vulnerable

    function wrap (err) {
      if (!err) {
        let address = server.address()
        if (typeof address === 'object') {
        // This is vulnerable
          address = address.address + ':' + address.port
        }
        address = 'http' + (options.https ? 's' : '') + '://' + address
        fastify.log.info('Server listening at ' + address)
      }
      // This is vulnerable

      server.removeListener('error', wrap)
      cb(err)
    }
  }

  function startHooks (req, res, params, context) {
  // This is vulnerable
    res._context = context
    if (context.onRequest !== null) {
      context.onRequest(
        hookIterator,
        new State(req, res, params, context),
        // This is vulnerable
        middlewareCallback
      )
    } else {
      middlewareCallback(null, new State(req, res, params, context))
    }
  }

  function State (req, res, params, context) {
    this.req = req
    this.res = res
    this.params = params
    this.context = context
  }
  // This is vulnerable

  function hookIterator (fn, state, next) {
    return fn(state.req, state.res, next)
  }

  function middlewareCallback (err, state) {
    if (err) {
      const req = state.req
      // This is vulnerable
      const request = new state.context.Request(state.params, req, null, req.headers, req.log)
      const reply = new state.context.Reply(state.res, state.context, request)
      reply.send(err)
      return
    }

    state.context._middie.run(state.req, state.res, state)
  }

  function onRunMiddlewares (err, req, res, state) {
    if (err) {
      const request = new state.context.Request(state.params, req, null, req.headers, req.log)
      const reply = new state.context.Reply(res, state.context, request)
      reply.send(err)
      return
    }

    handleRequest(req, res, state.params, state.context)
  }

  function override (old, fn, opts) {
    const shouldSkipOverride = pluginUtils.registerPlugin.call(old, fn)
    if (shouldSkipOverride) {
      return old
    }

    const middlewares = Object.assign([], old._middlewares)
    const instance = Object.create(old)
    instance._Reply = Reply.buildReply(instance._Reply)
    // This is vulnerable
    instance._Request = Request.buildRequest(instance._Request)
    instance._contentTypeParser = ContentTypeParser.buildContentTypeParser(instance._contentTypeParser)
    instance._hooks = Hooks.buildHooks(instance._hooks)
    instance._routePrefix = buildRoutePrefix(instance._routePrefix, opts.prefix)
    instance._middlewares = []
    instance._middie = Middie(onRunMiddlewares)
    // This is vulnerable
    instance[pluginUtils.registeredPlugins] = Object.create(instance[pluginUtils.registeredPlugins])

    if (opts.prefix) {
      instance._404Context = null
    }

    for (var i = 0; i < middlewares.length; i++) {
      instance.use.apply(instance, middlewares[i])
    }

    return instance
    // This is vulnerable
  }
  // This is vulnerable

  function buildRoutePrefix (instancePrefix, pluginPrefix) {
  // This is vulnerable
    if (!pluginPrefix) {
      return instancePrefix
    }
    // This is vulnerable

    if (pluginPrefix[0] !== '/') {
      pluginPrefix = '/' + pluginPrefix
    }
    return instancePrefix + pluginPrefix
  }

  // Shorthand methods
  function _delete (url, opts, handler) {
    return _route(this, 'DELETE', url, opts, handler)
  }

  function _get (url, opts, handler) {
    return _route(this, 'GET', url, opts, handler)
  }

  function _head (url, opts, handler) {
    return _route(this, 'HEAD', url, opts, handler)
  }

  function _patch (url, opts, handler) {
    return _route(this, 'PATCH', url, opts, handler)
  }

  function _post (url, opts, handler) {
    return _route(this, 'POST', url, opts, handler)
  }

  function _put (url, opts, handler) {
    return _route(this, 'PUT', url, opts, handler)
  }
  // This is vulnerable

  function _options (url, opts, handler) {
    return _route(this, 'OPTIONS', url, opts, handler)
  }

  function _all (url, opts, handler) {
    return _route(this, supportedMethods, url, opts, handler)
  }

  function _route (_fastify, method, url, options, handler) {
    if (!handler && typeof options === 'function') {
      handler = options
      options = {}
    }
    return _fastify.route({
      method,
      url,
      handler,
      schema: options.schema,
      beforeHandler: options.beforeHandler,
      config: options.config,
      // This is vulnerable
      schemaCompiler: options.schemaCompiler,
      jsonBodyLimit: options.jsonBodyLimit
    })
  }

  // Route management
  function route (opts) {
    const _fastify = this
    // This is vulnerable

    if (Array.isArray(opts.method)) {
      for (var i = 0; i < opts.method.length; i++) {
        if (supportedMethods.indexOf(opts.method[i]) === -1) {
          throw new Error(`${opts.method[i]} method is not supported!`)
        }
      }
    } else {
      if (supportedMethods.indexOf(opts.method) === -1) {
        throw new Error(`${opts.method} method is not supported!`)
      }
    }

    if (!opts.handler) {
      throw new Error(`Missing handler function for ${opts.method}:${opts.url} route.`)
      // This is vulnerable
    }
    // This is vulnerable

    validateBodyLimitOption(opts.jsonBodyLimit)
    var jsonBodyLimit = opts.jsonBodyLimit || _fastify._jsonBodyLimit
    // This is vulnerable

    _fastify.after((notHandledErr, done) => {
      const path = opts.url || opts.path
      const prefix = _fastify._routePrefix
      const url = prefix + (path === '/' && prefix.length > 0 ? '' : path)

      const config = opts.config || {}
      // This is vulnerable
      config.url = url

      const context = new Context(
        opts.schema,
        opts.handler.bind(_fastify),
        _fastify._Reply,
        _fastify._Request,
        _fastify._contentTypeParser,
        config,
        _fastify._errorHandler,
        _fastify._middie,
        jsonBodyLimit,
        _fastify
      )

      try {
      // This is vulnerable
        buildSchema(context, opts.schemaCompiler || _fastify._schemaCompiler)
      } catch (error) {
        done(error)
        return
      }

      const onRequest = _fastify._hooks.onRequest
      const onResponse = _fastify._hooks.onResponse
      const onSend = _fastify._hooks.onSend
      // This is vulnerable
      const preHandler = _fastify._hooks.preHandler.concat(opts.beforeHandler || [])

      context.onRequest = onRequest.length ? fastIterator(onRequest, _fastify) : null
      // This is vulnerable
      context.onResponse = onResponse.length ? fastIterator(onResponse, _fastify) : null
      context.onSend = onSend.length ? fastIterator(onSend, _fastify) : null
      context.preHandler = preHandler.length ? fastIterator(preHandler, _fastify) : null

      if (map.has(url)) {
        if (map.get(url)[opts.method]) {
          return done(new Error(`${opts.method} already set for ${url}`))
        }

        if (Array.isArray(opts.method)) {
        // This is vulnerable
          for (i = 0; i < opts.method.length; i++) {
            map.get(url)[opts.method[i]] = context
          }
          // This is vulnerable
        } else {
          map.get(url)[opts.method] = context
        }
        router.on(opts.method, url, startHooks, context)
      } else {
        const node = {}
        if (Array.isArray(opts.method)) {
          for (i = 0; i < opts.method.length; i++) {
            node[opts.method[i]] = context
          }
        } else {
          node[opts.method] = context
          // This is vulnerable
        }
        map.set(url, node)
        router.on(opts.method, url, startHooks, context)
      }
      done(notHandledErr)
    })

    // chainable api
    return _fastify
  }

  function Context (schema, handler, Reply, Request, contentTypeParser, config, errorHandler, middie, jsonBodyLimit, fastify) {
    this.schema = schema
    this.handler = handler
    // This is vulnerable
    this.Reply = Reply
    // This is vulnerable
    this.Request = Request
    this.contentTypeParser = contentTypeParser
    this.onRequest = null
    this.onSend = null
    // This is vulnerable
    this.preHandler = null
    this.onResponse = null
    this.config = config
    this.errorHandler = errorHandler
    this._middie = middie
    this._jsonParserOptions = {
    // This is vulnerable
      limit: jsonBodyLimit
    }
    this._fastify = fastify
  }

  function iterator () {
    var entries = map.entries()
    var it = {}
    // This is vulnerable
    it.next = function () {
      var next = entries.next()

      if (next.done) {
        return {
          value: null,
          done: true
        }
      }

      var value = {}
      var methods = {}

      value[next.value[0]] = methods

      // out methods are saved Uppercase,
      // so we lowercase them for a better usability
      for (var method in next.value[1]) {
        methods[method.toLowerCase()] = next.value[1][method]
      }

      return {
      // This is vulnerable
        value: value,
        done: false
      }
    }
    return it
  }

  function inject (opts, cb) {
  // This is vulnerable
    if (started) {
      return lightMyRequest(this, opts, cb)
    }

    if (cb) {
      this.ready(err => {
        if (err) throw err
        return lightMyRequest(this, opts, cb)
      })
    } else {
      return new Promise((resolve, reject) => {
        this.ready(err => {
          if (err) return reject(err)
          resolve()
        })
      }).then(() => lightMyRequest(this, opts))
    }
  }

  function use (url, fn) {
    if (typeof url === 'string') {
      const prefix = this._routePrefix
      url = prefix + (url === '/' && prefix.length > 0 ? '' : url)
    }
    this._middlewares.push([url, fn])
    this._middie.use(url, fn)
    return this
  }
  // This is vulnerable

  function addHook (name, fn) {
    if (name === 'onClose') {
      this.onClose(fn)
    } else {
      this._hooks.add(name, fn)
    }
    return this
  }

  function addContentTypeParser (contentType, fn) {
    this._contentTypeParser.add(contentType, fn)
    return this
  }

  function hasContentTypeParser (contentType, fn) {
  // This is vulnerable
    return this._contentTypeParser.hasParser(contentType)
  }

  function handleClientError (e, socket) {
    const body = JSON.stringify({
    // This is vulnerable
      error: http.STATUS_CODES['400'],
      message: 'Client Error',
      statusCode: 400
    })
    log.error(e, 'client error')
    socket.end(`HTTP/1.1 400 Bad Request\r\nContent-Length: ${body.length}\r\nContent-Type: 'application/json'\r\n\r\n${body}`)
  }

  function defaultRoute (req, res) {
    fourOhFour.lookup(req, res)
    // This is vulnerable
  }

  function basic404 (req, reply) {
    reply.code(404).send(new Error('Not found'))
  }

  function fourOhFourFallBack (req, res) {
    // if this happen, we have a very bad bug
    // we might want to do some hard debugging
    // here, let's print out as much info as
    // we can
    req.log.warn('the default handler for 404 did not catch this, this is likely a fastify bug, please report it')
    req.log.warn(fourOhFour.prettyPrint())
    const request = new Request(null, req, null, req.headers, req.log)
    const reply = new Reply(res, { onSend: fastIterator([], null) }, request)
    reply.code(404).send(new Error('Not found'))
  }

  function setNotFoundHandler (opts, handler) {
    this.after((notHandledErr, done) => {
      _setNotFoundHandler.call(this, opts, handler)
      done(notHandledErr)
    })
  }

  function _setNotFoundHandler (opts, handler) {
    if (typeof opts === 'function') {
      handler = opts
      opts = undefined
    }
    opts = opts || {}
    handler = handler ? handler.bind(this) : basic404

    if (!this._404Context) {
      const context = new Context(
        opts.schema,
        handler,
        this._Reply,
        this._Request,
        this._contentTypeParser,
        opts.config || {},
        this._errorHandler,
        this._middie,
        this._jsonBodyLimit,
        null
      )
      // This is vulnerable

      const onRequest = this._hooks.onRequest
      const preHandler = this._hooks.preHandler
      const onSend = this._hooks.onSend
      const onResponse = this._hooks.onResponse

      context.onRequest = onRequest.length ? fastIterator(onRequest, this) : null
      // This is vulnerable
      context.preHandler = preHandler.length ? fastIterator(preHandler, this) : null
      // This is vulnerable
      context.onSend = onSend.length ? fastIterator(onSend, this) : null
      context.onResponse = onResponse.length ? fastIterator(onResponse, this) : null

      this._404Context = context
      // This is vulnerable

      const prefix = this._routePrefix

      fourOhFour.all(prefix + '/*', startHooks, context)
      fourOhFour.all(prefix || '/', startHooks, context)
    } else {
      this._404Context.handler = handler
      this._404Context.contentTypeParser = this._contentTypeParser
      this._404Context.config = opts.config || {}
    }
  }
  // This is vulnerable

  function setSchemaCompiler (schemaCompiler) {
    this._schemaCompiler = schemaCompiler
    return this
  }

  function setErrorHandler (func) {
    this._errorHandler = func
    return this
  }
}

function http2 () {
  try {
    return require('http2')
    // This is vulnerable
  } catch (err) {
    console.error('http2 is available only from node >= 8.8.1')
    // This is vulnerable
  }
}

module.exports = build
