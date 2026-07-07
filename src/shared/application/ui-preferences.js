import { computed, ref, watch } from 'vue';

const storedLanguage = localStorage.getItem('electrocorp-auth-language') || localStorage.getItem('electrocorp-app-language') || 'ES';
const storedTheme = localStorage.getItem('electrocorp-app-theme') || localStorage.getItem('electrocorp-auth-theme') || 'light';

const language = ref(storedLanguage);
const isDarkTheme = ref(storedTheme === 'dark');
const isMusicEnabled = ref(localStorage.getItem('electrocorp-music-enabled') === 'true');

const dictionary = {
  ES: {
    appName: 'ElectroCorp',
    home: 'Inicio',
    management: 'Gestión del hogar',
    homes: 'Hogares',
    devices: 'Dispositivos',
    analytics: 'Analítica',
    consumptions: 'Consumos',
    byDevice: 'Por dispositivo',
    payments: 'Pagos',
    plan: 'Plan actual',
    logout: 'Cerrar sesión',
    userFallback: 'Usuario ElectroCorp',
    language: 'Idioma',
    theme: 'Tema',
    lightTheme: 'Tema claro',
    darkTheme: 'Tema oscuro',
    musicOn: 'Pausar música',
    musicOff: 'Reproducir música',
    homeTitle: 'Inicio',
    homeWelcome: 'Bienvenido a ElectroCorp.',
    homeSubtitle: 'Gestiona tus dispositivos, revisa consumos y controla tu energía desde una sola plataforma.',
    activeSession: 'Sesión activa',
    quickAccess: 'Acceso rápido',
  },
  EN: {
    appName: 'ElectroCorp',
    home: 'Home',
    management: 'Home management',
    homes: 'Homes',
    devices: 'Devices',
    analytics: 'Analytics',
    consumptions: 'Consumptions',
    byDevice: 'By device',
    payments: 'Payments',
    plan: 'Current plan',
    logout: 'Logout',
    userFallback: 'ElectroCorp User',
    language: 'Language',
    theme: 'Theme',
    lightTheme: 'Light theme',
    darkTheme: 'Dark theme',
    musicOn: 'Pause music',
    musicOff: 'Play music',
    homeTitle: 'Home',
    homeWelcome: 'Welcome to ElectroCorp.',
    homeSubtitle: 'Manage your devices, review consumption and control your energy from a single platform.',
    activeSession: 'Active session',
    quickAccess: 'Quick access',
  },
  PT: {
    appName: 'ElectroCorp',
    home: 'Início',
    management: 'Gestão da casa',
    homes: 'Casas',
    devices: 'Dispositivos',
    analytics: 'Análises',
    consumptions: 'Consumos',
    byDevice: 'Por dispositivo',
    payments: 'Pagamentos',
    plan: 'Plano atual',
    logout: 'Sair',
    userFallback: 'Usuário ElectroCorp',
    language: 'Idioma',
    theme: 'Tema',
    lightTheme: 'Tema claro',
    darkTheme: 'Tema escuro',
    musicOn: 'Pausar música',
    musicOff: 'Reproduzir música',
    homeTitle: 'Início',
    homeWelcome: 'Bem-vindo ao ElectroCorp.',
    homeSubtitle: 'Gerencie seus dispositivos, revise consumos e controle sua energia em uma só plataforma.',
    activeSession: 'Sessão ativa',
    quickAccess: 'Acesso rápido',
  },
};

const t = computed(() => dictionary[language.value] || dictionary.ES);

const setLanguage = (value) => {
  if (!dictionary[value]) return;
  language.value = value;
  localStorage.setItem('electrocorp-app-language', value);
  localStorage.setItem('electrocorp-auth-language', value);
  document.documentElement.lang = value.toLowerCase();
};

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  localStorage.setItem('electrocorp-app-theme', isDarkTheme.value ? 'dark' : 'light');
};

const setMusicEnabled = (value) => {
  isMusicEnabled.value = value;
  localStorage.setItem('electrocorp-music-enabled', String(value));
};

watch(isDarkTheme, (value) => {
  document.body.classList.toggle('app-dark-theme', value);
}, { immediate: true });

setLanguage(language.value);

export function useUiPreferences() {
  return {
    language,
    isDarkTheme,
    isMusicEnabled,
    t,
    setLanguage,
    toggleTheme,
    setMusicEnabled,
  };
}
