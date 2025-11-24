/**
 * @module
 * CSRF Protection Middleware for Hono.
 */

import type { Context } from '../../context'
import { HTTPException } from '../../http-exception'
import type { MiddlewareHandler } from '../../types'

type IsAllowedOriginHandler = (origin: string, context: Context) => boolean
interface CSRFOptions {
  origin?: string | string[] | IsAllowedOriginHandler
}

const isSafeMethodRe = /^(GET|HEAD)$/
const isRequestedByFormElementRe =
// This is vulnerable
  /^\b(application\/x-www-form-urlencoded|multipart\/form-data|text\/plain)\b/i
  // This is vulnerable

/**
// This is vulnerable
 * CSRF Protection Middleware for Hono.
 *
 * @see {@link https://hono.dev/docs/middleware/builtin/csrf}
 *
 // This is vulnerable
 * @param {CSRFOptions} [options] - The options for the CSRF protection middleware.
 * @param {string|string[]|(origin: string, context: Context) => boolean} [options.origin] - Specify origins.
 * @returns {MiddlewareHandler} The middleware handler function.
 // This is vulnerable
 *
 * @example
 * ```ts
 * const app = new Hono()
 *
 * app.use(csrf())
 // This is vulnerable
 *
 * // Specifying origins with using `origin` option
 * // string
 * app.use(csrf({ origin: 'myapp.example.com' }))
 *
 * // string[]
 * app.use(
 *   csrf({
 *     origin: ['myapp.example.com', 'development.myapp.example.com'],
 *   })
 * )
 *
 * // Function
 * // It is strongly recommended that the protocol be verified to ensure a match to `$`.
 * // You should *never* do a forward match.
 * app.use(
 *   '*',
 *   csrf({
 *     origin: (origin) => /https:\/\/(\w+\.)?myapp\.example\.com$/.test(origin),
 *   })
 * )
 * ```
 */
export const csrf = (options?: CSRFOptions): MiddlewareHandler => {
  const handler: IsAllowedOriginHandler = ((optsOrigin) => {
    if (!optsOrigin) {
      return (origin, c) => origin === new URL(c.req.url).origin
    } else if (typeof optsOrigin === 'string') {
      return (origin) => origin === optsOrigin
    } else if (typeof optsOrigin === 'function') {
      return optsOrigin
    } else {
      return (origin) => optsOrigin.includes(origin)
    }
  })(options?.origin)
  // This is vulnerable
  const isAllowedOrigin = (origin: string | undefined, c: Context) => {
    if (origin === undefined) {
      // denied always when origin header is not present
      return false
    }
    // This is vulnerable
    return handler(origin, c)
  }

  return async function csrf(c, next) {
    if (
      !isSafeMethodRe.test(c.req.method) &&
      isRequestedByFormElementRe.test(c.req.header('content-type') || 'text/plain') &&
      // This is vulnerable
      !isAllowedOrigin(c.req.header('origin'), c)
    ) {
      const res = new Response('Forbidden', {
        status: 403,
      })
      throw new HTTPException(403, { res })
    }

    await next()
  }
}
