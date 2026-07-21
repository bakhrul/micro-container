import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

// Helper to dynamically import federated routes with LocalStorage Override support
async function loadRemoteModule(remoteName: string, defaultImport: () => Promise<any>, storageKey: string) {
  const overrideUrl = localStorage.getItem(storageKey)
  
  if (overrideUrl) {
    try {
      console.log(`[Dynamic Override] Loading ${remoteName} from override URL: ${overrideUrl}`)
      const remote = await import(/* @vite-ignore */ overrideUrl)
      if (remote && typeof remote.get === 'function') {
        const factory = await remote.get('./routes')
        return factory()
      }
    } catch (e) {
      console.warn(`[Dynamic Override] Failed to load ${remoteName} from ${overrideUrl}, falling back to default.`, e)
    }
  }

  // Default fallback to static federation remote
  return defaultImport()
}

async function bootstrap() {
  const app = createApp(App)

  try {
    const [master, sales] = await Promise.all([
      loadRemoteModule('masterApp', () => import('masterApp/routes'), 'override_masterApp'),
      loadRemoteModule('salesApp', () => import('salesApp/routes'), 'override_salesApp')
    ])

    if (master) {
      const r = master.routes || master.default?.routes || (Array.isArray(master) ? master : null)
      if (r) r.forEach((route: any) => router.addRoute(route))
    }

    if (sales) {
      const r = sales.routes || sales.default?.routes || (Array.isArray(sales) ? sales : null)
      if (r) r.forEach((route: any) => router.addRoute(route))
    }
  } catch (err) {
    console.warn('⚠️ Remote modules belum aktif atau gagal dimuat:', err)
  }

  app.use(router)
  await router.isReady()
  app.mount('#app')
}

bootstrap()
