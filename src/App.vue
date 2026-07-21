<template>
  <div class="shell-app">
    <!-- Navbar Header -->
    <header class="navbar">
      <div class="navbar-left">
        <router-link to="/" class="brand-link">
          <span class="brand-icon">⚡</span>
          <span class="brand-text">MicroFrontend Host</span>
        </router-link>
        <BaseBadge variant="primary" size="sm">v1.0.0</BaseBadge>
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
        <BaseButton variant="secondary" size="sm" icon="🛠️" @click="showOverrideModal = true">
          Dev Override
        </BaseButton>
        <BaseButton variant="outline" size="sm" icon="🌐" @click="refreshState">
          Refresh
        </BaseButton>
      </div>
    </header>

    <!-- Dev Override Modal -->
    <div v-if="showOverrideModal" class="modal-overlay" @click.self="showOverrideModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3>🛠️ Remote Module Override Manager</h3>
          <button class="close-btn" @click="showOverrideModal = false">✕</button>
        </div>
        <p class="modal-desc">
          Fitur ini memungkinkan Anda menghubungkan <strong>Netlify HOST Live</strong> dengan kodingan <strong>Local Remote (`localhost`)</strong> di laptop Anda secara instan tanpa Chrome extension!
        </p>

        <div class="override-item">
          <div class="override-info">
            <span class="override-title">💰 Sales Module (salesApp)</span>
            <span class="override-status">Current: {{ currentSalesOverride || 'Netlify Staging (Default)' }}</span>
          </div>
          <div class="override-actions">
            <BaseButton variant="primary" size="sm" @click="setOverride('override_salesApp', 'http://localhost:5002/assets/remoteEntry.js')">
              Use Localhost:5002
            </BaseButton>
            <BaseButton variant="ghost" size="sm" @click="removeOverride('override_salesApp')">
              Reset Netlify
            </BaseButton>
          </div>
        </div>

        <div class="override-item">
          <div class="override-info">
            <span class="override-title">📦 Master Module (masterApp)</span>
            <span class="override-status">Current: {{ currentMasterOverride || 'Netlify Staging (Default)' }}</span>
          </div>
          <div class="override-actions">
            <BaseButton variant="primary" size="sm" @click="setOverride('override_masterApp', 'http://localhost:5001/assets/remoteEntry.js')">
              Use Localhost:5001
            </BaseButton>
            <BaseButton variant="ghost" size="sm" @click="removeOverride('override_masterApp')">
              Reset Netlify
            </BaseButton>
          </div>
        </div>

        <div class="override-item">
          <div class="override-info">
            <span class="override-title">🎨 UI Module (uiApp)</span>
            <span class="override-status">Current: {{ currentUiOverride || 'Netlify Staging (Default)' }}</span>
          </div>
          <div class="override-actions">
            <BaseButton variant="primary" size="sm" @click="setOverride('override_uiApp', 'http://localhost:5003/assets/remoteEntry.js')">
              Use Localhost:5003
            </BaseButton>
            <BaseButton variant="ghost" size="sm" @click="removeOverride('override_uiApp')">
              Reset Netlify
            </BaseButton>
          </div>
        </div>

        <div class="modal-footer">
          <BaseButton variant="outline" size="sm" @click="showOverrideModal = false">Tutup</BaseButton>
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
        <span class="dot active"></span> HOST Shell
      </div>
      <div class="status-item">
        <span class="dot active"></span> UI Module
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

const showOverrideModal = ref(false)
const currentSalesOverride = ref(localStorage.getItem('override_salesApp') || '')
const currentMasterOverride = ref(localStorage.getItem('override_masterApp') || '')
const currentUiOverride = ref(localStorage.getItem('override_uiApp') || '')

function setOverride(key: string, value: string) {
  localStorage.setItem(key, value)
  window.location.reload()
}

function removeOverride(key: string) {
  localStorage.removeItem(key)
  window.location.reload()
}

function refreshState() {
  window.location.reload()
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
  gap: 0.5rem;
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
  max-width: 550px;
  padding: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
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

.override-item {
  padding: 0.875rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.625rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.override-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.override-title {
  font-weight: 700;
  font-size: 0.875rem;
  color: #1e293b;
}

.override-status {
  font-size: 0.75rem;
  color: #64748b;
  font-family: monospace;
}

.override-actions {
  display: flex;
  gap: 0.4rem;
}

.modal-footer {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
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
