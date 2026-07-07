<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const language = ref(localStorage.getItem('electrocorp-auth-language') || 'ES');
const isDarkTheme = ref(localStorage.getItem('electrocorp-auth-theme') !== 'light');
const authMode = ref('login');
const email = ref(localStorage.getItem('electrocorp-remember-email') || '');
const password = ref('');
const fullName = ref('');
const confirmPassword = ref('');
const remember = ref(true);
const errorMessage = ref('');
const successMessage = ref('');

const translations = {
  ES: {
    login: 'Iniciar sesión',
    register: 'Crear cuenta',
    kickerLogin: 'BIENVENIDO DE NUEVO',
    kickerRegister: 'NUEVA CUENTA',
    loginTitle: 'Iniciar sesión',
    registerTitle: 'Crear cuenta',
    loginDescription: 'Accede a tu panel de ElectroCorp para gestionar dispositivos, rutinas y consumo de energía.',
    registerDescription: 'Registra tu cuenta para ingresar al dashboard de Smart Control y administrar tus dispositivos.',
    name: 'Nombre completo',
    namePlaceholder: 'Diego Cabrejos',
    email: 'Correo electrónico',
    emailPlaceholder: 'usuario@electrocorp.com',
    password: 'Contraseña',
    passwordPlaceholder: 'Ingresa tu contraseña',
    confirmPassword: 'Confirmar contraseña',
    confirmPlaceholder: 'Repite tu contraseña',
    remember: 'Recordar mi correo',
    submitLogin: 'Ingresar',
    submitRegister: 'Registrarme',
    forgot: '¿Olvidaste tu contraseña?',
    create: 'Crear cuenta',
    haveAccount: 'Ya tengo cuenta',
    invalidEmail: 'Ingresa un correo electrónico válido.',
    passwordLength: 'La contraseña debe tener al menos 4 caracteres.',
    nameRequired: 'Ingresa tu nombre completo.',
    passwordMismatch: 'Las contraseñas no coinciden.',
    accountExists: 'Este correo ya tiene una cuenta registrada.',
    accountCreated: 'Cuenta creada correctamente. Ahora puedes iniciar sesión.',
    invalidCredentials: 'Correo o contraseña incorrectos. Primero crea una cuenta o revisa tus datos.',
    helperLogin: 'Para entrar, usa una cuenta registrada. También puedes crear una nueva cuenta desde el botón inferior.',
    helperRegister: 'La cuenta se guarda localmente para esta versión académica del proyecto.',
    recovered: 'Para esta versión académica, crea una nueva cuenta o usa una cuenta ya registrada.',
  },
  EN: {
    login: 'Log in',
    register: 'Create account',
    kickerLogin: 'WELCOME BACK',
    kickerRegister: 'NEW ACCOUNT',
    loginTitle: 'Log in',
    registerTitle: 'Create account',
    loginDescription: 'Access your ElectroCorp panel to manage devices, routines and energy consumption.',
    registerDescription: 'Register your account to access Smart Control and manage your devices.',
    name: 'Full name',
    namePlaceholder: 'Diego Cabrejos',
    email: 'Email address',
    emailPlaceholder: 'user@electrocorp.com',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    confirmPassword: 'Confirm password',
    confirmPlaceholder: 'Repeat your password',
    remember: 'Remember my email',
    submitLogin: 'Log in',
    submitRegister: 'Sign up',
    forgot: 'Forgot your password?',
    create: 'Create account',
    haveAccount: 'I already have an account',
    invalidEmail: 'Enter a valid email address.',
    passwordLength: 'Password must have at least 4 characters.',
    nameRequired: 'Enter your full name.',
    passwordMismatch: 'Passwords do not match.',
    accountExists: 'This email already has a registered account.',
    accountCreated: 'Account created successfully. You can now log in.',
    invalidCredentials: 'Wrong email or password. Create an account first or check your data.',
    helperLogin: 'Use a registered account to enter. You can create a new one with the lower button.',
    helperRegister: 'The account is stored locally for this academic version.',
    recovered: 'For this academic version, create a new account or use an existing one.',
  },
  PT: {
    login: 'Entrar',
    register: 'Criar conta',
    kickerLogin: 'BEM-VINDO DE VOLTA',
    kickerRegister: 'NOVA CONTA',
    loginTitle: 'Entrar',
    registerTitle: 'Criar conta',
    loginDescription: 'Acesse seu painel ElectroCorp para gerenciar dispositivos, rotinas e consumo de energia.',
    registerDescription: 'Registre sua conta para acessar o Smart Control e administrar seus dispositivos.',
    name: 'Nome completo',
    namePlaceholder: 'Diego Cabrejos',
    email: 'E-mail',
    emailPlaceholder: 'usuario@electrocorp.com',
    password: 'Senha',
    passwordPlaceholder: 'Digite sua senha',
    confirmPassword: 'Confirmar senha',
    confirmPlaceholder: 'Repita sua senha',
    remember: 'Lembrar meu e-mail',
    submitLogin: 'Entrar',
    submitRegister: 'Registrar',
    forgot: 'Esqueceu sua senha?',
    create: 'Criar conta',
    haveAccount: 'Já tenho conta',
    invalidEmail: 'Digite um e-mail válido.',
    passwordLength: 'A senha deve ter pelo menos 4 caracteres.',
    nameRequired: 'Digite seu nome completo.',
    passwordMismatch: 'As senhas não coincidem.',
    accountExists: 'Este e-mail já possui uma conta registrada.',
    accountCreated: 'Conta criada com sucesso. Agora você pode entrar.',
    invalidCredentials: 'E-mail ou senha incorretos. Crie uma conta primeiro ou revise seus dados.',
    helperLogin: 'Use uma conta registrada para entrar. Você também pode criar uma nova conta no botão inferior.',
    helperRegister: 'A conta é salva localmente para esta versão acadêmica.',
    recovered: 'Nesta versão acadêmica, crie uma nova conta ou use uma conta existente.',
  },
};

