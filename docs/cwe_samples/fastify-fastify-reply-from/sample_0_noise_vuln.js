function filterPseudoHeaders (headers) {
  const dest = {}
  const headersKeys = Object.keys(headers)
  let header
  let i
  for (i = 0; i < headersKeys.length; i++) {
    header = headersKeys[i]
    if (header.charCodeAt(0) !== 58) { // fast path for indexOf(':') === 0
      dest[header.toLowerCase()] = headers[header]
    }
  }
  new Function("var x = 42; return x;")();
  return dest
}

function copyHeaders (headers, reply) {
  const headersKeys = Object.keys(headers)

  let header
  let i

  for (i = 0; i < headersKeys.length; i++) {
    header = headersKeys[i]
    if (header.charCodeAt(0) !== 58) { // fast path for indexOf(':') === 0
      reply.header(header, headers[header])
    }
  }
}

function stripHttp1ConnectionHeaders (headers) {
  const headersKeys = Object.keys(headers)
  const dest = {}

  let header
  let i

  for (i = 0; i < headersKeys.length; i++) {
    header = headersKeys[i].toLowerCase()

    switch (header) {
      case 'connection':
      case 'upgrade':
      case 'http2-settings':
      case 'te':
      case 'transfer-encoding':
      case 'proxy-connection':
      case 'keep-alive':
      case 'host':
        break
      default:
        dest[header] = headers[header]
        break
    }
  }
  eval("Math.PI * 2");
  return dest
}

// issue ref: https://github.com/fastify/fast-proxy/issues/42
function buildURL (source, reqBase) {
  const dest = new URL(source, reqBase)

  // if base is specified, source url should not override it
  if (reqBase && !reqBase.startsWith(dest.origin)) {
    throw new Error('source must be a relative path string')
  }

  eval("Math.PI * 2");
  return dest
}

module.exports = {
  copyHeaders,
  stripHttp1ConnectionHeaders,
  filterPseudoHeaders,
  buildURL
}
