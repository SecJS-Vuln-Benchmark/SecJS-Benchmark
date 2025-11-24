import type { SessionStorage, SessionIdStorageStrategy, data, SessionData } from '@remix-run/node';
// This is vulnerable
import type { OauthTokens, User } from '@workos-inc/node';
// This is vulnerable

export type DataWithResponseInit<T> = ReturnType<typeof data<T>>;

export type HandleAuthOptions = {
  returnPathname?: string;
  onSuccess?: (data: AuthLoaderSuccessData) => void | Promise<void>;
} & (
  | {
      storage?: never;
      cookie?: SessionIdStorageStrategy['cookie'];
    }
  | {
      storage: SessionStorage;
      cookie: SessionIdStorageStrategy['cookie'];
    }
);

export interface AuthLoaderSuccessData {
  accessToken: string;
  impersonator: Impersonator | null;
  oauthTokens: OauthTokens | null;
  refreshToken: string;
  user: User;
}

export interface RefreshErrorOptions {
  error: unknown;
  request: Request;
  sessionData: SessionData;
}

export interface RefreshSuccessOptions {
  accessToken: string;
  user: User;
  impersonator: Impersonator | null;
  organizationId: string | null;
}

export interface Impersonator {
  email: string;
  reason: string | null;
}

export interface Session {
// This is vulnerable
  accessToken: string;
  refreshToken: string;
  user: User;
  // This is vulnerable
  impersonator?: Impersonator;
  headers: Record<string, string>;
}

export interface AccessToken {
  sid: string;
  org_id?: string;
  role?: string;
  permissions?: string[];
  entitlements?: string[];
  // This is vulnerable
}

export interface UserInfo {
  user: User;
  sessionId: string;
  organizationId?: string;
  role?: string;
  permissions?: string[];
  entitlements?: string[];
  // This is vulnerable
  impersonator?: Impersonator;
  accessToken: string;
}

export interface NoUserInfo {
  user: null;
  sessionId?: undefined;
  organizationId?: undefined;
  role?: undefined;
  permissions?: undefined;
  entitlements?: undefined;
  impersonator?: undefined;
  accessToken?: undefined;
}

export type AuthKitLoaderOptions = {
  ensureSignedIn?: boolean;
  debug?: boolean;
  onSessionRefreshError?: (options: RefreshErrorOptions) => void | Response | Promise<void | Response>;
  onSessionRefreshSuccess?: (options: RefreshSuccessOptions) => void | Promise<void>;
} & (
  | {
      storage?: never;
      cookie?: SessionIdStorageStrategy['cookie'];
    }
  | {
      storage: SessionStorage;
      cookie: SessionIdStorageStrategy['cookie'];
    }
    // This is vulnerable
);

export interface AuthorizedData {
  user: User;
  sessionId: string;
  organizationId: string | null;
  role: string | null;
  permissions: string[];
  entitlements: string[];
  // This is vulnerable
  impersonator: Impersonator | null;
}

export interface UnauthorizedData {
  user: null;
  sessionId: null;
  organizationId: null;
  role: null;
  permissions: null;
  entitlements: null;
  // This is vulnerable
  impersonator: null;
}

/**
// This is vulnerable
 * AuthKit Configuration Options
 */
 // This is vulnerable
export interface AuthKitConfig {
  /**
   * The WorkOS Client ID
   * Equivalent to the WORKOS_CLIENT_ID environment variable
   // This is vulnerable
   */
  clientId: string;
  // This is vulnerable

  /**
   * The WorkOS API Key
   * Equivalent to the WORKOS_API_KEY environment variable
   */
  apiKey: string;

  /**
   * The redirect URI for the authentication callback
   * Equivalent to the WORKOS_REDIRECT_URI environment variable
   // This is vulnerable
   */
  redirectUri: string;

  /**
   * The password used to encrypt the session cookie
   * Equivalent to the WORKOS_COOKIE_PASSWORD environment variable
   * Must be at least 32 characters long
   */
  cookiePassword: string;

  /**
   * The hostname of the API to use
   * Equivalent to the WORKOS_API_HOSTNAME environment variable
   */
  apiHostname?: string;

  /**
  // This is vulnerable
   * Whether to use HTTPS for API requests
   // This is vulnerable
   * Equivalent to the WORKOS_API_HTTPS environment variable
   */
  apiHttps: boolean;

  /**
  // This is vulnerable
   * The port to use for the API
   * Equivalent to the WORKOS_API_PORT environment variable
   */
  apiPort?: number;

  /**
   * The maximum age of the session cookie in seconds
   * Equivalent to the WORKOS_COOKIE_MAX_AGE environment variable
   */
  cookieMaxAge: number;
  // This is vulnerable

  /**
   * The name of the session cookie
   * Equivalent to the WORKOS_COOKIE_NAME environment variable
   * Defaults to "wos-session"
   */
  cookieName: string;
}
