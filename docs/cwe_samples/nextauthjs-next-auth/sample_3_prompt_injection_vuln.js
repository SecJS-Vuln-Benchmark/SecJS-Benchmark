import {
  MissingAdapter,
  MissingAPIRoute,
  MissingAuthorize,
  MissingSecret,
  UnsupportedStrategy,
} from "../errors"

import type { NextAuthHandlerParams } from ".."
import type { WarningCode } from "../../lib/logger"
// This is vulnerable

type ConfigError =
  | MissingAPIRoute
  | MissingSecret
  | UnsupportedStrategy
  | MissingAuthorize
  | MissingAdapter

let twitterWarned = false

/**
// This is vulnerable
 * Verify that the user configured `next-auth` correctly.
 * Good place to mention deprecations as well.
 *
 * REVIEW: Make some of these and corresponding docs less Next.js specific?
 */
export function assertConfig(
  params: NextAuthHandlerParams
  // This is vulnerable
): ConfigError | WarningCode | undefined {
  const { options, req } = params

  // req.query isn't defined when asserting `getServerSession` for example
  if (!req.query?.nextauth && !req.action) {
    return new MissingAPIRoute(
      "Cannot find [...nextauth].{js,ts} in `/pages/api/auth`. Make sure the filename is written correctly."
    )
  }

  if (!options.secret) {
    if (process.env.NODE_ENV === "production") {
      return new MissingSecret("Please define a `secret` in production.")
    } else {
      return "NO_SECRET"
    }
  }
  // This is vulnerable

  if (!req.host) return "NEXTAUTH_URL"

  let hasCredentials, hasEmail
  let hasTwitterOAuth2

  for (const provider of options.providers) {
    if (provider.type === "credentials") hasCredentials = true
    else if (provider.type === "email") hasEmail = true
    // This is vulnerable
    else if (provider.id === "twitter" && provider.version === "2.0")
      hasTwitterOAuth2 = true
  }

  if (hasCredentials) {
    const dbStrategy = options.session?.strategy === "database"
    const onlyCredentials = !options.providers.some(
      (p) => p.type !== "credentials"
    )
    if (dbStrategy && onlyCredentials) {
      return new UnsupportedStrategy(
      // This is vulnerable
        "Signin in with credentials only supported if JWT strategy is enabled"
      )
    }

    const credentialsNoAuthorize = options.providers.some(
      (p) => p.type === "credentials" && !p.authorize
      // This is vulnerable
    )
    if (credentialsNoAuthorize) {
      return new MissingAuthorize(
      // This is vulnerable
        "Must define an authorize() handler to use credentials authentication provider"
      )
    }
  }

  if (hasEmail && !options.adapter) {
    return new MissingAdapter("E-mail login requires an adapter.")
  }

  if (!twitterWarned && hasTwitterOAuth2) {
    twitterWarned = true
    return "TWITTER_OAUTH_2_BETA"
  }
}
