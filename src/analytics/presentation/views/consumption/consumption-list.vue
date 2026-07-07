<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import useAnalyticsStore from '../../../application/analytics.store.js';
import useManagementStore from '../../../../management/application/management.store.js';
import { useUiPreferences } from '../../../../shared/application/ui-preferences.js';

const router = useRouter();
const analyticsStore = useAnalyticsStore();
const managementStore = useManagementStore();
const { t } = useUiPreferences();
const { consumptions, consumptionsLoaded, errors } = storeToRefs(analyticsStore);
const { fetchConsumptions, deleteConsumption } = analyticsStore;
const { fetchDevices } = managementStore;

const page = ref(0);
const rows = ref(5);
const sortField = ref('id');
const sortOrder = ref(1);
const filterDeviceId = ref('');

onMounted(() => {
  if (!managementStore.devicesLoaded) fetchDevices();
  if (!analyticsStore.consumptionsLoaded) fetchConsumptions();
});

const deviceName = (deviceId) => {
  const device = managementStore.getDeviceById(deviceId);
  return device ? device.name : t.value.deviceFallback(deviceId);
};

const filteredConsumptions = computed(() => {
  if (!filterDeviceId.value) return consumptions.value;
  const id = parseInt(filterDeviceId.value);
  return consumptions.value.filter(c => c.deviceId === id);
});

const sortedConsumptions = computed(() => {
  const list = [...filteredConsumptions.value];
  list.sort((a, b) => {
    const av = a[sortField.value];
    const bv = b[sortField.value];
    if (av < bv) return -sortOrder.value;
    if (av > bv) return sortOrder.value;
    return 0;
  });
  return list;
});

const pageConsumptions = computed(() => {
  const start = page.value * rows.value;
  return sortedConsumptions.value.slice(start, start + rows.value);
});

const totalPages = computed(() => Math.max(1, Math.ceil(sortedConsumptions.value.length / rows.value)));

const toggleSort = (field) => {
  if (sortField.value === field) sortOrder.value *= -1;
  else {
    sortField.value = field;
    sortOrder.value = 1;
  }
};

const navigateToNew = () => router.push({ name: 'analytics-consumption-new' });
const navigateToEdit = (id) => router.push({ name: 'analytics-consumption-edit', params: { id } });
const navigateToDeviceAnalytics = () => router.push({ name: 'analytics-devices' });

const confirmDelete = (consumption) => {
  if (window.confirm(t.value.confirmDeleteConsumption(consumption.date))) {
    deleteConsumption(consumption);
  }
};

const prevPage = () => {
  if (page.value > 0) page.value -= 1;
};

const nextPage = () => {
  if (page.value < totalPages.value - 1) page.value += 1;
};

watch(() => filteredConsumptions.value.length, () => {
  const lastPage = Math.max(0, totalPages.value - 1);
  if (page.value > lastPage) page.value = lastPage;
});

watch(filterDeviceId, () => {
  page.value = 0;
});
</script>

<template>
  <section class="page">
    <header class="page-head">
      <h1 class="page-title">{{ t.consumptions }}</h1>
      <div class="page-head-actions">
        <button type="button" class="btn btn-secondary" @click="navigateToDeviceAnalytics">{{ t.byDevice }}</button>
        <button type="button" class="btn btn-primary" @click="navigateToNew">{{ t.newRecord }}</button>
      </div>
    </header>

    <div class="card consumption-card">
      <div class="card-toolbar consumption-toolbar">
        <div class="filter-field">
          <label class="form-label" for="filter-device">{{ t.filterByDevice }}</label>
          <select id="filter-device" v-model="filterDeviceId" class="form-select">
            <option value="">{{ t.allDevices }}</option>
            <option v-for="device in managementStore.devices" :key="device.id" :value="device.id">{{ device.name }}</option>
          </select>
        </div>
        <p v-if="consumptionsLoaded" class="filter-summary">
          {{ filteredConsumptions.length }} {{ t.records }}
        </p>
      </div>

      <div v-if="!consumptionsLoaded" class="table-loading">{{ t.loadingConsumptions }}</div>

      <div v-else class="table-wrap">
        <table class="table">
          <thead>
          <tr>
            <th @click="toggleSort('id')">ID</th>
            <th @click="toggleSort('deviceId')">{{ t.device }}</th>
            <th @click="toggleSort('kwh')">kWh</th>
            <th @click="toggleSort('date')">{{ t.date }}</th>
            <th>{{ t.actions }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="!pageConsumptions.length">
            <td colspan="5" class="table-empty">{{ t.noConsumptions }}</td>
          </tr>
          <tr v-for="consumption in pageConsumptions" :key="consumption.id">
            <td>{{ consumption.id }}</td>
            <td>{{ deviceName(consumption.deviceId) }}</td>
            <td>{{ consumption.kwh }}</td>
            <td>{{ consumption.date }}</td>
            <td>
              <div class="table-actions">
                <button type="button" class="btn btn-ghost btn-icon" :title="t.change" @click="navigateToEdit(consumption.id)">✎</button>
                <button type="button" class="btn btn-danger btn-icon" :title="t.actions" @click="confirmDelete(consumption)">✕</button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <footer v-if="consumptionsLoaded" class="paginator">
        <span>{{ t.page }} {{ page + 1 }} {{ t.of }} {{ totalPages }}</span>
        <div class="paginator-btns">
          <button type="button" class="btn btn-secondary" :disabled="page === 0" @click="prevPage">{{ t.previous }}</button>
          <button type="button" class="btn btn-secondary" :disabled="page >= totalPages - 1" @click="nextPage">{{ t.next }}</button>
        </div>
      </footer>
    </div>

    <div v-if="errors.length" class="alert-error">
      {{ errors.map((e) => e.message).join(', ') }}
    </div>
  </section>
</template>

<style scoped>
.consumption-card { margin-top: 0.25rem; }
.consumption-toolbar { row-gap: 1rem; }
.filter-summary {
  margin: 0;
  padding: 0.55rem 0.85rem;
  border-radius: var(--radius-control);
  background: var(--color-surface-card);
  border: 1px solid var(--color-border-default);
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  white-space: nowrap;
  flex-shrink: 0;
  align-self: flex-end;
}
.consumption-card .table-wrap { margin: 0; }
.consumption-card .paginator {
  margin-top: 0;
  padding: 1rem 1.5rem;
  background: var(--color-background-main);
}
@media (max-width: 520px) {
  .consumption-toolbar { flex-direction: column; align-items: stretch; }
  .filter-field { max-width: none; }
  .filter-summary { align-self: flex-start; text-align: center; }
}
</style>
