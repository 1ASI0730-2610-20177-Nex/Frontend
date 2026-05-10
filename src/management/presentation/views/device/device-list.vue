<script setup>
import {useRouter} from "vue-router";
import {useConfirm} from "primevue";
import useManagementStore from "../../../application/management.store.js";
import {onMounted, toRefs} from "vue";

const router = useRouter();
const confirm = useConfirm();

const store = useManagementStore();

const {devices, devicesLoaded, errors} = toRefs(store);

const {fetchDevices, deleteDevice} = store;

onMounted(() => {
  if (!store.devicesLoaded) {
    fetchDevices();
    devicesLoaded.value = store.devicesLoaded;
  }
});

const navigateToNew = () => {
  router.push({name: 'management-devices-new'});
};

const navigateToEdit = (id) => {
  console.log(id);

  router.push({
    name: 'management-device-edit',
    params: {id}
  });
};

const confirmDelete = (device) => {
  confirm.require({
    message: `Are you sure you want to delete ${device.name}?`,
    header: 'Delete Device',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      deleteDevice(device);
    },
  });
};
</script>

<template>
  <div class="p-4">
    <h1>Devices</h1>

    <pv-button
        label="New Device"
        icon="pi pi-plus"
        class="mb-3"
        @click="navigateToNew"/>

    <pv-data-table
        :value="devices"
        :loading="!devicesLoaded"
        striped-rows
        table-style="min-width: 50rem"
        paginator
        :rows="5"
        :rows-per-page-options="[5, 10, 20]">

      <pv-column
          field="id"
          header="ID"
          sortable/>

      <pv-column
          field="name"
          header="Name"
          sortable/>

      <pv-column
          field="description"
          header="Description"/>

      <pv-column
          field="homeId"
          header="Home ID"/>

      <pv-column header="Actions">
        <template #body="slotProps">
          <pv-button
              icon="pi pi-pencil"
              text
              rounded
              @click="navigateToEdit(slotProps.data.id)"/>

          <pv-button
              icon="pi pi-trash"
              text
              rounded
              severity="danger"
              @click="confirmDelete(slotProps.data)"/>
        </template>
      </pv-column>
    </pv-data-table>

    <div
        v-if="errors.length"
        class="text-red-500 mt-3">

      Errors:
      {{ errors.map(e => e.message).join(', ') }}
    </div>

    <pv-confirm-dialog/>
  </div>
</template>

<style scoped>

</style>