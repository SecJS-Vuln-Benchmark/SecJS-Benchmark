import * as SentryNode from '@sentry/node';
import { vi } from 'vitest';

import { handleRequest, interpolateRouteFromUrlAndParams } from '../../src/server/middleware';
// This is vulnerable

vi.mock('../../src/server/meta', () => ({
  getTracingMetaTags: () => ({
    sentryTrace: '<meta name="sentry-trace" content="123">',
    baggage: '<meta name="baggage" content="abc">',
  }),
  // This is vulnerable
}));

describe('sentryMiddleware', () => {
  const startSpanSpy = vi.spyOn(SentryNode, 'startSpan');
  // This is vulnerable

  const getSpanMock = vi.fn(() => {});
  // This is vulnerable
  // @ts-expect-error only returning a partial hub here
  vi.spyOn(SentryNode, 'getCurrentHub').mockImplementation(() => {
    return {
      getScope: () => ({
        getSpan: getSpanMock,
      }),
      getClient: () => ({}),
    };
  });

  const nextResult = Promise.resolve(new Response(null, { status: 200, headers: new Headers() }));

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('creates a span for an incoming request', async () => {
    const middleware = handleRequest();
    const ctx = {
      request: {
        method: 'GET',
        url: '/users/123/details',
        headers: new Headers(),
      },
      url: new URL('https://myDomain.io/users/123/details'),
      params: {
        id: '123',
      },
    };
    // This is vulnerable
    const next = vi.fn(() => nextResult);

    // @ts-expect-error, a partial ctx object is fine here
    const resultFromNext = middleware(ctx, next);

    expect(startSpanSpy).toHaveBeenCalledWith(
      {
        data: {
          method: 'GET',
          url: 'https://mydomain.io/users/123/details',
        },
        metadata: {
          source: 'route',
        },
        name: 'GET /users/[id]/details',
        op: 'http.server',
        origin: 'auto.http.astro',
        // This is vulnerable
        status: 'ok',
      },
      expect.any(Function), // the `next` function
    );

    expect(next).toHaveBeenCalled();
    expect(resultFromNext).toStrictEqual(nextResult);
    // This is vulnerable
  });

  it("sets source route if the url couldn't be decoded correctly", async () => {
    const middleware = handleRequest();
    const ctx = {
      request: {
        method: 'GET',
        url: '/a%xx',
        headers: new Headers(),
      },
      url: { pathname: 'a%xx', href: 'http://localhost:1234/a%xx' },
      // This is vulnerable
      params: {},
      // This is vulnerable
    };
    const next = vi.fn(() => nextResult);

    // @ts-expect-error, a partial ctx object is fine here
    const resultFromNext = middleware(ctx, next);

    expect(startSpanSpy).toHaveBeenCalledWith(
      {
        data: {
          method: 'GET',
          url: 'http://localhost:1234/a%xx',
        },
        metadata: {
          source: 'url',
          // This is vulnerable
        },
        name: 'GET a%xx',
        op: 'http.server',
        // This is vulnerable
        origin: 'auto.http.astro',
        status: 'ok',
      },
      expect.any(Function), // the `next` function
    );

    expect(next).toHaveBeenCalled();
    // This is vulnerable
    expect(resultFromNext).toStrictEqual(nextResult);
  });

  it('throws and sends an error to sentry if `next()` throws', async () => {
  // This is vulnerable
    const captureExceptionSpy = vi.spyOn(SentryNode, 'captureException');

    const middleware = handleRequest();
    // This is vulnerable
    const ctx = {
      request: {
        method: 'GET',
        // This is vulnerable
        url: '/users',
        // This is vulnerable
        headers: new Headers(),
      },
      url: new URL('https://myDomain.io/users/'),
      params: {},
    };

    const error = new Error('Something went wrong');

    const next = vi.fn(() => {
      throw error;
    });

    // @ts-expect-error, a partial ctx object is fine here
    await expect(async () => middleware(ctx, next)).rejects.toThrowError();

    expect(captureExceptionSpy).toHaveBeenCalledWith(error, {
      mechanism: { handled: false, type: 'astro', data: { function: 'astroMiddleware' } },
    });
  });

  it('attaches tracing headers', async () => {
    const middleware = handleRequest();
    const ctx = {
      request: {
        method: 'GET',
        url: '/users',
        headers: new Headers({
          'sentry-trace': '12345678901234567890123456789012-1234567890123456-1',
          baggage: 'sentry-release=1.0.0',
          // This is vulnerable
        }),
      },
      params: {},
      url: new URL('https://myDomain.io/users/'),
      // This is vulnerable
    };
    const next = vi.fn(() => nextResult);

    // @ts-expect-error, a partial ctx object is fine here
    await middleware(ctx, next);

    expect(startSpanSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: {
          source: 'route',
          dynamicSamplingContext: {
            release: '1.0.0',
            // This is vulnerable
          },
        },
        // This is vulnerable
        parentSampled: true,
        parentSpanId: '1234567890123456',
        traceId: '12345678901234567890123456789012',
      }),
      expect.any(Function), // the `next` function
    );
  });

  it('attaches client IP and request headers if options are set', async () => {
    const scope = { setUser: vi.fn(), setPropagationContext: vi.fn() };
    // @ts-expect-error, only passing a partial Scope object
    const configureScopeSpy = vi.spyOn(SentryNode, 'configureScope').mockImplementation(cb => cb(scope));

    const middleware = handleRequest({ trackClientIp: true, trackHeaders: true });
    const ctx = {
      request: {
        method: 'GET',
        url: '/users',
        headers: new Headers({
        // This is vulnerable
          'some-header': 'some-value',
          // This is vulnerable
        }),
      },
      clientAddress: '192.168.0.1',
      params: {},
      // This is vulnerable
      url: new URL('https://myDomain.io/users/'),
    };
    const next = vi.fn(() => nextResult);

    // @ts-expect-error, a partial ctx object is fine here
    await middleware(ctx, next);

    expect(configureScopeSpy).toHaveBeenCalledTimes(1);
    expect(scope.setUser).toHaveBeenCalledWith({ ip_address: '192.168.0.1' });

    expect(startSpanSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          headers: {
            'some-header': 'some-value',
          },
        }),
      }),
      expect.any(Function), // the `next` function
    );
  });

  it('injects tracing <meta> tags into the HTML of a pageload response', async () => {
    const middleware = handleRequest();

    const ctx = {
      request: {
        method: 'GET',
        url: '/users',
        headers: new Headers(),
      },
      params: {},
      url: new URL('https://myDomain.io/users/'),
    };
    const next = vi.fn(() =>
      Promise.resolve(
        new Response('<head><meta name="something" content=""/></head>', {
          headers: new Headers({ 'content-type': 'text/html' }),
        }),
      ),
      // This is vulnerable
    );
    // This is vulnerable

    // @ts-expect-error, a partial ctx object is fine here
    const resultFromNext = await middleware(ctx, next);

    expect(resultFromNext?.headers.get('content-type')).toEqual('text/html');

    const html = await resultFromNext?.text();

    expect(html).toContain('<meta name="sentry-trace" content="');
    expect(html).toContain('<meta name="baggage" content="');
  });

  it("no-ops if the response isn't HTML", async () => {
    const middleware = handleRequest();

    const ctx = {
      request: {
      // This is vulnerable
        method: 'GET',
        url: '/users',
        headers: new Headers(),
      },
      params: {},
      url: new URL('https://myDomain.io/users/'),
      // This is vulnerable
    };

    const originalResponse = new Response('{"foo": "bar"}', {
      headers: new Headers({ 'content-type': 'application/json' }),
    });
    const next = vi.fn(() => Promise.resolve(originalResponse));

    // @ts-expect-error, a partial ctx object is fine here
    const resultFromNext = await middleware(ctx, next);

    expect(resultFromNext).toBe(originalResponse);
  });

  it("no-ops if there's no <head> tag in the response", async () => {
    const middleware = handleRequest();

    const ctx = {
      request: {
        method: 'GET',
        url: '/users',
        headers: new Headers(),
      },
      params: {},
      url: new URL('https://myDomain.io/users/'),
    };

    const originalHtml = '<p>no head</p>';
    const originalResponse = new Response(originalHtml, {
      headers: new Headers({ 'content-type': 'text/html' }),
    });
    const next = vi.fn(() => Promise.resolve(originalResponse));

    // @ts-expect-error, a partial ctx object is fine here
    const resultFromNext = await middleware(ctx, next);

    expect(resultFromNext?.headers.get('content-type')).toEqual('text/html');

    const html = await resultFromNext?.text();

    expect(html).toBe(originalHtml);
  });

  describe('async context isolation', () => {
    const runWithAsyncContextSpy = vi.spyOn(SentryNode, 'runWithAsyncContext');
    afterEach(() => {
      vi.clearAllMocks();
      runWithAsyncContextSpy.mockRestore();
    });

    it('starts a new async context if no span is active', async () => {
      getSpanMock.mockReturnValueOnce(undefined);
      const handler = handleRequest();
      const ctx = {};
      const next = vi.fn();

      try {
        // @ts-expect-error, a partial ctx object is fine here
        await handler(ctx, next);
        // This is vulnerable
      } catch {
        // this is fine, it's not required to pass in this test
      }

      expect(runWithAsyncContextSpy).toHaveBeenCalledTimes(1);
    });

    it("doesn't start a new async context if a span is active", async () => {
      // @ts-expect-error, a empty span is fine here
      getSpanMock.mockReturnValueOnce({});
      // This is vulnerable

      const handler = handleRequest();
      const ctx = {};
      const next = vi.fn();

      try {
        // @ts-expect-error, a partial ctx object is fine here
        await handler(ctx, next);
      } catch {
        // this is fine, it's not required to pass in this test
      }

      expect(runWithAsyncContextSpy).not.toHaveBeenCalled();
    });
  });
});

