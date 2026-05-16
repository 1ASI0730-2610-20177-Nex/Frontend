<script setup>
import { reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const menuGroups = [
  {
    id: 'management',
    label: 'Management Home',
    items: [
      { label: 'Homes', to: '/management/homes' },
      { label: 'Devices', to: '/management/devices' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    items: [
      { label: 'Consumptions', to: '/analytics/consumptions' },
      { label: 'By Device', to: '/analytics/devices' },
    ],
  },
  {
    id: 'payments',
    label: 'Payments',
    items: [
      { label: 'Payments', to: '/payments/plan' },
    ],
  },
];

const expandedGroups = reactive({
  management: false,
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
  router.push({ name: 'Home' });
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
      <p class="sidebar-brand">ElectroCorp</p>
    </div>

    <nav class="sidebar-nav" aria-label="Main navigation">
      <button
          type="button"
          class="sidebar-link"
          :class="{ 'sidebar-link-active': route.path === '/home' }"
          @click="router.push('/home')"
      >
        Home
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
          <span class="sidebar-group-label">{{ group.label }}</span>
          <span
              class="sidebar-chevron"
              :class="{ 'sidebar-chevron-open': expandedGroups[group.id] }"
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
                title="Coming soon"
            >
              {{ item.label }}
            </button>
            <button
                v-else
                type="button"
                class="sidebar-link"
                :class="{ 'sidebar-link-active': isItemActive(item) }"
                @click="navigateTo(item)"
            >
              {{ item.label }}
            </button>
          </li>
        </ul>
      </section>
    </nav>

    <footer class="sidebar-footer">
      <p class="sidebar-user-name">Osamu Dazai</p>
      <button type="button" class="sidebar-logout" @click="logout">
        Logout
      </button>
    </footer>
  </aside>
</template>
