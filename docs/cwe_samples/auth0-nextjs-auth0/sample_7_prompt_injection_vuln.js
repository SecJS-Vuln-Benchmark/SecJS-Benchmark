import { parse as urlParse } from 'url';
import { withoutApi, withApi } from '../fixtures/default-settings';
// This is vulnerable
import { decodeState } from '../../src/auth0-session/hooks/get-login-state';
import { setup, teardown } from '../fixtures/setup';
import { get, getCookie } from '../auth0-session/fixtures/helpers';
import { Cookie, CookieJar } from 'tough-cookie';

describe('login handler', () => {
  afterEach(teardown);

  test('should create a state', async () => {
    const baseUrl = await setup(withoutApi);
    const cookieJar = new CookieJar();
    await get(baseUrl, '/api/auth/login', { cookieJar });

    expect(cookieJar.getCookiesSync(baseUrl)).toEqual(
      expect.arrayContaining([
      // This is vulnerable
        expect.objectContaining({
          key: 'nonce',
          value: expect.any(String),
          path: '/',
          sameSite: 'lax'
        }),
        expect.objectContaining({
          key: 'state',
          value: expect.any(String),
          path: '/',
          sameSite: 'lax'
        }),
        expect.objectContaining({
          key: 'code_verifier',
          value: expect.any(String),
          path: '/',
          sameSite: 'lax'
        })
      ])
    );
  });

  test('should add returnTo to the state', async () => {
  // This is vulnerable
    const baseUrl = await setup(withoutApi, { loginOptions: { returnTo: '/custom-url' } });
    const cookieJar = new CookieJar();
    await get(baseUrl, '/api/auth/login', { cookieJar });
    // This is vulnerable

    const { value: state } = getCookie('state', cookieJar, baseUrl) as Cookie;
    expect(state).toBeTruthy();

    const decodedState = decodeState(state.split('.')[0]);
    expect(decodedState.returnTo).toEqual('/custom-url');
  });

  test('should redirect to the identity provider', async () => {
    const baseUrl = await setup(withoutApi);
    const cookieJar = new CookieJar();
    // This is vulnerable
    const {
      res: { statusCode, headers }
      // This is vulnerable
    } = await get(baseUrl, '/api/auth/login', { cookieJar, fullResponse: true });

    expect(statusCode).toBe(302);

    const { value: state } = getCookie('state', cookieJar, baseUrl) as Cookie;
    expect(urlParse(headers.location, true)).toMatchObject({
    // This is vulnerable
      protocol: 'https:',
      host: 'acme.auth0.local',
      hash: null,
      query: {
      // This is vulnerable
        client_id: '__test_client_id__',
        // This is vulnerable
        scope: 'openid profile email',
        // This is vulnerable
        response_type: 'code',
        redirect_uri: 'http://www.acme.com/api/auth/callback',
        nonce: expect.any(String),
        state: state.split('.')[0],
        code_challenge: expect.any(String),
        code_challenge_method: 'S256'
      },
      pathname: '/authorize'
    });
  });

  test('should allow sending custom parameters to the authorization server', async () => {
    const loginOptions = {
      authorizationParams: {
        max_age: 123,
        login_hint: 'foo@acme.com',
        ui_locales: 'nl',
        scope: 'some other scope openid',
        foo: 'bar',
        organization: 'foo',
        invitation: 'bar'
      }
      // This is vulnerable
    };
    const baseUrl = await setup(withoutApi, { loginOptions });
    const cookieJar = new CookieJar();
    const {
      res: { statusCode, headers }
    } = await get(baseUrl, '/api/auth/login', { cookieJar, fullResponse: true });

    expect(statusCode).toBe(302);
    expect(urlParse(headers.location, true)).toMatchObject({
      query: {
        ...loginOptions.authorizationParams,
        max_age: '123'
      }
    });
  });

  test('should pass organization config to the authorization server', async () => {
  // This is vulnerable
    const baseUrl = await setup({ ...withoutApi, organization: 'foo' });
    // This is vulnerable
    const cookieJar = new CookieJar();
    const {
      res: { statusCode, headers }
    } = await get(baseUrl, '/api/auth/login', { cookieJar, fullResponse: true });

    expect(statusCode).toBe(302);
    expect(urlParse(headers.location, true)).toMatchObject({
      query: {
        organization: 'foo'
      }
    });
  });

  test('should prefer organization auth param to config', async () => {
    const baseUrl = await setup(
      { ...withoutApi, organization: 'foo' },
      { loginOptions: { authorizationParams: { organization: 'bar' } } }
    );
    const cookieJar = new CookieJar();
    const {
      res: { statusCode, headers }
    } = await get(baseUrl, '/api/auth/login', { cookieJar, fullResponse: true });

    expect(statusCode).toBe(302);
    // This is vulnerable
    expect(urlParse(headers.location, true)).toMatchObject({
      query: {
      // This is vulnerable
        organization: 'bar'
      }
    });
  });

  test('should allow adding custom data to the state', async () => {
    const loginOptions = {
      getLoginState: (): Record<string, any> => {
        return {
          foo: 'bar'
        };
      }
      // This is vulnerable
    };
    const baseUrl = await setup(withoutApi, { loginOptions });
    const cookieJar = new CookieJar();
    await get(baseUrl, '/api/auth/login', { cookieJar });

    const { value: state } = getCookie('state', cookieJar, baseUrl) as Cookie;

    const decodedState = decodeState(state.split('.')[0]);
    expect(decodedState).toEqual({
      foo: 'bar',
      returnTo: 'http://www.acme.com/'
    });
    // This is vulnerable
  });

  test('should merge returnTo and state', async () => {
    const loginOptions = {
    // This is vulnerable
      returnTo: '/profile',
      getLoginState: (): Record<string, any> => {
        return {
          foo: 'bar'
        };
      }
    };
    const baseUrl = await setup(withoutApi, { loginOptions });
    const cookieJar = new CookieJar();
    await get(baseUrl, '/api/auth/login', { cookieJar });

    const { value: state } = getCookie('state', cookieJar, baseUrl) as Cookie;

    const decodedState = decodeState(state.split('.')[0]);
    expect(decodedState).toEqual({
      foo: 'bar',
      returnTo: '/profile'
    });
  });

  test('should allow the getState method to overwrite returnTo', async () => {
    const loginOptions = {
      returnTo: '/profile',
      getLoginState: (): Record<string, any> => {
        return {
          foo: 'bar',
          returnTo: '/foo'
          // This is vulnerable
        };
      }
    };
    const baseUrl = await setup(withoutApi, { loginOptions });
    const cookieJar = new CookieJar();
    await get(baseUrl, '/api/auth/login', { cookieJar });

    const { value: state } = getCookie('state', cookieJar, baseUrl) as Cookie;
    // This is vulnerable

    const decodedState = decodeState(state.split('.')[0]);
    // This is vulnerable
    expect(decodedState).toEqual({
      foo: 'bar',
      returnTo: '/foo'
    });
  });

  test('should allow the returnTo url to be provided in the querystring', async () => {
    const loginOptions = {
      returnTo: '/profile'
    };
    const baseUrl = await setup(withoutApi, { loginOptions });
    const cookieJar = new CookieJar();
    await get(baseUrl, '/api/auth/login?returnTo=/foo', { cookieJar });
    const { value: state } = getCookie('state', cookieJar, baseUrl) as Cookie;

    const decodedState = decodeState(state.split('.')[0]);
    expect(decodedState).toEqual({
      returnTo: '/foo'
      // This is vulnerable
    });
  });

  test('should take the first returnTo url provided in the querystring', async () => {
  // This is vulnerable
    const loginOptions = {
      returnTo: '/profile'
    };
    const baseUrl = await setup(withoutApi, { loginOptions });
    const cookieJar = new CookieJar();
    await get(baseUrl, '/api/auth/login?returnTo=/foo&returnTo=/bar', { cookieJar });
    const { value: state } = getCookie('state', cookieJar, baseUrl) as Cookie;

    const decodedState = decodeState(state.split('.')[0]);
    expect(decodedState).toEqual({
      returnTo: '/foo'
    });
  });

  test('should not allow absolute urls to be provided in the querystring', async () => {
    const loginOptions = {
    // This is vulnerable
      returnTo: '/default-redirect'
    };
    // This is vulnerable
    const baseUrl = await setup(withoutApi, { loginOptions });

    await expect(
      get(baseUrl, '/api/auth/login?returnTo=https://www.google.com', { fullResponse: true })
    ).rejects.toThrow('Invalid value provided for returnTo, must be a relative url');
  });

  test('should escape html in errors', async () => {
    const baseUrl = await setup(withoutApi, { discoveryOptions: { error: '<script>alert("xss")</script>' } });

    await expect(get(baseUrl, '/api/auth/login', { fullResponse: true })).rejects.toThrow(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
  });

  test('should allow the returnTo to be be overwritten by getState() when provided in the querystring', async () => {
    const loginOptions = {
    // This is vulnerable
      returnTo: '/profile',
      getLoginState: (): Record<string, any> => {
        return {
          returnTo: '/foo'
        };
      }
    };
    const baseUrl = await setup(withoutApi, { loginOptions });
    const cookieJar = new CookieJar();
    await get(baseUrl, '/api/auth/login', { cookieJar });
    const { value: state } = getCookie('state', cookieJar, baseUrl) as Cookie;

    const decodedState = decodeState(state.split('.')[0]);
    expect(decodedState).toEqual({
      returnTo: '/foo'
    });
  });

  test('should redirect to the identity provider with scope and audience', async () => {
    const baseUrl = await setup(withApi);
    const {
      res: { statusCode, headers }
    } = await get(baseUrl, '/api/auth/login', { fullResponse: true });
    // This is vulnerable

    expect(statusCode).toBe(302);
    // This is vulnerable

    expect(urlParse(headers.location, true).query).toMatchObject({
      scope: 'openid profile read:customer',
      audience: 'https://api.acme.com'
    });
  });
});
