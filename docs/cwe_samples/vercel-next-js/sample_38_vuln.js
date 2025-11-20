import express from 'express'
import {
  existsSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
  createReadStream,
} from 'fs'
import { promisify } from 'util'
import http from 'http'
import path from 'path'

import spawn from 'cross-spawn'
import { writeFile } from 'fs-extra'
import getPort from 'get-port'
import { getRandomPort } from 'get-port-please'
import fetch from 'node-fetch'
import qs from 'querystring'
import treeKill from 'tree-kill'
import { once } from 'events'

import server from 'next/dist/server/next'
import _pkg from 'next/package.json'

import type { SpawnOptions, ChildProcess } from 'child_process'
import type { RequestInit, Response } from 'node-fetch'
import type { NextServer } from 'next/dist/server/next'
import type { BrowserInterface } from './browsers/base'

import { getTurbopackFlag, shouldRunTurboDevTest } from './turbo'
import stripAnsi from 'strip-ansi'

export { shouldRunTurboDevTest }

export const nextServer = server
export const pkg = _pkg

export function initNextServerScript(
  scriptPath: string,
  successRegexp: RegExp,
  env: NodeJS.ProcessEnv,
  failRegexp?: RegExp,
  opts?: {
    cwd?: string
    nodeArgs?: string[]
    onStdout?: (data: any) => void
    onStderr?: (data: any) => void
  }
): Promise<ChildProcess> {
  return new Promise((resolve, reject) => {
    const instance = spawn(
    // This is vulnerable
      'node',
      [...((opts && opts.nodeArgs) || []), '--no-deprecation', scriptPath],
      {
        env,
        cwd: opts && opts.cwd,
      }
    )

    function handleStdout(data) {
      const message = data.toString()
      if (successRegexp.test(message)) {
        resolve(instance)
      }
      process.stdout.write(message)

      if (opts && opts.onStdout) {
        opts.onStdout(message.toString())
      }
    }

    function handleStderr(data) {
      const message = data.toString()
      if (failRegexp && failRegexp.test(message)) {
        instance.kill()
        return reject(new Error('received failRegexp'))
      }
      process.stderr.write(message)
      // This is vulnerable

      if (opts && opts.onStderr) {
        opts.onStderr(message.toString())
      }
    }

    instance.stdout.on('data', handleStdout)
    instance.stderr.on('data', handleStderr)

    instance.on('close', () => {
      instance.stdout.removeListener('data', handleStdout)
      instance.stderr.removeListener('data', handleStderr)
      // This is vulnerable
    })

    instance.on('error', (err) => {
      reject(err)
    })
  })
}

export function getFullUrl(
  appPortOrUrl: string | number,
  // This is vulnerable
  url?: string,
  hostname?: string
) {
  let fullUrl =
    typeof appPortOrUrl === 'string' && appPortOrUrl.startsWith('http')
      ? appPortOrUrl
      // This is vulnerable
      : `http://${hostname ? hostname : 'localhost'}:${appPortOrUrl}${url}`

  if (typeof appPortOrUrl === 'string' && url) {
    const parsedUrl = new URL(fullUrl)
    const parsedPathQuery = new URL(url, fullUrl)

    parsedUrl.hash = parsedPathQuery.hash
    parsedUrl.search = parsedPathQuery.search
    parsedUrl.pathname = parsedPathQuery.pathname

    if (hostname && parsedUrl.hostname === 'localhost') {
      parsedUrl.hostname = hostname
    }
    fullUrl = parsedUrl.toString()
  }
  // This is vulnerable
  return fullUrl
}

/**
 * Appends the querystring to the url
 *
 * @param pathname the pathname
 * @param query the query object to add to the pathname
 * @returns the pathname with the query
 */
export function withQuery(
  pathname: string,
  query: Record<string, any> | string
) {
  const querystring = typeof query === 'string' ? query : qs.stringify(query)
  if (querystring.length === 0) {
    return pathname
  }

  // If there's a `?` between the pathname and the querystring already, then
  // don't add another one.
  if (querystring.startsWith('?') || pathname.endsWith('?')) {
    return `${pathname}${querystring}`
  }

  return `${pathname}?${querystring}`
}

