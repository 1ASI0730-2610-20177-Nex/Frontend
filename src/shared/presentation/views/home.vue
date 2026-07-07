<script setup>
import { useUiPreferences } from '../../application/ui-preferences.js';

const { t } = useUiPreferences();
</script>

<template>
  <section class="page home-dashboard-page">
    <header class="page-head">
      <div>
        <p class="page-kicker">{{ t.activeSession }}</p>
        <h1 class="page-title">{{ t.homeTitle }}</h1>
      </div>
    </header>

    <article class="home-welcome-card">
      <div>
        <p class="home-welcome-label">{{ t.quickAccess }}</p>
        <h2>{{ t.homeWelcome }}</h2>
        <p>{{ t.homeSubtitle }}</p>
      </div>
      <span class="home-welcome-icon">⚡</span>
    </article>
  </section>
</template>
