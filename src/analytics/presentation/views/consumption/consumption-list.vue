<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import useAnalyticsStore from '../../../application/analytics.store.js';
import useManagementStore from '../../../../management/application/management.store.js';

const router = useRouter();
const analyticsStore = useAnalyticsStore();
const managementStore = useManagementStore();
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
  return device ? device.name : `Device #${deviceId}`;
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

const totalPages = computed(() =>
    Math.max(1, Math.ceil(sortedConsumptions.value.length / rows.value))
);

const toggleSort = (field) => {
  if (sortField.value === field) sortOrder.value *= -1;
  else {
    sortField.value = field;
    sortOrder.value = 1;
  }
};

const navigateToNew = () => router.push({ name: 'analytics-consumption-new' });
const navigateToEdit = (id) =>
    router.push({ name: 'analytics-consumption-edit', params: { id } });
const navigateToDeviceAnalytics = () =>
    router.push({ name: 'analytics-devices' });

const confirmDelete = (consumption) => {
  if (window.confirm(`Delete consumption record from ${consumption.date}?`)) {
    deleteConsumption(consumption);
  }
};

const prevPage = () => {
  if (page.value > 0) page.value -= 1;
};

const nextPage = () => {
  if (page.value < totalPages.value - 1) page.value += 1;
};

watch(
    () => filteredConsumptions.value.length,
    () => {
      const lastPage = Math.max(0, totalPages.value - 1);
      if (page.value > lastPage) page.value = lastPage;
    }
);

watch(filterDeviceId, () => {
  page.value = 0;
});
</script>

<template>
  <section class="page">
    <header class="page-head">
      <h1 class="page-title">Consumptions</h1>
      <div class="page-head-actions">
        <button type="button" class="btn btn-secondary" @click="navigateToDeviceAnalytics">
          By Device
        </button>
        <button type="button" class="btn btn-primary" @click="navigateToNew">
          New Record
        </button>
      </div>
    </header>

    <div class="card">
      <div class="card-toolbar">
        <div class="filter-field">
          <label class="form-label" for="filter-device">Filter by device</label>
          <select id="filter-device" v-model="filterDeviceId" class="form-select">
            <option value="">All devices</option>
            <option
                v-for="device in managementStore.devices"
                :key="device.id"
                :value="device.id"
            >
              {{ device.name }}
            </option>
          </select>
        </div>
        <p v-if="consumptionsLoaded" class="filter-summary">
          {{ filteredConsumptions.length }} record(s)
        </p>
      </div>

      <div v-if="!consumptionsLoaded" class="table-loading">Loading consumptions…</div>

      <div v-else class="table-wrap">
        <table class="table">
          <thead>
          <tr>
            <th @click="toggleSort('id')">ID</th>
            <th @click="toggleSort('deviceId')">Device</th>
            <th @click="toggleSort('kwh')">kWh</th>
            <th @click="toggleSort('date')">Date</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="!pageConsumptions.length">
            <td colspan="5" class="table-empty">No consumption records found.</td>
          </tr>
          <tr v-for="consumption in pageConsumptions" :key="consumption.id">
            <td>{{ consumption.id }}</td>
            <td>{{ deviceName(consumption.deviceId) }}</td>
            <td>{{ consumption.kwh }}</td>
            <td>{{ consumption.date }}</td>
            <td>
              <div class="table-actions">
                <button
                    type="button"
                    class="btn btn-ghost btn-icon"
                    title="Edit"
                    @click="navigateToEdit(consumption.id)"
                >
                  ✎
                </button>
                <button
                    type="button"
                    class="btn btn-danger btn-icon"
                    title="Delete"
                    @click="confirmDelete(consumption)"
                >
                  ✕
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <footer v-if="consumptionsLoaded" class="paginator">
        <span>Page {{ page + 1 }} of {{ totalPages }}</span>
        <div class="paginator-btns">
          <button
              type="button"
              class="btn btn-secondary"
              :disabled="page === 0"
              @click="prevPage"
          >
            Previous
          </button>
          <button
              type="button"
              class="btn btn-secondary"
              :disabled="page >= totalPages - 1"
              @click="nextPage"
          >
            Next
          </button>
        </div>
      </footer>
    </div>

    <div v-if="errors.length" class="alert-error">
      {{ errors.map((e) => e.message).join(', ') }}
    </div>
  </section>
</template>

<style scoped>
.filter-summary {
  margin: 0;
  padding-bottom: 0.15rem;
  font-size: var(--font-size-caption);
  color: var(--color-text-secondary);
  flex: 0 0 auto;
  align-self: flex-end;
}
</style>
