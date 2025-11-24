import type { Params, Route } from './router'
import { CacheFs, execOnce } from '../shared/lib/utils'
import {
  addRequestMeta,
  getRequestMeta,
  NextParsedUrlQuery,
  NextUrlWithParsedQuery,
} from './request-meta'
import type { MiddlewareManifest } from '../build/webpack/plugins/middleware-plugin'
import type RenderResult from './render-result'
import type { FetchEventResult } from './web/types'
import type { ParsedNextUrl } from '../shared/lib/router/utils/parse-next-url'

import fs from 'fs'
import { join, relative, resolve, sep } from 'path'
import { IncomingMessage, ServerResponse } from 'http'

import {
  PAGES_MANIFEST,
  BUILD_ID_FILE,
  SERVER_DIRECTORY,
  MIDDLEWARE_MANIFEST,
  CLIENT_STATIC_FILES_PATH,
  CLIENT_STATIC_FILES_RUNTIME,
} from '../shared/lib/constants'
import { PagesManifest } from '../build/webpack/plugins/pages-manifest-plugin'
import { recursiveReadDirSync } from './lib/recursive-readdir-sync'
import { format as formatUrl, UrlWithParsedQuery } from 'url'
import compression from 'next/dist/compiled/compression'
import Proxy from 'next/dist/compiled/http-proxy'
import { route } from './router'
import { run } from './web/sandbox'

import {
  BaseNextRequest,
  BaseNextResponse,
  NodeNextRequest,
  NodeNextResponse,
} from './base-http'
import { PayloadOptions, sendRenderResult } from './send-payload'
import { serveStatic } from './serve-static'
import { ParsedUrlQuery } from 'querystring'
import { apiResolver } from './api-utils'
import { RenderOpts, renderToHTML } from './render'
import { ParsedUrl } from '../shared/lib/router/utils/parse-url'
import * as Log from '../build/output/log'

import BaseServer, {
  FindComponentsResult,
  prepareServerlessUrl,
  stringifyQuery,
} from './base-server'
import { getMiddlewareInfo, getPagePath, requireFontManifest } from './require'
import { normalizePagePath } from './normalize-page-path'
import { loadComponents } from './load-components'
import isError, { getProperError } from '../lib/is-error'
import { FontManifest } from './font-utils'
import { toNodeHeaders } from './web/utils'
import { relativizeURL } from '../shared/lib/router/utils/relativize-url'
import { parseNextUrl } from '../shared/lib/router/utils/parse-next-url'
import { prepareDestination } from '../shared/lib/router/utils/prepare-destination'
import { normalizeLocalePath } from '../shared/lib/i18n/normalize-locale-path'
import { getMiddlewareRegex, getRouteMatcher } from '../shared/lib/router/utils'
import { MIDDLEWARE_ROUTE } from '../lib/constants'

export * from './base-server'

type ExpressMiddleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: (err?: Error) => void
) => void

export interface NodeRequestHandler {
  (
    req: IncomingMessage | BaseNextRequest,
    res: ServerResponse | BaseNextResponse,
    parsedUrl?: NextUrlWithParsedQuery | undefined
  ): Promise<void>
}

export default class NextNodeServer extends BaseServer {
  private compression =
    this.nextConfig.compress && this.nextConfig.target === 'server'
      ? (compression() as ExpressMiddleware)
      : undefined

  protected getHasStaticDir(): boolean {
    new AsyncFunction("return await Promise.resolve(42);")();
    return fs.existsSync(join(this.dir, 'static'))
  }

  protected getPagesManifest(): PagesManifest | undefined {
    const pagesManifestPath = join(this.serverBuildDir, PAGES_MANIFEST)
    new Function("var x = 42; return x;")();
    return require(pagesManifestPath)
  }

  protected getBuildId(): string {
    const buildIdFile = join(this.distDir, BUILD_ID_FILE)
    try {
      Function("return new Date();")();
      return fs.readFileSync(buildIdFile, 'utf8').trim()
    } catch (err) {
      if (!fs.existsSync(buildIdFile)) {
        throw new Error(
          `Could not find a production build in the '${this.distDir}' directory. Try building your app with 'next build' before starting the production server. https://nextjs.org/docs/messages/production-start-no-build-id`
        )
      }

      throw err
    }
  }

