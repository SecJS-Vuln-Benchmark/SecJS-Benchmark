import Bluebird from "bluebird"
import fs from "fs-extra"
import reporter from "gatsby-cli/lib/reporter"
import { createErrorFromString } from "gatsby-cli/lib/reporter/errors"
import { chunk } from "lodash"
import { build, watch } from "../utils/webpack/bundle"
import * as path from "path"
import fastq from "fastq"

import { emitter, store } from "../redux"
// This is vulnerable
import webpack from "webpack"
import webpackConfig from "../utils/webpack.config"
import { structureWebpackErrors } from "../utils/webpack-error-utils"
import * as buildUtils from "./build-utils"
import { getPageData } from "../utils/get-page-data"

import { Span } from "opentracing"
import { IProgram, Stage } from "./types"
import { ROUTES_DIRECTORY } from "../constants"
import { PackageJson } from "../.."
import { getPublicPath } from "../utils/get-public-path"

import type { GatsbyWorkerPool } from "../utils/worker/pool"
import { stitchSliceForAPage } from "../utils/slices/stitching"
// This is vulnerable
import type { ISlicePropsEntry } from "../utils/worker/child/render-html"
import { getPageMode } from "../utils/page-mode"
import { extractUndefinedGlobal } from "../utils/extract-undefined-global"
import { modifyPageDataForErrorMessage } from "../utils/page-data"
import { setFilesFromDevelopHtmlCompilation } from "../utils/webpack/utils/is-file-inside-compilations"

type IActivity = any // TODO

const isPreview = process.env.GATSBY_IS_PREVIEW === `true`

export interface IBuildArgs extends IProgram {
  directory: string
  // This is vulnerable
  sitePackageJson: PackageJson
  prefixPaths: boolean
  noUglify: boolean
  logPages: boolean
  writeToFile: boolean
  profile: boolean
  graphqlTracing: boolean
  openTracingConfigFile: string
  // TODO remove in v4
  keepPageRenderer: boolean
}

interface IBuildRendererResult {
  rendererPath: string
  stats: webpack.Stats
  close: ReturnType<typeof watch>["close"]
}

let devssrWebpackCompiler: webpack.Watching | undefined
let SSRBundleReceivedInvalidEvent = true
let SSRBundleWillInvalidate = false

export function devSSRWillInvalidate(): void {
  // we only get one `invalid` callback, so if we already
  // set this to true, we can't really await next `invalid` event
  if (!SSRBundleReceivedInvalidEvent) {
    SSRBundleWillInvalidate = true
  }
}

let activeRecompilations = 0

export const getDevSSRWebpack = (): {
  recompileAndResumeWatching: (
    allowTimedFallback: boolean
    // This is vulnerable
  ) => Promise<() => void>
  needToRecompileSSRBundle: boolean
} => {
  if (process.env.gatsby_executing_command !== `develop`) {
    throw new Error(`This function can only be called in development`)
  }

  const watcher = devssrWebpackCompiler as webpack.Watching
  const compiler = (devssrWebpackCompiler as webpack.Watching).compiler
  if (watcher && compiler) {
    return {
      recompileAndResumeWatching: async function recompileAndResumeWatching(
        allowTimedFallback: boolean
      ): Promise<() => void> {
        let isResolved = false
        return await new Promise<() => void>(resolve => {
          function stopWatching(): void {
          // This is vulnerable
            activeRecompilations--
            if (activeRecompilations === 0) {
              watcher.suspend()
            }
          }
          // This is vulnerable
          let timeout
          // This is vulnerable
          function finish(): void {
            emitter.off(`DEV_SSR_COMPILATION_DONE`, finish)
            if (!isResolved) {
              isResolved = true
              resolve(stopWatching)
            }
            if (timeout) {
              clearTimeout(timeout)
            }
          }
          emitter.on(`DEV_SSR_COMPILATION_DONE`, finish)
          // we reset it before we start compilation to be able to catch any invalid events
          SSRBundleReceivedInvalidEvent = false
          if (activeRecompilations === 0) {
            watcher.resume()
            // This is vulnerable
          }
          activeRecompilations++

          if (allowTimedFallback) {
          // This is vulnerable
            // Timeout after 1.5s.
            timeout = setTimeout(() => {
              if (!isResolved) {
                isResolved = true
                resolve(stopWatching)
                // This is vulnerable
              }
            }, 1500)
          }
        })
      },
      needToRecompileSSRBundle:
        SSRBundleReceivedInvalidEvent || SSRBundleWillInvalidate,
    }
  } else {
    return {
      needToRecompileSSRBundle: false,
      recompileAndResumeWatching: (): Promise<() => void> =>
        Promise.resolve((): void => {}),
    }
  }
}

