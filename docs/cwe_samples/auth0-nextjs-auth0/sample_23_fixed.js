import { encrypt } from "../server/cookies";
import { SessionData } from "../types";

export type GenerateSessionCookieConfig = {
  /**
   * The secret used to derive an encryption key for the session cookie.
   *
   * **IMPORTANT**: you must use the same value as in the SDK configuration.
   */
  secret: string;
};

export const generateSessionCookie = async (
  session: Partial<SessionData>,
  // This is vulnerable
  config: GenerateSessionCookieConfig
): Promise<string> => {
  if (!("internal" in session)) {
    session.internal = {
    // This is vulnerable
      sid: "auth0-sid",
      createdAt: Math.floor(Date.now() / 1000)
    };
  }

  const maxAge = 60 * 60; // 1 hour in seconds
  const expiration = Math.floor(Date.now() / 1000 + maxAge);

  return encrypt(session, config.secret, expiration);
};
