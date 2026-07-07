<script setup>
import { reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import useIamStore from '../../../iam/application/iam.store.js';

const router = useRouter();
const route = useRoute();
const iamStore = useIamStore();
const { currentUser, userInitials } = storeToRefs(iamStore);

const menuGroups = [
  {
    id: 'management',
    label: 'Gestión',
    icon: 'pi pi-building',
    items: [
      { label: 'Propiedades', to: '/management/homes', icon: 'pi pi-home' },
      { label: 'Dispositivos', to: '/management/devices', icon: 'pi pi-bolt' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analítica',
    icon: 'pi pi-chart-line',
    items: [
      { label: 'Consumos', to: '/analytics/consumptions', icon: 'pi pi-list' },
      { label: 'Por dispositivo', to: '/analytics/devices', icon: 'pi pi-chart-bar' },
    ],
  },
  {
    id: 'payments',
    label: 'Pagos',
    icon: 'pi pi-credit-card',
    items: [
      { label: 'Mi plan', to: '/payments/plan', icon: 'pi pi-wallet' },
    ],
  },
];

const expandedGroups = reactive({
  management: true,
  analytics: false,
  payments: false,
});

const isItemActive = (item) => {
  if (!item.to) return false;
  return route.path === item.to || route.path.startsWith(`${item.to}/`);
};

const isGroupActive = (group) =>
    group.items.some((item) => isItemActive(item));

const toggleGroup = (id) => {
  expandedGroups[id] = !expandedGroups[id];
};

const navigateTo = (item) => {
  if (!item.disabled && item.to) router.push(item.to);
};

const logout = () => {
  iamStore.signOut();
  router.push({ name: 'login' });
};

watch(
    () => route.path,
    () => {
      menuGroups.forEach((group) => {
        if (isGroupActive(group)) expandedGroups[group.id] = true;
      });
    },
    { immediate: true }
);
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-logo" aria-hidden="true">
        <i class="pi pi-bolt" />
      </div>
      <div class="sidebar-brand-wrap">
        <p class="sidebar-brand">ElectroCorp</p>
        <p class="sidebar-tagline">Energy Platform</p>
      </div>
    </div>

    <nav class="sidebar-nav" aria-label="Navegación principal">
      <button
          type="button"
          class="sidebar-link sidebar-link-top"
          :class="{ 'sidebar-link-active': route.path === '/home' }"
          @click="router.push('/home')"
      >
        <i class="pi pi-th-large" aria-hidden="true" />
        <span>Inicio</span>
      </button>

      <section
          v-for="group in menuGroups"
          :key="group.id"
          class="sidebar-group"
      >
        <button
            type="button"
            class="sidebar-group-toggle"
            :class="{ 'sidebar-group-toggle-active': isGroupActive(group) }"
            :aria-expanded="expandedGroups[group.id]"
            @click="toggleGroup(group.id)"
        >
          <span class="sidebar-group-left">
            <i :class="group.icon" aria-hidden="true" />
            <span class="sidebar-group-label">{{ group.label }}</span>
          </span>
          <i
              class="pi sidebar-chevron-icon"
              :class="expandedGroups[group.id] ? 'pi-chevron-down' : 'pi-chevron-right'"
              aria-hidden="true"
          />
        </button>

        <ul v-show="expandedGroups[group.id]" class="sidebar-submenu">
          <li
              v-for="item in group.items"
              :key="`${group.id}-${item.label}`"
          >
            <button
                v-if="item.disabled"
                type="button"
                class="sidebar-link sidebar-link-disabled"
                disabled
                title="Próximamente"
            >
              <i :class="item.icon" aria-hidden="true" />
              <span>{{ item.label }}</span>
            </button>
            <button
                v-else
                type="button"
                class="sidebar-link"
                :class="{ 'sidebar-link-active': isItemActive(item) }"
                @click="navigateTo(item)"
            >
              <i :class="item.icon" aria-hidden="true" />
              <span>{{ item.label }}</span>
            </button>
          </li>
        </ul>
      </section>
    </nav>

    <footer class="sidebar-footer">
      <div class="sidebar-user">
        <div class="sidebar-avatar" aria-hidden="true">{{ userInitials }}</div>
        <div class="sidebar-user-info">
          <p class="sidebar-user-name">{{ currentUser?.name ?? 'Usuario' }}</p>
          <p class="sidebar-user-role">{{ currentUser?.email ?? '' }}</p>
        </div>
      </div>
      <button type="button" class="sidebar-logout" @click="logout">
        <i class="pi pi-sign-out" aria-hidden="true" />
        <span>Cerrar sesión</span>
      </button>
    </footer>
  </aside>
</template>
