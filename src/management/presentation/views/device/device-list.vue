<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import useManagementStore from '../../../application/management.store.js';

const router = useRouter();
const store = useManagementStore();
const { devices, devicesLoaded, errors } = storeToRefs(store);
const { fetchDevices, deleteDevice } = store;

const page = ref(0);
const rows = ref(5);
const sortField = ref('id');
const sortOrder = ref(1);

onMounted(() => {
  if (!store.devicesLoaded) fetchDevices();
});

const sortedDevices = computed(() => {
  const list = [...devices.value];
  list.sort((a, b) => {
    const av = a[sortField.value];
    const bv = b[sortField.value];
    if (av < bv) return -sortOrder.value;
    if (av > bv) return sortOrder.value;
    return 0;
  });
  return list;
});

const pageDevices = computed(() => {
  const start = page.value * rows.value;
  return sortedDevices.value.slice(start, start + rows.value);
});

const totalPages = computed(() =>
    Math.max(1, Math.ceil(sortedDevices.value.length / rows.value))
);

const toggleSort = (field) => {
  if (sortField.value === field) sortOrder.value *= -1;
  else {
    sortField.value = field;
    sortOrder.value = 1;
  }
};

const navigateToNew = () => router.push({ name: 'management-devices-new' });
const navigateToEdit = (id) =>
    router.push({ name: 'management-devices-edit', params: { id } });

const confirmDelete = (device) => {
  if (window.confirm(`Are you sure you want to delete ${device.name}?`)) {
    deleteDevice(device);
  }
};

const prevPage = () => {
  if (page.value > 0) page.value -= 1;
};

const nextPage = () => {
  if (page.value < totalPages.value - 1) page.value += 1;
};

watch(
    () => devices.value.length,
    () => {
      const lastPage = Math.max(0, totalPages.value - 1);
      if (page.value > lastPage) page.value = lastPage;
    }
);
</script>

<template>
  <section class="page">
    <header class="page-head">
      <h1 class="page-title">Devices</h1>
      <button type="button" class="btn btn-primary" @click="navigateToNew">
        New Device
      </button>
    </header>

    <div class="card">
      <div v-if="!devicesLoaded" class="table-loading">Loading devices…</div>

      <div v-else class="table-wrap">
        <table class="table">
          <thead>
          <tr>
            <th @click="toggleSort('id')">ID</th>
            <th @click="toggleSort('name')">Name</th>
            <th @click="toggleSort('description')">Description</th>
            <th @click="toggleSort('homeId')">Home ID</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="!pageDevices.length">
            <td colspan="5" class="table-empty">No devices found.</td>
          </tr>
          <tr v-for="device in pageDevices" :key="device.id">
            <td>{{ device.id }}</td>
            <td>{{ device.name }}</td>
            <td>{{ device.description }}</td>
            <td>{{ device.homeId }}</td>
            <td>
              <div class="table-actions">
                <button
                    type="button"
                    class="btn btn-ghost btn-icon"
                    title="Edit"
                    @click="navigateToEdit(device.id)"
                >
                  ✎
                </button>
                <button
                    type="button"
                    class="btn btn-danger btn-icon"
                    title="Delete"
                    @click="confirmDelete(device)"
                >
                  ✕
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <footer v-if="devicesLoaded" class="paginator">
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
