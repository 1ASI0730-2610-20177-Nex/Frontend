<script setup>
import SidebarContent from '../components/sidebar-content.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

const pageTitle = computed(() => route.meta?.title ?? 'ElectroCorp');
</script>

<template>
  <div class="layout">
    <sidebar-content />
    <main class="layout-main">
      <header class="layout-topbar">
        <div class="layout-topbar-inner">
          <h2 class="layout-topbar-title">{{ pageTitle }}</h2>
        </div>
      </header>
      <div class="layout-body">
        <router-view />
      </div>
    </main>
  </div>
</template>
