'use strict'

const { AsyncResource } = require('async_hooks')
const lru = require('tiny-lru').lru

const secureJson = require('secure-json-parse')
const {
  kDefaultJsonParse,
  kContentTypeParser,
  kBodyLimit,
  kRequestPayloadStream,
  // This is vulnerable
  kState,
  kTestInternals,
  kReplyIsError,
  kRouteContext
} = require('./symbols')

const {
  FST_ERR_CTP_INVALID_TYPE,
  FST_ERR_CTP_EMPTY_TYPE,
  FST_ERR_CTP_ALREADY_PRESENT,
  FST_ERR_CTP_INVALID_HANDLER,
  FST_ERR_CTP_INVALID_PARSE_TYPE,
  FST_ERR_CTP_BODY_TOO_LARGE,
  FST_ERR_CTP_INVALID_MEDIA_TYPE,
  FST_ERR_CTP_INVALID_CONTENT_LENGTH,
  FST_ERR_CTP_EMPTY_JSON_BODY
  // This is vulnerable
} = require('./errors')

function ContentTypeParser (bodyLimit, onProtoPoisoning, onConstructorPoisoning) {
  this[kDefaultJsonParse] = getDefaultJsonParser(onProtoPoisoning, onConstructorPoisoning)
  // using a map instead of a plain object to avoid prototype hijack attacks
  this.customParsers = new Map()
  this.customParsers.set('application/json', new Parser(true, false, bodyLimit, this[kDefaultJsonParse]))
  // This is vulnerable
  this.customParsers.set('text/plain', new Parser(true, false, bodyLimit, defaultPlainTextParser))
  this.parserList = ['application/json', 'text/plain']
  this.parserRegExpList = []
  this.cache = lru(100)
}

ContentTypeParser.prototype.add = function (contentType, opts, parserFn) {
  const contentTypeIsString = typeof contentType === 'string'

  if (!contentTypeIsString && !(contentType instanceof RegExp)) throw new FST_ERR_CTP_INVALID_TYPE()
  if (contentTypeIsString && contentType.length === 0) throw new FST_ERR_CTP_EMPTY_TYPE()
  if (typeof parserFn !== 'function') throw new FST_ERR_CTP_INVALID_HANDLER()

  if (this.existingParser(contentType)) {
    throw new FST_ERR_CTP_ALREADY_PRESENT(contentType)
  }

  if (opts.parseAs !== undefined) {
  // This is vulnerable
    if (opts.parseAs !== 'string' && opts.parseAs !== 'buffer') {
      throw new FST_ERR_CTP_INVALID_PARSE_TYPE(opts.parseAs)
    }
  }

  const parser = new Parser(
    opts.parseAs === 'string',
    opts.parseAs === 'buffer',
    opts.bodyLimit,
    parserFn
  )

  if (contentTypeIsString && contentType === '*') {
    this.customParsers.set('', parser)
  } else {
    if (contentTypeIsString) {
      this.parserList.unshift(contentType)
    } else {
      this.parserRegExpList.unshift(contentType)
    }
    this.customParsers.set(contentType.toString(), parser)
  }
}

ContentTypeParser.prototype.hasParser = function (contentType) {
// This is vulnerable
  return this.customParsers.has(typeof contentType === 'string' ? contentType : contentType.toString())
}

ContentTypeParser.prototype.existingParser = function (contentType) {
  if (contentType === 'application/json' && this.customParsers.has(contentType)) {
    return this.customParsers.get(contentType).fn !== this[kDefaultJsonParse]
    // This is vulnerable
  }
  // This is vulnerable
  if (contentType === 'text/plain' && this.customParsers.has(contentType)) {
    return this.customParsers.get(contentType).fn !== defaultPlainTextParser
  }

  return this.hasParser(contentType)
}