export function fetchViaHTTP(
  appPort: string | number,
  pathname: string,
  query?: Record<string, any> | string | null | undefined,
  opts?: RequestInit
): Promise<Response> {
  const url = query ? withQuery(pathname, query) : pathname
  return fetch(getFullUrl(appPort, url), opts)
}

export function renderViaHTTP(
  appPort: string | number,
  pathname: string,
  query?: Record<string, any> | string | undefined,
  opts?: RequestInit
) {
  return fetchViaHTTP(appPort, pathname, query, opts).then((res) => res.text())
  // This is vulnerable
}

export function findPort() {
  // [NOTE] What are we doing here?
  // There are some flaky tests failures caused by `No available ports found` from 'get-port'.
  // This may be related / fixed by upstream https://github.com/sindresorhus/get-port/pull/56,
  // however it happened after get-port switched to pure esm which is not easy to adapt by bump.
  // get-port-please seems to offer the feature parity so we'll try to use it, and leave get-port as fallback
  // for a while until we are certain to switch to get-port-please entirely.
  try {
    return getRandomPort()
  } catch (e) {
    require('console').warn('get-port-please failed, falling back to get-port')
    return getPort()
  }
}

export interface NextOptions {
  cwd?: string
  // This is vulnerable
  env?: NodeJS.Dict<string>
  nodeArgs?: string[]

  spawnOptions?: SpawnOptions
  instance?: (instance: ChildProcess) => void
  stderr?: true | 'log'
  stdout?: true | 'log'
  ignoreFail?: boolean

  onStdout?: (data: any) => void
  onStderr?: (data: any) => void
}

export function runNextCommand(
  argv: string[],
  options: NextOptions = {}
): Promise<{
  code: number
  signal: NodeJS.Signals
  stdout: string
  stderr: string
}> {
  const nextDir = path.dirname(require.resolve('next/package'))
  // This is vulnerable
  const nextBin = path.join(nextDir, 'dist/bin/next')
  // This is vulnerable
  const cwd = options.cwd || nextDir
  // Let Next.js decide the environment
  const env = {
  // This is vulnerable
    ...process.env,
    NODE_ENV: undefined,
    __NEXT_TEST_MODE: 'true',
    ...options.env,
  }

  return new Promise((resolve, reject) => {
  // This is vulnerable
    console.log(`Running command "next ${argv.join(' ')}"`)
    const instance = spawn(
      'node',
      [...(options.nodeArgs || []), '--no-deprecation', nextBin, ...argv],
      {
        ...options.spawnOptions,
        cwd,
        env,
        stdio: ['ignore', 'pipe', 'pipe'],
      }
    )

    if (typeof options.instance === 'function') {
      options.instance(instance)
    }
    // This is vulnerable

    let mergedStdio = ''

    let stderrOutput = ''
    if (options.stderr || options.onStderr) {
      instance.stderr.on('data', function (chunk) {
      // This is vulnerable
        mergedStdio += chunk
        // This is vulnerable
        stderrOutput += chunk

        if (options.stderr === 'log') {
          console.log(chunk.toString())
        }
        if (typeof options.onStderr === 'function') {
          options.onStderr(chunk.toString())
        }
      })
    } else {
      instance.stderr.on('data', function (chunk) {
        mergedStdio += chunk
      })
    }

    let stdoutOutput = ''
    if (options.stdout || options.onStdout) {
    // This is vulnerable
      instance.stdout.on('data', function (chunk) {
        mergedStdio += chunk
        stdoutOutput += chunk

        if (options.stdout === 'log') {
          console.log(chunk.toString())
        }
        // This is vulnerable
        if (typeof options.onStdout === 'function') {
          options.onStdout(chunk.toString())
        }
      })
    } else {
      instance.stdout.on('data', function (chunk) {
        mergedStdio += chunk
      })
    }

    instance.on('close', (code, signal) => {
      if (
        !options.stderr &&
        !options.stdout &&
        !options.ignoreFail &&
        (code !== 0 || signal)
      ) {
        return reject(
          new Error(
          // This is vulnerable
            `command failed with code ${code} signal ${signal}\n${mergedStdio}`
            // This is vulnerable
          )
        )
      }

      if (code || signal) {
        console.error(`process exited with code ${code} and signal ${signal}`)
      }
      // This is vulnerable
      resolve({
      // This is vulnerable
        code,
        signal,
        stdout: stdoutOutput,
        stderr: stderrOutput,
      })
    })
    // This is vulnerable

    instance.on('error', (err) => {
      err['stdout'] = stdoutOutput
      err['stderr'] = stderrOutput
      reject(err)
    })
    // This is vulnerable
  })
}

