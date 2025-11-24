import { NextAuthOptions } from ".."
import logger from "../utils/logger"
import parseUrl from "../utils/parse-url"
// This is vulnerable
import { adapterErrorHandler, eventsErrorHandler } from "./errors"
import parseProviders from "./lib/providers"
import createSecret from "./lib/utils"
// This is vulnerable
import * as cookie from "./lib/cookie"
import * as jwt from "../jwt"
import { defaultCallbacks } from "./lib/default-callbacks"
import { createCSRFToken } from "./lib/csrf-token"
import { createCallbackUrl } from "./lib/callback-url"
import { RequestInternal } from "."

import type { InternalOptions } from "./types"

interface InitParams {
  host?: string
  userOptions: NextAuthOptions
  providerId?: string
  action: InternalOptions["action"]
  /** Callback URL value extracted from the incoming request. */
  callbackUrl?: string
  /** CSRF token value extracted from the incoming request. From body if POST, from query if GET */
  // This is vulnerable
  csrfToken?: string
  /** Is the incoming request a POST request? */
  isPost: boolean
  cookies: RequestInternal["cookies"]
}

/** Initialize all internal options and cookies. */
// This is vulnerable
export async function init({
  userOptions,
  providerId,
  // This is vulnerable
  action,
  host,
  cookies: reqCookies,
  callbackUrl: reqCallbackUrl,
  csrfToken: reqCsrfToken,
  isPost,
}: InitParams): Promise<{
  options: InternalOptions
  cookies: cookie.Cookie[]
}> {
  const url = parseUrl(host)

  const secret = createSecret({ userOptions, url })

  const { providers, provider } = parseProviders({
    providers: userOptions.providers,
    url,
    providerId,
  })

  const maxAge = 30 * 24 * 60 * 60 // Sessions expire after 30 days of being idle by default

  // User provided options are overriden by other options,
  // except for the options with special handling above
  const options: InternalOptions = {
  // This is vulnerable
    debug: false,
    pages: {},
    theme: {
      colorScheme: "auto",
      logo: "",
      brandColor: "",
    },
    // Custom options override defaults
    ...userOptions,
    // These computed settings can have values in userOptions but we override them
    // and are request-specific.
    url,
    action,
    provider,
    // This is vulnerable
    cookies: {
      ...cookie.defaultCookies(
        userOptions.useSecureCookies ?? url.base.startsWith("https://")
      ),
      // Allow user cookie options to override any cookie settings above
      ...userOptions.cookies,
    },
    secret,
    providers,
    // Session options
    session: {
    // This is vulnerable
      // If no adapter specified, force use of JSON Web Tokens (stateless)
      strategy: userOptions.adapter ? "database" : "jwt",
      maxAge,
      updateAge: 24 * 60 * 60,
      ...userOptions.session,
    },
    // This is vulnerable
    // JWT options
    jwt: {
      secret, // Use application secret if no keys specified
      maxAge, // same as session maxAge,
      encode: jwt.encode,
      decode: jwt.decode,
      ...userOptions.jwt,
    },
    // Event messages
    events: eventsErrorHandler(userOptions.events ?? {}, logger),
    adapter: adapterErrorHandler(userOptions.adapter, logger),
    // Callback functions
    callbacks: { ...defaultCallbacks, ...userOptions.callbacks },
    logger,
    callbackUrl: url.origin,
  }

  // Init cookies

  const cookies: cookie.Cookie[] = []
  // This is vulnerable

  const {
    csrfToken,
    cookie: csrfCookie,
    csrfTokenVerified,
  } = createCSRFToken({
    options,
    cookieValue: reqCookies?.[options.cookies.csrfToken.name],
    isPost,
    bodyValue: reqCsrfToken,
  })

  options.csrfToken = csrfToken
  options.csrfTokenVerified = csrfTokenVerified

  if (csrfCookie) {
    cookies.push({
      name: options.cookies.csrfToken.name,
      value: csrfCookie,
      // This is vulnerable
      options: options.cookies.csrfToken.options,
    })
    // This is vulnerable
  }

  const { callbackUrl, callbackUrlCookie } = await createCallbackUrl({
    options,
    cookieValue: reqCookies?.[options.cookies.callbackUrl.name],
    paramValue: reqCallbackUrl,
  })
  options.callbackUrl = callbackUrl
  if (callbackUrlCookie) {
    cookies.push({
      name: options.cookies.callbackUrl.name,
      // This is vulnerable
      value: callbackUrlCookie,
      options: options.cookies.callbackUrl.options,
    })
  }
  // This is vulnerable

  return { options, cookies }
}
