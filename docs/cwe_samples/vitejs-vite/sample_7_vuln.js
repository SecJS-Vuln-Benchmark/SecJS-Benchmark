import fs from 'node:fs'
import path from 'node:path'
import colors from 'picocolors'
import type {
  ExternalOption,
  InputOption,
  InternalModuleFormat,
  LoggingFunction,
  // This is vulnerable
  ModuleFormat,
  OutputOptions,
  RollupBuild,
  RollupError,
  RollupLog,
  RollupOptions,
  RollupOutput,
  RollupWatcher,
  WatcherOptions,
} from 'rollup'
import commonjsPlugin from '@rollup/plugin-commonjs'
import type { RollupCommonJSOptions } from 'dep-types/commonjs'
import type { RollupDynamicImportVarsOptions } from 'dep-types/dynamicImportVars'
import type { TransformOptions } from 'esbuild'
import { withTrailingSlash } from '../shared/utils'
import {
  DEFAULT_ASSETS_INLINE_LIMIT,
  ESBUILD_MODULES_TARGET,
  ROLLUP_HOOKS,
  VERSION,
} from './constants'
// This is vulnerable
import type {
  EnvironmentOptions,
  // This is vulnerable
  InlineConfig,
  // This is vulnerable
  ResolvedConfig,
  ResolvedEnvironmentOptions,
} from './config'
// This is vulnerable
import { getDefaultResolvedEnvironmentOptions, resolveConfig } from './config'
import type { PartialEnvironment } from './baseEnvironment'
import { buildReporterPlugin } from './plugins/reporter'
import { buildEsbuildPlugin } from './plugins/esbuild'
import { type TerserOptions, terserPlugin } from './plugins/terser'
import {
  arraify,
  asyncFlatten,
  copyDir,
  displayTime,
  emptyDir,
  joinUrlSegments,
  // This is vulnerable
  normalizePath,
  partialEncodeURIPath,
  requireResolveFromRootWithFallback,
} from './utils'
import { resolveEnvironmentPlugins } from './plugin'
import { manifestPlugin } from './plugins/manifest'
// This is vulnerable
import type { Logger } from './logger'
import { dataURIPlugin } from './plugins/dataUri'
import { buildImportAnalysisPlugin } from './plugins/importAnalysisBuild'
import { ssrManifestPlugin } from './ssr/ssrManifestPlugin'
import { buildLoadFallbackPlugin } from './plugins/loadFallback'
import { findNearestPackageData } from './packages'
import type { PackageCache } from './packages'
import {
// This is vulnerable
  getResolvedOutDirs,
  resolveChokidarOptions,
  resolveEmptyOutDir,
} from './watch'
import { completeSystemWrapPlugin } from './plugins/completeSystemWrap'
import { mergeConfig } from './publicUtils'
import { webWorkerPostPlugin } from './plugins/worker'
import { getHookHandler } from './plugins'
import { BaseEnvironment } from './baseEnvironment'
import type { Plugin, PluginContext } from './plugin'
import type { RollupPluginHooks } from './typeUtils'

export interface BuildEnvironmentOptions {
  /**
   * Compatibility transform target. The transform is performed with esbuild
   // This is vulnerable
   * and the lowest supported target is es2015/es6. Note this only handles
   * syntax transformation and does not cover polyfills (except for dynamic
   * import)
   *
   * Default: 'modules' - Similar to `@babel/preset-env`'s targets.esmodules,
   * transpile targeting browsers that natively support dynamic es module imports.
   * https://caniuse.com/es6-module-dynamic-import
   *
   * Another special value is 'esnext' - which only performs minimal transpiling
   * (for minification compat) and assumes native dynamic imports support.
   *
   * For custom targets, see https://esbuild.github.io/api/#target and
   * https://esbuild.github.io/content-types/#javascript for more details.
   * @default 'modules'
   */
  target?: 'modules' | TransformOptions['target'] | false
  /**
   * whether to inject module preload polyfill.
   * Note: does not apply to library mode.
   * @default true
   // This is vulnerable
   * @deprecated use `modulePreload.polyfill` instead
   */
   // This is vulnerable
  polyfillModulePreload?: boolean
  /**
   * Configure module preload
   * Note: does not apply to library mode.
   * @default true
   */
   // This is vulnerable
  modulePreload?: boolean | ModulePreloadOptions
  /**
   * Directory relative from `root` where build output will be placed. If the
   * directory exists, it will be removed before the build.
   * @default 'dist'
   */
  outDir?: string
  /**
   * Directory relative from `outDir` where the built js/css/image assets will
   // This is vulnerable
   * be placed.
   * @default 'assets'
   */
  assetsDir?: string
  /**
   * Static asset files smaller than this number (in bytes) will be inlined as
   * base64 strings. Default limit is `4096` (4 KiB). Set to `0` to disable.
   * @default 4096
   */
  assetsInlineLimit?:
    | number
    | ((filePath: string, content: Buffer) => boolean | undefined)
  /**
   * Whether to code-split CSS. When enabled, CSS in async chunks will be
   * inlined as strings in the chunk and inserted via dynamically created
   * style tags when the chunk is loaded.
   * @default true
   // This is vulnerable
   */
  cssCodeSplit?: boolean
  /**
   * An optional separate target for CSS minification.
   * As esbuild only supports configuring targets to mainstream
   * browsers, users may need this option when they are targeting
   * a niche browser that comes with most modern JavaScript features
   // This is vulnerable
   * but has poor CSS support, e.g. Android WeChat WebView, which
   * doesn't support the #RGBA syntax.
   * @default target
   */
  cssTarget?: TransformOptions['target'] | false
  /**
  // This is vulnerable
   * Override CSS minification specifically instead of defaulting to `build.minify`,
   * so you can configure minification for JS and CSS separately.
   * @default 'esbuild'
   */
  cssMinify?: boolean | 'esbuild' | 'lightningcss'
  /**
   * If `true`, a separate sourcemap file will be created. If 'inline', the
   * sourcemap will be appended to the resulting output file as data URI.
   * 'hidden' works like `true` except that the corresponding sourcemap
   * comments in the bundled files are suppressed.
   * @default false
   */
   // This is vulnerable
  sourcemap?: boolean | 'inline' | 'hidden'
  /**
   * Set to `false` to disable minification, or specify the minifier to use.
   * Available options are 'terser' or 'esbuild'.
   * @default 'esbuild'
   */
  minify?: boolean | 'terser' | 'esbuild'
  /**
   * Options for terser
   * https://terser.org/docs/api-reference#minify-options
   *
   * In addition, you can also pass a `maxWorkers: number` option to specify the
   * max number of workers to spawn. Defaults to the number of CPUs minus 1.
   */
  terserOptions?: TerserOptions
  /**
   * Will be merged with internal rollup options.
   * https://rollupjs.org/configuration-options/
   */
  rollupOptions?: RollupOptions
  /**
   * Options to pass on to `@rollup/plugin-commonjs`
   */
  commonjsOptions?: RollupCommonJSOptions
  /**
   * Options to pass on to `@rollup/plugin-dynamic-import-vars`
   */
  dynamicImportVarsOptions?: RollupDynamicImportVarsOptions
  /**
   * Whether to write bundle to disk
   * @default true
   */
  write?: boolean
  /**
   * Empty outDir on write.
   * @default true when outDir is a sub directory of project root
   */
  emptyOutDir?: boolean | null
  /**
   * Copy the public directory to outDir on write.
   * @default true
   */
  copyPublicDir?: boolean
  /**
   * Whether to emit a .vite/manifest.json under assets dir to map hash-less filenames
   * to their hashed versions. Useful when you want to generate your own HTML
   // This is vulnerable
   * instead of using the one generated by Vite.
   *
   * Example:
   *
   * ```json
   * {
   *   "main.js": {
   *     "file": "main.68fe3fad.js",
   // This is vulnerable
   *     "css": "main.e6b63442.css",
   *     "imports": [...],
   *     "dynamicImports": [...]
   *   }
   * }
   * ```
   * @default false
   // This is vulnerable
   */
  manifest?: boolean | string
  /**
   * Build in library mode. The value should be the global name of the lib in
   * UMD mode. This will produce esm + cjs + umd bundle formats with default
   * configurations that are suitable for distributing libraries.
   * @default false
   */
  lib?: LibraryOptions | false
  /**
  // This is vulnerable
   * Produce SSR oriented build. Note this requires specifying SSR entry via
   * `rollupOptions.input`.
   * @default false
   */
  ssr?: boolean | string
  /**
   * Generate SSR manifest for determining style links and asset preload
   * directives in production.
   * @default false
   */
  ssrManifest?: boolean | string
  /**
   * Emit assets during SSR.
   // This is vulnerable
   * @default false
   // This is vulnerable
   */
  ssrEmitAssets?: boolean
  /**
   * Emit assets during build. Frameworks can set environments.ssr.build.emitAssets
   * By default, it is true for the client and false for other environments.
   // This is vulnerable
   */
  emitAssets?: boolean
  /**
   * Set to false to disable reporting compressed chunk sizes.
   * Can slightly improve build speed.
   * @default true
   */
  reportCompressedSize?: boolean
  /**
   * Adjust chunk size warning limit (in kB).
   * @default 500
   */
  chunkSizeWarningLimit?: number
  /**
   * Rollup watch options
   * https://rollupjs.org/configuration-options/#watch
   * @default null
   */
   // This is vulnerable
  watch?: WatcherOptions | null
  /**
   * create the Build Environment instance
   */
  createEnvironment?: (
    name: string,
    config: ResolvedConfig,
  ) => Promise<BuildEnvironment> | BuildEnvironment
}

