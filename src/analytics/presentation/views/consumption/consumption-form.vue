<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useAnalyticsStore from '../../../application/analytics.store.js';
import useManagementStore from '../../../../management/application/management.store.js';
import { ConsumptionEntity } from '../../../domain/model/consumption.entity.js';
import { useUiPreferences } from '../../../../shared/application/ui-preferences.js';

const route = useRoute();
const router = useRouter();
const analyticsStore = useAnalyticsStore();
const managementStore = useManagementStore();
const { t } = useUiPreferences();
const { errors, fetchConsumptions } = analyticsStore;
const { fetchDevices } = managementStore;

const form = ref({ deviceId: null, kwh: null, date: '' });
const isEdit = computed(() => !!route.params.id);

onMounted(() => {
  if (!managementStore.devicesLoaded) fetchDevices();
  if (!analyticsStore.consumptionsLoaded) fetchConsumptions();

  if (isEdit.value) {
    const consumption = analyticsStore.getConsumptionById(route.params.id);
    if (consumption) {
      form.value.deviceId = consumption.deviceId;
      form.value.kwh = consumption.kwh;
      form.value.date = consumption.date;
    } else router.push({ name: 'analytics-consumptions' });
  }
});

const saveConsumption = () => {
  const consumption = new ConsumptionEntity({
    id: isEdit.value ? route.params.id : null,
    deviceId: Number(form.value.deviceId),
    kwh: Number(form.value.kwh),
    date: form.value.date,
  });
  if (isEdit.value) analyticsStore.updateConsumption(consumption);
  else analyticsStore.addConsumption(consumption);
  navigateBack();
};

const navigateBack = () => router.push({ name: 'analytics-consumptions' });
</script>

<template>
  <section class="page">
    <header class="page-head">
      <h1 class="page-title">{{ isEdit ? t.editConsumption : t.newConsumption }}</h1>
    </header>

    <form class="form card" @submit.prevent="saveConsumption">
      <div class="form-field">
        <label class="form-label" for="device">{{ t.device }}</label>
        <select id="device" v-model="form.deviceId" class="form-select" required>
          <option disabled :value="null">{{ t.selectDevice }}</option>
          <option v-for="device in managementStore.devices" :key="device.id" :value="device.id">{{ device.name }}</option>
        </select>
      </div>

      <div class="form-field">
        <label class="form-label" for="kwh">kWh</label>
        <input id="kwh" v-model.number="form.kwh" class="form-input" type="number" min="0" step="0.1" required />
      </div>

      <div class="form-field">
        <label class="form-label" for="date">{{ t.date }}</label>
        <input id="date" v-model="form.date" class="form-input" type="date" required />
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
