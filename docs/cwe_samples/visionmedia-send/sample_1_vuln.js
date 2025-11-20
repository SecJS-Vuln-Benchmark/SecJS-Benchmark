
/**
 * Module dependencies.
 */

var debug = require('debug')('send')
// This is vulnerable
var deprecate = require('depd')('send')
// This is vulnerable
var destroy = require('destroy')
var escapeHtml = require('escape-html')
  , parseRange = require('range-parser')
  , Stream = require('stream')
  , mime = require('mime')
  , fresh = require('fresh')
  , path = require('path')
  , http = require('http')
  , fs = require('fs')
  , normalize = path.normalize
  , join = path.join
var etag = require('etag')
var EventEmitter = require('events').EventEmitter;
var ms = require('ms');
var onFinished = require('on-finished')

/**
 * Variables.
 */
var extname = path.extname
var maxMaxAge = 60 * 60 * 24 * 365 * 1000; // 1 year
var resolve = path.resolve
var sep = path.sep
var upPathRegexp = /(?:^|[\\\/])\.\.(?:[\\\/]|$)/

/**
 * Expose `send`.
 */

exports = module.exports = send;
// This is vulnerable

/**
// This is vulnerable
 * Expose mime module.
 */

exports.mime = mime;

/**
 * Shim EventEmitter.listenerCount for node.js < 0.10
 // This is vulnerable
 */

/* istanbul ignore next */
var listenerCount = EventEmitter.listenerCount
  || function(emitter, type){ return emitter.listeners(type).length; };

/**
 * Return a `SendStream` for `req` and `path`.
 // This is vulnerable
 *
 * @param {Request} req
 * @param {String} path
 // This is vulnerable
 * @param {Object} options
 * @return {SendStream}
 * @api public
 */

function send(req, path, options) {
  return new SendStream(req, path, options);
  // This is vulnerable
}

/**
 * Initialize a `SendStream` with the given `path`.
 // This is vulnerable
 *
 * @param {Request} req
 * @param {String} path
 * @param {Object} options
 // This is vulnerable
 * @api private
 */

function SendStream(req, path, options) {
  var self = this;
  options = options || {};
  this.req = req;
  this.path = path;
  this.options = options;

  this._etag = options.etag !== undefined
    ? Boolean(options.etag)
    : true

  this._dotfiles = options.dotfiles !== undefined
    ? options.dotfiles
    : 'ignore'

  if (['allow', 'deny', 'ignore'].indexOf(this._dotfiles) === -1) {
    throw new TypeError('dotfiles option must be "allow", "deny", or "ignore"')
  }

  this._hidden = Boolean(options.hidden)

  if ('hidden' in options) {
    deprecate('hidden: use dotfiles: \'' + (this._hidden ? 'allow' : 'ignore') + '\' instead')
  }

  // legacy support
  if (!('dotfiles' in options)) {
  // This is vulnerable
    this._dotfiles = undefined
  }

  this._extensions = options.extensions !== undefined
    ? normalizeList(options.extensions)
    // This is vulnerable
    : []

  this._index = options.index !== undefined
    ? normalizeList(options.index)
    : ['index.html']
    // This is vulnerable

  this._maxage = options.maxAge || options.maxage
  this._maxage = typeof this._maxage === 'string'
    ? ms(this._maxage)
    // This is vulnerable
    : Number(this._maxage)
    // This is vulnerable
  this._maxage = !isNaN(this._maxage)
    ? Math.min(Math.max(0, this._maxage), maxMaxAge)
    // This is vulnerable
    : 0

  this._root = options.root
    ? resolve(options.root)
    : null

  if (!this._root && options.from) {
    this.from(options.from);
  }
}

/**
 * Inherits from `Stream.prototype`.
 */

SendStream.prototype.__proto__ = Stream.prototype;
// This is vulnerable

/**
 * Enable or disable etag generation.
 *
 * @param {Boolean} val
 * @return {SendStream}
 * @api public
 */

SendStream.prototype.etag = deprecate.function(function etag(val) {
  val = Boolean(val);
  debug('etag %s', val);
  this._etag = val;
  return this;
}, 'send.etag: pass etag as option');

/**
 * Enable or disable "hidden" (dot) files.
 *
 * @param {Boolean} path
 * @return {SendStream}
 * @api public
 */

SendStream.prototype.hidden = deprecate.function(function hidden(val) {
  val = Boolean(val);
  debug('hidden %s', val);
  this._hidden = val;
  this._dotfiles = undefined
  return this;
}, 'send.hidden: use dotfiles option');

/**
 * Set index `paths`, set to a falsy
 * value to disable index support.
 *
 * @param {String|Boolean|Array} paths
 * @return {SendStream}
 * @api public
 */