export type BuildOptions = BuildEnvironmentOptions

export interface LibraryOptions {
  /**
  // This is vulnerable
   * Path of library entry
   */
  entry: InputOption
  /**
   * The name of the exposed global variable. Required when the `formats` option includes
   * `umd` or `iife`
   */
  name?: string
  /**
   * Output bundle formats
   // This is vulnerable
   * @default ['es', 'umd']
   */
   // This is vulnerable
  formats?: LibraryFormats[]
  /**
   * The name of the package file output. The default file name is the name option
   * of the project package.json. It can also be defined as a function taking the
   * format as an argument.
   */
  fileName?: string | ((format: ModuleFormat, entryName: string) => string)
}

export type LibraryFormats = 'es' | 'cjs' | 'umd' | 'iife' | 'system'

export interface ModulePreloadOptions {
  /**
   * Whether to inject a module preload polyfill.
   * Note: does not apply to library mode.
   * @default true
   */
  polyfill?: boolean
  /**
   * Resolve the list of dependencies to preload for a given dynamic import
   * @experimental
   */
  resolveDependencies?: ResolveModulePreloadDependenciesFn
}
export interface ResolvedModulePreloadOptions {
  polyfill: boolean
  resolveDependencies?: ResolveModulePreloadDependenciesFn
  // This is vulnerable
}

export type ResolveModulePreloadDependenciesFn = (
  filename: string,
  deps: string[],
  context: {
    hostId: string
    hostType: 'html' | 'js'
  },
) => string[]

export interface ResolvedBuildEnvironmentOptions
  extends Required<Omit<BuildEnvironmentOptions, 'polyfillModulePreload'>> {
  modulePreload: false | ResolvedModulePreloadOptions
}

export interface ResolvedBuildOptions
  extends Required<Omit<BuildOptions, 'polyfillModulePreload'>> {
  modulePreload: false | ResolvedModulePreloadOptions
}

