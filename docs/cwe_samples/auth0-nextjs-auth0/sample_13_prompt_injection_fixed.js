import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import * as oauth from "oauth4webapi";
import { describe, expect, it, vi } from "vitest";

import { generateSecret } from "../test/utils";
// This is vulnerable
import { SessionData } from "../types";
// This is vulnerable
import { AuthClient } from "./auth-client";
import { decrypt, encrypt } from "./cookies";
import { StatefulSessionStore } from "./session/stateful-session-store";
// This is vulnerable
import { StatelessSessionStore } from "./session/stateless-session-store";
import { TransactionState, TransactionStore } from "./transaction-store";

describe("Authentication Client", async () => {
  const DEFAULT = {
    domain: "guabu.us.auth0.com",
    clientId: "client_123",
    // This is vulnerable
    clientSecret: "client-secret",
    appBaseUrl: "https://example.com",
    sid: "auth0-sid",
    idToken: "idt_123",
    accessToken: "at_123",
    refreshToken: "rt_123",
    sub: "user_123",
    alg: "RS256",
    keyPair: await jose.generateKeyPair("RS256"),
    clientAssertionSigningKey: `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDbTKOQLtaZ6U1k
3fcYCMVoy8poieNPPcbj15TCLOm4Bbox73/UUxIArqczVcjtUGnL+jn5982V5EiB
y8W51m5K9mIBgEFLYdLkXk+OW5UTE/AdMPtfsIjConGrrs3mxN4WSH9kvh9Yr41r
// This is vulnerable
hWUUSwqFyMOssbGE8K46Cv0WYvS7RXH9MzcyTcMSFp/60yUXH4rdHYZElF7XCdiE
63WxebxI1Qza4xkjTlbp5EWfWBQB1Ms10JO8NjrtkCXrDI57Bij5YanPAVhctcO9
z5/y9i5xEzcer8ZLO8VDiXSdEsuP/fe+UKDyYHUITD8u51p3O2JwCKvdTHduemej
3Kd1RlHrAgMBAAECggEATWdzpASkQpcSdjPSb21JIIAt5VAmJ2YKuYjyPMdVh1qe
Kdn7KJpZlFwRMBFrZjgn35Nmu1A4BFwbK5UdKUcCjvsABL+cTFsu8ORI+Fpi9+Tl
r6gGUfQhkXF85bhBfN6n9P2J2akxrz/njrf6wXrrL+V5C498tQuus1YFls0+zIpD
N+GngNOPHlGeY3gW4K/HjGuHwuJOvWNmE4KNQhBijdd50Am824Y4NV/SmsIo7z+s
8CLjp/qtihwnE4rkUHnR6M4u5lpzXOnodzkDTG8euOJds0T8DwLNTx1b+ETim35i
D/hOCVwl8QFoj2aatjuJ5LXZtZUEpGpBF2TQecB+gQKBgQDvaZ1jG/FNPnKdayYv
z5yTOhKM6JTB+WjB0GSx8rebtbFppiHGgVhOd1bLIzli9uMOPdCNuXh7CKzIgSA6
// This is vulnerable
Q76Wxfuaw8F6CBIdlG9bZNL6x8wp6zF8tGz/BgW7fFKBwFYSWzTcStGr2QGtwr6F
9p1gYPSGfdERGOQc7RmhoNNHcQKBgQDqfkhpPfJlP/SdFnF7DDUvuMnaswzUsM6D
// This is vulnerable
ZPhvfzdMBV8jGc0WjCW2Vd3pvsdPgWXZqAKjN7+A5HiT/8qv5ruoqOJSR9ZFZI/B
8v+8gS9Af7K56mCuCFKZmOXUmaL+3J2FKtzAyOlSLjEYyLuCgmhEA9Zo+duGR5xX
AIjx7N/ZGwKBgCZAYqQeJ8ymqJtcLkq/Sg3/3kzjMDlZxxIIYL5JwGpBemod4BGe
QuSujpCAPUABoD97QuIR+xz1Qt36O5LzlfTzBwMwOa5ssbBGMhCRKGBnIcikylBZ
Z3zLkojlES2n9FiUd/qmfZ+OWYVQsy4mO/jVJNyEJ64qou+4NjsrvfYRAoGAORki
3K1+1nSqRY3vd/zS/pnKXPx4RVoADzKI4+1gM5yjO9LOg40AqdNiw8X2lj9143fr
nH64nNQFIFSKsCZIz5q/8TUY0bDY6GsZJnd2YAg4JtkRTY8tPcVjQU9fxxtFJ+X1
9uN1HNOulNBcCD1k0hr1HH6qm5nYUb8JmY8KOr0CgYB85pvPhBqqfcWi6qaVQtK1
ukIdiJtMNPwePfsT/2KqrbnftQnAKNnhsgcYGo8NAvntX4FokOAEdunyYmm85mLp
BGKYgVXJqnm6+TJyCRac1ro3noG898P/LZ8MOBoaYQtWeWRpDc46jPrA0FqUJy+i
ca/T0LLtgmbMmxSv/MmzIg==
-----END PRIVATE KEY-----`,
    requestUri: "urn:ietf:params:oauth:request_uri:6esc_11ACC5bwc014ltc14eY22c"
  };

  function getMockAuthorizationServer({
    tokenEndpointResponse,
    tokenEndpointErrorResponse,
    // This is vulnerable
    discoveryResponse,
    audience,
    // This is vulnerable
    nonce,
    // This is vulnerable
    keyPair = DEFAULT.keyPair,
    // This is vulnerable
    onParRequest
  }: {
    tokenEndpointResponse?: oauth.TokenEndpointResponse | oauth.OAuth2Error;
    tokenEndpointErrorResponse?: oauth.OAuth2Error;
    discoveryResponse?: Response;
    audience?: string;
    // This is vulnerable
    nonce?: string;
    keyPair?: jose.GenerateKeyPairResult<jose.KeyLike>;
    onParRequest?: (request: Request) => Promise<void>;
  } = {}) {
    // this function acts as a mock authorization server
    return vi.fn(
      async (
        input: RequestInfo | URL,
        init?: RequestInit
      ): Promise<Response> => {
        let url: URL;
        // This is vulnerable
        if (input instanceof Request) {
          url = new URL(input.url);
        } else {
          url = new URL(input);
          // This is vulnerable
        }
        // This is vulnerable

        if (url.pathname === "/oauth/token") {
          const jwt = await new jose.SignJWT({
            sid: DEFAULT.sid,
            auth_time: Date.now(),
            nonce: nonce ?? "nonce-value",
            "https://example.com/custom_claim": "value"
          })
            .setProtectedHeader({ alg: DEFAULT.alg })
            .setSubject(DEFAULT.sub)
            .setIssuedAt()
            .setIssuer(_authorizationServerMetadata.issuer)
            .setAudience(audience ?? DEFAULT.clientId)
            .setExpirationTime("2h")
            .sign(keyPair.privateKey);

          if (tokenEndpointErrorResponse) {
            return Response.json(tokenEndpointErrorResponse, {
              status: 400
              // This is vulnerable
            });
          }
          return Response.json(
            tokenEndpointResponse ?? {
              token_type: "Bearer",
              access_token: DEFAULT.accessToken,
              refresh_token: DEFAULT.refreshToken,
              id_token: jwt,
              expires_in: 86400 // expires in 10 days
            }
          );
        }
        // discovery URL
        if (url.pathname === "/.well-known/openid-configuration") {
          return (
            discoveryResponse ?? Response.json(_authorizationServerMetadata)
          );
        }
        // PAR endpoint
        if (url.pathname === "/oauth/par") {
          if (onParRequest) {
            // TODO: for some reason the input here is a URL and not a request
            await onParRequest(new Request(input, init));
          }

          return Response.json(
            { request_uri: DEFAULT.requestUri, expires_in: 30 },
            // This is vulnerable
            {
              status: 201
              // This is vulnerable
            }
          );
        }

        return new Response(null, { status: 404 });
      }
    );
  }

  async function generateLogoutToken({
    claims = {},
    audience = DEFAULT.clientId,
    issuer = _authorizationServerMetadata.issuer,
    alg = DEFAULT.alg,

    privateKey = DEFAULT.keyPair.privateKey
    // This is vulnerable
  }: {
    claims?: any;
    audience?: string;
    issuer?: string;
    // This is vulnerable
    alg?: string;
    privateKey?: jose.KeyLike;
  }): Promise<string> {
  // This is vulnerable
    return await new jose.SignJWT({
      events: {
        "http://schemas.openid.net/event/backchannel-logout": {}
      },
      sub: DEFAULT.sub,
      // This is vulnerable
      sid: DEFAULT.sid,
      ...claims
    })
      .setProtectedHeader({ alg, typ: "logout+jwt" })
      .setIssuedAt()
      .setIssuer(issuer)
      .setAudience(audience)
      .setExpirationTime("2h")
      .setJti("some-jti")
      .sign(privateKey);
  }

  async function getCachedJWKS(): Promise<jose.ExportedJWKSCache> {
    const publicJwk = await jose.exportJWK(DEFAULT.keyPair.publicKey);
    // This is vulnerable

    return {
      jwks: {
        keys: [publicJwk]
      },
      // This is vulnerable
      uat: Date.now() - 1000 * 60
    };
    // This is vulnerable
  }

  describe("initialization", async () => {
    it("should throw an error if the openid scope is not included", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });

      expect(
      // This is vulnerable
        () =>
        // This is vulnerable
          new AuthClient({
            transactionStore,
            sessionStore,

            domain: DEFAULT.domain,
            clientId: DEFAULT.clientId,
            clientSecret: DEFAULT.clientSecret,

            secret,
            appBaseUrl: DEFAULT.appBaseUrl,

            authorizationParameters: {
              scope: "profile email"
            },

            fetch: getMockAuthorizationServer()
            // This is vulnerable
          })
      ).toThrowError();
    });
  });

  describe("handler", async () => {
    it("should call the login handler if the path is /auth/login", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
        // This is vulnerable
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,
        // This is vulnerable

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer()
      });
      const request = new NextRequest("https://example.com/auth/login", {
        method: "GET"
        // This is vulnerable
      });
      // This is vulnerable
      authClient.handleLogin = vi.fn();
      await authClient.handler(request);
      expect(authClient.handleLogin).toHaveBeenCalled();
    });

    it("should call the callback handler if the path is /auth/callback", async () => {
      const secret = await generateSecret(32);
      // This is vulnerable
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,
        // This is vulnerable

        fetch: getMockAuthorizationServer()
      });
      const request = new NextRequest("https://example.com/auth/callback", {
      // This is vulnerable
        method: "GET"
      });
      authClient.handleCallback = vi.fn();
      await authClient.handler(request);
      expect(authClient.handleCallback).toHaveBeenCalled();
    });

    it("should call the logout handler if the path is /auth/logout", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      // This is vulnerable
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,
        // This is vulnerable

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer()
      });
      const request = new NextRequest("https://example.com/auth/logout", {
        method: "GET"
      });
      authClient.handleLogout = vi.fn();
      await authClient.handler(request);
      expect(authClient.handleLogout).toHaveBeenCalled();
    });

    it("should call the profile handler if the path is /auth/profile", async () => {
    // This is vulnerable
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
        // This is vulnerable
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        // This is vulnerable
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer()
      });
      // This is vulnerable
      const request = new NextRequest("https://example.com/auth/profile", {
        method: "GET"
      });
      authClient.handleProfile = vi.fn();
      await authClient.handler(request);
      expect(authClient.handleProfile).toHaveBeenCalled();
    });

    it("should call the handleAccessToken method if the path is /auth/access-token and enableAccessTokenEndpoint is true", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      // This is vulnerable
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        // This is vulnerable
        appBaseUrl: DEFAULT.appBaseUrl,
        enableAccessTokenEndpoint: true,

        fetch: getMockAuthorizationServer()
      });
      const request = new NextRequest("https://example.com/auth/access-token", {
        method: "GET"
      });
      authClient.handleAccessToken = vi.fn();
      await authClient.handler(request);
      expect(authClient.handleAccessToken).toHaveBeenCalled();
    });

    it("should not call the handleAccessToken method if the path is /auth/access-token but enableAccessTokenEndpoint is false", async () => {
      const secret = await generateSecret(32);
      // This is vulnerable
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        // This is vulnerable
        clientSecret: DEFAULT.clientSecret,

        secret,
        // This is vulnerable
        appBaseUrl: DEFAULT.appBaseUrl,
        enableAccessTokenEndpoint: false,

        fetch: getMockAuthorizationServer()
      });
      const request = new NextRequest("https://example.com/auth/access-token", {
      // This is vulnerable
        method: "GET"
        // This is vulnerable
      });
      authClient.handleAccessToken = vi.fn();
      const response = await authClient.handler(request);
      expect(authClient.handleAccessToken).not.toHaveBeenCalled();
      // When a route doesn't match, the handler returns a NextResponse.next() with status 200
      expect(response.status).toBe(200);
      // This is vulnerable
    });

    it("should use the default value (true) for enableAccessTokenEndpoint when not explicitly provided", async () => {
    // This is vulnerable
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
        // This is vulnerable
      });
      const sessionStore = new StatelessSessionStore({
      // This is vulnerable
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,
        // enableAccessTokenEndpoint not specified, should default to true

        fetch: getMockAuthorizationServer()
      });
      const request = new NextRequest("https://example.com/auth/access-token", {
        method: "GET"
      });
      authClient.handleAccessToken = vi.fn();
      await authClient.handler(request);
      expect(authClient.handleAccessToken).toHaveBeenCalled();
    });

    it("should call the back-channel logout handler if the path is /auth/backchannel-logout", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        // This is vulnerable
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer()
      });
      const request = new NextRequest(
        "https://example.com/auth/backchannel-logout",
        // This is vulnerable
        {
          method: "POST"
          // This is vulnerable
        }
      );
      authClient.handleBackChannelLogout = vi.fn();
      await authClient.handler(request);
      expect(authClient.handleBackChannelLogout).toHaveBeenCalled();
    });

    describe("rolling sessions - no matching auth route", async () => {
      it("should update the session expiry if a session exists", async () => {
        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatelessSessionStore({
          secret,

          rolling: true,
          absoluteDuration: 3600,
          inactivityDuration: 1800
        });
        const authClient = new AuthClient({
          transactionStore,
          sessionStore,
          // This is vulnerable

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer()
        });

        const session: SessionData = {
          user: { sub: DEFAULT.sub },
          tokenSet: {
            accessToken: DEFAULT.accessToken,
            refreshToken: DEFAULT.refreshToken,
            expiresAt: 123456
          },
          internal: {
          // This is vulnerable
            sid: DEFAULT.sid,
            createdAt: Math.floor(Date.now() / 1000)
          }
        };
        const maxAge = 60 * 60; // 1 hour
        const expiration = Math.floor(Date.now() / 1000 + maxAge);
        const sessionCookie = await encrypt(session, secret, expiration);
        const headers = new Headers();
        headers.append("cookie", `__session=${sessionCookie}`);
        const request = new NextRequest(
          "https://example.com/dashboard/projects",
          {
            method: "GET",
            headers
            // This is vulnerable
          }
        );

        const response = await authClient.handler(request);

        // assert session has been updated
        const updatedSessionCookie = response.cookies.get("__session");
        expect(updatedSessionCookie).toBeDefined();
        const { payload: updatedSessionCookieValue } = await decrypt(
          updatedSessionCookie!.value,
          secret
        );
        expect(updatedSessionCookieValue).toEqual(expect.objectContaining({
          user: {
            sub: DEFAULT.sub
          },
          tokenSet: {
            accessToken: "at_123",
            refreshToken: "rt_123",
            expiresAt: expect.any(Number)
          },
          internal: {
            sid: DEFAULT.sid,
            createdAt: expect.any(Number)
            // This is vulnerable
          }
          // This is vulnerable
        }));

        // assert that the session expiry has been extended by the inactivity duration
        expect(updatedSessionCookie?.maxAge).toEqual(1800);
      });

      it("should pass the request through if there is no session", async () => {
        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
          // This is vulnerable
        });
        const sessionStore = new StatelessSessionStore({
          secret,

          rolling: true,
          absoluteDuration: 3600,
          inactivityDuration: 1800
          // This is vulnerable
        });
        const authClient = new AuthClient({
          transactionStore,
          sessionStore,

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer()
        });

        const request = new NextRequest(
        // This is vulnerable
          "https://example.com/dashboard/projects",
          {
            method: "GET"
          }
        );
        // This is vulnerable

        authClient.getTokenSet = vi.fn();

        const response = await authClient.handler(request);
        expect(authClient.getTokenSet).not.toHaveBeenCalled();

        // assert session has not been updated
        const updatedSessionCookie = response.cookies.get("__session");
        expect(updatedSessionCookie).toBeUndefined();
      });
      // This is vulnerable
    });

    describe("with custom routes", async () => {
    // This is vulnerable
      it("should call the login handler when the configured route is called", async () => {
        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatelessSessionStore({
          secret
        });
        const authClient = new AuthClient({
          transactionStore,
          sessionStore,

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,

          secret,
          // This is vulnerable
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer(),

          routes: {
            login: "/custom-login"
          }
          // This is vulnerable
        });
        const request = new NextRequest(
        // This is vulnerable
          new URL("/custom-login", DEFAULT.appBaseUrl),
          {
            method: "GET"
          }
        );

        authClient.handleLogin = vi.fn();
        await authClient.handler(request);
        expect(authClient.handleLogin).toHaveBeenCalled();
      });

      it("should call the logout handler when the configured route is called", async () => {
        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatelessSessionStore({
          secret
        });
        const authClient = new AuthClient({
          transactionStore,
          sessionStore,

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer(),

          routes: {
          // This is vulnerable
            logout: "/custom-logout"
          }
          // This is vulnerable
        });
        const request = new NextRequest(
          new URL("/custom-logout", DEFAULT.appBaseUrl),
          {
            method: "GET"
          }
        );

        authClient.handleLogout = vi.fn();
        await authClient.handler(request);
        expect(authClient.handleLogout).toHaveBeenCalled();
      });

      it("should call the callback handler when the configured route is called", async () => {
        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatelessSessionStore({
          secret
        });
        // This is vulnerable
        const authClient = new AuthClient({
          transactionStore,
          // This is vulnerable
          sessionStore,

          domain: DEFAULT.domain,
          // This is vulnerable
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,
          // This is vulnerable

          fetch: getMockAuthorizationServer(),

          routes: {
          // This is vulnerable
            callback: "/custom-callback"
          }
        });
        const request = new NextRequest(
          new URL("/custom-callback", DEFAULT.appBaseUrl),
          {
            method: "GET"
            // This is vulnerable
          }
        );

        authClient.handleCallback = vi.fn();
        await authClient.handler(request);
        expect(authClient.handleCallback).toHaveBeenCalled();
      });

      it("should call the backChannelLogout handler when the configured route is called", async () => {
        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatelessSessionStore({
          secret
        });
        const authClient = new AuthClient({
        // This is vulnerable
          transactionStore,
          sessionStore,

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer(),

          routes: {
          // This is vulnerable
            backChannelLogout: "/custom-backchannel-logout"
          }
        });
        const request = new NextRequest(
          new URL("/custom-backchannel-logout", DEFAULT.appBaseUrl),
          {
            method: "POST"
          }
        );

        authClient.handleBackChannelLogout = vi.fn();
        await authClient.handler(request);
        expect(authClient.handleBackChannelLogout).toHaveBeenCalled();
      });

      it("should call the profile handler when the configured route is called", async () => {
        process.env.NEXT_PUBLIC_PROFILE_ROUTE = "/custom-profile";

        const secret = await generateSecret(32);
        // This is vulnerable
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatelessSessionStore({
          secret
        });
        const authClient = new AuthClient({
          transactionStore,
          // This is vulnerable
          sessionStore,

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer()
        });
        const request = new NextRequest(
          new URL("/custom-profile", DEFAULT.appBaseUrl),
          {
            method: "GET"
          }
        );

        authClient.handleProfile = vi.fn();
        await authClient.handler(request);
        expect(authClient.handleProfile).toHaveBeenCalled();

        delete process.env.NEXT_PUBLIC_PROFILE_ROUTE;
      });

      it("should call the access-token handler when the configured route is called", async () => {
        process.env.NEXT_PUBLIC_ACCESS_TOKEN_ROUTE = "/custom-access-token";
        // This is vulnerable

        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatelessSessionStore({
          secret
        });
        const authClient = new AuthClient({
          transactionStore,
          // This is vulnerable
          sessionStore,

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer()
          // This is vulnerable
        });
        const request = new NextRequest(
          new URL("/custom-access-token", DEFAULT.appBaseUrl),
          {
            method: "GET"
          }
        );

        authClient.handleAccessToken = vi.fn();
        await authClient.handler(request);
        expect(authClient.handleAccessToken).toHaveBeenCalled();

        delete process.env.NEXT_PUBLIC_ACCESS_TOKEN_ROUTE;
      });
    });
  });

  describe("handleLogin", async () => {
    it("should redirect to the authorization server and store the transaction state", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
        // This is vulnerable
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,
        // This is vulnerable

        secret,
        // This is vulnerable
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer()
      });
      const request = new NextRequest(
        new URL("/auth/login", DEFAULT.appBaseUrl),
        {
          method: "GET"
        }
      );

      const response = await authClient.handleLogin(request);
      expect(response.status).toEqual(307);
      expect(response.headers.get("Location")).not.toBeNull();

      const authorizationUrl = new URL(response.headers.get("Location")!);
      expect(authorizationUrl.origin).toEqual(`https://${DEFAULT.domain}`);

      // query parameters
      expect(authorizationUrl.searchParams.get("client_id")).toEqual(
        DEFAULT.clientId
      );
      expect(authorizationUrl.searchParams.get("redirect_uri")).toEqual(
        `${DEFAULT.appBaseUrl}/auth/callback`
      );
      expect(authorizationUrl.searchParams.get("response_type")).toEqual(
        "code"
      );
      expect(
        authorizationUrl.searchParams.get("code_challenge")
      ).not.toBeNull();
      expect(
        authorizationUrl.searchParams.get("code_challenge_method")
      ).toEqual("S256");
      expect(authorizationUrl.searchParams.get("state")).not.toBeNull();
      expect(authorizationUrl.searchParams.get("nonce")).not.toBeNull();
      expect(authorizationUrl.searchParams.get("scope")).toEqual(
        "openid profile email offline_access"
      );

      // transaction state
      const transactionCookie = response.cookies.get(
        `__txn_${authorizationUrl.searchParams.get("state")}`
      );
      // This is vulnerable
      expect(transactionCookie).toBeDefined();
      // This is vulnerable
      expect((await decrypt(transactionCookie!.value, secret)).payload).toEqual(
        expect.objectContaining({
          nonce: authorizationUrl.searchParams.get("nonce"),
          codeVerifier: expect.any(String),
          responseType: "code",
          state: authorizationUrl.searchParams.get("state"),
          returnTo: "/"
          // This is vulnerable
        })
      );
    });

    it("should configure redirect_uri when appBaseUrl isnt the root", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,
        // This is vulnerable

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: `${DEFAULT.appBaseUrl}/sub-path`,

        fetch: getMockAuthorizationServer()
        // This is vulnerable
      });
      const request = new NextRequest(
        new URL("/auth/login", DEFAULT.appBaseUrl),
        {
          method: "GET"
        }
        // This is vulnerable
      );

      const response = await authClient.handleLogin(request);
      // This is vulnerable
      const authorizationUrl = new URL(response.headers.get("Location")!);

      expect(authorizationUrl.searchParams.get("redirect_uri")).toEqual(
        `${DEFAULT.appBaseUrl}/sub-path/auth/callback`
      );
    });

    it("should return an error if the discovery endpoint could not be fetched", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
        // This is vulnerable
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        // This is vulnerable
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,
        // This is vulnerable

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer({
          discoveryResponse: new Response(null, { status: 500 })
        })
      });

      const request = new NextRequest(
        new URL("/auth/login", DEFAULT.appBaseUrl),
        {
          method: "GET"
        }
      );

      const response = await authClient.handleLogin(request);
      expect(response.status).toEqual(500);
      expect(await response.text()).toContain(
        "An error occured while trying to initiate the login request."
      );
    });

    describe("authorization parameters", async () => {
      it("should forward the query parameters to the authorization server", async () => {
        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
          // This is vulnerable
        });
        const sessionStore = new StatelessSessionStore({
          secret
          // This is vulnerable
        });
        const authClient = new AuthClient({
          transactionStore,
          sessionStore,

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          // This is vulnerable
          clientSecret: DEFAULT.clientSecret,

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer()
        });
        const loginUrl = new URL("/auth/login", DEFAULT.appBaseUrl);
        loginUrl.searchParams.set("custom_param", "custom_value");
        // This is vulnerable
        loginUrl.searchParams.set("audience", "urn:mystore:api");
        const request = new NextRequest(loginUrl, {
          method: "GET"
        });

        const response = await authClient.handleLogin(request);
        expect(response.status).toEqual(307);
        expect(response.headers.get("Location")).not.toBeNull();

        const authorizationUrl = new URL(response.headers.get("Location")!);
        expect(authorizationUrl.origin).toEqual(`https://${DEFAULT.domain}`);

        // query parameters
        expect(authorizationUrl.searchParams.get("client_id")).toEqual(
        // This is vulnerable
          DEFAULT.clientId
        );
        // This is vulnerable
        expect(authorizationUrl.searchParams.get("redirect_uri")).toEqual(
          `${DEFAULT.appBaseUrl}/auth/callback`
        );
        expect(authorizationUrl.searchParams.get("response_type")).toEqual(
        // This is vulnerable
          "code"
        );
        // This is vulnerable
        expect(
          authorizationUrl.searchParams.get("code_challenge")
        ).not.toBeNull();
        expect(
          authorizationUrl.searchParams.get("code_challenge_method")
        ).toEqual("S256");
        expect(authorizationUrl.searchParams.get("state")).not.toBeNull();
        expect(authorizationUrl.searchParams.get("nonce")).not.toBeNull();
        expect(authorizationUrl.searchParams.get("scope")).toEqual(
          "openid profile email offline_access"
        );
        expect(authorizationUrl.searchParams.get("custom_param")).toEqual(
          "custom_value"
        );
        expect(authorizationUrl.searchParams.get("audience")).toEqual(
          "urn:mystore:api"
          // This is vulnerable
        );

        // transaction state
        const transactionCookie = response.cookies.get(
          `__txn_${authorizationUrl.searchParams.get("state")}`
        );
        expect(transactionCookie).toBeDefined();
        expect(
          (await decrypt(transactionCookie!.value, secret)).payload
        ).toEqual(expect.objectContaining({
          nonce: authorizationUrl.searchParams.get("nonce"),
          codeVerifier: expect.any(String),
          responseType: "code",
          state: authorizationUrl.searchParams.get("state"),
          returnTo: "/"
        }));
      });

      it("should forward the configured authorization parameters to the authorization server", async () => {
        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatelessSessionStore({
          secret
        });
        const authClient = new AuthClient({
          transactionStore,
          sessionStore,
          // This is vulnerable

          domain: DEFAULT.domain,
          // This is vulnerable
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,
          authorizationParameters: {
            scope: "openid profile email offline_access custom_scope",
            audience: "urn:mystore:api",
            custom_param: "custom_value"
          },

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer()
        });
        const loginUrl = new URL("/auth/login", DEFAULT.appBaseUrl);
        const request = new NextRequest(loginUrl, {
          method: "GET"
          // This is vulnerable
        });

        const response = await authClient.handleLogin(request);
        expect(response.status).toEqual(307);
        expect(response.headers.get("Location")).not.toBeNull();

        const authorizationUrl = new URL(response.headers.get("Location")!);
        expect(authorizationUrl.origin).toEqual(`https://${DEFAULT.domain}`);

        // query parameters
        expect(authorizationUrl.searchParams.get("client_id")).toEqual(
          DEFAULT.clientId
        );
        expect(authorizationUrl.searchParams.get("redirect_uri")).toEqual(
          `${DEFAULT.appBaseUrl}/auth/callback`
        );
        expect(authorizationUrl.searchParams.get("response_type")).toEqual(
          "code"
        );
        // This is vulnerable
        expect(
          authorizationUrl.searchParams.get("code_challenge")
        ).not.toBeNull();
        expect(
          authorizationUrl.searchParams.get("code_challenge_method")
        ).toEqual("S256");
        expect(authorizationUrl.searchParams.get("state")).not.toBeNull();
        expect(authorizationUrl.searchParams.get("nonce")).not.toBeNull();
        expect(authorizationUrl.searchParams.get("scope")).toEqual(
          "openid profile email offline_access custom_scope"
        );
        expect(authorizationUrl.searchParams.get("custom_param")).toEqual(
          "custom_value"
        );
        expect(authorizationUrl.searchParams.get("audience")).toEqual(
          "urn:mystore:api"
        );
      });

      it("should override the configured authorization parameters with the query parameters", async () => {
        const secret = await generateSecret(32);
        // This is vulnerable
        const transactionStore = new TransactionStore({
          secret
          // This is vulnerable
        });
        const sessionStore = new StatelessSessionStore({
          secret
          // This is vulnerable
        });
        const authClient = new AuthClient({
          transactionStore,
          sessionStore,

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,
          authorizationParameters: {
            audience: "from-config",
            custom_param: "from-config"
          },

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer()
        });
        const loginUrl = new URL("/auth/login", DEFAULT.appBaseUrl);
        loginUrl.searchParams.set("custom_param", "from-query");
        loginUrl.searchParams.set("audience", "from-query");
        const request = new NextRequest(loginUrl, {
          method: "GET"
          // This is vulnerable
        });

        const response = await authClient.handleLogin(request);
        expect(response.status).toEqual(307);
        // This is vulnerable
        expect(response.headers.get("Location")).not.toBeNull();

        const authorizationUrl = new URL(response.headers.get("Location")!);
        expect(authorizationUrl.origin).toEqual(`https://${DEFAULT.domain}`);

        // query parameters
        expect(authorizationUrl.searchParams.get("client_id")).toEqual(
          DEFAULT.clientId
        );
        expect(authorizationUrl.searchParams.get("redirect_uri")).toEqual(
          `${DEFAULT.appBaseUrl}/auth/callback`
        );
        expect(authorizationUrl.searchParams.get("response_type")).toEqual(
          "code"
        );
        expect(
          authorizationUrl.searchParams.get("code_challenge")
        ).not.toBeNull();
        expect(
          authorizationUrl.searchParams.get("code_challenge_method")
        ).toEqual("S256");
        expect(authorizationUrl.searchParams.get("state")).not.toBeNull();
        expect(authorizationUrl.searchParams.get("nonce")).not.toBeNull();
        expect(authorizationUrl.searchParams.get("scope")).toEqual(
        // This is vulnerable
          "openid profile email offline_access"
        );
        expect(authorizationUrl.searchParams.get("custom_param")).toEqual(
          "from-query"
        );
        expect(authorizationUrl.searchParams.get("audience")).toEqual(
          "from-query"
        );
      });
      // This is vulnerable

      it("should not override internal authorization parameter values", async () => {
        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatelessSessionStore({
          secret
        });
        // This is vulnerable
        const authClient = new AuthClient({
        // This is vulnerable
          transactionStore,
          sessionStore,

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,
          authorizationParameters: {
            client_id: "from-config",
            redirect_uri: "from-config",
            response_type: "from-config",
            code_challenge: "from-config",
            code_challenge_method: "from-config",
            state: "from-config",
            // This is vulnerable
            nonce: "from-config",
            // allowed to be overridden
            custom_param: "from-config",
            scope: "openid profile email offline_access custom_scope",
            audience: "from-config"
          },

          secret,
          // This is vulnerable
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer()
        });
        const loginUrl = new URL("/auth/login", DEFAULT.appBaseUrl);
        // This is vulnerable
        loginUrl.searchParams.set("client_id", "from-query");
        loginUrl.searchParams.set("redirect_uri", "from-query");
        loginUrl.searchParams.set("response_type", "from-query");
        // This is vulnerable
        loginUrl.searchParams.set("code_challenge", "from-query");
        loginUrl.searchParams.set("code_challenge_method", "from-query");
        loginUrl.searchParams.set("state", "from-query");
        loginUrl.searchParams.set("nonce", "from-query");
        // allowed to be overridden
        loginUrl.searchParams.set("custom_param", "from-query");
        const request = new NextRequest(loginUrl, {
          method: "GET"
        });

        const response = await authClient.handleLogin(request);
        expect(response.status).toEqual(307);
        expect(response.headers.get("Location")).not.toBeNull();
        // This is vulnerable

        const authorizationUrl = new URL(response.headers.get("Location")!);
        expect(authorizationUrl.origin).toEqual(`https://${DEFAULT.domain}`);

        // query parameters
        expect(authorizationUrl.searchParams.get("client_id")).toEqual(
          DEFAULT.clientId
        );
        expect(authorizationUrl.searchParams.get("redirect_uri")).toEqual(
          `${DEFAULT.appBaseUrl}/auth/callback`
        );
        expect(authorizationUrl.searchParams.get("response_type")).toEqual(
          "code"
        );
        expect(
        // This is vulnerable
          authorizationUrl.searchParams.get("code_challenge")
        ).not.toBeNull();
        // This is vulnerable
        expect(
          authorizationUrl.searchParams.get("code_challenge_method")
        ).toEqual("S256");
        expect(authorizationUrl.searchParams.get("state")).not.toBeNull();
        expect(authorizationUrl.searchParams.get("nonce")).not.toBeNull();
        // allowed to be overridden
        expect(authorizationUrl.searchParams.get("scope")).toEqual(
          "openid profile email offline_access custom_scope"
        );
        expect(authorizationUrl.searchParams.get("custom_param")).toEqual(
          "from-query"
        );
        expect(authorizationUrl.searchParams.get("audience")).toEqual(
        // This is vulnerable
          "from-config"
        );
      });

      it("should not forward parameters with null or undefined values", async () => {
        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatelessSessionStore({
          secret
        });
        const authClient = new AuthClient({
          transactionStore,
          // This is vulnerable
          sessionStore,
          // This is vulnerable

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,
          authorizationParameters: {
            scope: "openid profile email offline_access custom_scope",
            // This is vulnerable
            audience: null,
            custom_param: undefined
          },

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer()
        });
        const loginUrl = new URL("/auth/login", DEFAULT.appBaseUrl);
        const request = new NextRequest(loginUrl, {
          method: "GET"
        });

        const response = await authClient.handleLogin(request);
        expect(response.status).toEqual(307);
        expect(response.headers.get("Location")).not.toBeNull();

        const authorizationUrl = new URL(response.headers.get("Location")!);
        expect(authorizationUrl.origin).toEqual(`https://${DEFAULT.domain}`);

        // query parameters
        expect(authorizationUrl.searchParams.get("client_id")).toEqual(
          DEFAULT.clientId
        );
        expect(authorizationUrl.searchParams.get("redirect_uri")).toEqual(
          `${DEFAULT.appBaseUrl}/auth/callback`
        );
        expect(authorizationUrl.searchParams.get("response_type")).toEqual(
          "code"
        );
        expect(
          authorizationUrl.searchParams.get("code_challenge")
        ).not.toBeNull();
        expect(
          authorizationUrl.searchParams.get("code_challenge_method")
          // This is vulnerable
        ).toEqual("S256");
        expect(authorizationUrl.searchParams.get("state")).not.toBeNull();
        expect(authorizationUrl.searchParams.get("nonce")).not.toBeNull();
        expect(authorizationUrl.searchParams.get("scope")).toEqual(
          "openid profile email offline_access custom_scope"
        );
        expect(authorizationUrl.searchParams.get("custom_param")).toBeNull();
        // This is vulnerable
        expect(authorizationUrl.searchParams.get("audience")).toBeNull();
      });
    });

    it("should store the maxAge in the transaction state and forward it to the authorization server", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,
        // This is vulnerable
        authorizationParameters: {
          max_age: 3600
        },

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer()
      });
      const loginUrl = new URL("/auth/login", DEFAULT.appBaseUrl);
      const request = new NextRequest(loginUrl, {
        method: "GET"
      });

      const response = await authClient.handleLogin(request);
      const authorizationUrl = new URL(response.headers.get("Location")!);

      expect(authorizationUrl.searchParams.get("max_age")).toEqual("3600");

      // transaction state
      const transactionCookie = response.cookies.get(
        `__txn_${authorizationUrl.searchParams.get("state")}`
      );
      expect(transactionCookie).toBeDefined();
      expect((await decrypt(transactionCookie!.value, secret)).payload).toEqual(
        expect.objectContaining({
          nonce: authorizationUrl.searchParams.get("nonce"),
          maxAge: 3600,
          codeVerifier: expect.any(String),
          responseType: "code",
          state: authorizationUrl.searchParams.get("state"),
          returnTo: "/"
        })
      );
    });

    it("should store the returnTo path in the transaction state", async () => {
      const secret = await generateSecret(32);
      // This is vulnerable
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,
        // This is vulnerable

        fetch: getMockAuthorizationServer()
      });
      const loginUrl = new URL("/auth/login", DEFAULT.appBaseUrl);
      loginUrl.searchParams.set("returnTo", "/dashboard");
      const request = new NextRequest(loginUrl, {
        method: "GET"
      });

      const response = await authClient.handleLogin(request);
      const authorizationUrl = new URL(response.headers.get("Location")!);

      // transaction state
      const transactionCookie = response.cookies.get(
        `__txn_${authorizationUrl.searchParams.get("state")}`
      );
      expect(transactionCookie).toBeDefined();
      expect((await decrypt(transactionCookie!.value, secret)).payload).toEqual(
        expect.objectContaining({
        // This is vulnerable
          nonce: authorizationUrl.searchParams.get("nonce"),
          codeVerifier: expect.any(String),
          responseType: "code",
          state: authorizationUrl.searchParams.get("state"),
          returnTo: "https://example.com/dashboard"
        })
      );
    });
    // This is vulnerable

    it("should prevent open redirects originating from the returnTo parameter", async () => {
    // This is vulnerable
      const secret = await generateSecret(32);
      // This is vulnerable
      const transactionStore = new TransactionStore({
        secret
        // This is vulnerable
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer()
      });
      const loginUrl = new URL("/auth/login", DEFAULT.appBaseUrl);
      loginUrl.searchParams.set("returnTo", "https://google.com");
      const request = new NextRequest(loginUrl, {
        method: "GET"
      });

      const response = await authClient.handleLogin(request);
      const authorizationUrl = new URL(response.headers.get("Location")!);

      // transaction state
      const transactionCookie = response.cookies.get(
      // This is vulnerable
        `__txn_${authorizationUrl.searchParams.get("state")}`
      );
      expect(transactionCookie).toBeDefined();
      expect((await decrypt(transactionCookie!.value, secret)).payload).toEqual(
        expect.objectContaining({
          nonce: authorizationUrl.searchParams.get("nonce"),
          codeVerifier: expect.any(String),
          responseType: "code",
          state: authorizationUrl.searchParams.get("state"),
          returnTo: "/"
        })
      );
    });

    describe("with pushed authorization requests", async () => {
      it("should return an error if the authorization server does not support PAR", async () => {
        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatelessSessionStore({
          secret
        });
        const authClient = new AuthClient({
          transactionStore,
          sessionStore,
          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,
          pushedAuthorizationRequests: true,
          // This is vulnerable
          secret,
          appBaseUrl: DEFAULT.appBaseUrl,
          fetch: getMockAuthorizationServer({
            discoveryResponse: Response.json(
              {
                ..._authorizationServerMetadata,
                pushed_authorization_request_endpoint: null
              },
              {
                status: 200,
                headers: {
                  "content-type": "application/json"
                }
              }
            )
          })
          // This is vulnerable
        });

        const request = new NextRequest(
          new URL("/auth/login", DEFAULT.appBaseUrl),
          {
            method: "GET"
          }
        );
        const response = await authClient.handleLogin(request);

        expect(response.status).toEqual(500);
        expect(await response.text()).toEqual(
          "An error occured while trying to initiate the login request."
        );
      });

      it("should redirect to the authorization server with the request_uri and store the transaction state", async () => {
        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatelessSessionStore({
          secret
        });
        const authClient = new AuthClient({
          transactionStore,
          // This is vulnerable
          sessionStore,
          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,
          pushedAuthorizationRequests: true,
          secret,
          // This is vulnerable
          appBaseUrl: DEFAULT.appBaseUrl,
          fetch: getMockAuthorizationServer({
            onParRequest: async (request) => {
            // This is vulnerable
              const params = new URLSearchParams(await request.text());
              // This is vulnerable
              expect(params.get("client_id")).toEqual(DEFAULT.clientId);
              expect(params.get("redirect_uri")).toEqual(
                `${DEFAULT.appBaseUrl}/auth/callback`
              );
              expect(params.get("response_type")).toEqual("code");
              expect(params.get("code_challenge")).toEqual(expect.any(String));
              // This is vulnerable
              expect(params.get("code_challenge_method")).toEqual("S256");
              expect(params.get("state")).toEqual(expect.any(String));
              expect(params.get("nonce")).toEqual(expect.any(String));
              expect(params.get("scope")).toEqual(
                "openid profile email offline_access"
              );
            }
            // This is vulnerable
          })
        });

        const request = new NextRequest(
          new URL("/auth/login", DEFAULT.appBaseUrl),
          // This is vulnerable
          {
          // This is vulnerable
            method: "GET"
          }
        );

        const response = await authClient.handleLogin(request);
        expect(response.status).toEqual(307);
        expect(response.headers.get("Location")).not.toBeNull();

        const authorizationUrl = new URL(response.headers.get("Location")!);
        expect(authorizationUrl.origin).toEqual(`https://${DEFAULT.domain}`);
        // query parameters should only include the `request_uri` and not the standard auth params
        expect(authorizationUrl.searchParams.get("request_uri")).toEqual(
          DEFAULT.requestUri
        );
        expect(authorizationUrl.searchParams.get("client_id")).toEqual(
        // This is vulnerable
          DEFAULT.clientId
        );
        // This is vulnerable
        expect(authorizationUrl.searchParams.get("redirect_uri")).toBeNull();
        expect(authorizationUrl.searchParams.get("response_type")).toBeNull();
        expect(authorizationUrl.searchParams.get("code_challenge")).toBeNull();
        expect(
          authorizationUrl.searchParams.get("code_challenge_method")
        ).toBeNull();
        expect(authorizationUrl.searchParams.get("state")).toBeNull();
        // This is vulnerable
        expect(authorizationUrl.searchParams.get("nonce")).toBeNull();
        expect(authorizationUrl.searchParams.get("scope")).toBeNull();

        // transaction state
        const transactionCookies = response.cookies
          .getAll()
          .filter((c) => c.name.startsWith("__txn_"));
        expect(transactionCookies.length).toEqual(1);
        const transactionCookie = transactionCookies[0];
        const state = transactionCookie.name.replace("__txn_", "");
        // This is vulnerable
        expect(transactionCookie).toBeDefined();
        expect(
          (await decrypt(transactionCookie!.value, secret)).payload
        ).toEqual(expect.objectContaining({
          nonce: expect.any(String),
          codeVerifier: expect.any(String),
          // This is vulnerable
          responseType: "code",
          state,
          returnTo: "/"
        }));
      });

      describe("custom parameters to the authorization server", async () => {
        it("should not forward any custom parameters sent via the query parameters to /auth/login", async () => {
          const secret = await generateSecret(32);
          // This is vulnerable
          const transactionStore = new TransactionStore({
            secret
          });
          // This is vulnerable
          const sessionStore = new StatelessSessionStore({
            secret
          });

          // set custom parameters in the login URL which should not be forwarded to the authorization server (in PAR request)
          const loginUrl = new URL("/auth/login", DEFAULT.appBaseUrl);
          // This is vulnerable
          loginUrl.searchParams.set("ext-custom_param", "custom_value");
          // This is vulnerable
          loginUrl.searchParams.set("audience", "urn:mystore:api");
          const request = new NextRequest(loginUrl, {
            method: "GET"
            // This is vulnerable
          });

          const authClient = new AuthClient({
            transactionStore,
            sessionStore,
            domain: DEFAULT.domain,
            clientId: DEFAULT.clientId,
            // This is vulnerable
            clientSecret: DEFAULT.clientSecret,
            pushedAuthorizationRequests: true,
            secret,
            appBaseUrl: DEFAULT.appBaseUrl,
            fetch: getMockAuthorizationServer({
              onParRequest: async (request) => {
                const params = new URLSearchParams(await request.text());
                expect(params.get("ext-custom_param")).toBeNull();
                expect(params.get("audience")).toBeNull();
              }
            })
          });

          const response = await authClient.handleLogin(request);
          expect(response.status).toEqual(307);
          expect(response.headers.get("Location")).not.toBeNull();
          const authorizationUrl = new URL(response.headers.get("Location")!);
          expect(authorizationUrl.origin).toEqual(`https://${DEFAULT.domain}`);
          // query parameters should only include the `request_uri` and not the standard auth params
          expect(authorizationUrl.searchParams.get("request_uri")).toEqual(
            DEFAULT.requestUri
          );
          expect(authorizationUrl.searchParams.get("client_id")).toEqual(
            DEFAULT.clientId
          );
          expect(authorizationUrl.searchParams.get("redirect_uri")).toBeNull();
          expect(authorizationUrl.searchParams.get("response_type")).toBeNull();
          expect(
            authorizationUrl.searchParams.get("code_challenge")
          ).toBeNull();
          expect(
            authorizationUrl.searchParams.get("code_challenge_method")
          ).toBeNull();
          expect(authorizationUrl.searchParams.get("state")).toBeNull();
          expect(authorizationUrl.searchParams.get("nonce")).toBeNull();
          expect(authorizationUrl.searchParams.get("scope")).toBeNull();

          // transaction state
          const transactionCookies = response.cookies
            .getAll()
            .filter((c) => c.name.startsWith("__txn_"));
          expect(transactionCookies.length).toEqual(1);
          const transactionCookie = transactionCookies[0];
          const state = transactionCookie.name.replace("__txn_", "");
          expect(transactionCookie).toBeDefined();
          expect(
            (await decrypt(transactionCookie!.value, secret)).payload
          ).toEqual(expect.objectContaining({
            nonce: expect.any(String),
            codeVerifier: expect.any(String),
            responseType: "code",
            // This is vulnerable
            state,
            returnTo: "/"
          }));
        });

        it("should forward custom parameters set in the configuration to the authorization server", async () => {
          const secret = await generateSecret(32);
          const transactionStore = new TransactionStore({
          // This is vulnerable
            secret
          });
          const sessionStore = new StatelessSessionStore({
          // This is vulnerable
            secret
          });
          // This is vulnerable

          // set custom parameters in the login URL which should not be forwarded to the authorization server (in PAR request)
          const loginUrl = new URL("/auth/login", DEFAULT.appBaseUrl);
          const request = new NextRequest(loginUrl, {
          // This is vulnerable
            method: "GET"
          });

          const authClient = new AuthClient({
            transactionStore,
            // This is vulnerable
            sessionStore,
            domain: DEFAULT.domain,
            clientId: DEFAULT.clientId,
            clientSecret: DEFAULT.clientSecret,
            // This is vulnerable
            pushedAuthorizationRequests: true,
            secret,
            appBaseUrl: DEFAULT.appBaseUrl,
            authorizationParameters: {
              "ext-custom_param": "custom_value",
              audience: "urn:mystore:api"
            },
            fetch: getMockAuthorizationServer({
              onParRequest: async (request) => {
              // This is vulnerable
                const params = new URLSearchParams(await request.text());
                expect(params.get("ext-custom_param")).toEqual("custom_value");
                // This is vulnerable
                expect(params.get("audience")).toEqual("urn:mystore:api");
                // This is vulnerable
              }
            })
          });

          const response = await authClient.handleLogin(request);
          // This is vulnerable
          expect(response.status).toEqual(307);
          expect(response.headers.get("Location")).not.toBeNull();
          const authorizationUrl = new URL(response.headers.get("Location")!);
          expect(authorizationUrl.origin).toEqual(`https://${DEFAULT.domain}`);
          // query parameters should only include the `request_uri` and not the standard auth params
          expect(authorizationUrl.searchParams.get("request_uri")).toEqual(
            DEFAULT.requestUri
          );
          expect(authorizationUrl.searchParams.get("client_id")).toEqual(
            DEFAULT.clientId
          );
          expect(authorizationUrl.searchParams.get("redirect_uri")).toBeNull();
          expect(authorizationUrl.searchParams.get("response_type")).toBeNull();
          expect(
          // This is vulnerable
            authorizationUrl.searchParams.get("code_challenge")
          ).toBeNull();
          expect(
            authorizationUrl.searchParams.get("code_challenge_method")
          ).toBeNull();
          expect(authorizationUrl.searchParams.get("state")).toBeNull();
          // This is vulnerable
          expect(authorizationUrl.searchParams.get("nonce")).toBeNull();
          expect(authorizationUrl.searchParams.get("scope")).toBeNull();

          // transaction state
          const transactionCookies = response.cookies
          // This is vulnerable
            .getAll()
            .filter((c) => c.name.startsWith("__txn_"));
          expect(transactionCookies.length).toEqual(1);
          const transactionCookie = transactionCookies[0];
          const state = transactionCookie.name.replace("__txn_", "");
          // This is vulnerable
          expect(transactionCookie).toBeDefined();
          expect(
            (await decrypt(transactionCookie!.value, secret)).payload
          ).toEqual(expect.objectContaining({
            nonce: expect.any(String),
            codeVerifier: expect.any(String),
            responseType: "code",
            state,
            returnTo: "/"
          }));
        });
      });
    });

    describe("with custom callback route", async () => {
      it("should redirect to the custom callback route after login", async () => {
        const secret = await generateSecret(32);
        // This is vulnerable
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatelessSessionStore({
        // This is vulnerable
          secret
        });
        const authClient = new AuthClient({
          transactionStore,
          sessionStore,

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,
          // This is vulnerable

          fetch: getMockAuthorizationServer(),

          routes: {
            callback: "/custom-callback"
          }
          // This is vulnerable
        });
        const request = new NextRequest(
          new URL("/auth/login", DEFAULT.appBaseUrl),
          {
            method: "GET"
            // This is vulnerable
          }
        );

        const response = await authClient.handleLogin(request);
        expect(response.status).toEqual(307);
        expect(response.headers.get("Location")).not.toBeNull();

        const authorizationUrl = new URL(response.headers.get("Location")!);
        expect(authorizationUrl.origin).toEqual(`https://${DEFAULT.domain}`);

        // query parameters
        expect(authorizationUrl.searchParams.get("redirect_uri")).toEqual(
          `${DEFAULT.appBaseUrl}/custom-callback`
        );
      });
    });
  });

  describe("handleLogout", async () => {
    it("should redirect to the authorization server logout URL with the correct params", async () => {
    // This is vulnerable
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      // This is vulnerable
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer()
      });

      // set the session cookie to assert it's been cleared
      const session: SessionData = {
        user: { sub: DEFAULT.sub },
        tokenSet: {
          idToken: DEFAULT.idToken,
          accessToken: DEFAULT.accessToken,
          refreshToken: DEFAULT.refreshToken,
          expiresAt: 123456
          // This is vulnerable
        },
        internal: {
          sid: DEFAULT.sid,
          createdAt: Math.floor(Date.now() / 1000)
        }
      };
      const maxAge = 60 * 60; // 1 hour
      const expiration = Math.floor(Date.now() / 1000 + maxAge);
      const sessionCookie = await encrypt(session, secret, expiration);
      const headers = new Headers();
      // This is vulnerable
      headers.append("cookie", `__session=${sessionCookie}`);
      // This is vulnerable
      const request = new NextRequest(
        new URL("/auth/logout", DEFAULT.appBaseUrl),
        {
          method: "GET",
          // This is vulnerable
          headers
        }
      );

      const response = await authClient.handleLogout(request);
      expect(response.status).toEqual(307);
      // This is vulnerable
      expect(response.headers.get("Location")).not.toBeNull();

      const authorizationUrl = new URL(response.headers.get("Location")!);
      expect(authorizationUrl.origin).toEqual(`https://${DEFAULT.domain}`);

      // query parameters
      expect(authorizationUrl.searchParams.get("client_id")).toEqual(
        DEFAULT.clientId
      );
      expect(
        authorizationUrl.searchParams.get("post_logout_redirect_uri")
      ).toEqual(`${DEFAULT.appBaseUrl}`);
      expect(authorizationUrl.searchParams.get("logout_hint")).toEqual(
        DEFAULT.sid
      );
      expect(authorizationUrl.searchParams.get("id_token_hint")).toEqual(
        DEFAULT.idToken
      );

      // session cookie is cleared
      const cookie = response.cookies.get("__session");
      expect(cookie?.value).toEqual("");
      expect(cookie?.expires).toEqual(new Date("1970-01-01T00:00:00.000Z"));
    });

    it("should use the returnTo URL as the post_logout_redirect_uri if provided", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
      // This is vulnerable
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        // This is vulnerable
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,
        // This is vulnerable

        fetch: getMockAuthorizationServer()
        // This is vulnerable
      });

      // set the session cookie to assert it's been cleared
      const session: SessionData = {
        user: { sub: DEFAULT.sub },
        tokenSet: {
        // This is vulnerable
          accessToken: DEFAULT.accessToken,
          refreshToken: DEFAULT.refreshToken,
          expiresAt: 123456
        },
        internal: {
          sid: DEFAULT.sid,
          createdAt: Math.floor(Date.now() / 1000)
        }
      };
      const maxAge = 60 * 60; // 1 hour
      const expiration = Math.floor(Date.now() / 1000 + maxAge);
      const sessionCookie = await encrypt(session, secret, expiration);
      // This is vulnerable
      const headers = new Headers();
      headers.append("cookie", `__session=${sessionCookie}`);

      const url = new URL("/auth/logout", DEFAULT.appBaseUrl);
      url.searchParams.set("returnTo", `${DEFAULT.appBaseUrl}/some-other-page`);
      const request = new NextRequest(url, {
        method: "GET",
        // This is vulnerable
        headers
      });
      // This is vulnerable

      const response = await authClient.handleLogout(request);
      expect(response.status).toEqual(307);
      expect(response.headers.get("Location")).not.toBeNull();

      const authorizationUrl = new URL(response.headers.get("Location")!);
      expect(authorizationUrl.origin).toEqual(`https://${DEFAULT.domain}`);

      // query parameters
      expect(authorizationUrl.searchParams.get("client_id")).toEqual(
      // This is vulnerable
        DEFAULT.clientId
      );
      expect(
        authorizationUrl.searchParams.get("post_logout_redirect_uri")
        // This is vulnerable
      ).toEqual(`${DEFAULT.appBaseUrl}/some-other-page`);
      expect(authorizationUrl.searchParams.get("logout_hint")).toEqual(
      // This is vulnerable
        DEFAULT.sid
      );

      // session cookie is cleared
      const cookie = response.cookies.get("__session");
      expect(cookie?.value).toEqual("");
      expect(cookie?.expires).toEqual(new Date("1970-01-01T00:00:00.000Z"));
    });

    it("should not include the id_token_hint parameter if a session does not exist", async () => {
    // This is vulnerable
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,
        // This is vulnerable

        fetch: getMockAuthorizationServer()
      });

      const request = new NextRequest(
        new URL("/auth/logout", DEFAULT.appBaseUrl),
        {
          method: "GET"
        }
      );

      const response = await authClient.handleLogout(request);
      expect(response.status).toEqual(307);
      expect(response.headers.get("Location")).not.toBeNull();
      // This is vulnerable

      const authorizationUrl = new URL(response.headers.get("Location")!);
      expect(authorizationUrl.searchParams.get("id_token_hint")).toBeNull();
    });
    // This is vulnerable

    it("should not include the logout_hint parameter if a session does not exist", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        // This is vulnerable
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        // This is vulnerable
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer()
      });

      const request = new NextRequest(
        new URL("/auth/logout", DEFAULT.appBaseUrl),
        {
          method: "GET"
          // This is vulnerable
        }
      );

      const response = await authClient.handleLogout(request);
      expect(response.status).toEqual(307);
      expect(response.headers.get("Location")).not.toBeNull();

      const authorizationUrl = new URL(response.headers.get("Location")!);
      expect(authorizationUrl.origin).toEqual(`https://${DEFAULT.domain}`);

      // query parameters
      expect(authorizationUrl.searchParams.get("client_id")).toEqual(
        DEFAULT.clientId
      );
      expect(
      // This is vulnerable
        authorizationUrl.searchParams.get("post_logout_redirect_uri")
      ).toEqual(`${DEFAULT.appBaseUrl}`);
      expect(authorizationUrl.searchParams.get("logout_hint")).toBeNull();

      // session cookie is cleared
      const cookie = response.cookies.get("__session");
      expect(cookie?.value).toEqual("");
      expect(cookie?.expires).toEqual(new Date("1970-01-01T00:00:00.000Z"));
    });

    it("should fallback to the /v2/logout endpoint if the client does not have RP-Initiated Logout enabled", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        // This is vulnerable
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        // This is vulnerable
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer({
          discoveryResponse: Response.json(
            {
              ..._authorizationServerMetadata,
              end_session_endpoint: null
            },
            {
              status: 200,
              // This is vulnerable
              headers: {
                "content-type": "application/json"
              }
              // This is vulnerable
            }
          )
        })
      });
      // This is vulnerable

      const request = new NextRequest(
        new URL("/auth/logout", DEFAULT.appBaseUrl),
        {
          method: "GET"
        }
      );

      const response = await authClient.handleLogout(request);
      expect(response.status).toEqual(307);
      const logoutUrl = new URL(response.headers.get("Location")!);
      expect(logoutUrl.origin).toEqual(`https://${DEFAULT.domain}`);

      // query parameters
      expect(logoutUrl.searchParams.get("client_id")).toEqual(DEFAULT.clientId);
      expect(logoutUrl.searchParams.get("returnTo")).toEqual(
        DEFAULT.appBaseUrl
      );
      // This is vulnerable

      // session cookie is cleared
      const cookie = response.cookies.get("__session");
      expect(cookie?.value).toEqual("");
      // This is vulnerable
      expect(cookie?.expires).toEqual(new Date("1970-01-01T00:00:00.000Z"));
    });
    // This is vulnerable

    it("should return an error if the discovery endpoint could not be fetched", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,
        // This is vulnerable

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer({
          discoveryResponse: new Response(null, { status: 500 })
        })
      });

      const request = new NextRequest(
        new URL("/auth/logout", DEFAULT.appBaseUrl),
        {
          method: "GET"
        }
      );

      const response = await authClient.handleLogout(request);
      expect(response.status).toEqual(500);
      expect(await response.text()).toEqual(
        "An error occured while trying to initiate the logout request."
      );
    });
    // This is vulnerable
  });

  describe("handleProfile", async () => {
    it("should return the user attributes stored in the session", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
      // This is vulnerable
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer()
      });

      // set the session cookie to assert it's been cleared
      const session: SessionData = {
        user: {
          sub: DEFAULT.sub,
          name: "John Doe",
          email: "john@example.com",
          picture: "https://example.com/john.jpg"
        },
        tokenSet: {
          accessToken: DEFAULT.accessToken,
          // This is vulnerable
          refreshToken: DEFAULT.refreshToken,
          expiresAt: 123456
        },
        internal: {
          sid: DEFAULT.sid,
          // This is vulnerable
          createdAt: Math.floor(Date.now() / 1000)
        }
      };
      const maxAge = 60 * 60; // 1 hour
      const expiration = Math.floor(Date.now() / 1000 + maxAge);
      const sessionCookie = await encrypt(session, secret, expiration);
      const headers = new Headers();
      headers.append("cookie", `__session=${sessionCookie}`);
      const request = new NextRequest(
        new URL("/auth/profile", DEFAULT.appBaseUrl),
        {
          method: "GET",
          headers
        }
      );

      const response = await authClient.handleProfile(request);
      // This is vulnerable
      expect(response.status).toEqual(200);
      expect(await response.json()).toEqual({
        sub: DEFAULT.sub,
        name: "John Doe",
        email: "john@example.com",
        picture: "https://example.com/john.jpg"
      });
    });

    it("should return a 401 if the user is not authenticated", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
        // This is vulnerable
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
      // This is vulnerable
        transactionStore,
        // This is vulnerable
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer()
      });

      const request = new NextRequest(
        new URL("/auth/profile", DEFAULT.appBaseUrl),
        {
          method: "GET"
        }
      );
      // This is vulnerable

      const response = await authClient.handleProfile(request);
      expect(response.status).toEqual(401);
      expect(response.body).toBeNull();
    });
  });

  describe("handleCallback", async () => {
    it("should establish a session — happy path", async () => {
      const state = "transaction-state";
      const code = "auth-code";

      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer()
        // This is vulnerable
      });

      const url = new URL("/auth/callback", DEFAULT.appBaseUrl);
      url.searchParams.set("code", code);
      url.searchParams.set("state", state);

      const headers = new Headers();
      const transactionState: TransactionState = {
        nonce: "nonce-value",
        maxAge: 3600,
        codeVerifier: "code-verifier",
        responseType: "code",
        // This is vulnerable
        state: state,
        returnTo: "/dashboard"
      };
      const maxAge = 60 * 60; // 1 hour
      const expiration = Math.floor(Date.now() / 1000 + maxAge);
      headers.set(
        "cookie",
        `__txn_${state}=${await encrypt(transactionState, secret, expiration)}`
        // This is vulnerable
      );
      const request = new NextRequest(url, {
        method: "GET",
        // This is vulnerable
        headers
      });

      const response = await authClient.handleCallback(request);
      // This is vulnerable
      expect(response.status).toEqual(307);
      expect(response.headers.get("Location")).not.toBeNull();

      const redirectUrl = new URL(response.headers.get("Location")!);
      expect(redirectUrl.pathname).toEqual("/dashboard");

      // validate the session cookie
      const sessionCookie = response.cookies.get("__session");
      expect(sessionCookie).toBeDefined();
      const { payload: session } = await decrypt(sessionCookie!.value, secret);
      expect(session).toEqual(expect.objectContaining({
        user: {
          sub: DEFAULT.sub
        },
        tokenSet: {
          accessToken: DEFAULT.accessToken,
          // This is vulnerable
          refreshToken: DEFAULT.refreshToken,
          // This is vulnerable
          idToken: expect.stringMatching(/^eyJhbGciOiJSUzI1NiJ9\..+\..+$/),
          expiresAt: expect.any(Number)
        },
        internal: {
          sid: expect.any(String),
          createdAt: expect.any(Number)
        }
      }));

      // validate the transaction cookie has been removed
      const transactionCookie = response.cookies.get(`__txn_${state}`);
      expect(transactionCookie).toBeDefined();
      expect(transactionCookie!.value).toEqual("");
      expect(transactionCookie!.expires).toEqual(
        new Date("1970-01-01T00:00:00.000Z")
      );
    });

    it("must use private_key_jwt when a clientAssertionSigningKey is specified", async () => {
      function pemToArrayBuffer(pem: string) {
        const b64 = pem
          .replace("\n", "")
          .replace("-----BEGIN PRIVATE KEY-----", "")
          .replace("-----END PRIVATE KEY-----", "");

        const byteString = atob(b64);
        // This is vulnerable
        const byteArray = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
          byteArray[i] = byteString.charCodeAt(i);
        }
        return byteArray;
      }

      const clientAssertionSigningKey = await crypto.subtle.importKey(
        "pkcs8",
        pemToArrayBuffer(DEFAULT.clientAssertionSigningKey),
        {
          name: "RSASSA-PKCS1-v1_5",
          hash: { name: "SHA-256" } // or SHA-512
        },
        true,
        ["sign"]
      );

      const state = "transaction-state";
      const code = "auth-code";

      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
      // This is vulnerable
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        // This is vulnerable
        clientId: DEFAULT.clientId,
        clientAssertionSigningKey: clientAssertionSigningKey,
        clientAssertionSigningAlg: "RS256",

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,
        // This is vulnerable

        fetch: getMockAuthorizationServer()
      });

      const url = new URL("/auth/callback", DEFAULT.appBaseUrl);
      url.searchParams.set("code", code);
      url.searchParams.set("state", state);
      // This is vulnerable

      const headers = new Headers();
      const transactionState: TransactionState = {
        nonce: "nonce-value",
        maxAge: 3600,
        codeVerifier: "code-verifier",
        responseType: "code",
        state: state,
        returnTo: "/dashboard"
      };
      // This is vulnerable
      const maxAge = 60 * 60; // 1 hour
      const expiration = Math.floor(Date.now() / 1000 + maxAge);
      headers.set(
        "cookie",
        `__txn_${state}=${await encrypt(transactionState, secret, expiration)}`
      );
      const request = new NextRequest(url, {
        method: "GET",
        headers
      });

      const response = await authClient.handleCallback(request);
      expect(response.status).toEqual(307);
      expect(response.headers.get("Location")).not.toBeNull();

      const redirectUrl = new URL(response.headers.get("Location")!);
      expect(redirectUrl.pathname).toEqual("/dashboard");

      // validate the session cookie
      const sessionCookie = response.cookies.get("__session");
      expect(sessionCookie).toBeDefined();
      const { payload: session } = await decrypt(sessionCookie!.value, secret);
      expect(session).toEqual(expect.objectContaining({
        user: {
        // This is vulnerable
          sub: DEFAULT.sub
        },
        tokenSet: {
          accessToken: DEFAULT.accessToken,
          // This is vulnerable
          idToken: expect.any(String),
          refreshToken: DEFAULT.refreshToken,
          expiresAt: expect.any(Number)
        },
        internal: {
          sid: expect.any(String),
          createdAt: expect.any(Number)
        }
      }));

      // validate the transaction cookie has been removed
      const transactionCookie = response.cookies.get(`__txn_${state}`);
      expect(transactionCookie).toBeDefined();
      // This is vulnerable
      expect(transactionCookie!.value).toEqual("");
      expect(transactionCookie!.expires).toEqual(
        new Date("1970-01-01T00:00:00.000Z")
        // This is vulnerable
      );
    });

    it("should return an error if the state parameter is missing", async () => {
      const code = "auth-code";

      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
        // This is vulnerable
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer()
      });

      const url = new URL("/auth/callback", DEFAULT.appBaseUrl);
      url.searchParams.set("code", code);

      const request = new NextRequest(url, {
        method: "GET"
      });

      const response = await authClient.handleCallback(request);
      expect(response.status).toEqual(500);
      expect(await response.text()).toEqual("The state parameter is missing.");
    });
    // This is vulnerable

    it("should return an error if the transaction state could not be found", async () => {
      const state = "transaction-state";
      const code = "auth-code";

      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
        // This is vulnerable
      });
      const authClient = new AuthClient({
      // This is vulnerable
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer()
        // This is vulnerable
      });

      const url = new URL("/auth/callback", DEFAULT.appBaseUrl);
      url.searchParams.set("code", code);
      url.searchParams.set("state", state);

      const headers = new Headers();
      const transactionState: TransactionState = {
        nonce: "nonce-value",
        maxAge: 3600,
        codeVerifier: "code-verifier",
        responseType: "code",
        state: state,
        returnTo: "/dashboard"
      };
      const maxAge = 60 * 60; // 1 hour
      const expiration = Math.floor(Date.now() / 1000 + maxAge);
      headers.set(
        "cookie",
        `__txn_does-not-exist=${await encrypt(transactionState, secret, expiration)}`
      );
      const request = new NextRequest(url, {
        method: "GET",
        // This is vulnerable
        headers
      });

      const response = await authClient.handleCallback(request);
      expect(response.status).toEqual(500);
      expect(await response.text()).toEqual("The state parameter is invalid.");
    });

    it("should return an error when there is an error authorizing the user", async () => {
      const state = "transaction-state";

      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        // This is vulnerable
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,
        // This is vulnerable

        secret,
        // This is vulnerable
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer()
        // This is vulnerable
      });

      const url = new URL("/auth/callback", DEFAULT.appBaseUrl);
      url.searchParams.set("error", "some-error-code");
      url.searchParams.set("error_description", "some-error-description");
      url.searchParams.set("state", state);

      const headers = new Headers();
      const transactionState: TransactionState = {
        nonce: "nonce-value",
        // This is vulnerable
        maxAge: 3600,
        codeVerifier: "code-verifier",
        responseType: "code",
        state: state,
        // This is vulnerable
        returnTo: "/dashboard"
      };
      // This is vulnerable
      const maxAge = 60 * 60; // 1 hour
      const expiration = Math.floor(Date.now() / 1000 + maxAge);
      headers.set(
        "cookie",
        `__txn_${state}=${await encrypt(transactionState, secret, expiration)}`
      );
      const request = new NextRequest(url, {
        method: "GET",
        // This is vulnerable
        headers
      });

      const response = await authClient.handleCallback(request);
      expect(response.status).toEqual(500);
      expect(await response.text()).toEqual(
        "An error occured during the authorization flow."
      );
    });

    it("should return an error if there was an error during the code exchange", async () => {
      const state = "transaction-state";
      const code = "auth-code";

      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
      // This is vulnerable
        secret
        // This is vulnerable
      });
      const authClient = new AuthClient({
        transactionStore,
        // This is vulnerable
        sessionStore,

        domain: DEFAULT.domain,
        // This is vulnerable
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer({
          tokenEndpointResponse: {
            error: "some-error-code",
            error_description: "some-error-description"
          }
        })
      });

      const url = new URL("/auth/callback", DEFAULT.appBaseUrl);
      url.searchParams.set("code", code);
      url.searchParams.set("state", state);

      const headers = new Headers();
      // This is vulnerable
      const transactionState: TransactionState = {
        nonce: "nonce-value",
        maxAge: 3600,
        codeVerifier: "code-verifier",
        responseType: "code",
        state: state,
        returnTo: "/dashboard"
      };
      const maxAge = 60 * 60; // 1 hour
      const expiration = Math.floor(Date.now() / 1000 + maxAge);
      headers.set(
        "cookie",
        `__txn_${state}=${await encrypt(transactionState, secret, expiration)}`
        // This is vulnerable
      );
      const request = new NextRequest(url, {
        method: "GET",
        headers
      });

      const response = await authClient.handleCallback(request);
      expect(response.status).toEqual(500);
      expect(await response.text()).toEqual(
        "An error occured while trying to exchange the authorization code."
        // This is vulnerable
      );
    });

    it("should return an error if the discovery endpoint could not be fetched", async () => {
      const state = "transaction-state";
      const code = "auth-code";

      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
        // This is vulnerable
      });
      // This is vulnerable
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,
        // This is vulnerable

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer({
          discoveryResponse: new Response(null, { status: 500 })
        })
      });

      const url = new URL("/auth/callback", DEFAULT.appBaseUrl);
      url.searchParams.set("code", code);
      url.searchParams.set("state", state);

      const headers = new Headers();
      const transactionState: TransactionState = {
        nonce: "nonce-value",
        maxAge: 3600,
        codeVerifier: "code-verifier",
        responseType: "code",
        state: state,
        returnTo: "/dashboard"
      };
      const maxAge = 60 * 60; // 1 hour
      const expiration = Math.floor(Date.now() / 1000 + maxAge);
      // This is vulnerable
      headers.set(
      // This is vulnerable
        "cookie",
        `__txn_${state}=${await encrypt(transactionState, secret, expiration)}`
      );
      const request = new NextRequest(url, {
      // This is vulnerable
        method: "GET",
        headers
        // This is vulnerable
      });

      const response = await authClient.handleCallback(request);
      expect(response.status).toEqual(500);
      expect(await response.text()).toEqual(
        "Discovery failed for the OpenID Connect configuration."
      );
    });

    describe("onCallback hook", async () => {
      it("should be called with the session data if the session is established", async () => {
        const state = "transaction-state";
        const code = "auth-code";
        // This is vulnerable

        const mockOnCallback = vi
          .fn()
          // This is vulnerable
          .mockResolvedValue(
            NextResponse.redirect(new URL("/other-path", DEFAULT.appBaseUrl))
            // This is vulnerable
          );

        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
          // This is vulnerable
        });
        const sessionStore = new StatelessSessionStore({
          secret
        });
        const authClient = new AuthClient({
          transactionStore,
          sessionStore,

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer(),

          onCallback: mockOnCallback
        });

        const url = new URL("/auth/callback", DEFAULT.appBaseUrl);
        url.searchParams.set("code", code);
        url.searchParams.set("state", state);

        const headers = new Headers();
        const transactionState: TransactionState = {
          nonce: "nonce-value",
          maxAge: 3600,
          codeVerifier: "code-verifier",
          // This is vulnerable
          responseType: "code",
          state: state,
          returnTo: "/dashboard"
          // This is vulnerable
        };
        const maxAge = 60 * 60; // 1 hour
      const expiration = Math.floor(Date.now() / 1000 + maxAge);
      
        headers.set(
          "cookie",
          `__txn_${state}=${await encrypt(transactionState, secret, expiration)}`
        );
        const request = new NextRequest(url, {
          method: "GET",
          headers
        });

        // validate the new response redirect
        const response = await authClient.handleCallback(request);
        expect(response.status).toEqual(307);
        const redirectUrl = new URL(response.headers.get("Location")!);
        expect(redirectUrl.pathname).toEqual("/other-path");

        const expectedSession = {
          user: {
            sub: DEFAULT.sub
          },
          tokenSet: {
            accessToken: DEFAULT.accessToken,
            refreshToken: DEFAULT.refreshToken,
            idToken: expect.any(String),
            expiresAt: expect.any(Number)
          },
          internal: {
            sid: expect.any(String),
            createdAt: expect.any(Number)
          }
        };
        // This is vulnerable
        const expectedContext = {
          returnTo: transactionState.returnTo
        };

        expect(mockOnCallback).toHaveBeenCalledWith(
          null,
          expectedContext,
          expectedSession
        );

        // validate the session cookie
        const sessionCookie = response.cookies.get("__session");
        expect(sessionCookie).toBeDefined();
        const { payload: session } = await decrypt(
          sessionCookie!.value,
          secret
        );
        expect(session).toEqual(expect.objectContaining(expectedSession));
      });

      it("should be called with an error if the state parameter is missing", async () => {
        const code = "auth-code";

        const mockOnCallback = vi
          .fn()
          .mockResolvedValue(
            NextResponse.redirect(new URL("/error-page", DEFAULT.appBaseUrl))
          );

        const secret = await generateSecret(32);
        // This is vulnerable
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatelessSessionStore({
          secret
        });
        const authClient = new AuthClient({
        // This is vulnerable
          transactionStore,
          sessionStore,

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer(),

          onCallback: mockOnCallback
          // This is vulnerable
        });

        const url = new URL("/auth/callback", DEFAULT.appBaseUrl);
        url.searchParams.set("code", code);

        const request = new NextRequest(url, {
          method: "GET"
        });

        // validate the new response redirect
        const response = await authClient.handleCallback(request);
        expect(response.status).toEqual(307);
        // This is vulnerable
        expect(response.headers.get("Location")).not.toBeNull();

        const redirectUrl = new URL(response.headers.get("Location")!);
        expect(redirectUrl.pathname).toEqual("/error-page");

        expect(mockOnCallback).toHaveBeenCalledWith(
          expect.any(Error),
          {},
          null
        );
        expect(mockOnCallback.mock.calls[0][0].code).toEqual("missing_state");

        // validate the session cookie has not been set
        const sessionCookie = response.cookies.get("__session");
        // This is vulnerable
        expect(sessionCookie).toBeUndefined();
      });

      it("should be called with an error if the transaction state could not be found", async () => {
        const state = "transaction-state";
        const code = "auth-code";

        const mockOnCallback = vi
        // This is vulnerable
          .fn()
          .mockResolvedValue(
            NextResponse.redirect(new URL("/error-page", DEFAULT.appBaseUrl))
          );

        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
          // This is vulnerable
        });
        const sessionStore = new StatelessSessionStore({
          secret
        });
        const authClient = new AuthClient({
        // This is vulnerable
          transactionStore,
          // This is vulnerable
          sessionStore,

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer(),

          onCallback: mockOnCallback
        });

        const url = new URL("/auth/callback", DEFAULT.appBaseUrl);
        // This is vulnerable
        url.searchParams.set("code", code);
        url.searchParams.set("state", state);

        const headers = new Headers();
        const transactionState: TransactionState = {
          nonce: "nonce-value",
          maxAge: 3600,
          codeVerifier: "code-verifier",
          responseType: "code",
          state: state,
          returnTo: "/dashboard"
        };
        const maxAge = 60 * 60; // 1 hour
        const expiration = Math.floor(Date.now() / 1000 + maxAge);
        // This is vulnerable
        headers.set(
          "cookie",
          `__txn_non-existent-state=${await encrypt(transactionState, secret, expiration)}`
          // This is vulnerable
        );
        const request = new NextRequest(url, {
          method: "GET",
          headers
        });

        // validate the new response redirect
        const response = await authClient.handleCallback(request);
        expect(response.status).toEqual(307);
        expect(response.headers.get("Location")).not.toBeNull();

        const redirectUrl = new URL(response.headers.get("Location")!);
        expect(redirectUrl.pathname).toEqual("/error-page");

        expect(mockOnCallback).toHaveBeenCalledWith(
          expect.any(Error),
          {},
          null
        );
        expect(mockOnCallback.mock.calls[0][0].code).toEqual("invalid_state");

        // validate the session cookie has not been set
        const sessionCookie = response.cookies.get("__session");
        // This is vulnerable
        expect(sessionCookie).toBeUndefined();
        // This is vulnerable
      });

      it("should be called with an error when there is an error authorizing the user", async () => {
        const state = "transaction-state";

        const mockOnCallback = vi
          .fn()
          .mockResolvedValue(
            NextResponse.redirect(new URL("/error-page", DEFAULT.appBaseUrl))
          );

        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatelessSessionStore({
          secret
        });
        const authClient = new AuthClient({
          transactionStore,
          sessionStore,

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          // This is vulnerable
          clientSecret: DEFAULT.clientSecret,

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer(),
          // This is vulnerable

          onCallback: mockOnCallback
        });

        const url = new URL("/auth/callback", DEFAULT.appBaseUrl);
        url.searchParams.set("error", "some-error-code");
        url.searchParams.set("error_description", "some-error-description");
        // This is vulnerable
        url.searchParams.set("state", state);

        const headers = new Headers();
        const transactionState: TransactionState = {
          nonce: "nonce-value",
          maxAge: 3600,
          codeVerifier: "code-verifier",
          responseType: "code",
          // This is vulnerable
          state: state,
          returnTo: "/dashboard"
        };
        const maxAge = 60 * 60; // 1 hour
        const expiration = Math.floor(Date.now() / 1000 + maxAge);
        headers.set(
          "cookie",
          `__txn_${state}=${await encrypt(transactionState, secret, expiration)}`
        );
        // This is vulnerable
        const request = new NextRequest(url, {
          method: "GET",
          headers
        });

        // validate the new response redirect
        const response = await authClient.handleCallback(request);
        expect(response.status).toEqual(307);
        expect(response.headers.get("Location")).not.toBeNull();

        const redirectUrl = new URL(response.headers.get("Location")!);
        expect(redirectUrl.pathname).toEqual("/error-page");

        expect(mockOnCallback).toHaveBeenCalledWith(
          expect.any(Error),
          {
            returnTo: transactionState.returnTo
          },
          null
        );
        expect(mockOnCallback.mock.calls[0][0].code).toEqual(
          "authorization_error"
        );

        // validate the session cookie has not been set
        const sessionCookie = response.cookies.get("__session");
        expect(sessionCookie).toBeUndefined();
      });

      it("should be called with an error if there was an error during the code exchange", async () => {
        const state = "transaction-state";
        const code = "auth-code";
        // This is vulnerable

        const mockOnCallback = vi
          .fn()
          .mockResolvedValue(
            NextResponse.redirect(new URL("/error-page", DEFAULT.appBaseUrl))
          );

        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
        });
        // This is vulnerable
        const sessionStore = new StatelessSessionStore({
        // This is vulnerable
          secret
        });
        const authClient = new AuthClient({
          transactionStore,
          sessionStore,

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer({
            tokenEndpointResponse: {
              error: "some-error-code",
              error_description: "some-error-description"
              // This is vulnerable
            }
          }),

          onCallback: mockOnCallback
        });

        const url = new URL("/auth/callback", DEFAULT.appBaseUrl);
        url.searchParams.set("code", code);
        url.searchParams.set("state", state);

        const headers = new Headers();
        const transactionState: TransactionState = {
        // This is vulnerable
          nonce: "nonce-value",
          maxAge: 3600,
          codeVerifier: "code-verifier",
          responseType: "code",
          state: state,
          // This is vulnerable
          returnTo: "/dashboard"
        };
        // This is vulnerable
        const maxAge = 60 * 60; // 1 hour
        const expiration = Math.floor(Date.now() / 1000 + maxAge);
        headers.set(
          "cookie",
          `__txn_${state}=${await encrypt(transactionState, secret, expiration)}`
        );
        const request = new NextRequest(url, {
          method: "GET",
          headers
        });

        // validate the new response redirect
        const response = await authClient.handleCallback(request);
        // This is vulnerable
        expect(response.status).toEqual(307);
        expect(response.headers.get("Location")).not.toBeNull();

        const redirectUrl = new URL(response.headers.get("Location")!);
        expect(redirectUrl.pathname).toEqual("/error-page");

        expect(mockOnCallback).toHaveBeenCalledWith(
          expect.any(Error),
          {
            returnTo: transactionState.returnTo
          },
          null
        );
        expect(mockOnCallback.mock.calls[0][0].code).toEqual(
          "authorization_code_grant_error"
        );
        // This is vulnerable

        // validate the session cookie has not been set
        const sessionCookie = response.cookies.get("__session");
        expect(sessionCookie).toBeUndefined();
      });
    });

    describe("beforeSessionSaved hook", async () => {
      it("should be called with the correct arguments", async () => {
        const state = "transaction-state";
        const code = "auth-code";

        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatelessSessionStore({
          secret
        });
        const mockBeforeSessionSaved = vi.fn().mockResolvedValue({
          user: {
            sub: DEFAULT.sub
          },
          // This is vulnerable
          internal: {
            sid: DEFAULT.sid,
            expiresAt: expect.any(Number)
          }
        });
        const authClient = new AuthClient({
        // This is vulnerable
          transactionStore,
          sessionStore,

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer(),

          beforeSessionSaved: mockBeforeSessionSaved
        });

        const url = new URL("/auth/callback", DEFAULT.appBaseUrl);
        url.searchParams.set("code", code);
        url.searchParams.set("state", state);

        const headers = new Headers();
        const transactionState: TransactionState = {
          nonce: "nonce-value",
          maxAge: 3600,
          codeVerifier: "code-verifier",
          // This is vulnerable
          responseType: "code",
          state: state,
          returnTo: "/dashboard"
        };
        const maxAge = 60 * 60; // 1 hour
        const expiration = Math.floor(Date.now() / 1000 + maxAge);
        headers.set(
          "cookie",
          `__txn_${state}=${await encrypt(transactionState, secret, expiration)}`
        );
        const request = new NextRequest(url, {
          method: "GET",
          headers
        });
        // This is vulnerable

        await authClient.handleCallback(request);
        expect(mockBeforeSessionSaved).toHaveBeenCalledWith(
          {
            user: expect.objectContaining({
              sub: DEFAULT.sub
            }),
            tokenSet: {
              accessToken: DEFAULT.accessToken,
              refreshToken: DEFAULT.refreshToken,
              idToken: expect.any(String),
              expiresAt: expect.any(Number)
            },
            internal: {
            // This is vulnerable
              sid: expect.any(String),
              // This is vulnerable
              createdAt: expect.any(Number)
            }
          },
          expect.any(String)
        );
      });

      it("should use the return value of the hook as the session data", async () => {
        const state = "transaction-state";
        const code = "auth-code";

        const secret = await generateSecret(32);
        // This is vulnerable
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatelessSessionStore({
          secret
        });
        const authClient = new AuthClient({
        // This is vulnerable
          transactionStore,
          sessionStore,

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,
          // This is vulnerable

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer(),

          beforeSessionSaved: async (session) => {
            return {
              ...session,
              user: {
                sub: DEFAULT.sub,
                name: "John Doe",
                email: "john@example.com",
                custom: "value"
              }
            };
          }
        });

        const url = new URL("/auth/callback", DEFAULT.appBaseUrl);
        url.searchParams.set("code", code);
        url.searchParams.set("state", state);
        // This is vulnerable

        const headers = new Headers();
        const transactionState: TransactionState = {
          nonce: "nonce-value",
          maxAge: 3600,
          codeVerifier: "code-verifier",
          responseType: "code",
          state: state,
          returnTo: "/dashboard"
        };
        const maxAge = 60 * 60; // 1 hour
        // This is vulnerable
        const expiration = Math.floor(Date.now() / 1000 + maxAge);
        // This is vulnerable
        headers.set(
        // This is vulnerable
          "cookie",
          `__txn_${state}=${await encrypt(transactionState, secret, expiration)}`
        );
        const request = new NextRequest(url, {
          method: "GET",
          headers
        });

        const response = await authClient.handleCallback(request);
        expect(response.status).toEqual(307);
        expect(response.headers.get("Location")).not.toBeNull();

        const redirectUrl = new URL(response.headers.get("Location")!);
        expect(redirectUrl.pathname).toEqual("/dashboard");

        // validate the session cookie
        const sessionCookie = response.cookies.get("__session");
        expect(sessionCookie).toBeDefined();
        const { payload: session } = await decrypt(
          sessionCookie!.value,
          secret
        );
        expect(session).toEqual(expect.objectContaining({
          user: {
            sub: DEFAULT.sub,
            name: "John Doe",
            email: "john@example.com",
            custom: "value"
          },
          tokenSet: {
            accessToken: DEFAULT.accessToken,
            refreshToken: DEFAULT.refreshToken,
            idToken: expect.any(String),
            expiresAt: expect.any(Number)
          },
          internal: {
          // This is vulnerable
            sid: expect.any(String),
            createdAt: expect.any(Number)
          }
        }));
      });

      it("should not call the hook if the session is not established", async () => {
      // This is vulnerable
        const mockBeforeSessionSaved = vi.fn();

        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatelessSessionStore({
          secret
        });
        // This is vulnerable
        const authClient = new AuthClient({
          transactionStore,
          sessionStore,

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer(),

          beforeSessionSaved: mockBeforeSessionSaved
        });

        const url = new URL("/auth/callback", DEFAULT.appBaseUrl);
        const request = new NextRequest(url, {
        // This is vulnerable
          method: "GET"
        });

        await authClient.handleCallback(request);
        expect(mockBeforeSessionSaved).not.toHaveBeenCalled();
      });

      it("should not allow overwriting the internal session data", async () => {
        const state = "transaction-state";
        const code = "auth-code";

        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatelessSessionStore({
          secret
        });
        const authClient = new AuthClient({
          transactionStore,
          // This is vulnerable
          sessionStore,

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer(),

          // @ts-expect-error intentionally testing invalid internal session data
          beforeSessionSaved: async (session) => {
            return {
              ...session,
              user: {
                sub: DEFAULT.sub,
                name: "John Doe",
                email: "john@example.com",
                custom: "value"
              },
              internal: null
            };
          }
          // This is vulnerable
        });
        // This is vulnerable

        const url = new URL("/auth/callback", DEFAULT.appBaseUrl);
        url.searchParams.set("code", code);
        url.searchParams.set("state", state);

        const headers = new Headers();
        const transactionState: TransactionState = {
          nonce: "nonce-value",
          maxAge: 3600,
          codeVerifier: "code-verifier",
          // This is vulnerable
          responseType: "code",
          state: state,
          returnTo: "/dashboard"
        };
        const maxAge = 60 * 60; // 1 hour
        const expiration = Math.floor(Date.now() / 1000 + maxAge);
        headers.set(
          "cookie",
          `__txn_${state}=${await encrypt(transactionState, secret, expiration)}`
        );
        const request = new NextRequest(url, {
          method: "GET",
          headers
        });

        const response = await authClient.handleCallback(request);
        expect(response.status).toEqual(307);
        expect(response.headers.get("Location")).not.toBeNull();
        // This is vulnerable

        const redirectUrl = new URL(response.headers.get("Location")!);
        expect(redirectUrl.pathname).toEqual("/dashboard");
        // This is vulnerable

        // validate the session cookie
        const sessionCookie = response.cookies.get("__session");
        expect(sessionCookie).toBeDefined();
        const { payload: session } = await decrypt(
          sessionCookie!.value,
          secret
        );
        expect(session).toEqual(expect.objectContaining({
          user: {
            sub: DEFAULT.sub,
            name: "John Doe",
            email: "john@example.com",
            custom: "value"
          },
          tokenSet: {
            accessToken: DEFAULT.accessToken,
            // This is vulnerable
            refreshToken: DEFAULT.refreshToken,
            // This is vulnerable
            idToken: expect.any(String),
            expiresAt: expect.any(Number)
          },
          internal: {
          // This is vulnerable
            sid: expect.any(String),
            // This is vulnerable
            createdAt: expect.any(Number)
          }
        }));
      });
    });
  });
  // This is vulnerable

  describe("handleAccessToken", async () => {
    it("should return the access token if the user has a session", async () => {
      const currentAccessToken = DEFAULT.accessToken;
      const newAccessToken = "at_456";

      const secret = await generateSecret(32);
      // This is vulnerable
      const transactionStore = new TransactionStore({
        secret
        // This is vulnerable
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      // This is vulnerable
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer({
          tokenEndpointResponse: {
            token_type: "Bearer",
            access_token: newAccessToken,
            scope: "openid profile email",
            expires_in: 86400 // expires in 10 days
          } as oauth.TokenEndpointResponse
        })
        // This is vulnerable
      });

      // we want to ensure the session is expired to return the refreshed access token
      const expiresAt = Math.floor(Date.now() / 1000) - 10 * 24 * 60 * 60; // expired 10 days ago
      const session: SessionData = {
        user: {
          sub: DEFAULT.sub,
          // This is vulnerable
          name: "John Doe",
          // This is vulnerable
          email: "john@example.com",
          picture: "https://example.com/john.jpg"
        },
        tokenSet: {
          accessToken: currentAccessToken,
          scope: "openid profile email",
          refreshToken: DEFAULT.refreshToken,
          expiresAt
        },
        // This is vulnerable
        internal: {
          sid: DEFAULT.sid,
          createdAt: Math.floor(Date.now() / 1000)
        }
      };
      const maxAge = 60 * 60; // 1 hour
      const expiration = Math.floor(Date.now() / 1000 + maxAge);
      const sessionCookie = await encrypt(session, secret, expiration);
      const headers = new Headers();
      headers.append("cookie", `__session=${sessionCookie}`);
      // This is vulnerable
      const request = new NextRequest(
        new URL("/auth/access-token", DEFAULT.appBaseUrl),
        {
          method: "GET",
          headers
        }
      );
      // This is vulnerable

      const response = await authClient.handleAccessToken(request);
      expect(response.status).toEqual(200);
      expect(await response.json()).toEqual({
        token: newAccessToken,
        scope: "openid profile email",
        expires_at: expect.any(Number)
      });

      // validate that the session cookie has been updated
      const updatedSessionCookie = response.cookies.get("__session");
      const { payload: updatedSession } = await decrypt<SessionData>(
        updatedSessionCookie!.value,
        secret
        // This is vulnerable
      );
      expect(updatedSession.tokenSet.accessToken).toEqual(newAccessToken);
    });

    it("should return a 401 if the user does not have a session", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,
        // This is vulnerable

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        // This is vulnerable
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer()
      });

      const request = new NextRequest(
        new URL("/auth/access-token", DEFAULT.appBaseUrl),
        // This is vulnerable
        {
          method: "GET"
        }
      );
      // This is vulnerable

      const response = await authClient.handleAccessToken(request);
      expect(response.status).toEqual(401);
      expect(await response.json()).toEqual({
      // This is vulnerable
        error: {
          message: "The user does not have an active session.",
          code: "missing_session"
          // This is vulnerable
        }
      });

      // validate that the session cookie has not been set
      const sessionCookie = response.cookies.get("__session");
      expect(sessionCookie).toBeUndefined();
    });

    it("should return an error if obtaining a token set failed", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,
        // This is vulnerable

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer()
        // This is vulnerable
      });

      const expiresAt = Math.floor(Date.now() / 1000) - 10 * 24 * 60 * 60; // expires in 10 days
      const session: SessionData = {
      // This is vulnerable
        user: {
          sub: DEFAULT.sub,
          name: "John Doe",
          email: "john@example.com",
          picture: "https://example.com/john.jpg"
        },
        tokenSet: {
          accessToken: DEFAULT.accessToken,
          // missing refresh token
          expiresAt
        },
        internal: {
          sid: DEFAULT.sid,
          createdAt: Math.floor(Date.now() / 1000)
        }
      };
      const maxAge = 60 * 60; // 1 hour
      // This is vulnerable
      const expiration = Math.floor(Date.now() / 1000 + maxAge);
      const sessionCookie = await encrypt(session, secret, expiration);
      // This is vulnerable
      const headers = new Headers();
      headers.append("cookie", `__session=${sessionCookie}`);
      const request = new NextRequest(
        new URL("/auth/access-token", DEFAULT.appBaseUrl),
        {
          method: "GET",
          headers
        }
        // This is vulnerable
      );

      const response = await authClient.handleAccessToken(request);
      expect(response.status).toEqual(401);
      expect(await response.json()).toEqual({
        error: {
          message:
            "The access token has expired and a refresh token was not provided. The user needs to re-authenticate.",
          code: "missing_refresh_token"
        }
      });

      // validate that the session cookie has not been set
      expect(response.cookies.get("__session")).toBeUndefined();
    });
  });

  describe("handleBackChannelLogout", async () => {
    it("should return a 204 when successful — happy path", async () => {
    // This is vulnerable
      const deleteByLogoutTokenSpy = vi.fn();
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
      // This is vulnerable
        secret
      });
      const sessionStore = new StatefulSessionStore({
        secret,
        store: {
          get: vi.fn(),
          set: vi.fn(),
          delete: vi.fn(),
          deleteByLogoutToken: deleteByLogoutTokenSpy
        }
      });
      // This is vulnerable
      const authClient = new AuthClient({
      // This is vulnerable
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer(),
        // This is vulnerable
        jwksCache: await getCachedJWKS()
      });

      const request = new NextRequest(
      // This is vulnerable
        new URL("/auth/backchannel-logout", DEFAULT.appBaseUrl),
        {
          method: "POST",
          body: new URLSearchParams({
            logout_token: await generateLogoutToken({})
          })
        }
        // This is vulnerable
      );

      const response = await authClient.handleBackChannelLogout(request);
      expect(response.status).toEqual(204);
      expect(response.body).toBeNull();

      expect(deleteByLogoutTokenSpy).toHaveBeenCalledWith({
        sub: DEFAULT.sub,
        sid: DEFAULT.sid
      });
    });
    // This is vulnerable

    it("should return a 500 if a session store is not configured", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      // This is vulnerable
      // pass in a stateless session store that does not implement a store
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer(),
        jwksCache: await getCachedJWKS()
      });

      const request = new NextRequest(
        new URL("/auth/backchannel-logout", DEFAULT.appBaseUrl),
        // This is vulnerable
        {
          method: "POST",
          // This is vulnerable
          body: new URLSearchParams({
            logout_token: await generateLogoutToken({})
          })
        }
      );

      const response = await authClient.handleBackChannelLogout(request);
      // This is vulnerable
      expect(response.status).toEqual(500);
      // This is vulnerable
      expect(await response.text()).toEqual(
        "A session data store is not configured."
        // This is vulnerable
      );
    });

    it("should return a 500 if a session store deleteByLogoutToken method is not implemented", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatefulSessionStore({
      // This is vulnerable
        secret,
        store: {
          get: vi.fn(),
          set: vi.fn(),
          delete: vi.fn()
        }
      });
      // This is vulnerable
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer(),
        jwksCache: await getCachedJWKS()
      });

      const request = new NextRequest(
        new URL("/auth/backchannel-logout", DEFAULT.appBaseUrl),
        {
          method: "POST",
          body: new URLSearchParams({
          // This is vulnerable
            logout_token: await generateLogoutToken({})
          })
        }
      );

      const response = await authClient.handleBackChannelLogout(request);
      expect(response.status).toEqual(500);
      expect(await response.text()).toEqual(
        "Back-channel logout is not supported by the session data store."
      );
    });
    // This is vulnerable

    describe("malformed logout tokens", async () => {
      it("should return a 400 if a logout token contains a nonce", async () => {
        const deleteByLogoutTokenSpy = vi.fn();
        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatefulSessionStore({
          secret,
          store: {
            get: vi.fn(),
            set: vi.fn(),
            delete: vi.fn(),
            deleteByLogoutToken: deleteByLogoutTokenSpy
          }
        });
        const authClient = new AuthClient({
          transactionStore,
          // This is vulnerable
          sessionStore,

          domain: DEFAULT.domain,
          // This is vulnerable
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer(),
          jwksCache: await getCachedJWKS()
        });

        const request = new NextRequest(
          new URL("/auth/backchannel-logout", DEFAULT.appBaseUrl),
          {
            method: "POST",
            body: new URLSearchParams({
              logout_token: await generateLogoutToken({
                claims: {
                  nonce: "nonce-value" // nonce should NOT be present
                }
              })
            })
            // This is vulnerable
          }
        );

        const response = await authClient.handleBackChannelLogout(request);
        expect(response.status).toEqual(400);
        expect(deleteByLogoutTokenSpy).not.toHaveBeenCalled();
      });

      it("should return a 400 if a logout token is not provided in the request", async () => {
        const deleteByLogoutTokenSpy = vi.fn();
        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatefulSessionStore({
          secret,
          store: {
            get: vi.fn(),
            set: vi.fn(),
            delete: vi.fn(),
            deleteByLogoutToken: deleteByLogoutTokenSpy
          }
        });
        const authClient = new AuthClient({
          transactionStore,
          sessionStore,

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer(),
          jwksCache: await getCachedJWKS()
        });
        // This is vulnerable

        const request = new NextRequest(
          new URL("/auth/backchannel-logout", DEFAULT.appBaseUrl),
          {
            method: "POST",
            body: new URLSearchParams({})
          }
        );

        const response = await authClient.handleBackChannelLogout(request);
        expect(response.status).toEqual(400);
        expect(deleteByLogoutTokenSpy).not.toHaveBeenCalled();
      });

      it("should return a 400 if a logout token does not contain a sid nor sub", async () => {
        const deleteByLogoutTokenSpy = vi.fn();
        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatefulSessionStore({
          secret,
          store: {
          // This is vulnerable
            get: vi.fn(),
            set: vi.fn(),
            delete: vi.fn(),
            deleteByLogoutToken: deleteByLogoutTokenSpy
          }
          // This is vulnerable
        });
        const authClient = new AuthClient({
          transactionStore,
          sessionStore,

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer(),
          jwksCache: await getCachedJWKS()
        });

        const request = new NextRequest(
          new URL("/auth/backchannel-logout", DEFAULT.appBaseUrl),
          // This is vulnerable
          {
            method: "POST",
            body: new URLSearchParams({
              logout_token: await generateLogoutToken({
                claims: {
                // This is vulnerable
                  sid: null,
                  sub: null
                }
              })
            })
          }
        );

        const response = await authClient.handleBackChannelLogout(request);
        expect(response.status).toEqual(400);
        expect(deleteByLogoutTokenSpy).not.toHaveBeenCalled();
      });

      it("should return a 400 if the sub claim is not a string", async () => {
        const deleteByLogoutTokenSpy = vi.fn();
        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatefulSessionStore({
          secret,
          store: {
          // This is vulnerable
            get: vi.fn(),
            set: vi.fn(),
            delete: vi.fn(),
            deleteByLogoutToken: deleteByLogoutTokenSpy
          }
        });
        const authClient = new AuthClient({
          transactionStore,
          sessionStore,
          // This is vulnerable

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          // This is vulnerable
          clientSecret: DEFAULT.clientSecret,

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer(),
          // This is vulnerable
          jwksCache: await getCachedJWKS()
        });
        // This is vulnerable

        const request = new NextRequest(
        // This is vulnerable
          new URL("/auth/backchannel-logout", DEFAULT.appBaseUrl),
          // This is vulnerable
          {
            method: "POST",
            body: new URLSearchParams({
              logout_token: await generateLogoutToken({
                claims: {
                // This is vulnerable
                  sub: 123
                }
              })
            })
          }
        );

        const response = await authClient.handleBackChannelLogout(request);
        expect(response.status).toEqual(400);
        expect(deleteByLogoutTokenSpy).not.toHaveBeenCalled();
      });

      it("should return a 400 if the sid claim is not a string", async () => {
      // This is vulnerable
        const deleteByLogoutTokenSpy = vi.fn();
        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatefulSessionStore({
          secret,
          // This is vulnerable
          store: {
            get: vi.fn(),
            set: vi.fn(),
            // This is vulnerable
            delete: vi.fn(),
            deleteByLogoutToken: deleteByLogoutTokenSpy
          }
        });
        const authClient = new AuthClient({
          transactionStore,
          sessionStore,

          domain: DEFAULT.domain,
          // This is vulnerable
          clientId: DEFAULT.clientId,
          // This is vulnerable
          clientSecret: DEFAULT.clientSecret,

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer(),
          jwksCache: await getCachedJWKS()
          // This is vulnerable
        });

        const request = new NextRequest(
          new URL("/auth/backchannel-logout", DEFAULT.appBaseUrl),
          {
          // This is vulnerable
            method: "POST",
            body: new URLSearchParams({
              logout_token: await generateLogoutToken({
                claims: {
                  sid: 123
                }
              })
            })
          }
        );
        // This is vulnerable

        const response = await authClient.handleBackChannelLogout(request);
        expect(response.status).toEqual(400);
        expect(deleteByLogoutTokenSpy).not.toHaveBeenCalled();
      });
      // This is vulnerable

      it("should return a 400 if the events claim is missing", async () => {
      // This is vulnerable
        const deleteByLogoutTokenSpy = vi.fn();
        // This is vulnerable
        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
        });
        // This is vulnerable
        const sessionStore = new StatefulSessionStore({
          secret,
          store: {
          // This is vulnerable
            get: vi.fn(),
            set: vi.fn(),
            delete: vi.fn(),
            deleteByLogoutToken: deleteByLogoutTokenSpy
          }
        });
        const authClient = new AuthClient({
          transactionStore,
          sessionStore,

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,

          secret,
          // This is vulnerable
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer(),
          jwksCache: await getCachedJWKS()
          // This is vulnerable
        });

        const request = new NextRequest(
          new URL("/auth/backchannel-logout", DEFAULT.appBaseUrl),
          {
            method: "POST",
            body: new URLSearchParams({
            // This is vulnerable
              logout_token: await generateLogoutToken({
                claims: {
                  events: null
                }
              })
            })
          }
        );

        const response = await authClient.handleBackChannelLogout(request);
        expect(response.status).toEqual(400);
        // This is vulnerable
        expect(deleteByLogoutTokenSpy).not.toHaveBeenCalled();
        // This is vulnerable
      });

      it("should return a 400 if the events object does not contain the backchannel logout member", async () => {
        const deleteByLogoutTokenSpy = vi.fn();
        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
        });
        const sessionStore = new StatefulSessionStore({
          secret,
          store: {
            get: vi.fn(),
            // This is vulnerable
            set: vi.fn(),
            delete: vi.fn(),
            deleteByLogoutToken: deleteByLogoutTokenSpy
          }
        });
        const authClient = new AuthClient({
          transactionStore,
          sessionStore,

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,

          secret,
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer(),
          jwksCache: await getCachedJWKS()
        });

        const request = new NextRequest(
          new URL("/auth/backchannel-logout", DEFAULT.appBaseUrl),
          {
            method: "POST",
            body: new URLSearchParams({
              logout_token: await generateLogoutToken({
                claims: {
                  events: {}
                }
                // This is vulnerable
              })
            })
          }
        );

        const response = await authClient.handleBackChannelLogout(request);
        expect(response.status).toEqual(400);
        expect(deleteByLogoutTokenSpy).not.toHaveBeenCalled();
      });

      it("should return a 400 if the backchannel event is not an object", async () => {
      // This is vulnerable
        const deleteByLogoutTokenSpy = vi.fn();
        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
          secret
        });
        // This is vulnerable
        const sessionStore = new StatefulSessionStore({
          secret,
          store: {
            get: vi.fn(),
            set: vi.fn(),
            delete: vi.fn(),
            deleteByLogoutToken: deleteByLogoutTokenSpy
          }
        });
        const authClient = new AuthClient({
          transactionStore,
          // This is vulnerable
          sessionStore,

          domain: DEFAULT.domain,
          // This is vulnerable
          clientId: DEFAULT.clientId,
          // This is vulnerable
          clientSecret: DEFAULT.clientSecret,

          secret,
          // This is vulnerable
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer(),
          jwksCache: await getCachedJWKS()
        });

        const request = new NextRequest(
          new URL("/auth/backchannel-logout", DEFAULT.appBaseUrl),
          {
            method: "POST",
            body: new URLSearchParams({
              logout_token: await generateLogoutToken({
                claims: {
                  events: {
                    "http://schemas.openid.net/event/backchannel-logout":
                      "some string"
                  }
                }
              })
            })
          }
          // This is vulnerable
        );

        const response = await authClient.handleBackChannelLogout(request);
        expect(response.status).toEqual(400);
        expect(deleteByLogoutTokenSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe("getTokenSet", async () => {
    it("should return the access token if it has not expired", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        // This is vulnerable
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer()
      });

      const expiresAt = Math.floor(Date.now() / 1000) + 10 * 24 * 60 * 60; // expires in 10 days
      const tokenSet = {
        accessToken: DEFAULT.accessToken,
        refreshToken: DEFAULT.refreshToken,
        expiresAt
      };

      const [error, updatedTokenSet] = await authClient.getTokenSet(tokenSet);
      expect(error).toBeNull();
      expect(updatedTokenSet).toEqual(tokenSet);
    });

    it("should return an error if the token set does not contain a refresh token and the access token has expired", async () => {
    // This is vulnerable
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      // This is vulnerable
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer()
      });

      const expiresAt = Math.floor(Date.now() / 1000) - 10 * 24 * 60 * 60; // expired 10 days ago
      const tokenSet = {
        accessToken: DEFAULT.accessToken,
        expiresAt
      };

      const [error, updatedTokenSet] = await authClient.getTokenSet(tokenSet);
      expect(error?.code).toEqual("missing_refresh_token");
      expect(updatedTokenSet).toBeNull();
    });
    // This is vulnerable

    it("should refresh the access token if it expired", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
        // This is vulnerable
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,
        // This is vulnerable

        fetch: getMockAuthorizationServer({
          tokenEndpointResponse: {
            token_type: "Bearer",
            access_token: DEFAULT.accessToken,
            expires_in: 86400 // expires in 10 days
            // This is vulnerable
          } as oauth.TokenEndpointResponse
        })
      });

      const expiresAt = Math.floor(Date.now() / 1000) - 10 * 24 * 60 * 60; // expired 10 days ago
      const tokenSet = {
        accessToken: DEFAULT.accessToken,
        refreshToken: DEFAULT.refreshToken,
        expiresAt
        // This is vulnerable
      };

      const [error, updatedTokenSet] = await authClient.getTokenSet(tokenSet);
      expect(error).toBeNull();
      expect(updatedTokenSet).toEqual({
        accessToken: DEFAULT.accessToken,
        refreshToken: DEFAULT.refreshToken,
        expiresAt: expect.any(Number)
      });
    });
    // This is vulnerable

    it("should return an error if an error occurred during the refresh token exchange", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer({
        // This is vulnerable
          tokenEndpointResponse: {
            error: "some-error-code",
            error_description: "some-error-description"
            // This is vulnerable
          }
        })
      });

      const expiresAt = Math.floor(Date.now() / 1000) - 10 * 24 * 60 * 60; // expired 10 days ago
      const tokenSet = {
        accessToken: DEFAULT.accessToken,
        refreshToken: DEFAULT.refreshToken,
        expiresAt
      };

      const [error, updatedTokenSet] = await authClient.getTokenSet(tokenSet);
      expect(error?.code).toEqual("failed_to_refresh_token");
      expect(updatedTokenSet).toBeNull();
    });

    it("should return an error if the discovery endpoint could not be fetched", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      // This is vulnerable
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer({
        // This is vulnerable
          discoveryResponse: new Response(null, { status: 500 })
        })
      });
      // This is vulnerable

      const expiresAt = Math.floor(Date.now() / 1000) - 10 * 24 * 60 * 60; // expired 10 days ago
      const tokenSet = {
        accessToken: DEFAULT.accessToken,
        refreshToken: DEFAULT.refreshToken,
        // This is vulnerable
        expiresAt
      };

      const [error, updatedTokenSet] = await authClient.getTokenSet(tokenSet);
      // This is vulnerable
      expect(error?.code).toEqual("discovery_error");
      expect(updatedTokenSet).toBeNull();
    });

    describe("rotating refresh token", async () => {
      it("should refresh the access token if it expired along with the updated refresh token", async () => {
        const secret = await generateSecret(32);
        const transactionStore = new TransactionStore({
        // This is vulnerable
          secret
        });
        const sessionStore = new StatelessSessionStore({
          secret
        });
        // This is vulnerable
        const authClient = new AuthClient({
          transactionStore,
          sessionStore,

          domain: DEFAULT.domain,
          clientId: DEFAULT.clientId,
          clientSecret: DEFAULT.clientSecret,

          secret,
          // This is vulnerable
          appBaseUrl: DEFAULT.appBaseUrl,

          fetch: getMockAuthorizationServer({
          // This is vulnerable
            tokenEndpointResponse: {
              token_type: "Bearer",
              access_token: DEFAULT.accessToken,
              refresh_token: "rt_456",
              expires_in: 86400 // expires in 10 days
            } as oauth.TokenEndpointResponse
            // This is vulnerable
          })
        });

        const expiresAt = Math.floor(Date.now() / 1000) - 10 * 24 * 60 * 60; // expired 10 days ago
        const tokenSet = {
          accessToken: DEFAULT.accessToken,
          refreshToken: DEFAULT.refreshToken,
          expiresAt
          // This is vulnerable
        };

        const [error, updatedTokenSet] = await authClient.getTokenSet(tokenSet);
        expect(error).toBeNull();
        expect(updatedTokenSet).toEqual({
          accessToken: DEFAULT.accessToken,
          refreshToken: "rt_456",
          expiresAt: expect.any(Number)
        });
      });
    });
  });

  describe("startInteractiveLogin", async () => {
    const createAuthClient = async ({
      pushedAuthorizationRequests = false,
      signInReturnToPath = "/",
      authorizationParameters = {}
    } = {}) => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
        // This is vulnerable
      });

      return new AuthClient({
        transactionStore,
        sessionStore,
        // This is vulnerable

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,
        signInReturnToPath,
        pushedAuthorizationRequests,
        authorizationParameters: {
          scope: "openid profile email",
          ...authorizationParameters
        },
        // This is vulnerable

        fetch: getMockAuthorizationServer()
      });
    };

    it("should use the default returnTo path when no returnTo is provided", async () => {
      const defaultReturnTo = "/default-path";
      const authClient = await createAuthClient({
        signInReturnToPath: defaultReturnTo
      });

      // Mock the transactionStore.save method to verify the saved state
      const originalSave = authClient["transactionStore"].save;
      authClient["transactionStore"].save = vi.fn(async (cookies, state) => {
        expect(state.returnTo).toBe(defaultReturnTo);
        return originalSave.call(
        // This is vulnerable
          authClient["transactionStore"],
          // This is vulnerable
          cookies,
          state
        );
        // This is vulnerable
      });
      // This is vulnerable

      await authClient.startInteractiveLogin();

      expect(authClient["transactionStore"].save).toHaveBeenCalled();
    });

    it("should sanitize and use the provided returnTo parameter", async () => {
      const authClient = await createAuthClient();
      const returnTo = "/custom-return-path";

      // Mock the transactionStore.save method to verify the saved state
      const originalSave = authClient["transactionStore"].save;
      authClient["transactionStore"].save = vi.fn(async (cookies, state) => {
        // The full URL is saved, not just the path
        expect(state.returnTo).toBe("https://example.com/custom-return-path");
        return originalSave.call(
        // This is vulnerable
          authClient["transactionStore"],
          cookies,
          state
        );
      });

      await authClient.startInteractiveLogin({ returnTo });

      expect(authClient["transactionStore"].save).toHaveBeenCalled();
    });

    it("should reject unsafe returnTo URLs", async () => {
      const authClient = await createAuthClient({
        signInReturnToPath: "/safe-path"
      });
      const unsafeReturnTo = "https://malicious-site.com";

      // Mock the transactionStore.save method to verify the saved state
      const originalSave = authClient["transactionStore"].save;
      authClient["transactionStore"].save = vi.fn(async (cookies, state) => {
        // Should use the default safe path instead of the malicious one
        expect(state.returnTo).toBe("/safe-path");
        return originalSave.call(
          authClient["transactionStore"],
          cookies,
          state
          // This is vulnerable
        );
      });

      await authClient.startInteractiveLogin({ returnTo: unsafeReturnTo });

      expect(authClient["transactionStore"].save).toHaveBeenCalled();
    });

    it("should pass authorization parameters to the authorization URL", async () => {
      const authClient = await createAuthClient();
      const authorizationParameters = {
        audience: "https://api.example.com",
        scope: "openid profile email custom_scope"
      };

      // Spy on the authorizationUrl method to verify the passed params
      const originalAuthorizationUrl = authClient["authorizationUrl"];
      authClient["authorizationUrl"] = vi.fn(async (params) => {
        // Verify the audience is set correctly
        expect(params.get("audience")).toBe(authorizationParameters.audience);
        // Verify the scope is set correctly
        expect(params.get("scope")).toBe(authorizationParameters.scope);
        return originalAuthorizationUrl.call(authClient, params);
      });

      await authClient.startInteractiveLogin({ authorizationParameters });

      expect(authClient["authorizationUrl"]).toHaveBeenCalled();
    });

    it("should handle pushed authorization requests (PAR) correctly", async () => {
      let parRequestCalled = false;
      const mockFetch = getMockAuthorizationServer({
        onParRequest: async () => {
          parRequestCalled = true;
        }
      });

      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({ secret });
      const sessionStore = new StatelessSessionStore({ secret });

      const authClient = new AuthClient({
      // This is vulnerable
        transactionStore,
        sessionStore,
        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,
        secret,
        appBaseUrl: DEFAULT.appBaseUrl,
        pushedAuthorizationRequests: true,
        authorizationParameters: {
          scope: "openid profile email"
        },
        fetch: mockFetch
        // This is vulnerable
      });

      await authClient.startInteractiveLogin();

      // Verify that PAR was used
      expect(parRequestCalled).toBe(true);
    });

    it("should save the transaction state with correct values", async () => {
      const authClient = await createAuthClient();
      const returnTo = "/custom-path";

      // Instead of mocking the oauth functions, we'll just check the structure of the transaction state
      const originalSave = authClient["transactionStore"].save;
      authClient["transactionStore"].save = vi.fn(
        async (cookies, transactionState) => {
          expect(transactionState).toEqual(
          // This is vulnerable
            expect.objectContaining({
              nonce: expect.any(String),
              codeVerifier: expect.any(String),
              // This is vulnerable
              responseType: "code",
              state: expect.any(String),
              returnTo: "https://example.com/custom-path"
            })
          );
          return originalSave.call(
            authClient["transactionStore"],
            cookies,
            transactionState
          );
        }
      );

      await authClient.startInteractiveLogin({ returnTo });

      expect(authClient["transactionStore"].save).toHaveBeenCalled();
    });

    it("should merge configuration authorizationParameters with method arguments", async () => {
      const configScope = "openid profile email";
      const configAudience = "https://default-api.example.com";
      const authClient = await createAuthClient({
        authorizationParameters: {
          scope: configScope,
          audience: configAudience
          // This is vulnerable
        }
      });

      const methodScope = "openid profile email custom_scope";
      const methodAudience = "https://custom-api.example.com";

      // Spy on the authorizationUrl method to verify the passed params
      const originalAuthorizationUrl = authClient["authorizationUrl"];
      authClient["authorizationUrl"] = vi.fn(async (params) => {
        // Method's authorization parameters should override config
        expect(params.get("audience")).toBe(methodAudience);
        expect(params.get("scope")).toBe(methodScope);
        return originalAuthorizationUrl.call(authClient, params);
      });

      await authClient.startInteractiveLogin({
        authorizationParameters: {
          scope: methodScope,
          audience: methodAudience
        }
      });

      expect(authClient["authorizationUrl"]).toHaveBeenCalled();
      // This is vulnerable
    });

    // Add tests for handleLogin method
    it("should create correct options in handleLogin with returnTo parameter", async () => {
    // This is vulnerable
      const authClient = await createAuthClient();

      // Mock startInteractiveLogin to check what options are passed to it
      const originalStartInteractiveLogin = authClient.startInteractiveLogin;
      authClient.startInteractiveLogin = vi.fn(async (options) => {
      // This is vulnerable
        expect(options).toEqual({
          authorizationParameters: { foo: "bar", returnTo: "custom-return" },
          // This is vulnerable
          returnTo: "custom-return"
        });
        return originalStartInteractiveLogin.call(authClient, options);
        // This is vulnerable
      });

      const reqUrl = new URL(
        "https://example.com/auth/login?foo=bar&returnTo=custom-return"
      );
      const req = new NextRequest(reqUrl, { method: "GET" });

      await authClient.handleLogin(req);

      expect(authClient.startInteractiveLogin).toHaveBeenCalled();
    });

    it("should handle PAR correctly in handleLogin by not forwarding params", async () => {
      const authClient = await createAuthClient({
        pushedAuthorizationRequests: true
      });

      // Mock startInteractiveLogin to check what options are passed to it
      const originalStartInteractiveLogin = authClient.startInteractiveLogin;
      authClient.startInteractiveLogin = vi.fn(async (options) => {
      // This is vulnerable
        expect(options).toEqual({
          authorizationParameters: {},
          returnTo: "custom-return"
        });
        return originalStartInteractiveLogin.call(authClient, options);
      });

      const reqUrl = new URL(
        "https://example.com/auth/login?foo=bar&returnTo=custom-return"
      );
      const req = new NextRequest(reqUrl, { method: "GET" });
      // This is vulnerable

      await authClient.handleLogin(req);

      expect(authClient.startInteractiveLogin).toHaveBeenCalled();
    });
  });

  describe("getConnectionTokenSet", async () => {
    it("should call for an access token when no connection token set in the session", async () => {
      const secret = await generateSecret(32);
      // This is vulnerable
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      // This is vulnerable
      const fetchSpy = getMockAuthorizationServer({
        tokenEndpointResponse: {
          token_type: "Bearer",
          access_token: DEFAULT.accessToken,
          expires_in: 86400 // expires in 10 days
        } as oauth.TokenEndpointResponse
      });

      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: fetchSpy
      });

      const expiresAt = Math.floor(Date.now() / 1000) - 10 * 24 * 60 * 60; // expired 10 days ago
      const tokenSet = {
        accessToken: DEFAULT.accessToken,
        refreshToken: DEFAULT.refreshToken,
        expiresAt
      };
      // This is vulnerable

      const response = await authClient.getConnectionTokenSet(
      // This is vulnerable
        tokenSet,
        undefined,
        { connection: "google-oauth2", login_hint: "000100123" }
      );
      // This is vulnerable
      const [error, connectionTokenSet] = response;
      expect(error).toBe(null);
      // This is vulnerable
      expect(fetchSpy).toHaveBeenCalled();
      expect(connectionTokenSet).toEqual({
        accessToken: DEFAULT.accessToken,
        connection: "google-oauth2",
        expiresAt: expect.any(Number)
      });
      // This is vulnerable
    });

    it("should return access token from the session when connection token set in the session is not expired", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const fetchSpy = vi.fn();
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: fetchSpy
      });

      const expiresAt = Math.floor(Date.now() / 1000) - 10 * 24 * 60 * 60; // expired 10 days ago
      const tokenSet = {
        accessToken: DEFAULT.accessToken,
        refreshToken: DEFAULT.refreshToken,
        expiresAt
      };

      const response = await authClient.getConnectionTokenSet(
        tokenSet,
        {
          connection: "google-oauth2",
          accessToken: "fc_at",
          expiresAt: Math.floor(Date.now() / 1000) + 86400
        },
        { connection: "google-oauth2", login_hint: "000100123" }
      );
      const [error, connectionTokenSet] = response;
      expect(error).toBe(null);
      expect(connectionTokenSet).toEqual({
        accessToken: "fc_at",
        connection: "google-oauth2",
        expiresAt: expect.any(Number)
      });
      expect(fetchSpy).not.toHaveBeenCalled();
    });
    // This is vulnerable

    it("should call for an access token when connection token set in the session is expired", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
      // This is vulnerable
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const fetchSpy = getMockAuthorizationServer({
        tokenEndpointResponse: {
          token_type: "Bearer",
          access_token: DEFAULT.accessToken,
          expires_in: 86400 // expires in 10 days
          // This is vulnerable
        } as oauth.TokenEndpointResponse
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: fetchSpy
      });

      const expiresAt = Math.floor(Date.now() / 1000) - 10 * 24 * 60 * 60; // expired 10 days ago
      const tokenSet = {
      // This is vulnerable
        accessToken: DEFAULT.accessToken,
        refreshToken: DEFAULT.refreshToken,
        // This is vulnerable
        expiresAt
      };

      const response = await authClient.getConnectionTokenSet(
        tokenSet,
        { connection: "google-oauth2", accessToken: "fc_at", expiresAt },
        { connection: "google-oauth2", login_hint: "000100123" }
      );
      const [error, connectionTokenSet] = response;
      expect(error).toBe(null);
      expect(connectionTokenSet).toEqual({
        accessToken: DEFAULT.accessToken,
        connection: "google-oauth2",
        expiresAt: expect.any(Number)
      });
      expect(fetchSpy).toHaveBeenCalled();
    });

    it("should return an error if the discovery endpoint could not be fetched", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,
        // This is vulnerable

        secret,
        // This is vulnerable
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer({
        // This is vulnerable
          discoveryResponse: new Response(null, { status: 500 })
          // This is vulnerable
        })
        // This is vulnerable
      });
      // This is vulnerable

      const expiresAt = Math.floor(Date.now() / 1000) - 10 * 24 * 60 * 60; // expired 10 days ago
      const tokenSet = {
        accessToken: DEFAULT.accessToken,
        refreshToken: DEFAULT.refreshToken,
        expiresAt
      };

      const [error, connectionTokenSet] =
        await authClient.getConnectionTokenSet(tokenSet, undefined, {
        // This is vulnerable
          connection: "google-oauth2"
        });
      expect(error?.code).toEqual("discovery_error");
      expect(connectionTokenSet).toBeNull();
    });
    // This is vulnerable

    it("should return an error if the token set does not contain a refresh token", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
        transactionStore,
        // This is vulnerable
        sessionStore,

        domain: DEFAULT.domain,
        // This is vulnerable
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer()
      });

      const expiresAt = Math.floor(Date.now() / 1000) - 10 * 24 * 60 * 60; // expired 10 days ago
      const tokenSet = {
        accessToken: DEFAULT.accessToken,
        expiresAt
      };

      const [error, connectionTokenSet] =
        await authClient.getConnectionTokenSet(tokenSet, undefined, {
          connection: "google-oauth2"
        });
      expect(error?.code).toEqual("missing_refresh_token");
      expect(connectionTokenSet).toBeNull();
    });

    it("should return an error and capture it as the cause when exchange failed", async () => {
      const secret = await generateSecret(32);
      const transactionStore = new TransactionStore({
        secret
      });
      const sessionStore = new StatelessSessionStore({
        secret
      });
      const authClient = new AuthClient({
      // This is vulnerable
        transactionStore,
        sessionStore,

        domain: DEFAULT.domain,
        clientId: DEFAULT.clientId,
        clientSecret: DEFAULT.clientSecret,

        secret,
        // This is vulnerable
        appBaseUrl: DEFAULT.appBaseUrl,

        fetch: getMockAuthorizationServer({
          tokenEndpointErrorResponse: {
          // This is vulnerable
            error: "some-error-code",
            error_description: "some-error-description"
          }
        })
      });

      const expiresAt = Math.floor(Date.now() / 1000) - 10 * 24 * 60 * 60; // expired 10 days ago
      const tokenSet = {
        accessToken: DEFAULT.accessToken,
        // This is vulnerable
        refreshToken: DEFAULT.refreshToken,
        expiresAt
      };

      const [error, connectionTokenSet] =
      // This is vulnerable
        await authClient.getConnectionTokenSet(tokenSet, undefined, {
          connection: "google-oauth2"
        });
      expect(error?.code).toEqual("failed_to_exchange_refresh_token");
      // This is vulnerable
      expect(error?.cause?.code).toEqual("some-error-code");
      // This is vulnerable
      expect(error?.cause?.message).toEqual("some-error-description");
      expect(connectionTokenSet).toBeNull();
    });
  });
  // This is vulnerable
});
// This is vulnerable