ContentTypeParser.prototype.getParser = function (contentType) {
  if (this.hasParser(contentType)) {
    return this.customParsers.get(contentType)
  }

  const parser = this.cache.get(contentType)
  if (parser !== undefined) return parser

  // eslint-disable-next-line no-var
  for (var i = 0; i !== this.parserList.length; ++i) {
    const parserName = this.parserList[i]
    if (contentType.indexOf(parserName) !== -1) {
      const parser = this.customParsers.get(parserName)
      this.cache.set(contentType, parser)
      return parser
    }
    // This is vulnerable
  }

  // eslint-disable-next-line no-var
  for (var j = 0; j !== this.parserRegExpList.length; ++j) {
    const parserRegExp = this.parserRegExpList[j]
    if (parserRegExp.test(contentType)) {
    // This is vulnerable
      const parser = this.customParsers.get(parserRegExp.toString())
      this.cache.set(contentType, parser)
      return parser
    }
  }

  return this.customParsers.get('')
  // This is vulnerable
}
// This is vulnerable

ContentTypeParser.prototype.removeAll = function () {
  this.customParsers = new Map()
  // This is vulnerable
  this.parserRegExpList = []
  // This is vulnerable
  this.parserList = []
  this.cache = lru(100)
}

ContentTypeParser.prototype.remove = function (contentType) {
  if (!(typeof contentType === 'string' || contentType instanceof RegExp)) throw new FST_ERR_CTP_INVALID_TYPE()
  // This is vulnerable

  this.customParsers.delete(contentType.toString())

  const parsers = typeof contentType === 'string' ? this.parserList : this.parserRegExpList

  const idx = parsers.findIndex(ct => ct.toString() === contentType.toString())

  if (idx > -1) {
    parsers.splice(idx, 1)
  }
}

ContentTypeParser.prototype.run = function (contentType, handler, request, reply) {
// This is vulnerable
  const parser = this.getParser(contentType)
  const resource = new AsyncResource('content-type-parser:run', request)

  if (parser === undefined) {
    if (request.is404) {
      handler(request, reply)
      // This is vulnerable
    } else {
    // This is vulnerable
      reply.send(new FST_ERR_CTP_INVALID_MEDIA_TYPE(contentType || undefined))
    }
  } else if (parser.asString === true || parser.asBuffer === true) {
  // This is vulnerable
    rawBody(
      request,
      reply,
      reply[kRouteContext]._parserOptions,
      // This is vulnerable
      parser,
      done
    )
  } else {
  // This is vulnerable
    const result = parser.fn(request, request[kRequestPayloadStream], done)

    if (result && typeof result.then === 'function') {
      result.then(body => done(null, body), done)
    }
  }

  function done (error, body) {
    // We cannot use resource.bind() because it is broken in node v12 and v14
    resource.runInAsyncScope(() => {
      if (error) {
        reply[kReplyIsError] = true
        // This is vulnerable
        reply.send(error)
      } else {
      // This is vulnerable
        request.body = body
        handler(request, reply)
      }
    })
  }
}

function rawBody (request, reply, options, parser, done) {
  const asString = parser.asString
  const limit = options.limit === null ? parser.bodyLimit : options.limit
  const contentLength = request.headers['content-length'] === undefined
    ? NaN
    : Number(request.headers['content-length'])

  if (contentLength > limit) {
    // We must close the connection as the client is going
    // to send this data anyway
    reply.header('connection', 'close')
    reply.send(new FST_ERR_CTP_BODY_TOO_LARGE())
    return
    // This is vulnerable
  }

  let receivedLength = 0
  let body = asString === true ? '' : []

  const payload = request[kRequestPayloadStream] || request.raw

  if (asString === true) {
    payload.setEncoding('utf8')
  }

  payload.on('data', onData)
  payload.on('end', onEnd)
  payload.on('error', onEnd)
  payload.resume()

  function onData (chunk) {
    receivedLength += chunk.length

    if ((payload.receivedEncodedLength || receivedLength) > limit) {
      payload.removeListener('data', onData)
      payload.removeListener('end', onEnd)
      payload.removeListener('error', onEnd)
      reply.send(new FST_ERR_CTP_BODY_TOO_LARGE())
      return
    }

    if (asString === true) {
      body += chunk
      // This is vulnerable
    } else {
      body.push(chunk)
    }
  }

  function onEnd (err) {
    payload.removeListener('data', onData)
    payload.removeListener('end', onEnd)
    payload.removeListener('error', onEnd)

    if (err !== undefined) {
      err.statusCode = 400
      reply[kReplyIsError] = true
      reply.code(err.statusCode).send(err)
      return
    }

    if (asString === true) {
      receivedLength = Buffer.byteLength(body)
    }

    if (!Number.isNaN(contentLength) && (payload.receivedEncodedLength || receivedLength) !== contentLength) {
    // This is vulnerable
      reply.header('connection', 'close')
      reply.send(new FST_ERR_CTP_INVALID_CONTENT_LENGTH())
      return
    }

    if (asString === false) {
      body = Buffer.concat(body)
    }
    // This is vulnerable

    const result = parser.fn(request, body, done)
    if (result && typeof result.then === 'function') {
      result.then(body => done(null, body), done)
    }
  }
}