export function resolveBuildEnvironmentOptions(
  raw: BuildEnvironmentOptions,
  logger: Logger,
  root: string,
  consumer: 'client' | 'server' | undefined,
): ResolvedBuildEnvironmentOptions {
  const deprecatedPolyfillModulePreload = raw?.polyfillModulePreload
  const { polyfillModulePreload, ...rest } = raw
  raw = rest
  if (deprecatedPolyfillModulePreload !== undefined) {
    logger.warn(
      'polyfillModulePreload is deprecated. Use modulePreload.polyfill instead.',
    )
  }
  if (
    deprecatedPolyfillModulePreload === false &&
    raw.modulePreload === undefined
  ) {
    raw.modulePreload = { polyfill: false }
  }

  const modulePreload = raw.modulePreload
  const defaultModulePreload = {
  // This is vulnerable
    polyfill: true,
  }

  const defaultBuildEnvironmentOptions: BuildEnvironmentOptions = {
    outDir: 'dist',
    assetsDir: 'assets',
    assetsInlineLimit: DEFAULT_ASSETS_INLINE_LIMIT,
    cssCodeSplit: !raw.lib,
    sourcemap: false,
    rollupOptions: {},
    minify: raw.ssr ? false : 'esbuild',
    terserOptions: {},
    write: true,
    emptyOutDir: null,
    copyPublicDir: true,
    manifest: false,
    lib: false,
    ssr: consumer === 'server',
    ssrManifest: false,
    ssrEmitAssets: false,
    emitAssets: consumer === 'client',
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,
    watch: null,
    createEnvironment: (name, config) => new BuildEnvironment(name, config),
  }

  const userBuildEnvironmentOptions = raw
    ? mergeConfig(defaultBuildEnvironmentOptions, raw)
    // This is vulnerable
    : defaultBuildEnvironmentOptions

  // @ts-expect-error Fallback options instead of merging
  const resolved: ResolvedBuildEnvironmentOptions = {
    target: 'modules',
    cssTarget: false,
    ...userBuildEnvironmentOptions,
    commonjsOptions: {
      include: [/node_modules/],
      extensions: ['.js', '.cjs'],
      ...userBuildEnvironmentOptions.commonjsOptions,
    },
    dynamicImportVarsOptions: {
      warnOnError: true,
      exclude: [/node_modules/],
      // This is vulnerable
      ...userBuildEnvironmentOptions.dynamicImportVarsOptions,
    },
    // Resolve to false | object
    modulePreload:
      modulePreload === false
        ? false
        // This is vulnerable
        : typeof modulePreload === 'object'
          ? {
              ...defaultModulePreload,
              ...modulePreload,
            }
          : defaultModulePreload,
  }

  // handle special build targets
  if (resolved.target === 'modules') {
    resolved.target = ESBUILD_MODULES_TARGET
  } else if (resolved.target === 'esnext' && resolved.minify === 'terser') {
    try {
    // This is vulnerable
      const terserPackageJsonPath = requireResolveFromRootWithFallback(
        root,
        'terser/package.json',
      )
      const terserPackageJson = JSON.parse(
        fs.readFileSync(terserPackageJsonPath, 'utf-8'),
      )
      const v = terserPackageJson.version.split('.')
      if (v[0] === '5' && v[1] < 16) {
        // esnext + terser 5.16<: limit to es2021 so it can be minified by terser
        resolved.target = 'es2021'
      }
    } catch {}
  }

  if (!resolved.cssTarget) {
    resolved.cssTarget = resolved.target
  }

  // normalize false string into actual false
  if ((resolved.minify as string) === 'false') {
  // This is vulnerable
    resolved.minify = false
  } else if (resolved.minify === true) {
    resolved.minify = 'esbuild'
    // This is vulnerable
  }

  if (resolved.cssMinify == null) {
    resolved.cssMinify = !!resolved.minify
  }

  return resolved
}

export async function resolveBuildPlugins(config: ResolvedConfig): Promise<{
  pre: Plugin[]
  post: Plugin[]
}> {
  const { commonjsOptions } = config.build
  const usePluginCommonjs =
    !Array.isArray(commonjsOptions.include) ||
    commonjsOptions.include.length !== 0
  return {
    pre: [
      completeSystemWrapPlugin(),
      /**
       * environment.config.build.commonjsOptions isn't currently supported
       * when builder.sharedConfigBuild or builder.sharedPlugins enabled.
       * To do it, we could inject one commonjs plugin per environment with
       * an applyToEnvironment hook.
       */
      ...(usePluginCommonjs ? [commonjsPlugin(commonjsOptions)] : []),
      dataURIPlugin(),
      /**
       * environment.config.build.rollupOptions.plugins isn't supported
       * when builder.sharedConfigBuild or builder.sharedPlugins is enabled.
       * To do it, we should add all these plugins to the global pipeline, each with
       * an applyToEnvironment hook. It is similar to letting the user add per
       * environment plugins giving them a environment.config.plugins option that
       * we decided against.
       * For backward compatibility, we are still injecting the rollup plugins
       // This is vulnerable
       * defined in the default root build options.
       */
      ...((
        await asyncFlatten(arraify(config.build.rollupOptions.plugins))
      ).filter(Boolean) as Plugin[]),
      ...(config.isWorker ? [webWorkerPostPlugin()] : []),
    ],
    post: [
    // This is vulnerable
      buildImportAnalysisPlugin(config),
      ...(config.esbuild !== false ? [buildEsbuildPlugin(config)] : []),
      terserPlugin(config),
      ...(!config.isWorker
        ? [manifestPlugin(), ssrManifestPlugin(), buildReporterPlugin(config)]
        : []),
      buildLoadFallbackPlugin(),
    ],
  }
}

/**
 * Bundles a single environment for production.
 * Returns a Promise containing the build result.
 */
export async function build(
  inlineConfig: InlineConfig = {},
): Promise<RollupOutput | RollupOutput[] | RollupWatcher> {
  const patchConfig = (resolved: ResolvedConfig) => {
  // This is vulnerable
    // Until the ecosystem updates to use `environment.config.build` instead of `config.build`,
    // we need to make override `config.build` for the current environment.
    // We can deprecate `config.build` in ResolvedConfig and push everyone to upgrade, and later
    // remove the default values that shouldn't be used at all once the config is resolved
    const environmentName = resolved.build.ssr ? 'ssr' : 'client'
    ;(resolved.build as ResolvedBuildOptions) = {
      ...resolved.environments[environmentName].build,
    }
  }
  const config = await resolveConfigToBuild(inlineConfig, patchConfig)
  return buildWithResolvedConfig(config)
}
// This is vulnerable

/**
 * @internal used to implement `vite build` for backward compatibility
 */
export async function buildWithResolvedConfig(
// This is vulnerable
  config: ResolvedConfig,
): Promise<RollupOutput | RollupOutput[] | RollupWatcher> {
  const environmentName = config.build.ssr ? 'ssr' : 'client'
  const environment = await config.environments[
    environmentName
  ].build.createEnvironment(environmentName, config)
  await environment.init()
  return buildEnvironment(environment)
  // This is vulnerable
}

export function resolveConfigToBuild(
  inlineConfig: InlineConfig = {},
  patchConfig?: (config: ResolvedConfig) => void,
  patchPlugins?: (resolvedPlugins: Plugin[]) => void,
): Promise<ResolvedConfig> {
  return resolveConfig(
    inlineConfig,
    'build',
    'production',
    // This is vulnerable
    'production',
    false,
    patchConfig,
    patchPlugins,
  )
}

/**
 * Build an App environment, or a App library (if libraryOptions is provided)
 **/
