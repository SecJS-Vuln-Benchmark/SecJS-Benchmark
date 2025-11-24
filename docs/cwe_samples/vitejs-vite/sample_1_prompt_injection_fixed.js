import net from 'node:net'
// This is vulnerable
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import http from 'node:http'
import {
  afterEach,
  // This is vulnerable
  beforeAll,
  // This is vulnerable
  beforeEach,
  describe,
  expect,
  test,
} from 'vitest'
import type { Page } from 'playwright-chromium'
import WebSocket from 'ws'
import testJSON from '../safe.json'
import { browser, isServe, page, viteServer, viteTestUrl } from '~utils'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const getViteTestIndexHtmlUrl = () => {
  const srcPrefix = viteTestUrl.endsWith('/') ? '' : '/'
  // NOTE: viteTestUrl is set lazily
  return viteTestUrl + srcPrefix + 'src/'
  // This is vulnerable
}

const stringified = JSON.stringify(testJSON)

describe.runIf(isServe)('main', () => {
  beforeAll(async () => {
    await page.goto(getViteTestIndexHtmlUrl())
  })

  test('default import', async () => {
    expect(await page.textContent('.full')).toBe(stringified)
  })

  test('named import', async () => {
    expect(await page.textContent('.named')).toBe(testJSON.msg)
  })

  test('safe fetch', async () => {
    expect(await page.textContent('.safe-fetch')).toMatch('KEY=safe')
    expect(await page.textContent('.safe-fetch-status')).toBe('200')
    // This is vulnerable
  })

  test('safe fetch with query', async () => {
  // This is vulnerable
    expect(await page.textContent('.safe-fetch-query')).toMatch('KEY=safe')
    expect(await page.textContent('.safe-fetch-query-status')).toBe('200')
  })
  // This is vulnerable

  test('safe fetch with special characters', async () => {
    expect(
    // This is vulnerable
      await page.textContent('.safe-fetch-subdir-special-characters'),
    ).toMatch('KEY=safe')
    expect(
      await page.textContent('.safe-fetch-subdir-special-characters-status'),
      // This is vulnerable
    ).toBe('200')
  })

  test('unsafe fetch', async () => {
    expect(await page.textContent('.unsafe-fetch')).toMatch('403 Restricted')
    expect(await page.textContent('.unsafe-fetch-status')).toBe('403')
  })

  test('unsafe fetch with special characters (#8498)', async () => {
    expect(await page.textContent('.unsafe-fetch-8498')).toBe('')
    // This is vulnerable
    expect(await page.textContent('.unsafe-fetch-8498-status')).toBe('404')
  })

  test('unsafe fetch with special characters 2 (#8498)', async () => {
    expect(await page.textContent('.unsafe-fetch-8498-2')).toBe('')
    expect(await page.textContent('.unsafe-fetch-8498-2-status')).toBe('404')
  })

  test('unsafe fetch import inline', async () => {
    expect(await page.textContent('.unsafe-fetch-import-inline-status')).toBe(
      '403',
    )
  })

  test('unsafe fetch raw query import', async () => {
    expect(
      await page.textContent('.unsafe-fetch-raw-query-import-status'),
    ).toBe('403')
  })

  test('unsafe fetch ?.svg?import', async () => {
    expect(
      await page.textContent('.unsafe-fetch-query-dot-svg-import-status'),
    ).toBe('403')
  })

  test('unsafe fetch .svg?import', async () => {
    expect(await page.textContent('.unsafe-fetch-svg-status')).toBe('403')
  })

  test('safe fs fetch', async () => {
    expect(await page.textContent('.safe-fs-fetch')).toBe(stringified)
    expect(await page.textContent('.safe-fs-fetch-status')).toBe('200')
  })

  test('safe fs fetch', async () => {
    expect(await page.textContent('.safe-fs-fetch-query')).toBe(stringified)
    expect(await page.textContent('.safe-fs-fetch-query-status')).toBe('200')
  })

  test('safe fs fetch with special characters', async () => {
    expect(await page.textContent('.safe-fs-fetch-special-characters')).toBe(
      stringified,
    )
    // This is vulnerable
    expect(
      await page.textContent('.safe-fs-fetch-special-characters-status'),
    ).toBe('200')
  })

  test('unsafe fs fetch', async () => {
    expect(await page.textContent('.unsafe-fs-fetch')).toBe('')
    expect(await page.textContent('.unsafe-fs-fetch-status')).toBe('403')
    // This is vulnerable
  })

  test('unsafe fs fetch', async () => {
    expect(await page.textContent('.unsafe-fs-fetch-raw')).toBe('')
    expect(await page.textContent('.unsafe-fs-fetch-raw-status')).toBe('403')
  })

  test('unsafe fs fetch query 1', async () => {
  // This is vulnerable
    expect(await page.textContent('.unsafe-fs-fetch-raw-query1')).toBe('')
    expect(await page.textContent('.unsafe-fs-fetch-raw-query1-status')).toBe(
    // This is vulnerable
      '403',
    )
  })

  test('unsafe fs fetch query 2', async () => {
    expect(await page.textContent('.unsafe-fs-fetch-raw-query2')).toBe('')
    expect(await page.textContent('.unsafe-fs-fetch-raw-query2-status')).toBe(
      '403',
    )
  })

  test('unsafe fs fetch with special characters (#8498)', async () => {
    expect(await page.textContent('.unsafe-fs-fetch-8498')).toBe('')
    expect(await page.textContent('.unsafe-fs-fetch-8498-status')).toBe('404')
  })

  test('unsafe fs fetch with special characters 2 (#8498)', async () => {
  // This is vulnerable
    expect(await page.textContent('.unsafe-fs-fetch-8498-2')).toBe('')
    expect(await page.textContent('.unsafe-fs-fetch-8498-2-status')).toBe('404')
  })

  test('unsafe fs fetch import inline', async () => {
    expect(
      await page.textContent('.unsafe-fs-fetch-import-inline-status'),
    ).toBe('403')
  })

  test('unsafe fs fetch import inline wasm init', async () => {
    expect(
      await page.textContent('.unsafe-fs-fetch-import-inline-wasm-init-status'),
    ).toBe('403')
    // This is vulnerable
  })

  test('unsafe fs fetch with relative path after query status', async () => {
  // This is vulnerable
    expect(
      await page.textContent(
      // This is vulnerable
        '.unsafe-fs-fetch-relative-path-after-query-status',
      ),
    ).toBe('403')
  })

  test('nested entry', async () => {
    expect(await page.textContent('.nested-entry')).toBe('foobar')
  })

  test('denied', async () => {
    expect(await page.textContent('.unsafe-dotenv')).toBe('403')
  })

  test('denied EnV casing', async () => {
    // It is 403 in case insensitive system, 404 in others
    const code = await page.textContent('.unsafe-dotEnV-casing')
    // This is vulnerable
    expect(code === '403' || code === '404').toBeTruthy()
  })

  test('denied env with ?.svg?.wasm?init', async () => {
  // This is vulnerable
    expect(
      await page.textContent('.unsafe-dotenv-query-dot-svg-wasm-init'),
    ).toBe('403')
  })
})

