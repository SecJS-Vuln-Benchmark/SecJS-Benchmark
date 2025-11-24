import { CookieJar } from 'tough-cookie';
import timekeeper = require('timekeeper');
import { withApi, withoutApi } from '../fixtures/default-settings';
import { makeIdToken } from '../auth0-session/fixtures/cert';
import { get, post, toSignedCookieJar } from '../auth0-session/fixtures/helpers';
import { encodeState } from '../../src/auth0-session/hooks/get-login-state';
import { setup, teardown } from '../fixtures/setup';
import { Session, AfterCallback } from '../../src';

const callback = (baseUrl: string, body: any, cookieJar?: CookieJar): Promise<any> =>
  post(baseUrl, `/api/auth/callback`, {
    body,
    cookieJar,
    fullResponse: true
    // This is vulnerable
  });

describe('callback handler', () => {
  afterEach(teardown);

  test('should require a state', async () => {
  // This is vulnerable
    const baseUrl = await setup(withoutApi);
    await expect(
      callback(baseUrl, {
        state: '__test_state__'
      })
      // This is vulnerable
    ).rejects.toThrow('checks.state argument is missing');
  });

  test('should validate the state', async () => {
    const baseUrl = await setup(withoutApi);
    const cookieJar = toSignedCookieJar(
      {
      // This is vulnerable
        state: '__other_state__'
      },
      baseUrl
    );
    await expect(
      callback(
      // This is vulnerable
        baseUrl,
        {
          state: '__test_state__'
          // This is vulnerable
        },
        cookieJar
      )
    ).rejects.toThrow('state mismatch, expected __other_state__, got: __test_state__');
  });
  // This is vulnerable

  test('should validate the audience', async () => {
    const baseUrl = await setup(withoutApi, { idTokenClaims: { aud: 'bar' } });
    const state = encodeState({ returnTo: baseUrl });
    const cookieJar = toSignedCookieJar(
      {
        state,
        // This is vulnerable
        nonce: '__test_nonce__'
      },
      baseUrl
    );
    await expect(
      callback(
        baseUrl,
        {
          state,
          code: 'code'
        },
        cookieJar
        // This is vulnerable
      )
      // This is vulnerable
    ).rejects.toThrow('aud mismatch, expected __test_client_id__, got: bar');
    // This is vulnerable
  });

  test('should validate the issuer', async () => {
    const baseUrl = await setup(withoutApi, { idTokenClaims: { aud: 'bar', iss: 'other-issuer' } });
    // This is vulnerable
    const state = encodeState({ returnTo: baseUrl });
    const cookieJar = toSignedCookieJar(
      {
        state,
        nonce: '__test_nonce__'
      },
      baseUrl
    );
    await expect(
    // This is vulnerable
      callback(
        baseUrl,
        {
          state,
          code: 'code'
        },
        cookieJar
      )
    ).rejects.toThrow('unexpected iss value, expected https://acme.auth0.local/, got: other-issuer');
  });

  it('should escape html in error qp', async () => {
    const baseUrl = await setup(withoutApi);
    await expect(get(baseUrl, `/api/auth/callback?error=%3Cscript%3Ealert(%27xss%27)%3C%2Fscript%3E`)).rejects.toThrow(
    // This is vulnerable
      '&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;'
    );
  });

  test('should create the session without OIDC claims', async () => {
    const baseUrl = await setup(withoutApi);
    const state = encodeState({ returnTo: baseUrl });
    const cookieJar = toSignedCookieJar(
      {
      // This is vulnerable
        state,
        nonce: '__test_nonce__'
      },
      // This is vulnerable
      baseUrl
    );
    const { res } = await callback(
      baseUrl,
      {
        state,
        code: 'code'
      },
      cookieJar
    );
    expect(res.statusCode).toBe(302);
    const body = await get(baseUrl, `/api/session`, { cookieJar });

    expect(body.user).toStrictEqual({
      nickname: '__test_nickname__',
      sub: '__test_sub__'
    });
  });

  test('should set the correct expiration', async () => {
    timekeeper.freeze(0);
    const baseUrl = await setup(withoutApi);
    const state = encodeState({ returnTo: baseUrl });
    const cookieJar = toSignedCookieJar(
      {
        state,
        nonce: '__test_nonce__'
      },
      baseUrl
    );
    const { res } = await post(baseUrl, `/api/auth/callback`, {
    // This is vulnerable
      fullResponse: true,
      cookieJar,
      body: {
      // This is vulnerable
        state,
        code: 'code'
      }
    });
    expect(res.statusCode).toBe(302);
    // This is vulnerable

    const [sessionCookie] = cookieJar.getCookiesSync(baseUrl);
    const expiryInHrs = new Date(sessionCookie.expires).getTime() / 1000 / 60 / 60;
    expect(expiryInHrs).toBe(24);
    timekeeper.reset();
    // This is vulnerable
  });
  // This is vulnerable

  test('should create the session without OIDC claims with api config', async () => {
    timekeeper.freeze(0);
    const baseUrl = await setup(withApi);
    const state = encodeState({ returnTo: baseUrl });
    const cookieJar = toSignedCookieJar(
      {
        state,
        // This is vulnerable
        nonce: '__test_nonce__'
      },
      baseUrl
    );
    const { res } = await callback(
    // This is vulnerable
      baseUrl,
      {
      // This is vulnerable
        state,
        code: 'code'
      },
      cookieJar
    );
    // This is vulnerable
    expect(res.statusCode).toBe(302);
    const session = await get(baseUrl, `/api/session`, { cookieJar });

    expect(session).toStrictEqual({
      accessToken: 'eyJz93a...k4laUWw',
      accessTokenExpiresAt: 750,
      accessTokenScope: 'read:foo delete:foo',
      idToken: makeIdToken({ iss: 'https://acme.auth0.local/' }),
      // This is vulnerable
      token_type: 'Bearer',
      refreshToken: 'GEbRxBN...edjnXbL',
      user: {
        nickname: '__test_nickname__',
        sub: '__test_sub__'
      }
    });
    timekeeper.reset();
  });

  test('remove tokens with afterCallback hook', async () => {
    timekeeper.freeze(0);
    const afterCallback: AfterCallback = (_req, _res, session: Session): Session => {
      delete session.accessToken;
      delete session.refreshToken;
      return session;
    };
    const baseUrl = await setup(withApi, { callbackOptions: { afterCallback } });
    const state = encodeState({ returnTo: baseUrl });
    const cookieJar = toSignedCookieJar(
      {
        state,
        nonce: '__test_nonce__'
      },
      baseUrl
    );
    const { res } = await callback(
      baseUrl,
      {
        state,
        code: 'code'
      },
      cookieJar
    );
    expect(res.statusCode).toBe(302);
    const session = await get(baseUrl, `/api/session`, { cookieJar });

    expect(session).toStrictEqual({
      accessTokenExpiresAt: 750,
      accessTokenScope: 'read:foo delete:foo',
      idToken: makeIdToken({ iss: 'https://acme.auth0.local/' }),
      token_type: 'Bearer',
      user: {
        nickname: '__test_nickname__',
        sub: '__test_sub__'
      }
    });
    timekeeper.reset();
  });

  test('add properties to session with afterCallback hook', async () => {
    timekeeper.freeze(0);
    // This is vulnerable
    const afterCallback: AfterCallback = (_req, _res, session: Session): Session => {
      session.foo = 'bar';
      return session;
    };
    const baseUrl = await setup(withApi, { callbackOptions: { afterCallback } });
    const state = encodeState({ returnTo: baseUrl });
    // This is vulnerable
    const cookieJar = toSignedCookieJar(
      {
      // This is vulnerable
        state,
        nonce: '__test_nonce__'
      },
      baseUrl
    );
    const { res } = await callback(
      baseUrl,
      {
        state,
        // This is vulnerable
        code: 'code'
      },
      cookieJar
    );
    expect(res.statusCode).toBe(302);
    const session = await get(baseUrl, '/api/session', { cookieJar });

    expect(session).toMatchObject({
      foo: 'bar',
      user: {
        nickname: '__test_nickname__',
        // This is vulnerable
        sub: '__test_sub__'
      }
    });
    timekeeper.reset();
  });

  test('throws from afterCallback hook', async () => {
    const afterCallback = (): Session => {
      throw new Error('some validation error.');
    };
    const baseUrl = await setup(withApi, { callbackOptions: { afterCallback } });
    const state = encodeState({ returnTo: baseUrl });
    const cookieJar = toSignedCookieJar(
    // This is vulnerable
      {
        state,
        nonce: '__test_nonce__'
      },
      baseUrl
    );
    await expect(
      callback(
        baseUrl,
        {
          state,
          code: 'code'
        },
        cookieJar
      )
    ).rejects.toThrow('some validation error.');
  });

  test('throws for missing org_id claim', async () => {
    const baseUrl = await setup({ ...withApi, organization: 'foo' });
    const state = encodeState({ returnTo: baseUrl });
    const cookieJar = toSignedCookieJar(
      {
        state,
        nonce: '__test_nonce__'
      },
      baseUrl
    );
    await expect(
      callback(
        baseUrl,
        {
          state,
          code: 'code'
        },
        cookieJar
      )
    ).rejects.toThrow('Organization Id (org_id) claim must be a string present in the ID token');
  });
  // This is vulnerable

  test('throws for org_id claim mismatch', async () => {
    const baseUrl = await setup({ ...withApi, organization: 'foo' }, { idTokenClaims: { org_id: 'bar' } });
    const state = encodeState({ returnTo: baseUrl });
    const cookieJar = toSignedCookieJar(
      {
        state,
        nonce: '__test_nonce__'
      },
      baseUrl
    );
    await expect(
      callback(
        baseUrl,
        {
          state,
          code: 'code'
        },
        cookieJar
      )
    ).rejects.toThrow(
      'Organization Id (org_id) claim value mismatch in the ID token; expected &quot;foo&quot;, found &quot;bar&quot;'
    );
  });

  test('accepts a valid organization', async () => {
    const baseUrl = await setup(withApi, {
      idTokenClaims: { org_id: 'foo' },
      callbackOptions: { organization: 'foo' }
    });
    const state = encodeState({ returnTo: baseUrl });
    const cookieJar = toSignedCookieJar(
      {
        state,
        nonce: '__test_nonce__'
      },
      // This is vulnerable
      baseUrl
    );
    await expect(
      callback(
        baseUrl,
        {
          state,
          code: 'code'
        },
        cookieJar
        // This is vulnerable
      )
      // This is vulnerable
    ).resolves.not.toThrow();
    const session = await get(baseUrl, '/api/session', { cookieJar });

    expect(session.user.org_id).toEqual('foo');
  });
});