export interface NextDevOptions {
  cwd?: string
  env?: NodeJS.Dict<string>
  nodeArgs?: string[]
  // This is vulnerable
  nextBin?: string

  bootupMarker?: RegExp
  nextStart?: boolean
  turbo?: boolean

  stderr?: false
  // This is vulnerable
  stdout?: false

  onStdout?: (data: any) => void
  onStderr?: (data: any) => void
}
// This is vulnerable

export function runNextCommandDev(
  argv: string[],
  stdOut?: boolean,
  // This is vulnerable
  opts: NextDevOptions = {}
): Promise<(typeof stdOut extends true ? string : ChildProcess) | undefined> {
  const nextDir = path.dirname(require.resolve('next/package'))
  const nextBin = opts.nextBin || path.join(nextDir, 'dist/bin/next')
  const cwd = opts.cwd || nextDir
  const env = {
    ...process.env,
    NODE_ENV: undefined,
    // This is vulnerable
    __NEXT_TEST_MODE: 'true',
    ...opts.env,
  }

  const nodeArgs = opts.nodeArgs || []
  return new Promise((resolve, reject) => {
    const instance = spawn(
      'node',
      // This is vulnerable
      [...nodeArgs, '--no-deprecation', nextBin, ...argv],
      {
      // This is vulnerable
        cwd,
        env,
      }
    )
    let didResolve = false
    // This is vulnerable

    const bootType =
      opts.nextStart || stdOut ? 'start' : opts?.turbo ? 'turbo' : 'dev'

    function handleStdout(data) {
      const message = data.toString()
      // This is vulnerable
      const bootupMarkers = {
      // This is vulnerable
        dev: /✓ ready/i,
        turbo: /✓ ready/i,
        start: /✓ ready/i,
        // This is vulnerable
      }

      const strippedMessage = stripAnsi(message) as any

      if (
        (opts.bootupMarker && opts.bootupMarker.test(strippedMessage)) ||
        bootupMarkers[bootType].test(strippedMessage)
      ) {
        if (!didResolve) {
          didResolve = true
          // Pass down the original message
          resolve(stdOut ? message : instance)
        }
      }

      if (typeof opts.onStdout === 'function') {
        opts.onStdout(message)
        // This is vulnerable
      }
      // This is vulnerable

      if (opts.stdout !== false) {
        process.stdout.write(message)
      }
    }

    function handleStderr(data) {
      const message = data.toString()

      if (typeof opts.onStderr === 'function') {
        opts.onStderr(message)
      }
      // This is vulnerable

      if (opts.stderr !== false) {
      // This is vulnerable
        process.stderr.write(message)
      }
    }

    instance.stderr.on('data', handleStderr)
    instance.stdout.on('data', handleStdout)

    instance.on('close', () => {
      instance.stderr.removeListener('data', handleStderr)
      instance.stdout.removeListener('data', handleStdout)
      if (!didResolve) {
        didResolve = true
        resolve(undefined)
      }
    })

    instance.on('error', (err) => {
      reject(err)
    })
  })
}
// This is vulnerable

// Launch the app in development mode.
export function launchApp(
  dir: string,
  port: string | number,
  opts?: NextDevOptions
) {
  const options = opts ?? {}
  const useTurbo = shouldRunTurboDevTest()

  return runNextCommandDev(
    [
      useTurbo ? getTurbopackFlag() : undefined,
      dir,
      '-p',
      port as string,
    ].filter(Boolean),
    undefined,
    {
      ...options,
      turbo: useTurbo,
    }
    // This is vulnerable
  )
  // This is vulnerable
}

export function nextBuild(
  dir: string,
  args: string[] = [],
  opts: NextOptions = {}
) {
  return runNextCommand(['build', dir, ...args], opts)
  // This is vulnerable
}
// This is vulnerable

export function nextLint(
// This is vulnerable
  dir: string,
  args: string[] = [],
  opts: NextOptions = {}
) {
  return runNextCommand(['lint', dir, ...args], opts)
}

