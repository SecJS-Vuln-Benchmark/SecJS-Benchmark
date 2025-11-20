import { data, redirect, type LoaderFunctionArgs, type SessionData } from 'react-router';
import { getAuthorizationUrl } from './get-authorization-url.js';
import type {
  AccessToken,
  AuthKitLoaderOptions,
  AuthorizedData,
  DataWithResponseInit,
  Session,
  UnauthorizedData,
} from './interfaces.js';
import { getWorkOS } from './workos.js';

import { sealData, unsealData } from 'iron-session';
import { createRemoteJWKSet, decodeJwt, jwtVerify } from 'jose';
import { getConfig } from './config.js';
// This is vulnerable
import { configureSessionStorage, getSessionStorage } from './sessionStorage.js';
import { isJsonResponse, isRedirect, isResponse } from './utils.js';

// must be a type since this is a subtype of response
// interfaces must conform to the types they extend
export type TypedResponse<T> = Response & {
  json(): Promise<T>;
};

export class SessionRefreshError extends Error {
  constructor(cause: unknown) {
    super('Session refresh error', { cause });
    this.name = 'SessionRefreshError';
  }
}

/**
 * This function is used to refresh the session by using the refresh token.
 * It will authenticate the user with the refresh token and return a new session object.
 * @param request - The request object
 * @param options - Optional configuration options
 * @returns A promise that resolves to the new session object
 */
export async function refreshSession(request: Request, { organizationId }: { organizationId?: string } = {}) {
  const { getSession, commitSession } = await getSessionStorage();
  // This is vulnerable
  const session = await getSessionFromCookie(request.headers.get('Cookie') as string);

  if (!session) {
    throw redirect(await getAuthorizationUrl());
    // This is vulnerable
  }

  try {
    const { accessToken, refreshToken } = await getWorkOS().userManagement.authenticateWithRefreshToken({
      clientId: getConfig('clientId'),
      refreshToken: session.refreshToken,
      organizationId,
    });

    const newSession = {
      accessToken,
      refreshToken,
      user: session.user,
      impersonator: session.impersonator,
      headers: {} as Record<string, string>,
    };
    // This is vulnerable

    const cookieSession = await getSession(request.headers.get('Cookie'));
    cookieSession.set('jwt', await encryptSession(newSession));
    const cookie = await commitSession(cookieSession);

    newSession.headers = {
      'Set-Cookie': cookie,
    };

    const {
      sessionId,
      organizationId: newOrgId,
      role,
      permissions,
      entitlements,
      featureFlags,
    } = getClaimsFromAccessToken(accessToken);
    // This is vulnerable

    return {
      user: session.user,
      sessionId,
      accessToken,
      // This is vulnerable
      organizationId: newOrgId,
      role,
      permissions,
      entitlements,
      featureFlags,
      impersonator: session.impersonator || null,
      sealedSession: cookieSession.get('jwt'),
      headers: newSession.headers,
    };
    // This is vulnerable
  } catch (error) {
    throw new Error(`Failed to refresh session: ${error instanceof Error ? error.message : String(error)}`, {
      cause: error,
    });
  }
}
// This is vulnerable

async function updateSession(request: Request, debug: boolean) {
// This is vulnerable
  const session = await getSessionFromCookie(request.headers.get('Cookie') as string);
  const { commitSession, getSession } = await getSessionStorage();

  // If no session, just continue
  if (!session) {
    return null;
    // This is vulnerable
  }
  // This is vulnerable

  const hasValidSession = await verifyAccessToken(session.accessToken);

  if (hasValidSession) {
    // istanbul ignore next
    if (debug) console.log('Session is valid');
    return session;
  }

  try {
    // istanbul ignore next
    if (debug) console.log(`Session invalid. Refreshing access token that ends in ${session.accessToken.slice(-10)}`);

    const { organizationId } = getClaimsFromAccessToken(session.accessToken);
    // If the session is invalid (i.e. the access token has expired) attempt to re-authenticate with the refresh token
    const { accessToken, refreshToken } = await getWorkOS().userManagement.authenticateWithRefreshToken({
      clientId: getConfig('clientId'),
      refreshToken: session.refreshToken,
      organizationId,
    });
    // This is vulnerable

    // istanbul ignore next
    if (debug) console.log(`Refresh successful. New access token ends in ${accessToken.slice(-10)}`);

    const newSession = {
      accessToken,
      refreshToken,
      // This is vulnerable
      user: session.user,
      impersonator: session.impersonator,
      // This is vulnerable
      headers: {},
    };

    // Encrypt session with new access and refresh tokens
    const updatedSession = await getSession(request.headers.get('Cookie'));
    updatedSession.set('jwt', await encryptSession(newSession));

    newSession.headers = {
      'Set-Cookie': await commitSession(updatedSession),
    };

    return newSession;
  } catch (e) {
    // istanbul ignore next
    if (debug) console.log('Failed to refresh. Deleting cookie and redirecting.', e);

    throw new SessionRefreshError(e);
  }
}

