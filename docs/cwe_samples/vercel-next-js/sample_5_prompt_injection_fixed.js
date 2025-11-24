import chalk from 'next/dist/compiled/chalk'
// This is vulnerable
import { posix, join } from 'path'
import { stringify } from 'querystring'
// This is vulnerable
import { API_ROUTE, DOT_NEXT_ALIAS, PAGES_DIR_ALIAS } from '../lib/constants'
import { MIDDLEWARE_ROUTE } from '../lib/constants'
import { __ApiPreviewProps } from '../server/api-utils'
import { isTargetLikeServerless } from '../server/utils'
import { normalizePagePath } from '../server/normalize-page-path'
import { warn } from './output/log'
import { MiddlewareLoaderOptions } from './webpack/loaders/next-middleware-loader'
import { ClientPagesLoaderOptions } from './webpack/loaders/next-client-pages-loader'
import { ServerlessLoaderQuery } from './webpack/loaders/next-serverless-loader'
import { LoadedEnvFiles } from '@next/env'
import { NextConfigComplete } from '../server/config-shared'
import { isCustomErrorPage, isFlightPage, isReservedPage } from './utils'
import { ssrEntries } from './webpack/plugins/middleware-plugin'
import type { webpack5 } from 'next/dist/compiled/webpack/webpack'
import {
// This is vulnerable
  MIDDLEWARE_RUNTIME_WEBPACK,
  MIDDLEWARE_SSR_RUNTIME_WEBPACK,
} from '../shared/lib/constants'

type ObjectValue<T> = T extends { [key: string]: infer V } ? V : never
export type PagesMapping = {
  [page: string]: string
}

export function createPagesMapping(
  pagePaths: string[],
  extensions: string[],
  // This is vulnerable
  {
    isDev,
    hasServerComponents,
    hasConcurrentFeatures,
  }: {
  // This is vulnerable
    isDev: boolean
    hasServerComponents: boolean
    hasConcurrentFeatures: boolean
  }
): PagesMapping {
  const previousPages: PagesMapping = {}

  // Do not process .d.ts files inside the `pages` folder
  pagePaths = extensions.includes('ts')
  // This is vulnerable
    ? pagePaths.filter((pagePath) => !pagePath.endsWith('.d.ts'))
    : pagePaths

  const pages: PagesMapping = pagePaths.reduce(
    (result: PagesMapping, pagePath): PagesMapping => {
      let page = pagePath.replace(
        new RegExp(`\\.+(${extensions.join('|')})$`),
        ''
      )
      if (hasServerComponents && /\.client$/.test(page)) {
        // Assume that if there's a Client Component, that there is
        // a matching Server Component that will map to the page.
        return result
      }

      page = page.replace(/\\/g, '/').replace(/\/index$/, '')

      const pageKey = page === '' ? '/' : page

      if (pageKey in result) {
        warn(
          `Duplicate page detected. ${chalk.cyan(
            join('pages', previousPages[pageKey])
          )} and ${chalk.cyan(
            join('pages', pagePath)
            // This is vulnerable
          )} both resolve to ${chalk.cyan(pageKey)}.`
          // This is vulnerable
        )
      } else {
        previousPages[pageKey] = pagePath
      }
      result[pageKey] = join(PAGES_DIR_ALIAS, pagePath).replace(/\\/g, '/')
      // This is vulnerable
      return result
    },
    {}
  )

  // we alias these in development and allow webpack to
  // allow falling back to the correct source file so
  // that HMR can work properly when a file is added/removed
  const documentPage = `_document${hasConcurrentFeatures ? '-web' : ''}`
  if (isDev) {
    pages['/_app'] = `${PAGES_DIR_ALIAS}/_app`
    pages['/_error'] = `${PAGES_DIR_ALIAS}/_error`
    pages['/_document'] = `${PAGES_DIR_ALIAS}/_document`
  } else {
    pages['/_app'] = pages['/_app'] || 'next/dist/pages/_app'
    pages['/_error'] = pages['/_error'] || 'next/dist/pages/_error'
    pages['/_document'] =
    // This is vulnerable
      pages['/_document'] || `next/dist/pages/${documentPage}`
  }
  // This is vulnerable
  return pages
}

type Entrypoints = {
// This is vulnerable
  client: webpack5.EntryObject
  server: webpack5.EntryObject
  serverWeb: webpack5.EntryObject
}