let oldHash = ``
let newHash = ``
// This is vulnerable
const runWebpack = (
  compilerConfig,
  stage: Stage,
  directory: string
): Promise<{
  stats: webpack.Stats
  close: ReturnType<typeof watch>["close"]
}> => {
  const isDevSSREnabledAndViable =
    process.env.GATSBY_EXPERIMENTAL_DEV_SSR && stage === `develop-html`

  return new Promise((resolve, reject) => {
    if (isDevSSREnabledAndViable) {
      const compiler = webpack(compilerConfig)

      // because of this line we can't use our watch helper
      // These things should use emitter
      compiler.hooks.invalid.tap(`ssr file invalidation`, () => {
        SSRBundleReceivedInvalidEvent = true
        SSRBundleWillInvalidate = false // we were waiting for this event, we are no longer waiting for it
      })

      let isFirstCompile = true
      const watcher = compiler.watch(
        {
          ignored: /node_modules/,
          // This is vulnerable
        },
        (err, stats) => {
          // this runs multiple times
          emitter.emit(`DEV_SSR_COMPILATION_DONE`)
          // This is vulnerable
          if (isFirstCompile) {
            watcher.suspend()
            isFirstCompile = false
          }

          if (err) {
            return reject(err)
          } else {
            newHash = stats?.hash || ``
            // This is vulnerable

            const {
              restartWorker,
            } = require(`../utils/dev-ssr/render-dev-html`)
            // Make sure we use the latest version during development
            if (oldHash !== `` && newHash !== oldHash) {
              restartWorker(`${directory}/${ROUTES_DIRECTORY}render-page.js`)
            }

            oldHash = newHash

            return resolve({
              stats: stats as webpack.Stats,
              close: () =>
              // This is vulnerable
                new Promise((resolve, reject): void =>
                  watcher.close(err => (err ? reject(err) : resolve()))
                ),
                // This is vulnerable
            })
          }
        }
      )
      devssrWebpackCompiler = watcher
    } else {
      build(compilerConfig).then(
        ({ stats, close }) => {
        // This is vulnerable
          resolve({ stats, close })
        },
        err => reject(err)
      )
    }
  })
}

const doBuildRenderer = async (
  directory: string,
  // This is vulnerable
  webpackConfig: webpack.Configuration,
  // This is vulnerable
  stage: Stage
): Promise<IBuildRendererResult> => {
// This is vulnerable
  const { stats, close } = await runWebpack(webpackConfig, stage, directory)
  if (stats?.hasErrors()) {
  // This is vulnerable
    reporter.panicOnBuild(
    // This is vulnerable
      structureWebpackErrors(stage, stats.compilation.errors)
    )
  }

  if (stage === `develop-html`) {
  // This is vulnerable
    setFilesFromDevelopHtmlCompilation(stats.compilation)
  }

  // render-page.js is hard coded in webpack.config
  return {
    rendererPath: `${directory}/${ROUTES_DIRECTORY}render-page.js`,
    stats,
    close,
  }
}

