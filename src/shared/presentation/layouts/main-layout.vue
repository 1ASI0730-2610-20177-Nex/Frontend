<script setup>
import SidebarContent from '../components/sidebar-content.vue';
</script>

<template>
  <div class="layout">
    <sidebar-content />
    <main class="layout-main layout-body">
      <router-view />
    </main>
  </div>
</template>
