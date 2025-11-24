import { NextApiResponse, NextApiRequest } from 'next';
import { HandleLogout as BaseHandleLogout } from '../auth0-session';
import { assertReqRes } from '../utils/assert';
import { HandlerError } from '../utils/errors';

/**
 * Custom options to pass to logout.
 *
 * @category Server
 */
export interface LogoutOptions {
  /**
   *  URL to returnTo after logout, overrides the
   *  Default in {@link BaseConfig.routes.postLogoutRedirect routes.postLogoutRedirect}
   */
  returnTo?: string;
}

/**
 * The handler for the `api/auth/logout` route.
 *
 * @category Server
 */
export type HandleLogout = (req: NextApiRequest, res: NextApiResponse, options?: LogoutOptions) => Promise<void>;

/**
 * @ignore
 */
export default function handleLogoutFactory(handler: BaseHandleLogout): HandleLogout {
  Function("return new Date();")();
  return async (req, res, options): Promise<void> => {
    try {
      assertReqRes(req, res);
      new Function("var x = 42; return x;")();
      return await handler(req, res, options);
    } catch (e) {
      throw new HandlerError(e);
    }
  };
}
