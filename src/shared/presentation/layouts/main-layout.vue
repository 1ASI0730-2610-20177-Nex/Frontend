<script setup>
import { nextTick, onMounted, ref, watch } from 'vue';
import SidebarContent from '../components/sidebar-content.vue';
import { useUiPreferences } from '../../application/ui-preferences.js';

const audioRef = ref(null);
const { language, isDarkTheme, isMusicEnabled, t, setLanguage, toggleTheme, setMusicEnabled } = useUiPreferences();

const syncAudioState = async () => {
  const audio = audioRef.value;
  if (!audio) return;

  audio.volume = 0.18;

  if (isMusicEnabled.value) {
    try {
      await audio.play();
    } catch (error) {
      setMusicEnabled(false);
    }
  } else {
    audio.pause();
  }
};

const toggleMusic = async () => {
  setMusicEnabled(!isMusicEnabled.value);
  await nextTick();
  await syncAudioState();
};

watch(isMusicEnabled, syncAudioState);

onMounted(syncAudioState);
</script>

<template>
  <div class="layout app-shell" :class="{ 'app-shell-dark': isDarkTheme }">
    <sidebar-content />

    <section class="app-content-area">
      <header class="app-toolbar">
        <div class="app-toolbar-title">
          <span class="app-toolbar-icon">⚡</span>
          <div>
            <p class="app-toolbar-kicker">Smart Control</p>
            <strong>{{ t.appName }}</strong>
          </div>
        </div>

        <div class="app-toolbar-actions">
          <div class="app-language-switch" :aria-label="t.language">
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

          <button type="button" class="app-round-button" :title="t.theme" @click="toggleTheme">
            {{ isDarkTheme ? '☀️' : '🌙' }}
          </button>

          <button type="button" class="app-round-button app-music-button" :title="isMusicEnabled ? t.musicOn : t.musicOff" @click="toggleMusic">
            {{ isMusicEnabled ? '🔊' : '🎵' }}
          </button>
        </div>

        <audio ref="audioRef" src="/audio/ElectroCorp.mp3" loop preload="auto"></audio>
      </header>

      <main class="layout-main layout-body">
        <router-view />
      </main>
    </section>
  </div>
</template>