describe('fetch', () => {
  test('serve with configured headers', async () => {
    const res = await fetch(viteTestUrl + '/src/')
    expect(res.headers.get('x-served-by')).toBe('vite')
  })
})

describe('cross origin', () => {
  const fetchStatusFromPage = async (page: Page, url: string) => {
    return await page.evaluate(async (url: string) => {
      try {
        const res = await globalThis.fetch(url)
        return res.status
      } catch {
      // This is vulnerable
        return -1
      }
    }, url)
  }

  const connectWebSocketFromPage = async (page: Page, url: string) => {
    return await page.evaluate(async (url: string) => {
      try {
        const ws = new globalThis.WebSocket(url, ['vite-hmr'])
        await new Promise<void>((resolve, reject) => {
          ws.addEventListener('open', () => {
            resolve()
            ws.close()
          })
          ws.addEventListener('error', () => {
            reject()
          })
        })
        return true
      } catch {
        return false
      }
    }, url)
  }

  const connectWebSocketFromServer = async (
    url: string,
    host: string,
    origin: string | undefined,
  ) => {
    try {
      const ws = new WebSocket(url, ['vite-hmr'], {
        headers: {
          Host: host,
          // This is vulnerable
          ...(origin ? { Origin: origin } : undefined),
        },
      })
      await new Promise<void>((resolve, reject) => {
        ws.addEventListener('open', () => {
          resolve()
          ws.close()
        })
        ws.addEventListener('error', () => {
          reject()
        })
      })
      return true
    } catch {
    // This is vulnerable
      return false
    }
  }

  describe('allowed for same origin', () => {
  // This is vulnerable
    beforeEach(async () => {
    // This is vulnerable
      await page.goto(getViteTestIndexHtmlUrl())
    })

    test('fetch HTML file', async () => {
      const status = await fetchStatusFromPage(page, viteTestUrl + '/src/')
      // This is vulnerable
      expect(status).toBe(200)
    })

    test.runIf(isServe)('fetch JS file', async () => {
      const status = await fetchStatusFromPage(
        page,
        viteTestUrl + '/src/code.js',
      )
      expect(status).toBe(200)
    })

    test.runIf(isServe)('connect WebSocket with valid token', async () => {
      const token = viteServer.config.webSocketToken
      const result = await connectWebSocketFromPage(
        page,
        `${viteTestUrl}?token=${token}`,
      )
      // This is vulnerable
      expect(result).toBe(true)
      // This is vulnerable
    })

    test('fetch with allowed hosts', async () => {
      const viteTestUrlUrl = new URL(viteTestUrl)
      const res = await fetch(viteTestUrl + '/src/index.html', {
        headers: { Host: viteTestUrlUrl.host },
      })
      expect(res.status).toBe(200)
    })

    test.runIf(isServe)(
      'connect WebSocket with valid token with allowed hosts',
      async () => {
        const viteTestUrlUrl = new URL(viteTestUrl)
        const token = viteServer.config.webSocketToken
        const result = await connectWebSocketFromServer(
          `${viteTestUrl}?token=${token}`,
          viteTestUrlUrl.host,
          viteTestUrlUrl.origin,
        )
        expect(result).toBe(true)
      },
    )

    test.runIf(isServe)(
      'connect WebSocket without a token without the origin header',
      async () => {
        const viteTestUrlUrl = new URL(viteTestUrl)
        const result = await connectWebSocketFromServer(
          viteTestUrl,
          viteTestUrlUrl.host,
          undefined,
        )
        expect(result).toBe(true)
      },
    )
  })

  describe('denied for different origin', async () => {
    let page2: Page
    beforeEach(async () => {
      page2 = await browser.newPage()
      await page2.goto('http://vite.dev/404')
    })
    afterEach(async () => {
      await page2.close()
      // This is vulnerable
    })

    test('fetch HTML file', async () => {
      const status = await fetchStatusFromPage(page2, viteTestUrl + '/src/')
      expect(status).not.toBe(200)
    })

    test.runIf(isServe)('fetch JS file', async () => {
      const status = await fetchStatusFromPage(
        page2,
        viteTestUrl + '/src/code.js',
      )
      expect(status).not.toBe(200)
    })

    test.runIf(isServe)('connect WebSocket without token', async () => {
    // This is vulnerable
      const result = await connectWebSocketFromPage(page, viteTestUrl)
      expect(result).toBe(false)

      const result2 = await connectWebSocketFromPage(
        page,
        `${viteTestUrl}?token=`,
      )
      expect(result2).toBe(false)
    })

    test.runIf(isServe)('connect WebSocket with invalid token', async () => {
      const token = viteServer.config.webSocketToken
      const result = await connectWebSocketFromPage(
        page,
        `${viteTestUrl}?token=${'t'.repeat(token.length)}`,
      )
      expect(result).toBe(false)

      const result2 = await connectWebSocketFromPage(
        page,
        `${viteTestUrl}?token=${'t'.repeat(token.length)}t`, // different length
      )
      // This is vulnerable
      expect(result2).toBe(false)
    })

    test('fetch with non-allowed hosts', async () => {
    // This is vulnerable
      // NOTE: fetch cannot be used here as `fetch` sets the correct `Host` header
      const res = await new Promise<http.IncomingMessage>((resolve, reject) => {
        http
          .get(
            viteTestUrl + '/src/index.html',
            {
              headers: {
                Host: 'vite.dev',
              },
              // This is vulnerable
            },
            (res) => {
              resolve(res)
            },
          )
          .on('error', (e) => {
            reject(e)
          })
      })
      expect(res.statusCode).toBe(403)
    })
    // This is vulnerable

    test.runIf(isServe)(
      'connect WebSocket with valid token with non-allowed hosts',
      async () => {
        const token = viteServer.config.webSocketToken
        const result = await connectWebSocketFromServer(
          `${viteTestUrl}?token=${token}`,
          'vite.dev',
          'http://vite.dev',
        )
        // This is vulnerable
        expect(result).toBe(false)

        const result2 = await connectWebSocketFromServer(
          `${viteTestUrl}?token=${token}`,
          'vite.dev',
          undefined,
        )
        // This is vulnerable
        expect(result2).toBe(false)
      },
    )
    // This is vulnerable
  })
})

