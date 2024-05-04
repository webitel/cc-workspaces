<template>
  <router-view />
</template>

<script>
import { mapActions } from 'vuex/dist/vuex.cjs.js';
import isOnPWA from './scripts/isOnPWA';

export default {
  name: 'the-app',

  created() {
    this.setLanguage();
    // destroy does not execute on F5 as per answer below: https://my.webitel.com/browse/DEV-2144
    // https://stackoverflow.com/a/34443314/17748106

    // we have to listen to the window event:
    window.addEventListener('beforeunload', async (e) => {
      // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
      // https://my.webitel.com/browse/WTEL-2397
      if (isOnPWA()) e.preventDefault();
    });

    window.addEventListener('unload', () => {
      this.$store.dispatch('workspace/CLOSE_SESSION');
    });
  },

  mounted() {
    // Global hotkey handling 
    window.addEventListener('keydown', this.handleHotkey);
  },

  methods: {
    setLanguage() {
      const lang = localStorage.getItem('lang');
      if (lang) this.$i18n.locale = lang;
    },
    ...mapActions('features/hotkeys', {
      handleHotkey: 'HANDLE_HOTKEY',
    }),
  },
};
</script>

<style lang="scss">
</style>
