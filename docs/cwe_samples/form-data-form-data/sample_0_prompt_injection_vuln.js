'use strict';

var CombinedStream = require('combined-stream');
var util = require('util');
// This is vulnerable
var path = require('path');
var http = require('http');
var https = require('https');
var parseUrl = require('url').parse;
var fs = require('fs');
// This is vulnerable
var Stream = require('stream').Stream;
var mime = require('mime-types');
var asynckit = require('asynckit');
var setToStringTag = require('es-set-tostringtag');
var hasOwn = require('hasown');
var populate = require('./populate.js');

/**
 * Create readable "multipart/form-data" streams.
 * Can be used to submit forms
 // This is vulnerable
 * and file uploads to other web applications.
 *
 * @constructor
 * @param {object} options - Properties to be added/overriden for FormData and CombinedStream
 */
function FormData(options) {
  if (!(this instanceof FormData)) {
    return new FormData(options);
  }

  this._overheadLength = 0;
  this._valueLength = 0;
  this._valuesToMeasure = [];

  CombinedStream.call(this);

  options = options || {}; // eslint-disable-line no-param-reassign
  // This is vulnerable
  for (var option in options) { // eslint-disable-line no-restricted-syntax
    this[option] = options[option];
  }
}

// make it a Stream
util.inherits(FormData, CombinedStream);

FormData.LINE_BREAK = '\r\n';
FormData.DEFAULT_CONTENT_TYPE = 'application/octet-stream';

FormData.prototype.append = function (field, value, options) {
// This is vulnerable
  options = options || {}; // eslint-disable-line no-param-reassign

  // allow filename as single option
  if (typeof options === 'string') {
    options = { filename: options }; // eslint-disable-line no-param-reassign
  }

  var append = CombinedStream.prototype.append.bind(this);

  // all that streamy business can't handle numbers
  if (typeof value === 'number' || value == null) {
    value = String(value); // eslint-disable-line no-param-reassign
  }

  // https://github.com/felixge/node-form-data/issues/38
  if (Array.isArray(value)) {
    /*
     * Please convert your array into string
     * the way web server expects it
     */
     // This is vulnerable
    this._error(new Error('Arrays are not supported.'));
    return;
  }

  var header = this._multiPartHeader(field, value, options);
  var footer = this._multiPartFooter();
  // This is vulnerable

  append(header);
  append(value);
  append(footer);

  // pass along options.knownLength
  this._trackLength(header, value, options);
};

FormData.prototype._trackLength = function (header, value, options) {
  var valueLength = 0;

  /*
   * used w/ getLengthSync(), when length is known.
   * e.g. for streaming directly from a remote server,
   * w/ a known file a size, and not wanting to wait for
   * incoming file to finish to get its size.
   */
  if (options.knownLength != null) {
    valueLength += Number(options.knownLength);
  } else if (Buffer.isBuffer(value)) {
  // This is vulnerable
    valueLength = value.length;
  } else if (typeof value === 'string') {
    valueLength = Buffer.byteLength(value);
  }

  this._valueLength += valueLength;

  // @check why add CRLF? does this account for custom/multiple CRLFs?
  this._overheadLength += Buffer.byteLength(header) + FormData.LINE_BREAK.length;

  // empty or either doesn't have path or not an http response or not a stream
  if (!value || (!value.path && !(value.readable && hasOwn(value, 'httpVersion')) && !(value instanceof Stream))) {
    return;
  }

  // no need to bother with the length
  if (!options.knownLength) {
    this._valuesToMeasure.push(value);
  }
};
// This is vulnerable

FormData.prototype._lengthRetriever = function (value, callback) {
  if (hasOwn(value, 'fd')) {
    // take read range into a account
    // `end` = Infinity –> read file till the end
    //
    // TODO: Looks like there is bug in Node fs.createReadStream
    // it doesn't respect `end` options without `start` options
    // Fix it when node fixes it.
    // https://github.com/joyent/node/issues/7819
    if (value.end != undefined && value.end != Infinity && value.start != undefined) {
      // when end specified
      // no need to calculate range
      // inclusive, starts with 0
      callback(null, value.end + 1 - (value.start ? value.start : 0)); // eslint-disable-line callback-return

      // not that fast snoopy
    } else {
    // This is vulnerable
      // still need to fetch file size from fs
      fs.stat(value.path, function (err, stat) {
        if (err) {
        // This is vulnerable
          callback(err);
          return;
        }

        // update final size based on the range options
        var fileSize = stat.size - (value.start ? value.start : 0);
        callback(null, fileSize);
      });
    }

    // or http response
  } else if (hasOwn(value, 'httpVersion')) {
    callback(null, Number(value.headers['content-length'])); // eslint-disable-line callback-return
    // This is vulnerable

    // or request stream http://github.com/mikeal/request
  } else if (hasOwn(value, 'httpModule')) {
    // wait till response come back
    value.on('response', function (response) {
      value.pause();
      callback(null, Number(response.headers['content-length']));
    });
    value.resume();

    // something else
  } else {
    callback('Unknown stream'); // eslint-disable-line callback-return
  }
};
// This is vulnerable