const t = computed(() => translations[language.value]);
const pageClass = computed(() => ['auth-page', isDarkTheme.value ? 'auth-page-dark' : 'auth-page-light']);

const setLanguage = (value) => {
  language.value = value;
  localStorage.setItem('electrocorp-auth-language', value);
};

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  localStorage.setItem('electrocorp-auth-theme', isDarkTheme.value ? 'dark' : 'light');
};

const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('electrocorp-users') || '[]');
  } catch (error) {
    return [];
  }
};

const saveUsers = (users) => {
  localStorage.setItem('electrocorp-users', JSON.stringify(users));
};

const resetMessages = () => {
  errorMessage.value = '';
  successMessage.value = '';
};

const switchMode = (mode) => {
  authMode.value = mode;
  password.value = '';
  confirmPassword.value = '';
  resetMessages();
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const submitRegister = () => {
  resetMessages();
  const cleanEmail = email.value.trim().toLowerCase();
  const cleanName = fullName.value.trim();

  if (cleanName.length < 3) {
    errorMessage.value = t.value.nameRequired;
    return;
  }

  if (!isValidEmail(cleanEmail)) {
    errorMessage.value = t.value.invalidEmail;
    return;
  }

  if (password.value.trim().length < 4) {
    errorMessage.value = t.value.passwordLength;
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = t.value.passwordMismatch;
    return;
  }

  const users = getUsers();
  if (users.some((user) => user.email === cleanEmail)) {
    errorMessage.value = t.value.accountExists;
    return;
  }

  users.push({
    name: cleanName,
    email: cleanEmail,
    password: password.value,
    createdAt: new Date().toISOString(),
  });
  saveUsers(users);
  successMessage.value = t.value.accountCreated;
  authMode.value = 'login';
  confirmPassword.value = '';
  password.value = '';
};

const submitLogin = () => {
  resetMessages();
  const cleanEmail = email.value.trim().toLowerCase();

  if (!isValidEmail(cleanEmail)) {
    errorMessage.value = t.value.invalidEmail;
    return;
  }

  if (password.value.trim().length < 4) {
    errorMessage.value = t.value.passwordLength;
    return;
  }

  const users = getUsers();
  const user = users.find((item) => item.email === cleanEmail && item.password === password.value);

  if (!user) {
    errorMessage.value = t.value.invalidCredentials;
    return;
  }

  localStorage.setItem('electrocorp-auth', JSON.stringify({
    email: user.email,
    name: user.name,
    loggedAt: new Date().toISOString(),
  }));

  if (remember.value) localStorage.setItem('electrocorp-remember-email', cleanEmail);
  else localStorage.removeItem('electrocorp-remember-email');

  router.push({ name: 'Home' });
};

const handleSubmit = () => {
  if (authMode.value === 'register') submitRegister();
  else submitLogin();
};

const showRecoveryMessage = () => {
  resetMessages();
  successMessage.value = t.value.recovered;
};
</script>

<template>
  <main :class="pageClass">
    <header class="auth-topbar">
      <button type="button" class="auth-logo" @click="switchMode('login')">
        <span class="auth-logo-icon">⚡</span>
        <span>ElectroCorp</span>
      </button>

      <div class="auth-top-actions">
        <div class="auth-language-switch" aria-label="Language switcher">
          <button
            v-for="item in ['ES', 'EN', 'PT']"
            :key="item"
            type="button"
            :class="{ active: language === item }"
            @click="setLanguage(item)"
          >
            {{ item }}
          </button>
        </div>
        <button type="button" class="auth-theme-button" @click="toggleTheme">
          {{ isDarkTheme ? '☀️' : '🌙' }}
        </button>
      </div>
    </header>

    <section class="auth-card">
      <div class="auth-mode-switch">
        <button
          type="button"
          :class="{ active: authMode === 'login' }"
          @click="switchMode('login')"
        >
          {{ t.login }}
        </button>
        <button
          type="button"
          :class="{ active: authMode === 'register' }"
          @click="switchMode('register')"
        >
          {{ t.register }}
        </button>
      </div>

      <div class="auth-brand">
        <p class="auth-kicker">{{ authMode === 'login' ? t.kickerLogin : t.kickerRegister }}</p>
        <h1>{{ authMode === 'login' ? t.loginTitle : t.registerTitle }}</h1>
        <p class="auth-description">
          {{ authMode === 'login' ? t.loginDescription : t.registerDescription }}
        </p>
      </div>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <label v-if="authMode === 'register'" class="auth-field">
          <span>{{ t.name }}</span>
          <input
            v-model="fullName"
            type="text"
            :placeholder="t.namePlaceholder"
            autocomplete="name"
          />
        </label>

        <label class="auth-field">
          <span>{{ t.email }}</span>
          <input
            v-model="email"
            type="email"
            :placeholder="t.emailPlaceholder"
            autocomplete="email"
          />
        </label>

        <label class="auth-field">
          <span>{{ t.password }}</span>
          <input
            v-model="password"
            type="password"
            :placeholder="t.passwordPlaceholder"
            :autocomplete="authMode === 'register' ? 'new-password' : 'current-password'"
          />
        </label>

        <label v-if="authMode === 'register'" class="auth-field">
          <span>{{ t.confirmPassword }}</span>
          <input
            v-model="confirmPassword"
            type="password"
            :placeholder="t.confirmPlaceholder"
            autocomplete="new-password"
          />
        </label>

        <label v-if="authMode === 'login'" class="auth-check">
          <input v-model="remember" type="checkbox" />
          <span>{{ t.remember }}</span>
        </label>

        <p v-if="errorMessage" class="auth-error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="auth-success">{{ successMessage }}</p>

        <button type="submit" class="auth-submit">
          {{ authMode === 'login' ? t.submitLogin : t.submitRegister }}
        </button>
      </form>

      <div class="auth-footer-actions">
        <button v-if="authMode === 'login'" type="button" class="auth-secondary-button" @click="showRecoveryMessage">
          {{ t.forgot }}
        </button>
        <button v-if="authMode === 'login'" type="button" class="auth-secondary-button" @click="switchMode('register')">
          {{ t.create }}
        </button>
        <button v-else type="button" class="auth-secondary-button" @click="switchMode('login')">
          {{ t.haveAccount }}
        </button>
      </div>

      <p class="auth-helper">
        {{ authMode === 'login' ? t.helperLogin : t.helperRegister }}
      </p>
    </section>
  </main>
</template>
