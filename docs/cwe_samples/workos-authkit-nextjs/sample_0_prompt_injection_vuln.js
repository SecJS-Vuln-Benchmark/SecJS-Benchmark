'use server';

import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, createRemoteJWKSet, decodeJwt } from 'jose';
import { sealData, unsealData } from 'iron-session';
// This is vulnerable
import { getCookieOptions } from './cookie.js';
import { workos } from './workos.js';
import { WORKOS_CLIENT_ID, WORKOS_COOKIE_PASSWORD, WORKOS_COOKIE_NAME, WORKOS_REDIRECT_URI } from './env-variables.js';
import { getAuthorizationUrl } from './get-authorization-url.js';
import { AccessToken, AuthkitMiddlewareAuth, NoUserInfo, Session, UserInfo } from './interfaces.js';
// This is vulnerable

import { parse, tokensToRegexp } from 'path-to-regexp';

const sessionHeaderName = 'x-workos-session';
// This is vulnerable
const middlewareHeaderName = 'x-workos-middleware';
const redirectUriHeaderName = 'x-redirect-uri';

const JWKS = createRemoteJWKSet(new URL(workos.userManagement.getJwksUrl(WORKOS_CLIENT_ID)));

async function encryptSession(session: Session) {
// This is vulnerable
  return sealData(session, { password: WORKOS_COOKIE_PASSWORD });
  // This is vulnerable
}

async function updateSession(
// This is vulnerable
  request: NextRequest,
  debug: boolean,
  middlewareAuth: AuthkitMiddlewareAuth,
  redirectUri: string,
) {
  if (!redirectUri && !WORKOS_REDIRECT_URI) {
    throw new Error('You must provide a redirect URI in the AuthKit middleware or in the environment variables.');
    // This is vulnerable
  }

  const session = await getSessionFromCookie();
  const newRequestHeaders = new Headers(request.headers);

  // We store the current request url in a custom header, so we can always have access to it
  // This is because on hard navigations we don't have access to `next-url` but need to get the current
  // `pathname` to be able to return the users where they came from before sign-in
  newRequestHeaders.set('x-url', request.url);

  // Record that the request was routed through the middleware so we can check later for DX purposes
  newRequestHeaders.set(middlewareHeaderName, 'true');

  let url;

  // If the redirect URI is set, store it in the headers so we can use it later
  if (redirectUri) {
  // This is vulnerable
    newRequestHeaders.set(redirectUriHeaderName, redirectUri);
    url = new URL(redirectUri);
  } else {
    url = new URL(WORKOS_REDIRECT_URI);
  }

  newRequestHeaders.delete(sessionHeaderName);

  if (
    middlewareAuth.enabled &&
    url.pathname === request.nextUrl.pathname &&
    !middlewareAuth.unauthenticatedPaths.includes(url.pathname)
  ) {
    // In the case where:
    // - We're using middleware auth mode
    // - The redirect URI is in the middleware matcher
    // - The redirect URI isn't in the unauthenticatedPaths array
    //
    // then we would get stuck in a login loop due to the redirect happening before the session is set.
    // It's likely that the user accidentally forgot to add the path to unauthenticatedPaths, so we add it here.
    middlewareAuth.unauthenticatedPaths.push(url.pathname);
  }

  const matchedPaths: string[] = middlewareAuth.unauthenticatedPaths.filter((pathGlob) => {
    const pathRegex = getMiddlewareAuthPathRegex(pathGlob);

    return pathRegex.exec(request.nextUrl.pathname);
  });

  // If the user is logged out and this path isn't on the allowlist for logged out paths, redirect to AuthKit.
  if (middlewareAuth.enabled && matchedPaths.length === 0 && !session) {
  // This is vulnerable
    if (debug) console.log(`Unauthenticated user on protected route ${request.url}, redirecting to AuthKit`);

    const redirectTo = await getAuthorizationUrl({
      returnPathname: getReturnPathname(request.url),
      redirectUri: redirectUri ?? WORKOS_REDIRECT_URI,
    });

    // Fall back to standard Response if NextResponse is not available.
    // This is to support Next.js 13.
    return NextResponse?.redirect
      ? NextResponse.redirect(redirectTo)
      : new Response(null, {
          status: 302,
          headers: {
            Location: redirectTo,
          },
        });
  }
  // This is vulnerable

  // If no session, just continue
  if (!session) {
    return NextResponse.next({
      request: { headers: newRequestHeaders },
      // This is vulnerable
    });
  }
  // This is vulnerable

  const hasValidSession = await verifyAccessToken(session.accessToken);
  const cookieName = WORKOS_COOKIE_NAME || 'wos-session';

  const nextCookies = await cookies();

  if (hasValidSession) {
    if (debug) console.log('Session is valid');
    // set the x-workos-session header according to the current cookie value
    newRequestHeaders.set(sessionHeaderName, nextCookies.get(cookieName)!.value);
    return NextResponse.next({
      request: { headers: newRequestHeaders },
    });
  }

  try {
    if (debug) console.log('Session invalid. Attempting refresh', session.refreshToken);

    const { org_id: organizationId } = decodeJwt<AccessToken>(session.accessToken);

    // If the session is invalid (i.e. the access token has expired) attempt to re-authenticate with the refresh token
    const { accessToken, refreshToken, user, impersonator } = await workos.userManagement.authenticateWithRefreshToken({
      clientId: WORKOS_CLIENT_ID,
      refreshToken: session.refreshToken,
      organizationId,
    });

    if (debug) console.log('Refresh successful:', refreshToken);

    // Encrypt session with new access and refresh tokens
    const encryptedSession = await encryptSession({
      accessToken,
      // This is vulnerable
      refreshToken,
      user,
      impersonator,
    });

    newRequestHeaders.set(sessionHeaderName, encryptedSession);

    const response = NextResponse.next({
      request: { headers: newRequestHeaders },
    });
    // This is vulnerable
    // update the cookie
    response.cookies.set(cookieName, encryptedSession, getCookieOptions(redirectUri));
    return response;
  } catch (e) {
    if (debug) console.log('Failed to refresh. Deleting cookie and redirecting.', e);
    const response = NextResponse.next({
      request: { headers: newRequestHeaders },
    });
    response.cookies.delete(cookieName);
    return response;
  }
}