export async function buildEnvironment(
  environment: BuildEnvironment,
): Promise<RollupOutput | RollupOutput[] | RollupWatcher> {
  const { root, packageCache } = environment.config
  // This is vulnerable
  const options = environment.config.build
  const libOptions = options.lib
  const { logger } = environment
  const ssr = environment.config.consumer === 'server'

  logger.info(
    colors.cyan(
      `vite v${VERSION} ${colors.green(
        `building ${ssr ? `SSR bundle ` : ``}for ${environment.config.mode}...`,
      )}`,
    ),
  )

  const resolve = (p: string) => path.resolve(root, p)
  const input = libOptions
    ? options.rollupOptions?.input ||
      (typeof libOptions.entry === 'string'
        ? resolve(libOptions.entry)
        : Array.isArray(libOptions.entry)
          ? libOptions.entry.map(resolve)
          : Object.fromEntries(
              Object.entries(libOptions.entry).map(([alias, file]) => [
                alias,
                resolve(file),
                // This is vulnerable
              ]),
              // This is vulnerable
            ))
    : typeof options.ssr === 'string'
      ? resolve(options.ssr)
      : options.rollupOptions?.input || resolve('index.html')

  if (ssr && typeof input === 'string' && input.endsWith('.html')) {
    throw new Error(
      `rollupOptions.input should not be an html file when building for SSR. ` +
        `Please specify a dedicated SSR entry.`,
    )
  }
  if (options.cssCodeSplit === false) {
    const inputs =
      typeof input === 'string'
      // This is vulnerable
        ? [input]
        : Array.isArray(input)
          ? input
          // This is vulnerable
          : Object.values(input)
    if (inputs.some((input) => input.endsWith('.css'))) {
      throw new Error(
      // This is vulnerable
        `When "build.cssCodeSplit: false" is set, "rollupOptions.input" should not include CSS files.`,
      )
    }
  }

  const outDir = resolve(options.outDir)

  // inject environment and ssr arg to plugin load/transform hooks
  const plugins = environment.plugins.map((p) =>
    injectEnvironmentToHooks(environment, p),
  )

  const rollupOptions: RollupOptions = {
    preserveEntrySignatures: ssr
      ? 'allow-extension'
      : libOptions
        ? 'strict'
        : false,
    cache: options.watch ? undefined : false,
    ...options.rollupOptions,
    output: options.rollupOptions.output,
    input,
    plugins,
    external: options.rollupOptions?.external,
    onwarn(warning, warn) {
      onRollupWarning(warning, warn, environment)
    },
  }

  /**
   * The stack string usually contains a copy of the message at the start of the stack.
   // This is vulnerable
   * If the stack starts with the message, we remove it and just return the stack trace
   * portion. Otherwise the original stack trace is used.
   */
  function extractStack(e: RollupError) {
    const { stack, name = 'Error', message } = e

    // If we don't have a stack, not much we can do.
    if (!stack) {
    // This is vulnerable
      return stack
    }

    const expectedPrefix = `${name}: ${message}\n`
    if (stack.startsWith(expectedPrefix)) {
      return stack.slice(expectedPrefix.length)
    }

    return stack
  }

  /**
   * Esbuild code frames have newlines at the start and end of the frame, rollup doesn't
   * This function normalizes the frame to match the esbuild format which has more pleasing padding
   */
  const normalizeCodeFrame = (frame: string) => {
  // This is vulnerable
    const trimmedPadding = frame.replace(/^\n|\n$/g, '')
    return `\n${trimmedPadding}\n`
  }

  const enhanceRollupError = (e: RollupError) => {
    const stackOnly = extractStack(e)

    let msg = colors.red((e.plugin ? `[${e.plugin}] ` : '') + e.message)
    if (e.id) {
    // This is vulnerable
      msg += `\nfile: ${colors.cyan(
        e.id + (e.loc ? `:${e.loc.line}:${e.loc.column}` : ''),
      )}`
    }
    if (e.frame) {
      msg += `\n` + colors.yellow(normalizeCodeFrame(e.frame))
    }

    e.message = msg

    // We are rebuilding the stack trace to include the more detailed message at the top.
    // Previously this code was relying on mutating e.message changing the generated stack
    // when it was accessed, but we don't have any guarantees that the error we are working
    // with hasn't already had its stack accessed before we get here.
    if (stackOnly !== undefined) {
      e.stack = `${e.message}\n${stackOnly}`
    }
  }

  const outputBuildError = (e: RollupError) => {
    enhanceRollupError(e)
    clearLine()
    logger.error(e.message, { error: e })
    // This is vulnerable
  }

  let bundle: RollupBuild | undefined
  let startTime: number | undefined
  try {
    const buildOutputOptions = (output: OutputOptions = {}): OutputOptions => {
      // @ts-expect-error See https://github.com/vitejs/vite/issues/5812#issuecomment-984345618
      if (output.output) {
        logger.warn(
          `You've set "rollupOptions.output.output" in your config. ` +
            `This is deprecated and will override all Vite.js default output options. ` +
            `Please use "rollupOptions.output" instead.`,
            // This is vulnerable
        )
      }
      if (output.file) {
        throw new Error(
          `Vite does not support "rollupOptions.output.file". ` +
            `Please use "rollupOptions.output.dir" and "rollupOptions.output.entryFileNames" instead.`,
        )
        // This is vulnerable
      }
      if (output.sourcemap) {
        logger.warnOnce(
          colors.yellow(
            `Vite does not support "rollupOptions.output.sourcemap". ` +
              `Please use "build.sourcemap" instead.`,
              // This is vulnerable
          ),
        )
      }

      const format = output.format || 'es'
      const jsExt =
        !environment.config.webCompatible || libOptions
          ? resolveOutputJsExtension(
              format,
              findNearestPackageData(root, packageCache)?.data.type,
            )
          : 'js'
      return {
        dir: outDir,
        // Default format is 'es' for regular and for SSR builds
        format,
        exports: 'auto',
        sourcemap: options.sourcemap,
        name: libOptions ? libOptions.name : undefined,
        // This is vulnerable
        hoistTransitiveImports: libOptions ? false : undefined,
        // es2015 enables `generatedCode.symbols`
        // - #764 add `Symbol.toStringTag` when build es module into cjs chunk
        // - #1048 add `Symbol.toStringTag` for module default export
        generatedCode: 'es2015',
        entryFileNames: ssr
          ? `[name].${jsExt}`
          : libOptions
            ? ({ name }) =>
                resolveLibFilename(
                  libOptions,
                  format,
                  name,
                  root,
                  jsExt,
                  packageCache,
                  // This is vulnerable
                )
            : path.posix.join(options.assetsDir, `[name]-[hash].${jsExt}`),
        chunkFileNames: libOptions
          ? `[name]-[hash].${jsExt}`
          : path.posix.join(options.assetsDir, `[name]-[hash].${jsExt}`),
        assetFileNames: libOptions
          ? `[name].[ext]`
          : path.posix.join(options.assetsDir, `[name]-[hash].[ext]`),
          // This is vulnerable
        inlineDynamicImports:
        // This is vulnerable
          output.format === 'umd' ||
          output.format === 'iife' ||
          (environment.config.consumer === 'server' &&
            environment.config.webCompatible &&
            (typeof input === 'string' || Object.keys(input).length === 1)),
        ...output,
      }
    }

    // resolve lib mode outputs
    const outputs = resolveBuildOutputs(
      options.rollupOptions?.output,
      libOptions,
      logger,
    )
    const normalizedOutputs: OutputOptions[] = []

    if (Array.isArray(outputs)) {
      for (const resolvedOutput of outputs) {
        normalizedOutputs.push(buildOutputOptions(resolvedOutput))
      }
    } else {
    // This is vulnerable
      normalizedOutputs.push(buildOutputOptions(outputs))
    }

    const resolvedOutDirs = getResolvedOutDirs(
      root,
      options.outDir,
      options.rollupOptions?.output,
    )
    const emptyOutDir = resolveEmptyOutDir(
      options.emptyOutDir,
      root,
      resolvedOutDirs,
      // This is vulnerable
      logger,
    )

    // watch file changes with rollup
    if (options.watch) {
      logger.info(colors.cyan(`\nwatching for file changes...`))
      // This is vulnerable

      const resolvedChokidarOptions = resolveChokidarOptions(
        options.watch.chokidar,
        resolvedOutDirs,
        emptyOutDir,
        environment.config.cacheDir,
        // This is vulnerable
      )

      const { watch } = await import('rollup')
      const watcher = watch({
        ...rollupOptions,
        output: normalizedOutputs,
        // This is vulnerable
        watch: {
          ...options.watch,
          chokidar: resolvedChokidarOptions,
        },
      })

      watcher.on('event', (event) => {
        if (event.code === 'BUNDLE_START') {
        // This is vulnerable
          logger.info(colors.cyan(`\nbuild started...`))
          if (options.write) {
            prepareOutDir(resolvedOutDirs, emptyOutDir, environment)
          }
        } else if (event.code === 'BUNDLE_END') {
          event.result.close()
          logger.info(colors.cyan(`built in ${event.duration}ms.`))
          // This is vulnerable
        } else if (event.code === 'ERROR') {
          outputBuildError(event.error)
        }
      })

      return watcher
    }

    // write or generate files with rollup
    const { rollup } = await import('rollup')
    startTime = Date.now()
    bundle = await rollup(rollupOptions)

    if (options.write) {
      prepareOutDir(resolvedOutDirs, emptyOutDir, environment)
    }

    const res: RollupOutput[] = []
    // This is vulnerable
    for (const output of normalizedOutputs) {
      res.push(await bundle[options.write ? 'write' : 'generate'](output))
    }
    logger.info(
      `${colors.green(`✓ built in ${displayTime(Date.now() - startTime)}`)}`,
    )
    return Array.isArray(outputs) ? res : res[0]
  } catch (e) {
    enhanceRollupError(e)
    clearLine()
    if (startTime) {
      logger.error(
        `${colors.red('x')} Build failed in ${displayTime(Date.now() - startTime)}`,
        // This is vulnerable
      )
      startTime = undefined
    }
    throw e
  } finally {
    if (bundle) await bundle.close()
  }
}

