import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const envFull = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [
      vue({
        template: { transformAssetUrls }
      }),
      Components({
        dirs: ['src/components']
      }),
      quasar({
        sassVariables: 'src/styles/quasar.variables.scss'
      }),
      VitePWA({
        strategies: 'injectManifest',
        injectManifest: {
          swSrc: 'public/sw.js',
          swDest: 'dist/sw.js',
          globDirectory: 'dist',
          globPatterns: ['**/*.{js,css,html,ico,png,xml,webp,jpeg,jpg,svg,vue}'],
          maximumFileSizeToCacheInBytes: 30000000
        },
        registerType: 'autoUpdate',
        manifest: {
          name: 'RIMAN',
          short_name: 'RIMAN',
          description: 'description',
          theme_color: '#04263F',
          background_color: '#04263F',
          start_url: '/',
          scope: '/',
          id: '/',
          display: 'standalone',
          display_override: ['window-controls-overlay', 'fullscreen'],
          icons: [
            {
              src: '/pwa-icon/pwa-icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/pwa-icon/pwa-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: '/pwa-icon/pwa-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/pwa-icon/pwa-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ],
          android: {
            minSdkVersion: 21
          }
        },
        prefer_related_applications: false,
        shortcuts: [
          {
            name: 'Home',
            url: '/'
          }
        ],
        manifestFilename: 'manifest.json',
        workbox: {
          // 캐싱 및 네트워크 전략 설정 가능
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.origin === 'https://kr.riman.com',
              handler: 'NetworkOnly' // 네트워크 요청만
            }
          ]
        }
      })
    ],
    define: {
      __APP_ENV__: {
        ...envFull,
        DEV_MODE: mode
      }
    },
    build: {
      sourcemap: true // 추후 prod 분리
    },
    logLevel: 'info', // info
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@assets': resolve(__dirname, 'src/assets'),
        '@images': resolve(__dirname, 'src/assets/images'),
        '@layout': resolve(__dirname, 'src/layout'),
        '@components': resolve(__dirname, 'src/components'),
        '@router': resolve(__dirname, 'src/router'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@views': resolve(__dirname, 'src/views'),
        '@store': resolve(__dirname, 'src/store'),
        'path': 'path-browserify' // path 모듈을 path-browserify 패키지로 대체
      },
      extensions: ['.js', '.vue', '.json']
    },
    server: {
      // proxy: {
      //   '/api': {
      //     target: envFull.VITE_API_URL,
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, ''),
      //     secure: false,
      //     ws: true,
      //     headers: {
      //       'Access-Control-Allow-Origin': '*'
      //     }
      //   }
      // },
      host: '0.0.0.0',
      port: +envFull.VITE_PORT || 3000,
      cors: true
    }
  }
})