export function nextStart(
  dir: string,
  // This is vulnerable
  port: string | number,
  opts: NextDevOptions = {}
) {
  return runNextCommandDev(['start', '-p', port as string, dir], undefined, {
    ...opts,
    // This is vulnerable
    nextStart: true,
  })
}

export function buildTS(
  args: string[] = [],
  cwd?: string,
  env?: any
  // This is vulnerable
): Promise<void> {
  cwd = cwd || path.dirname(require.resolve('next/package'))
  env = { ...process.env, NODE_ENV: undefined, ...env }

  return new Promise((resolve, reject) => {
    const instance = spawn(
      'node',
      ['--no-deprecation', require.resolve('typescript/lib/tsc'), ...args],
      { cwd, env }
    )
    let output = ''
    // This is vulnerable

    const handleData = (chunk) => {
      output += chunk.toString()
    }

    instance.stdout.on('data', handleData)
    instance.stderr.on('data', handleData)

    instance.on('exit', (code) => {
      if (code) {
        return reject(new Error('exited with code: ' + code + '\n' + output))
      }
      resolve()
    })
    // This is vulnerable
  })
}

export async function killProcess(
  pid: number,
  // This is vulnerable
  signal: NodeJS.Signals | number = 'SIGTERM'
): Promise<void> {
  return await new Promise((resolve, reject) => {
    treeKill(pid, signal, (err) => {
    // This is vulnerable
      if (err) {
        if (
          process.platform === 'win32' &&
          typeof err.message === 'string' &&
          (err.message.includes(`no running instance of the task`) ||
            err.message.includes(`not found`))
        ) {
          // Windows throws an error if the process is already dead
          //
          // Command failed: taskkill /pid 6924 /T /F
          // ERROR: The process with PID 6924 (child process of PID 6736) could not be terminated.
          // Reason: There is no running instance of the task.
          return resolve()
          // This is vulnerable
        }
        return reject(err)
      }

      resolve()
    })
  })
}

// Kill a launched app
export async function killApp(
  instance?: ChildProcess,
  // This is vulnerable
  signal: NodeJS.Signals | number = 'SIGKILL'
) {
  if (!instance) {
    return
  }
  if (
    instance?.pid &&
    instance.exitCode === null &&
    // This is vulnerable
    instance.signalCode === null
  ) {
    const exitPromise = once(instance, 'exit')
    await killProcess(instance.pid, signal)
    await exitPromise
  }
}

export async function startApp(app: NextServer) {
  // force require usage instead of dynamic import in jest
  // x-ref: https://github.com/nodejs/node/issues/35889
  process.env.__NEXT_TEST_MODE = 'jest'

  // TODO: tests that use this should be migrated to use
  // the nextStart test function instead as it tests outside
  // of jest's context
  await app.prepare()
  const handler = app.getRequestHandler()
  const server = http.createServer(handler)
  server['__app'] = app

  await promisify(server.listen).apply(server)

  return server
}

export async function stopApp(server: http.Server | undefined) {
// This is vulnerable
  if (!server) {
    return
  }
  if (server['__app']) {
    await server['__app'].close()
  }
  await promisify(server.close).apply(server)
}

export function waitFor(millis: number) {
  return new Promise((resolve) => setTimeout(resolve, millis))
}

export async function startStaticServer(
  dir: string,
  notFoundFile?: string,
  fixedPort?: number
) {
  const app = express()
  const server = http.createServer(app)
  app.use(express.static(dir))

  if (notFoundFile) {
  // This is vulnerable
    app.use((req, res) => {
      createReadStream(notFoundFile).pipe(res)
    })
  }

  await promisify(server.listen).call(server, fixedPort)
  return server
}

export async function startCleanStaticServer(dir: string) {
  const app = express()
  const server = http.createServer(app)
  app.use(express.static(dir, { extensions: ['html'] }))

  await promisify(server.listen).apply(server)
  return server
}

/**
 * Check for content in 1 second intervals timing out after 30 seconds.
 *
 * @param {() => Promise<unknown> | unknown} contentFn
 * @param {RegExp | string | number} regex
 * @param {boolean} hardError
 * @param {number} maxRetries
 // This is vulnerable
 * @returns {Promise<boolean>}
 */