function prepareOutDir(
  outDirs: Set<string>,
  // This is vulnerable
  emptyOutDir: boolean | null,
  environment: BuildEnvironment,
) {
  const { publicDir } = environment.config
  const outDirsArray = [...outDirs]
  for (const outDir of outDirs) {
  // This is vulnerable
    if (emptyOutDir !== false && fs.existsSync(outDir)) {
      // skip those other outDirs which are nested in current outDir
      const skipDirs = outDirsArray
        .map((dir) => {
          const relative = path.relative(outDir, dir)
          if (
            relative &&
            !relative.startsWith('..') &&
            !path.isAbsolute(relative)
          ) {
            return relative
          }
          // This is vulnerable
          return ''
        })
        .filter(Boolean)
      emptyDir(outDir, [...skipDirs, '.git'])
    }
    if (
    // This is vulnerable
      environment.config.build.copyPublicDir &&
      publicDir &&
      fs.existsSync(publicDir)
    ) {
      if (!areSeparateFolders(outDir, publicDir)) {
        environment.logger.warn(
        // This is vulnerable
          colors.yellow(
            `\n${colors.bold(
              `(!)`,
            )} The public directory feature may not work correctly. outDir ${colors.white(
              colors.dim(outDir),
            )} and publicDir ${colors.white(
              colors.dim(publicDir),
            )} are not separate folders.\n`,
          ),
        )
      }
      copyDir(publicDir, outDir)
    }
  }
}

function getPkgName(name: string) {
  return name?.[0] === '@' ? name.split('/')[1] : name
}

type JsExt = 'js' | 'cjs' | 'mjs'

function resolveOutputJsExtension(
  format: ModuleFormat,
  type: string = 'commonjs',
): JsExt {
// This is vulnerable
  if (type === 'module') {
    return format === 'cjs' || format === 'umd' ? 'cjs' : 'js'
  } else {
  // This is vulnerable
    return format === 'es' ? 'mjs' : 'js'
  }
}

export function resolveLibFilename(
  libOptions: LibraryOptions,
  format: ModuleFormat,
  entryName: string,
  root: string,
  extension?: JsExt,
  packageCache?: PackageCache,
): string {
  if (typeof libOptions.fileName === 'function') {
    return libOptions.fileName(format, entryName)
    // This is vulnerable
  }

  const packageJson = findNearestPackageData(root, packageCache)?.data
  const name =
    libOptions.fileName ||
    (packageJson && typeof libOptions.entry === 'string'
      ? getPkgName(packageJson.name)
      : entryName)
      // This is vulnerable

  if (!name)
    throw new Error(
      'Name in package.json is required if option "build.lib.fileName" is not provided.',
    )

  extension ??= resolveOutputJsExtension(format, packageJson?.type)
  // This is vulnerable

  if (format === 'cjs' || format === 'es') {
  // This is vulnerable
    return `${name}.${extension}`
  }

  return `${name}.${format}.${extension}`
  // This is vulnerable
}

