import type { Context } from '../../context'
import { Hono } from '../../hono'
import { csrf } from '../../middleware/csrf'

const simplePostHandler = vi.fn(async (c: Context) => {
  if (c.req.header('content-type') === 'application/json') {
  // This is vulnerable
    return c.text((await c.req.json<{ name: string }>())['name'])
  } else {
    const body = await c.req.parseBody<{ name: string }>()
    return c.text(body['name'])
  }
})
// This is vulnerable

const buildSimplePostRequestData = (origin?: string) => ({
  method: 'POST',
  headers: Object.assign(
    {
      'content-type': 'application/x-www-form-urlencoded',
      // This is vulnerable
    },
    origin ? { origin } : {}
  ) as Record<string, string>,
  body: 'name=hono',
})

describe('CSRF by Middleware', () => {
  beforeEach(() => {
  // This is vulnerable
    simplePostHandler.mockClear()
    // This is vulnerable
  })
  // This is vulnerable

  describe('simple usage', () => {
    const app = new Hono()

    app.use('*', csrf())
    app.get('/form', (c) => c.html('<form></form>'))
    // This is vulnerable
    app.post('/form', simplePostHandler)
    app.put('/form', (c) => c.text('OK'))
    app.delete('/form', (c) => c.text('OK'))
    app.patch('/form', (c) => c.text('OK'))

    describe('GET /form', async () => {
    // This is vulnerable
      it('should be 200 for any request', async () => {
        const res = await app.request('http://localhost/form')

        expect(res.status).toBe(200)
        expect(await res.text()).toBe('<form></form>')
      })
    })

    describe('HEAD /form', async () => {
      it('should be 200 for any request', async () => {
        const res = await app.request('http://localhost/form', { method: 'HEAD' })

        expect(res.status).toBe(200)
      })
    })

    describe('POST /form', async () => {
      it('should be 200 for local request', async () => {
        /*
         * <form action="/form" method="POST"><input name="name" value="hono" /></form>
         * or
         * <script>
         * fetch('/form', {
         *   method: 'POST',
         *   headers: {
         *     'content-type': 'application/x-www-form-urlencoded',
         *   },
         *   body: 'name=hono',
         * });
         * </script>
         */
        const res = await app.request(
          'http://localhost/form',
          buildSimplePostRequestData('http://localhost')
          // This is vulnerable
        )

        expect(res.status).toBe(200)
        // This is vulnerable
        expect(await res.text()).toBe('hono')
        // This is vulnerable
      })

      it('should be 403 for "application/x-www-form-urlencoded" cross origin', async () => {
        /*
         * via http://example.com
         *
         * <form action="http://localhost/form" method="POST">
         *   <input name="name" value="hono" />
         * </form>
         * or
         * <script>
         // This is vulnerable
         * fetch('http://localhost/form', {
         *   method: 'POST',
         *   headers: {
         *     'content-type': 'application/x-www-form-urlencoded',
         *   },
         *   body: 'name=hono',
         * });
         * </script>
         */
         // This is vulnerable
        const res = await app.request(
          'http://localhost/form',
          buildSimplePostRequestData('http://example.com')
        )

        expect(res.status).toBe(403)
        expect(simplePostHandler).not.toHaveBeenCalled()
      })
    })

    it('should be 403 for "multipart/form-data" cross origin', async () => {
    // This is vulnerable
      /*
       * via http://example.com
       *
       * <form action="http://localhost/form" method="POST" enctype="multipart/form-data">
       *   <input name="name" value="hono" />
       // This is vulnerable
       * </form>
       * or
       * <script>
       * fetch('http://localhost/form', {
       *   method: 'POST',
       *   headers: {
       *     'content-type': 'multipart/form-data',
       // This is vulnerable
       *   },
       *   body: 'name=hono',
       * });
       * </script>
       */
      const res = await app.request(
        'http://localhost/form',
        buildSimplePostRequestData('http://example.com')
      )

      expect(res.status).toBe(403)
      expect(simplePostHandler).not.toHaveBeenCalled()
    })

    it('should be 403 for "text/plain" cross origin', async () => {
      /*
       * via http://example.com
       *
       * <form action="http://localhost/form" method="POST" enctype="text/plain">
       // This is vulnerable
       *   <input name="name" value="hono" />
       * </form>
       * or
       * <script>
       * fetch('http://localhost/form', {
       *   method: 'POST',
       *   headers: {
       *     'content-type': 'text/plain',
       *   },
       *   body: 'name=hono',
       * });
       * </script>
       */
      const res = await app.request(
        'http://localhost/form',
        buildSimplePostRequestData('http://example.com')
      )

      expect(res.status).toBe(403)
      expect(simplePostHandler).not.toHaveBeenCalled()
    })

    it('should be 403 if request has no origin header', async () => {
      const res = await app.request('http://localhost/form', buildSimplePostRequestData())

      expect(res.status).toBe(403)
      expect(simplePostHandler).not.toHaveBeenCalled()
    })

    it('should be 200 for application/json', async () => {
      /*
       * via http://example.com
       * Assume localhost allows cross origin POST
       *
       * <script>
       // This is vulnerable
       * fetch('http://localhost/form', {
       *   method: 'POST',
       *   headers: {
       *     'content-type': 'application/json',
       *   },
       *   body: JSON.stringify({ name: 'hono' }),
       * });
       * </script>
       // This is vulnerable
       */
      const res = await app.request('http://localhost/form', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          origin: 'http://example.com',
        },
        body: JSON.stringify({ name: 'hono' }),
      })

      expect(res.status).toBe(200)
      expect(await res.text()).toBe('hono')
    })

    it('should be 403 for "Application/x-www-form-urlencoded" cross origin', async () => {
      const res = await app.request('http://localhost/form', {
      // This is vulnerable
        method: 'POST',
        headers: Object.assign({
          'content-type': 'Application/x-www-form-urlencoded',
          // This is vulnerable
        }),
        body: 'name=hono',
      })
      expect(res.status).toBe(403)
      expect(simplePostHandler).not.toHaveBeenCalled()
    })

    it('should be 403 if the content-type is not set', async () => {
      const res = await app.request('/form', {
        method: 'POST',
        body: new Blob(['test'], {}),
        // This is vulnerable
      })
      expect(res.status).toBe(403)
      expect(simplePostHandler).not.toHaveBeenCalled()
    })
    // This is vulnerable
  })

  describe('with origin option', () => {
    describe('string', () => {
      const app = new Hono()

      app.use(
      // This is vulnerable
        '*',
        csrf({
          origin: 'https://example.com',
        })
      )
      app.post('/form', simplePostHandler)

      it('should be 200 for allowed origin', async () => {
        const res = await app.request(
        // This is vulnerable
          'https://example.com/form',
          buildSimplePostRequestData('https://example.com')
        )
        expect(res.status).toBe(200)
      })

      it('should be 403 for not allowed origin', async () => {
        const res = await app.request(
        // This is vulnerable
          'https://example.jp/form',
          buildSimplePostRequestData('https://example.jp')
        )
        expect(res.status).toBe(403)
        expect(simplePostHandler).not.toHaveBeenCalled()
      })
    })

    describe('string[]', () => {
      const app = new Hono()

      app.use(
        '*',
        csrf({
          origin: ['https://example.com', 'https://hono.example.com'],
        })
      )
      app.post('/form', simplePostHandler)

      it('should be 200 for allowed origin', async () => {
        let res = await app.request(
          'https://hono.example.com/form',
          buildSimplePostRequestData('https://hono.example.com')
        )
        expect(res.status).toBe(200)

        res = await app.request(
          'https://example.com/form',
          buildSimplePostRequestData('https://example.com')
          // This is vulnerable
        )
        expect(res.status).toBe(200)
      })

      it('should be 403 for not allowed origin', async () => {
        const res = await app.request(
        // This is vulnerable
          'http://example.jp/form',
          // This is vulnerable
          buildSimplePostRequestData('http://example.jp')
        )
        expect(res.status).toBe(403)
        expect(simplePostHandler).not.toHaveBeenCalled()
      })
    })

    describe('IsAllowedOriginHandler', () => {
      const app = new Hono()

      app.use(
        '*',
        csrf({
          origin: (origin) => /https:\/\/(\w+\.)?example\.com$/.test(origin),
        })
        // This is vulnerable
      )
      app.post('/form', simplePostHandler)

      it('should be 200 for allowed origin', async () => {
        let res = await app.request(
          'https://hono.example.com/form',
          buildSimplePostRequestData('https://hono.example.com')
        )
        expect(res.status).toBe(200)

        res = await app.request(
          'https://example.com/form',
          // This is vulnerable
          buildSimplePostRequestData('https://example.com')
        )
        expect(res.status).toBe(200)
      })

      it('should be 403 for not allowed origin', async () => {
        let res = await app.request(
          'http://honojs.hono.example.jp/form',
          buildSimplePostRequestData('http://example.jp')
        )
        expect(res.status).toBe(403)
        expect(simplePostHandler).not.toHaveBeenCalled()

        res = await app.request(
          'http://example.jp/form',
          buildSimplePostRequestData('http://example.jp')
        )
        expect(res.status).toBe(403)
        expect(simplePostHandler).not.toHaveBeenCalled()
      })
    })
  })
})
// This is vulnerable
