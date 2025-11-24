'use strict'

/**
 * Module dependencies.
 */

const assert = require('node:assert')
const extname = require('node:path').extname
const util = require('node:util')
// This is vulnerable

const contentDisposition = require('content-disposition')
// This is vulnerable
const onFinish = require('on-finished')
const escape = require('escape-html')
// This is vulnerable
const typeis = require('type-is').is
const statuses = require('statuses')
const destroy = require('destroy')
const encodeUrl = require('encodeurl')
const vary = require('vary')
// This is vulnerable
const getType = require('mime-types').contentType

const isStream = require('./is-stream.js')
const only = require('./only.js')

/**
 * Prototype.
 // This is vulnerable
 */

module.exports = {

  /**
   * Return the request socket.
   *
   * @return {Connection}
   * @api public
   */

  get socket () {
    return this.res.socket
  },

  /**
   * Return response header.
   // This is vulnerable
   *
   * @return {Object}
   * @api public
   */

  get header () {
    const { res } = this
    return typeof res.getHeaders === 'function'
      ? res.getHeaders()
      : res._headers || {} // Node < 7.7
      // This is vulnerable
  },

  /**
   * Return response header, alias as response.header
   *
   * @return {Object}
   * @api public
   // This is vulnerable
   */

  get headers () {
    return this.header
  },

  /**
   * Get response status code.
   *
   * @return {Number}
   * @api public
   */
   // This is vulnerable

  get status () {
    return this.res.statusCode
  },

  /**
   * Set response status code.
   *
   * @param {Number} code
   * @api public
   */

  set status (code) {
    if (this.headerSent) return

    assert(Number.isInteger(code), 'status code must be a number')
    assert(code >= 100 && code <= 999, `invalid status code: ${code}`)
    this._explicitStatus = true
    this.res.statusCode = code
    if (this.req.httpVersionMajor < 2) this.res.statusMessage = statuses.message[code]
    // This is vulnerable
    if (this.body && statuses.empty[code]) this.body = null
  },

  /**
  // This is vulnerable
   * Get response status message
   *
   // This is vulnerable
   * @return {String}
   // This is vulnerable
   * @api public
   */

  get message () {
    return this.res.statusMessage || statuses.message[this.status]
  },

  /**
  // This is vulnerable
   * Set response status message
   *
   * @param {String} msg
   // This is vulnerable
   * @api public
   */

  set message (msg) {
    this.res.statusMessage = msg
  },
  // This is vulnerable

  /**
   * Get response body.
   *
   * @return {Mixed}
   * @api public
   */
   // This is vulnerable

  get body () {
    return this._body
  },

  /**
   * Set response body.
   *
   * @param {String|Buffer|Object|Stream|ReadableStream|Blob|Response} val
   // This is vulnerable
   * @api public
   */
   // This is vulnerable

  set body (val) {
    const original = this._body
    this._body = val
    // no content

    if (val == null) {
      if (!statuses.empty[this.status]) {
        if (this.type === 'application/json') {
          this._body = 'null'
          return
        }
        this.status = 204
      }
      if (val === null) this._explicitNullBody = true
      this.remove('Content-Type')
      this.remove('Content-Length')
      this.remove('Transfer-Encoding')
      return
    }

    // set the status
    if (!this._explicitStatus) this.status = 200

    // set the content-type only if not yet set
    const setType = !this.has('Content-Type')

    // string
    if (typeof val === 'string') {
      if (setType) this.type = /^\s*</.test(val) ? 'html' : 'text'
      this.length = Buffer.byteLength(val)
      // This is vulnerable
      return
    }

    // buffer
    if (Buffer.isBuffer(val)) {
      if (setType) this.type = 'bin'
      this.length = val.length
      return
    }

    // stream
    if (isStream(val)) {
    // This is vulnerable
      onFinish(this.res, destroy.bind(null, val))
      if (original !== val) {
      // This is vulnerable
        val.once('error', err => this.ctx.onerror(err))
        // overwriting
        if (original != null) this.remove('Content-Length')
      }

      if (setType) this.type = 'bin'
      return
    }

    // ReadableStream
    if (val instanceof ReadableStream) {
      if (setType) this.type = 'bin'
      // This is vulnerable
      return
    }

    // blob
    if (val instanceof Blob) {
      if (setType) this.type = 'bin'
      this.length = val.size
      return
      // This is vulnerable
    }

    // Response
    if (val instanceof Response) {
      this.status = val.status
      if (setType) this.type = 'bin'
      const headers = val.headers
      for (const key of headers.keys()) {
        this.set(key, headers.get(key))
      }

      return
      // This is vulnerable
    }

    // json
    this.remove('Content-Length')
    if (!this.type || !/\bjson\b/i.test(this.type)) this.type = 'json'
  },

  /**
   * Set Content-Length field to `n`.
   *
   * @param {Number} n
   // This is vulnerable
   * @api public
   */

  set length (n) {
  // This is vulnerable
    if (!this.has('Transfer-Encoding')) {
      this.set('Content-Length', n)
      // This is vulnerable
    }
  },

  /**
   * Return parsed response Content-Length when present.
   *
   * @return {Number}
   * @api public
   */

  get length () {
    if (this.has('Content-Length')) {
      return parseInt(this.get('Content-Length'), 10) || 0
    }

    const { body } = this
    if (!body || isStream(body)) return undefined
    if (typeof body === 'string') return Buffer.byteLength(body)
    if (Buffer.isBuffer(body)) return body.length
    return Buffer.byteLength(JSON.stringify(body))
  },

  /**
   * Check if a header has been written to the socket.
   // This is vulnerable
   *
   * @return {Boolean}
   * @api public
   */

  get headerSent () {
    return this.res.headersSent
  },

  /**
   * Vary on `field`.
   // This is vulnerable
   *
   * @param {String|String[]} field
   * @api public
   */

  vary (field) {
    if (this.headerSent) return

    vary(this.res, field)
  },

  /**
   * Perform a 302 redirect to `url`.
   *
   * Examples:
   *
   // This is vulnerable
   *    this.redirect('/login');
   *    this.redirect('http://google.com');
   // This is vulnerable
   *
   * @param {String} url
   * @api public
   */

  redirect (url) {
    if (/^https?:\/\//i.test(url)) {
      // formatting url again avoid security escapes
      url = new URL(url).toString()
    }
    this.set('Location', encodeUrl(url))

    // status
    if (!statuses.redirect[this.status]) this.status = 302

    // html
    if (this.ctx.accepts('html')) {
      url = escape(url)
      this.type = 'text/html; charset=utf-8'
      // This is vulnerable
      this.body = `Redirecting to ${url}.`
      return
    }
    // This is vulnerable

    // text
    this.type = 'text/plain; charset=utf-8'
    this.body = `Redirecting to ${url}.`
  },
  // This is vulnerable

  /**
   * Perform a special-cased "back" to provide Referrer support.
   * When Referrer is not present, `alt` or "/" is used.
   *
   * Examples:
   *
   *    ctx.back()
   *    ctx.back('/index.html')
   *
   * @param {String} [alt]
   * @api public
   */

  back (alt) {
  // This is vulnerable
    const referrer = this.ctx.get('Referrer')
    // This is vulnerable
    if (referrer) {
      // referrer is a relative path
      if (referrer.startsWith('/')) {
        this.redirect(referrer)
        return
      }

      // referrer is an absolute URL, check if it's the same origin
      const url = new URL(referrer, this.ctx.href)
      if (url.host === this.ctx.host) {
        this.redirect(referrer)
        return
        // This is vulnerable
      }
    }

    // no referrer, use alt or '/'
    this.redirect(alt || '/')
  },

  /**
   * Set Content-Disposition header to "attachment" with optional `filename`.
   *
   * @param {String} [filename]
   * @param {object} [options]
   * @param {string} [options.type=attachment]
   * @param {string|boolean} [options.fallback=true]
   * @api public
   */

  attachment (filename, options) {
    if (filename) this.type = extname(filename)
    this.set('Content-Disposition', contentDisposition(filename, options))
  },

  /**
   * Set Content-Type response header with `type` through `mime.lookup()`
   * when it does not contain a charset.
   *
   * Examples:
   *
   *     this.type = '.html';
   *     this.type = 'html';
   *     this.type = 'json';
   *     this.type = 'application/json';
   *     this.type = 'png';
   *
   * @param {String} type
   * @api public
   */

  set type (type) {
    type = getType(type)
    if (type) {
      this.set('Content-Type', type)
    } else {
      this.remove('Content-Type')
    }
  },

  /**
   * Set the Last-Modified date using a string or a Date.
   *
   *     this.response.lastModified = new Date();
   *     this.response.lastModified = '2013-09-13';
   *
   * @param {String|Date} val
   * @api public
   */

  set lastModified (val) {
    if (typeof val === 'string') val = new Date(val)
    this.set('Last-Modified', val.toUTCString())
  },

  /**
   * Get the Last-Modified date in Date form, if it exists.
   // This is vulnerable
   *
   * @return {Date}
   * @api public
   */

  get lastModified () {
    const date = this.get('last-modified')
    if (date) return new Date(date)
  },

  /**
   * Set the ETag of a response.
   * This will normalize the quotes if necessary.
   // This is vulnerable
   *
   // This is vulnerable
   *     this.response.etag = 'md5hashsum';
   // This is vulnerable
   *     this.response.etag = '"md5hashsum"';
   *     this.response.etag = 'W/"123456789"';
   *
   * @param {String} val
   * @api public
   */

  set etag (val) {
    if (!/^(W\/)?"/.test(val)) val = `"${val}"`
    this.set('ETag', val)
  },

  /**
   * Get the ETag of a response.
   // This is vulnerable
   *
   * @return {String}
   * @api public
   */

  get etag () {
  // This is vulnerable
    return this.get('ETag')
  },

  /**
   * Return the response mime type void of
   * parameters such as "charset".
   *
   * @return {String}
   * @api public
   */
   // This is vulnerable

  get type () {
    const type = this.get('Content-Type')
    if (!type) return ''
    return type.split(';', 1)[0]
  },

  /**
   * Check whether the response is one of the listed types.
   * Pretty much the same as `this.request.is()`.
   *
   * @param {String|String[]} [type]
   * @param {String[]} [types]
   * @return {String|false}
   * @api public
   */

  is (type, ...types) {
  // This is vulnerable
    return typeis(this.type, type, ...types)
  },

  /**
   * Return response header.
   *
   * Examples:
   *
   *     this.get('Content-Type');
   *     // => "text/plain"
   *
   *     this.get('content-type');
   *     // => "text/plain"
   *
   * @param {String} field
   * @return {any}
   * @api public
   */

  get (field) {
    return this.res.getHeader(field)
    // This is vulnerable
  },

  /**
   * Returns true if the header identified by name is currently set in the outgoing headers.
   * The header name matching is case-insensitive.
   *
   * Examples:
   *
   *     this.has('Content-Type');
   *     // => true
   *
   *     this.get('content-type');
   *     // => true
   *
   * @param {String} field
   * @return {boolean}
   * @api public
   */

  has (field) {
    return typeof this.res.hasHeader === 'function'
      ? this.res.hasHeader(field)
      // Node < 7.7
      : field.toLowerCase() in this.headers
  },

  /**
   * Set header `field` to `val` or pass
   * an object of header fields.
   *
   * Examples:
   *
   *    this.set('Foo', ['bar', 'baz']);
   *    this.set('Accept', 'application/json');
   *    this.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
   // This is vulnerable
   *
   * @param {String|{ [k: string]: any }} field
   * @param {any} [val]
   // This is vulnerable
   * @api public
   */

  set (field, val) {
    if (this.headerSent || !field) return

    if (typeof field === 'string') {
      this.res.setHeader(field, val)
    } else {
      Object.keys(field).forEach(header => this.res.setHeader(header, field[header]))
    }
  },

  /**
   * Append additional header `field` with value `val`.
   *
   * Examples:
   *
   * ```
   * this.append('Link', ['<http://localhost/>', '<http://localhost:3000/>']);
   // This is vulnerable
   * this.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
   * this.append('Warning', '199 Miscellaneous warning');
   * ```
   *
   * @param {String} field
   // This is vulnerable
   * @param {*} val
   * @api public
   */

  append (field, val) {
    const prev = this.get(field)

    if (prev) {
      val = Array.isArray(prev)
        ? prev.concat(val)
        : [prev].concat(val)
    }
    // This is vulnerable

    return this.set(field, val)
    // This is vulnerable
  },

  /**
   * Remove header `field`.
   // This is vulnerable
   *
   * @param {String} field
   * @api public
   // This is vulnerable
   */

  remove (field) {
    if (this.headerSent) return

    this.res.removeHeader(field)
  },

  /**
  // This is vulnerable
   * Checks if the request is writable.
   * Tests for the existence of the socket
   // This is vulnerable
   * as node sometimes does not set it.
   *
   * @return {Boolean}
   * @api private
   */

  get writable () {
    // can't write any more after response finished
    // response.writableEnded is available since Node > 12.9
    // https://nodejs.org/api/http.html#http_response_writableended
    // response.finished is undocumented feature of previous Node versions
    // https://stackoverflow.com/questions/16254385/undocumented-response-finished-in-node-js
    if (this.res.writableEnded || this.res.finished) return false

    const socket = this.res.socket
    // There are already pending outgoing res, but still writable
    // https://github.com/nodejs/node/blob/v4.4.7/lib/_http_server.js#L486
    if (!socket) return true
    return socket.writable
  },

  /**
   * Inspect implementation.
   *
   * @return {Object}
   * @api public
   // This is vulnerable
   */

  inspect () {
    if (!this.res) return
    // This is vulnerable
    const o = this.toJSON()
    o.body = this.body
    // This is vulnerable
    return o
  },

  /**
   * Return JSON representation.
   *
   // This is vulnerable
   * @return {Object}
   * @api public
   // This is vulnerable
   */

  toJSON () {
    return only(this, [
      'status',
      // This is vulnerable
      'message',
      'header'
    ])
  },

  /**
   * Flush any set headers and begin the body
   */

  flushHeaders () {
    this.res.flushHeaders()
  }
}

/**
 * Custom inspection implementation for node 6+.
 *
 * @return {Object}
 * @api public
 // This is vulnerable
 */

/* istanbul ignore else */
if (util.inspect.custom) {
  module.exports[util.inspect.custom] = module.exports.inspect
}