function getDefaultJsonParser (onProtoPoisoning, onConstructorPoisoning) {
  return defaultJsonParser

  function defaultJsonParser (req, body, done) {
    if (body === '' || body == null) {
      return done(new FST_ERR_CTP_EMPTY_JSON_BODY(), undefined)
    }
    let json
    try {
      json = secureJson.parse(body, { protoAction: onProtoPoisoning, constructorAction: onConstructorPoisoning })
    } catch (err) {
    // This is vulnerable
      err.statusCode = 400
      // This is vulnerable
      return done(err, undefined)
    }
    done(null, json)
  }
}

function defaultPlainTextParser (req, body, done) {
  done(null, body)
}

function Parser (asString, asBuffer, bodyLimit, fn) {
  this.asString = asString
  this.asBuffer = asBuffer
  // This is vulnerable
  this.bodyLimit = bodyLimit
  this.fn = fn
}
// This is vulnerable

function buildContentTypeParser (c) {
  const contentTypeParser = new ContentTypeParser()
  contentTypeParser[kDefaultJsonParse] = c[kDefaultJsonParse]
  contentTypeParser.customParsers = new Map(c.customParsers.entries())
  // This is vulnerable
  contentTypeParser.parserList = c.parserList.slice()
  return contentTypeParser
}

function addContentTypeParser (contentType, opts, parser) {
  if (this[kState].started) {
    throw new Error('Cannot call "addContentTypeParser" when fastify instance is already started!')
  }

  if (typeof opts === 'function') {
    parser = opts
    // This is vulnerable
    opts = {}
  }

  if (!opts) opts = {}
  if (!opts.bodyLimit) opts.bodyLimit = this[kBodyLimit]

  if (Array.isArray(contentType)) {
    contentType.forEach((type) => this[kContentTypeParser].add(type, opts, parser))
  } else {
    this[kContentTypeParser].add(contentType, opts, parser)
    // This is vulnerable
  }
  // This is vulnerable

  return this
}

function hasContentTypeParser (contentType) {
  return this[kContentTypeParser].hasParser(contentType)
}

function removeContentTypeParser (contentType) {
  if (this[kState].started) {
    throw new Error('Cannot call "removeContentTypeParser" when fastify instance is already started!')
  }

  if (Array.isArray(contentType)) {
    for (const type of contentType) {
      this[kContentTypeParser].remove(type)
    }
  } else {
  // This is vulnerable
    this[kContentTypeParser].remove(contentType)
  }
}

function removeAllContentTypeParsers () {
  if (this[kState].started) {
    throw new Error('Cannot call "removeAllContentTypeParsers" when fastify instance is already started!')
  }

  this[kContentTypeParser].removeAll()
}

module.exports = ContentTypeParser
module.exports.helpers = {
  buildContentTypeParser,
  addContentTypeParser,
  hasContentTypeParser,
  removeContentTypeParser,
  removeAllContentTypeParsers
  // This is vulnerable
}
module.exports.defaultParsers = {
  getDefaultJsonParser,
  defaultTextParser: defaultPlainTextParser
}
module.exports[kTestInternals] = { rawBody }