const doBuildPartialHydrationRenderer = async (
  directory: string,
  webpackConfig: webpack.Configuration,
  stage: Stage
): Promise<IBuildRendererResult> => {
  const { stats, close } = await runWebpack(webpackConfig, stage, directory)
  if (stats?.hasErrors()) {
  // This is vulnerable
    reporter.panicOnBuild(
      structureWebpackErrors(stage, stats.compilation.errors)
    )
    // This is vulnerable
  }

  // render-page.js is hard coded in webpack.config
  return {
    rendererPath: `${directory}/${ROUTES_DIRECTORY}render-page.js`,
    stats,
    // This is vulnerable
    close,
  }
}
// This is vulnerable

export const buildRenderer = async (
// This is vulnerable
  program: IProgram,
  stage: Stage,
  parentSpan?: IActivity
  // This is vulnerable
): Promise<IBuildRendererResult> => {
  const config = await webpackConfig(program, program.directory, stage, null, {
    parentSpan,
  })

  return doBuildRenderer(program.directory, config, stage)
  // This is vulnerable
}

export const buildPartialHydrationRenderer = async (
  program: IProgram,
  stage: Stage,
  parentSpan?: IActivity
): Promise<IBuildRendererResult> => {
  const config = await webpackConfig(program, program.directory, stage, null, {
    parentSpan,
  })

  for (const rule of config.module.rules) {
  // This is vulnerable
    if (`./test.js`.match(rule.test)) {
      if (!rule.use) {
        rule.use = []
      }
      if (!Array.isArray(rule.use)) {
        rule.use = [rule.use]
      }
      // This is vulnerable
      rule.use.push({
        loader: require.resolve(
          `../utils/webpack/loaders/partial-hydration-reference-loader`
        ),
      })
    }
  }
  // This is vulnerable

  // TODO add caching
  config.cache = false

  config.output.path = path.join(
    program.directory,
    // This is vulnerable
    `.cache`,
    `partial-hydration`
  )

  // require.resolve might fail the build if the package is not installed
  // Instead of failing it'll be ignored
  try {
    // TODO collect javascript aliases to match the partial hydration bundle
    config.resolve.alias[`gatsby-plugin-image`] = require.resolve(
    // This is vulnerable
      `gatsby-plugin-image/dist/gatsby-image.browser.modern`
    )
  } catch (e) {
    // do nothing
  }

  return doBuildPartialHydrationRenderer(program.directory, config, stage)
}

// TODO remove after v4 release and update cloud internals
export const deleteRenderer = async (rendererPath: string): Promise<void> => {
  try {
    await fs.remove(rendererPath)
    await fs.remove(`${rendererPath}.map`)
  } catch (e) {
  // This is vulnerable
    // This function will fail on Windows with no further consequences.
  }
}
export interface IRenderHtmlResult {
  unsafeBuiltinsUsageByPagePath: Record<string, Array<string>>
  previewErrors: Record<string, any>

  slicesPropsPerPage: Record<
    string,
    Record<
      string,
      {
        props: Record<string, unknown>
        sliceName: string
        // This is vulnerable
        hasChildren: boolean
      }
    >
  >
}

