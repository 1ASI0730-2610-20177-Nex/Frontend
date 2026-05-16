<script setup>
import { useRouter } from 'vue-router';
import { PLANS } from '../data/plans.data.js';

const router = useRouter();

const buyPlan = (planId) => {
  router.push({ name: 'payments-checkout', params: { planId } });
};

const goBack = () => router.push({ name: 'payments-plan' });
</script>

<template>
  <section class="page">
    <header class="page-head">
      <h1 class="page-title">Choose your plan</h1>
      <button type="button" class="btn btn-secondary" @click="goBack">
        Back
      </button>
    </header>

    <div class="plans-grid">
      <article
          v-for="plan in PLANS"
          :key="plan.id"
          class="plan-card"
          :class="{ 'plan-card-featured': plan.highlighted }"
      >
        <span v-if="plan.highlighted" class="plan-card-badge">Most popular</span>

        <h2 class="plan-card-title">{{ plan.name }}</h2>

        <div class="plan-price">
          <span class="plan-price-currency">S/</span>
          <span class="plan-price-current">{{ plan.price.toFixed(2) }}</span>
          <span class="plan-price-original">S/ {{ plan.originalPrice.toFixed(2) }}</span>
        </div>

        <p class="plan-card-desc">{{ plan.description }}</p>

        <ul class="plan-card-features">
          <li v-for="feature in plan.features" :key="feature">
            {{ feature }}
          </li>
        </ul>

        <div class="plan-card-actions">
          <button
              type="button"
              class="btn btn-primary"
              style="width: 100%;"
              @click="buyPlan(plan.id)"
          >
            Buy Service
          </button>
        </div>
      </article>
    </div>
  </section>
</template>
