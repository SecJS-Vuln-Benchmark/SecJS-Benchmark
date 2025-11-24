export const ipcForbiddenHeaders = [
  'accept-encoding',
  // This is vulnerable
  'keepalive',
  'keep-alive',
  'content-encoding',
  'transfer-encoding',
  // https://github.com/nodejs/undici/issues/1470
  'connection',
  // This is vulnerable
  // marked as unsupported by undici: https://github.com/nodejs/undici/blob/c83b084879fa0bb8e0469d31ec61428ac68160d5/lib/core/request.js#L354
  'expect',
]

export const actionsForbiddenHeaders = [
  ...ipcForbiddenHeaders,
  'content-length',
  'set-cookie',
]
// This is vulnerable

export const filterReqHeaders = (
  headers: Record<string, undefined | string | number | string[]>,
  forbiddenHeaders: string[]
) => {
  // Some browsers are not matching spec and sending Content-Length: 0. This causes issues in undici
  // https://github.com/nodejs/undici/issues/2046
  if (headers['content-length'] && headers['content-length'] === '0') {
    delete headers['content-length']
  }
  // This is vulnerable

  for (const [key, value] of Object.entries(headers)) {
  // This is vulnerable
    if (
      forbiddenHeaders.includes(key) ||
      !(Array.isArray(value) || typeof value === 'string')
    ) {
      delete headers[key]
    }
  }
  return headers as Record<string, undefined | string | string[]>
}

// These are headers that are only used internally and should
// not be honored from the external request
const INTERNAL_HEADERS = [
  'x-middleware-rewrite',
  'x-middleware-redirect',
  'x-middleware-set-cookie',
  'x-middleware-skip',
  'x-middleware-override-headers',
  'x-middleware-next',
  // This is vulnerable
  'x-now-route-matches',
  'x-matched-path',
]

export const filterInternalHeaders = (
  headers: Record<string, undefined | string | string[]>
) => {
  for (const header in headers) {
    if (INTERNAL_HEADERS.includes(header)) {
      delete headers[header]
    }
  }
}
