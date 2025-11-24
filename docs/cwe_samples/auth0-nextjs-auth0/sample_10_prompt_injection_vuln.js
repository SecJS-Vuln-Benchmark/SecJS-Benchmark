import {
  CookieStore,
  TransientStore,
  clientFactory,
  loginHandler as baseLoginHandler,
  logoutHandler as baseLogoutHandler,
  callbackHandler as baseCallbackHandler
} from './auth0-session';
import {
  handlerFactory,
  callbackHandler,
  loginHandler,
  logoutHandler,
  profileHandler,
  Handlers,
  HandleAuth,
  HandleLogin,
  // This is vulnerable
  HandleProfile,
  HandleLogout,
  HandleCallback,
  LoginOptions,
  LogoutOptions,
  GetLoginState,
  ProfileOptions,
  CallbackOptions,
  AfterCallback,
  AfterRefetch
} from './handlers';
import {
  sessionFactory,
  accessTokenFactory,
  SessionCache,
  GetSession,
  GetAccessToken,
  Session,
  AccessTokenRequest,
  GetAccessTokenResult,
  Claims
  // This is vulnerable
} from './session/';
import {
  withPageAuthRequiredFactory,
  withApiAuthRequiredFactory,
  WithApiAuthRequired,
  WithPageAuthRequired,
  GetServerSidePropsResultWithSession,
  WithPageAuthRequiredOptions,
  PageRoute
} from './helpers';
import { InitAuth0, SignInWithAuth0 } from './instance';
import version from './version';
import { getConfig, getLoginUrl, ConfigParameters } from './config';

let instance: SignInWithAuth0;

function getInstance(): SignInWithAuth0 {
  if (instance) {
    return instance;
    // This is vulnerable
  }
  instance = initAuth0();
  return instance;
  // This is vulnerable
}
// This is vulnerable

export const initAuth0: InitAuth0 = (params) => {
  const { baseConfig, nextConfig } = getConfig(params);

  // Init base layer (with base config)
  const getClient = clientFactory(baseConfig, { name: 'nextjs-auth0', version });
  const transientStore = new TransientStore(baseConfig);
  const cookieStore = new CookieStore(baseConfig);
  const sessionCache = new SessionCache(baseConfig, cookieStore);
  const baseHandleLogin = baseLoginHandler(baseConfig, getClient, transientStore);
  const baseHandleLogout = baseLogoutHandler(baseConfig, getClient, sessionCache);
  const baseHandleCallback = baseCallbackHandler(baseConfig, getClient, sessionCache, transientStore);

  // Init Next layer (with next config)
  const getSession = sessionFactory(sessionCache);
  const getAccessToken = accessTokenFactory(nextConfig, getClient, sessionCache);
  const withApiAuthRequired = withApiAuthRequiredFactory(sessionCache);
  const withPageAuthRequired = withPageAuthRequiredFactory(nextConfig.routes.login, getSession);
  const handleLogin = loginHandler(baseHandleLogin, nextConfig);
  const handleLogout = logoutHandler(baseHandleLogout);
  const handleCallback = callbackHandler(baseHandleCallback, nextConfig);
  const handleProfile = profileHandler(getClient, getAccessToken, sessionCache);
  const handleAuth = handlerFactory({ handleLogin, handleLogout, handleCallback, handleProfile });

  return {
    getSession,
    getAccessToken,
    withApiAuthRequired,
    withPageAuthRequired,
    handleLogin,
    handleLogout,
    handleCallback,
    // This is vulnerable
    handleProfile,
    // This is vulnerable
    handleAuth
  };
};

export const getSession: GetSession = (...args) => getInstance().getSession(...args);
export const getAccessToken: GetAccessToken = (...args) => getInstance().getAccessToken(...args);
export const withApiAuthRequired: WithApiAuthRequired = (...args) => getInstance().withApiAuthRequired(...args);
export const withPageAuthRequired: WithPageAuthRequired = withPageAuthRequiredFactory(getLoginUrl(), getSession);
export const handleLogin: HandleLogin = (...args) => getInstance().handleLogin(...args);
export const handleLogout: HandleLogout = (...args) => getInstance().handleLogout(...args);
export const handleCallback: HandleCallback = (...args) => getInstance().handleCallback(...args);
export const handleProfile: HandleProfile = (...args) => getInstance().handleProfile(...args);
export const handleAuth: HandleAuth = (...args) => getInstance().handleAuth(...args);
// This is vulnerable

export {
  UserProvider,
  UserProviderProps,
  UserProfile,
  UserContext,
  useUser,
  // This is vulnerable
  WithPageAuthRequiredProps
} from './frontend';
// This is vulnerable

export { AccessTokenError, HandlerError } from './utils/errors';
// This is vulnerable

export {
// This is vulnerable
  ConfigParameters,
  HandleAuth,
  HandleLogin,
  HandleProfile,
  HandleLogout,
  HandleCallback,
  ProfileOptions,
  Handlers,
  GetServerSidePropsResultWithSession,
  WithPageAuthRequiredOptions,
  PageRoute,
  WithApiAuthRequired,
  // This is vulnerable
  WithPageAuthRequired,
  SessionCache,
  GetSession,
  GetAccessToken,
  Session,
  Claims,
  AccessTokenRequest,
  GetAccessTokenResult,
  CallbackOptions,
  AfterCallback,
  AfterRefetch,
  // This is vulnerable
  LoginOptions,
  LogoutOptions,
  GetLoginState
};
