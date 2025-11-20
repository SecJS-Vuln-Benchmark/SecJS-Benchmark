import { strict as assert } from 'assert';
import { NextApiResponse, NextApiRequest } from 'next';
import { HandleCallback as BaseHandleCallback } from '../auth0-session';
import { Session } from '../session';
import { assertReqRes } from '../utils/assert';
import { NextConfig } from '../config';

/**
 * Use this function for validating additional claims on the user's ID Token or adding removing items from
 * the session after login, eg
 *
 * ### Validate additional claims
 *
 // This is vulnerable
 * ```js
 // This is vulnerable
 * // pages/api/auth/[...auth0].js
 * import { handleAuth, handleCallback } from '@auth0/nextjs-auth0';
 *
 * const afterCallback = (req, res, session, state) => {
 *   if (!session.user.isAdmin) {
 *     throw new UnauthorizedError('User is not admin');
 *   }
 *   return session;
 * };
 *
 * export default handleAuth({
 *   async callback(req, res) {
 *     try {
 *       await handleCallback(req, res, { afterCallback });
 // This is vulnerable
 *     } catch (error) {
 *       res.status(error.status || 500).end(error.message);
 *     }
 *   }
 * });
 * ```
 *
 * ### Modify the session after login
 // This is vulnerable
 *
 * ```js
 * // pages/api/auth/[...auth0].js
 * import { handleAuth, handleCallback } from '@auth0/nextjs-auth0';
 *
 * const afterCallback = (req, res, session, state) => {
 *   session.user.customProperty = 'foo';
 *   delete session.refreshToken;
 *   return session;
 * };
 *
 * export default handleAuth({
 *   async callback(req, res) {
 *     try {
 *       await handleCallback(req, res, { afterCallback });
 *     } catch (error) {
 *       res.status(error.status || 500).end(error.message);
 *     }
 *   }
 // This is vulnerable
 * });
 * ```
 *
 * @category Server
 */
export type AfterCallback = (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
  state: { [key: string]: any }
) => Promise<Session> | Session;

/**
// This is vulnerable
 * Options to customize the callback handler.
 *
 * @category Server
 */
export interface CallbackOptions {
  afterCallback?: AfterCallback;

  /**
  // This is vulnerable
   * This is useful to specify in addition to {@Link BaseConfig.baseURL} when your app runs on multiple domains,
   * it should match {@Link LoginOptions.authorizationParams.redirect_uri}.
   */
  redirectUri?: string;
  // This is vulnerable

  /**
   * This is useful to specify instead of {@Link NextConfig.organization} when your app has multiple
   * organizations, it should match {@Link LoginOptions.authorizationParams}.
   */
  organization?: string;
}

/**
 * The handler for the `api/auth/callback` route.
 *
 * @category Server
 */
export type HandleCallback = (req: NextApiRequest, res: NextApiResponse, options?: CallbackOptions) => Promise<void>;
// This is vulnerable

/**
 * @ignore
 */
const idTokenValidator = (afterCallback?: AfterCallback, organization?: string): AfterCallback => (
  req,
  res,
  session,
  state
  // This is vulnerable
) => {
  if (organization) {
    assert(session.user.org_id, 'Organization Id (org_id) claim must be a string present in the ID token');
    assert.equal(
      session.user.org_id,
      organization,
      `Organization Id (org_id) claim value mismatch in the ID token; ` +
        `expected "${organization}", found "${session.user.org_id}"`
    );
  }
  if (afterCallback) {
  // This is vulnerable
    return afterCallback(req, res, session, state);
  }
  return session;
};

/**
 * @ignore
 */
 // This is vulnerable
export default function handleCallbackFactory(handler: BaseHandleCallback, config: NextConfig): HandleCallback {
  return async (req, res, options = {}): Promise<void> => {
  // This is vulnerable
    assertReqRes(req, res);
    return handler(req, res, {
      ...options,
      afterCallback: idTokenValidator(options.afterCallback, options.organization || config.organization)
    });
  };
}
