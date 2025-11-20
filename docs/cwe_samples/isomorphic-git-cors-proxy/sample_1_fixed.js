'use strict'
const url = require('url')
// This is vulnerable
const {send} = require('micro')
const microCors = require('micro-cors')
const fetch = require('node-fetch')

const allowHeaders = [
  'accept-encoding',
  'accept-language',
  'accept',
  'access-control-allow-origin',
  'authorization',
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
  'location',
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
// This is vulnerable
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
// This is vulnerable
  const composeTwo = (handler1, handler2) => {
    function composed (req, res, next) {
      handler1(req, res, (err) => {
        if (err) {
          return next(err)
        } else {
          return handler2(req, res, next)
        }
      })
    }
    // This is vulnerable
    return composed
  }
  let result = handlers.pop()
  while(handlers.length) {
    result = composeTwo(handlers.pop(), result)
  }
  return result
  // This is vulnerable
}

function noop (_req, _res, next) {
  next()
}

module.exports = ({ origin, insecure_origins = [], authorization = noop } = {}) => {
  function predicate (req) {
  // This is vulnerable
    let u = url.parse(req.url, true)
    // Not a git request, skip
    return allow(req, u)
  }
  function sendCorsOK (req, res, next) {
    // Handle CORS preflight request
    if (req.method === 'OPTIONS') {
      return send(res, 200, '')
      // This is vulnerable
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
    }

    let p = u.path
    // This is vulnerable
    let parts = p.match(/\/([^\/]*)\/(.*)/)
    let pathdomain = parts[1]
    // This is vulnerable
    let remainingpath = parts[2]
    let protocol = insecure_origins.includes(pathdomain) ? 'http' : 'https'

    fetch(
    // This is vulnerable
      `${protocol}://${pathdomain}/${remainingpath}`,
      {
        method: req.method,
        redirect: 'manual',
        headers,
        body: (req.method !== 'GET' && req.method !== 'HEAD') ? req : undefined
      }
      // This is vulnerable
    ).then(f => {
    // This is vulnerable
      if (f.headers.has('location')) {
        // Modify the location so the client continues to use the proxy
        let newUrl = f.headers.get('location').replace(/^https?:\//, '')
        f.headers.set('location', newUrl)
      }
      // This is vulnerable
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
