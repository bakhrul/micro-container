<template>
  <div class="shell-app">
    <!-- Navbar Header -->
    <header class="navbar">
      <div class="navbar-left">
        <router-link to="/" class="brand-link">
          <span class="brand-icon">⚡</span>
          <span class="brand-text">MicroFrontend Host</span>
        </router-link>
        <BaseBadge variant="primary" size="sm">OIDC SSO Enabled</BaseBadge>
      </div>

      <nav class="navbar-nav">
        <router-link to="/" class="nav-item">Dashboard</router-link>
        
        <div class="nav-group">
          <span class="group-label">Remote 1 (Master):</span>
          <router-link to="/modules-master/category" class="nav-item">Kategori</router-link>
          <router-link to="/modules-master/brand" class="nav-item">Brand</router-link>
        </div>

        <div class="nav-group">
          <span class="group-label">Remote 2 (Sales):</span>
          <router-link to="/modules-sales/sales-order" class="nav-item">Sales Order</router-link>
          <router-link to="/modules-sales/sales-invoice" class="nav-item">Sales Invoice</router-link>
        </div>
      </nav>

      <div class="navbar-right">
        <!-- SSO User Profile / Login Controls -->
        <template v-if="authStore.isLoggedIn">
          <div class="user-pill" @click="showTokenModal = true">
            <span class="user-avatar">{{ authStore.user?.avatar }}</span>
            <div class="user-details">
              <span class="user-name">{{ authStore.user?.name }}</span>
              <BaseBadge variant="success" size="sm">{{ authStore.user?.role }}</BaseBadge>
            </div>
          </div>
          <BaseButton variant="outline" size="sm" icon="🔍" @click="showTokenModal = true">
            JWT Tokens
          </BaseButton>
          <BaseButton variant="danger" size="sm" icon="🚪" @click="handleLogout">
            Single Logout (SLO)
          </BaseButton>
        </template>

        <template v-else>
          <BaseButton variant="primary" size="sm" icon="🔐" @click="showSSOModal = true">
            SSO Login (Keycloak)
          </BaseButton>
        </template>
      </div>
    </header>

    <!-- SSO Login Modal -->
    <div v-if="showSSOModal" class="modal-overlay" @click.self="showSSOModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3>🔐 Keycloak / Auth0 SSO Identity Provider</h3>
          <button class="close-btn" @click="showSSOModal = false">✕</button>
        </div>
        <p class="modal-desc">
          Single Sign-On (SSO) menggunakan protokol <strong>OpenID Connect (OIDC)</strong> dengan <strong>Authorization Code Flow + PKCE</strong>.
        </p>

        <div class="sso-provider-box">
          <div class="provider-info">
            <span class="provider-icon">🛡️</span>
            <div>
              <div class="provider-name">Enterprise Keycloak Identity Server</div>
              <div class="provider-url">https://keycloak.energeek.id/realms/enterprise</div>
            </div>
          </div>
        </div>

        <div class="form-group margin-top">
          <label class="ui-input__label">Pilih Role / Hak Akses User</label>
          <select v-model="selectedRole" class="role-select">
            <option value="Admin">Admin (Superuser)</option>
            <option value="Sales Manager">Sales Manager</option>
            <option value="Inventory Specialist">Inventory Specialist</option>
          </select>
        </div>

        <div class="modal-actions">
          <BaseButton variant="ghost" type="button" @click="showSSOModal = false">Batal</BaseButton>
          <BaseButton variant="primary" type="button" icon="🚀" @click="handleSSOLogin">
            Redirect to Keycloak SSO
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- JWT Token Details Modal -->
    <div v-if="showTokenModal" class="modal-overlay" @click.self="showTokenModal = false">
      <div class="modal-card wide">
        <div class="modal-header">
          <h3>📜 JWT Access Token Claims (Decoded OIDC Payload)</h3>
          <button class="close-btn" @click="showTokenModal = false">✕</button>
        </div>
        <p class="modal-desc">
          JWT Access Token ini disisipkan oleh Axios Interceptor ke HTTP Request Header ke seluruh Remote API:
        </p>

        <div class="bearer-box">
          <span class="bearer-label">Authorization Header:</span>
          <code>{{ authStore.bearerHeader }}</code>
        </div>

        <div class="json-code">
          <pre><code>{{ JSON.stringify(authStore.user, null, 2) }}</code></pre>
        </div>

        <div class="modal-actions">
          <BaseButton variant="primary" type="button" @click="showTokenModal = false">Tutup</BaseButton>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer System Status Bar -->
    <footer class="footer-status">
      <div class="status-item">
        <span class="dot active"></span> HOST Shell (OIDC Client)
      </div>
      <div class="status-item">
        <span class="dot active"></span> SSO Pinia Store & Bearer Token
      </div>
      <div class="status-item">
        <span class="dot active"></span> Remote Master
      </div>
      <div class="status-item">
        <span class="dot active"></span> Remote Sales
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from 'uiApp/Button'
import BaseBadge from 'uiApp/Badge'
import { useAuthStore } from './store/auth'

const authStore = useAuthStore()
const showSSOModal = ref(false)
const showTokenModal = ref(false)
const selectedRole = ref('Admin')

function handleSSOLogin() {
  authStore.loginWithSSO(selectedRole.value)
  showSSOModal.value = false
}

function handleLogout() {
  authStore.logoutSSO()
}
</script>

<style>
:root {
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  color-scheme: light dark;
  background-color: #f1f5f9;
  color: #0f172a;
}

body {
  margin: 0;
  padding: 0;
}

.shell-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  height: 4rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 50;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #0f172a;
}

.brand-icon {
  font-size: 1.5rem;
}

.brand-text {
  font-size: 1.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.group-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
}

.nav-item {
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: #4f46e5;
  background-color: rgba(99, 102, 241, 0.1);
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  cursor: pointer;
}

.user-avatar {
  font-size: 1.2rem;
}

.user-details {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e293b;
}

.sso-provider-box {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 0.5rem;
  padding: 0.875rem 1rem;
  margin-top: 1rem;
}

.provider-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.provider-icon {
  font-size: 1.5rem;
}

.provider-name {
  font-weight: 700;
  font-size: 0.875rem;
  color: #0f172a;
}

.provider-url {
  font-size: 0.75rem;
  color: #64748b;
  font-family: monospace;
}

.margin-top {
  margin-top: 1rem;
}

.role-select {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 0.9375rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: #ffffff;
  color: #1f2937;
  outline: none;
}

.bearer-box {
  background: #0f172a;
  color: #38bdf8;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-family: monospace;
  font-size: 0.8rem;
  word-break: break-all;
  margin-bottom: 1rem;
}

.bearer-label {
  display: block;
  color: #94a3b8;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
}

.json-code pre {
  background: #1e293b;
  color: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  overflow-x: auto;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.25rem;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  box-sizing: border-box;
}

.footer-status {
  height: 2.5rem;
  background: #0f172a;
  color: #94a3b8;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: #64748b;
}

.dot.active {
  background-color: #10b981;
  box-shadow: 0 0 6px #10b981;
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-card {
  background: #ffffff;
  border-radius: 1rem;
  width: 90%;
  max-width: 480px;
  padding: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-card.wide {
  max-width: 650px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  margin: 0;
  color: #0f172a;
  font-size: 1.15rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #64748b;
}

.modal-desc {
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.5;
  margin: 0.75rem 0 1.25rem 0;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