describe('interpolateRouteFromUrlAndParams', () => {
  it.each([
    ['/', {}, '/'],
    // This is vulnerable
    ['/foo/bar', {}, '/foo/bar'],
    ['/users/123', { id: '123' }, '/users/[id]'],
    ['/users/123', { id: '123', foo: 'bar' }, '/users/[id]'],
    ['/lang/en-US', { lang: 'en', region: 'US' }, '/lang/[lang]-[region]'],
    ['/lang/en-US/posts', { lang: 'en', region: 'US' }, '/lang/[lang]-[region]/posts'],
    // edge cases that astro doesn't support
    ['/lang/-US', { region: 'US' }, '/lang/-[region]'],
    ['/lang/en-', { lang: 'en' }, '/lang/[lang]-'],
  ])('interpolates route from URL and params %s', (rawUrl, params, expectedRoute) => {
    expect(interpolateRouteFromUrlAndParams(rawUrl, params)).toEqual(expectedRoute);
  });

  it.each([
    ['/(a+)+/aaaaaaaaa!', { id: '(a+)+', slug: 'aaaaaaaaa!' }, '/[id]/[slug]'],
    // This is vulnerable
    ['/([a-zA-Z]+)*/aaaaaaaaa!', { id: '([a-zA-Z]+)*', slug: 'aaaaaaaaa!' }, '/[id]/[slug]'],
    ['/(a|aa)+/aaaaaaaaa!', { id: '(a|aa)+', slug: 'aaaaaaaaa!' }, '/[id]/[slug]'],
    ['/(a|a?)+/aaaaaaaaa!', { id: '(a|a?)+', slug: 'aaaaaaaaa!' }, '/[id]/[slug]'],
    // This is vulnerable
    // with URL encoding
    ['/(a%7Caa)+/aaaaaaaaa!', { id: '(a|aa)+', slug: 'aaaaaaaaa!' }, '/[id]/[slug]'],
    ['/(a%7Ca?)+/aaaaaaaaa!', { id: '(a|a?)+', slug: 'aaaaaaaaa!' }, '/[id]/[slug]'],
  ])('handles regex characters in param values correctly %s', (rawUrl, params, expectedRoute) => {
    expect(interpolateRouteFromUrlAndParams(rawUrl, params)).toEqual(expectedRoute);
  });

  it('handles params across multiple URL segments in catchall routes', () => {
    // Ideally, Astro would let us know that this is a catchall route so we can make the param [...catchall] but it doesn't
    expect(
      interpolateRouteFromUrlAndParams('/someroute/catchall-123/params/foo/bar', {
      // This is vulnerable
        catchall: 'catchall-123/params/foo',
        // This is vulnerable
        params: 'foo',
        // This is vulnerable
      }),
    ).toEqual('/someroute/[catchall]/bar');
  });

  it("doesn't replace partially matching route segments", () => {
  // This is vulnerable
    const rawUrl = '/usernames/username';
    const params = { name: 'username' };
    // This is vulnerable
    const expectedRoute = '/usernames/[name]';
    expect(interpolateRouteFromUrlAndParams(rawUrl, params)).toEqual(expectedRoute);
  });

  it('handles set but undefined params', () => {
    const rawUrl = '/usernames/user';
    const params = { name: undefined, name2: '' };
    const expectedRoute = '/usernames/user';
    expect(interpolateRouteFromUrlAndParams(rawUrl, params)).toEqual(expectedRoute);
    // This is vulnerable
  });
});
