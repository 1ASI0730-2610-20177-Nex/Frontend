<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import useAnalyticsStore from '../../../application/analytics.store.js';
import useManagementStore from '../../../../management/application/management.store.js';

const router = useRouter();
const analyticsStore = useAnalyticsStore();
const managementStore = useManagementStore();
const { consumptionsByDevice, consumptionsLoaded, errors } = storeToRefs(analyticsStore);
const { fetchConsumptions } = analyticsStore;
const { fetchDevices } = managementStore;

onMounted(() => {
  if (!managementStore.devicesLoaded) fetchDevices();
  if (!analyticsStore.consumptionsLoaded) fetchConsumptions();
});

const deviceSummaries = computed(() => {
  return consumptionsByDevice.value
      .map((group) => {
        const device = managementStore.getDeviceById(group.deviceId);
        return {
          deviceId: group.deviceId,
          deviceName: device ? device.name : `Device #${group.deviceId}`,
          recordCount: group.records.length,
          totalKwh: group.totalKwh.toFixed(2),
          records: [...group.records].sort((a, b) => a.date.localeCompare(b.date)),
        };
      })
      .sort((a, b) => parseFloat(b.totalKwh) - parseFloat(a.totalKwh));
});

const navigateToConsumptions = () =>
    router.push({ name: 'analytics-consumptions' });
</script>

<template>
  <section class="page">
    <header class="page-head">
      <h1 class="page-title">Device Analytics</h1>
      <div class="page-head-actions">
        <button type="button" class="btn btn-secondary" @click="navigateToConsumptions">
          All Records
        </button>
      </div>
    </header>

    <div v-if="!consumptionsLoaded" class="card state-card">
      Loading analytics…
    </div>

    <div v-else-if="!deviceSummaries.length" class="card state-card">
      No consumption data available.
    </div>

    <div v-else class="analytics-grid">
      <article
          v-for="summary in deviceSummaries"
          :key="summary.deviceId"
          class="analytics-card"
      >
        <header class="analytics-card-head">
          <div class="analytics-card-info">
            <h2 class="analytics-card-title">{{ summary.deviceName }}</h2>
            <p class="analytics-card-meta">
              {{ summary.recordCount }} record(s)
            </p>
          </div>
          <span class="analytics-card-badge">{{ summary.totalKwh }} kWh</span>
        </header>

        <div class="analytics-card-body">
          <table class="analytics-table">
            <thead>
            <tr>
              <th>Date</th>
              <th class="col-kwh">kWh</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="record in summary.records" :key="record.id">
              <td>{{ record.date }}</td>
              <td class="col-kwh">{{ record.kwh }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>

    <div v-if="errors.length" class="alert-error">
      {{ errors.map((e) => e.message).join(', ') }}
    </div>
  </section>
</template>

<style scoped>
.state-card {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-secondary);
}

.analytics-grid {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.analytics-card {
  display: flex;
  flex-direction: column;
  background: var(--card-background);
  border: 1px solid var(--card-border);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.analytics-card:hover {
  box-shadow: 0 8px 24px var(--color-shadow-default);
  transform: translateY(-2px);
}

.analytics-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(
      135deg,
      var(--color-background-main) 0%,
      var(--color-brand-primary-soft) 100%
  );
  border-bottom: 1px solid var(--color-border-default);
}

.analytics-card-info {
  min-width: 0;
  flex: 1;
}

.analytics-card-title {
  margin: 0;
  font-size: 1rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  line-height: 1.3;
  word-break: break-word;
}

.analytics-card-meta {
  margin: 0.35rem 0 0;
  font-size: var(--font-size-caption);
  color: var(--color-text-secondary);
}

.analytics-card-badge {
  flex-shrink: 0;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: var(--color-brand-primary);
  color: var(--color-text-on-brand);
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  white-space: nowrap;
}

.analytics-card-body {
  padding: 0.25rem 0;
}

.analytics-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-caption);
}

.analytics-table th,
.analytics-table td {
  padding: 0.55rem 1.25rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border-default);
}

.analytics-table th {
  background: var(--color-surface-card);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.analytics-table tbody tr:nth-child(even) {
  background: var(--table-row-stripe);
}

.analytics-table tbody tr:last-child td {
  border-bottom: none;
}

.analytics-table tbody tr:hover {
  background: var(--table-row-hover);
}

.col-kwh {
  text-align: right;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}
</style>
