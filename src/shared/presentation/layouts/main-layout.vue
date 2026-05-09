<script setup>
import {ref} from "vue";
import SidebarContent from "../components/sidebar-content.vue";

const drawer = ref(false);
const toggleDrawer = () => {
  drawer.value = !drawer.value;
}

const items = [
  {label: 'Home', to: '/home'},
  {label: 'option.categories', to: '/publishing/categories'},
  {label: 'option.tutorials', to: '/publishing/tutorials'}
];
</script>

<template>
      <sidebar-content></sidebar-content>
      <router-view></router-view>

</template>

<style scoped>

.main{
  display: flex;
  height: 100vh;
  width: 100vh;
}
</style>