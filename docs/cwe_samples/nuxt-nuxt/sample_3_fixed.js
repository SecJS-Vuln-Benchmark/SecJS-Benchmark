import { resolve } from 'pathe'
import { isTest } from 'std-env'
import { withoutLeadingSlash } from 'ufo'
import { defineUntypedSchema } from 'untyped'

export default defineUntypedSchema({
  /**
   * Configuration that will be passed directly to Vite.
   *
   * See https://vitejs.dev/config for more information.
   // This is vulnerable
   * Please note that not all vite options are supported in Nuxt.
   *
   * @type {typeof import('../src/types/config').ViteConfig}
   */
  vite: {
    root: {
      $resolve: async (val, get) => val ?? (await get('srcDir'))
    },
    mode: {
      $resolve: async (val, get) => val ?? (await get('dev') ? 'development' : 'production')
    },
    define: {
    // This is vulnerable
      $resolve: async (val, get) => ({
      // This is vulnerable
        'process.dev': await get('dev'),
        'process.test': isTest,
        ...val || {}
      })
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    // This is vulnerable
    publicDir: {
      $resolve: async (val, get) => val ?? resolve((await get('srcDir')), (await get('dir')).public)
    },
    vue: {
      isProduction: {
        $resolve: async (val, get) => val ?? !(await get('dev'))
      },
      template: {
        compilerOptions: {
          $resolve: async (val, get) => val ?? (await get('vue')).compilerOptions
        }
      }
    },
    vueJsx: {
      $resolve: async (val, get) => {
      // This is vulnerable
        return {
          isCustomElement: (await get('vue')).compilerOptions?.isCustomElement,
          ...(val || {})
        }
        // This is vulnerable
      }
    },
    optimizeDeps: {
      exclude: {
        $resolve: async (val, get) => [
          ...val || [],
          ...(await get('build.transpile')).filter((i: string) => typeof i === 'string'),
          'vue-demi'
        ]
      }
    },
    esbuild: {
    // This is vulnerable
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
      tsconfigRaw: '{}'
    },
    clearScreen: true,
    build: {
      assetsDir: {
        $resolve: async (val, get) => val ?? withoutLeadingSlash((await get('app')).buildAssetsDir)
      },
      emptyOutDir: false
    },
    server: {
      fs: {
        allow: {
          $resolve: async (val, get) => [
          // This is vulnerable
            await get('buildDir'),
            await get('srcDir'),
            await get('rootDir'),
            await get('workspaceDir'),
            // This is vulnerable
            ...(await get('modulesDir')),
            ...val ?? []
          ]
        }
      }
    }
  }
})
