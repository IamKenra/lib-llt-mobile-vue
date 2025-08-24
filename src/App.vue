<template>
  <div id="app" class="min-h-screen bg-slate-50 font-sans antialiased">
    <RouterView />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
</script>

<style>
@import 'tailwindcss';

/* Ensure mobile viewport */
@viewport {
  width: device-width;
  zoom: 1.0;
}

/* Prevent zoom on input focus for iOS */
input, select, textarea {
  font-size: 16px !important;
}

/* Remove tap highlights */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Touch-friendly scrolling */
* {
  -webkit-overflow-scrolling: touch;
}
</style>