<script setup>
import { computed, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUiPreferences } from '../../application/ui-preferences.js';

const router = useRouter();
const route = useRoute();
const { t } = useUiPreferences();

const menuGroups = computed(() => [
  {
    id: 'management',
    label: t.value.management,
    items: [
      { label: t.value.homes, to: '/management/homes' },
      { label: t.value.devices, to: '/management/devices' },
    ],
  },
  {
    id: 'analytics',
    label: t.value.analytics,
    items: [
      { label: t.value.consumptions, to: '/analytics/consumptions' },
      { label: t.value.byDevice, to: '/analytics/devices' },
    ],
  },
  {
    id: 'payments',
    label: t.value.payments,
    items: [
      { label: t.value.plan, to: '/payments/plan' },
    ],
  },
]);

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

const currentUserName = computed(() => {
  try {
    const session = JSON.parse(localStorage.getItem('electrocorp-auth') || '{}');
    return session.name || session.email || t.value.userFallback;
  } catch (error) {
    return t.value.userFallback;
  }
});

const logout = () => {
  localStorage.removeItem('electrocorp-auth');
  router.push({ name: 'Login' });
};

watch(
  () => route.path,
  () => {
    menuGroups.value.forEach((group) => {
      if (isGroupActive(group)) expandedGroups[group.id] = true;
    });
  },
  { immediate: true }
);
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <span class="sidebar-logo-icon">⚡</span>
      <p class="sidebar-brand">{{ t.appName }}</p>
    </div>

    <nav class="sidebar-nav" aria-label="Main navigation">
      <button
        type="button"
        class="sidebar-link"
        :class="{ 'sidebar-link-active': route.path === '/home' }"
        @click="router.push('/home')"
      >
        {{ t.home }}
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
      <p class="sidebar-user-name">{{ currentUserName }}</p>
      <button type="button" class="sidebar-logout" @click="logout">
        {{ t.logout }}
      </button>
    </footer>
  </aside>
</template>
