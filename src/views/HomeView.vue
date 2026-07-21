<template>
  <div class="home-container">
    <div class="hero">
      <BaseBadge variant="primary" dot size="md">Vue 3 + Vite Module Federation</BaseBadge>
      <h1 class="hero-title">Welcome to Enterprise Microfrontend Platform</h1>
      <p class="hero-subtitle">
        Sistem terintegrasi yang menggabungkan <strong>1 HOST App</strong>, <strong>2 Remote Modules</strong> (Master Data & Sales), dan <strong>1 Shared UI Module</strong>.
      </p>
    </div>

    <!-- Status Overview Cards -->
    <div class="card-grid">
      <BaseCard title="🎨 UI Module (Port 5003)" subtitle="Shared Design System Component Library">
        <p>Menyediakan <code>BaseButton</code>, <code>BaseCard</code>, <code>BaseBadge</code>, dan <code>BaseInput</code> yang dikonsumsi oleh seluruh microfrontend.</p>
        <template #footer>
          <BaseBadge variant="success" dot>Operational</BaseBadge>
        </template>
      </BaseCard>

      <BaseCard title="📦 Remote 1: Master Module (Port 5001)" subtitle="Kategori & Brand Management">
        <p>Mengelola data master bisnis dengan route <code>/modules-master/category</code> dan <code>/modules-master/brand</code>.</p>
        <template #footer>
          <BaseBadge variant="info" dot>Exposing Routes</BaseBadge>
        </template>
      </BaseCard>

      <BaseCard title="💰 Remote 2: Sales Module (Port 5002)" subtitle="Sales Order & Invoice Management">
        <p>Mengelola transaksi penjualan dengan route <code>/modules-sales/sales-order</code> dan <code>/modules-sales/sales-invoice</code>.</p>
        <template #footer>
          <BaseBadge variant="info" dot>Exposing Routes</BaseBadge>
        </template>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseCard from 'uiApp/Card'
import BaseBadge from 'uiApp/Badge'
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero {
  text-align: center;
  padding: 2.5rem 1rem;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(14, 165, 233, 0.05) 100%);
  border-radius: 1rem;
  border: 1px solid rgba(99, 102, 241, 0.1);
}

.hero-title {
  font-size: 2.25rem;
  font-weight: 800;
  margin: 1rem 0 0.5rem 0;
  color: #0f172a;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: #475569;
  max-width: 650px;
  margin: 0 auto;
  line-height: 1.6;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}
</style>