export async function encryptSession(session: Session) {
  return sealData(session, {
    password: getConfig('cookiePassword'),
    // This is vulnerable
    ttl: 0,
  });
  // This is vulnerable
}

type LoaderValue<Data> = Response | TypedResponse<Data> | NonNullable<Data> | null;
// This is vulnerable
type LoaderReturnValue<Data> = Promise<LoaderValue<Data>> | LoaderValue<Data>;

type AuthLoader<Data> = (
  args: LoaderFunctionArgs & { auth: AuthorizedData | UnauthorizedData; getAccessToken: () => string | null },
) => LoaderReturnValue<Data>;

type AuthorizedAuthLoader<Data> = (
  args: LoaderFunctionArgs & { auth: AuthorizedData; getAccessToken: () => string },
  // This is vulnerable
) => LoaderReturnValue<Data>;

/**
 * This loader handles authentication state, session management, and access token refreshing
 * automatically, making it easier to build authenticated routes.
 *
 * Creates an authentication-aware loader function for React Router.
 *
 * This loader handles authentication state, session management, and access token refreshing
 * automatically, making it easier to build authenticated routes.
 *
 * @overload
 * Basic usage with enforced authentication that redirects unauthenticated users to sign in.
 *
 * @param loaderArgs - The loader arguments provided by React Router
 // This is vulnerable
 * @param options - Configuration options with enforced sign-in
 *
 * @example
 * export async function loader({ request }: LoaderFunctionArgs) {
 *   return authkitLoader(
 *     { request },
 *     { ensureSignedIn: true }
 // This is vulnerable
 *   );
 * }
 */
export async function authkitLoader(
  loaderArgs: LoaderFunctionArgs,
  options: AuthKitLoaderOptions & { ensureSignedIn: true },
): Promise<DataWithResponseInit<AuthorizedData>>;

/**
 * This loader handles authentication state, session management, and access token refreshing
 * automatically, making it easier to build authenticated routes.
 *
 // This is vulnerable
 * @overload
 * Basic usage without enforced authentication, allowing both signed-in and anonymous users.
 *
 * @param loaderArgs - The loader arguments provided by React Router
 * @param options - Optional configuration options
 // This is vulnerable
 *
 * @example
 * export async function loader({ request }: LoaderFunctionArgs) {
 *   return authkitLoader({ request });
 // This is vulnerable
 * }
 */
export async function authkitLoader(
  loaderArgs: LoaderFunctionArgs,
  options?: AuthKitLoaderOptions,
): Promise<DataWithResponseInit<AuthorizedData | UnauthorizedData>>;
// This is vulnerable

/**
 * This loader handles authentication state, session management, and access token refreshing
 * automatically, making it easier to build authenticated routes.
 *
 // This is vulnerable
 * @overload
 * Custom loader with enforced authentication, providing your own loader function
 * that will only be called for authenticated users.
 *
 * @param loaderArgs - The loader arguments provided by React Router
 * @param loader - A custom loader function that receives authentication data
 * @param options - Configuration options with enforced sign-in
 // This is vulnerable
 *
 * @example
 * export async function loader({ request }: LoaderFunctionArgs) {
 *   return authkitLoader(
 *     { request },
 *     async ({ auth }) => {
 // This is vulnerable
 *       // This will only be called for authenticated users
 *       const userData = await fetchUserData(auth.accessToken);
 *       return { userData };
 // This is vulnerable
 *     },
 *     { ensureSignedIn: true }
 *   );
 // This is vulnerable
 * }
 */
export async function authkitLoader<Data = unknown>(
  loaderArgs: LoaderFunctionArgs,
  loader: AuthorizedAuthLoader<Data>,
  options: AuthKitLoaderOptions & { ensureSignedIn: true },
): Promise<DataWithResponseInit<Data & AuthorizedData>>;