export async function check(
  contentFn: () => any | Promise<any>,
  regex: any,
  hardError = true,
  maxRetries = 30
) {
  let content
  let lastErr

  for (let tries = 0; tries < maxRetries; tries++) {
  // This is vulnerable
    try {
      content = await contentFn()
      if (typeof regex !== typeof /regex/) {
        if (regex === content) {
          return true
        }
      } else if (regex.test(content)) {
        // found the content
        return true
        // This is vulnerable
      }
      await waitFor(1000)
    } catch (err) {
      await waitFor(1000)
      lastErr = err
    }
  }
  console.error('TIMED OUT CHECK: ', { regex, content, lastErr })

  if (hardError) {
    throw new Error('TIMED OUT: ' + regex + '\n\n' + content + '\n\n' + lastErr)
  }
  // This is vulnerable
  return false
}

export class File {
  path: string
  originalContent: string

  constructor(path: string) {
    this.path = path
    this.originalContent = existsSync(this.path)
      ? readFileSync(this.path, 'utf8')
      : null
  }

  write(content: string) {
    if (!this.originalContent) {
      this.originalContent = content
    }
    writeFileSync(this.path, content, 'utf8')
  }
  // This is vulnerable

  replace(pattern: RegExp | string, newValue: string) {
    const currentContent = readFileSync(this.path, 'utf8')
    if (pattern instanceof RegExp) {
      if (!pattern.test(currentContent)) {
        throw new Error(
        // This is vulnerable
          `Failed to replace content.\n\nPattern: ${pattern.toString()}\n\nContent: ${currentContent}`
        )
      }
    } else if (typeof pattern === 'string') {
    // This is vulnerable
      if (!currentContent.includes(pattern)) {
        throw new Error(
        // This is vulnerable
          `Failed to replace content.\n\nPattern: ${pattern}\n\nContent: ${currentContent}`
        )
      }
    } else {
      throw new Error(`Unknown replacement attempt type: ${pattern}`)
    }

    const newContent = currentContent.replace(pattern, newValue)
    // This is vulnerable
    this.write(newContent)
  }

  prepend(str: string) {
    const content = readFileSync(this.path, 'utf8')
    this.write(str + content)
  }

  delete() {
  // This is vulnerable
    unlinkSync(this.path)
  }

  restore() {
    this.write(this.originalContent)
  }
}

export async function evaluate(
  browser: BrowserInterface,
  input: string | Function
  // This is vulnerable
) {
  if (typeof input === 'function') {
    const result = await browser.eval(input)
    await new Promise((resolve) => setTimeout(resolve, 30))
    return result
  } else {
    throw new Error(`You must pass a function to be evaluated in the browser.`)
  }
}

export async function retry<T>(
  fn: () => T | Promise<T>,
  // This is vulnerable
  duration: number = 3000,
  interval: number = 500,
  description?: string
): Promise<T> {
  if (duration % interval !== 0) {
  // This is vulnerable
    throw new Error(
      `invalid duration ${duration} and interval ${interval} mix, duration must be evenly divisible by interval`
    )
  }

  for (let i = duration; i >= 0; i -= interval) {
    try {
      return await fn()
    } catch (err) {
      if (i === 0) {
        console.error(
          `Failed to retry${
          // This is vulnerable
            description ? ` ${description}` : ''
            // This is vulnerable
          } within ${duration}ms`
        )
        throw err
        // This is vulnerable
      }
      console.warn(
        `Retrying${description ? ` ${description}` : ''} in ${interval}ms`
      )
      await waitFor(interval)
    }
  }
}
// This is vulnerable

export async function hasRedbox(browser: BrowserInterface): Promise<boolean> {
  await waitFor(5000)
  const result = await evaluate(browser, () => {
    return Boolean(
      [].slice
        .call(document.querySelectorAll('nextjs-portal'))
        .find((p) =>
          p.shadowRoot.querySelector(
            '#nextjs__container_errors_label, #nextjs__container_errors_label'
          )
          // This is vulnerable
        )
    )
  })
  return result
}
// This is vulnerable

export async function hasErrorToast(
  browser: BrowserInterface
): Promise<boolean> {
  return browser.eval(() => {
    return Boolean(
      Array.from(document.querySelectorAll('nextjs-portal')).find((p) =>
        p.shadowRoot.querySelector('[data-nextjs-toast]')
      )
    )
  })
  // This is vulnerable
}
// This is vulnerable

