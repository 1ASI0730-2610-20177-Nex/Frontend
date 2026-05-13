<script setup>
import {useRoute, useRouter} from "vue-router";
import useManagementStore from "../../../application/management.store.js";
import {computed, onMounted, ref, toRefs} from "vue";
import {DeviceEntity} from "../../../domain/model/device.entity.js";

const route = useRoute();
const router = useRouter();

const store = useManagementStore();
const {errors, homes, updateDevice, addDevice, fetchHomes} = store;

const form = ref({
  name: '',
  type: '',
  powerWatts: null,
  status: '',
  homeId: null
});

const isEdit = computed(() => !!route.params.id);

onMounted(() => {
  if (!homes.length) fetchHomes();
  if (isEdit.value) {
    const device = getDeviceById(route.params.id);
    if (device) {
      form.value.name       = device.name;
      form.value.type       = device.type;
      form.value.powerWatts = device.powerWatts;
      form.value.status     = device.status;
      form.value.homeId     = device.homeId;
    } else router.push({name: 'management-devices'});
  }
});

function getDeviceById(id) {
  return store.getDeviceById(id);
}

const saveDevice = () => {

  const device = new DeviceEntity({
    id: isEdit.value ? route.params.id : null,
    name: form.value.name,
    type: form.value.type,
    powerWatts: Number(form.value.powerWatts),
    status: form.value.status,
    homeId: form.value.homeId,
  });

  if (isEdit.value) updateDevice(device); else addDevice(device);
  navigateBack();
};

const navigateBack = () => {
  router.push({name: 'management-devices'});
};
</script>

<template>
  <div class="p-4">
    <h1>{{ isEdit ? 'Edit Device' : 'New Device' }}</h1>

    <form @submit.prevent="saveDevice">
      <div class="field mb-3">
        <label for="name">Name</label>
        <pv-input-text
            id="name"
            v-model="form.name"
            required
            class="w-full"/>
      </div>

      <div class="field mb-3">
        <label for="type">Type</label>
        <pv-input-text
            id="type"
            v-model="form.type"
            required
            class="w-full"/>
      </div>

      <div class="field mb-3">
        <label for="powerWatts">Power Watts</label>
        <pv-input-number
            id="powerWatts"
            v-model="form.powerWatts"
            required
            class="w-full"/>
      </div>

      <div class="field mb-3">
        <label for="status">Status</label>
        <pv-select
            id="status"
            v-model="form.status"
            :options="['on', 'off']"
            placeholder="Select status"
            class="w-full"/>
      </div>

      <div class="field mb-3">
        <label for="home">Home</label>
        <pv-select
            id="home"
            v-model="form.homeId"
            :options="homes"
            optionLabel="name"
            optionValue="id"
            placeholder="Select a home"
            class="w-full"/>
      </div>

      <pv-button
          type="submit"
          label="Save"
          icon="pi pi-save"/>

      <pv-button
          label="Cancel"
          severity="secondary"
          class="ml-2"
          @click="navigateBack"/>
    </form>

    <div
        v-if="errors.length"
        class="text-red-500 mt-3">
      Errors:
      {{ errors.map(e => e.message).join(', ') }}
    </div>
  </div>
</template>

<style scoped>

</style>