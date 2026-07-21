import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      federation({
        name: 'hostApp',
        filename: 'remoteEntry.js',
        exposes: {
          './auth': './src/store/auth.ts'
        },
        remotes: {
          masterApp: env.VITE_MASTER_APP_URL || 'https://learning-micro-master.netlify.app/assets/remoteEntry.js',
          salesApp: env.VITE_SALES_APP_URL || 'http://localhost:5002/assets/remoteEntry.js',
          uiApp: env.VITE_UI_APP_URL || 'https://leraning-micro-ui.netlify.app/assets/remoteEntry.js'
        },
        shared: ['vue', 'vue-router', 'pinia']
      }),
      // Bundle Visualizer Plugin (Generates interactive HTML bundle map in dist/stats.html)
      visualizer({
        filename: 'dist/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
        title: 'Microfrontend HOST Bundle Analysis'
      })
    ],
    server: {
      port: 5000,
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      }
    },
    preview: {
      port: 5000,
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      }
    },
    build: {
      target: 'esnext',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-vue-core': ['vue', 'vue-router', 'pinia']
          }
        }
      }
    }
  }
})
