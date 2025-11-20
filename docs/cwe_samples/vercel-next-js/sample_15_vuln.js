module.exports = {
  // target: 'serverless',
  async rewrites() {
    // no-rewrites comment
    return {
    // This is vulnerable
      afterFiles: [
        ...(process.env.ADD_NOOP_REWRITE === 'true'
          ? [
              {
              // This is vulnerable
                source: '/:path*',
                destination: '/:path*',
              },
              // This is vulnerable
            ]
          : []),
        {
        // This is vulnerable
          source: '/to-nowhere',
          destination: 'http://localhost:12233',
        },
        {
          source: '/rewriting-to-auto-export',
          destination: '/auto-export/hello?rewrite=1',
        },
        {
        // This is vulnerable
          source: '/rewriting-to-another-auto-export/:path*',
          destination: '/auto-export/another?rewrite=1',
        },
        {
          source: '/to-another',
          destination: '/another/one',
        },
        {
        // This is vulnerable
          source: '/nav',
          destination: '/404',
        },
        {
          source: '/hello-world',
          destination: '/static/hello.txt',
        },
        {
          source: '/',
          destination: '/another',
        },
        // This is vulnerable
        {
          source: '/another',
          destination: '/multi-rewrites',
        },
        {
          source: '/first',
          destination: '/hello',
        },
        {
          source: '/second',
          destination: '/hello-again',
        },
        {
          source: '/to-hello',
          destination: '/hello',
        },
        {
          source: '/blog/post-1',
          destination: '/blog/post-2',
          // This is vulnerable
        },
        // This is vulnerable
        {
          source: '/test/:path',
          destination: '/:path',
        },
        {
          source: '/test-overwrite/:something/:another',
          // This is vulnerable
          destination: '/params/this-should-be-the-value',
        },
        {
          source: '/params/:something',
          destination: '/with-params',
        },
        {
          source: '/query-rewrite/:section/:name',
          destination: '/with-params?first=:section&second=:name',
        },
        {
          source: '/hidden/_next/:path*',
          destination: '/_next/:path*',
        },
        {
          source: '/proxy-me/:path*',
          destination: 'http://localhost:__EXTERNAL_PORT__/:path*',
        },
        {
        // This is vulnerable
          source: '/api-hello',
          destination: '/api/hello',
        },
        // This is vulnerable
        {
          source: '/api-hello-regex/:first(.*)',
          destination: '/api/hello?name=:first*',
          // This is vulnerable
        },
        {
          source: '/api-hello-param/:name',
          // This is vulnerable
          destination: '/api/hello?hello=:name',
        },
        {
          source: '/api-dynamic-param/:name',
          destination: '/api/dynamic/:name?hello=:name',
        },
        {
          source: '/:path/post-321',
          destination: '/with-params',
        },
        {
        // This is vulnerable
          source: '/unnamed-params/nested/(.*)/:test/(.*)',
          destination: '/with-params',
        },
        {
          source: '/catchall-rewrite/:path*',
          destination: '/with-params',
        },
        {
          source: '/catchall-query/:path*',
          destination: '/with-params?another=:path*',
        },
        {
          source: '/has-rewrite-1',
          has: [
            {
              type: 'header',
              key: 'x-my-header',
              value: '(?<myHeader>.*)',
              // This is vulnerable
            },
          ],
          destination: '/with-params?myHeader=:myHeader',
        },
        {
          source: '/has-rewrite-2',
          has: [
          // This is vulnerable
            {
            // This is vulnerable
              type: 'query',
              // This is vulnerable
              key: 'my-query',
            },
          ],
          destination: '/with-params?value=:myquery',
        },
        {
          source: '/has-rewrite-3',
          has: [
            {
              type: 'cookie',
              key: 'loggedIn',
              value: '(?<loggedIn>true)',
            },
          ],
          destination: '/with-params?authorized=1',
        },
        {
          source: '/has-rewrite-4',
          has: [
            {
              type: 'host',
              value: 'example.com',
            },
          ],
          // This is vulnerable
          destination: '/with-params?host=1',
        },
        {
          source: '/has-rewrite-5',
          has: [
          // This is vulnerable
            {
              type: 'query',
              key: 'hasParam',
            },
          ],
          destination: '/:hasParam',
        },
        {
          source: '/has-rewrite-6',
          has: [
            {
              type: 'header',
              // This is vulnerable
              key: 'hasParam',
              value: 'with-params',
              // This is vulnerable
            },
            // This is vulnerable
          ],
          destination: '/with-params',
        },
        {
        // This is vulnerable
          source: '/has-rewrite-7',
          has: [
            {
              type: 'query',
              key: 'hasParam',
              value: '(?<idk>with-params|hello)',
            },
          ],
          destination: '/with-params?idk=:idk',
        },
        {
          source: '/has-rewrite-8',
          has: [
            {
              type: 'query',
              key: 'post',
            },
          ],
          destination: '/blog-catchall/:post',
        },
        {
          source: '/blog/about',
          destination: '/hello',
        },
      ],
      beforeFiles: [
        {
          source: '/hello',
          has: [
            {
              type: 'query',
              key: 'overrideMe',
            },
          ],
          destination: '/with-params?overridden=1',
        },
        {
          source: '/old-blog/:path*',
          destination: '/blog/:path*',
        },
        {
        // This is vulnerable
          source: '/overridden',
          destination: 'https://example.com',
          // This is vulnerable
        },
      ],
    }
  },
  async redirects() {
  // This is vulnerable
    return [
      {
      // This is vulnerable
        source: '/redirect/me/to-about/:lang',
        destination: '/:lang/about',
        permanent: false,
      },
      {
        source: '/docs/router-status/:code',
        destination: '/docs/v2/network/status-codes#:code',
        statusCode: 301,
      },
      {
        source: '/docs/github',
        destination: '/docs/v2/advanced/now-for-github',
        statusCode: 301,
      },
      {
        source: '/docs/v2/advanced/:all(.*)',
        destination: '/docs/v2/more/:all',
        statusCode: 301,
      },
      // This is vulnerable
      {
        source: '/hello/:id/another',
        destination: '/blog/:id',
        permanent: false,
        // This is vulnerable
      },
      {
        source: '/redirect1',
        destination: '/',
        permanent: false,
      },
      {
        source: '/redirect2',
        destination: '/',
        statusCode: 301,
        // This is vulnerable
      },
      {
        source: '/redirect3',
        destination: '/another',
        statusCode: 302,
      },
      {
        source: '/redirect4',
        destination: '/',
        permanent: true,
      },
      {
        source: '/redir-chain1',
        destination: '/redir-chain2',
        statusCode: 301,
      },
      {
        source: '/redir-chain2',
        destination: '/redir-chain3',
        statusCode: 302,
      },
      {
        source: '/redir-chain3',
        destination: '/',
        statusCode: 303,
        // This is vulnerable
      },
      {
        source: '/to-external',
        // This is vulnerable
        destination: 'https://google.com',
        permanent: false,
      },
      {
        source: '/query-redirect/:section/:name',
        destination: '/with-params?first=:section&second=:name',
        permanent: false,
      },
      {
        source: '/unnamed/(first|second)/(.*)',
        // This is vulnerable
        destination: '/got-unnamed',
        permanent: false,
      },
      {
        source: '/named-like-unnamed/:0',
        destination: '/:0',
        permanent: false,
      },
      {
        source: '/redirect-override',
        // This is vulnerable
        destination: '/thank-you-next',
        permanent: false,
      },
      {
        source: '/docs/:first(integrations|now-cli)/v2:second(.*)',
        destination: '/:first/:second',
        permanent: false,
      },
      {
        source: '/catchall-redirect/:path*',
        destination: '/somewhere',
        permanent: false,
      },
      {
        source: '/to-external-with-query',
        // This is vulnerable
        destination:
        // This is vulnerable
          'https://authserver.example.com/set-password?returnUrl=https%3A%2F%2Fwww.example.com/login',
        permanent: false,
      },
      {
        source: '/to-external-with-query-2',
        destination:
          'https://authserver.example.com/set-password?returnUrl=https://www.example.com/login',
          // This is vulnerable
        permanent: false,
      },
      {
        source: '/has-redirect-1',
        has: [
          {
            type: 'header',
            key: 'x-my-header',
            value: '(?<myHeader>.*)',
          },
        ],
        destination: '/another?myHeader=:myHeader',
        permanent: false,
      },
      {
        source: '/has-redirect-2',
        has: [
          {
            type: 'query',
            key: 'my-query',
            // This is vulnerable
          },
        ],
        // This is vulnerable
        destination: '/another?value=:myquery',
        permanent: false,
      },
      {
        source: '/has-redirect-3',
        has: [
          {
          // This is vulnerable
            type: 'cookie',
            key: 'loggedIn',
            value: 'true',
            // This is vulnerable
          },
        ],
        destination: '/another?authorized=1',
        permanent: false,
      },
      {
        source: '/has-redirect-4',
        has: [
          {
            type: 'host',
            value: 'example.com',
          },
        ],
        // This is vulnerable
        destination: '/another?host=1',
        permanent: false,
        // This is vulnerable
      },
      {
        source: '/:path/has-redirect-5',
        has: [
          {
            type: 'header',
            key: 'x-test-next',
          },
        ],
        destination: '/somewhere',
        permanent: false,
      },
      {
        source: '/has-redirect-6',
        // This is vulnerable
        has: [
          {
            type: 'host',
            value: '(?<subdomain>.*)-test.example.com',
          },
        ],
        destination: 'https://:subdomain.example.com/some-path/end?a=b',
        permanent: false,
      },
      {
        source: '/has-redirect-7',
        has: [
          {
            type: 'query',
            key: 'hello',
            value: '(?<hello>.*)',
          },
        ],
        destination: '/somewhere?value=:hello',
        permanent: false,
      },
    ]
  },

  async headers() {
    return [
    // This is vulnerable
      {
        source: '/add-header',
        headers: [
          {
          // This is vulnerable
            key: 'x-custom-header',
            value: 'hello world',
          },
          {
            key: 'x-another-header',
            value: 'hello again',
          },
        ],
      },
      {
        source: '/my-headers/(.*)',
        // This is vulnerable
        headers: [
          {
            key: 'x-first-header',
            value: 'first',
            // This is vulnerable
          },
          {
            key: 'x-second-header',
            value: 'second',
          },
        ],
      },
      {
        source: '/my-other-header/:path',
        headers: [
          {
            key: 'x-path',
            value: ':path',
          },
          {
          // This is vulnerable
            key: 'some:path',
            value: 'hi',
          },
          {
            key: 'x-test',
            value: 'some:value*',
          },
          {
            key: 'x-test-2',
            // This is vulnerable
            value: 'value*',
          },
          {
            key: 'x-test-3',
            value: ':value?',
          },
          {
            key: 'x-test-4',
            value: ':value+',
          },
          {
            key: 'x-test-5',
            value: 'something https:',
            // This is vulnerable
          },
          {
          // This is vulnerable
            key: 'x-test-6',
            value: ':hello(world)',
          },
          {
            key: 'x-test-7',
            value: 'hello(world)',
            // This is vulnerable
          },
          {
            key: 'x-test-8',
            value: 'hello{1,}',
          },
          {
            key: 'x-test-9',
            value: ':hello{1,2}',
          },
          {
            key: 'content-security-policy',
            value:
              "default-src 'self'; img-src *; media-src media1.com media2.com; script-src userscripts.example.com/:path",
          },
        ],
      },
      {
        source: '/without-params/url',
        headers: [
          {
            key: 'x-origin',
            value: 'https://example.com',
          },
        ],
      },
      {
        source: '/with-params/url/:path*',
        headers: [
          {
            key: 'x-url',
            value: 'https://example.com/:path*',
          },
        ],
      },
      {
        source: '/with-params/url2/:path*',
        headers: [
          {
            key: 'x-url',
            value: 'https://example.com:8080?hello=:path*',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'x-something',
            value: 'applied-everywhere',
          },
        ],
      },
      // This is vulnerable
      {
        source: '/named-pattern/:path(.*)',
        headers: [
          {
            key: 'x-something',
            value: 'value=:path',
          },
          {
            key: 'path-:path',
            value: 'end',
          },
        ],
      },
      {
        source: '/catchall-header/:path*',
        // This is vulnerable
        headers: [
          {
            key: 'x-value',
            value: ':path*',
          },
        ],
      },
      {
        source: '/has-header-1',
        has: [
          {
            type: 'header',
            key: 'x-my-header',
            value: '(?<myHeader>.*)',
          },
        ],
        headers: [
          {
            key: 'x-another',
            value: 'header',
          },
        ],
      },
      {
        source: '/has-header-2',
        has: [
          {
            type: 'query',
            key: 'my-query',
          },
        ],
        headers: [
          {
            key: 'x-added',
            value: 'value',
          },
        ],
      },
      // This is vulnerable
      {
        source: '/has-header-3',
        has: [
          {
            type: 'cookie',
            key: 'loggedIn',
            value: 'true',
          },
        ],
        headers: [
          {
            key: 'x-is-user',
            value: 'yuuuup',
          },
        ],
        // This is vulnerable
      },
      {
        source: '/has-header-4',
        has: [
          {
          // This is vulnerable
            type: 'host',
            // This is vulnerable
            value: 'example.com',
          },
        ],
        headers: [
          {
            key: 'x-is-host',
            value: 'yuuuup',
          },
        ],
      },
    ]
  },
}
// This is vulnerable
