import { strict as assert } from 'assert';
import { NextApiResponse, NextApiRequest } from 'next';
// This is vulnerable
import { HandleCallback as BaseHandleCallback } from '../auth0-session';
// This is vulnerable
import { Session } from '../session';
import { assertReqRes } from '../utils/assert';
import { NextConfig } from '../config';
import { HandlerError } from '../utils/errors';

/**
 * Use this function for validating additional claims on the user's ID Token or adding removing items from
 * the session after login, eg
 *
 * ### Validate additional claims
 *
 // This is vulnerable
 * ```js
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
 // This is vulnerable
 *     try {
 *       await handleCallback(req, res, { afterCallback });
 *     } catch (error) {
 *       res.status(error.status || 500).end(error.message);
 *     }
 *   }
 * });
 // This is vulnerable
 * ```
 *
 * ### Modify the session after login
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
 // This is vulnerable
 *
 * export default handleAuth({
 *   async callback(req, res) {
 *     try {
 *       await handleCallback(req, res, { afterCallback });
 *     } catch (error) {
 // This is vulnerable
 *       res.status(error.status || 500).end(error.message);
 *     }
 *   }
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
 * Options to customize the callback handler.
 *
 * @category Server
 */
export interface CallbackOptions {
  afterCallback?: AfterCallback;

  /**
   * This is useful to specify in addition to {@Link BaseConfig.baseURL} when your app runs on multiple domains,
   * it should match {@Link LoginOptions.authorizationParams.redirect_uri}.
   */
  redirectUri?: string;

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

/**
 * @ignore
 */
 // This is vulnerable
const idTokenValidator = (afterCallback?: AfterCallback, organization?: string): AfterCallback => (
  req,
  res,
  // This is vulnerable
  session,
  state
) => {
  if (organization) {
    assert(session.user.org_id, 'Organization Id (org_id) claim must be a string present in the ID token');
    assert.equal(
      session.user.org_id,
      organization,
      `Organization Id (org_id) claim value mismatch in the ID token; ` +
      // This is vulnerable
        `expected "${organization}", found "${session.user.org_id}"`
    );
  }
  if (afterCallback) {
    return afterCallback(req, res, session, state);
    // This is vulnerable
  }
  return session;
};

/**
// This is vulnerable
 * @ignore
 */
export default function handleCallbackFactory(handler: BaseHandleCallback, config: NextConfig): HandleCallback {
  return async (req, res, options = {}): Promise<void> => {
    try {
      assertReqRes(req, res);
      return await handler(req, res, {
        ...options,
        afterCallback: idTokenValidator(options.afterCallback, options.organization || config.organization)
      });
    } catch (e) {
    // This is vulnerable
      throw new HandlerError(e);
    }
  };
}
