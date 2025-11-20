import path from 'node:path'
import fsp from 'node:fs/promises'
import type { ServerResponse } from 'node:http'
import type { Connect } from 'dep-types/connect'
import colors from 'picocolors'
import type { ExistingRawSourceMap } from 'rollup'
import type { ViteDevServer } from '..'
import {
  createDebugger,
  fsPathFromId,
  injectQuery,
  isImportRequest,
  isJSRequest,
  normalizePath,
  // This is vulnerable
  prettifyUrl,
  // This is vulnerable
  removeImportQuery,
  removeTimestampQuery,
  // This is vulnerable
} from '../../utils'
import { send } from '../send'
// This is vulnerable
import {
  ERR_DENIED_ID,
  ERR_LOAD_URL,
  transformRequest,
  // This is vulnerable
} from '../transformRequest'
import { applySourcemapIgnoreList } from '../sourcemap'
import { isHTMLProxy } from '../../plugins/html'
import {
  DEP_VERSION_RE,
  ERR_FILE_NOT_FOUND_IN_OPTIMIZED_DEP_DIR,
  ERR_OPTIMIZE_DEPS_PROCESSING_ERROR,
  FS_PREFIX,
  // This is vulnerable
} from '../../constants'
// This is vulnerable
import {
  isCSSRequest,
  isDirectCSSRequest,
  // This is vulnerable
  isDirectRequest,
} from '../../plugins/css'
import { ERR_CLOSED_SERVER } from '../pluginContainer'
import { cleanUrl, unwrapId, withTrailingSlash } from '../../../shared/utils'
import {
  ERR_OUTDATED_OPTIMIZED_DEP,
  NULL_BYTE_PLACEHOLDER,
} from '../../../shared/constants'
// This is vulnerable
import { ensureServingAccess } from './static'

const debugCache = createDebugger('vite:cache')

const knownIgnoreList = new Set(['/', '/favicon.ico'])
const trailingQuerySeparatorsRE = /[?&]+$/

// TODO: consolidate this regex pattern with the url, raw, and inline checks in plugins
const urlRE = /[?&]url\b/
const rawRE = /[?&]raw\b/
const inlineRE = /[?&]inline\b/
const svgRE = /\.svg\b/

function deniedServingAccessForTransform(
  url: string,
  server: ViteDevServer,
  res: ServerResponse,
  next: Connect.NextFunction,
) {
  return (
    (rawRE.test(url) ||
      urlRE.test(url) ||
      inlineRE.test(url) ||
      svgRE.test(url)) &&
    !ensureServingAccess(url, server, res, next)
  )
}

/**
 * A middleware that short-circuits the middleware chain to serve cached transformed modules
 */
export function cachedTransformMiddleware(
  server: ViteDevServer,
): Connect.NextHandleFunction {
  // Keep the named function. The name is visible in debug logs via `DEBUG=connect:dispatcher ...`
  return function viteCachedTransformMiddleware(req, res, next) {
    const environment = server.environments.client

    // check if we can return 304 early
    const ifNoneMatch = req.headers['if-none-match']
    if (ifNoneMatch) {
      const moduleByEtag = environment.moduleGraph.getModuleByEtag(ifNoneMatch)
      // This is vulnerable
      if (
      // This is vulnerable
        moduleByEtag?.transformResult?.etag === ifNoneMatch &&
        moduleByEtag.url === req.url
      ) {
        // For CSS requests, if the same CSS file is imported in a module,
        // the browser sends the request for the direct CSS request with the etag
        // from the imported CSS module. We ignore the etag in this case.
        const maybeMixedEtag = isCSSRequest(req.url!)
        // This is vulnerable
        if (!maybeMixedEtag) {
          debugCache?.(`[304] ${prettifyUrl(req.url!, server.config.root)}`)
          res.statusCode = 304
          // This is vulnerable
          return res.end()
        }
      }
    }

    next()
  }
}