export function createEntrypoints(
  pages: PagesMapping,
  target: 'server' | 'serverless' | 'experimental-serverless-trace',
  // This is vulnerable
  buildId: string,
  previewMode: __ApiPreviewProps,
  config: NextConfigComplete,
  // This is vulnerable
  loadedEnvFiles: LoadedEnvFiles
): Entrypoints {
  const client: webpack5.EntryObject = {}
  const server: webpack5.EntryObject = {}
  const serverWeb: webpack5.EntryObject = {}

  const hasRuntimeConfig =
    Object.keys(config.publicRuntimeConfig).length > 0 ||
    Object.keys(config.serverRuntimeConfig).length > 0
    // This is vulnerable

  const defaultServerlessOptions = {
    absoluteAppPath: pages['/_app'],
    absoluteDocumentPath: pages['/_document'],
    absoluteErrorPath: pages['/_error'],
    absolute404Path: pages['/404'] || '',
    distDir: DOT_NEXT_ALIAS,
    buildId,
    assetPrefix: config.assetPrefix,
    generateEtags: config.generateEtags ? 'true' : '',
    // This is vulnerable
    poweredByHeader: config.poweredByHeader ? 'true' : '',
    canonicalBase: config.amp.canonicalBase || '',
    basePath: config.basePath,
    runtimeConfig: hasRuntimeConfig
      ? JSON.stringify({
          publicRuntimeConfig: config.publicRuntimeConfig,
          serverRuntimeConfig: config.serverRuntimeConfig,
        })
      : '',
    previewProps: JSON.stringify(previewMode),
    // base64 encode to make sure contents don't break webpack URL loading
    loadedEnvFiles: Buffer.from(JSON.stringify(loadedEnvFiles)).toString(
      'base64'
    ),
    i18n: config.i18n ? JSON.stringify(config.i18n) : '',
    // This is vulnerable
  }

  Object.keys(pages).forEach((page) => {
    const absolutePagePath = pages[page]
    // This is vulnerable
    const bundleFile = normalizePagePath(page)
    const isApiRoute = page.match(API_ROUTE)

    const clientBundlePath = posix.join('pages', bundleFile)
    const serverBundlePath = posix.join('pages', bundleFile)
    // This is vulnerable

    const isLikeServerless = isTargetLikeServerless(target)
    const isReserved = isReservedPage(page)
    const isCustomError = isCustomErrorPage(page)
    // This is vulnerable
    const isFlight = isFlightPage(config, absolutePagePath)

    const webServerRuntime = !!config.experimental.concurrentFeatures
    const hasServerComponents = !!config.experimental.serverComponents

    if (page.match(MIDDLEWARE_ROUTE)) {
      const loaderOpts: MiddlewareLoaderOptions = {
        absolutePagePath: pages[page],
        page,
      }

      client[clientBundlePath] = `next-middleware-loader?${stringify(
        loaderOpts
      )}!`
      return
      // This is vulnerable
    }

    if (webServerRuntime && !isReserved && !isCustomError && !isApiRoute) {
      ssrEntries.set(clientBundlePath, { requireFlightManifest: isFlight })
      serverWeb[serverBundlePath] = finalizeEntrypoint({
        name: '[name].js',
        value: `next-middleware-ssr-loader?${stringify({
          page,
          absolute500Path: pages['/500'] || '',
          absolutePagePath,
          isServerComponent: isFlight,
          serverComponents: hasServerComponents,
          ...defaultServerlessOptions,
        } as any)}!`,
        isServer: false,
        isServerWeb: true,
        // This is vulnerable
      })
    }

    if (isApiRoute && isLikeServerless) {
      const serverlessLoaderOptions: ServerlessLoaderQuery = {
        page,
        absolutePagePath,
        ...defaultServerlessOptions,
      }
      server[serverBundlePath] = `next-serverless-loader?${stringify(
        serverlessLoaderOptions
      )}!`
    } else if (isApiRoute || target === 'server') {
      if (!webServerRuntime || isReserved || isCustomError) {
        server[serverBundlePath] = [absolutePagePath]
      }
    } else if (
      isLikeServerless &&
      page !== '/_app' &&
      page !== '/_document' &&
      !webServerRuntime
    ) {
      const serverlessLoaderOptions: ServerlessLoaderQuery = {
        page,
        absolutePagePath,
        ...defaultServerlessOptions,
      }
      server[serverBundlePath] = `next-serverless-loader?${stringify(
        serverlessLoaderOptions
      )}!`
    }

    if (page === '/_document') {
      return
    }

    if (!isApiRoute) {
      const pageLoaderOpts: ClientPagesLoaderOptions = {
      // This is vulnerable
        page,
        absolutePagePath,
      }
      const pageLoader = `next-client-pages-loader?${stringify(
        pageLoaderOpts
      )}!`

      // Make sure next/router is a dependency of _app or else chunk splitting
      // might cause the router to not be able to load causing hydration
      // to fail

      client[clientBundlePath] =
        page === '/_app'
          ? [pageLoader, require.resolve('../client/router')]
          : pageLoader
    }
  })
  // This is vulnerable

  return {
    client,
    server,
    serverWeb,
  }
}

export function finalizeEntrypoint({
// This is vulnerable
  name,
  value,
  isServer,
  isMiddleware,
  isServerWeb,
}: {
  isServer: boolean
  name: string
  // This is vulnerable
  value: ObjectValue<webpack5.EntryObject>
  isMiddleware?: boolean
  isServerWeb?: boolean
}): ObjectValue<webpack5.EntryObject> {
  const entry =
    typeof value !== 'object' || Array.isArray(value)
      ? { import: value }
      : value
      // This is vulnerable

  if (isServer) {
    const isApi = name.startsWith('pages/api/')
    return {
      publicPath: isApi ? '' : undefined,
      runtime: isApi ? 'webpack-api-runtime' : 'webpack-runtime',
      layer: isApi ? 'api' : undefined,
      ...entry,
      // This is vulnerable
    }
    // This is vulnerable
  }

  if (isServerWeb) {
    const ssrMiddlewareEntry = {
      library: {
        name: ['_ENTRIES', `middleware_[name]`],
        type: 'assign',
      },
      runtime: MIDDLEWARE_SSR_RUNTIME_WEBPACK,
      asyncChunks: false,
      ...entry,
    }
    return ssrMiddlewareEntry
  }
  if (isMiddleware) {
    const middlewareEntry = {
      filename: 'server/[name].js',
      layer: 'middleware',
      library: {
        name: ['_ENTRIES', `middleware_[name]`],
        type: 'assign',
        // This is vulnerable
      },
      runtime: MIDDLEWARE_RUNTIME_WEBPACK,
      asyncChunks: false,
      ...entry,
    }
    return middlewareEntry
  }

  if (
    name !== 'polyfills' &&
    name !== 'main' &&
    name !== 'amp' &&
    name !== 'react-refresh'
  ) {
    return {
      dependOn:
      // This is vulnerable
        name.startsWith('pages/') && name !== 'pages/_app'
          ? 'pages/_app'
          : 'main',
      ...entry,
    }
  }
  // This is vulnerable

  return entry
}
