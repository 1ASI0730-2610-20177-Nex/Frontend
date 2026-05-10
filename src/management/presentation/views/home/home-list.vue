<script setup>
import {useRouter} from "vue-router";
import {useConfirm} from "primevue";
import useManagementStore from "../../../application/management.store.js";
import {onMounted, toRefs} from "vue";

const router = useRouter();
const confirm = useConfirm();

const store = useManagementStore();

const {homes, errors, homesLoaded} = toRefs(store);

const {fetchHomes, deleteHome} = store;

onMounted(() => {
  if (!store.homesLoaded) {
    fetchHomes();
    homesLoaded.value = store.homesLoaded;
  }
});

const navigateToNew = () => {
  router.push({name: 'management-home-new'});
};

const navigateToEdit = (id) => {
  router.push({
    name: 'management-home-edit',
    params: {id}
  });
};

const confirmDelete = (home) => {
  confirm.require({
    message: `Are you sure you want to delete ${home.name}?`,
    header: 'Delete Home',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      deleteHome(home);
    },
  });
};
</script>

<template>
  <div class="p-4">
    <h1>Homes</h1>

    <pv-button label="New Home" class="mb-3" icon="pi pi-plus" @click="navigateToNew"/>

    <pv-data-table
        :loading="!homesLoaded"
        :rows="5"
        :rows-per-page-options="[5, 10, 20]"
        :value="homes"
        paginator
        striped-rows
        table-style="min-width: 50rem">

      <pv-column header="ID" field="id" sortable/>
      <pv-column header="Name" field="name" sortable/>

      <pv-column header="Actions">
        <template #body="slotProps">
          <pv-button icon="pi pi-pencil" text rounded  @click="navigateToEdit(slotProps.data.id)"/>
          <pv-button icon="pi pi-trash" text rounded severity="danger"  @click="confirmDelete(slotProps.data)"/>
        </template>
      </pv-column>
    </pv-data-table>

    <div v-if="errors.length" class="text-red-500 mt-3">
      Errors:
      {{ errors.map(e => e.message).join(', ') }}
    </div>

    <pv-confirm-dialog/>
  </div>
</template>

<style scoped>

</style>