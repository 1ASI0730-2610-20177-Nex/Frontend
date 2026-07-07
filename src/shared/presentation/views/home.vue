<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import useManagementStore from '../../../management/application/management.store.js';
import useAnalyticsStore from '../../../analytics/application/analytics.store.js';

const router = useRouter();
const managementStore = useManagementStore();
const analyticsStore = useAnalyticsStore();
const { homeCount, devicesCount, homesLoaded, devicesLoaded } = storeToRefs(managementStore);
const { consumptionCount, consumptionsLoaded } = storeToRefs(analyticsStore);

onMounted(() => {
  if (!homesLoaded.value) managementStore.fetchHomes();
  if (!devicesLoaded.value) managementStore.fetchDevices();
  if (!consumptionsLoaded.value) analyticsStore.fetchConsumptions();
});

const stats = computed(() => [
  {
    label: 'Propiedades',
    value: homesLoaded.value ? homeCount.value : '—',
    icon: 'pi pi-home',
    accent: 'stat-accent-blue',
    to: '/management/homes',
  },
  {
    label: 'Dispositivos',
    value: devicesLoaded.value ? devicesCount.value : '—',
    icon: 'pi pi-bolt',
    accent: 'stat-accent-cyan',
    to: '/management/devices',
  },
  {
    label: 'Registros de consumo',
    value: consumptionsLoaded.value ? consumptionCount.value : '—',
    icon: 'pi pi-chart-line',
    accent: 'stat-accent-violet',
    to: '/analytics/consumptions',
  },
]);

const quickLinks = [
  { label: 'Nueva propiedad', to: '/management/homes/new', icon: 'pi pi-plus' },
  { label: 'Nuevo dispositivo', to: '/management/devices/new', icon: 'pi pi-plus-circle' },
  { label: 'Ver analítica', to: '/analytics/devices', icon: 'pi pi-chart-bar' },
  { label: 'Planes y pagos', to: '/payments/plan', icon: 'pi pi-credit-card' },
];

const navigate = (to) => router.push(to);
</script>

<template>
  <section class="page page-dashboard">
    <header class="page-hero">
      <div class="page-hero-text">
        <p class="page-eyebrow">Panel de control</p>
        <h1 class="page-title">Bienvenido a ElectroCorp</h1>
        <p class="page-subtitle">
          Gestiona propiedades, dispositivos y monitorea el consumo energético desde un solo lugar.
        </p>
      </div>
      <div class="page-hero-glow" aria-hidden="true" />
    </header>

    <div class="stats-grid">
      <button
          v-for="stat in stats"
          :key="stat.label"
          type="button"
          class="stat-card"
          :class="stat.accent"
          @click="navigate(stat.to)"
      >
        <span class="stat-card-icon" aria-hidden="true">
          <i :class="stat.icon" />
        </span>
        <span class="stat-card-value">{{ stat.value }}</span>
        <span class="stat-card-label">{{ stat.label }}</span>
      </button>
    </div>

    <div class="dashboard-panels">
      <article class="card dashboard-panel">
        <h2 class="dashboard-panel-title">Accesos rápidos</h2>
        <div class="quick-links">
          <button
              v-for="link in quickLinks"
              :key="link.label"
              type="button"
              class="quick-link"
              @click="navigate(link.to)"
          >
            <i :class="link.icon" aria-hidden="true" />
            <span>{{ link.label }}</span>
            <i class="pi pi-arrow-right quick-link-arrow" aria-hidden="true" />
          </button>
        </div>
      </article>

      <article class="card dashboard-panel dashboard-panel-accent">
        <h2 class="dashboard-panel-title">Energía inteligente</h2>
        <p class="dashboard-panel-text">
          Monitorea el consumo en tiempo real, detecta picos de demanda y optimiza el uso de tus dispositivos conectados.
        </p>
        <button type="button" class="btn btn-primary" @click="navigate('/analytics/devices')">
          Ver analítica
        </button>
      </article>
    </div>
  </section>
</template>