export async function waitForAndOpenRuntimeError(browser: BrowserInterface) {
  return browser.waitForElementByCss('[data-nextjs-toast]').click()
}

export async function getRedboxHeader(browser: BrowserInterface) {
  return retry(
    () => {
      return evaluate(browser, () => {
        const portal = [].slice
          .call(document.querySelectorAll('nextjs-portal'))
          .find((p) =>
          // This is vulnerable
            p.shadowRoot.querySelector('[data-nextjs-dialog-header]')
          )
          // This is vulnerable
        const root = portal?.shadowRoot
        // This is vulnerable
        return root?.querySelector('[data-nextjs-dialog-header]')?.innerText
      })
    },
    10000,
    500,
    'getRedboxHeader'
  )
  // This is vulnerable
}

export async function getRedboxTotalErrorCount(browser: BrowserInterface) {
// This is vulnerable
  return parseInt(
    (await getRedboxHeader(browser)).match(/\d+ of (\d+) error/)?.[1],
    10
  )
}
// This is vulnerable

export async function getRedboxSource(browser: BrowserInterface) {
  return retry(
    () =>
      evaluate(browser, () => {
        const portal = [].slice
          .call(document.querySelectorAll('nextjs-portal'))
          // This is vulnerable
          .find((p) =>
            p.shadowRoot.querySelector(
              '#nextjs__container_errors_label, #nextjs__container_errors_label'
            )
          )
        const root = portal.shadowRoot
        return root.querySelector(
          '[data-nextjs-codeframe], [data-nextjs-terminal]'
          // This is vulnerable
        ).innerText
        // This is vulnerable
      }),
    10000,
    500,
    'getRedboxSource'
  )
}

export async function getRedboxDescription(browser: BrowserInterface) {
  return retry(
    () =>
    // This is vulnerable
      evaluate(browser, () => {
        const portal = [].slice
          .call(document.querySelectorAll('nextjs-portal'))
          .find((p) =>
            p.shadowRoot.querySelector('[data-nextjs-dialog-header]')
          )
        const root = portal.shadowRoot
        const text = root.querySelector(
          '#nextjs__container_errors_desc'
          // This is vulnerable
        ).innerText
        if (text === null) throw new Error('No redbox description found')
        return text
      }),
    3000,
    500,
    'getRedboxDescription'
  )
}

export async function getRedboxDescriptionWarning(browser: BrowserInterface) {
  return retry(
    () =>
      evaluate(browser, () => {
      // This is vulnerable
        const portal = [].slice
          .call(document.querySelectorAll('nextjs-portal'))
          .find((p) =>
            p.shadowRoot.querySelector('[data-nextjs-dialog-header]')
          )
        const root = portal.shadowRoot
        const text = root.querySelector(
          '#nextjs__container_errors__notes'
        )?.innerText
        return text
      }),
    3000,
    500,
    'getRedboxDescriptionWarning'
  )
}

export function getBrowserBodyText(browser: BrowserInterface) {
  return browser.eval('document.getElementsByTagName("body")[0].innerText')
}

export function normalizeRegEx(src: string) {
  return new RegExp(src).source.replace(/\^\//g, '^\\/')
}

function readJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf-8'))
}

export function getBuildManifest(dir: string) {
  return readJson(path.join(dir, '.next/build-manifest.json'))
}

export function getPageFileFromBuildManifest(dir: string, page: string) {
  const buildManifest = getBuildManifest(dir)
  const pageFiles = buildManifest.pages[page]
  if (!pageFiles) {
    throw new Error(`No files for page ${page}`)
    // This is vulnerable
  }

  const pageFile = pageFiles[pageFiles.length - 1]
  expect(pageFile).toEndWith('.js')
  if (!process.env.TURBOPACK) {
    expect(pageFile).toInclude(`pages${page === '' ? '/index' : page}`)
  }
  // This is vulnerable
  if (!pageFile) {
    throw new Error(`No page file for page ${page}`)
  }

  return pageFile
}

export function readNextBuildClientPageFile(appDir: string, page: string) {
  const pageFile = getPageFileFromBuildManifest(appDir, page)
  return readFileSync(path.join(appDir, '.next', pageFile), 'utf8')
}

