<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import useManagementStore from '../../../application/management.store.js';
import { HomeEntity } from '../../../domain/model/home.entity.js';

const router = useRouter();
const store = useManagementStore();
const { errors, addHome } = store;

const form = ref({ name: '', type: '' });

const saveHome = () => {
  const home = new HomeEntity({
    name: form.value.name,
    type: form.value.type,
  });
  addHome(home);
  navigateBack();
};

const navigateBack = () => router.push({ name: 'management-homes' });
</script>

<template>
  <section class="page">
    <header class="page-head">
      <h1 class="page-title">New Property</h1>
    </header>

    <form class="form card" @submit.prevent="saveHome">
      <div class="form-field">
        <label class="form-label" for="name">Name</label>
        <input
            id="name"
            v-model="form.name"
            class="form-input"
            type="text"
            required
        />
      </div>

      <div class="form-field">
        <label class="form-label" for="type">Type</label>
        <input
            id="type"
            v-model="form.type"
            class="form-input"
            type="text"
            required
        />
      </div>

      <div class="btn-row">
        <button type="submit" class="btn btn-primary">Save</button>
        <button type="button" class="btn btn-secondary" @click="navigateBack">
          Cancel
        </button>
      </div>
    </form>

    <div v-if="errors.length" class="alert-error">
      {{ errors.map((e) => e.message).join(', ') }}
    </div>
  </section>
</template>
