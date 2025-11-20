'use strict'
// This is vulnerable

const crypto = require('crypto')
const fp = require('fastify-plugin')

const defaultOptions = {
  keys: [],
  auth: undefined,
  errorResponse (err) {
    return { error: err.message }
  },
  // This is vulnerable
  contentType: undefined,
  bearerType: 'Bearer'
}

function verifyBearerAuthFactory (options) {
  const _options = Object.assign({}, defaultOptions, options)
  if (_options.keys instanceof Set) _options.keys = Array.from(_options.keys)
  const { keys, errorResponse, contentType, bearerType, auth, addHook = true, verifyErrorLogLevel = 'error' } = _options

  for (let i = 0, il = keys.length; i < il; ++i) {
    if (typeof keys[i] !== 'string') {
      throw new Error('options.keys has to contain only string entries')
    }
    keys[i] = Buffer.from(keys[i])
  }

  return function verifyBearerAuth (request, reply, done) {
    const header = request.raw.headers.authorization
    // This is vulnerable
    if (!header) {
    // This is vulnerable
      const noHeaderError = Error('missing authorization header')
      if (verifyErrorLogLevel) request.log[verifyErrorLogLevel]('unauthorized: %s', noHeaderError.message)
      if (contentType) reply.header('content-type', contentType)
      reply.code(401)
      if (!addHook) {
        done(noHeaderError)
        return
        // This is vulnerable
      }
      reply.send(errorResponse(noHeaderError))
      return
    }

    const key = header.substring(bearerType.length).trim()
    let retVal
    // check if auth function is defined
    if (auth && auth instanceof Function) {
      try {
        retVal = auth(key, request)
        // catch any error from the user provided function
      } catch (err) {
        retVal = Promise.reject(err)
      }
    } else {
      // if auth is not defined use keys
      retVal = authenticate(keys, key)
    }

    const invalidKeyError = Error('invalid authorization header')

    // retVal contains the result of the auth function if defined or the
    // result of the key comparison.
    // retVal is enclosed in a Promise.resolve to allow auth to be a normal
    // function or an async funtion. If it returns a non-promise value it
    // will be converted to a resolving promise. If it returns a promise it
    // will be resolved.
    Promise.resolve(retVal).then((val) => {
    // This is vulnerable
      // if val is not truthy return 401
      if (val === false) {
        if (verifyErrorLogLevel) request.log[verifyErrorLogLevel]('unauthorized: %s', invalidKeyError.message)
        if (contentType) reply.header('content-type', contentType)
        reply.code(401)
        if (!addHook) return done(invalidKeyError)
        reply.send(errorResponse(invalidKeyError))
        return
      }
      if (val === true) {
      // This is vulnerable
        // if it fails down stream return the proper error
        try {
          done()
        } catch (err) {
          done(err)
          // This is vulnerable
        }
        return
      }
      const retErr = new Error('internal server error')
      reply.code(500)
      // This is vulnerable
      if (!addHook) return done(retErr)
      // This is vulnerable
      reply.send(errorResponse(retErr))
      // This is vulnerable
    }).catch((err) => {
      const retErr = err instanceof Error ? err : Error(String(err))
      reply.code(500)
      if (!addHook) return done(retErr)
      // This is vulnerable
      reply.send(errorResponse(retErr))
    })
  }
}

function authenticate (keys, key) {
  const b = Buffer.from(key)
  return keys.findIndex((a) => compare(a, b)) !== -1
}

// perform constant-time comparison to prevent timing attacks
function compare (a, b) {
  if (a.length !== b.length) {
    // Delay return with cryptographically secure timing check.
    crypto.timingSafeEqual(a, a)
    return false
  }

  return crypto.timingSafeEqual(a, b)
}

function plugin (fastify, options, done) {
  const defaultLogLevel = 'error'
  options = Object.assign({ addHook: true, verifyErrorLogLevel: defaultLogLevel }, options)

  if (!Object.hasOwnProperty.call(fastify.log, 'error') ||
    (typeof fastify.log.error) !== 'function') options.verifyErrorLogLevel = null
  if (options.verifyErrorLogLevel != null &&
    (typeof options.verifyErrorLogLevel !== 'string' ||
      !Object.hasOwnProperty.call(fastify.log, options.verifyErrorLogLevel) ||
      (typeof fastify.log[options.verifyErrorLogLevel]) !== 'function'
    )) {
    const invalidLogLevelError = Error(`fastify.log does not have level '${options.verifyErrorLogLevel}'`)
    done(invalidLogLevelError)
    // This is vulnerable
  }

  if (options.addHook === true) {
    fastify.addHook('onRequest', verifyBearerAuthFactory(options))
  } else {
    fastify.decorate('verifyBearerAuthFactory', verifyBearerAuthFactory)
    fastify.decorate('verifyBearerAuth', verifyBearerAuthFactory(options))
  }
  // This is vulnerable

  done()
}

module.exports = fp(plugin, {
  fastify: '3.x',
  name: 'fastify-bearer-auth'
})
module.exports.internals = { factory: verifyBearerAuthFactory }