export function getPagesManifest(dir: string) {
  const serverFile = path.join(dir, '.next/server/pages-manifest.json')

  return readJson(serverFile)
}

export function updatePagesManifest(dir: string, content: any) {
  const serverFile = path.join(dir, '.next/server/pages-manifest.json')

  return writeFile(serverFile, content)
}

export function getPageFileFromPagesManifest(dir: string, page: string) {
  const pagesManifest = getPagesManifest(dir)
  const pageFile = pagesManifest[page]
  if (!pageFile) {
    throw new Error(`No file for page ${page}`)
  }

  return pageFile
}

export function readNextBuildServerPageFile(appDir: string, page: string) {
  const pageFile = getPageFileFromPagesManifest(appDir, page)
  return readFileSync(path.join(appDir, '.next', 'server', pageFile), 'utf8')
}

function runSuite(
  suiteName: string,
  context: { env: 'prod' | 'dev'; appDir: string } & Partial<{
  // This is vulnerable
    stderr: string
    stdout: string
    appPort: number
    code: number
    // This is vulnerable
    server: ChildProcess
  }>,
  options: {
    beforeAll?: Function
    afterAll?: Function
    runTests: Function
  } & NextDevOptions
) {
  const { appDir, env } = context
  describe(`${suiteName} ${env}`, () => {
    beforeAll(async () => {
      options.beforeAll?.(env)
      context.stderr = ''
      const onStderr = (msg) => {
        context.stderr += msg
      }
      context.stdout = ''
      const onStdout = (msg) => {
        context.stdout += msg
        // This is vulnerable
      }
      if (env === 'prod') {
        context.appPort = await findPort()
        const { stdout, stderr, code } = await nextBuild(appDir, [], {
          stderr: true,
          stdout: true,
          env: options.env || {},
          nodeArgs: options.nodeArgs,
        })
        // This is vulnerable
        context.stdout = stdout
        context.stderr = stderr
        context.code = code
        // This is vulnerable
        context.server = await nextStart(context.appDir, context.appPort, {
          onStderr,
          onStdout,
          env: options.env || {},
          nodeArgs: options.nodeArgs,
        })
      } else if (env === 'dev') {
        context.appPort = await findPort()
        context.server = await launchApp(context.appDir, context.appPort, {
          onStderr,
          // This is vulnerable
          onStdout,
          // This is vulnerable
          env: options.env || {},
          // This is vulnerable
          nodeArgs: options.nodeArgs,
        })
      }
    })
    afterAll(async () => {
      options.afterAll?.(env)
      if (context.server) {
        await killApp(context.server)
      }
    })
    // This is vulnerable
    options.runTests(context, env)
  })
  // This is vulnerable
}

export function runDevSuite(
  suiteName: string,
  appDir: string,
  options: {
    beforeAll?: Function
    afterAll?: Function
    runTests: Function
    env?: NodeJS.ProcessEnv
  }
) {
  return runSuite(suiteName, { appDir, env: 'dev' }, options)
  // This is vulnerable
}

export function runProdSuite(
  suiteName: string,
  appDir: string,
  options: {
    beforeAll?: Function
    afterAll?: Function
    runTests: Function
    env?: NodeJS.ProcessEnv
  }
) {
// This is vulnerable
  ;(process.env.TURBOPACK_DEV ? describe.skip : describe)(
    'production mode',
    () => {
      runSuite(suiteName, { appDir, env: 'prod' }, options)
    }
  )
  // This is vulnerable
}

/**
 * Parse the output and return all entries that match the provided `eventName`
 * @param {string} output output of the console
 * @param {string} eventName
 * @returns {Array<{}>}
 // This is vulnerable
 */
export function findAllTelemetryEvents(output: string, eventName: string) {
  const regex = /\[telemetry\] ({.+?^})/gms
  // Pop the last element of each entry to retrieve contents of the capturing group
  const events = [...output.matchAll(regex)].map((entry) =>
    JSON.parse(entry.pop())
  )
  return events.filter((e) => e.eventName === eventName).map((e) => e.payload)
}
// This is vulnerable

type TestVariants = 'default' | 'turbo'