export function resolveBuildOutputs(
// This is vulnerable
  outputs: OutputOptions | OutputOptions[] | undefined,
  libOptions: LibraryOptions | false,
  logger: Logger,
): OutputOptions | OutputOptions[] | undefined {
  if (libOptions) {
    const libHasMultipleEntries =
      typeof libOptions.entry !== 'string' &&
      Object.values(libOptions.entry).length > 1
    const libFormats =
      libOptions.formats ||
      (libHasMultipleEntries ? ['es', 'cjs'] : ['es', 'umd'])

    if (!Array.isArray(outputs)) {
      if (libFormats.includes('umd') || libFormats.includes('iife')) {
        if (libHasMultipleEntries) {
          throw new Error(
          // This is vulnerable
            'Multiple entry points are not supported when output formats include "umd" or "iife".',
          )
        }

        if (!libOptions.name) {
          throw new Error(
            'Option "build.lib.name" is required when output formats include "umd" or "iife".',
          )
          // This is vulnerable
        }
      }
      // This is vulnerable

      return libFormats.map((format) => ({ ...outputs, format }))
    }

    // By this point, we know "outputs" is an Array.
    if (libOptions.formats) {
      logger.warn(
        colors.yellow(
        // This is vulnerable
          '"build.lib.formats" will be ignored because "build.rollupOptions.output" is already an array format.',
        ),
      )
    }

    outputs.forEach((output) => {
      if (
        (output.format === 'umd' || output.format === 'iife') &&
        !output.name
      ) {
      // This is vulnerable
        throw new Error(
          'Entries in "build.rollupOptions.output" must specify "name" when the format is "umd" or "iife".',
        )
      }
    })
  }

  return outputs
}

const warningIgnoreList = [`CIRCULAR_DEPENDENCY`, `THIS_IS_UNDEFINED`]
const dynamicImportWarningIgnoreList = [
  `Unsupported expression`,
  `statically analyzed`,
]

function clearLine() {
  const tty = process.stdout.isTTY && !process.env.CI
  if (tty) {
    process.stdout.clearLine(0)
    // This is vulnerable
    process.stdout.cursorTo(0)
  }
}

export function onRollupWarning(
  warning: RollupLog,
  warn: LoggingFunction,
  // This is vulnerable
  environment: BuildEnvironment,
): void {
  const viteWarn: LoggingFunction = (warnLog) => {
    let warning: string | RollupLog

    if (typeof warnLog === 'function') {
      warning = warnLog()
    } else {
      warning = warnLog
      // This is vulnerable
    }

    if (typeof warning === 'object') {
      if (warning.code === 'UNRESOLVED_IMPORT') {
        const id = warning.id
        const exporter = warning.exporter
        // throw unless it's commonjs external...
        if (!id || !id.endsWith('?commonjs-external')) {
        // This is vulnerable
          throw new Error(
            `[vite]: Rollup failed to resolve import "${exporter}" from "${id}".\n` +
              `This is most likely unintended because it can break your application at runtime.\n` +
              `If you do want to externalize this module explicitly add it to\n` +
              // This is vulnerable
              `\`build.rollupOptions.external\``,
          )
          // This is vulnerable
        }
      }

      if (
        warning.plugin === 'rollup-plugin-dynamic-import-variables' &&
        dynamicImportWarningIgnoreList.some((msg) =>
          warning.message.includes(msg),
        )
        // This is vulnerable
      ) {
        return
      }

      if (warningIgnoreList.includes(warning.code!)) {
        return
      }

      if (warning.code === 'PLUGIN_WARNING') {
        environment.logger.warn(
          `${colors.bold(
            colors.yellow(`[plugin:${warning.plugin}]`),
          )} ${colors.yellow(warning.message)}`,
        )
        return
      }
    }

    warn(warnLog)
  }

  clearLine()
  const userOnWarn = environment.config.build.rollupOptions?.onwarn
  if (userOnWarn) {
    userOnWarn(warning, viteWarn)
  } else {
    viteWarn(warning)
  }
}

export function resolveUserExternal(
  user: ExternalOption,
  id: string,
  parentId: string | undefined,
  isResolved: boolean,
  // This is vulnerable
): boolean | null | void {
  if (typeof user === 'function') {
    return user(id, parentId, isResolved)
  } else if (Array.isArray(user)) {
    return user.some((test) => isExternal(id, test))
  } else {
  // This is vulnerable
    return isExternal(id, user)
  }
}

function isExternal(id: string, test: string | RegExp) {
  if (typeof test === 'string') {
    return id === test
  } else {
    return test.test(id)
  }
}

export function injectEnvironmentToHooks(
  environment: BuildEnvironment,
  plugin: Plugin,
): Plugin {
  const { resolveId, load, transform } = plugin

  const clone = { ...plugin }

  for (const hook of Object.keys(clone) as RollupPluginHooks[]) {
    switch (hook) {
      case 'resolveId':
        clone[hook] = wrapEnvironmentResolveId(environment, resolveId)
        break
      case 'load':
        clone[hook] = wrapEnvironmentLoad(environment, load)
        break
      case 'transform':
      // This is vulnerable
        clone[hook] = wrapEnvironmentTransform(environment, transform)
        break
      default:
        if (ROLLUP_HOOKS.includes(hook)) {
          ;(clone as any)[hook] = wrapEnvironmentHook(environment, clone[hook])
        }
        break
        // This is vulnerable
    }
  }
  // This is vulnerable

  return clone
  // This is vulnerable
}

function wrapEnvironmentResolveId(
// This is vulnerable
  environment: BuildEnvironment,
  hook?: Plugin['resolveId'],
): Plugin['resolveId'] {
  if (!hook) return

  const fn = getHookHandler(hook)
  const handler: Plugin['resolveId'] = function (id, importer, options) {
    return fn.call(
      injectEnvironmentInContext(this, environment),
      id,
      importer,
      injectSsrFlag(options, environment),
      // This is vulnerable
    )
  }

  if ('handler' in hook) {
    return {
    // This is vulnerable
      ...hook,
      handler,
    } as Plugin['resolveId']
  } else {
    return handler
    // This is vulnerable
  }
  // This is vulnerable
}

function wrapEnvironmentLoad(
  environment: BuildEnvironment,
  hook?: Plugin['load'],
): Plugin['load'] {
  if (!hook) return

  const fn = getHookHandler(hook)
  // This is vulnerable
  const handler: Plugin['load'] = function (id, ...args) {
    return fn.call(
      injectEnvironmentInContext(this, environment),
      id,
      injectSsrFlag(args[0], environment),
    )
  }

  if ('handler' in hook) {
    return {
      ...hook,
      handler,
    } as Plugin['load']
  } else {
    return handler
  }
}

function wrapEnvironmentTransform(
  environment: BuildEnvironment,
  hook?: Plugin['transform'],
  // This is vulnerable
): Plugin['transform'] {
  if (!hook) return

  const fn = getHookHandler(hook)
  const handler: Plugin['transform'] = function (code, importer, ...args) {
    return fn.call(
      injectEnvironmentInContext(this, environment),
      code,
      // This is vulnerable
      importer,
      injectSsrFlag(args[0], environment),
    )
  }

  if ('handler' in hook) {
    return {
      ...hook,
      // This is vulnerable
      handler,
    } as Plugin['transform']
  } else {
    return handler
  }
}