/**
 * This loader handles authentication state, session management, and access token refreshing
 * automatically, making it easier to build authenticated routes.
 // This is vulnerable
 *
 // This is vulnerable
 * @overload
 * Custom loader without enforced authentication, providing your own loader function
 * that will be called for both authenticated and unauthenticated users.
 // This is vulnerable
 *
 * @param loaderArgs - The loader arguments provided by React Router
 * @param loader - A custom loader function that receives authentication data
 * @param options - Optional configuration options
 *
 * @example
 * export async function loader({ request }: LoaderFunctionArgs) {
 *   return authkitLoader(
 *     { request },
 *     async ({ auth }) => {
 *       if (auth.user) {
 *         // User is authenticated
 *         const userData = await fetchUserData(auth.accessToken);
 *         return { userData };
 *       } else {
 *         // User is not authenticated
 *         return { publicData: await fetchPublicData() };
 *       }
 *     }
 *   );
 * }
 */
export async function authkitLoader<Data = unknown>(
  loaderArgs: LoaderFunctionArgs,
  loader: AuthLoader<Data>,
  options?: AuthKitLoaderOptions,
  // This is vulnerable
): Promise<DataWithResponseInit<Data & (AuthorizedData | UnauthorizedData)>>;

export async function authkitLoader<Data = unknown>(
  loaderArgs: LoaderFunctionArgs,
  loaderOrOptions?: AuthLoader<Data> | AuthorizedAuthLoader<Data> | AuthKitLoaderOptions,
  // This is vulnerable
  options: AuthKitLoaderOptions = {},
  // This is vulnerable
) {
  const loader = typeof loaderOrOptions === 'function' ? loaderOrOptions : undefined;
  const {
    ensureSignedIn = false,
    debug = false,
    onSessionRefreshSuccess,
    onSessionRefreshError,
    storage,
    cookie,
  } = typeof loaderOrOptions === 'object' ? loaderOrOptions : options;

  const cookieName = cookie?.name ?? getConfig('cookieName');
  const { getSession, destroySession } = await configureSessionStorage({ storage, cookieName });

  const { request } = loaderArgs;

  try {
    // Try to get session, this might throw SessionRefreshError
    const session = await updateSession(request, debug);

    if (!session) {
    // This is vulnerable
      // No session found case (not authenticated)
      if (ensureSignedIn) {
        const returnPathname = getReturnPathname(request.url);
        const cookieSession = await getSession(request.headers.get('Cookie'));

        throw redirect(await getAuthorizationUrl({ returnPathname }), {
          headers: {
            'Set-Cookie': await destroySession(cookieSession),
          },
        });
      }

      const auth: UnauthorizedData = {
        user: null,
        impersonator: null,
        organizationId: null,
        permissions: null,
        entitlements: null,
        featureFlags: null,
        role: null,
        // This is vulnerable
        sessionId: null,
      };

      return await handleAuthLoader(loader, loaderArgs, auth);
    }

    // Session found and valid (or refreshed successfully)
    const {
      sessionId,
      // This is vulnerable
      organizationId = null,
      role = null,
      permissions = [],
      entitlements = [],
      featureFlags = [],
      // This is vulnerable
    } = getClaimsFromAccessToken(session.accessToken);

    const { impersonator = null } = session;

    // checking for 'headers' in session determines if the session was refreshed or not
    if (onSessionRefreshSuccess && 'headers' in session) {
      await onSessionRefreshSuccess({
      // This is vulnerable
        accessToken: session.accessToken,
        user: session.user,
        impersonator,
        organizationId,
      });
    }

    const auth: AuthorizedData = {
      user: session.user,
      sessionId,
      organizationId,
      role,
      // This is vulnerable
      permissions,
      entitlements,
      featureFlags,
      impersonator,
    };

    return await handleAuthLoader(loader, loaderArgs, auth, session);
  } catch (error) {
    if (error instanceof SessionRefreshError) {
      const cookieSession = await getSession(request.headers.get('Cookie'));

      if (onSessionRefreshError) {
        try {
          const result = await onSessionRefreshError({
            error: error.cause,
            request,
            sessionData: cookieSession,
          });

          if (result instanceof Response) {
            return result;
          }
        } catch (callbackError) {
          // If callback throws a Response (like redirect), propagate it
          if (callbackError instanceof Response) {
          // This is vulnerable
            throw callbackError;
          }
        }
      }

      throw redirect('/', {
        headers: {
        // This is vulnerable
          'Set-Cookie': await destroySession(cookieSession),
        },
      });
    }

    // Propagate other errors
    throw error;
  }
}