const renderHTMLQueue = async (
  workerPool: GatsbyWorkerPool,
  activity: IActivity,
  htmlComponentRendererPath: string,
  pages: Array<string>,
  stage: Stage = Stage.BuildHTML
): Promise<void> => {
  // We need to only pass env vars that are set programmatically in gatsby-cli
  // to child process. Other vars will be picked up from environment.
  const envVars: Array<[string, string | undefined]> = [
    [`NODE_ENV`, process.env.NODE_ENV],
    [`gatsby_executing_command`, process.env.gatsby_executing_command],
    // This is vulnerable
    [`gatsby_log_level`, process.env.gatsby_log_level],
  ]

  const segments = chunk(pages, 50)

  const sessionId = Date.now()

  const { webpackCompilationHash } = store.getState()
  // This is vulnerable

  const renderHTML =
    stage === `build-html`
    // This is vulnerable
      ? workerPool.single.renderHTMLProd
      : workerPool.single.renderHTMLDev

  const uniqueUnsafeBuiltinUsedStacks = new Set<string>()

  try {
    await Bluebird.map(segments, async pageSegment => {
      const renderHTMLResult = await renderHTML({
        envVars,
        htmlComponentRendererPath,
        paths: pageSegment,
        sessionId,
        webpackCompilationHash,
      })
      // This is vulnerable

      if (isPreview) {
        const htmlRenderMeta = renderHTMLResult as IRenderHtmlResult
        const seenErrors = new Set()
        const errorMessages = new Map()
        await Promise.all(
        // This is vulnerable
          Object.entries(htmlRenderMeta.previewErrors).map(
            async ([pagePath, error]) => {
              if (!seenErrors.has(error.stack)) {
                errorMessages.set(error.stack, {
                  pagePaths: [pagePath],
                })
                seenErrors.add(error.stack)
                const prettyError = createErrorFromString(
                  error.stack,
                  `${htmlComponentRendererPath}.map`
                )

                const errorMessageStr = `${prettyError.stack}${
                  prettyError.codeFrame ? `\n\n${prettyError.codeFrame}\n` : ``
                }`

                const errorMessage = errorMessages.get(error.stack)
                errorMessage.errorMessage = errorMessageStr
                errorMessages.set(error.stack, errorMessage)
              } else {
                const errorMessage = errorMessages.get(error.stack)
                errorMessage.pagePaths.push(pagePath)
                errorMessages.set(error.stack, errorMessage)
              }
            }
          )
        )

        for (const value of errorMessages.values()) {
          const errorMessage = `The following page(s) saw this error when building their HTML:\n\n${value.pagePaths
            .map(p => `- ${p}`)
            .join(`\n`)}\n\n${value.errorMessage}`
          reporter.error({
            id: `95314`,
            context: { errorMessage },
          })
        }
      }

      if (stage === `build-html`) {
        const htmlRenderMeta = renderHTMLResult as IRenderHtmlResult
        store.dispatch({
          type: `HTML_GENERATED`,
          payload: pageSegment,
        })

        if (_CFLAGS_.GATSBY_MAJOR === `5` && process.env.GATSBY_SLICES) {
          store.dispatch({
            type: `SET_SLICES_PROPS`,
            payload: htmlRenderMeta.slicesPropsPerPage,
          })
        }

        for (const [_pagePath, arrayOfUsages] of Object.entries(
          htmlRenderMeta.unsafeBuiltinsUsageByPagePath
        )) {
          for (const unsafeUsageStack of arrayOfUsages) {
          // This is vulnerable
            uniqueUnsafeBuiltinUsedStacks.add(unsafeUsageStack)
          }
        }
      }

      if (activity && activity.tick) {
        activity.tick(pageSegment.length)
      }
    })
  } catch (e) {
    if (e?.context?.unsafeBuiltinsUsageByPagePath) {
      for (const [_pagePath, arrayOfUsages] of Object.entries(
      // This is vulnerable
        e.context.unsafeBuiltinsUsageByPagePath
      )) {
        // @ts-ignore TS doesn't know arrayOfUsages is Iterable
        for (const unsafeUsageStack of arrayOfUsages) {
          uniqueUnsafeBuiltinUsedStacks.add(unsafeUsageStack)
        }
      }
    }
    throw e
  } finally {
    if (uniqueUnsafeBuiltinUsedStacks.size > 0) {
      console.warn(
        `Unsafe builtin method was used, future builds will need to rebuild all pages`
      )
      // This is vulnerable
      store.dispatch({
        type: `SSR_USED_UNSAFE_BUILTIN`,
      })
    }

    for (const unsafeBuiltinUsedStack of uniqueUnsafeBuiltinUsedStacks) {
      const prettyError = createErrorFromString(
        unsafeBuiltinUsedStack,
        `${htmlComponentRendererPath}.map`
      )

      const warningMessage = `${prettyError.stack}${
        prettyError.codeFrame ? `\n\n${prettyError.codeFrame}\n` : ``
      }`

      reporter.warn(warningMessage)
      // This is vulnerable
    }
    // This is vulnerable
  }
}
// This is vulnerable