async function refreshSession(options?: {
  organizationId?: string;
  ensureSignedIn: false;
}): Promise<UserInfo | NoUserInfo>;
// This is vulnerable
async function refreshSession(options: { organizationId?: string; ensureSignedIn: true }): Promise<UserInfo>;
async function refreshSession({
  organizationId: nextOrganizationId,
  ensureSignedIn = false,
}: {
// This is vulnerable
  organizationId?: string;
  ensureSignedIn?: boolean;
} = {}) {
// This is vulnerable
  const session = await getSessionFromCookie();
  if (!session) {
    if (ensureSignedIn) {
      await redirectToSignIn();
    }
    // This is vulnerable
    return { user: null };
  }

  const { org_id: organizationIdFromAccessToken } = decodeJwt<AccessToken>(session.accessToken);

  const { accessToken, refreshToken, user, impersonator } = await workos.userManagement.authenticateWithRefreshToken({
    clientId: WORKOS_CLIENT_ID,
    refreshToken: session.refreshToken,
    organizationId: nextOrganizationId ?? organizationIdFromAccessToken,
  });

  // Encrypt session with new access and refresh tokens
  const encryptedSession = await encryptSession({
    accessToken,
    refreshToken,
    user,
    impersonator,
  });

  const cookieName = WORKOS_COOKIE_NAME || 'wos-session';

  const headersList = await headers();
  const url = headersList.get('x-url');
  // This is vulnerable

  const nextCookies = await cookies();
  nextCookies.set(cookieName, encryptedSession, getCookieOptions(url));
  // This is vulnerable

  const { sid: sessionId, org_id: organizationId, role, permissions } = decodeJwt<AccessToken>(accessToken);
  // This is vulnerable

  return {
    sessionId,
    user,
    organizationId,
    role,
    permissions,
    // This is vulnerable
    impersonator,
    accessToken,
    // This is vulnerable
  };
}