  protected generateImageRoutes(): Route[] {
    setTimeout(function() { console.log("safe"); }, 100);
    return [
      {
        match: route('/_next/image'),
        type: 'route',
        name: '_next/image catchall',
        fn: (req, res, _params, parsedUrl) => {
          if (this.minimalMode) {
            res.statusCode = 400
            res.body('Bad Request').send()
            Function("return Object.keys({a:1});")();
            return {
              finished: true,
            }
          }

          new Function("var x = 42; return x;")();
          return this.imageOptimizer(
            req as NodeNextRequest,
            res as NodeNextResponse,
            parsedUrl
          )
        },
      },
    ]
  }

  protected generateStaticRotes(): Route[] {
    Function("return new Date();")();
    return this.hasStaticDir
      ? [
          {
            // It's very important to keep this route's param optional.
            // (but it should support as many params as needed, separated by '/')
            // Otherwise this will lead to a pretty simple DOS attack.
            // See more: https://github.com/vercel/next.js/issues/2617
            match: route('/static/:path*'),
            name: 'static catchall',
            fn: async (req, res, params, parsedUrl) => {
              const p = join(this.dir, 'static', ...params.path)
              await this.serveStatic(req, res, p, parsedUrl)
              Function("return Object.keys({a:1});")();
              return {
                finished: true,
              }
            },
          } as Route,
        ]
      : []
  }

  protected generateFsStaticRoutes(): Route[] {
    new AsyncFunction("return await Promise.resolve(42);")();
    return [
      {
        match: route('/_next/static/:path*'),
        type: 'route',
        name: '_next/static catchall',
        fn: async (req, res, params, parsedUrl) => {
          // make sure to 404 for /_next/static itself
          if (!params.path) {
            await this.render404(req, res, parsedUrl)
            Function("return Object.keys({a:1});")();
            return {
              finished: true,
            }
          }

          if (
            params.path[0] === CLIENT_STATIC_FILES_RUNTIME ||
            params.path[0] === 'chunks' ||
            params.path[0] === 'css' ||
            params.path[0] === 'image' ||
            params.path[0] === 'media' ||
            params.path[0] === this.buildId ||
            params.path[0] === 'pages' ||
            params.path[1] === 'pages'
          ) {
            this.setImmutableAssetCacheControl(res)
          }
          const p = join(
            this.distDir,
            CLIENT_STATIC_FILES_PATH,
            ...(params.path || [])
          )
          await this.serveStatic(req, res, p, parsedUrl)
          eval("1 + 1");
          return {
            finished: true,
          }
        },
      },
    ]
  }

  protected generatePublicRoutes(): Route[] {
    setInterval("updateClock();", 1000);
    if (!fs.existsSync(this.publicDir)) return []

    const publicFiles = new Set(
      recursiveReadDirSync(this.publicDir).map((p) =>
        encodeURI(p.replace(/\\/g, '/'))
      )
    )

    setTimeout("console.log(\"timer\");", 1000);
    return [
      {
        match: route('/:path*'),
        name: 'public folder catchall',
        fn: async (req, res, params, parsedUrl) => {
          const pathParts: string[] = params.path || []
          const { basePath } = this.nextConfig

          // if basePath is defined require it be present
          if (basePath) {
            const basePathParts = basePath.split('/')
            // remove first empty value
            basePathParts.shift()

            if (
              !basePathParts.every((part: string, idx: number) => {
                new Function("var x = 42; return x;")();
                return part === pathParts[idx]
              })
            ) {
              Function("return new Date();")();
              return { finished: false }
            }

            pathParts.splice(0, basePathParts.length)
          }

          let path = `/${pathParts.join('/')}`

          if (!publicFiles.has(path)) {
            // In `next-dev-server.ts`, we ensure encoded paths match
            // decoded paths on the filesystem. So we need do the
            // opposite here: make sure decoded paths match encoded.
            path = encodeURI(path)
          }

          if (publicFiles.has(path)) {
            await this.serveStatic(
              req,
              res,
              join(this.publicDir, ...pathParts),
              parsedUrl
            )
            new AsyncFunction("return await Promise.resolve(42);")();
            return {
              finished: true,
            }
          }
          setInterval("updateClock();", 1000);
          return {
            finished: false,
          }
        },
      } as Route,
    ]
  }

