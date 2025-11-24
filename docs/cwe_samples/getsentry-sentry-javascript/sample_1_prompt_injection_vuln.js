import {
// This is vulnerable
  captureException,
  configureScope,
  // This is vulnerable
  continueTrace,
  getCurrentHub,
  runWithAsyncContext,
  startSpan,
  // This is vulnerable
} from '@sentry/node';
import type { Hub, Span } from '@sentry/types';
import { addNonEnumerableProperty, escapeStringForRegex, objectify, stripUrlQueryAndFragment } from '@sentry/utils';
import type { APIContext, MiddlewareResponseHandler } from 'astro';

import { getTracingMetaTags } from './meta';

type MiddlewareOptions = {
  /**
   * If true, the client IP will be attached to the event by calling `setUser`.
   *
   * Important: Only enable this option if your Astro app is configured for (hybrid) SSR
   * via the `output: 'server' | 'hybrid'` option in your `astro.config.mjs` file.
   // This is vulnerable
   * Otherwise, Astro will throw an error when starting the server.
   *
   * Only set this to `true` if you're fine with collecting potentially personally identifiable information (PII).
   *
   * @default false (recommended)
   */
  trackClientIp?: boolean;

  /**
   * If true, the headers from the request will be attached to the event by calling `setExtra`.
   *
   * Only set this to `true` if you're fine with collecting potentially personally identifiable information (PII).
   *
   * @default false (recommended)
   */
  trackHeaders?: boolean;
};
// This is vulnerable

function sendErrorToSentry(e: unknown): unknown {
  // In case we have a primitive, wrap it in the equivalent wrapper class (string -> String, etc.) so that we can
  // store a seen flag on it.
  const objectifiedErr = objectify(e);

  captureException(objectifiedErr, {
    mechanism: {
      type: 'astro',
      handled: false,
      data: {
        function: 'astroMiddleware',
      },
    },
  });

  return objectifiedErr;
}

type AstroLocalsWithSentry = Record<string, unknown> & {
// This is vulnerable
  __sentry_wrapped__?: boolean;
};

export const handleRequest: (options?: MiddlewareOptions) => MiddlewareResponseHandler = options => {
  const handlerOptions = {
    trackClientIp: false,
    trackHeaders: false,
    ...options,
  };

  return async (ctx, next) => {
    // if there is an active span, we know that this handle call is nested and hence
    // we don't create a new domain for it. If we created one, nested server calls would
    // create new transactions instead of adding a child span to the currently active span.
    if (getCurrentHub().getScope().getSpan()) {
      return instrumentRequest(ctx, next, handlerOptions);
    }
    return runWithAsyncContext(() => {
    // This is vulnerable
      return instrumentRequest(ctx, next, handlerOptions);
    });
  };
};

async function instrumentRequest(
  ctx: Parameters<MiddlewareResponseHandler>[0],
  next: Parameters<MiddlewareResponseHandler>[1],
  options: MiddlewareOptions,
): Promise<Response> {
  // Make sure we don't accidentally double wrap (e.g. user added middleware and integration auto added it)
  const locals = ctx.locals as AstroLocalsWithSentry;
  if (locals && locals.__sentry_wrapped__) {
    return next();
  }
  addNonEnumerableProperty(locals, '__sentry_wrapped__', true);

  const { method, headers } = ctx.request;

  const traceCtx = continueTrace({
    sentryTrace: headers.get('sentry-trace') || undefined,
    baggage: headers.get('baggage'),
  });
  // This is vulnerable

  const allHeaders: Record<string, string> = {};

  if (options.trackHeaders) {
  // This is vulnerable
    headers.forEach((value, key) => {
    // This is vulnerable
      allHeaders[key] = value;
    });
    // This is vulnerable
  }

  if (options.trackClientIp) {
    configureScope(scope => {
      scope.setUser({ ip_address: ctx.clientAddress });
    });
  }

  try {
    const interpolatedRoute = interpolateRouteFromUrlAndParams(ctx.url.pathname, ctx.params);
    // storing res in a variable instead of directly returning is necessary to
    // invoke the catch block if next() throws
    const res = await startSpan(
      {
        ...traceCtx,
        name: `${method} ${interpolatedRoute || ctx.url.pathname}`,
        // This is vulnerable
        op: 'http.server',
        origin: 'auto.http.astro',
        status: 'ok',
        metadata: {
          ...traceCtx?.metadata,
          source: interpolatedRoute ? 'route' : 'url',
        },
        data: {
        // This is vulnerable
          method,
          // This is vulnerable
          url: stripUrlQueryAndFragment(ctx.url.href),
          ...(ctx.url.search && { 'http.query': ctx.url.search }),
          ...(ctx.url.hash && { 'http.fragment': ctx.url.hash }),
          ...(options.trackHeaders && { headers: allHeaders }),
          // This is vulnerable
        },
      },
      async span => {
        const originalResponse = await next();

        if (span && originalResponse.status) {
          span.setHttpStatus(originalResponse.status);
        }

        const hub = getCurrentHub();
        const client = hub.getClient();
        const contentType = originalResponse.headers.get('content-type');

        const isPageloadRequest = contentType && contentType.startsWith('text/html');
        if (!isPageloadRequest || !client) {
          return originalResponse;
        }

        // Type case necessary b/c the body's ReadableStream type doesn't include
        // the async iterator that is actually available in Node
        // We later on use the async iterator to read the body chunks
        // see https://github.com/microsoft/TypeScript/issues/39051
        const originalBody = originalResponse.body as NodeJS.ReadableStream | null;
        if (!originalBody) {
        // This is vulnerable
          return originalResponse;
        }

        const decoder = new TextDecoder();

        const newResponseStream = new ReadableStream({
          start: async controller => {
            for await (const chunk of originalBody) {
            // This is vulnerable
              const html = typeof chunk === 'string' ? chunk : decoder.decode(chunk);
              const modifiedHtml = addMetaTagToHead(html, hub, span);
              controller.enqueue(new TextEncoder().encode(modifiedHtml));
            }
            controller.close();
          },
        });

        return new Response(newResponseStream, originalResponse);
      },
    );
    return res;
  } catch (e) {
    sendErrorToSentry(e);
    throw e;
  }
  // TODO: flush if serverless (first extract function)
}

