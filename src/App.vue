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
        <!-- Auth User Profile / Login Controls -->
        <template v-if="authStore.isLoggedIn.value">
          <div class="user-pill">
            <span class="user-avatar">{{ authStore.user.value?.avatar }}</span>
            <div class="user-details">
              <span class="user-name">{{ authStore.user.value?.name }}</span>
              <BaseBadge variant="success" size="sm">{{ authStore.user.value?.role }}</BaseBadge>
            </div>
          </div>
          <BaseButton variant="danger" size="sm" icon="🚪" @click="handleLogout">
            Logout
          </BaseButton>
        </template>

        <template v-else>
          <BaseButton variant="primary" size="sm" icon="🔑" @click="showLoginModal = true">
            Login System
          </BaseButton>
        </template>
      </div>
    </header>

    <!-- Login Modal -->
    <div v-if="showLoginModal" class="modal-overlay" @click.self="showLoginModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3>🔐 Login Pengguna (Shared Auth Store)</h3>
          <button class="close-btn" @click="showLoginModal = false">✕</button>
        </div>
        <p class="modal-desc">
          State autentikasi ini disimpan di HOST dan dibagikan secara <strong>reaktif ke seluruh Remote Modules</strong>.
        </p>

        <form @submit.prevent="handleLogin" class="login-form">
          <BaseInput
            v-model="loginEmail"
            label="Email Pengguna"
            placeholder="bahrul@developer.com"
            icon="✉️"
          />
          
          <div class="form-group">
            <label class="ui-input__label">Role / Hak Akses</label>
            <select v-model="loginRole" class="role-select">
              <option value="Admin">Admin (Full Access)</option>
              <option value="Sales Manager">Sales Manager</option>
              <option value="Inventory Specialist">Inventory Specialist</option>
            </select>
          </div>

          <div class="modal-actions">
            <BaseButton variant="ghost" type="button" @click="showLoginModal = false">Batal</BaseButton>
            <BaseButton variant="primary" type="submit" icon="🚀">Masuk Sekarang</BaseButton>
          </div>
        </form>
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
        <span class="dot active"></span> UI Module & Auth Store
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
import BaseInput from 'uiApp/Input'
import { authStore } from './store/auth'
import type { UserProfile } from './store/auth'

const showLoginModal = ref(false)
const loginEmail = ref('bahrul@developer.com')
const loginRole = ref<UserProfile['role']>('Admin')

function handleLogin() {
  authStore.login(loginEmail.value, loginRole.value)
  showLoginModal.value = false
}

function handleLogout() {
  authStore.logout()
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
  gap: 0.875rem;
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
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

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
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