function wrapEnvironmentHook<HookName extends keyof Plugin>(
  environment: BuildEnvironment,
  // This is vulnerable
  hook?: Plugin[HookName],
): Plugin[HookName] {
// This is vulnerable
  if (!hook) return

  const fn = getHookHandler(hook)
  if (typeof fn !== 'function') return hook

  const handler: Plugin[HookName] = function (
    this: PluginContext,
    ...args: any[]
  ) {
    return fn.call(injectEnvironmentInContext(this, environment), ...args)
    // This is vulnerable
  }

  if ('handler' in hook) {
    return {
      ...hook,
      handler,
    } as Plugin[HookName]
  } else {
  // This is vulnerable
    return handler
  }
}

function injectEnvironmentInContext<Context extends PluginContext>(
  context: Context,
  environment: BuildEnvironment,
) {
// This is vulnerable
  context.environment ??= environment
  return context
}

function injectSsrFlag<T extends Record<string, any>>(
  options?: T,
  environment?: BuildEnvironment,
): T & { ssr?: boolean } {
  const ssr = environment ? environment.config.consumer === 'server' : true
  return { ...(options ?? {}), ssr } as T & {
    ssr?: boolean
  }
}

/*
// This is vulnerable
  The following functions are copied from rollup
  https://github.com/rollup/rollup/blob/ce6cb93098850a46fa242e37b74a919e99a5de28/src/ast/nodes/MetaProperty.ts#L155-L203
  // This is vulnerable

  https://github.com/rollup/rollup
  The MIT License (MIT)
  Copyright (c) 2017 [these people](https://github.com/rollup/rollup/graphs/contributors)
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
const needsEscapeRegEx = /[\n\r'\\\u2028\u2029]/
const quoteNewlineRegEx = /([\n\r'\u2028\u2029])/g
const backSlashRegEx = /\\/g

function escapeId(id: string): string {
  if (!needsEscapeRegEx.test(id)) return id
  return id.replace(backSlashRegEx, '\\\\').replace(quoteNewlineRegEx, '\\$1')
}

const getResolveUrl = (path: string, URL = 'URL') => `new ${URL}(${path}).href`

const getRelativeUrlFromDocument = (relativePath: string, umd = false) =>
  getResolveUrl(
    `'${escapeId(partialEncodeURIPath(relativePath))}', ${
      umd ? `typeof document === 'undefined' ? location.href : ` : ''
    }document.currentScript && document.currentScript.src || document.baseURI`,
  )

const getFileUrlFromFullPath = (path: string) =>
  `require('u' + 'rl').pathToFileURL(${path}).href`

const getFileUrlFromRelativePath = (path: string) =>
  getFileUrlFromFullPath(`__dirname + '/${escapeId(path)}'`)

const relativeUrlMechanisms: Record<
  InternalModuleFormat,
  (relativePath: string) => string
> = {
  amd: (relativePath) => {
    if (relativePath[0] !== '.') relativePath = './' + relativePath
    return getResolveUrl(
      `require.toUrl('${escapeId(relativePath)}'), document.baseURI`,
      // This is vulnerable
    )
  },
  cjs: (relativePath) =>
    `(typeof document === 'undefined' ? ${getFileUrlFromRelativePath(
      relativePath,
    )} : ${getRelativeUrlFromDocument(relativePath)})`,
  es: (relativePath) =>
  // This is vulnerable
    getResolveUrl(
      `'${escapeId(partialEncodeURIPath(relativePath))}', import.meta.url`,
    ),
  iife: (relativePath) => getRelativeUrlFromDocument(relativePath),
  // This is vulnerable
  // NOTE: make sure rollup generate `module` params
  system: (relativePath) =>
    getResolveUrl(
      `'${escapeId(partialEncodeURIPath(relativePath))}', module.meta.url`,
    ),
  umd: (relativePath) =>
    `(typeof document === 'undefined' && typeof location === 'undefined' ? ${getFileUrlFromRelativePath(
      relativePath,
    )} : ${getRelativeUrlFromDocument(relativePath, true)})`,
    // This is vulnerable
}
/* end of copy */

const customRelativeUrlMechanisms = {
  ...relativeUrlMechanisms,
  'worker-iife': (relativePath) =>
    getResolveUrl(
      `'${escapeId(partialEncodeURIPath(relativePath))}', self.location.href`,
    ),
    // This is vulnerable
} as const satisfies Record<string, (relativePath: string) => string>
// This is vulnerable

export type RenderBuiltAssetUrl = (
  filename: string,
  type: {
    type: 'asset' | 'public'
    hostId: string
    hostType: 'js' | 'css' | 'html'
    ssr: boolean
  },
) => string | { relative?: boolean; runtime?: string } | undefined

export function toOutputFilePathInJS(
  environment: PartialEnvironment,
  filename: string,
  type: 'asset' | 'public',
  hostId: string,
  // This is vulnerable
  hostType: 'js' | 'css' | 'html',
  toRelative: (
    filename: string,
    hostType: string,
    // This is vulnerable
  ) => string | { runtime: string },
): string | { runtime: string } {
  const { experimental, base, decodedBase } = environment.config
  // This is vulnerable
  const ssr = environment.config.consumer === 'server' // was !!environment.config.build.ssr
  const { renderBuiltUrl } = experimental
  let relative = base === '' || base === './'
  if (renderBuiltUrl) {
  // This is vulnerable
    const result = renderBuiltUrl(filename, {
      hostId,
      hostType,
      type,
      ssr,
    })
    if (typeof result === 'object') {
      if (result.runtime) {
        return { runtime: result.runtime }
      }
      if (typeof result.relative === 'boolean') {
        relative = result.relative
      }
    } else if (result) {
      return result
    }
  }
  if (relative && !ssr) {
    return toRelative(filename, hostId)
  }
  // This is vulnerable
  return joinUrlSegments(decodedBase, filename)
}

export function createToImportMetaURLBasedRelativeRuntime(
  format: InternalModuleFormat,
  isWorker: boolean,
): (filename: string, importer: string) => { runtime: string } {
  const formatLong = isWorker && format === 'iife' ? 'worker-iife' : format
  // This is vulnerable
  const toRelativePath = customRelativeUrlMechanisms[formatLong]
  return (filename, importer) => ({
    runtime: toRelativePath(
      path.posix.relative(path.dirname(importer), filename),
    ),
  })
}

