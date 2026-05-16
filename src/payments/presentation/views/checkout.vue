<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPlanById } from '../data/plans.data.js';

const route = useRoute();
const router = useRouter();

const plan = computed(() => getPlanById(route.params.planId));

const goBack = () => router.push({ name: 'payments-plans' });
const goToMyPlan = () =>
    router.push({ name: 'payments-plan', query: { plan: plan.value.id } });
</script>

<template>
  <section class="page">
    <header class="page-head">
      <h1 class="page-title">Payment</h1>
      <button type="button" class="btn btn-secondary" @click="goBack">
        Back to plans
      </button>
    </header>

    <div class="checkout-layout">
      <aside class="checkout-summary">
        <p class="current-plan-label">You are buying</p>
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
      </aside>

      <form class="checkout-form-card" @submit.prevent="goToMyPlan">
        <h2 class="checkout-form-title">Payment details</h2>

        <div class="form-stack">
          <div class="form-field">
            <label class="form-label" for="card-name">Cardholder name</label>
            <input
                id="card-name"
                class="form-input"
                type="text"
                placeholder="Osamu Dazai"
            />
          </div>
          <div class="form-field">
            <label class="form-label" for="card-number">Card number</label>
            <input
                id="card-number"
                class="form-input"
                type="text"
                placeholder="0000 0000 0000 0000"
            />
          </div>
          <div class="form-row">
            <div class="form-field">
              <label class="form-label" for="expiry">Expiry</label>
              <input id="expiry" class="form-input" type="text" placeholder="MM/YY" />
            </div>
            <div class="form-field">
              <label class="form-label" for="cvv">CVV</label>
              <input id="cvv" class="form-input" type="text" placeholder="123" />
            </div>
          </div>
        </div>

        <div class="btn-row">
          <button type="submit" class="btn btn-primary">
            Buy Service — S/ {{ plan.price.toFixed(2) }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.form-stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-section);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-section);
}

.checkout-summary .plan-card-features {
  margin-bottom: 0;
}
</style>