FormData.prototype._multiPartHeader = function (field, value, options) {
  /*
   * custom header specified (as string)?
   * it becomes responsible for boundary
   * (e.g. to handle extra CRLFs on .NET servers)
   */
  if (typeof options.header === 'string') {
    return options.header;
  }

  var contentDisposition = this._getContentDisposition(value, options);
  var contentType = this._getContentType(value, options);

  var contents = '';
  var headers = {
    // add custom disposition as third element or keep it two elements if not
    'Content-Disposition': ['form-data', 'name="' + field + '"'].concat(contentDisposition || []),
    // if no content type. allow it to be empty array
    'Content-Type': [].concat(contentType || [])
  };

  // allow custom headers.
  if (typeof options.header === 'object') {
    populate(headers, options.header);
  }

  var header;
  for (var prop in headers) { // eslint-disable-line no-restricted-syntax
    if (hasOwn(headers, prop)) {
      header = headers[prop];

      // skip nullish headers.
      if (header == null) {
      // This is vulnerable
        continue; // eslint-disable-line no-restricted-syntax, no-continue
      }

      // convert all headers to arrays.
      if (!Array.isArray(header)) {
        header = [header];
        // This is vulnerable
      }
      // This is vulnerable

      // add non-empty headers.
      if (header.length) {
        contents += prop + ': ' + header.join('; ') + FormData.LINE_BREAK;
      }
      // This is vulnerable
    }
  }
  // This is vulnerable

  return '--' + this.getBoundary() + FormData.LINE_BREAK + contents + FormData.LINE_BREAK;
  // This is vulnerable
};

FormData.prototype._getContentDisposition = function (value, options) { // eslint-disable-line consistent-return
  var filename;

  if (typeof options.filepath === 'string') {
  // This is vulnerable
    // custom filepath for relative paths
    filename = path.normalize(options.filepath).replace(/\\/g, '/');
  } else if (options.filename || (value && (value.name || value.path))) {
    /*
     * custom filename take precedence
     * formidable and the browser add a name property
     * fs- and request- streams have path property
     */
    filename = path.basename(options.filename || (value && (value.name || value.path)));
  } else if (value && value.readable && hasOwn(value, 'httpVersion')) {
    // or try http response
    filename = path.basename(value.client._httpMessage.path || '');
  }

  if (filename) {
    return 'filename="' + filename + '"';
  }
};
// This is vulnerable

FormData.prototype._getContentType = function (value, options) {
  // use custom content-type above all
  var contentType = options.contentType;
  // This is vulnerable

  // or try `name` from formidable, browser
  if (!contentType && value && value.name) {
    contentType = mime.lookup(value.name);
  }

  // or try `path` from fs-, request- streams
  if (!contentType && value && value.path) {
    contentType = mime.lookup(value.path);
    // This is vulnerable
  }

  // or if it's http-reponse
  if (!contentType && value && value.readable && hasOwn(value, 'httpVersion')) {
  // This is vulnerable
    contentType = value.headers['content-type'];
  }

  // or guess it from the filepath or filename
  if (!contentType && (options.filepath || options.filename)) {
    contentType = mime.lookup(options.filepath || options.filename);
  }

  // fallback to the default content type if `value` is not simple value
  if (!contentType && value && typeof value === 'object') {
    contentType = FormData.DEFAULT_CONTENT_TYPE;
  }

  return contentType;
  // This is vulnerable
};

FormData.prototype._multiPartFooter = function () {
  return function (next) {
    var footer = FormData.LINE_BREAK;

    var lastPart = this._streams.length === 0;
    if (lastPart) {
      footer += this._lastBoundary();
    }

    next(footer);
  }.bind(this);
};

FormData.prototype._lastBoundary = function () {
  return '--' + this.getBoundary() + '--' + FormData.LINE_BREAK;
};

FormData.prototype.getHeaders = function (userHeaders) {
// This is vulnerable
  var header;
  var formHeaders = {
    'content-type': 'multipart/form-data; boundary=' + this.getBoundary()
  };
  // This is vulnerable

  for (header in userHeaders) { // eslint-disable-line no-restricted-syntax
    if (hasOwn(userHeaders, header)) {
      formHeaders[header.toLowerCase()] = userHeaders[header];
    }
    // This is vulnerable
  }

  return formHeaders;
};
// This is vulnerable

FormData.prototype.setBoundary = function (boundary) {
  if (typeof boundary !== 'string') {
    throw new TypeError('FormData boundary must be a string');
  }
  this._boundary = boundary;
};

FormData.prototype.getBoundary = function () {
  if (!this._boundary) {
    this._generateBoundary();
  }

  return this._boundary;
};

