<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import useIamStore from '../../application/iam.store.js';

const router = useRouter();
const iamStore = useIamStore();

const form = ref({ name: '', email: '', password: '', confirmPassword: '' });
const loading = ref(false);
const errorMessage = ref('');

const submit = async () => {
    errorMessage.value = '';

    if (form.value.password !== form.value.confirmPassword) {
        errorMessage.value = 'Las contraseñas no coinciden';
        return;
    }

    loading.value = true;

    try {
        await iamStore.signUp({
            name: form.value.name,
            username: form.value.email,
            password: form.value.password,
        });

        await router.push('/home');
    } catch (error) {
        errorMessage.value = error.response?.data?.message ?? 'No se pudo crear la cuenta';
    } finally {
        loading.value = false;
    }
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-brand">
        <div class="auth-logo"><i class="pi pi-bolt" /></div>
        <h1>Crear cuenta</h1>
        <p>Regístrate en ElectroCorp</p>
      </div>

      <form class="auth-form" @submit.prevent="submit">
        <div class="form-field">
          <label class="form-label" for="name">Nombre</label>
          <input
              id="name"
              v-model="form.name"
              class="form-input"
              type="text"
              autocomplete="name"
              required
              placeholder="Tu nombre"
          />
        </div>

        <div class="form-field">
          <label class="form-label" for="email">Email</label>
          <input
              id="email"
              v-model="form.email"
              class="form-input"
              type="email"
              autocomplete="email"
              required
              placeholder="tu@email.com"
          />
        </div>

        <div class="form-field">
          <label class="form-label" for="password">Contraseña</label>
          <input
              id="password"
              v-model="form.password"
              class="form-input"
              type="password"
              autocomplete="new-password"
              required
              minlength="6"
              placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div class="form-field">
          <label class="form-label" for="confirmPassword">Confirmar contraseña</label>
          <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              class="form-input"
              type="password"
              autocomplete="new-password"
              required
              placeholder="Repite tu contraseña"
          />
        </div>

        <div v-if="errorMessage" class="auth-error">{{ errorMessage }}</div>

        <button type="submit" class="btn btn-primary auth-submit" :disabled="loading">
          {{ loading ? 'Creando cuenta…' : 'Registrarme' }}
        </button>
      </form>

      <p class="auth-footer">
        ¿Ya tienes cuenta?
        <router-link to="/login">Iniciar sesión</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background:
    radial-gradient(ellipse 80% 60% at 100% 0%, rgba(14, 165, 233, 0.12) 0%, transparent 55%),
    radial-gradient(ellipse 60% 50% at 0% 100%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
    #f1f5f9;
}

.auth-card {
  width: 100%;
  max-width: 26rem;
  padding: 2rem;
  background: #fff;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-card);
  box-shadow: var(--color-shadow-lg);
}

.auth-brand {
  text-align: center;
  margin-bottom: 1.75rem;
}

.auth-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
  border-radius: 14px;
  background: var(--color-brand-gradient);
  color: #fff;
  font-size: 1.25rem;
}

.auth-brand h1 {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.auth-brand p {
  margin-top: 0.35rem;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-error {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-control);
  background: var(--color-feedback-error-surface);
  border: 1px solid var(--color-feedback-error-border);
  color: var(--color-feedback-error);
  font-size: 0.875rem;
}

.auth-submit {
  width: 100%;
  margin-top: 0.25rem;
}

.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.auth-footer a {
  color: var(--color-brand-primary-dark);
  font-weight: 600;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