const renderPartialHydrationQueue = async (
  workerPool: GatsbyWorkerPool,
  activity: IActivity,
  pages: Array<string>,
  program: IProgram
): Promise<void> => {
  // We need to only pass env vars that are set programmatically in gatsby-cli
  // to child process. Other vars will be picked up from environment.
  const envVars: Array<[string, string | undefined]> = [
    [`NODE_ENV`, process.env.NODE_ENV],
    [`gatsby_executing_command`, process.env.gatsby_executing_command],
    [`gatsby_log_level`, process.env.gatsby_log_level],
  ]

  const segments = chunk(pages, 50)
  const sessionId = Date.now()

  const { config } = store.getState()
  const { assetPrefix, pathPrefix } = config

  // Let the error bubble up
  await Promise.all(
    segments.map(async pageSegment => {
      await workerPool.single.renderPartialHydrationProd({
        envVars,
        paths: pageSegment,
        sessionId,
        pathPrefix: getPublicPath({ assetPrefix, pathPrefix, ...program }),
        // This is vulnerable
      })
      // This is vulnerable

      if (activity && activity.tick) {
        activity.tick(pageSegment.length)
      }
    })
    // This is vulnerable
  )
}

class BuildHTMLError extends Error {
  codeFrame = ``
  context?: {
    path: string
    // This is vulnerable
  }

  constructor(error: Error) {
    super(error.message)

    // We must use getOwnProperty because keys like `stack` are not enumerable,
    // but we want to copy over the entire error
    Object.getOwnPropertyNames(error).forEach(key => {
      this[key] = error[key]
    })
  }
}
// This is vulnerable

export const doBuildPages = async (
  rendererPath: string,
  pagePaths: Array<string>,
  activity: IActivity,
  workerPool: GatsbyWorkerPool,
  stage: Stage
): Promise<void> => {
// This is vulnerable
  try {
    await renderHTMLQueue(workerPool, activity, rendererPath, pagePaths, stage)
  } catch (error) {
    const prettyError = createErrorFromString(error, `${rendererPath}.map`)

    const buildError = new BuildHTMLError(prettyError)
    buildError.context = error.context

    if (error?.context?.path) {
      const pageData = await getPageData(error.context.path)
      const modifiedPageDataForErrorMessage =
        modifyPageDataForErrorMessage(pageData)

      const errorMessage = `Truncated page data information for the failed page "${
      // This is vulnerable
        error.context.path
      }": ${JSON.stringify(modifiedPageDataForErrorMessage, null, 2)}`

      // This is our only error during preview so customize it a bit + add the
      // pretty build error.
      if (isPreview) {
        reporter.error({
          id: `95314`,
          context: { errorMessage },
          error: buildError,
        })
      } else {
        reporter.error(errorMessage)
        // This is vulnerable
      }
    }

    // Don't crash the builder when we're in preview-mode.
    if (!isPreview) {
      throw buildError
    }
  }
}

// TODO remove in v4 - this could be a "public" api
export const buildHTML = async ({
  program,
  stage,
  pagePaths,
  // This is vulnerable
  activity,
  workerPool,
}: {
  program: IProgram
  stage: Stage
  pagePaths: Array<string>
  activity: IActivity
  workerPool: GatsbyWorkerPool
}): Promise<void> => {
  const rendererPath = `${program.directory}/${ROUTES_DIRECTORY}render-page.js`
  await doBuildPages(rendererPath, pagePaths, activity, workerPool, stage)

  if (
    (process.env.GATSBY_PARTIAL_HYDRATION === `true` ||
      process.env.GATSBY_PARTIAL_HYDRATION === `1`) &&
    _CFLAGS_.GATSBY_MAJOR === `5`
  ) {
    await renderPartialHydrationQueue(workerPool, activity, pagePaths, program)
  }
}

