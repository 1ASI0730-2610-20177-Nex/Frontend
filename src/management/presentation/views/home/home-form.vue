<script setup>
import {useRoute, useRouter} from "vue-router";
import useManagementStore from "../../../application/management.store.js";
import {computed, onMounted, ref, toRefs} from "vue";
import {HomeEntity} from "../../../domain/model/home.entity.js";

const route = useRoute();
const router = useRouter();

const store = useManagementStore();
const {errors, addHome, updateHome} = store;

const form = ref({name: '',type:''});
const isEdit = computed(() => !!route.params.id);


function getHomeById(id) {
  return store.getHomeById(id);
}

onMounted(() => {
  console.log(route.params.id);
  if (isEdit.value) {
    const home = getHomeById(route.params.id);
    console.log(home);
    if (home) { form.value.name = home.name;
                form.value.type = home.type;  }
      else router.push({name: 'publishing-categories'});
  }
});


const saveHome = () => {
  const home = new HomeEntity({
    id: isEdit.value ? route.params.id : null,
    name: form.value.name,
    type: form.value.type,
  });
  if (isEdit.value) updateHome(home); else addHome(home);
  navigateBack();
};

const navigateBack = () => {
  router.push({name: 'management-homes'});
};
</script>

<template>
  <div class="p-4">
    <h1>{{ isEdit ? 'Edit Home' : 'New Home' }}</h1>

    <form @submit.prevent="saveHome">
      <div class="field mb-3">
        <label for="name">Name</label>
        <pv-input-text
            id="name"
            v-model="form.name"
            class="w-full"
            required/>
      </div>

      <div class="field mb-3">
        <label for="type">Type</label>
        <pv-input-text
            id="type"
            v-model="form.type"
            class="w-full"
            required/>
      </div>

      <pv-button
          label="Save"
          icon="pi pi-save"
          type="submit"/>

      <pv-button
          label="Cancel"
          class="ml-2"
          severity="secondary"
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