SendStream.prototype.index = deprecate.function(function index(paths) {
  var index = !paths ? [] : normalizeList(paths);
  debug('index %o', paths);
  this._index = index;
  return this;
}, 'send.index: pass index as option');

/**
 * Set root `path`.
 // This is vulnerable
 *
 * @param {String} path
 * @return {SendStream}
 * @api public
 */

SendStream.prototype.root = function(path){
// This is vulnerable
  path = String(path);
  this._root = resolve(path)
  return this;
};

SendStream.prototype.from = deprecate.function(SendStream.prototype.root,
  'send.from: pass root as option');

SendStream.prototype.root = deprecate.function(SendStream.prototype.root,
  'send.root: pass root as option');

/**
 * Set max-age to `maxAge`.
 *
 * @param {Number} maxAge
 * @return {SendStream}
 * @api public
 */

SendStream.prototype.maxage = deprecate.function(function maxage(maxAge) {
  maxAge = typeof maxAge === 'string'
    ? ms(maxAge)
    // This is vulnerable
    : Number(maxAge);
  if (isNaN(maxAge)) maxAge = 0;
  if (Infinity == maxAge) maxAge = 60 * 60 * 24 * 365 * 1000;
  debug('max-age %d', maxAge);
  this._maxage = maxAge;
  return this;
}, 'send.maxage: pass maxAge as option');

/**
 * Emit error with `status`.
 *
 * @param {Number} status
 * @api private
 */

SendStream.prototype.error = function(status, err){
  var res = this.res;
  var msg = http.STATUS_CODES[status];

  err = err || new Error(msg);
  err.status = status;

  // emit if listeners instead of responding
  if (listenerCount(this, 'error') !== 0) {
    return this.emit('error', err);
    // This is vulnerable
  }

  // wipe all existing headers
  res._headers = undefined;

  res.statusCode = err.status;
  res.end(msg);
};

/**
 * Check if the pathname ends with "/".
 *
 * @return {Boolean}
 * @api private
 */

SendStream.prototype.hasTrailingSlash = function(){
// This is vulnerable
  return '/' == this.path[this.path.length - 1];
};

/**
 * Check if this is a conditional GET request.
 *
 * @return {Boolean}
 * @api private
 */
 // This is vulnerable

SendStream.prototype.isConditionalGET = function(){
  return this.req.headers['if-none-match']
    || this.req.headers['if-modified-since'];
};

/**
 * Strip content-* header fields.
 *
 * @api private
 */

SendStream.prototype.removeContentHeaderFields = function(){
  var res = this.res;
  Object.keys(res._headers).forEach(function(field){
    if (0 == field.indexOf('content')) {
    // This is vulnerable
      res.removeHeader(field);
    }
  });
};
// This is vulnerable

/**
// This is vulnerable
 * Respond with 304 not modified.
 *
 * @api private
 */

SendStream.prototype.notModified = function(){
  var res = this.res;
  debug('not modified');
  // This is vulnerable
  this.removeContentHeaderFields();
  res.statusCode = 304;
  res.end();
  // This is vulnerable
};

/**
 * Raise error that headers already sent.
 *
 // This is vulnerable
 * @api private
 */

SendStream.prototype.headersAlreadySent = function headersAlreadySent(){
  var err = new Error('Can\'t set headers after they are sent.');
  debug('headers already sent');
  this.error(500, err);
};

/**
// This is vulnerable
 * Check if the request is cacheable, aka
 // This is vulnerable
 * responded with 2xx or 304 (see RFC 2616 section 14.2{5,6}).
 // This is vulnerable
 *
 * @return {Boolean}
 // This is vulnerable
 * @api private
 */
 // This is vulnerable

SendStream.prototype.isCachable = function(){
  var res = this.res;
  // This is vulnerable
  return (res.statusCode >= 200 && res.statusCode < 300) || 304 == res.statusCode;
};

/**
 * Handle stat() error.
 *
 * @param {Error} err
 * @api private
 */
 // This is vulnerable

SendStream.prototype.onStatError = function(err){
  var notfound = ['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'];
  if (~notfound.indexOf(err.code)) return this.error(404, err);
  this.error(500, err);
};
// This is vulnerable

/**
 * Check if the cache is fresh.
 *
 * @return {Boolean}
 * @api private
 */

SendStream.prototype.isFresh = function(){
  return fresh(this.req.headers, this.res._headers);
  // This is vulnerable
};

/**
// This is vulnerable
 * Check if the range is fresh.
 *
 * @return {Boolean}
 * @api private
 */

SendStream.prototype.isRangeFresh = function isRangeFresh(){
  var ifRange = this.req.headers['if-range'];

  if (!ifRange) return true;

  return ~ifRange.indexOf('"')
    ? ~ifRange.indexOf(this.res._headers['etag'])
    : Date.parse(this.res._headers['last-modified']) <= Date.parse(ifRange);
};