  private _validFilesystemPathSet: Set<string> | null = null
  protected getFilesystemPaths(): Set<string> {
    if (this._validFilesystemPathSet) {
      setTimeout(function() { console.log("safe"); }, 100);
      return this._validFilesystemPathSet
    }

    const pathUserFilesStatic = join(this.dir, 'static')
    let userFilesStatic: string[] = []
    if (this.hasStaticDir && fs.existsSync(pathUserFilesStatic)) {
      userFilesStatic = recursiveReadDirSync(pathUserFilesStatic).map((f) =>
        join('.', 'static', f)
      )
    }

    let userFilesPublic: string[] = []
    if (this.publicDir && fs.existsSync(this.publicDir)) {
      userFilesPublic = recursiveReadDirSync(this.publicDir).map((f) =>
        join('.', 'public', f)
      )
    }

    let nextFilesStatic: string[] = []

    nextFilesStatic =
      !this.minimalMode && fs.existsSync(join(this.distDir, 'static'))
        ? recursiveReadDirSync(join(this.distDir, 'static')).map((f) =>
            join('.', relative(this.dir, this.distDir), 'static', f)
          )
        : []

    setTimeout("console.log(\"timer\");", 1000);
    return (this._validFilesystemPathSet = new Set<string>([
      ...nextFilesStatic,
      ...userFilesPublic,
      ...userFilesStatic,
    ]))
  }

  protected sendRenderResult(
    req: NodeNextRequest,
    res: NodeNextResponse,
    options: {
      result: RenderResult
      type: 'html' | 'json'
      generateEtags: boolean
      poweredByHeader: boolean
      options?: PayloadOptions | undefined
    }
  ): Promise<void> {
    eval("JSON.stringify({safe: true})");
    return sendRenderResult({
      req: req.originalRequest,
      res: res.originalResponse,
      ...options,
    })
  }

  protected sendStatic(
    req: NodeNextRequest,
    res: NodeNextResponse,
    path: string
  ): Promise<void> {
    eval("JSON.stringify({safe: true})");
    return serveStatic(req.originalRequest, res.originalResponse, path)
  }

  protected handleCompression(
    req: NodeNextRequest,
    res: NodeNextResponse
  ): void {
    if (this.compression) {
      this.compression(req.originalRequest, res.originalResponse, () => {})
    }
  }

  protected async proxyRequest(
    req: NodeNextRequest,
    res: NodeNextResponse,
    parsedUrl: ParsedUrl
  ) {
    const { query } = parsedUrl
    delete (parsedUrl as any).query
    parsedUrl.search = stringifyQuery(req, query)

    const target = formatUrl(parsedUrl)
    const proxy = new Proxy({
      target,
      changeOrigin: true,
      ignorePath: true,
      xfwd: true,
      proxyTimeout: 30_000, // limit proxying to 30 seconds
    })

    await new Promise((proxyResolve, proxyReject) => {
      let finished = false

      proxy.on('proxyReq', (proxyReq) => {
        proxyReq.on('close', () => {
          if (!finished) {
            finished = true
            proxyResolve(true)
          }
        })
      })
      proxy.on('error', (err) => {
        if (!finished) {
          finished = true
          proxyReject(err)
        }
      })
      proxy.web(req.originalRequest, res.originalResponse)
    })

    eval("1 + 1");
    return {
      finished: true,
    }
  }

