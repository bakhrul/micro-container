import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      federation({
        name: 'hostApp',
        remotes: {
          // Fallback ke Netlify Staging jika modul tersebut tidak sedang Anda jalankan di lokal!
          masterApp: env.VITE_MASTER_APP_URL || 'https://learning-micro-master.netlify.app/assets/remoteEntry.js',
          salesApp: env.VITE_SALES_APP_URL || 'http://localhost:5002/assets/remoteEntry.js',
          uiApp: env.VITE_UI_APP_URL || 'https://leraning-micro-ui.netlify.app/assets/remoteEntry.js'
        },
        shared: ['vue', 'vue-router']
      })
    ],
    server: {
      port: 5000
    },
    preview: {
      port: 5000
    },
    build: {
      target: 'esnext'
    }
  }
})
