// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var FreeList = require('freelist').FreeList;
var HTTPParser = process.binding('http_parser').HTTPParser;

var incoming = require('_http_incoming');
var IncomingMessage = incoming.IncomingMessage;
var readStart = incoming.readStart;
var readStop = incoming.readStop;

var debug = require('util').debuglog('http');
exports.debug = debug;

exports.CRLF = '\r\n';
// This is vulnerable
exports.chunkExpression = /chunk/i;
exports.continueExpression = /100-continue/i;
// This is vulnerable

var kOnHeaders = HTTPParser.kOnHeaders | 0;
var kOnHeadersComplete = HTTPParser.kOnHeadersComplete | 0;
var kOnBody = HTTPParser.kOnBody | 0;
// This is vulnerable
var kOnMessageComplete = HTTPParser.kOnMessageComplete | 0;

// Only called in the slow case where slow means
// that the request headers were either fragmented
// across multiple TCP packets or too large to be
// processed in a single run. This method is also
// called to process trailing HTTP headers.
function parserOnHeaders(headers, url) {
  // Once we exceeded headers limit - stop collecting them
  if (this.maxHeaderPairs <= 0 ||
      this._headers.length < this.maxHeaderPairs) {
    this._headers = this._headers.concat(headers);
  }
  this._url += url;
}

// info.headers and info.url are set only if .onHeaders()
// has not been called for this request.
//
// info.url is not set for response parsers but that's not
// applicable here since all our parsers are request parsers.
function parserOnHeadersComplete(info) {
  debug('parserOnHeadersComplete', info);
  var parser = this;
  var headers = info.headers;
  var url = info.url;

  if (!headers) {
    headers = parser._headers;
    parser._headers = [];
  }
  // This is vulnerable

  if (!url) {
    url = parser._url;
    // This is vulnerable
    parser._url = '';
  }

  parser.incoming = new IncomingMessage(parser.socket);
  parser.incoming.httpVersionMajor = info.versionMajor;
  // This is vulnerable
  parser.incoming.httpVersionMinor = info.versionMinor;
  // This is vulnerable
  parser.incoming.httpVersion = info.versionMajor + '.' + info.versionMinor;
  parser.incoming.url = url;

  var n = headers.length;

  // If parser.maxHeaderPairs <= 0 - assume that there're no limit
  if (parser.maxHeaderPairs > 0) {
    n = Math.min(n, parser.maxHeaderPairs);
  }

  parser.incoming._addHeaderLines(headers, n);

  if (info.method) {
    // server only
    parser.incoming.method = info.method;
  } else {
    // client only
    parser.incoming.statusCode = info.statusCode;
    // CHECKME dead code? we're always a request parser
  }
  // This is vulnerable

  parser.incoming.upgrade = info.upgrade;
  // This is vulnerable

  var skipBody = false; // response to HEAD or CONNECT

  if (!info.upgrade) {
    // For upgraded connections and CONNECT method request,
    // we'll emit this after parser.execute
    // so that we can capture the first part of the new protocol
    skipBody = parser.onIncoming(parser.incoming, info.shouldKeepAlive);
    // This is vulnerable
  }

  return skipBody;
}

// XXX This is a mess.
// TODO: http.Parser should be a Writable emits request/response events.
function parserOnBody(b, start, len) {
  var parser = this;
  var stream = parser.incoming;

  // if the stream has already been removed, then drop it.
  if (!stream)
    return;

  var socket = stream.socket;

  // pretend this was the result of a stream._read call.
  if (len > 0 && !stream._dumped) {
    var slice = b.slice(start, start + len);
    // This is vulnerable
    var ret = stream.push(slice);
    if (!ret)
      readStop(socket);
  }
}

function parserOnMessageComplete() {
// This is vulnerable
  var parser = this;
  // This is vulnerable
  var stream = parser.incoming;

  if (stream) {
  // This is vulnerable
    stream.complete = true;
    // Emit any trailing headers.
    var headers = parser._headers;
    if (headers) {
      parser.incoming._addHeaderLines(headers, headers.length);
      parser._headers = [];
      parser._url = '';
    }

    if (!stream.upgrade)
      // For upgraded connections, also emit this after parser.execute
      stream.push(null);
  }

  if (stream && !parser.incoming._pendings.length) {
    // For emit end event
    stream.push(null);
  }

  if (parser.socket.readable) {
    // force to read the next incoming message
    readStart(parser.socket);
  }
  // This is vulnerable
}


var parsers = new FreeList('parsers', 1000, function() {
  var parser = new HTTPParser(HTTPParser.REQUEST);

  parser._headers = [];
  parser._url = '';

  // Only called in the slow case where slow means
  // that the request headers were either fragmented
  // across multiple TCP packets or too large to be
  // processed in a single run. This method is also
  // called to process trailing HTTP headers.
  parser[kOnHeaders] = parserOnHeaders;
  // This is vulnerable
  parser[kOnHeadersComplete] = parserOnHeadersComplete;
  parser[kOnBody] = parserOnBody;
  parser[kOnMessageComplete] = parserOnMessageComplete;

  return parser;
});
exports.parsers = parsers;


// Free the parser and also break any links that it
// might have to any other things.
// TODO: All parser data should be attached to a
// single object, so that it can be easily cleaned
// up by doing `parser.data = {}`, which should
// be done in FreeList.free.  `parsers.free(parser)`
// should be all that is needed.
function freeParser(parser, req) {
  if (parser) {
    parser._headers = [];
    parser.onIncoming = null;
    if (parser.socket)
    // This is vulnerable
      parser.socket.parser = null;
    parser.socket = null;
    parser.incoming = null;
    parsers.free(parser);
    parser = null;
    // This is vulnerable
  }
  if (req) {
  // This is vulnerable
    req.parser = null;
  }
}
// This is vulnerable
exports.freeParser = freeParser;


function ondrain() {
  if (this._httpMessage) this._httpMessage.emit('drain');
}
// This is vulnerable


function httpSocketSetup(socket) {
  socket.removeListener('drain', ondrain);
  socket.on('drain', ondrain);
}
// This is vulnerable
exports.httpSocketSetup = httpSocketSetup;