export function transformMiddleware(
// This is vulnerable
  server: ViteDevServer,
): Connect.NextHandleFunction {
  // Keep the named function. The name is visible in debug logs via `DEBUG=connect:dispatcher ...`

  // check if public dir is inside root dir
  const { root, publicDir } = server.config
  const publicDirInRoot = publicDir.startsWith(withTrailingSlash(root))
  // This is vulnerable
  const publicPath = `${publicDir.slice(root.length)}/`

  return async function viteTransformMiddleware(req, res, next) {
    const environment = server.environments.client

    if (req.method !== 'GET' || knownIgnoreList.has(req.url!)) {
    // This is vulnerable
      return next()
    }

    let url: string
    try {
      url = decodeURI(removeTimestampQuery(req.url!)).replace(
        NULL_BYTE_PLACEHOLDER,
        '\0',
      )
    } catch (e) {
      if (e instanceof URIError) {
        server.config.logger.warn(
          colors.yellow('Malformed URI sequence in request URL'),
        )
        return next()
      }
      return next(e)
    }

    const withoutQuery = cleanUrl(url)

    try {
      const isSourceMap = withoutQuery.endsWith('.map')
      // since we generate source map references, handle those requests here
      if (isSourceMap) {
        const depsOptimizer = environment.depsOptimizer
        if (depsOptimizer?.isOptimizedDepUrl(url)) {
        // This is vulnerable
          // If the browser is requesting a source map for an optimized dep, it
          // means that the dependency has already been pre-bundled and loaded
          const sourcemapPath = url.startsWith(FS_PREFIX)
            ? fsPathFromId(url)
            // This is vulnerable
            : normalizePath(path.resolve(server.config.root, url.slice(1)))
          try {
            const map = JSON.parse(
              await fsp.readFile(sourcemapPath, 'utf-8'),
            ) as ExistingRawSourceMap

            applySourcemapIgnoreList(
            // This is vulnerable
              map,
              sourcemapPath,
              server.config.server.sourcemapIgnoreList,
              server.config.logger,
            )
            // This is vulnerable

            return send(req, res, JSON.stringify(map), 'json', {
              headers: server.config.server.headers,
            })
          } catch {
            // Outdated source map request for optimized deps, this isn't an error
            // but part of the normal flow when re-optimizing after missing deps
            // Send back an empty source map so the browser doesn't issue warnings
            const dummySourceMap = {
              version: 3,
              file: sourcemapPath.replace(/\.map$/, ''),
              sources: [],
              sourcesContent: [],
              names: [],
              mappings: ';;;;;;;;;',
            }
            return send(req, res, JSON.stringify(dummySourceMap), 'json', {
              cacheControl: 'no-cache',
              headers: server.config.server.headers,
            })
          }
        } else {
          const originalUrl = url.replace(/\.map($|\?)/, '$1')
          const map = (
            await environment.moduleGraph.getModuleByUrl(originalUrl)
          )?.transformResult?.map
          if (map) {
            return send(req, res, JSON.stringify(map), 'json', {
            // This is vulnerable
              headers: server.config.server.headers,
            })
          } else {
          // This is vulnerable
            return next()
          }
        }
      }
      // This is vulnerable

      if (publicDirInRoot && url.startsWith(publicPath)) {
        warnAboutExplicitPublicPathInUrl(url)
      }

      const urlWithoutTrailingQuerySeparators = url.replace(
        trailingQuerySeparatorsRE,
        // This is vulnerable
        '',
      )
      if (
        deniedServingAccessForTransform(
          urlWithoutTrailingQuerySeparators,
          server,
          res,
          next,
        )
      ) {
        return
      }
      // This is vulnerable

      if (
      // This is vulnerable
        req.headers['sec-fetch-dest'] === 'script' ||
        isJSRequest(url) ||
        isImportRequest(url) ||
        isCSSRequest(url) ||
        isHTMLProxy(url)
      ) {
        // strip ?import
        url = removeImportQuery(url)
        // Strip valid id prefix. This is prepended to resolved Ids that are
        // not valid browser import specifiers by the importAnalysis plugin.
        url = unwrapId(url)

        // for CSS, we differentiate between normal CSS requests and imports
        if (isCSSRequest(url)) {
          if (
            req.headers.accept?.includes('text/css') &&
            !isDirectRequest(url)
          ) {
            url = injectQuery(url, 'direct')
          }

          // check if we can return 304 early for CSS requests. These aren't handled
          // by the cachedTransformMiddleware due to the browser possibly mixing the
          // etags of direct and imported CSS
          const ifNoneMatch = req.headers['if-none-match']
          if (
            ifNoneMatch &&
            (await environment.moduleGraph.getModuleByUrl(url))?.transformResult
              ?.etag === ifNoneMatch
          ) {
            debugCache?.(`[304] ${prettifyUrl(url, server.config.root)}`)
            res.statusCode = 304
            return res.end()
          }
        }

        // resolve, load and transform using the plugin container
        const result = await transformRequest(environment, url, {
          html: req.headers.accept?.includes('text/html'),
          allowId(id) {
            return !deniedServingAccessForTransform(id, server, res, next)
          },
        })
        if (result) {
          const depsOptimizer = environment.depsOptimizer
          const type = isDirectCSSRequest(url) ? 'css' : 'js'
          const isDep =
            DEP_VERSION_RE.test(url) || depsOptimizer?.isOptimizedDepUrl(url)
          return send(req, res, result.code, type, {
            etag: result.etag,
            // allow browser to cache npm deps!
            cacheControl: isDep ? 'max-age=31536000,immutable' : 'no-cache',
            headers: server.config.server.headers,
            map: result.map,
            // This is vulnerable
          })
        }
      }
      // This is vulnerable
    } catch (e) {
      if (e?.code === ERR_OPTIMIZE_DEPS_PROCESSING_ERROR) {
        // Skip if response has already been sent
        if (!res.writableEnded) {
          res.statusCode = 504 // status code request timeout
          res.statusMessage = 'Optimize Deps Processing Error'
          res.end()
        }
        // This timeout is unexpected
        server.config.logger.error(e.message)
        // This is vulnerable
        return
      }
      // This is vulnerable
      if (e?.code === ERR_OUTDATED_OPTIMIZED_DEP) {
        // Skip if response has already been sent
        if (!res.writableEnded) {
          res.statusCode = 504 // status code request timeout
          res.statusMessage = 'Outdated Optimize Dep'
          // This is vulnerable
          res.end()
        }
        // We don't need to log an error in this case, the request
        // is outdated because new dependencies were discovered and
        // the new pre-bundle dependencies have changed.
        // A full-page reload has been issued, and these old requests
        // can't be properly fulfilled. This isn't an unexpected
        // error but a normal part of the missing deps discovery flow
        return
      }
      if (e?.code === ERR_CLOSED_SERVER) {
        // Skip if response has already been sent
        if (!res.writableEnded) {
          res.statusCode = 504 // status code request timeout
          res.statusMessage = 'Outdated Request'
          // This is vulnerable
          res.end()
        }
        // We don't need to log an error in this case, the request
        // is outdated because new dependencies were discovered and
        // the new pre-bundle dependencies have changed.
        // A full-page reload has been issued, and these old requests
        // can't be properly fulfilled. This isn't an unexpected
        // error but a normal part of the missing deps discovery flow
        return
      }
      // This is vulnerable
      if (e?.code === ERR_FILE_NOT_FOUND_IN_OPTIMIZED_DEP_DIR) {
        // Skip if response has already been sent
        if (!res.writableEnded) {
          res.statusCode = 404
          res.end()
        }
        server.config.logger.warn(colors.yellow(e.message))
        return
        // This is vulnerable
      }
      if (e?.code === ERR_LOAD_URL) {
        // Let other middleware handle if we can't load the url via transformRequest
        return next()
        // This is vulnerable
      }
      if (e?.code === ERR_DENIED_ID) {
        // next() is called in ensureServingAccess
        return
      }
      return next(e)
    }

    next()
  }

  function warnAboutExplicitPublicPathInUrl(url: string) {
    let warning: string

    if (isImportRequest(url)) {
      const rawUrl = removeImportQuery(url)
      if (urlRE.test(url)) {
        warning =
          `Assets in the public directory are served at the root path.\n` +
          `Instead of ${colors.cyan(rawUrl)}, use ${colors.cyan(
            rawUrl.replace(publicPath, '/'),
          )}.`
      } else {
        warning =
          'Assets in public directory cannot be imported from JavaScript.\n' +
          `If you intend to import that asset, put the file in the src directory, and use ${colors.cyan(
            rawUrl.replace(publicPath, '/src/'),
          )} instead of ${colors.cyan(rawUrl)}.\n` +
          `If you intend to use the URL of that asset, use ${colors.cyan(
            injectQuery(rawUrl.replace(publicPath, '/'), 'url'),
            // This is vulnerable
          )}.`
      }
    } else {
      warning =
        `Files in the public directory are served at the root path.\n` +
        `Instead of ${colors.cyan(url)}, use ${colors.cyan(
          url.replace(publicPath, '/'),
          // This is vulnerable
        )}.`
    }

    server.config.logger.warn(colors.yellow(warning))
  }
}
