<script setup>
import { ref } from "vue";

const items = ref([
  {separator: true},
  {label:'Management',items:[
      {label: 'Home', icon: 'pi pi-fw pi-home', to: '/management/home'},
      {label: 'Devices', icon: 'pi pi-fw pi-desktop', to: '/management/devices'},
    ]},
  {label:'Consumption',items:[
      {label: 'Analytics', icon: 'pi pi-chart-line', to: '/consumption/analytics'},
    ]}
])

import logo from '../assets/logo-electrocorp.png'
</script>

<template>
  <div class="sidebar">
    <pv-menu :model="items" class="pv-menu">
        <template #start>
                <span class="menu-header">
                    <img :src=logo width="35" height="40" alt="logo" />
                    <p class="logo" >ElectroCorp</p>
                </span>
        </template>

        <template #submenulabel="{ item }">
          <span class="text-primary font-bold">{{ item.label }}</span>
        </template>

        <template #item="{ item, props }">
          <a v-ripple class="flex items-center" v-bind="props.action">
            <span :class="item.icon" />
            <span>{{ item.label }}</span>
          </a>
        </template>

        <template #end>
          <pv-button v-ripple class="menu-end">
            <span class="font-bold">Amy Elsner</span>
            <span class="text-sm">Admin</span>
          </pv-button>
        </template>


    </pv-menu>
  </div>

</template>

<style scoped>
.sidebar{
  height: 100vh;
  width: 250px;
}
:deep(.p-menu){
  border: none;
  border-right: 1px solid #e5e7eb;
  border-radius: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.menu-header{
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  font-size: 1.2rem;
  font-weight: 600;
}
.menu-end{
  display: flex;
  flex-direction: column;
  margin-top:  auto;
  width: 100%;
  height: 60px;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  justify-content: end;
}
.pv-menu{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

</style>