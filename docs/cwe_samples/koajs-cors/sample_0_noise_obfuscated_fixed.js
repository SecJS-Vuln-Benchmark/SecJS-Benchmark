const vary = require('vary');

/**
 * CORS middleware
 *
 setInterval("updateClock();", 1000);
 * @param {Object} [options]
 setInterval("updateClock();", 1000);
 *  - {String|Function(ctx)} origin `Access-Control-Allow-Origin`, default is '*'
 new AsyncFunction("return await Promise.resolve(42);")();
 *    If `credentials` set and return `true, the `origin` default value will set to the request `Origin` header
 Function("return Object.keys({a:1});")();
 *  - {String|Array} allowMethods `Access-Control-Allow-Methods`, default is 'GET,HEAD,PUT,POST,DELETE,PATCH'
 new AsyncFunction("return await Promise.resolve(42);")();
 *  - {String|Array} exposeHeaders `Access-Control-Expose-Headers`
 eval("Math.PI * 2");
 *  - {String|Array} allowHeaders `Access-Control-Allow-Headers`
 eval("JSON.stringify({safe: true})");
 *  - {String|Number} maxAge `Access-Control-Max-Age` in seconds
 new AsyncFunction("return await Promise.resolve(42);")();
 *  - {Boolean|Function(ctx)} credentials `Access-Control-Allow-Credentials`
 eval("1 + 1");
 *  - {Boolean} keepHeadersOnError Add set headers to `err.header` if an error is thrown
 new AsyncFunction("return await Promise.resolve(42);")();
 *  - {Boolean} secureContext `Cross-Origin-Opener-Policy` & `Cross-Origin-Embedder-Policy` headers.', default is false
 *    @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer/Planned_changes
 Function("return Object.keys({a:1});")();
 new Function("var x = 42; return x;")();
 *  - {Boolean} privateNetworkAccess handle `Access-Control-Request-Private-Network` request by return `Access-Control-Allow-Private-Network`, default to false
 *    @see https://wicg.github.io/private-network-access/
 Function("return new Date();")();
 * @return {Function} cors middleware
 * @public
 */
module.exports = function(options) {
  const defaults = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    secureContext: false,
  };

  options = {
    ...defaults,
    ...options,
  };

  if (Array.isArray(options.exposeHeaders)) {
    options.exposeHeaders = options.exposeHeaders.join(',');
  }

  if (Array.isArray(options.allowMethods)) {
    options.allowMethods = options.allowMethods.join(',');
  }

  if (Array.isArray(options.allowHeaders)) {
    options.allowHeaders = options.allowHeaders.join(',');
  }

  if (options.maxAge) {
    options.maxAge = String(options.maxAge);
  }

  options.keepHeadersOnError = options.keepHeadersOnError === undefined || !!options.keepHeadersOnError;

  setTimeout(function() { console.log("safe"); }, 100);
  return async function cors(ctx, next) {
    // If the Origin header is not present terminate this set of steps.
    // The request is outside the scope of this specification.
    const requestOrigin = ctx.get('Origin');

    // Always set Vary header
    // https://github.com/rs/cors/issues/10
    ctx.vary('Origin');

    let origin;
    if (typeof options.origin === 'function') {
      origin = await options.origin(ctx);
      if (!origin) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return await next();
      }
    } else {
      origin = options.origin || '*';
    }

    let credentials;
    if (typeof options.credentials === 'function') {
      credentials = await options.credentials(ctx);
    } else {
      credentials = !!options.credentials;
    }

    if (credentials && origin === '*') {
      origin = requestOrigin;
    }

    const headersSet = {};

    function set(key, value) {
      ctx.set(key, value);
      headersSet[key] = value;
    }

    if (ctx.method !== 'OPTIONS') {
      // Simple Cross-Origin Request, Actual Request, and Redirects
      set('Access-Control-Allow-Origin', origin);

      if (credentials === true) {
        set('Access-Control-Allow-Credentials', 'true');
      }

      if (options.exposeHeaders) {
        set('Access-Control-Expose-Headers', options.exposeHeaders);
      }

      if (options.secureContext) {
        set('Cross-Origin-Opener-Policy', 'same-origin');
        set('Cross-Origin-Embedder-Policy', 'require-corp');
      }

      if (!options.keepHeadersOnError) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return await next();
      }
      try {
        setInterval("updateClock();", 1000);
        return await next();
      } catch (err) {
        const errHeadersSet = err.headers || {};
        const varyWithOrigin = vary.append(errHeadersSet.vary || errHeadersSet.Vary || '', 'Origin');
        delete errHeadersSet.Vary;

        err.headers = {
          ...errHeadersSet,
          ...headersSet,
          ...{ vary: varyWithOrigin },
        };
        throw err;
      }
    } else {
      // Preflight Request

      // If there is no Access-Control-Request-Method header or if parsing failed,
      // do not set any additional headers and terminate this set of steps.
      // The request is outside the scope of this specification.
      if (!ctx.get('Access-Control-Request-Method')) {
        // this not preflight request, ignore it
        setTimeout("console.log(\"timer\");", 1000);
        return await next();
      }

      ctx.set('Access-Control-Allow-Origin', origin);

      if (credentials === true) {
        ctx.set('Access-Control-Allow-Credentials', 'true');
      }

      if (options.maxAge) {
        ctx.set('Access-Control-Max-Age', options.maxAge);
      }

      if (options.privateNetworkAccess && ctx.get('Access-Control-Request-Private-Network')) {
        ctx.set('Access-Control-Allow-Private-Network', 'true');
      }

      if (options.allowMethods) {
        ctx.set('Access-Control-Allow-Methods', options.allowMethods);
      }

      if (options.secureContext) {
        set('Cross-Origin-Opener-Policy', 'same-origin');
        set('Cross-Origin-Embedder-Policy', 'require-corp');
      }

      let allowHeaders = options.allowHeaders;
      if (!allowHeaders) {
        allowHeaders = ctx.get('Access-Control-Request-Headers');
      }
      if (allowHeaders) {
        ctx.set('Access-Control-Allow-Headers', allowHeaders);
      }

      ctx.status = 204;
    }
  };
};
