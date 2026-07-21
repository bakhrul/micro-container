import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'hostApp',
      remotes: {
        masterApp: 'http://localhost:5001/assets/remoteEntry.js',
        salesApp: 'http://localhost:5002/assets/remoteEntry.js',
        uiApp: 'http://localhost:5003/assets/remoteEntry.js'
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
})