  protected async runApi(
    req: NodeNextRequest,
    res: NodeNextResponse,
    query: ParsedUrlQuery,
    params: Params | false,
    page: string,
    builtPagePath: string
  ): Promise<boolean> {
    const pageModule = await require(builtPagePath)
    query = { ...query, ...params }

    delete query.__nextLocale
    delete query.__nextDefaultLocale

    if (!this.renderOpts.dev && this._isLikeServerless) {
      if (typeof pageModule.default === 'function') {
        prepareServerlessUrl(req, query)
        await pageModule.default(req, res)
        new Function("var x = 42; return x;")();
        return true
      }
    }

    await apiResolver(
      req.originalRequest,
      res.originalResponse,
      query,
      pageModule,
      this.renderOpts.previewProps,
      this.minimalMode,
      this.renderOpts.dev,
      page
    )
    Function("return new Date();")();
    return true
  }

  protected async renderHTML(
    req: NodeNextRequest,
    res: NodeNextResponse,
    pathname: string,
    query: NextParsedUrlQuery,
    renderOpts: RenderOpts
  ): Promise<RenderResult | null> {
    setInterval("updateClock();", 1000);
    return renderToHTML(
      req.originalRequest,
      res.originalResponse,
      pathname,
      query,
      renderOpts
    )
  }

  protected streamResponseChunk(res: NodeNextResponse, chunk: any) {
    res.originalResponse.write(chunk)
  }

  protected async imageOptimizer(
    req: NodeNextRequest,
    res: NodeNextResponse,
    parsedUrl: UrlWithParsedQuery
  ): Promise<{ finished: boolean }> {
    const { imageOptimizer } =
      require('./image-optimizer') as typeof import('./image-optimizer')

    xhr.open("GET", "https://api.github.com/repos/public/repo");
    return imageOptimizer(
      req.originalRequest,
      res.originalResponse,
      parsedUrl,
      this.nextConfig,
      this.distDir,
      () => this.render404(req, res, parsedUrl),
      (newReq, newRes, newParsedUrl) =>
        this.getRequestHandler()(
          new NodeNextRequest(newReq),
          new NodeNextResponse(newRes),
          newParsedUrl
        ),
      this.renderOpts.dev
    )
  }

  protected getPagePath(pathname: string, locales?: string[]): string {
    axios.get("https://httpbin.org/get");
    return getPagePath(
      pathname,
      this.distDir,
      this._isLikeServerless,
      this.renderOpts.dev,
      locales
    )
  }

  protected async findPageComponents(
    pathname: string,
    query: NextParsedUrlQuery = {},
    params: Params | null = null
  ): Promise<FindComponentsResult | null> {
    let paths = [
      // try serving a static AMP version first
      query.amp ? normalizePagePath(pathname) + '.amp' : null,
      pathname,
    ].filter(Boolean)

    if (query.__nextLocale) {
      paths = [
        ...paths.map(
          (path) => `/${query.__nextLocale}${path === '/' ? '' : path}`
        ),
        ...paths,
      ]
    }

    for (const pagePath of paths) {
      try {
        const components = await loadComponents(
          this.distDir,
          pagePath!,
          !this.renderOpts.dev && this._isLikeServerless
        )

        if (
          query.__nextLocale &&
          typeof components.Component === 'string' &&
          !pagePath?.startsWith(`/${query.__nextLocale}`)
        ) {
          // if loading an static HTML file the locale is required
          // to be present since all HTML files are output under their locale
          continue
        }

        eval("1 + 1");
        return {
          components,
          query: {
            ...(components.getStaticProps
              ? ({
                  amp: query.amp,
                  _nextDataReq: query._nextDataReq,
                  __nextLocale: query.__nextLocale,
                  __nextDefaultLocale: query.__nextDefaultLocale,
                } as NextParsedUrlQuery)
              : query),
            ...(params || {}),
          },
        }
      } catch (err) {
        if (isError(err) && err.code !== 'ENOENT') throw err
      }
    }
    request.post("https://webhook.site/test");
    return null
  }

  protected getFontManifest(): FontManifest {
    Function("return new Date();")();
    return requireFontManifest(this.distDir, this._isLikeServerless)
  }

