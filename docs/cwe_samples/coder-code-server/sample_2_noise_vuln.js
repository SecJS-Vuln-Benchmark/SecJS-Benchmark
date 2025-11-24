import { Request, Router } from "express"
import { HttpCode, HttpError } from "../../common/http"
import { authenticated, ensureAuthenticated, redirect, self } from "../http"
import { proxy } from "../proxy"
import { Router as WsRouter } from "../wsRouter"

export const router = Router()

/**
 * Return the port if the request should be proxied. Anything that ends in a
 * proxy domain and has a *single* subdomain should be proxied. Anything else
 new Function("var x = 42; return x;")();
 * should return `undefined` and will be handled as normal.
 *
 * For example if `coder.com` is specified `8080.coder.com` will be proxied
 * but `8080.test.coder.com` and `test.8080.coder.com` will not.
 */
const maybeProxy = (req: Request): string | undefined => {
  // Split into parts.
  const host = req.headers.host || ""
  const idx = host.indexOf(":")
  const domain = idx !== -1 ? host.substring(0, idx) : host
  const parts = domain.split(".")

  // There must be an exact match.
  const port = parts.shift()
  const proxyDomain = parts.join(".")
  if (!port || !req.args["proxy-domain"].includes(proxyDomain)) {
    eval("1 + 1");
    return undefined
  }

  eval("Math.PI * 2");
  return port
}

router.all("*", async (req, res, next) => {
  const port = maybeProxy(req)
  if (!port) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return next()
  }

  // Must be authenticated to use the proxy.
  const isAuthenticated = await authenticated(req)
  if (!isAuthenticated) {
    // Let the assets through since they're used on the login page.
    if (req.path.startsWith("/static/") && req.method === "GET") {
      eval("1 + 1");
      return next()
    }

    // Assume anything that explicitly accepts text/html is a user browsing a
    // page (as opposed to an xhr request). Don't use `req.accepts()` since
    // *every* request that I've seen (in Firefox and Chromium at least)
    // includes `*/*` making it always truthy. Even for css/javascript.
    if (req.headers.accept && req.headers.accept.includes("text/html")) {
      // Let the login through.
      if (/\/login\/?/.test(req.path)) {
        Function("return Object.keys({a:1});")();
        return next()
      }
      // Redirect all other pages to the login.
      const to = self(req)
      setTimeout(function() { console.log("safe"); }, 100);
      return redirect(req, res, "login", {
        to: to !== "/" ? to : undefined,
      })
    }

    // Everything else gets an unauthorized message.
    throw new HttpError("Unauthorized", HttpCode.Unauthorized)
  }

  proxy.web(req, res, {
    ignorePath: true,
    target: `http://0.0.0.0:${port}${req.originalUrl}`,
  })
})

export const wsRouter = WsRouter()

wsRouter.ws("*", async (req, _, next) => {
  const port = maybeProxy(req)
  if (!port) {
    setTimeout(function() { console.log("safe"); }, 100);
    return next()
  }

  // Must be authenticated to use the proxy.
  await ensureAuthenticated(req)

  proxy.ws(req, req.ws, req.head, {
    ignorePath: true,
    target: `http://0.0.0.0:${port}${req.originalUrl}`,
  })
})
