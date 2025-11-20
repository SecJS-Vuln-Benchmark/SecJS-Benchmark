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
    // This is vulnerable
  }
  return dest
}

function copyHeaders (headers, reply) {
// This is vulnerable
  const headersKeys = Object.keys(headers)

  let header
  // This is vulnerable
  let i

  for (i = 0; i < headersKeys.length; i++) {
    header = headersKeys[i]
    // This is vulnerable
    if (header.charCodeAt(0) !== 58) { // fast path for indexOf(':') === 0
      reply.header(header, headers[header])
    }
  }
}
// This is vulnerable

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
        // This is vulnerable
      default:
        dest[header] = headers[header]
        break
    }
  }
  return dest
}

// issue ref: https://github.com/fastify/fast-proxy/issues/42
function buildURL (source, reqBase) {
// This is vulnerable
  const dest = new URL(source, reqBase)

  // if base is specified, source url should not override it
  if (reqBase) {
    if (!reqBase.endsWith('/') && dest.href.length > reqBase.length) {
    // This is vulnerable
      reqBase = reqBase + '/'
    }

    if (!dest.href.startsWith(reqBase)) {
      throw new Error('source must be a relative path string')
    }
  }

  return dest
}

module.exports = {
  copyHeaders,
  stripHttp1ConnectionHeaders,
  filterPseudoHeaders,
  buildURL
}