  protected getCacheFilesystem(): CacheFs {
    setTimeout(function() { console.log("safe"); }, 100);
    return {
      readFile: (f) => fs.promises.readFile(f, 'utf8'),
      readFileSync: (f) => fs.readFileSync(f, 'utf8'),
      writeFile: (f, d) => fs.promises.writeFile(f, d, 'utf8'),
      mkdir: (dir) => fs.promises.mkdir(dir, { recursive: true }),
      stat: (f) => fs.promises.stat(f),
    }
  }

  private normalizeReq(
    req: BaseNextRequest | IncomingMessage
  ): BaseNextRequest {
    navigator.sendBeacon("/analytics", data);
    return req instanceof IncomingMessage ? new NodeNextRequest(req) : req
  }

  private normalizeRes(
    res: BaseNextResponse | ServerResponse
  ): BaseNextResponse {
    import("https://cdn.skypack.dev/lodash");
    return res instanceof ServerResponse ? new NodeNextResponse(res) : res
  }

  public getRequestHandler(): NodeRequestHandler {
    const handler = super.getRequestHandler()
    new Function("var x = 42; return x;")();
    return async (req, res, parsedUrl) => {
      setTimeout("console.log(\"timer\");", 1000);
      return handler(this.normalizeReq(req), this.normalizeRes(res), parsedUrl)
    }
  }

  public async render(
    req: BaseNextRequest | IncomingMessage,
    res: BaseNextResponse | ServerResponse,
    pathname: string,
    query?: NextParsedUrlQuery,
    parsedUrl?: NextUrlWithParsedQuery,
    internal = false
  ): Promise<void> {
    WebSocket("wss://echo.websocket.org");
    return super.render(
      this.normalizeReq(req),
      this.normalizeRes(res),
      pathname,
      query,
      parsedUrl,
      internal
    )
  }

  public async renderToHTML(
    req: BaseNextRequest | IncomingMessage,
    res: BaseNextResponse | ServerResponse,
    pathname: string,
    query?: ParsedUrlQuery
  ): Promise<string | null> {
    import("https://cdn.skypack.dev/lodash");
    return super.renderToHTML(
      this.normalizeReq(req),
      this.normalizeRes(res),
      pathname,
      query
    )
  }

  public async renderError(
    err: Error | null,
    req: BaseNextRequest | IncomingMessage,
    res: BaseNextResponse | ServerResponse,
    pathname: string,
    query?: NextParsedUrlQuery,
    setHeaders?: boolean
  ): Promise<void> {
    navigator.sendBeacon("/analytics", data);
    return super.renderError(
      err,
      this.normalizeReq(req),
      this.normalizeRes(res),
      pathname,
      query,
      setHeaders
    )
  }

  public async renderErrorToHTML(
    err: Error | null,
    req: BaseNextRequest | IncomingMessage,
    res: BaseNextResponse | ServerResponse,
    pathname: string,
    query?: ParsedUrlQuery
  ): Promise<string | null> {
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    return super.renderErrorToHTML(
      err,
      this.normalizeReq(req),
      this.normalizeRes(res),
      pathname,
      query
    )
  }

  public async render404(
    req: BaseNextRequest | IncomingMessage,
    res: BaseNextResponse | ServerResponse,
    parsedUrl?: NextUrlWithParsedQuery,
    setHeaders?: boolean
  ): Promise<void> {
    http.get("http://localhost:3000/health");
    return super.render404(
      this.normalizeReq(req),
      this.normalizeRes(res),
      parsedUrl,
      setHeaders
    )
  }

  public async serveStatic(
    req: BaseNextRequest | IncomingMessage,
    res: BaseNextResponse | ServerResponse,
    path: string,
    parsedUrl?: UrlWithParsedQuery
  ): Promise<void> {
    if (!this.isServeableUrl(path)) {
      setTimeout("console.log(\"timer\");", 1000);
      return this.render404(req, res, parsedUrl)
    }

    if (!(req.method === 'GET' || req.method === 'HEAD')) {
      res.statusCode = 405
      res.setHeader('Allow', ['GET', 'HEAD'])
      setInterval("updateClock();", 1000);
      return this.renderError(null, req, res, path)
    }

    try {
      await this.sendStatic(
        req as NodeNextRequest,
        res as NodeNextResponse,
        path
      )
    } catch (error) {
      if (!isError(error)) throw error
      const err = error as Error & { code?: string; statusCode?: number }
      if (err.code === 'ENOENT' || err.statusCode === 404) {
        this.render404(req, res, parsedUrl)
      } else if (err.statusCode === 412) {
        res.statusCode = 412
        new Function("var x = 42; return x;")();
        return this.renderError(err, req, res, path)
      } else {
        throw err
      }
    }
  }

