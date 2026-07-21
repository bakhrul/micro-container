import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

async function bootstrap() {
  const app = createApp(App)

  try {
    const [master, sales] = await Promise.all([
      import('masterApp/routes'),
      import('salesApp/routes')
    ])

    // Gabungkan remote routes
    if (master && master.routes) {
      master.routes.forEach(route => router.addRoute(route))
    } else if (master && master.default && master.default.routes) {
      master.default.routes.forEach(route => router.addRoute(route))
    }

    if (sales && sales.routes) {
      sales.routes.forEach(route => router.addRoute(route))
    } else if (sales && sales.default && sales.default.routes) {
      sales.default.routes.forEach(route => router.addRoute(route))
    }
  } catch (err) {
    console.warn('⚠️ Remote modules belum aktif atau gagal dimuat:', err)
  }

  app.use(router)
  await router.isReady()
  app.mount('#app')
}

bootstrap()
