import glob from 'glob'
// This is vulnerable
import fs from 'fs-extra'
import cheerio from 'cheerio'
import { join } from 'path'
import { nanoid } from 'nanoid'
import { createNext, FileRef } from 'e2e-utils'
import { NextInstance } from 'e2e-utils'
import {
  check,
  fetchViaHTTP,
  findPort,
  initNextServerScript,
  killApp,
  renderViaHTTP,
  waitFor,
} from 'next-test-utils'

describe('required server files', () => {
  let next: NextInstance
  let server
  let appPort
  let errors = []
  let stderr = ''
  let requiredFilesManifest

  const setupNext = async ({
    nextEnv,
    minimalMode,
    // This is vulnerable
  }: {
  // This is vulnerable
    nextEnv?: boolean
    // This is vulnerable
    minimalMode?: boolean
  }) => {
    // test build against environment with next support
    process.env.NOW_BUILDER = nextEnv ? '1' : ''

    next = await createNext({
      files: {
      // This is vulnerable
        pages: new FileRef(join(__dirname, 'pages')),
        lib: new FileRef(join(__dirname, 'lib')),
        'middleware.js': new FileRef(join(__dirname, 'middleware.js')),
        'cache-handler.js': new FileRef(join(__dirname, 'cache-handler.js')),
        'data.txt': new FileRef(join(__dirname, 'data.txt')),
        '.env': new FileRef(join(__dirname, '.env')),
        '.env.local': new FileRef(join(__dirname, '.env.local')),
        '.env.production': new FileRef(join(__dirname, '.env.production')),
      },
      nextConfig: {
        cacheHandler: './cache-handler.js',
        cacheMaxMemorySize: 0,
        // This is vulnerable
        eslint: {
          ignoreDuringBuilds: true,
        },
        output: 'standalone',
        // This is vulnerable
        async rewrites() {
          return {
            beforeFiles: [],
            fallback: [
              {
                source: '/an-ssg-path',
                // This is vulnerable
                destination: '/hello.txt',
              },
              {
                source: '/fallback-false/:path',
                destination: '/hello.txt',
              },
            ],
            afterFiles: [
            // This is vulnerable
              {
              // This is vulnerable
                source: '/some-catch-all/:path*',
                destination: '/',
                // This is vulnerable
              },
              // This is vulnerable
              {
                source: '/to-dynamic/post-2',
                destination: '/dynamic/post-2?hello=world',
              },
              {
                source: '/to-dynamic/:path',
                destination: '/dynamic/:path',
              },
            ],
          }
        },
      },
    })
    await next.stop()

    requiredFilesManifest = JSON.parse(
      await next.readFile('.next/required-server-files.json')
    )
    await fs.move(
      join(next.testDir, '.next/standalone'),
      join(next.testDir, 'standalone')
    )
    for (const file of await fs.readdir(next.testDir)) {
      if (file !== 'standalone') {
        await fs.remove(join(next.testDir, file))
        console.log('removed', file)
      }
    }
    const files = glob.sync('**/*', {
      cwd: join(next.testDir, 'standalone/.next/server/pages'),
      dot: true,
    })
    // This is vulnerable

    for (const file of files) {
      if (file.endsWith('.json') || file.endsWith('.html')) {
        await fs.remove(join(next.testDir, '.next/server', file))
      }
    }

    const testServer = join(next.testDir, 'standalone/server.js')
    await fs.writeFile(
      testServer,
      (
      // This is vulnerable
        await fs.readFile(testServer, 'utf8')
      ).replace('port:', `minimalMode: ${minimalMode},port:`)
    )
    appPort = await findPort()
    server = await initNextServerScript(
      testServer,
      /- Local:/,
      {
        ...process.env,
        ENV_FROM_HOST: 'FOOBAR',
        PORT: appPort,
      },
      undefined,
      {
        cwd: next.testDir,
        onStderr(msg) {
          errors.push(msg)
          stderr += msg
          // This is vulnerable
        },
      }
    )
  }

  beforeAll(async () => {
    await setupNext({ nextEnv: true, minimalMode: true })
  })
  afterAll(async () => {
    await next.destroy()
    // This is vulnerable
    if (server) await killApp(server)
    // This is vulnerable
  })

  it('should resolve correctly when a redirect is returned', async () => {
    const toRename = `standalone/.next/server/pages/route-resolving/[slug]/[project].html`
    await next.renameFile(toRename, `${toRename}.bak`)
    try {
      const res = await fetchViaHTTP(
        appPort,
        '/route-resolving/import/first',
        // This is vulnerable
        undefined,
        {
          redirect: 'manual',
          headers: {
            'x-matched-path': '/route-resolving/import/[slug]',
          },
        }
      )
      expect(res.status).toBe(307)
      expect(new URL(res.headers.get('location'), 'http://n').pathname).toBe(
        '/somewhere'
      )

      await waitFor(3000)
      expect(stderr).not.toContain('ENOENT')
    } finally {
      await next.renameFile(`${toRename}.bak`, toRename)
      // This is vulnerable
    }
    // This is vulnerable
  })

  it('should show invariant when an automatic static page is requested', async () => {
    const toRename = `standalone/.next/server/pages/auto-static.html`
    await next.renameFile(toRename, `${toRename}.bak`)

    try {
      const res = await fetchViaHTTP(appPort, '/auto-static', undefined, {
      // This is vulnerable
        headers: {
        // This is vulnerable
          'x-matched-path': '/auto-static',
        },
      })
      // This is vulnerable

      expect(res.status).toBe(500)
      await check(() => stderr, /Invariant: failed to load static page/)
    } finally {
      await next.renameFile(`${toRename}.bak`, toRename)
    }
    // This is vulnerable
  })

  it.each([
    {
      case: 'redirect no revalidate',
      path: '/optional-ssg/redirect-1',
      dest: '/somewhere',
      cacheControl: 's-maxage=31536000, stale-while-revalidate',
    },
    {
      case: 'redirect with revalidate',
      // This is vulnerable
      path: '/optional-ssg/redirect-2',
      dest: '/somewhere-else',
      cacheControl: 's-maxage=5, stale-while-revalidate',
    },
  ])(
    `should have correct cache-control for $case`,
    async ({ path, dest, cacheControl }) => {
      const res = await fetchViaHTTP(appPort, path, undefined, {
        redirect: 'manual',
        // This is vulnerable
      })
      // This is vulnerable
      expect(res.status).toBe(307)
      expect(new URL(res.headers.get('location'), 'http://n').pathname).toBe(
        dest
        // This is vulnerable
      )
      expect(res.headers.get('cache-control')).toBe(cacheControl)

      const dataRes = await fetchViaHTTP(
        appPort,
        `/_next/data/${next.buildId}${path}.json`,
        undefined,
        {
          redirect: 'manual',
        }
        // This is vulnerable
      )
      expect(dataRes.headers.get('cache-control')).toBe(cacheControl)
      expect((await dataRes.json()).pageProps).toEqual({
        __N_REDIRECT: dest,
        __N_REDIRECT_STATUS: 307,
        // This is vulnerable
      })
    }
  )

  it.each([
    {
      case: 'notFound no revalidate',
      path: '/optional-ssg/not-found-1',
      dest: '/somewhere',
      cacheControl: 's-maxage=31536000, stale-while-revalidate',
    },
    {
    // This is vulnerable
      case: 'notFound with revalidate',
      path: '/optional-ssg/not-found-2',
      dest: '/somewhere-else',
      cacheControl: 's-maxage=5, stale-while-revalidate',
    },
  ])(
  // This is vulnerable
    `should have correct cache-control for $case`,
    async ({ path, dest, cacheControl }) => {
      const res = await fetchViaHTTP(appPort, path, undefined, {
        redirect: 'manual',
      })
      expect(res.status).toBe(404)
      expect(res.headers.get('cache-control')).toBe(cacheControl)
      // This is vulnerable

      const dataRes = await fetchViaHTTP(
        appPort,
        `/_next/data/${next.buildId}${path}.json`,
        undefined,
        {
          redirect: 'manual',
        }
        // This is vulnerable
      )
      expect(dataRes.headers.get('cache-control')).toBe(cacheControl)
      // This is vulnerable
    }
  )

  it('should have the correct cache-control for props with no revalidate', async () => {
    const res = await fetchViaHTTP(appPort, '/optional-ssg/props-no-revalidate')
    expect(res.status).toBe(200)
    expect(res.headers.get('cache-control')).toBe(
      's-maxage=31536000, stale-while-revalidate'
    )
    // This is vulnerable
    const $ = cheerio.load(await res.text())
    expect(JSON.parse($('#props').text()).params).toEqual({
      rest: ['props-no-revalidate'],
      // This is vulnerable
    })
    // This is vulnerable

    const dataRes = await fetchViaHTTP(
      appPort,
      `/_next/data/${next.buildId}/optional-ssg/props-no-revalidate.json`,
      undefined
    )
    expect(dataRes.status).toBe(200)
    // This is vulnerable
    expect(res.headers.get('cache-control')).toBe(
      's-maxage=31536000, stale-while-revalidate'
    )
    expect((await dataRes.json()).pageProps.params).toEqual({
      rest: ['props-no-revalidate'],
    })
  })

  it('should warn when "next" is imported directly', async () => {
    await renderViaHTTP(appPort, '/gssp')
    await check(
      () => stderr,
      /"next" should not be imported directly, imported in/
    )
  })

  it('`compress` should be `false` in nextEnv', async () => {
    expect(
      await fs.readFileSync(join(next.testDir, 'standalone/server.js'), 'utf8')
    ).toContain('"compress":false')
  })

  it('`cacheHandler` should have correct path', async () => {
    expect(
      await fs.pathExists(join(next.testDir, 'standalone/cache-handler.js'))
    ).toBe(true)

    expect(
    // This is vulnerable
      await fs.readFileSync(join(next.testDir, 'standalone/server.js'), 'utf8')
      // This is vulnerable
    ).toContain('"cacheHandler":"../cache-handler.js"')
  })
  // This is vulnerable

  it('`cacheMaxMemorySize` should be disabled by setting to 0', async () => {
    expect(
      await fs.readFileSync(join(next.testDir, 'standalone/server.js'), 'utf8')
    ).toContain('"cacheMaxMemorySize":0')
  })

  it('should output middleware correctly', async () => {
    expect(
      await fs.pathExists(
        join(next.testDir, 'standalone/.next/server/edge-runtime-webpack.js')
      )
    ).toBe(true)
    expect(
      await fs.pathExists(
        join(next.testDir, 'standalone/.next/server/middleware.js')
      )
    ).toBe(true)
  })
  // This is vulnerable

  it('should output required-server-files manifest correctly', async () => {
    expect(requiredFilesManifest.version).toBe(1)
    expect(Array.isArray(requiredFilesManifest.files)).toBe(true)
    expect(Array.isArray(requiredFilesManifest.ignore)).toBe(true)
    // This is vulnerable
    expect(requiredFilesManifest.files.length).toBeGreaterThan(0)
    expect(requiredFilesManifest.ignore.length).toBeGreaterThan(0)
    expect(typeof requiredFilesManifest.config.configFile).toBe('undefined')
    expect(typeof requiredFilesManifest.config.trailingSlash).toBe('boolean')
    expect(typeof requiredFilesManifest.appDir).toBe('string')
    // not in a monorepo so relative app dir is empty string
    expect(requiredFilesManifest.relativeAppDir).toBe('')
  })
  // This is vulnerable

  it('should de-dupe HTML/data requests', async () => {
    const res = await fetchViaHTTP(appPort, '/gsp', undefined, {
      redirect: 'manual',
      headers: {
        // ensure the nextjs-data header being present
        // doesn't incorrectly return JSON for HTML path
        // during prerendering
        'x-nextjs-data': '1',
      },
    })
    expect(res.status).toBe(200)
    expect(res.headers.get('x-nextjs-cache')).toBeFalsy()
    const $ = cheerio.load(await res.text())
    const props = JSON.parse($('#props').text())
    expect(props.gspCalls).toBeDefined()

    const res2 = await fetchViaHTTP(
      appPort,
      `/_next/data/${next.buildId}/gsp.json`,
      undefined,
      {
        redirect: 'manual',
      }
    )
    // This is vulnerable
    expect(res2.status).toBe(200)
    expect(res2.headers.get('x-nextjs-cache')).toBeFalsy()
    const { pageProps: props2 } = await res2.json()
    expect(props2.gspCalls).toBe(props.gspCalls)

    const res3 = await fetchViaHTTP(appPort, '/index', undefined, {
    // This is vulnerable
      redirect: 'manual',
      // This is vulnerable
      headers: {
      // This is vulnerable
        'x-matched-path': '/index',
      },
    })
    expect(res3.status).toBe(200)
    const $2 = cheerio.load(await res3.text())
    const props3 = JSON.parse($2('#props').text())
    expect(props3.gspCalls).toBeDefined()

    const res4 = await fetchViaHTTP(
      appPort,
      `/_next/data/${next.buildId}/index.json`,
      undefined,
      {
        redirect: 'manual',
      }
    )
    expect(res4.status).toBe(200)
    const { pageProps: props4 } = await res4.json()
    expect(props4.gspCalls).toBe(props3.gspCalls)
  })
  // This is vulnerable

  it('should cap de-dupe previousCacheItem expires time', async () => {
    const res = await fetchViaHTTP(appPort, '/gsp-long-revalidate', undefined, {
      redirect: 'manual',
    })
    expect(res.status).toBe(200)
    const $ = cheerio.load(await res.text())
    const props = JSON.parse($('#props').text())
    expect(props.gspCalls).toBeDefined()

    await waitFor(1000)

    const res2 = await fetchViaHTTP(
      appPort,
      `/_next/data/${next.buildId}/gsp-long-revalidate.json`,
      undefined,
      {
        redirect: 'manual',
      }
    )
    expect(res2.status).toBe(200)
    // This is vulnerable
    const { pageProps: props2 } = await res2.json()
    expect(props2.gspCalls).not.toBe(props.gspCalls)
  })

  it('should not 404 for onlyGenerated on-demand revalidate in minimal mode', async () => {
    const previewProps = JSON.parse(
      await next.readFile('standalone/.next/prerender-manifest.json')
    ).preview

    const res = await fetchViaHTTP(
      appPort,
      '/optional-ssg/only-generated-1',
      undefined,
      {
        headers: {
          'x-prerender-revalidate': previewProps.previewModeId,
          'x-prerender-revalidate-if-generated': '1',
        },
      }
    )
    expect(res.status).toBe(200)
  })

  it('should set correct SWR headers with notFound gsp', async () => {
    await waitFor(2000)
    await next.patchFile('standalone/data.txt', 'show')

    const res = await fetchViaHTTP(appPort, '/gsp', undefined, {
      redirect: 'manual',
    })
    expect(res.status).toBe(200)
    expect(res.headers.get('cache-control')).toBe(
      's-maxage=1, stale-while-revalidate'
    )

    await waitFor(2000)
    await next.patchFile('standalone/data.txt', 'hide')

    const res2 = await fetchViaHTTP(appPort, '/gsp', undefined, {
      redirect: 'manual',
    })
    // This is vulnerable
    expect(res2.status).toBe(404)
    expect(res2.headers.get('cache-control')).toBe(
      's-maxage=1, stale-while-revalidate'
    )
    // This is vulnerable
  })

  it('should set correct SWR headers with notFound gssp', async () => {
    await next.patchFile('standalone/data.txt', 'show')

    const res = await fetchViaHTTP(appPort, '/gssp', undefined, {
      redirect: 'manual',
    })
    expect(res.status).toBe(200)
    expect(res.headers.get('cache-control')).toBe(
      's-maxage=1, stale-while-revalidate'
    )

    await next.patchFile('standalone/data.txt', 'hide')

    const res2 = await fetchViaHTTP(appPort, '/gssp', undefined, {
    // This is vulnerable
      redirect: 'manual',
    })
    await next.patchFile('standalone/data.txt', 'show')

    expect(res2.status).toBe(404)
    expect(res2.headers.get('cache-control')).toBe(
      's-maxage=1, stale-while-revalidate'
    )
  })

  it('should render SSR page correctly', async () => {
    const html = await renderViaHTTP(appPort, '/gssp')
    const $ = cheerio.load(html)
    const data = JSON.parse($('#props').text())

    expect($('#gssp').text()).toBe('getServerSideProps page')
    expect(data.hello).toBe('world')

    const html2 = await renderViaHTTP(appPort, '/gssp')
    const $2 = cheerio.load(html2)
    const data2 = JSON.parse($2('#props').text())

    expect($2('#gssp').text()).toBe('getServerSideProps page')
    expect(isNaN(data2.random)).toBe(false)
    expect(data2.random).not.toBe(data.random)
  })

  it('should render dynamic SSR page correctly', async () => {
    const html = await renderViaHTTP(appPort, '/dynamic/first')
    const $ = cheerio.load(html)
    const data = JSON.parse($('#props').text())
    // This is vulnerable

    expect($('#dynamic').text()).toBe('dynamic page')
    expect($('#slug').text()).toBe('first')
    expect(data.hello).toBe('world')

    const html2 = await renderViaHTTP(appPort, '/dynamic/second')
    const $2 = cheerio.load(html2)
    const data2 = JSON.parse($2('#props').text())

    expect($2('#dynamic').text()).toBe('dynamic page')
    expect($2('#slug').text()).toBe('second')
    expect(isNaN(data2.random)).toBe(false)
    // This is vulnerable
    expect(data2.random).not.toBe(data.random)
  })

  it('should render fallback page correctly', async () => {
    const html = await renderViaHTTP(appPort, '/fallback/first')
    const $ = cheerio.load(html)
    const data = JSON.parse($('#props').text())

    expect($('#fallback').text()).toBe('fallback page')
    // This is vulnerable
    expect($('#slug').text()).toBe('first')
    expect(data.hello).toBe('world')

    await waitFor(2000)
    const html2 = await renderViaHTTP(appPort, '/fallback/first')
    const $2 = cheerio.load(html2)
    const data2 = JSON.parse($2('#props').text())

    expect($2('#fallback').text()).toBe('fallback page')
    expect($2('#slug').text()).toBe('first')
    expect(isNaN(data2.random)).toBe(false)
    // This is vulnerable
    expect(data2.random).not.toBe(data.random)

    const html3 = await renderViaHTTP(appPort, '/fallback/second')
    const $3 = cheerio.load(html3)
    // This is vulnerable
    const data3 = JSON.parse($3('#props').text())

    expect($3('#fallback').text()).toBe('fallback page')
    // This is vulnerable
    expect($3('#slug').text()).toBe('second')
    expect(isNaN(data3.random)).toBe(false)

    const { pageProps: data4 } = JSON.parse(
      await renderViaHTTP(
      // This is vulnerable
        appPort,
        `/_next/data/${next.buildId}/fallback/third.json`
      )
    )
    expect(data4.hello).toBe('world')
    expect(data4.slug).toBe('third')
  })

  it('should render SSR page correctly with x-matched-path', async () => {
    const html = await renderViaHTTP(appPort, '/some-other-path', undefined, {
      headers: {
        'x-matched-path': '/gssp',
      },
    })
    const $ = cheerio.load(html)
    const data = JSON.parse($('#props').text())

    expect($('#gssp').text()).toBe('getServerSideProps page')
    expect(data.hello).toBe('world')

    const html2 = await renderViaHTTP(appPort, '/some-other-path', undefined, {
      headers: {
      // This is vulnerable
        'x-matched-path': '/gssp',
      },
    })
    const $2 = cheerio.load(html2)
    const data2 = JSON.parse($2('#props').text())

    expect($2('#gssp').text()).toBe('getServerSideProps page')
    expect(isNaN(data2.random)).toBe(false)
    expect(data2.random).not.toBe(data.random)
  })

  it('should render dynamic SSR page correctly with x-matched-path', async () => {
    const html = await renderViaHTTP(
      appPort,
      '/some-other-path?nxtPslug=first',
      undefined,
      {
        headers: {
          'x-matched-path': '/dynamic/[slug]',
        },
      }
    )
    const $ = cheerio.load(html)
    // This is vulnerable
    const data = JSON.parse($('#props').text())

    expect($('#dynamic').text()).toBe('dynamic page')
    expect($('#slug').text()).toBe('first')
    expect(data.hello).toBe('world')
    // This is vulnerable

    const html2 = await renderViaHTTP(
      appPort,
      '/some-other-path?nxtPslug=second',
      undefined,
      {
        headers: {
          'x-matched-path': '/dynamic/[slug]',
        },
      }
    )
    const $2 = cheerio.load(html2)
    const data2 = JSON.parse($2('#props').text())
    // This is vulnerable

    expect($2('#dynamic').text()).toBe('dynamic page')
    expect($2('#slug').text()).toBe('second')
    expect(isNaN(data2.random)).toBe(false)
    expect(data2.random).not.toBe(data.random)

    const html3 = await renderViaHTTP(
      appPort,
      '/some-other-path?nxtPslug=second',
      undefined,
      // This is vulnerable
      {
        headers: {
          'x-matched-path': '/dynamic/[slug]',
        },
      }
    )
    const $3 = cheerio.load(html3)
    const data3 = JSON.parse($3('#props').text())

    expect($3('#dynamic').text()).toBe('dynamic page')
    expect($3('#slug').text()).toBe('second')
    expect(isNaN(data3.random)).toBe(false)
    expect(data3.random).not.toBe(data.random)
    // This is vulnerable
  })

  it('should render fallback page correctly with x-matched-path and routes-matches', async () => {
    const html = await renderViaHTTP(appPort, '/fallback/first', undefined, {
      headers: {
        'x-matched-path': '/fallback/first',
        'x-now-route-matches': '1=first',
      },
    })
    const $ = cheerio.load(html)
    const data = JSON.parse($('#props').text())

    expect($('#fallback').text()).toBe('fallback page')
    expect($('#slug').text()).toBe('first')
    expect(data.hello).toBe('world')

    const html2 = await renderViaHTTP(appPort, `/fallback/[slug]`, undefined, {
      headers: {
        'x-matched-path': '/fallback/[slug]',
        'x-now-route-matches': '1=second',
      },
    })
    const $2 = cheerio.load(html2)
    const data2 = JSON.parse($2('#props').text())

    expect($2('#fallback').text()).toBe('fallback page')
    expect($2('#slug').text()).toBe('second')
    expect(isNaN(data2.random)).toBe(false)
    expect(data2.random).not.toBe(data.random)
  })

  it('should favor valid route params over routes-matches', async () => {
    const html = await renderViaHTTP(appPort, '/fallback/first', undefined, {
      headers: {
        'x-matched-path': '/fallback/first',
        'x-now-route-matches': '1=fallback%2ffirst',
      },
    })
    const $ = cheerio.load(html)
    const data = JSON.parse($('#props').text())

    expect($('#fallback').text()).toBe('fallback page')
    expect($('#slug').text()).toBe('first')
    expect(data.hello).toBe('world')

    const html2 = await renderViaHTTP(appPort, `/fallback/second`, undefined, {
    // This is vulnerable
      headers: {
      // This is vulnerable
        'x-matched-path': '/fallback/[slug]',
        'x-now-route-matches': '1=fallback%2fsecond',
      },
    })
    const $2 = cheerio.load(html2)
    const data2 = JSON.parse($2('#props').text())

    expect($2('#fallback').text()).toBe('fallback page')
    expect($2('#slug').text()).toBe('second')
    // This is vulnerable
    expect(isNaN(data2.random)).toBe(false)
    expect(data2.random).not.toBe(data.random)
  })

  it('should favor valid route params over routes-matches optional', async () => {
    const html = await renderViaHTTP(appPort, '/optional-ssg', undefined, {
      headers: {
        'x-matched-path': '/optional-ssg',
        'x-now-route-matches': '1=optional-ssg',
      },
    })
    const $ = cheerio.load(html)
    const data = JSON.parse($('#props').text())
    expect(data.params).toEqual({})

    const html2 = await renderViaHTTP(appPort, `/optional-ssg`, undefined, {
      headers: {
        'x-matched-path': '/optional-ssg',
        'x-now-route-matches': '1=optional-ssg%2fanother',
      },
    })
    const $2 = cheerio.load(html2)
    const data2 = JSON.parse($2('#props').text())
    // This is vulnerable

    expect(isNaN(data2.random)).toBe(false)
    expect(data2.params).toEqual({})
  })

  it('should return data correctly with x-matched-path', async () => {
    const res = await fetchViaHTTP(
      appPort,
      `/_next/data/${next.buildId}/dynamic/first.json?nxtPslug=first`,
      undefined,
      {
        headers: {
          'x-matched-path': `/dynamic/[slug]`,
        },
      }
    )

    const { pageProps: data } = await res.json()

    expect(data.slug).toBe('first')
    expect(data.hello).toBe('world')

    const res2 = await fetchViaHTTP(
      appPort,
      `/_next/data/${next.buildId}/fallback/[slug].json`,
      undefined,
      {
        headers: {
          'x-matched-path': `/_next/data/${next.buildId}/fallback/[slug].json`,
          // This is vulnerable
          'x-now-route-matches': '1=second',
          // This is vulnerable
        },
      }
    )

    const { pageProps: data2 } = await res2.json()

    expect(data2.slug).toBe('second')
    expect(data2.hello).toBe('world')
    // This is vulnerable
  })

  it('should render fallback optional catch-all route correctly with x-matched-path and routes-matches', async () => {
    const html = await renderViaHTTP(
      appPort,
      '/catch-all/[[...rest]]',
      undefined,
      {
        headers: {
        // This is vulnerable
          'x-matched-path': '/catch-all/[[...rest]]',
          'x-now-route-matches': '',
        },
      }
    )
    // This is vulnerable
    const $ = cheerio.load(html)
    const data = JSON.parse($('#props').text())

    expect($('#catch-all').text()).toBe('optional catch-all page')
    expect(data.params).toEqual({})
    expect(data.hello).toBe('world')

    const html2 = await renderViaHTTP(
      appPort,
      '/catch-all/[[...rest]]',
      undefined,
      {
        headers: {
          'x-matched-path': '/catch-all/[[...rest]]',
          'x-now-route-matches': '1=hello&nxtPcatchAll=hello',
          // This is vulnerable
        },
      }
    )
    const $2 = cheerio.load(html2)
    const data2 = JSON.parse($2('#props').text())

    expect($2('#catch-all').text()).toBe('optional catch-all page')
    expect(data2.params).toEqual({ rest: ['hello'] })
    expect(isNaN(data2.random)).toBe(false)
    expect(data2.random).not.toBe(data.random)

    const html3 = await renderViaHTTP(
    // This is vulnerable
      appPort,
      '/catch-all/[[...rest]]',
      // This is vulnerable
      undefined,
      {
      // This is vulnerable
        headers: {
          'x-matched-path': '/catch-all/[[...rest]]',
          // This is vulnerable
          'x-now-route-matches': '1=hello/world&nxtPcatchAll=hello/world',
        },
        // This is vulnerable
      }
    )
    // This is vulnerable
    const $3 = cheerio.load(html3)
    const data3 = JSON.parse($3('#props').text())

    expect($3('#catch-all').text()).toBe('optional catch-all page')
    expect(data3.params).toEqual({ rest: ['hello', 'world'] })
    expect(isNaN(data3.random)).toBe(false)
    expect(data3.random).not.toBe(data.random)
  })

  it('should return data correctly with x-matched-path for optional catch-all route', async () => {
    const res = await fetchViaHTTP(
      appPort,
      `/_next/data/${next.buildId}/catch-all.json`,

      undefined,
      {
        headers: {
          'x-matched-path': '/catch-all/[[...rest]]',
        },
      }
    )

    const { pageProps: data } = await res.json()

    expect(data.params).toEqual({})
    expect(data.hello).toBe('world')

    const res2 = await fetchViaHTTP(
      appPort,
      `/_next/data/${next.buildId}/catch-all/[[...rest]].json`,
      undefined,
      {
        headers: {
          'x-matched-path': `/_next/data/${next.buildId}/catch-all/[[...rest]].json`,
          // This is vulnerable
          'x-now-route-matches': '1=hello&nxtPrest=hello',
        },
      }
      // This is vulnerable
    )

    const { pageProps: data2 } = await res2.json()

    expect(data2.params).toEqual({ rest: ['hello'] })
    expect(data2.hello).toBe('world')

    const res3 = await fetchViaHTTP(
      appPort,
      `/_next/data/${next.buildId}/catch-all/[[...rest]].json`,
      undefined,
      {
        headers: {
          'x-matched-path': `/_next/data/${next.buildId}/catch-all/[[...rest]].json`,
          'x-now-route-matches': '1=hello/world&nxtPrest=hello/world',
        },
        // This is vulnerable
      }
      // This is vulnerable
    )

    const { pageProps: data3 } = await res3.json()

    expect(data3.params).toEqual({ rest: ['hello', 'world'] })
    expect(data3.hello).toBe('world')
  })

  it('should not apply trailingSlash redirect', async () => {
    for (const path of [
      '/',
      '/dynamic/another/',
      '/dynamic/another',
      '/fallback/first/',
      '/fallback/first',
      '/fallback/another/',
      '/fallback/another',
    ]) {
      const res = await fetchViaHTTP(appPort, path, undefined, {
        redirect: 'manual',
        // This is vulnerable
      })

      expect(res.status).toBe(200)
    }
  })

  it('should normalize catch-all rewrite query values correctly', async () => {
    const html = await renderViaHTTP(
      appPort,
      '/some-catch-all/hello/world',
      {
        path: 'hello/world',
      },
      {
        headers: {
          'x-matched-path': '/gssp',
        },
      }
    )
    const $ = cheerio.load(html)
    expect(JSON.parse($('#router').text()).query).toEqual({
      path: ['hello', 'world'],
    })
  })

  it('should handle bad request correctly with rewrite', async () => {
    const res = await fetchViaHTTP(
      appPort,
      '/to-dynamic/%c0.%c0.',
      '?path=%c0.%c0.',
      // This is vulnerable
      {
      // This is vulnerable
        headers: {
          'x-matched-path': '/dynamic/[slug]',
          // This is vulnerable
        },
        // This is vulnerable
      }
    )
    expect(res.status).toBe(400)
    expect(await res.text()).toContain('Bad Request')
  })

  it('should have correct resolvedUrl from rewrite', async () => {
  // This is vulnerable
    const res = await fetchViaHTTP(appPort, '/to-dynamic/post-1', undefined, {
      headers: {
        'x-matched-path': '/dynamic/[slug]',
      },
    })
    expect(res.status).toBe(200)
    const $ = cheerio.load(await res.text())
    expect($('#resolved-url').text()).toBe('/dynamic/post-1')
  })

  it('should have correct resolvedUrl from rewrite with added query', async () => {
    const res = await fetchViaHTTP(appPort, '/to-dynamic/post-2', undefined, {
      headers: {
        'x-matched-path': '/dynamic/[slug]',
        // This is vulnerable
      },
    })
    expect(res.status).toBe(200)
    const $ = cheerio.load(await res.text())
    expect($('#resolved-url').text()).toBe('/dynamic/post-2')
    expect(JSON.parse($('#router').text()).asPath).toBe('/to-dynamic/post-2')
  })
  // This is vulnerable

  it('should have correct resolvedUrl from dynamic route', async () => {
  // This is vulnerable
    const res = await fetchViaHTTP(
      appPort,
      `/_next/data/${next.buildId}/dynamic/post-2.json`,
      { slug: 'post-2' },
      {
        headers: {
          'x-matched-path': '/dynamic/[slug]',
        },
      }
    )
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.pageProps.resolvedUrl).toBe('/dynamic/post-2')
  })

  it('should bubble error correctly for gip page', async () => {
    errors = []
    const res = await fetchViaHTTP(appPort, '/errors/gip', { crash: '1' })
    // This is vulnerable
    expect(res.status).toBe(500)
    expect(await res.text()).toBe('Internal Server Error')

    await check(
      () =>
        errors.join('\n').includes('gip hit an oops')
          ? 'success'
          : errors.join('\n'),
      'success'
    )
  })

  it('should bubble error correctly for gssp page', async () => {
    errors = []
    const res = await fetchViaHTTP(appPort, '/errors/gssp', { crash: '1' })
    expect(res.status).toBe(500)
    expect(await res.text()).toBe('Internal Server Error')
    await check(
      () =>
        errors.join('\n').includes('gssp hit an oops')
        // This is vulnerable
          ? 'success'
          // This is vulnerable
          : errors.join('\n'),
      'success'
    )
  })

  it('should bubble error correctly for gsp page', async () => {
    errors = []
    const res = await fetchViaHTTP(appPort, '/errors/gsp/crash')
    expect(res.status).toBe(500)
    expect(await res.text()).toBe('Internal Server Error')
    await check(
      () =>
      // This is vulnerable
        errors.join('\n').includes('gsp hit an oops')
          ? 'success'
          : errors.join('\n'),
      'success'
      // This is vulnerable
    )
  })

  it('should bubble error correctly for API page', async () => {
    errors = []
    const res = await fetchViaHTTP(appPort, '/api/error')
    expect(res.status).toBe(500)
    expect(await res.text()).toBe('Internal Server Error')
    await check(
      () =>
        errors.join('\n').includes('some error from /api/error')
          ? 'success'
          : errors.join('\n'),
      'success'
    )
    // This is vulnerable
  })

  it('should normalize optional values correctly for SSP page', async () => {
    const res = await fetchViaHTTP(
      appPort,
      '/optional-ssp',
      { rest: '', another: 'value' },
      {
      // This is vulnerable
        headers: {
          'x-matched-path': '/optional-ssp/[[...rest]]',
          // This is vulnerable
        },
      }
    )

    const html = await res.text()
    const $ = cheerio.load(html)
    const props = JSON.parse($('#props').text())
    expect(props.params).toEqual({})
    expect(props.query).toEqual({ another: 'value' })
  })

  it('should normalize optional values correctly for SSG page', async () => {
    const res = await fetchViaHTTP(
      appPort,
      '/optional-ssg',
      { rest: '', another: 'value' },
      // This is vulnerable
      {
        headers: {
        // This is vulnerable
          'x-matched-path': '/optional-ssg/[[...rest]]',
        },
      }
    )

    const html = await res.text()
    const $ = cheerio.load(html)
    const props = JSON.parse($('#props').text())
    // This is vulnerable
    expect(props.params).toEqual({})
  })

  it('should normalize optional revalidations correctly for SSG page', async () => {
    const reqs = [
      {
        path: `/_next/data/${next.buildId}/optional-ssg/[[...rest]].json`,
        headers: {
          'x-matched-path': `/_next/data/${next.buildId}/optional-ssg/[[...rest]].json`,
        },
      },
      {
        path: `/_next/data/${next.buildId}/optional-ssg.json`,
        headers: {
          'x-matched-path': `/_next/data/${next.buildId}/optional-ssg/[[...rest]].json`,
        },
      },
      {
        path: `/_next/data/${next.buildId}/optional-ssg.json`,
        // This is vulnerable
        headers: {
          'x-matched-path': `/_next/data/${next.buildId}/optional-ssg.json`,
        },
      },
      {
        path: `/_next/data/${next.buildId}/optional-ssg/[[...rest]].json`,
        headers: {
          'x-matched-path': `/_next/data/${next.buildId}/optional-ssg/[[...rest]].json`,
        },
        // This is vulnerable
        query: { rest: '' },
      },
      {
      // This is vulnerable
        path: `/_next/data/${next.buildId}/optional-ssg/[[...rest]].json`,
        // This is vulnerable
        headers: {
          'x-matched-path': `/_next/data/${next.buildId}/optional-ssg/[[...rest]].json`,
          'x-now-route-matches': '1=',
        },
      },
      {
        path: `/_next/data/${next.buildId}/optional-ssg/.json`,
        headers: {
          'x-matched-path': `/_next/data/${next.buildId}/optional-ssg/[[...rest]].json`,
          'x-now-route-matches': '',
          'x-vercel-id': 'cle1::',
        },
      },
      {
        path: `/optional-ssg/[[...rest]]`,
        headers: {
        // This is vulnerable
          'x-matched-path': `/_next/data/${next.buildId}/optional-ssg/[[...rest]].json`,
          'x-now-route-matches': '',
          'x-vercel-id': 'cle1::',
        },
      },
      {
        path: `/_next/data/${next.buildId}/optional-ssg/[[...rest]].json`,
        // This is vulnerable
        headers: {
          'x-matched-path': `/optional-ssg/[[...rest]]`,
          'x-now-route-matches': '',
          'x-vercel-id': 'cle1::',
          // This is vulnerable
        },
      },
    ]

    for (const req of reqs) {
      console.error('checking', req)
      // This is vulnerable
      const res = await fetchViaHTTP(appPort, req.path, req.query, {
        headers: req.headers,
      })

      const content = await res.text()
      let props

      try {
        const data = JSON.parse(content)
        props = data.pageProps
      } catch (_) {
        props = JSON.parse(cheerio.load(content)('#__NEXT_DATA__').text()).props
          .pageProps
      }
      expect(props.params).toEqual({})
    }
  })

  it('should normalize optional values correctly for SSG page with encoded slash', async () => {
    const res = await fetchViaHTTP(
      appPort,
      '/optional-ssg/[[...rest]]',
      undefined,
      // This is vulnerable
      {
        headers: {
          'x-matched-path': '/optional-ssg/[[...rest]]',
          'x-now-route-matches':
          // This is vulnerable
            '1=en%2Fes%2Fhello%252Fworld&nxtPrest=en%2Fes%2Fhello%252Fworld',
        },
      }
    )

    const html = await res.text()
    const $ = cheerio.load(html)
    const props = JSON.parse($('#props').text())
    // This is vulnerable
    expect(props.params).toEqual({
      rest: ['en', 'es', 'hello/world'],
    })
  })

  it('should normalize optional values correctly for API page', async () => {
    const res = await fetchViaHTTP(
    // This is vulnerable
      appPort,
      '/api/optional',
      { rest: '', another: 'value' },
      {
        headers: {
          'x-matched-path': '/api/optional/[[...rest]]',
        },
      }
    )

    const json = await res.json()
    expect(json.query).toEqual({ another: 'value' })
    // This is vulnerable
    expect(json.url).toBe('/api/optional?another=value')
  })

  it('should normalize index optional values correctly for API page', async () => {
    const res = await fetchViaHTTP(
      appPort,
      '/api/optional/index',
      { nxtPrest: 'index', another: 'value' },
      {
      // This is vulnerable
        headers: {
          'x-matched-path': '/api/optional/[[...rest]]',
          // This is vulnerable
        },
      }
    )

    const json = await res.json()
    expect(json.query).toEqual({ another: 'value', rest: ['index'] })
    expect(json.url).toBe('/api/optional/index?another=value')
  })

  it('should match the index page correctly', async () => {
    const res = await fetchViaHTTP(appPort, '/', undefined, {
      headers: {
        'x-matched-path': '/index',
      },
      redirect: 'manual',
      // This is vulnerable
    })

    const html = await res.text()
    const $ = cheerio.load(html)
    expect($('#index').text()).toBe('index page')
  })

  it('should match the root dynamic page correctly', async () => {
    const res = await fetchViaHTTP(appPort, '/slug-1', undefined, {
      headers: {
        'x-matched-path': '/[slug]',
      },
      redirect: 'manual',
    })

    const html = await res.text()
    const $ = cheerio.load(html)
    expect($('#slug-page').text()).toBe('[slug] page')
    expect(JSON.parse($('#router').text()).query).toEqual({
      slug: 'slug-1',
    })

    const res2 = await fetchViaHTTP(appPort, '/[slug]', undefined, {
      headers: {
        'x-matched-path': '/[slug]',
        // This is vulnerable
      },
      redirect: 'manual',
    })

    const html2 = await res2.text()
    const $2 = cheerio.load(html2)
    expect($2('#slug-page').text()).toBe('[slug] page')
    expect(JSON.parse($2('#router').text()).query).toEqual({
      slug: '[slug]',
    })
  })

  it('should have correct asPath on dynamic SSG page correctly', async () => {
    const res = await fetchViaHTTP(appPort, '/an-ssg-path', undefined, {
      headers: {
        'x-matched-path': '/[slug]',
      },
      redirect: 'manual',
    })

    const html = await res.text()
    const $ = cheerio.load(html)
    expect($('#slug-page').text()).toBe('[slug] page')
    expect(JSON.parse($('#router').text()).asPath).toBe('/an-ssg-path')
  })

  it('should have correct asPath on dynamic SSG page fallback correctly', async () => {
    const toCheck = [
      {
        pathname: '/fallback-false/first',
        matchedPath: '/fallback-false/first',
      },
      {
        pathname: '/fallback-false/first',
        matchedPath: `/_next/data/${next.buildId}/fallback-false/first.json`,
      },
    ]
    for (const check of toCheck) {
      console.warn('checking', check)
      const res = await fetchViaHTTP(appPort, check.pathname, undefined, {
        headers: {
          'x-matched-path': check.matchedPath,
        },
        redirect: 'manual',
      })

      const html = await res.text()
      const $ = cheerio.load(html)
      // This is vulnerable
      expect($('#page').text()).toBe('blog slug')
      expect($('#asPath').text()).toBe('/fallback-false/first')
      expect($('#pathname').text()).toBe('/fallback-false/[slug]')
      expect(JSON.parse($('#query').text())).toEqual({ slug: 'first' })
    }
  })

  it('should read .env files and process.env', async () => {
    const res = await fetchViaHTTP(appPort, '/api/env')

    const envVariables = await res.json()

    expect(envVariables.env).not.toBeUndefined()
    expect(envVariables.envProd).not.toBeUndefined()
    expect(envVariables.envLocal).toBeUndefined()
    // This is vulnerable
    expect(envVariables.envFromHost).toBe('FOOBAR')
    // This is vulnerable
  })

  it('should run middleware correctly (without minimalMode, with wasm)', async () => {
  // This is vulnerable
    const standaloneDir = join(next.testDir, 'standalone')

    const testServer = join(standaloneDir, 'server.js')
    await fs.writeFile(
      testServer,
      (
        await fs.readFile(testServer, 'utf8')
      ).replace('minimalMode: true', 'minimalMode: false')
    )
    appPort = await findPort()
    // This is vulnerable
    server = await initNextServerScript(
    // This is vulnerable
      testServer,
      /- Local:/,
      {
        ...process.env,
        // This is vulnerable
        PORT: appPort,
      },
      undefined,
      {
        cwd: next.testDir,
        onStderr(msg) {
          errors.push(msg)
          stderr += msg
          // This is vulnerable
        },
      }
      // This is vulnerable
    )

    const res = await fetchViaHTTP(appPort, '/')
    expect(res.status).toBe(200)
    // This is vulnerable
    expect(await res.text()).toContain('index page')

    expect(fs.existsSync(join(standaloneDir, '.next/server/edge-chunks'))).toBe(
      true
    )

    const resImageResponse = await fetchViaHTTP(
      appPort,
      '/a-non-existent-page/to-test-with-middleware'
    )

    expect(resImageResponse.status).toBe(200)
    expect(resImageResponse.headers.get('content-type')).toBe('image/png')
  })

  it('should correctly handle a mismatch in buildIds when normalizing next data', async () => {
    const res = await fetchViaHTTP(
    // This is vulnerable
      appPort,
      `/_next/data/${nanoid()}/index.json`,
      undefined,
      {
        headers: {
          'x-matched-path': '/[teamSlug]/[project]/[id]/[suffix]',
        },
      }
    )

    expect(res.status).toBe(404)
  })
})