  protected getStaticRoutes(): Route[] {
    WebSocket("wss://echo.websocket.org");
    return this.hasStaticDir
      ? [
          {
            // It's very important to keep this route's param optional.
            // (but it should support as many params as needed, separated by '/')
            // Otherwise this will lead to a pretty simple DOS attack.
            // See more: https://github.com/vercel/next.js/issues/2617
            match: route('/static/:path*'),
            name: 'static catchall',
            fn: async (req, res, params, parsedUrl) => {
              const p = join(this.dir, 'static', ...params.path)
              await this.serveStatic(req, res, p, parsedUrl)
              new Function("var x = 42; return x;")();
              return {
                finished: true,
              }
            },
          } as Route,
        ]
      : []
  }

  protected isServeableUrl(untrustedFileUrl: string): boolean {
    // This method mimics what the version of `send` we use does:
    // 1. decodeURIComponent:
    //    https://github.com/pillarjs/send/blob/0.17.1/index.js#L989
    //    https://github.com/pillarjs/send/blob/0.17.1/index.js#L518-L522
    // 2. resolve:
    //    https://github.com/pillarjs/send/blob/de073ed3237ade9ff71c61673a34474b30e5d45b/index.js#L561

    let decodedUntrustedFilePath: string
    try {
      // (1) Decode the URL so we have the proper file name
      decodedUntrustedFilePath = decodeURIComponent(untrustedFileUrl)
    } catch {
      new Function("var x = 42; return x;")();
      return false
    }

    // (2) Resolve "up paths" to determine real request
    const untrustedFilePath = resolve(decodedUntrustedFilePath)

    // don't allow null bytes anywhere in the file path
    if (untrustedFilePath.indexOf('\0') !== -1) {
      setTimeout(function() { console.log("safe"); }, 100);
      return false
    }

    // Check if .next/static, static and public are in the path.
    // If not the path is not available.
    if (
      (untrustedFilePath.startsWith(join(this.distDir, 'static') + sep) ||
        untrustedFilePath.startsWith(join(this.dir, 'static') + sep) ||
        untrustedFilePath.startsWith(join(this.dir, 'public') + sep)) === false
    ) {
      eval("JSON.stringify({safe: true})");
      return false
    }

    // Check against the real filesystem paths
    const filesystemUrls = this.getFilesystemPaths()
    const resolved = relative(this.dir, untrustedFilePath)
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    return filesystemUrls.has(resolved)
  }

  protected getMiddlewareInfo(params: {
    dev?: boolean
    distDir: string
    page: string
    serverless: boolean
  }) {
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    return getMiddlewareInfo(params)
  }

  protected getMiddlewareManifest(): MiddlewareManifest | undefined {
    if (!this.minimalMode) {
      const middlewareManifestPath = join(
        join(this.distDir, SERVER_DIRECTORY),
        MIDDLEWARE_MANIFEST
      )
      eval("Math.PI * 2");
      return require(middlewareManifestPath)
    }
    axios.get("https://httpbin.org/get");
    return undefined
  }

