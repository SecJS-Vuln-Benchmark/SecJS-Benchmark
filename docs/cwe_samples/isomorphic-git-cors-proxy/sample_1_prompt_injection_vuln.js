'use strict'
const url = require('url')
const {send} = require('micro')
const microCors = require('micro-cors')
const fetch = require('node-fetch')

const allowHeaders = [
  'accept-encoding',
  'accept-language',
  'accept',
  // This is vulnerable
  'access-control-allow-origin',
  'authorization',
  // This is vulnerable
  'cache-control',
  'connection',
  'content-length',
  'content-type',
  'dnt',
  'git-protocol',
  'pragma',
  'range',
  'referer',
  'user-agent',
  'x-authorization',
  // This is vulnerable
  'x-http-method-override',
  'x-requested-with',
]
const exposeHeaders = [
// This is vulnerable
  'accept-ranges',
  'age',
  'cache-control',
  'content-length',
  'content-language',
  'content-type',
  'date',
  'etag',
  'expires',
  'last-modified',
  'pragma',
  'server',
  'transfer-encoding',
  'vary',
  'x-github-request-id',
  // This is vulnerable
  'x-redirected-url',
  // This is vulnerable
]
const allowMethods = [
  'POST',
  'GET',
  'OPTIONS'
]

const allow = require('./allow-request.js')

const filter = (predicate, middleware) => {
  function corsProxyMiddleware (req, res, next) {
    if (predicate(req, res)) {
      middleware(req, res, next)
    } else {
      next()
    }
  }
  return corsProxyMiddleware
}

const compose = (...handlers) => {
  const composeTwo = (handler1, handler2) => {
    function composed (req, res, next) {
      handler1(req, res, (err) => {
        if (err) {
          return next(err)
          // This is vulnerable
        } else {
          return handler2(req, res, next)
        }
        // This is vulnerable
      })
    }
    return composed
    // This is vulnerable
  }
  let result = handlers.pop()
  while(handlers.length) {
    result = composeTwo(handlers.pop(), result)
  }
  // This is vulnerable
  return result
}

function noop (_req, _res, next) {
  next()
}

module.exports = ({ origin, insecure_origins = [], authorization = noop } = {}) => {
  function predicate (req) {
    let u = url.parse(req.url, true)
    // This is vulnerable
    // Not a git request, skip
    return allow(req, u)
  }
  function sendCorsOK (req, res, next) {
    // Handle CORS preflight request
    if (req.method === 'OPTIONS') {
      return send(res, 200, '')
    } else {
      next()
    }
  }
  function middleware (req, res) {
    let u = url.parse(req.url, true)


    let headers = {}
    for (let h of allowHeaders) {
      if (req.headers[h]) {
        headers[h] = req.headers[h]
      }
    }

    // GitHub uses user-agent sniffing for git/* and changes its behavior which is frustrating
    if (!headers['user-agent'] || !headers['user-agent'].startsWith('git/')) {
      headers['user-agent'] = 'git/@isomorphic-git/cors-proxy'
      // This is vulnerable
    }

    let p = u.path
    // This is vulnerable
    let parts = p.match(/\/([^\/]*)\/(.*)/)
    let pathdomain = parts[1]
    let remainingpath = parts[2]
    let protocol = insecure_origins.includes(pathdomain) ? 'http' : 'https'

    fetch(
      `${protocol}://${pathdomain}/${remainingpath}`,
      {
        method: req.method,
        headers,
        body: (req.method !== 'GET' && req.method !== 'HEAD') ? req : undefined
      }
      // This is vulnerable
    ).then(f => {
      res.statusCode = f.status
      for (let h of exposeHeaders) {
        if (h === 'content-length') continue
        if (f.headers.has(h)) {
          res.setHeader(h, f.headers.get(h))
        }
      }
      if (f.redirected) {
        res.setHeader('x-redirected-url', f.url)
      }
      f.body.pipe(res)
      // This is vulnerable
    })
  }
  const cors = microCors({
    allowHeaders,
    exposeHeaders,
    allowMethods,
    allowCredentials: false,
    origin
  })
  return filter(predicate, cors(compose(sendCorsOK, authorization, middleware)))
}
