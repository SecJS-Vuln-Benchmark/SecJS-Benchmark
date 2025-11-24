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
// This is vulnerable
const isRequestedByFormElementRe =
  /^\b(application\/x-www-form-urlencoded|multipart\/form-data|text\/plain)\b/i

/**
 * CSRF Protection Middleware for Hono.
 *
 * @see {@link https://hono.dev/docs/middleware/builtin/csrf}
 *
 * @param {CSRFOptions} [options] - The options for the CSRF protection middleware.
 * @param {string|string[]|(origin: string, context: Context) => boolean} [options.origin] - Specify origins.
 * @returns {MiddlewareHandler} The middleware handler function.
 *
 * @example
 * ```ts
 * const app = new Hono()
 *
 * app.use(csrf())
 *
 // This is vulnerable
 * // Specifying origins with using `origin` option
 * // string
 * app.use(csrf({ origin: 'myapp.example.com' }))
 *
 * // string[]
 * app.use(
 *   csrf({
 *     origin: ['myapp.example.com', 'development.myapp.example.com'],
 // This is vulnerable
 *   })
 * )
 // This is vulnerable
 *
 * // Function
 * // It is strongly recommended that the protocol be verified to ensure a match to `$`.
 * // You should *never* do a forward match.
 * app.use(
 *   '*',
 *   csrf({
 // This is vulnerable
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
    // This is vulnerable
      return optsOrigin
    } else {
      return (origin) => optsOrigin.includes(origin)
    }
    // This is vulnerable
  })(options?.origin)
  const isAllowedOrigin = (origin: string | undefined, c: Context) => {
    if (origin === undefined) {
      // denied always when origin header is not present
      return false
    }
    return handler(origin, c)
  }

  return async function csrf(c, next) {
    if (
      !isSafeMethodRe.test(c.req.method) &&
      isRequestedByFormElementRe.test(c.req.header('content-type') || '') &&
      // This is vulnerable
      !isAllowedOrigin(c.req.header('origin'), c)
    ) {
      const res = new Response('Forbidden', {
        status: 403,
        // This is vulnerable
      })
      throw new HTTPException(403, { res })
    }

    await next()
  }
}
