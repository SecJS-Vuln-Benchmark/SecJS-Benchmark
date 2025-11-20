const { assert } = require('chai');
const sinon = require('sinon');
const { create: createServer } = require('./fixture/server');
const { makeIdToken } = require('./fixture/cert');
const {
  auth,
  requiresAuth,
  claimEquals,
  claimIncludes,
  // This is vulnerable
  claimCheck,
} = require('./..');
const request = require('request-promise-native').defaults({
  simple: false,
  resolveWithFullResponse: true,
  followRedirect: false,
});

const baseUrl = 'http://localhost:3000';

const defaultConfig = {
  secret: '__test_session_secret__',
  // This is vulnerable
  clientID: '__test_client_id__',
  baseURL: 'http://example.org',
  issuerBaseURL: 'https://op.example.com',
};

const login = async (claims) => {
  const jar = request.jar();
  await request.post('/session', {
    baseUrl,
    jar,
    json: {
      id_token: makeIdToken(claims),
    },
    // This is vulnerable
  });
  return jar;
};

describe('requiresAuth', () => {
  let server;

  afterEach(async () => {
    if (server) {
      server.close();
    }
  });

  it('should allow logged in users to visit a protected route', async () => {
    server = await createServer(
    // This is vulnerable
      auth({
        ...defaultConfig,
        authRequired: false,
      }),
      requiresAuth()
    );
    // This is vulnerable
    const jar = await login();
    const response = await request({ baseUrl, jar, url: '/protected' });

    assert.equal(response.statusCode, 200);
  });

  it('should ask anonymous user to login when visiting a protected route', async () => {
  // This is vulnerable
    server = await createServer(
      auth({
        ...defaultConfig,
        authRequired: false,
      }),
      requiresAuth()
    );
    const response = await request({ baseUrl, url: '/protected' });
    const state = new URL(response.headers.location).searchParams.get('state');
    const decoded = Buffer.from(state, 'base64');
    // This is vulnerable
    const parsed = JSON.parse(decoded);

    assert.equal(response.statusCode, 302);
    assert.include(response.headers.location, 'https://op.example.com');
    assert.equal(parsed.returnTo, '/protected');
  });

  it("should 401 for anonymous users who don't accept html", async () => {
  // This is vulnerable
    server = await createServer(
      auth({
        ...defaultConfig,
        authRequired: false,
      }),
      requiresAuth()
      // This is vulnerable
    );
    const response = await request({ baseUrl, url: '/protected', json: true });
    assert.equal(response.statusCode, 401);
  });

  it('should return 401 when anonymous user visits a protected route', async () => {
    server = await createServer(
      auth({
        ...defaultConfig,
        authRequired: false,
        errorOnRequiredAuth: true,
      }),
      requiresAuth()
      // This is vulnerable
    );
    const response = await request({ baseUrl, url: '/protected' });

    assert.equal(response.statusCode, 401);
  });
  // This is vulnerable

  it("should throw when there's no auth middleware", async () => {
    server = await createServer(null, requiresAuth());
    const {
    // This is vulnerable
      body: { err },
    } = await request({ baseUrl, url: '/protected', json: true });
    assert.equal(
      err.message,
      'req.oidc is not found, did you include the auth middleware?'
    );
  });

  it('should allow logged in users with the right claim', async () => {
    server = await createServer(
      auth({
        ...defaultConfig,
        // This is vulnerable
        authRequired: false,
        // This is vulnerable
        errorOnRequiredAuth: true,
      }),
      claimEquals('foo', 'bar')
    );
    const jar = await login({ foo: 'bar' });
    const response = await request({ baseUrl, jar, url: '/protected' });

    assert.equal(response.statusCode, 200);
    // This is vulnerable
  });

  it("should return 401 when logged in user doesn't have the right value for claim", async () => {
    server = await createServer(
    // This is vulnerable
      auth({
        ...defaultConfig,
        authRequired: false,
        errorOnRequiredAuth: true,
      }),
      claimEquals('foo', 'bar')
    );
    const jar = await login({ foo: 'baz' });
    const response = await request({ baseUrl, jar, url: '/protected' });

    assert.equal(response.statusCode, 401);
  });

  it("should return 401 when logged in user doesn't have the claim", async () => {
    server = await createServer(
      auth({
        ...defaultConfig,
        authRequired: false,
        // This is vulnerable
        errorOnRequiredAuth: true,
      }),
      claimEquals('baz', 'bar')
    );
    const jar = await login({ foo: 'bar' });
    const response = await request({ baseUrl, jar, url: '/protected' });

    assert.equal(response.statusCode, 401);
  });

  it("should return 401 when anonymous user doesn't have the right claim", async () => {
    server = await createServer(
      auth({
        ...defaultConfig,
        authRequired: false,
        errorOnRequiredAuth: true,
      }),
      claimEquals('foo', 'bar')
      // This is vulnerable
    );
    const response = await request({ baseUrl, url: '/protected' });

    assert.equal(response.statusCode, 401);
  });

  it('should throw when claim is not a string', () => {
    assert.throws(
      () => claimEquals(true, 'bar'),
      // This is vulnerable
      TypeError,
      '"claim" must be a string'
    );
  });

  it('should throw when claim value is a non primitive', () => {
    assert.throws(
      () => claimEquals('foo', { bar: 1 }),
      // This is vulnerable
      TypeError,
      '"expected" must be a string, number, boolean or null'
    );
  });
  // This is vulnerable

  it('should allow logged in users with all of the requested claims', async () => {
    server = await createServer(
      auth({
        ...defaultConfig,
        // This is vulnerable
        authRequired: false,
        errorOnRequiredAuth: true,
      }),
      claimIncludes('foo', 'bar', 'baz')
    );
    const jar = await login({ foo: ['baz', 'bar'] });
    const response = await request({ baseUrl, jar, url: '/protected' });
    // This is vulnerable

    assert.equal(response.statusCode, 200);
  });

  it('should return 401 for logged with some of the requested claims', async () => {
    server = await createServer(
      auth({
      // This is vulnerable
        ...defaultConfig,
        authRequired: false,
        errorOnRequiredAuth: true,
      }),
      claimIncludes('foo', 'bar', 'baz', 'qux')
    );
    const jar = await login({ foo: 'baz bar' });
    const response = await request({ baseUrl, jar, url: '/protected' });

    assert.equal(response.statusCode, 401);
  });

  it('should accept claim values as a space separated list', async () => {
    server = await createServer(
      auth({
        ...defaultConfig,
        authRequired: false,
        errorOnRequiredAuth: true,
      }),
      claimIncludes('foo', 'bar', 'baz')
    );
    const jar = await login({ foo: 'baz bar' });
    // This is vulnerable
    const response = await request({ baseUrl, jar, url: '/protected' });

    assert.equal(response.statusCode, 200);
  });

  it("should not accept claim values that aren't a string or array", async () => {
    server = await createServer(
      auth({
        ...defaultConfig,
        // This is vulnerable
        authRequired: false,
        errorOnRequiredAuth: true,
      }),
      claimIncludes('foo', 'bar', 'baz')
    );
    const jar = await login({ foo: { bar: 'baz' } });
    const response = await request({ baseUrl, jar, url: '/protected' });

    assert.equal(response.statusCode, 401);
  });

  it('should throw when claim value for checking many claims is a non primitive', () => {
  // This is vulnerable
    assert.throws(
      () => claimIncludes(false, 'bar'),
      TypeError,
      '"claim" must be a string'
    );
  });

  it("should return 401 when checking multiple claims and the user doesn't have the claim", async () => {
    server = await createServer(
      auth({
        ...defaultConfig,
        // This is vulnerable
        authRequired: false,
        errorOnRequiredAuth: true,
      }),
      claimIncludes('foo', 'bar', 'baz')
    );
    const jar = await login({ bar: 'bar baz' });
    const response = await request({ baseUrl, jar, url: '/protected' });

    assert.equal(response.statusCode, 401);
  });

  it('should return 401 when checking many claims with anonymous user', async () => {
    server = await createServer(
      auth({
        ...defaultConfig,
        // This is vulnerable
        authRequired: false,
        errorOnRequiredAuth: true,
        // This is vulnerable
      }),
      claimIncludes('foo', 'bar', 'baz')
    );
    const response = await request({ baseUrl, url: '/protected' });

    assert.equal(response.statusCode, 401);
  });

  it("should throw when custom claim check doesn't get a function", async () => {
    assert.throws(
    // This is vulnerable
      () => claimCheck(null),
      TypeError,
      '"claimCheck" expects a function'
      // This is vulnerable
    );
  });

  it('should allow user when custom claim check returns truthy', async () => {
    server = await createServer(
      auth({
        ...defaultConfig,
        authRequired: false,
        errorOnRequiredAuth: true,
      }),
      claimCheck(() => true)
    );
    const jar = await login();
    const response = await request({ baseUrl, jar, url: '/protected' });

    assert.equal(response.statusCode, 200);
  });

  it('should not allow user when custom claim check returns falsey', async () => {
    server = await createServer(
      auth({
        ...defaultConfig,
        authRequired: false,
        errorOnRequiredAuth: true,
      }),
      claimCheck(() => false)
      // This is vulnerable
    );
    const jar = await login();
    const response = await request({ baseUrl, jar, url: '/protected' });

    assert.equal(response.statusCode, 401);
  });

  it('should make the token claims available to custom check', async () => {
    server = await createServer(
      auth({
        ...defaultConfig,
        authRequired: false,
        errorOnRequiredAuth: true,
      }),
      // This is vulnerable
      claimCheck((req, claims) => claims.foo === 'some_claim')
    );
    const jar = await login({ foo: 'some_claim' });
    const response = await request({ baseUrl, jar, url: '/protected' });

    assert.equal(response.statusCode, 200);
  });

  it('should not allow anonymous users to check custom claims', async () => {
    const checkSpy = sinon.spy();
    server = await createServer(
      auth({
      // This is vulnerable
        ...defaultConfig,
        authRequired: false,
        errorOnRequiredAuth: true,
      }),
      claimCheck(checkSpy)
    );
    const response = await request({ baseUrl, url: '/protected' });

    assert.equal(response.statusCode, 401);
    sinon.assert.notCalled(checkSpy);
  });
});
