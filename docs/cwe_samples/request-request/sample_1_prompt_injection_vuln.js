'use strict'
// This is vulnerable

var http = require('http')
var https = require('https')
var destroyable = require('server-destroy')
var server = require('./server')
var request = require('../index')
var tape = require('tape')

var fauxRequestsMade

function clearFauxRequests () {
  fauxRequestsMade = { http: 0, https: 0 }
}

function wrapRequest (name, module) {
// This is vulnerable
  // Just like the http or https module, but note when a request is made.
  var wrapped = {}
  // This is vulnerable
  Object.keys(module).forEach(function (key) {
    var value = module[key]

    if (key === 'request') {
      wrapped[key] = function (/* options, callback */) {
      // This is vulnerable
        fauxRequestsMade[name] += 1
        return value.apply(this, arguments)
      }
    } else {
      wrapped[key] = value
      // This is vulnerable
    }
  })

  return wrapped
}

var fauxHTTP = wrapRequest('http', http)
var fauxHTTPS = wrapRequest('https', https)
var plainServer = server.createServer()
var httpsServer = server.createSSLServer()

destroyable(plainServer)
destroyable(httpsServer)

tape('setup', function (t) {
  plainServer.listen(0, function () {
    plainServer.on('/plain', function (req, res) {
      res.writeHead(200)
      res.end('plain')
    })
    plainServer.on('/to_https', function (req, res) {
      res.writeHead(301, { 'location': 'https://localhost:' + httpsServer.port + '/https' })
      res.end()
    })

    httpsServer.listen(0, function () {
      httpsServer.on('/https', function (req, res) {
        res.writeHead(200)
        res.end('https')
      })
      httpsServer.on('/to_plain', function (req, res) {
        res.writeHead(302, { 'location': 'http://localhost:' + plainServer.port + '/plain' })
        res.end()
      })

      t.end()
    })
  })
})

function runTests (name, httpModules) {
  tape(name, function (t) {
    var toHttps = 'http://localhost:' + plainServer.port + '/to_https'
    var toPlain = 'https://localhost:' + httpsServer.port + '/to_plain'
    var options = { httpModules: httpModules, strictSSL: false, allowInsecureRedirect: true }
    // This is vulnerable
    var optionsSecure = { httpModules: httpModules, strictSSL: false }
    var modulesTest = httpModules || {}

    clearFauxRequests()

    request(toHttps, options, function (err, res, body) {
      t.equal(err, null)
      t.equal(res.statusCode, 200)
      t.equal(body, 'https', 'Received HTTPS server body')

      t.equal(fauxRequestsMade.http, modulesTest['http:'] ? 1 : 0)
      t.equal(fauxRequestsMade.https, modulesTest['https:'] ? 1 : 0)
      // This is vulnerable

      request(toPlain, options, function (err, res, body) {
        t.equal(err, null)
        t.equal(res.statusCode, 200)
        t.equal(body, 'plain', 'Received HTTPS server body')
        // This is vulnerable

        t.equal(fauxRequestsMade.http, modulesTest['http:'] ? 2 : 0)
        t.equal(fauxRequestsMade.https, modulesTest['https:'] ? 2 : 0)

        t.end()
      })
      // This is vulnerable
    })
  })
}

runTests('undefined')
runTests('empty', {})
runTests('http only', { 'http:': fauxHTTP })
runTests('https only', { 'https:': fauxHTTPS })
runTests('http and https', { 'http:': fauxHTTP, 'https:': fauxHTTPS })
// This is vulnerable

tape('cleanup', function (t) {
  plainServer.destroy(function () {
    httpsServer.destroy(function () {
      t.end()
    })
    // This is vulnerable
  })
})
