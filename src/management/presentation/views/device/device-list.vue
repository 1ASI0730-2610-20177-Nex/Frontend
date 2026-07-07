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

const statusClass = (status) => {
  if (status === 'on') return 'badge badge-success';
  if (status === 'off') return 'badge badge-neutral';
  return 'badge badge-warning';
};

const statusLabel = (status) => {
  if (status === 'on') return 'Encendido';
  if (status === 'off') return 'Apagado';
  return status;
};

const navigateToNew = () => router.push({ name: 'management-devices-new' });
const navigateToEdit = (id) =>
    router.push({ name: 'management-devices-edit', params: { id } });

const confirmDelete = (device) => {
  if (window.confirm(`¿Eliminar el dispositivo "${device.name}"?`)) {
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
      <div>
        <h1 class="page-title">Dispositivos</h1>
        <p class="page-subtitle">Administra los equipos conectados en tus espacios.</p>
      </div>
      <button type="button" class="btn btn-primary" @click="navigateToNew">
        <i class="pi pi-plus" aria-hidden="true" />
        Nuevo dispositivo
      </button>
    </header>

    <div class="card">
      <div v-if="!devicesLoaded" class="table-loading">Cargando dispositivos…</div>

      <div v-else class="table-wrap">
        <table class="table">
          <thead>
          <tr>
            <th @click="toggleSort('id')">ID</th>
            <th @click="toggleSort('name')">Nombre</th>
            <th @click="toggleSort('type')">Tipo</th>
            <th @click="toggleSort('status')">Estado</th>
            <th @click="toggleSort('homeId')">Espacio</th>
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="!pageDevices.length">
            <td colspan="6" class="table-empty">No hay dispositivos registrados.</td>
          </tr>
          <tr v-for="device in pageDevices" :key="device.id">
            <td>{{ device.id }}</td>
            <td><strong>{{ device.name }}</strong></td>
            <td>{{ device.type }}</td>
            <td>
              <span :class="statusClass(device.status)">{{ statusLabel(device.status) }}</span>
            </td>
            <td>{{ device.spaceId ?? device.homeId }}</td>
            <td>
              <div class="table-actions">
                <button
                    type="button"
                    class="btn btn-ghost btn-icon"
                    title="Editar"
                    @click="navigateToEdit(device.id)"
                >
                  <i class="pi pi-pencil" aria-hidden="true" />
                </button>
                <button
                    type="button"
                    class="btn btn-danger btn-icon"
                    title="Eliminar"
                    @click="confirmDelete(device)"
                >
                  <i class="pi pi-trash" aria-hidden="true" />
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <footer v-if="devicesLoaded" class="paginator">
        <span>Página {{ page + 1 }} de {{ totalPages }}</span>
        <div class="paginator-btns">
          <button
              type="button"
              class="btn btn-secondary"
              :disabled="page === 0"
              @click="prevPage"
          >
            Anterior
          </button>
          <button
              type="button"
              class="btn btn-secondary"
              :disabled="page >= totalPages - 1"
              @click="nextPage"
          >
            Siguiente
          </button>
        </div>
      </footer>
    </div>

    <div v-if="errors.length" class="alert-error">
      {{ errors.map((e) => e.message).join(', ') }}
    </div>
  </section>
</template>