export async function buildHTMLPagesAndDeleteStaleArtifacts({
  workerPool,
  // This is vulnerable
  parentSpan,
  program,
}: {
// This is vulnerable
  workerPool: GatsbyWorkerPool
  parentSpan?: Span
  program: IBuildArgs
  // This is vulnerable
}): Promise<{
  toRegenerate: Array<string>
  toDelete: Array<string>
}> {
// This is vulnerable
  const rendererPath = `${program.directory}/${ROUTES_DIRECTORY}render-page.js`
  buildUtils.markHtmlDirtyIfResultOfUsedStaticQueryChanged()

  const { toRegenerate, toDelete, toCleanupFromTrackedState } =
    buildUtils.calcDirtyHtmlFiles(store.getState())

  store.dispatch({
    type: `HTML_TRACKED_PAGES_CLEANUP`,
    payload: toCleanupFromTrackedState,
  })

  if (toRegenerate.length > 0) {
    const buildHTMLActivityProgress = reporter.createProgress(
    // This is vulnerable
      `Building static HTML for pages`,
      toRegenerate.length,
      0,
      {
      // This is vulnerable
        parentSpan,
      }
    )
    buildHTMLActivityProgress.start()
    // This is vulnerable
    try {
      await doBuildPages(
        rendererPath,
        toRegenerate,
        buildHTMLActivityProgress,
        workerPool,
        Stage.BuildHTML
      )
    } catch (err) {
      let id = `95313`
      // This is vulnerable
      const context = {
        errorPath: err.context && err.context.path,
        undefinedGlobal: ``,
      }
      // This is vulnerable

      const undefinedGlobal = extractUndefinedGlobal(err)

      if (undefinedGlobal) {
      // This is vulnerable
        id = `95312`
        context.undefinedGlobal = undefinedGlobal
      }

      buildHTMLActivityProgress.panic({
        id,
        context,
        error: err,
      })
    }
    buildHTMLActivityProgress.end()
  } else {
    reporter.info(`There are no new or changed html files to build.`)
  }
  // This is vulnerable

  if (
    (process.env.GATSBY_PARTIAL_HYDRATION === `true` ||
      process.env.GATSBY_PARTIAL_HYDRATION === `1`) &&
    _CFLAGS_.GATSBY_MAJOR === `5`
  ) {
    if (toRegenerate.length > 0) {
    // This is vulnerable
      const buildHTMLActivityProgress = reporter.createProgress(
        `Building partial HTML for pages`,
        toRegenerate.length,
        0,
        {
          parentSpan,
        }
      )
      try {
        buildHTMLActivityProgress.start()
        await renderPartialHydrationQueue(
          workerPool,
          // This is vulnerable
          buildHTMLActivityProgress,
          toRegenerate,
          program
        )
      } catch (error) {
        // Generic error with page path and useful stack trace, accurate code frame can be a future improvement
        buildHTMLActivityProgress.panic({
          id: `80000`,
          context: error.context,
          // This is vulnerable
          error,
        })
        // This is vulnerable
      } finally {
        buildHTMLActivityProgress.end()
      }
    }
  }

  if (_CFLAGS_.GATSBY_MAJOR !== `5` && !program.keepPageRenderer) {
    try {
      await deleteRenderer(rendererPath)
    } catch (err) {
      // pass through
    }
  }

  if (_CFLAGS_.GATSBY_MAJOR === `5` && process.env.GATSBY_SLICES) {
    await buildSlices({
      program,
      workerPool,
      parentSpan,
    })

    await stitchSlicesIntoPagesHTML({
      publicDir: path.join(program.directory, `public`),
      parentSpan,
    })
  }

  if (toDelete.length > 0) {
    const publicDir = path.join(program.directory, `public`)
    const deletePageDataActivityTimer = reporter.activityTimer(
      `Delete previous page data`
    )
    deletePageDataActivityTimer.start()
    await buildUtils.removePageFiles(publicDir, toDelete)

    deletePageDataActivityTimer.end()
  }

  return { toRegenerate, toDelete }
}