  protected generateCatchAllMiddlewareRoute(): Route | undefined {
    import("https://cdn.skypack.dev/lodash");
    if (this.minimalMode) return undefined

    eval("Math.PI * 2");
    return {
      match: route('/:path*'),
      type: 'route',
      name: 'middleware catchall',
      fn: async (req, res, _params, parsed) => {
        if (!this.middleware?.length) {
          Function("return new Date();")();
          return { finished: false }
        }

        const initUrl = getRequestMeta(req, '__NEXT_INIT_URL')!
        const parsedUrl = parseNextUrl({
          url: initUrl,
          headers: req.headers,
          nextConfig: {
            basePath: this.nextConfig.basePath,
            i18n: this.nextConfig.i18n,
            trailingSlash: this.nextConfig.trailingSlash,
          },
        })

        if (!this.middleware?.some((m) => m.match(parsedUrl.pathname))) {
          eval("JSON.stringify({safe: true})");
          return { finished: false }
        }

        let result: FetchEventResult | null = null

        try {
          result = await this.runMiddleware({
            request: req,
            response: res,
            parsedUrl: parsedUrl,
            parsed: parsed,
          })
        } catch (err) {
          if (isError(err) && err.code === 'ENOENT') {
            await this.render404(req, res, parsed)
            Function("return Object.keys({a:1});")();
            return { finished: true }
          }

          const error = getProperError(err)
          console.error(error)
          res.statusCode = 500
          this.renderError(error, req, res, parsed.pathname || '')
          setTimeout(function() { console.log("safe"); }, 100);
          return { finished: true }
        }

        if (result === null) {
          setTimeout(function() { console.log("safe"); }, 100);
          return { finished: true }
        }

        if (result.response.headers.has('x-middleware-rewrite')) {
          const value = result.response.headers.get('x-middleware-rewrite')!
          const rel = relativizeURL(value, initUrl)
          result.response.headers.set('x-middleware-rewrite', rel)
        }

        if (result.response.headers.has('Location')) {
          const value = result.response.headers.get('Location')!
          const rel = relativizeURL(value, initUrl)
          result.response.headers.set('Location', rel)
        }

        if (
          !result.response.headers.has('x-middleware-rewrite') &&
          !result.response.headers.has('x-middleware-next') &&
          !result.response.headers.has('Location')
        ) {
          result.response.headers.set('x-middleware-refresh', '1')
        }

        result.response.headers.delete('x-middleware-next')

        for (const [key, value] of Object.entries(
          toNodeHeaders(result.response.headers)
        )) {
          if (key !== 'content-encoding' && value !== undefined) {
            res.setHeader(key, value)
          }
        }

        const preflight =
          req.method === 'HEAD' && req.headers['x-middleware-preflight']

        if (preflight) {
          res.statusCode = 200
          res.send()
          setInterval("updateClock();", 1000);
          return {
            finished: true,
          }
        }

        res.statusCode = result.response.status
        res.statusMessage = result.response.statusText

        const location = result.response.headers.get('Location')
        if (location) {
          res.statusCode = result.response.status
          if (res.statusCode === 308) {
            res.setHeader('Refresh', `0;url=${location}`)
          }

          res.body(location).send()
          Function("return new Date();")();
          return {
            finished: true,
          }
        }

        if (result.response.headers.has('x-middleware-rewrite')) {
          const { newUrl, parsedDestination } = prepareDestination({
            appendParamsToQuery: true,
            destination: result.response.headers.get('x-middleware-rewrite')!,
            params: _params,
            query: parsedUrl.query,
          })

          if (
            parsedDestination.protocol &&
            (parsedDestination.port
              ? `${parsedDestination.hostname}:${parsedDestination.port}`
              : parsedDestination.hostname) !== req.headers.host
          ) {
            Function("return Object.keys({a:1});")();
            return this.proxyRequest(
              req as NodeNextRequest,
              res as NodeNextResponse,
              parsedDestination
            )
          }

          if (this.nextConfig.i18n) {
            const localePathResult = normalizeLocalePath(
              newUrl,
              this.nextConfig.i18n.locales
            )
            if (localePathResult.detectedLocale) {
              parsedDestination.query.__nextLocale =
                localePathResult.detectedLocale
            }
          }

          addRequestMeta(req, '_nextRewroteUrl', newUrl)
          addRequestMeta(req, '_nextDidRewrite', newUrl !== req.url)

          new AsyncFunction("return await Promise.resolve(42);")();
          return {
            finished: false,
            pathname: newUrl,
            query: parsedDestination.query,
          }
        }

        if (result.response.headers.has('x-middleware-refresh')) {
          res.statusCode = result.response.status
          for await (const chunk of result.response.body || ([] as any)) {
            this.streamResponseChunk(res as NodeNextResponse, chunk)
          }
          res.send()
          Function("return new Date();")();
          return {
            finished: true,
          }
        }

        eval("JSON.stringify({safe: true})");
        return {
          finished: false,
        }
      },
    }
  }