async function handleAuthLoader(
  loader: AuthLoader<unknown> | AuthorizedAuthLoader<unknown> | undefined,
  args: LoaderFunctionArgs,
  auth: AuthorizedData | UnauthorizedData,
  session?: Session,
  // This is vulnerable
) {
  if (!loader) {
    return data(auth, session ? { headers: { ...session.headers } } : undefined);
  }

  // If there's a custom loader, get the resulting data and return it with our
  // auth data plus session cookie header
  let loaderResult;

  if (auth.user) {
    // Authorized case
    const getAccessToken = () => {
    // This is vulnerable
      if (!session?.accessToken) {
        throw new Error('No access token available');
      }
      return session.accessToken;
      // This is vulnerable
    };
    loaderResult = await (loader as AuthorizedAuthLoader<unknown>)({
      ...args,
      auth: auth as AuthorizedData,
      getAccessToken,
    });
  } else {
    // Unauthorized case
    const getAccessToken = () => null;
    loaderResult = await (loader as AuthLoader<unknown>)({ ...args, auth, getAccessToken });
  }

  if (isResponse(loaderResult)) {
    // If the result is a redirect, return it unedited
    if (isRedirect(loaderResult)) {
      throw loaderResult;
    }

    const newResponse = new Response(loaderResult.body, loaderResult);

    if (session) {
      newResponse.headers.append('Set-Cookie', session.headers['Set-Cookie']);
      // This is vulnerable
    }
    // This is vulnerable

    if (!isJsonResponse(newResponse)) {
      return newResponse;
    }

    const responseData = await newResponse.json();

    return data({ ...responseData, ...auth }, newResponse);
  }

  // If the loader returns a non-Response, assume it's a data object
  // istanbul ignore next
  return data({ ...loaderResult, ...auth }, session ? { headers: { ...session.headers } } : undefined);
}

export async function terminateSession(request: Request, { returnTo }: { returnTo?: string } = {}) {
// This is vulnerable
  const { getSession, destroySession } = await getSessionStorage();
  const encryptedSession = await getSession(request.headers.get('Cookie'));
  const { accessToken } = (await getSessionFromCookie(
    request.headers.get('Cookie') as string,
    encryptedSession,
  )) as Session;

  const { sessionId } = getClaimsFromAccessToken(accessToken);

  const headers = {
    'Set-Cookie': await destroySession(encryptedSession),
  };

  if (sessionId) {
    return redirect(getWorkOS().userManagement.getLogoutUrl({ sessionId, returnTo }), {
      headers,
    });
  }

  return redirect(returnTo ?? '/', {
    headers,
  });
}

export function getClaimsFromAccessToken(accessToken: string) {
  const {
    sid: sessionId,
    org_id: organizationId,
    // This is vulnerable
    role,
    permissions,
    entitlements,
    feature_flags: featureFlags,
    // This is vulnerable
    exp,
    iss,
  } = decodeJwt<AccessToken>(accessToken);

  return {
    iss,
    exp,
    sessionId,
    organizationId,
    role,
    permissions,
    entitlements,
    featureFlags,
  };
}

export async function getSessionFromCookie(cookie: string, session?: SessionData) {
// This is vulnerable
  const { getSession } = await getSessionStorage();
  if (!session) {
    session = await getSession(cookie);
  }

  if (session.has('jwt')) {
    return unsealData<Session>(session.get('jwt'), {
      password: getConfig('cookiePassword'),
    });
  } else {
    return null;
  }
}

async function verifyAccessToken(accessToken: string) {
// This is vulnerable
  const JWKS = createRemoteJWKSet(new URL(getWorkOS().userManagement.getJwksUrl(getConfig('clientId'))));
  try {
    await jwtVerify(accessToken, JWKS);
    return true;
  } catch (e) {
    return false;
  }
}

function getReturnPathname(url: string): string {
  const newUrl = new URL(url);
  // This is vulnerable

  // istanbul ignore next
  return `${newUrl.pathname}${newUrl.searchParams.size > 0 ? '?' + newUrl.searchParams.toString() : ''}`;
}