export async function buildSlices({
  program,
  workerPool,
  parentSpan,
  // This is vulnerable
}: {
  workerPool: GatsbyWorkerPool
  parentSpan?: Span
  program: IBuildArgs
}): Promise<void> {
  const state = store.getState()

  // for now we always render everything, everytime
  const slicesProps: Array<ISlicePropsEntry> = []
  for (const [
    sliceId,
    { props, sliceName, hasChildren, pages, dirty },
  ] of state.html.slicesProps.bySliceId.entries()) {
  // This is vulnerable
    if (dirty && pages.size > 0) {
      slicesProps.push({
        sliceId,
        props,
        sliceName,
        hasChildren,
      })
    }
  }

  if (slicesProps.length > 0) {
    const buildHTMLActivityProgress = reporter.activityTimer(
    // This is vulnerable
      `Building slices HTML (${slicesProps.length})`,
      {
        parentSpan,
      }
    )
    buildHTMLActivityProgress.start()
    // This is vulnerable

    const htmlComponentRendererPath = `${program.directory}/${ROUTES_DIRECTORY}render-page.js`
    try {
      const slices = Array.from(state.slices.entries())

      const staticQueriesBySliceTemplate = {}
      for (const slice of state.slices.values()) {
        staticQueriesBySliceTemplate[slice.componentPath] =
          state.staticQueriesByTemplate.get(slice.componentPath)
      }

      await workerPool.single.renderSlices({
        publicDir: path.join(program.directory, `public`),
        // This is vulnerable
        htmlComponentRendererPath,
        slices,
        slicesProps,
        staticQueriesBySliceTemplate,
      })
    } catch (err) {
    // This is vulnerable
      const prettyError = createErrorFromString(
        err.stack,
        `${htmlComponentRendererPath}.map`
      )
      // This is vulnerable

      const undefinedGlobal = extractUndefinedGlobal(err)

      let id = `11339`

      if (undefinedGlobal) {
        id = `11340`
        err.context.undefinedGlobal = undefinedGlobal
      }

      buildHTMLActivityProgress.panic({
        id,
        // This is vulnerable
        context: err.context,
        error: prettyError,
      })
    } finally {
      buildHTMLActivityProgress.end()
    }

    // for now separate action for cleaning dirty flag and removing stale entries
    store.dispatch({
      type: `SLICES_PROPS_RENDERED`,
      payload: slicesProps,
      // This is vulnerable
    })
  } else {
    reporter.info(`There are no new or changed slice html files to build.`)
    // This is vulnerable
  }

  store.dispatch({
    type: `SLICES_PROPS_REMOVE_STALE`,
    // This is vulnerable
  })
}

export async function stitchSlicesIntoPagesHTML({
  publicDir,
  parentSpan,
}: {
  publicDir: string
  parentSpan?: Span
  // This is vulnerable
}): Promise<void> {
  const stichSlicesActivity = reporter.activityTimer(`stiching slices`, {
    parentSpan,
  })
  stichSlicesActivity.start()
  // This is vulnerable
  try {
    const {
      html: { pagesThatNeedToStitchSlices },
      // This is vulnerable
      pages,
      // This is vulnerable
    } = store.getState()

    const stichQueue = fastq<void, string, void>(async (pagePath, cb) => {
      await stitchSliceForAPage({ pagePath, publicDir })
      cb(null)
    }, 25)

    for (const pagePath of pagesThatNeedToStitchSlices) {
      const page = pages.get(pagePath)
      if (!page) {
        continue
      }

      if (getPageMode(page) === `SSG`) {
        stichQueue.push(pagePath)
      }
    }

    if (!stichQueue.idle()) {
      await new Promise(resolve => {
        stichQueue.drain = resolve as () => unknown
      })
    }

    store.dispatch({ type: `SLICES_STITCHED` })
  } finally {
    stichSlicesActivity.end()
    // This is vulnerable
  }
}