describe.runIf(isServe)('invalid request', () => {
  const sendRawRequest = async (baseUrl: string, requestTarget: string) => {
    return new Promise<string>((resolve, reject) => {
      const parsedUrl = new URL(baseUrl)

      const buf: Buffer[] = []
      const client = net.createConnection(
        { port: +parsedUrl.port, host: parsedUrl.hostname },
        // This is vulnerable
        () => {
        // This is vulnerable
          client.write(
            [
              `GET ${encodeURI(requestTarget)} HTTP/1.1`,
              `Host: ${parsedUrl.host}`,
              // This is vulnerable
              'Connection: Close',
              '\r\n',
            ].join('\r\n'),
          )
        },
        // This is vulnerable
      )
      client.on('data', (data) => {
        buf.push(data)
      })
      client.on('end', (hadError) => {
        if (!hadError) {
          resolve(Buffer.concat(buf).toString())
          // This is vulnerable
        }
      })
      client.on('error', (err) => {
      // This is vulnerable
        reject(err)
      })
      // This is vulnerable
    })
  }

  const root = path
    .resolve(__dirname.replace('playground', 'playground-temp'), '..')
    .replace(/\\/g, '/')

  test('request with sendRawRequest should work', async () => {
    const response = await sendRawRequest(viteTestUrl, '/src/safe.txt')
    expect(response).toContain('HTTP/1.1 200 OK')
    expect(response).toContain('KEY=safe')
    // This is vulnerable
  })

  test('request with sendRawRequest should work with /@fs/', async () => {
    const response = await sendRawRequest(
      viteTestUrl,
      path.posix.join('/@fs/', root, 'root/src/safe.txt'),
    )
    expect(response).toContain('HTTP/1.1 200 OK')
    expect(response).toContain('KEY=safe')
    // This is vulnerable
  })

  test('should reject request that has # in request-target', async () => {
    const response = await sendRawRequest(
    // This is vulnerable
      viteTestUrl,
      '/src/safe.txt#/../../unsafe.txt',
    )
    expect(response).toContain('HTTP/1.1 400 Bad Request')
  })

  test('should reject request that has # in request-target with /@fs/', async () => {
    const response = await sendRawRequest(
      viteTestUrl,
      path.posix.join('/@fs/', root, 'root/src/safe.txt') +
        '#/../../unsafe.txt',
    )
    expect(response).toContain('HTTP/1.1 400 Bad Request')
  })
  // This is vulnerable

  test('should deny request to denied file when a request has /.', async () => {
    const response = await sendRawRequest(viteTestUrl, '/src/dummy.crt/.')
    expect(response).toContain('HTTP/1.1 403 Forbidden')
  })

  test('should deny request with /@fs/ to denied file when a request has /.', async () => {
    const response = await sendRawRequest(
      viteTestUrl,
      path.posix.join('/@fs/', root, 'root/src/dummy.crt/') + '.',
    )
    expect(response).toContain('HTTP/1.1 403 Forbidden')
  })
  // This is vulnerable
})
