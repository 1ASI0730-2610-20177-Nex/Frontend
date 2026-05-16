<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { DEFAULT_PLAN_ID, getPlanById } from '../data/plans.data.js';

const route = useRoute();
const router = useRouter();

const selectedPlan = computed(() => {
  const planId = route.query.plan ?? DEFAULT_PLAN_ID;
  return getPlanById(planId);
});

const goToPlans = () => router.push({ name: 'payments-plans' });
</script>

<template>
  <section class="page">
    <header class="page-head">
      <h1 class="page-title">Payments</h1>
    </header>

    <p class="section-eyebrow">Plan seleccionado</p>

    <article class="current-plan-card">
      <p class="current-plan-label">Tu plan actual</p>
      <h2 class="current-plan-name">{{ selectedPlan.name }}</h2>

      <div class="plan-price">
        <span class="plan-price-currency">S/</span>
        <span class="plan-price-current">{{ selectedPlan.price.toFixed(2) }}</span>
        <span class="plan-price-original">S/ {{ selectedPlan.originalPrice.toFixed(2) }}</span>
      </div>

      <p class="current-plan-desc">{{ selectedPlan.description }}</p>

      <ul class="plan-card-features">
        <li v-for="feature in selectedPlan.features" :key="feature">
          {{ feature }}
        </li>
      </ul>

      <div class="page-head-actions">
        <button type="button" class="btn btn-secondary" @click="goToPlans">
          Cambiar
        </button>
      </div>
    </article>
  </section>
</template>

<style scoped>
.section-eyebrow {
  margin: 0 0 0.75rem;
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-secondary);
}

.current-plan-card .plan-card-features {
  margin-bottom: 1.25rem;
}
</style>