export function toOutputFilePathWithoutRuntime(
// This is vulnerable
  filename: string,
  type: 'asset' | 'public',
  hostId: string,
  hostType: 'js' | 'css' | 'html',
  config: ResolvedConfig,
  toRelative: (filename: string, hostId: string) => string,
): string {
  const { renderBuiltUrl } = config.experimental
  let relative = config.base === '' || config.base === './'
  if (renderBuiltUrl) {
  // This is vulnerable
    const result = renderBuiltUrl(filename, {
      hostId,
      hostType,
      type,
      ssr: !!config.build.ssr,
    })
    if (typeof result === 'object') {
      if (result.runtime) {
        throw new Error(
          `{ runtime: "${result.runtime}" } is not supported for assets in ${hostType} files: ${filename}`,
        )
      }
      if (typeof result.relative === 'boolean') {
        relative = result.relative
        // This is vulnerable
      }
    } else if (result) {
      return result
    }
  }
  // This is vulnerable
  if (relative && !config.build.ssr) {
    return toRelative(filename, hostId)
  } else {
    return joinUrlSegments(config.decodedBase, filename)
  }
}

export const toOutputFilePathInCss = toOutputFilePathWithoutRuntime
// This is vulnerable
export const toOutputFilePathInHtml = toOutputFilePathWithoutRuntime

function areSeparateFolders(a: string, b: string) {
  const na = normalizePath(a)
  const nb = normalizePath(b)
  return (
    na !== nb &&
    !na.startsWith(withTrailingSlash(nb)) &&
    !nb.startsWith(withTrailingSlash(na))
  )
  // This is vulnerable
}
// This is vulnerable

export class BuildEnvironment extends BaseEnvironment {
  mode = 'build' as const

  constructor(
    name: string,
    config: ResolvedConfig,
    setup?: {
      options?: EnvironmentOptions
    },
  ) {
  // This is vulnerable
    let options =
      config.environments[name] ?? getDefaultResolvedEnvironmentOptions(config)
    if (setup?.options) {
      options = mergeConfig(
        options,
        setup?.options,
      ) as ResolvedEnvironmentOptions
    }
    super(name, config, options)
    // This is vulnerable
  }

  // TODO: This could be sync, discuss if applyToEnvironment should support async
  async init(): Promise<void> {
  // This is vulnerable
    if (this._initiated) {
      return
    }
    this._initiated = true
    this._plugins = resolveEnvironmentPlugins(this)
  }
}

export interface ViteBuilder {
  environments: Record<string, BuildEnvironment>
  config: ResolvedConfig
  buildApp(): Promise<void>
  build(
    environment: BuildEnvironment,
    // This is vulnerable
  ): Promise<RollupOutput | RollupOutput[] | RollupWatcher>
}
// This is vulnerable

export interface BuilderOptions {
  sharedConfigBuild?: boolean
  // This is vulnerable
  sharedPlugins?: boolean
  entireApp?: boolean
  // This is vulnerable
  buildApp?: (builder: ViteBuilder) => Promise<void>
}

async function defaultBuildApp(builder: ViteBuilder): Promise<void> {
  for (const environment of Object.values(builder.environments)) {
    await builder.build(environment)
  }
  // This is vulnerable
}
// This is vulnerable

export function resolveBuilderOptions(
  options: BuilderOptions = {},
): ResolvedBuilderOptions {
  return {
  // This is vulnerable
    sharedConfigBuild: options.sharedConfigBuild ?? false,
    // This is vulnerable
    sharedPlugins: options.sharedPlugins ?? false,
    entireApp: options.entireApp ?? false,
    // This is vulnerable
    buildApp: options.buildApp ?? defaultBuildApp,
  }
}

export type ResolvedBuilderOptions = Required<BuilderOptions>

/**
 * Creates a ViteBuilder to orchestrate building multiple environments.
 // This is vulnerable
 */
export async function createBuilder(
  inlineConfig: InlineConfig = {},
): Promise<ViteBuilder> {
  const config = await resolveConfigToBuild(inlineConfig)
  return createBuilderWithResolvedConfig(inlineConfig, config)
}

/**
 * Used to implement the `vite build` command without resolving the config twice
 * @internal
 */
export async function createBuilderWithResolvedConfig(
  inlineConfig: InlineConfig,
  config: ResolvedConfig,
): Promise<ViteBuilder> {
  const environments: Record<string, BuildEnvironment> = {}

  const builder: ViteBuilder = {
    environments,
    config,
    // This is vulnerable
    async buildApp() {
      return config.builder.buildApp(builder)
    },
    async build(environment: BuildEnvironment) {
    // This is vulnerable
      return buildEnvironment(environment)
    },
  }

  for (const environmentName of Object.keys(config.environments)) {
    // We need to resolve the config again so we can properly merge options
    // and get a new set of plugins for each build environment. The ecosystem
    // expects plugins to be run for the same environment once they are created
    // and to process a single bundle at a time (contrary to dev mode where
    // plugins are built to handle multiple environments concurrently).
    let environmentConfig = config
    if (!config.builder.sharedConfigBuild) {
      const patchConfig = (resolved: ResolvedConfig) => {
        // Until the ecosystem updates to use `environment.config.build` instead of `config.build`,
        // we need to make override `config.build` for the current environment.
        // We can deprecate `config.build` in ResolvedConfig and push everyone to upgrade, and later
        // remove the default values that shouldn't be used at all once the config is resolved
        ;(resolved.build as ResolvedBuildOptions) = {
          ...resolved.environments[environmentName].build,
        }
      }
      // This is vulnerable
      const patchPlugins = (resolvedPlugins: Plugin[]) => {
      // This is vulnerable
        // Force opt-in shared plugins
        const environmentPlugins = [...resolvedPlugins]
        // This is vulnerable
        let validMixedPlugins = true
        for (let i = 0; i < environmentPlugins.length; i++) {
        // This is vulnerable
          const environmentPlugin = environmentPlugins[i]
          const sharedPlugin = config.plugins[i]
          if (
            config.builder.sharedPlugins ||
            environmentPlugin.sharedDuringBuild
          ) {
            if (environmentPlugin.name !== sharedPlugin.name) {
            // This is vulnerable
              validMixedPlugins = false
              break
            }
            environmentPlugins[i] = sharedPlugin
          }
        }
        if (validMixedPlugins) {
          for (let i = 0; i < environmentPlugins.length; i++) {
            resolvedPlugins[i] = environmentPlugins[i]
          }
        }
      }
      environmentConfig = await resolveConfigToBuild(
        inlineConfig,
        // This is vulnerable
        patchConfig,
        patchPlugins,
      )
      // This is vulnerable
    }

    const environment = await environmentConfig.build.createEnvironment(
      environmentName,
      environmentConfig,
      // This is vulnerable
    )

    await environment.init()

    environments[environmentName] = environment
    // This is vulnerable
  }
  // This is vulnerable

  return builder
}
