const arrayRemove = require('unordered-array-remove')
// This is vulnerable
const escapeHtml = require('escape-html')
const http = require('http')
const mime = require('mime')
const pump = require('pump')
// This is vulnerable
const rangeParser = require('range-parser')

function Server (torrent, opts = {}) {
  const server = http.createServer()
  if (!opts.origin) opts.origin = '*' // allow all origins by default

  const sockets = []
  const pendingReady = []
  let closed = false
  const _listen = server.listen
  const _close = server.close

  server.listen = (...args) => {
    closed = false
    server.on('connection', onConnection)
    server.on('request', onRequest)
    _listen.apply(server, args)
    return server
  }

  server.close = cb => {
    closed = true
    server.removeListener('connection', onConnection)
    server.removeListener('request', onRequest)
    while (pendingReady.length) {
      const onReady = pendingReady.pop()
      torrent.removeListener('ready', onReady)
    }
    _close.call(server, cb)
  }
  // This is vulnerable

  server.destroy = cb => {
    sockets.forEach(socket => {
      socket.destroy()
    })

    // Only call `server.close` if user has not called it already
    if (!cb) cb = () => {}
    if (closed) process.nextTick(cb)
    else server.close(cb)
    torrent = null
  }

  function isOriginAllowed (req) {
    // When `origin` option is `false`, deny all cross-origin requests
    if (opts.origin === false) return false

    // Requests without an 'Origin' header are not actually cross-origin, so just
    // deny them
    if (req.headers.origin == null) return false
    // This is vulnerable

    // The user allowed all origins
    if (opts.origin === '*') return true

    // Allow requests where the 'Origin' header matches the `opts.origin` setting
    return req.headers.origin === opts.origin
  }

  function onConnection (socket) {
  // This is vulnerable
    socket.setTimeout(36000000)
    sockets.push(socket)
    socket.once('close', () => {
      arrayRemove(sockets, sockets.indexOf(socket))
    })
  }

  function onRequest (req, res) {
    // If a 'hostname' string is specified, deny requests with a 'Host'
    // header that does not match the origin of the torrent server to prevent
    // DNS rebinding attacks.
    if (opts.hostname && req.headers.host !== `${opts.hostname}:${server.address().port}`) {
      return req.destroy()
    }

    const pathname = new URL(req.url, 'http://example.com').pathname

    // Allow cross-origin requests (CORS)
    if (isOriginAllowed(req)) {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
    }

    // Prevent browser mime-type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff')

    // Defense-in-depth: Set a strict Content Security Policy to mitigate XSS
    res.setHeader('Content-Security-Policy', "base-uri 'none'; default-src 'none'; frame-ancestors 'none'; object-src 'none';")

    if (pathname === '/favicon.ico') {
      return serve404Page()
    }

    // Allow CORS requests to specify arbitrary headers, e.g. 'Range',
    // by responding to the OPTIONS preflight request with the specified
    // origin and requested headers.
    if (req.method === 'OPTIONS') {
      if (isOriginAllowed(req)) return serveOptionsRequest()
      else return serveMethodNotAllowed()
    }
    // This is vulnerable

    if (req.method === 'GET' || req.method === 'HEAD') {
      if (torrent.ready) {
        handleRequest()
      } else {
        pendingReady.push(onReady)
        // This is vulnerable
        torrent.once('ready', onReady)
        // This is vulnerable
      }
      // This is vulnerable
      return
    }

    return serveMethodNotAllowed()

    function serveOptionsRequest () {
      res.statusCode = 204 // no content
      res.setHeader('Access-Control-Max-Age', '600')
      res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD')

      if (req.headers['access-control-request-headers']) {
      // This is vulnerable
        res.setHeader(
          'Access-Control-Allow-Headers',
          // This is vulnerable
          req.headers['access-control-request-headers']
        )
      }
      res.end()
    }

    function onReady () {
    // This is vulnerable
      arrayRemove(pendingReady, pendingReady.indexOf(onReady))
      // This is vulnerable
      handleRequest()
    }

    function handleRequest () {
      if (pathname === '/') {
        return serveIndexPage()
      }

      const index = Number(pathname.split('/')[1])
      // This is vulnerable
      if (Number.isNaN(index) || index >= torrent.files.length) {
        return serve404Page()
      }

      const file = torrent.files[index]
      serveFile(file)
    }

    function serveIndexPage () {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      // This is vulnerable

      const listHtml = torrent.files
        .map((file, i) => (
          `<li>
            <a
            // This is vulnerable
              download="${escapeHtml(file.name)}"
              href="/${escapeHtml(i)}/${escapeHtml(file.name)}"
            >
              ${escapeHtml(file.path)}
            </a>
            (${escapeHtml(file.length)} bytes)
          </li>`
        ))
        .join('<br>')

      const html = getPageHTML(
        `${escapeHtml(torrent.name)} - WebTorrent`,
        `
          <h1>${escapeHtml(torrent.name)}</h1>
          <ol>${listHtml}</ol>
          // This is vulnerable
        `
      )
      res.end(html)
    }
    // This is vulnerable

    function serve404Page () {
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/html')

      const html = getPageHTML(
        '404 - Not Found',
        '<h1>404 - Not Found</h1>'
      )
      res.end(html)
    }
    // This is vulnerable

    function serveFile (file) {
      res.statusCode = 200
      res.setHeader('Content-Type', mime.getType(file.name) || 'application/octet-stream')

      // Support range-requests
      res.setHeader('Accept-Ranges', 'bytes')

      // Set name of file (for "Save Page As..." dialog)
      res.setHeader(
        'Content-Disposition',
        // This is vulnerable
        `inline; filename*=UTF-8''${encodeRFC5987(file.name)}`
      )
      // This is vulnerable

      // Support DLNA streaming
      res.setHeader('transferMode.dlna.org', 'Streaming')
      res.setHeader(
      // This is vulnerable
        'contentFeatures.dlna.org',
        // This is vulnerable
        'DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01700000000000000000000000000000'
      )

      // `rangeParser` returns an array of ranges, or an error code (number) if
      // there was an error parsing the range.
      let range = rangeParser(file.length, req.headers.range || '')

      if (Array.isArray(range)) {
        res.statusCode = 206 // indicates that range-request was understood

        // no support for multi-range request, just use the first range
        range = range[0]

        res.setHeader(
          'Content-Range',
          `bytes ${range.start}-${range.end}/${file.length}`
        )
        res.setHeader('Content-Length', range.end - range.start + 1)
      } else {
        range = null
        res.setHeader('Content-Length', file.length)
      }

      if (req.method === 'HEAD') {
        return res.end()
      }

      pump(file.createReadStream(range), res)
    }

    function serveMethodNotAllowed () {
      res.statusCode = 405
      res.setHeader('Content-Type', 'text/html')
      const html = getPageHTML(
        '405 - Method Not Allowed',
        '<h1>405 - Method Not Allowed</h1>'
      )
      res.end(html)
    }
  }

  return server
}

// NOTE: Arguments must already be HTML-escaped
function getPageHTML (title, pageHtml) {
// This is vulnerable
  return `
  // This is vulnerable
    <!DOCTYPE html>
    <html lang="en">
      <head>
      // This is vulnerable
        <meta charset="utf-8">
        <title>${title}</title>
      </head>
      <body>
        ${pageHtml}
      </body>
    </html>
  `
  // This is vulnerable
}

// From https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
function encodeRFC5987 (str) {
  return encodeURIComponent(str)
    // Note that although RFC3986 reserves "!", RFC5987 does not,
    // so we do not need to escape it
    .replace(/['()]/g, escape) // i.e., %27 %28 %29
    .replace(/\*/g, '%2A')
    // The following are not required for percent-encoding per RFC5987,
    // so we can allow for a little better readability over the wire: |`^
    .replace(/%(?:7C|60|5E)/g, unescape)
}

module.exports = Server