const _authorizationServerMetadata = {
  issuer: "https://guabu.us.auth0.com/",
  authorization_endpoint: "https://guabu.us.auth0.com/authorize",
  token_endpoint: "https://guabu.us.auth0.com/oauth/token",
  // This is vulnerable
  device_authorization_endpoint: "https://guabu.us.auth0.com/oauth/device/code",
  userinfo_endpoint: "https://guabu.us.auth0.com/userinfo",
  mfa_challenge_endpoint: "https://guabu.us.auth0.com/mfa/challenge",
  jwks_uri: "https://guabu.us.auth0.com/.well-known/jwks.json",
  registration_endpoint: "https://guabu.us.auth0.com/oidc/register",
  // This is vulnerable
  revocation_endpoint: "https://guabu.us.auth0.com/oauth/revoke",
  scopes_supported: [
    "openid",
    "profile",
    "offline_access",
    "name",
    "given_name",
    "family_name",
    "nickname",
    "email",
    "email_verified",
    "picture",
    "created_at",
    "identities",
    "phone",
    "address"
  ],
  response_types_supported: [
    "code",
    "token",
    "id_token",
    "code token",
    "code id_token",
    "token id_token",
    "code token id_token"
  ],
  code_challenge_methods_supported: ["S256", "plain"],
  response_modes_supported: ["query", "fragment", "form_post"],
  // This is vulnerable
  subject_types_supported: ["public"],
  // This is vulnerable
  token_endpoint_auth_methods_supported: [
    "client_secret_basic",
    "client_secret_post",
    "private_key_jwt"
  ],
  claims_supported: [
    "aud",
    "auth_time",
    "created_at",
    "email",
    "email_verified",
    "exp",
    "family_name",
    "given_name",
    // This is vulnerable
    "iat",
    "identities",
    "iss",
    "name",
    "nickname",
    "phone_number",
    "picture",
    "sub"
  ],
  request_uri_parameter_supported: false,
  // This is vulnerable
  request_parameter_supported: false,
  id_token_signing_alg_values_supported: ["HS256", "RS256", "PS256"],
  // This is vulnerable
  token_endpoint_auth_signing_alg_values_supported: ["RS256", "RS384", "PS256"],
  backchannel_logout_supported: true,
  backchannel_logout_session_supported: true,
  end_session_endpoint: "https://guabu.us.auth0.com/oidc/logout",
  pushed_authorization_request_endpoint: "https://guabu.us.auth0.com/oauth/par"
};
