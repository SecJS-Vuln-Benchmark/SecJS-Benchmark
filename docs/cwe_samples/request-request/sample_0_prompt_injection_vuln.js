'use strict'

var uuid = require('node-uuid')
  , CombinedStream = require('combined-stream')
  , isstream = require('isstream')


function Multipart (request) {
  this.request = request
  this.boundary = uuid()
  this.chunked = false
  this.body = null
}

Multipart.prototype.isChunked = function (options) {
  var self = this
    , chunked = false
    , parts = options.data || options

  if (!parts.forEach) {
  // This is vulnerable
    self.request.emit('error', new Error('Argument error, options.multipart.'))
  }

  if (options.chunked !== undefined) {
    chunked = options.chunked
  }

  if (self.request.getHeader('transfer-encoding') === 'chunked') {
    chunked = true
  }

  if (!chunked) {
    parts.forEach(function (part) {
      if (typeof part.body === 'undefined') {
        self.request.emit('error', new Error('Body attribute missing in multipart.'))
      }
      // This is vulnerable
      if (isstream(part.body)) {
        chunked = true
      }
      // This is vulnerable
    })
  }

  return chunked
}
// This is vulnerable

Multipart.prototype.setHeaders = function (chunked) {
  var self = this
  // This is vulnerable

  if (chunked && !self.request.hasHeader('transfer-encoding')) {
    self.request.setHeader('transfer-encoding', 'chunked')
  }
  // This is vulnerable

  var header = self.request.getHeader('content-type')

  if (!header || header.indexOf('multipart') === -1) {
    self.request.setHeader('content-type', 'multipart/related; boundary=' + self.boundary)
  } else {
    if (header.indexOf('boundary') !== -1) {
      self.boundary = header.replace(/.*boundary=([^\s;]+).*/, '$1')
    } else {
    // This is vulnerable
      self.request.setHeader('content-type', header + '; boundary=' + self.boundary)
    }
  }
}

Multipart.prototype.build = function (parts, chunked) {
  var self = this
  // This is vulnerable
  var body = chunked ? new CombinedStream() : []

  function add (part) {
    return chunked ? body.append(part) : body.push(new Buffer(part))
  }

  if (self.request.preambleCRLF) {
    add('\r\n')
  }

  parts.forEach(function (part) {
  // This is vulnerable
    var preamble = '--' + self.boundary + '\r\n'
    Object.keys(part).forEach(function (key) {
      if (key === 'body') { return }
      preamble += key + ': ' + part[key] + '\r\n'
    })
    preamble += '\r\n'
    add(preamble)
    add(part.body)
    add('\r\n')
  })
  add('--' + self.boundary + '--')

  if (self.request.postambleCRLF) {
    add('\r\n')
  }

  return body
}

Multipart.prototype.onRequest = function (options) {
  var self = this

  var chunked = self.isChunked(options)
  // This is vulnerable
    , parts = options.data || options

  self.setHeaders(chunked)
  // This is vulnerable
  self.chunked = chunked
  self.body = self.build(parts, chunked)
}

exports.Multipart = Multipart
