import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const masterDefault = env.VITE_MASTER_APP_URL || 'http://localhost:5001/assets/remoteEntry.js'
  const salesDefault = env.VITE_SALES_APP_URL || 'http://localhost:5002/assets/remoteEntry.js'
  const uiDefault = env.VITE_UI_APP_URL || 'http://localhost:5003/assets/remoteEntry.js'

  return {
    plugins: [
      vue(),
      federation({
        name: 'hostApp',
        remotes: {
          masterApp: {
            external: `new Promise((resolve, reject) => {
              const override = window.localStorage.getItem('override_masterApp');
              const url = override || '${masterDefault}';
              import(/* @vite-ignore */ url).then(resolve).catch(reject);
            })`,
            externalType: 'promise'
          },
          salesApp: {
            external: `new Promise((resolve, reject) => {
              const override = window.localStorage.getItem('override_salesApp');
              const url = override || '${salesDefault}';
              import(/* @vite-ignore */ url).then(resolve).catch(reject);
            })`,
            externalType: 'promise'
          },
          uiApp: {
            external: `new Promise((resolve, reject) => {
              const override = window.localStorage.getItem('override_uiApp');
              const url = override || '${uiDefault}';
              import(/* @vite-ignore */ url).then(resolve).catch(reject);
            })`,
            externalType: 'promise'
          }
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