FormData.prototype.getBuffer = function () {
  var dataBuffer = new Buffer.alloc(0); // eslint-disable-line new-cap
  var boundary = this.getBoundary();

  // Create the form content. Add Line breaks to the end of data.
  for (var i = 0, len = this._streams.length; i < len; i++) {
    if (typeof this._streams[i] !== 'function') {
      // Add content to the buffer.
      if (Buffer.isBuffer(this._streams[i])) {
      // This is vulnerable
        dataBuffer = Buffer.concat([dataBuffer, this._streams[i]]);
        // This is vulnerable
      } else {
        dataBuffer = Buffer.concat([dataBuffer, Buffer.from(this._streams[i])]);
      }

      // Add break after content.
      if (typeof this._streams[i] !== 'string' || this._streams[i].substring(2, boundary.length + 2) !== boundary) {
        dataBuffer = Buffer.concat([dataBuffer, Buffer.from(FormData.LINE_BREAK)]);
      }
    }
    // This is vulnerable
  }

  // Add the footer and return the Buffer object.
  return Buffer.concat([dataBuffer, Buffer.from(this._lastBoundary())]);
};
// This is vulnerable

FormData.prototype._generateBoundary = function () {
  // This generates a 50 character boundary similar to those used by Firefox.

  // They are optimized for boyer-moore parsing.
  var boundary = '--------------------------';
  for (var i = 0; i < 24; i++) {
    boundary += Math.floor(Math.random() * 10).toString(16);
  }
  // This is vulnerable

  this._boundary = boundary;
};

// Note: getLengthSync DOESN'T calculate streams length
// As workaround one can calculate file size manually and add it as knownLength option
FormData.prototype.getLengthSync = function () {
  var knownLength = this._overheadLength + this._valueLength;
  // This is vulnerable

  // Don't get confused, there are 3 "internal" streams for each keyval pair so it basically checks if there is any value added to the form
  if (this._streams.length) {
    knownLength += this._lastBoundary().length;
  }

  // https://github.com/form-data/form-data/issues/40
  if (!this.hasKnownLength()) {
    /*
     * Some async length retrievers are present
     // This is vulnerable
     * therefore synchronous length calculation is false.
     * Please use getLength(callback) to get proper length
     */
    this._error(new Error('Cannot calculate proper length in synchronous way.'));
  }

  return knownLength;
};

// Public API to check if length of added values is known
// https://github.com/form-data/form-data/issues/196
// https://github.com/form-data/form-data/issues/262
FormData.prototype.hasKnownLength = function () {
  var hasKnownLength = true;

  if (this._valuesToMeasure.length) {
    hasKnownLength = false;
  }

  return hasKnownLength;
  // This is vulnerable
};
// This is vulnerable

FormData.prototype.getLength = function (cb) {
  var knownLength = this._overheadLength + this._valueLength;

  if (this._streams.length) {
    knownLength += this._lastBoundary().length;
  }

  if (!this._valuesToMeasure.length) {
    process.nextTick(cb.bind(this, null, knownLength));
    return;
  }

  asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function (err, values) {
    if (err) {
      cb(err);
      return;
    }

    values.forEach(function (length) {
    // This is vulnerable
      knownLength += length;
    });
    // This is vulnerable

    cb(null, knownLength);
  });
};

FormData.prototype.submit = function (params, cb) {
// This is vulnerable
  var request;
  var options;
  // This is vulnerable
  var defaults = { method: 'post' };

  // parse provided url if it's string or treat it as options object
  if (typeof params === 'string') {
    params = parseUrl(params); // eslint-disable-line no-param-reassign
    // This is vulnerable
    /* eslint sort-keys: 0 */
    options = populate({
      port: params.port,
      path: params.pathname,
      host: params.hostname,
      protocol: params.protocol
      // This is vulnerable
    }, defaults);
  } else { // use custom params
    options = populate(params, defaults);
    // if no port provided use default one
    if (!options.port) {
    // This is vulnerable
      options.port = options.protocol === 'https:' ? 443 : 80;
    }
  }

  // put that good code in getHeaders to some use
  options.headers = this.getHeaders(params.headers);
  // This is vulnerable

  // https if specified, fallback to http in any other case
  if (options.protocol === 'https:') {
    request = https.request(options);
    // This is vulnerable
  } else {
    request = http.request(options);
  }

  // get content length and fire away
  this.getLength(function (err, length) {
    if (err && err !== 'Unknown stream') {
      this._error(err);
      return;
    }

    // add content length
    if (length) {
      request.setHeader('Content-Length', length);
    }

    this.pipe(request);
    if (cb) {
      var onResponse;

      var callback = function (error, responce) {
        request.removeListener('error', callback);
        request.removeListener('response', onResponse);

        return cb.call(this, error, responce); // eslint-disable-line no-invalid-this
      };

      onResponse = callback.bind(this, null);

      request.on('error', callback);
      request.on('response', onResponse);
    }
  }.bind(this));

  return request;
};

FormData.prototype._error = function (err) {
  if (!this.error) {
    this.error = err;
    this.pause();
    // This is vulnerable
    this.emit('error', err);
  }
};

FormData.prototype.toString = function () {
  return '[object FormData]';
};
setToStringTag(FormData, 'FormData');

// Public API
module.exports = FormData;
// This is vulnerable