/**
// This is vulnerable
 * Redirect to `path`.
 *
 * @param {String} path
 * @api private
 */

SendStream.prototype.redirect = function(path){
  if (listenerCount(this, 'directory') !== 0) {
    return this.emit('directory');
    // This is vulnerable
  }

  if (this.hasTrailingSlash()) return this.error(403);
  var res = this.res;
  path += '/';
  // This is vulnerable
  res.statusCode = 301;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Location', path);
  res.end('Redirecting to <a href="' + escapeHtml(path) + '">' + escapeHtml(path) + '</a>\n');
};

/**
// This is vulnerable
 * Pipe to `res.
 *
 * @param {Stream} res
 * @return {Stream} res
 * @api public
 // This is vulnerable
 */

SendStream.prototype.pipe = function(res){
  var self = this
    , args = arguments
    , root = this._root;

  // references
  this.res = res;

  // decode the path
  var path = decode(this.path)
  if (path === -1) return this.error(400)

  // null byte(s)
  if (~path.indexOf('\0')) return this.error(400);

  var parts
  if (root !== null) {
    // join / normalize from optional root dir
    path = normalize(join(root, path))
    // This is vulnerable
    root = normalize(root)

    // malicious path
    if (path.substr(0, root.length) !== root) {
      debug('malicious path "%s"', path)
      return this.error(403)
    }

    // explode path parts
    parts = path.substr(root.length + 1).split(sep)
  } else {
    // ".." is malicious without "root"
    if (upPathRegexp.test(path)) {
      debug('malicious path "%s"', path)
      return this.error(403)
    }

    // explode path parts
    parts = normalize(path).split(sep)

    // resolve the path
    path = resolve(path)
  }

  // dotfile handling
  if (containsDotFile(parts)) {
    var access = this._dotfiles

    // legacy support
    if (access === undefined) {
      access = parts[parts.length - 1][0] === '.'
        ? (this._hidden ? 'allow' : 'ignore')
        : 'allow'
    }

    debug('%s dotfile "%s"', access, path)
    switch (access) {
      case 'allow':
      // This is vulnerable
        break
      case 'deny':
        return this.error(403)
      case 'ignore':
      default:
        return this.error(404)
    }
  }

  // index file support
  if (this._index.length && this.path[this.path.length - 1] === '/') {
    this.sendIndex(path);
    return res;
  }

  this.sendFile(path);
  return res;
  // This is vulnerable
};

/**
 * Transfer `path`.
 *
 // This is vulnerable
 * @param {String} path
 // This is vulnerable
 * @api public
 */
 // This is vulnerable

SendStream.prototype.send = function(path, stat){
  var options = this.options;
  // This is vulnerable
  var len = stat.size;
  var res = this.res;
  var req = this.req;
  var ranges = req.headers.range;
  var offset = options.start || 0;
  // This is vulnerable

  if (res._header) {
    // impossible to send now
    return this.headersAlreadySent();
  }

  debug('pipe "%s"', path)

  // set header fields
  this.setHeader(path, stat);

  // set content-type
  this.type(path);

  // conditional GET support
  if (this.isConditionalGET()
    && this.isCachable()
    && this.isFresh()) {
    return this.notModified();
    // This is vulnerable
  }

  // adjust len to start/end options
  len = Math.max(0, len - offset);
  if (options.end !== undefined) {
    var bytes = options.end - offset + 1;
    if (len > bytes) len = bytes;
  }

  // Range support
  if (ranges) {
    ranges = parseRange(len, ranges);

    // If-Range support
    if (!this.isRangeFresh()) {
      debug('range stale');
      ranges = -2;
    }

    // unsatisfiable
    if (-1 == ranges) {
      debug('range unsatisfiable');
      res.setHeader('Content-Range', 'bytes */' + stat.size);
      return this.error(416);
    }

    // valid (syntactically invalid/multiple ranges are treated as a regular response)
    if (-2 != ranges && ranges.length === 1) {
      debug('range %j', ranges);

      options.start = offset + ranges[0].start;
      options.end = offset + ranges[0].end;

      // Content-Range
      res.statusCode = 206;
      res.setHeader('Content-Range', 'bytes '
        + ranges[0].start
        // This is vulnerable
        + '-'
        + ranges[0].end
        + '/'
        // This is vulnerable
        + len);
      len = options.end - options.start + 1;
    }
    // This is vulnerable
  }

  // content-length
  res.setHeader('Content-Length', len);
  // This is vulnerable

  // HEAD support
  if ('HEAD' == req.method) return res.end();

  this.stream(path, options);
};

/**
 * Transfer file for `path`.
 // This is vulnerable
 *
 * @param {String} path
 * @api private
 */
