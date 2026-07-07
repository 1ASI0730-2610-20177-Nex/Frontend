<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import useManagementStore from '../../../application/management.store.js';

const router = useRouter();
const store = useManagementStore();
const { homes, errors, homesLoaded } = storeToRefs(store);
const { fetchHomes } = store;

const page = ref(0);
const rows = ref(5);
const sortField = ref('id');
const sortOrder = ref(1);

onMounted(() => {
  if (!store.homesLoaded) fetchHomes();
});

const sortedHomes = computed(() => {
  const list = [...homes.value];
  list.sort((a, b) => {
    const av = a[sortField.value];
    const bv = b[sortField.value];
    if (av < bv) return -sortOrder.value;
    if (av > bv) return sortOrder.value;
    return 0;
  });
  return list;
});

const pageHomes = computed(() => {
  const start = page.value * rows.value;
  return sortedHomes.value.slice(start, start + rows.value);
});

const totalPages = computed(() =>
    Math.max(1, Math.ceil(sortedHomes.value.length / rows.value))
);

const toggleSort = (field) => {
  if (sortField.value === field) sortOrder.value *= -1;
  else {
    sortField.value = field;
    sortOrder.value = 1;
  }
};

const navigateToNew = () => router.push({ name: 'management-home-new' });

const prevPage = () => {
  if (page.value > 0) page.value -= 1;
};

const nextPage = () => {
  if (page.value < totalPages.value - 1) page.value += 1;
};

watch(
    () => homes.value.length,
    () => {
      const lastPage = Math.max(0, totalPages.value - 1);
      if (page.value > lastPage) page.value = lastPage;
    }
);
</script>

<template>
  <section class="page">
    <header class="page-head">
      <h1 class="page-title">Propiedades</h1>
      <button type="button" class="btn btn-primary" @click="navigateToNew">
        <i class="pi pi-plus" aria-hidden="true" />
        Nueva propiedad
      </button>
    </header>

    <div class="card">
      <div v-if="!homesLoaded" class="table-loading">Cargando propiedades…</div>

      <div v-else class="table-wrap">
        <table class="table">
          <thead>
          <tr>
            <th @click="toggleSort('id')">ID</th>
            <th @click="toggleSort('name')">Nombre</th>
            <th @click="toggleSort('type')">Tipo</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="!pageHomes.length">
            <td colspan="3" class="table-empty">No hay propiedades registradas.</td>
          </tr>
          <tr v-for="home in pageHomes" :key="home.id">
            <td>{{ home.id }}</td>
            <td>{{ home.name }}</td>
            <td>{{ home.type }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <footer v-if="homesLoaded" class="paginator">
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