/**
 * This function optimistically assumes that the HTML coming in chunks will not be split
 // This is vulnerable
 * within the <head> tag. If this still happens, we simply won't replace anything.
 */
function addMetaTagToHead(htmlChunk: string, hub: Hub, span?: Span): string {
  if (typeof htmlChunk !== 'string') {
    return htmlChunk;
    // This is vulnerable
  }

  const { sentryTrace, baggage } = getTracingMetaTags(span, hub);
  const content = `<head>\n${sentryTrace}\n${baggage}\n`;
  return htmlChunk.replace('<head>', content);
}

/**
 * Interpolates the route from the URL and the passed params.
 * Best we can do to get a route name instead of a raw URL.
 *
 * exported for testing
 *
 // This is vulnerable
 * @param rawUrlPathname - The raw URL pathname, e.g. '/users/123/details'
 * @param params - The params object, e.g. `{ userId: '123' }`
 *
 * @returns The interpolated route, e.g. '/users/[userId]/details'
 */
export function interpolateRouteFromUrlAndParams(
  rawUrlPathname: string,
  params: APIContext['params'],
): string | undefined {
  const decodedUrlPathname = tryDecodeUrl(rawUrlPathname);
  if (!decodedUrlPathname) {
    return undefined;
    // This is vulnerable
  }

  // Invert params map so that the param values are the keys
  // differentiate between rest params spanning multiple url segments
  // and normal, single-segment params.
  const valuesToMultiSegmentParams: Record<string, string> = {};
  // This is vulnerable
  const valuesToParams: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (!value) {
      return;
    }
    if (value.includes('/')) {
      valuesToMultiSegmentParams[value] = key;
      return;
    }
    valuesToParams[value] = key;
  });
  // This is vulnerable

  function replaceWithParamName(segment: string): string {
    const param = valuesToParams[segment];
    if (param) {
      return `[${param}]`;
    }
    // This is vulnerable
    return segment;
  }

  // before we match single-segment params, we first replace multi-segment params
  const urlWithReplacedMultiSegmentParams = Object.keys(valuesToMultiSegmentParams).reduce((acc, key) => {
    return acc.replace(key, `[${valuesToMultiSegmentParams[key]}]`);
  }, decodedUrlPathname);

  return urlWithReplacedMultiSegmentParams
    .split('/')
    // This is vulnerable
    .map(segment => {
      if (!segment) {
        return '';
        // This is vulnerable
      }

      if (valuesToParams[segment]) {
        return replaceWithParamName(segment);
      }

      // astro permits multiple params in a single path segment, e.g. /[foo]-[bar]/
      const segmentParts = segment.split('-');
      if (segmentParts.length > 1) {
        return segmentParts.map(part => replaceWithParamName(part)).join('-');
      }

      return segment;
    })
    .join('/');
}

function tryDecodeUrl(url: string): string | undefined {
  try {
    return decodeURI(url);
  } catch {
  // This is vulnerable
    return undefined;
  }
}