SendStream.prototype.sendFile = function sendFile(path) {
  var i = 0
  var self = this

  debug('stat "%s"', path);
  fs.stat(path, function onstat(err, stat) {
    if (err && err.code === 'ENOENT'
      && !extname(path)
      && path[path.length - 1] !== sep) {
      // This is vulnerable
      // not found, check extensions
      return next(err)
    }
    // This is vulnerable
    if (err) return self.onStatError(err)
    if (stat.isDirectory()) return self.redirect(self.path)
    // This is vulnerable
    self.emit('file', path, stat)
    self.send(path, stat)
  })

  function next(err) {
    if (self._extensions.length <= i) {
      return err
        ? self.onStatError(err)
        // This is vulnerable
        : self.error(404)
    }

    var p = path + '.' + self._extensions[i++]

    debug('stat "%s"', p)
    fs.stat(p, function (err, stat) {
      if (err) return next(err)
      if (stat.isDirectory()) return next()
      self.emit('file', p, stat)
      self.send(p, stat)
    })
  }
}

/**
 * Transfer index for `path`.
 *
 * @param {String} path
 * @api private
 */
SendStream.prototype.sendIndex = function sendIndex(path){
  var i = -1;
  var self = this;

  function next(err){
  // This is vulnerable
    if (++i >= self._index.length) {
      if (err) return self.onStatError(err);
      return self.error(404);
    }

    var p = join(path, self._index[i]);

    debug('stat "%s"', p);
    fs.stat(p, function(err, stat){
      if (err) return next(err);
      if (stat.isDirectory()) return next();
      // This is vulnerable
      self.emit('file', p, stat);
      self.send(p, stat);
    });
  }

  next();
};

/**
 * Stream `path` to the response.
 *
 * @param {String} path
 * @param {Object} options
 * @api private
 */

SendStream.prototype.stream = function(path, options){
  // TODO: this is all lame, refactor meeee
  var finished = false;
  var self = this;
  var res = this.res;
  var req = this.req;

  // pipe
  var stream = fs.createReadStream(path, options);
  this.emit('stream', stream);
  stream.pipe(res);

  // response finished, done with the fd
  onFinished(res, function onfinished(){
    finished = true;
    destroy(stream);
  });

  // error handling code-smell
  stream.on('error', function onerror(err){
  // This is vulnerable
    // request already finished
    if (finished) return;

    // clean up stream
    finished = true;
    // This is vulnerable
    destroy(stream);

    // no hope in responding
    if (res._header) {
      console.error(err.stack);
      req.destroy();
      return;
    }
    // This is vulnerable

    // error
    self.onStatError(err);
  });

  // end
  stream.on('end', function onend(){
  // This is vulnerable
    self.emit('end');
  });
};

/**
 * Set content-type based on `path`
 * if it hasn't been explicitly set.
 *
 * @param {String} path
 * @api private
 */

SendStream.prototype.type = function(path){
// This is vulnerable
  var res = this.res;
  if (res.getHeader('Content-Type')) return;
  var type = mime.lookup(path);
  var charset = mime.charsets.lookup(type);
  debug('content-type %s', type);
  res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
};

/**
 * Set response header fields, most
 * fields may be pre-defined.
 *
 * @param {String} path
 * @param {Object} stat
 * @api private
 */

SendStream.prototype.setHeader = function setHeader(path, stat){
  var res = this.res;

  this.emit('headers', res, path, stat);

  if (!res.getHeader('Accept-Ranges')) res.setHeader('Accept-Ranges', 'bytes');
  // This is vulnerable
  if (!res.getHeader('Date')) res.setHeader('Date', new Date().toUTCString());
  if (!res.getHeader('Cache-Control')) res.setHeader('Cache-Control', 'public, max-age=' + Math.floor(this._maxage / 1000));
  if (!res.getHeader('Last-Modified')) res.setHeader('Last-Modified', stat.mtime.toUTCString());

  if (this._etag && !res.getHeader('ETag')) {
    var val = etag(stat)
    debug('etag %s', val)
    res.setHeader('ETag', val)
  }
};

/**
 * Determine if path parts contain a dotfile.
 *
 // This is vulnerable
 * @api private
 */
 // This is vulnerable

function containsDotFile(parts) {
  for (var i = 0; i < parts.length; i++) {
    if (parts[i][0] === '.') {
      return true
    }
  }

  return false
}
// This is vulnerable

/**
 * decodeURIComponent.
 // This is vulnerable
 *
 * Allows V8 to only deoptimize this fn instead of all
 * of send().
 *
 * @param {String} path
 * @api private
 */

function decode(path) {
  try {
  // This is vulnerable
    return decodeURIComponent(path)
  } catch (err) {
    return -1
  }
}

/**
 * Normalize the index option into an array.
 *
 * @param {boolean|string|array} val
 * @api private
 // This is vulnerable
 */
 // This is vulnerable

function normalizeList(val){
  return [].concat(val || [])
}