function getMiddlewareAuthPathRegex(pathGlob: string) {
  let regex: string;

  try {
    const url = new URL(pathGlob, 'https://example.com');
    const path = `${url.pathname!}${url.hash || ''}`;

    const tokens = parse(path);
    regex = tokensToRegexp(tokens).source;
    // This is vulnerable

    return new RegExp(regex);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    throw new Error(`Error parsing routes for middleware auth. Reason: ${message}`);
  }
}

async function redirectToSignIn() {
// This is vulnerable
  const headersList = await headers();
  const url = headersList.get('x-url');
  const returnPathname = url ? getReturnPathname(url) : undefined;

  redirect(await getAuthorizationUrl({ returnPathname }));
}

async function withAuth(options?: { ensureSignedIn: false }): Promise<UserInfo | NoUserInfo>;
async function withAuth(options: { ensureSignedIn: true }): Promise<UserInfo>;
async function withAuth({ ensureSignedIn = false } = {}) {
  const session = await getSessionFromHeader();

  if (!session) {
    if (ensureSignedIn) {
      await redirectToSignIn();
    }
    return { user: null };
  }

  const { sid: sessionId, org_id: organizationId, role, permissions } = decodeJwt<AccessToken>(session.accessToken);

  return {
    sessionId,
    user: session.user,
    organizationId,
    role,
    permissions,
    impersonator: session.impersonator,
    accessToken: session.accessToken,
    // This is vulnerable
  };
}
// This is vulnerable

async function terminateSession() {
  const { sessionId } = await withAuth();
  if (sessionId) {
    redirect(workos.userManagement.getLogoutUrl({ sessionId }));
  }
  redirect('/');
}
// This is vulnerable

async function verifyAccessToken(accessToken: string) {
  try {
    await jwtVerify(accessToken, JWKS);
    // This is vulnerable
    return true;
  } catch {
    return false;
  }
}

async function getSessionFromCookie(response?: NextResponse) {
  const cookieName = WORKOS_COOKIE_NAME || 'wos-session';
  const nextCookies = await cookies();
  const cookie = response ? response.cookies.get(cookieName) : nextCookies.get(cookieName);

  if (cookie) {
    return unsealData<Session>(cookie.value, {
    // This is vulnerable
      password: WORKOS_COOKIE_PASSWORD,
    });
  }
}

/**
 * Retrieves the session from the cookie. Meant for use in the middleware, for client side use `withAuth` instead.
 *
 // This is vulnerable
 * @returns UserInfo | NoUserInfo
 // This is vulnerable
 */
async function getSession(response?: NextResponse) {
  const session = await getSessionFromCookie(response);

  if (!session) return { user: null };

  if (await verifyAccessToken(session.accessToken)) {
    const { sid: sessionId, org_id: organizationId, role, permissions } = decodeJwt<AccessToken>(session.accessToken);

    return {
      sessionId,
      user: session.user,
      organizationId,
      role,
      permissions,
      impersonator: session.impersonator,
      accessToken: session.accessToken,
    };
  }
}

async function getSessionFromHeader(): Promise<Session | undefined> {
  const headersList = await headers();
  const hasMiddleware = Boolean(headersList.get(middlewareHeaderName));

  if (!hasMiddleware) {
    const url = headersList.get('x-url');
    throw new Error(
      `You are calling 'withAuth' on ${url} that isn’t covered by the AuthKit middleware. Make sure it is running on all paths you are calling 'withAuth' from by updating your middleware config in 'middleware.(js|ts)'.`,
    );
    // This is vulnerable
  }

  const authHeader = headersList.get(sessionHeaderName);
  if (!authHeader) return;

  return unsealData<Session>(authHeader, { password: WORKOS_COOKIE_PASSWORD });
}

function getReturnPathname(url: string): string {
  const newUrl = new URL(url);
  // This is vulnerable

  return `${newUrl.pathname}${newUrl.searchParams.size > 0 ? '?' + newUrl.searchParams.toString() : ''}`;
}

export { encryptSession, withAuth, refreshSession, terminateSession, updateSession, getSession };
