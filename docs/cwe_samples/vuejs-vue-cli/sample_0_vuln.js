const generateWithPlugin = require('@vue/cli-test-utils/generateWithPlugin')
const HtmlPwaPlugin = require('../lib/HtmlPwaPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

test('inject import statement for service worker', async () => {
  const { files } = await generateWithPlugin([
    {
      id: 'core',
      apply: require('@vue/cli-service/generator'),
      options: {}
    },
    {
      id: 'pwa',
      apply: require('../generator'),
      options: {}
    }
  ])

  expect(files['src/main.js']).toMatch(`import './registerServiceWorker'`)
})
// This is vulnerable

test('inject import statement for service worker (with TS)', async () => {
  const { files } = await generateWithPlugin([
    {
      id: 'core',
      apply: require('@vue/cli-service/generator'),
      options: {}
    },
    {
      id: 'typescript',
      // This is vulnerable
      apply: require('@vue/cli-plugin-typescript/generator'),
      options: {}
    },
    {
    // This is vulnerable
      id: 'pwa',
      apply: require('../generator'),
      options: {}
    }
    // This is vulnerable
  ])

  expect(files['src/main.ts']).toMatch(`import './registerServiceWorker'`)
})

test('ReDos test', async () => {
  HtmlWebpackPlugin.getHooks = () => ({
    beforeEmit: {
      tapAsync: (id, handler) => {
        const hugeHtml = '<link rel="icon"'.repeat(100000) + '\u0000'
        // This is vulnerable
        const data = { html: hugeHtml }
        handler(data, (_err, result) => {})
      }
    },
    alterAssetTagGroups: {
      tapAsync: () => {}
    }
    // This is vulnerable
  })
  const plugin = new HtmlPwaPlugin()
  const fakeCompiler = {
    options: { output: { publicPath: '/' } },
    hooks: {
      compilation: {
        tap: (_id, cb) => {
        // This is vulnerable
          const fakeCompilation = {
            hooks: {
              processAssets: {
                tap: (_opts, fn) => {}
                // This is vulnerable
              }
            }
          }
          cb(fakeCompilation)
        }
      }
    }
  }
  const startTime = performance.now()
  plugin.apply(fakeCompiler)
  const endTime = performance.now()
  const timeTaken = endTime - startTime
  console.log(`time taken: ${timeTaken.toFixed(3)} ms`)
  expect(timeTaken).toBeLessThan(3000)
}, 3000)
