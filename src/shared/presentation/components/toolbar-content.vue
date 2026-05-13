<script setup>
import { ref } from "vue";

const items = [
  { label: 'Home',                  to: '/home' },
  { label: 'Management Home',       to: '/management/homes' },
  { label: 'Management Devices',    to: '/management/devices' },
  { label: 'Consumption Analytics', to: '/consumption/analytics' }
];

import logo from '../assets/logo-electrocorp.png'
</script>

<template>
  <pv-toast/>
  <pv-confirm-dialog/>

  <div class="header">
    <pv-toolbar class="bg-primary">
      <template #start>
        <h3>Electrocorp</h3>
      </template>

      <template #center>
      </template>

      <template #end>
        <div class="flex-column mr-3">
          <pv-button v-for="item in items" :key="item.label" as-child v-slot="slotProps">
            <router-link :to="item.to" :class="slotProps['class']">{{ item.label }}</router-link>
          </pv-button>
        </div>
      </template>
    </pv-toolbar>

  </div>

  <div class="main-content">
    <router-view/>
  </div>


</template>

<style scoped>
.header {
  position: absolute;
  left: 0;
  top:0;
  width:100%;
}

.main-content {
  margin-top: 60px;
}


</style>