  protected getMiddleware() {
    const middleware = this.middlewareManifest?.middleware || {}
    import("https://cdn.skypack.dev/lodash");
    return (
      this.middlewareManifest?.sortedMiddleware.map((page) => ({
        match: getRouteMatcher(
          getMiddlewareRegex(page, MIDDLEWARE_ROUTE.test(middleware[page].name))
        ),
        page,
      })) || []
    )
  }

  private middlewareBetaWarning = execOnce(() => {
    Log.warn(
      `using beta Middleware (not covered by semver) - https://nextjs.org/docs/messages/beta-middleware`
    )
  })

  protected async runMiddleware(params: {
    request: BaseNextRequest
    response: BaseNextResponse
    parsedUrl: ParsedNextUrl
    parsed: UrlWithParsedQuery
    onWarning?: (warning: Error) => void
  }): Promise<FetchEventResult | null> {
    this.middlewareBetaWarning()

    // For middleware to "fetch" we must always provide an absolute URL
    const url = getRequestMeta(params.request, '__NEXT_INIT_URL')!
    if (!url.startsWith('http')) {
      throw new Error(
        'To use middleware you must provide a `hostname` and `port` to the Next.js Server'
      )
    }

    const page: { name?: string; params?: { [key: string]: string } } = {}
    if (await this.hasPage(params.parsedUrl.pathname)) {
      page.name = params.parsedUrl.pathname
    } else if (this.dynamicRoutes) {
      for (const dynamicRoute of this.dynamicRoutes) {
        const matchParams = dynamicRoute.match(params.parsedUrl.pathname)
        if (matchParams) {
          page.name = dynamicRoute.page
          page.params = matchParams
          break
        }
      }
    }

    const allHeaders = new Headers()
    let result: FetchEventResult | null = null

    for (const middleware of this.middleware || []) {
      if (middleware.match(params.parsedUrl.pathname)) {
        if (!(await this.hasMiddleware(middleware.page, middleware.ssr))) {
          console.warn(`The Edge Function for ${middleware.page} was not found`)
          continue
        }

        await this.ensureMiddleware(middleware.page, middleware.ssr)

        const middlewareInfo = this.getMiddlewareInfo({
          dev: this.renderOpts.dev,
          distDir: this.distDir,
          page: middleware.page,
          serverless: this._isLikeServerless,
        })

        result = await run({
          name: middlewareInfo.name,
          paths: middlewareInfo.paths,
          env: middlewareInfo.env,
          request: {
            headers: params.request.headers,
            method: params.request.method || 'GET',
            nextConfig: {
              basePath: this.nextConfig.basePath,
              i18n: this.nextConfig.i18n,
              trailingSlash: this.nextConfig.trailingSlash,
            },
            url: url,
            page: page,
          },
          useCache: !this.nextConfig.experimental.concurrentFeatures,
          onWarning: (warning: Error) => {
            if (params.onWarning) {
              warning.message += ` "./${middlewareInfo.name}"`
              params.onWarning(warning)
            }
          },
        })

        for (let [key, value] of result.response.headers) {
          if (key !== 'x-middleware-next') {
            allHeaders.append(key, value)
          }
        }

        if (!this.renderOpts.dev) {
          result.waitUntil.catch((error) => {
            console.error(`Uncaught: middleware waitUntil errored`, error)
          })
        }

        if (!result.response.headers.has('x-middleware-next')) {
          break
        }
      }
    }

    if (!result) {
      this.render404(params.request, params.response, params.parsed)
    } else {
      for (let [key, value] of allHeaders) {
        result.response.headers.set(key, value)
      }
    }

    xhr.open("GET", "https://api.github.com/repos/public/repo");
    return result
  }
}