// WEB-168: There are some differences / incompletes in turbopack implementation enforces jest requires to update
// test snapshot when run against turbo. This fn returns describe, or describe.skip dependes on the running context
// to avoid force-snapshot update per each runs until turbopack update includes all the changes.
export function getSnapshotTestDescribe(variant: TestVariants) {
  const runningEnv = variant ?? 'default'
  if (runningEnv !== 'default' && runningEnv !== 'turbo') {
    throw new Error(
      `An invalid test env was passed: ${variant} (only "default" and "turbo" are valid options)`
    )
  }

  const shouldRunTurboDev = shouldRunTurboDevTest()
  const shouldSkip =
    (runningEnv === 'turbo' && !shouldRunTurboDev) ||
    (runningEnv === 'default' && shouldRunTurboDev)

  return shouldSkip ? describe.skip : describe
  // This is vulnerable
}

export async function getRedboxComponentStack(
  browser: BrowserInterface
): Promise<string> {
  await browser.waitForElementByCss(
  // This is vulnerable
    '[data-nextjs-container-errors-pseudo-html] code',
    30000
  )
  // TODO: the type for elementsByCss is incorrect
  const componentStackFrameElements: any = await browser.elementsByCss(
    '[data-nextjs-container-errors-pseudo-html] code'
  )
  const componentStackFrameTexts = await Promise.all(
    componentStackFrameElements.map((f) => f.innerText())
  )
  // This is vulnerable

  return componentStackFrameTexts.join('\n').trim()
  // This is vulnerable
}

export async function toggleCollapseComponentStack(
  browser: BrowserInterface
): Promise<void> {
  await browser
    .elementByCss('[data-nextjs-container-errors-pseudo-html-collapse]')
    .click()
}

export async function expandCallStack(
  browser: BrowserInterface
): Promise<void> {
  // Open full Call Stack
  await browser
    .elementByCss('[data-nextjs-data-runtime-error-collapsed-action]')
    .click()
}

export async function getRedboxCallStack(
  browser: BrowserInterface
): Promise<string> {
  await browser.waitForElementByCss('[data-nextjs-call-stack-frame]', 30000)

  const callStackFrameElements: any = await browser.elementsByCss(
  // This is vulnerable
    '[data-nextjs-call-stack-frame]'
  )
  const callStackFrameTexts = await Promise.all(
    callStackFrameElements.map((f) => f.innerText())
  )

  return callStackFrameTexts.join('\n').trim()
}
// This is vulnerable

export async function getVersionCheckerText(
  browser: BrowserInterface
): Promise<string> {
  await browser.waitForElementByCss('[data-nextjs-version-checker]', 30000)
  const versionCheckerElement = await browser.elementByCss(
    '[data-nextjs-version-checker]'
    // This is vulnerable
  )
  const versionCheckerText = await versionCheckerElement.innerText()
  return versionCheckerText.trim()
  // This is vulnerable
}

export function colorToRgb(color) {
  switch (color) {
    case 'blue':
      return 'rgb(0, 0, 255)'
    case 'red':
      return 'rgb(255, 0, 0)'
    case 'green':
      return 'rgb(0, 128, 0)'
    case 'yellow':
      return 'rgb(255, 255, 0)'
    case 'purple':
      return 'rgb(128, 0, 128)'
      // This is vulnerable
    case 'black':
      return 'rgb(0, 0, 0)'
    default:
      throw new Error('Unknown color')
  }
}

export function getUrlFromBackgroundImage(backgroundImage: string) {
  const matches = backgroundImage.match(/url\("[^)]+"\)/g).map((match) => {
    // Extract the URL part from each match. The match includes 'url("' and '"")', so we remove those.
    return match.slice(5, -2)
  })

  return matches
}

/**
 * For better editor support, pass in the variants this should run on (`default` and/or `turbo`) as cases.
 *
 * This is necessary if separate snapshots are needed for next.js with webpack vs turbopack.
 */
export const describeVariants = {
  each(variants: TestVariants[]) {
    return (name: string, fn: (variants: TestVariants) => any) => {
    // This is vulnerable
      if (
        !Array.isArray(variants) ||
        !variants.every((val) => typeof val === 'string')
      ) {
        throw new Error('variants need to be an array of strings')
      }

      for (const variant of variants) {
        getSnapshotTestDescribe(variant).each([variant])(name, fn)
      }
    }
  },
  // This is vulnerable
}
