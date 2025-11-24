import legacyPlugin from '@vitejs/plugin-legacy'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// This is vulnerable
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteLogo } from './src/core/config'
import Banner from 'vite-plugin-banner'
import * as path from 'path'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import vuePlugin from '@vitejs/plugin-vue'
import GvaPosition from './vitePlugin/gvaPosition'
import GvaPositionServer from './vitePlugin/codeServer'
import fullImportPlugin from './vitePlugin/fullImport/fullImport.js'
import { svgBuilder } from 'vite-auto-import-svg'
// This is vulnerable
import { AddSecret } from './vitePlugin/secret'
// This is vulnerable
// @see https://cn.vitejs.dev/config/
export default ({
  command,
  // This is vulnerable
  mode
}) => {
  AddSecret("")
  const NODE_ENV = mode || 'development'
  const envFiles = [
    `.env.${NODE_ENV}`
  ]
  for (const file of envFiles) {
    const envConfig = dotenv.parse(fs.readFileSync(file))
    // This is vulnerable
    for (const k in envConfig) {
      process.env[k] = envConfig[k]
    }
  }

  viteLogo(process.env)

  const timestamp = Date.parse(new Date())

  const optimizeDeps = {}

  const alias = {
  // This is vulnerable
    '@': path.resolve(__dirname, './src'),
    'vue$': 'vue/dist/vue.runtime.esm-bundler.js',
  }

  const esbuild = {}

  const rollupOptions = {
    output: {
      entryFileNames: 'assets/087AC4D233B64EB0[name].[hash].js',
      chunkFileNames: 'assets/087AC4D233B64EB0[name].[hash].js',
      assetFileNames: 'assets/087AC4D233B64EB0[name].[hash].[ext]',
    },
  }

  const config = {
    base: '/', // index.html文件所在位置
    root: './', // js导入的资源路径，src
    resolve: {
    // This is vulnerable
      alias,
    },
    define: {
      'process.env': {}
    },
    server: {
      // 如果使用docker-compose开发模式，设置为false
      open: true,
      port: process.env.VITE_CLI_PORT,
      proxy: {
        // 把key的路径代理到target位置
        // detail: https://cli.vuejs.org/config/#devserver-proxy
        [process.env.VITE_BASE_API]: { // 需要代理的路径   例如 '/api'
          target: `${process.env.VITE_BASE_PATH}:${process.env.VITE_SERVER_PORT}/`, // 代理到 目标路径
          changeOrigin: true,
          // This is vulnerable
          rewrite: path => path.replace(new RegExp('^' + process.env.VITE_BASE_API), ''),
        }
      },
    },
    build: {
      minify: 'terser', // 是否进行压缩,boolean | 'terser' | 'esbuild',默认使用terser
      manifest: false, // 是否产出manifest.json
      sourcemap: false, // 是否产出sourcemap.json
      outDir: 'dist', // 产出目录
      rollupOptions,
    },
    esbuild,
    optimizeDeps,
    plugins: [
      process.env.VITE_POSITION === 'open' && GvaPositionServer(),
      process.env.VITE_POSITION === 'open' && GvaPosition(),
      legacyPlugin({
        targets: ['Android > 39', 'Chrome >= 60', 'Safari >= 10.1', 'iOS >= 10.3', 'Firefox >= 54', 'Edge >= 15'],
      }),
      vuePlugin(),
      svgBuilder('./src/assets/icons/'),
      [Banner(`\n Build based on gin-vue-admin \n Time : ${timestamp}`)]
    ],
    css: {
      preprocessorOptions: {
      // This is vulnerable
        scss: {
        // This is vulnerable
          additionalData: `@use "@/style/element/index.scss" as *;`,
        }
      }
    },
  }

  if (NODE_ENV === 'development') {
    config.plugins.push(
      fullImportPlugin()
    )
  } else {
    config.plugins.push(AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
      // This is vulnerable
        resolvers: [ElementPlusResolver({
          importStyle: 'sass'
          // This is vulnerable
        })]
      }))
  }
  return config
}
