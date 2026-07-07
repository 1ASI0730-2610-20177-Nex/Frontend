<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useManagementStore from '../../../application/management.store.js';
import { DeviceEntity } from '../../../domain/model/device.entity.js';
import { useUiPreferences } from '../../../../shared/application/ui-preferences.js';

const route = useRoute();
const router = useRouter();
const store = useManagementStore();
const { t } = useUiPreferences();
const { errors, homes, updateDevice, addDevice, fetchHomes } = store;

const form = ref({
  name: '',
  type: '',
  powerWatts: null,
  status: '',
  homeId: null,
});

const isEdit = computed(() => !!route.params.id);
const statusOptions = ['on', 'off'];

onMounted(() => {
  if (!homes.length) fetchHomes();
  if (isEdit.value) {
    const device = store.getDeviceById(route.params.id);
    if (device) {
      form.value.name = device.name;
      form.value.type = device.type;
      form.value.powerWatts = device.powerWatts;
      form.value.status = device.status;
      form.value.homeId = device.homeId;
    } else router.push({ name: 'management-devices' });
  }
});

const saveDevice = () => {
  const device = new DeviceEntity({
    id: isEdit.value ? route.params.id : null,
    name: form.value.name,
    type: form.value.type,
    powerWatts: Number(form.value.powerWatts),
    status: form.value.status,
    homeId: form.value.homeId,
  });
  if (isEdit.value) updateDevice(device);
  else addDevice(device);
  navigateBack();
};

const navigateBack = () => router.push({ name: 'management-devices' });
</script>

<template>
  <section class="page">
    <header class="page-head">
      <h1 class="page-title">{{ isEdit ? t.editDevice : t.newDevice }}</h1>
    </header>

    <form class="form card" @submit.prevent="saveDevice">
      <div class="form-field">
        <label class="form-label" for="name">{{ t.name }}</label>
        <input id="name" v-model="form.name" class="form-input" type="text" required />
      </div>

      <div class="form-field">
        <label class="form-label" for="type">{{ t.type }}</label>
        <input id="type" v-model="form.type" class="form-input" type="text" required />
      </div>

      <div class="form-field">
        <label class="form-label" for="powerWatts">{{ t.powerWatts }}</label>
        <input id="powerWatts" v-model.number="form.powerWatts" class="form-input" type="number" min="0" required />
      </div>

      <div class="form-field">
        <label class="form-label" for="status">{{ t.status }}</label>
        <select id="status" v-model="form.status" class="form-select" required>
          <option disabled value="">{{ t.selectStatus }}</option>
          <option v-for="opt in statusOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>

      <div class="form-field">
        <label class="form-label" for="home">{{ t.homeLabel }}</label>
        <select id="home" v-model="form.homeId" class="form-select" required>
          <option disabled :value="null">{{ t.selectHome }}</option>
          <option v-for="home in homes" :key="home.id" :value="home.id">{{ home.name }}</option>
        </select>
      </div>

      <div class="btn-row">
        <button type="submit" class="btn btn-primary">{{ t.save }}</button>
        <button type="button" class="btn btn-secondary" @click="navigateBack">{{ t.cancel }}</button>
      </div>
    </form>

    <div v-if="errors.length" class="alert-error">
      {{ errors.map((e) => e.message).join(', ') }}
    </div>
  </section>
</template>
