<template>
  <router-view />
</template>

<script>
import isOnPWA from './scripts/isOnPWA';

export default {
  name: 'TheApp',

  created() {
    this.setLanguage();
    // destroy does not execute on F5 as per answer below: https://my.webitel.com/browse/DEV-2144
    // https://stackoverflow.com/a/34443314/17748106

    // we have to listen to the window event:
    window.addEventListener('beforeunload', async (e) => {
      // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
      // https://my.webitel.com/browse/WTEL-2397
      console.log('isOnPWA', isOnPWA());
      if (isOnPWA()) e.preventDefault();
    });

    window.addEventListener('unload', () => {
      this.$store.dispatch('workspace/CLOSE_SESSION');
    });
  },

  methods: {
    setLanguage() {
      const lang = localStorage.getItem('lang');
      if (lang) this.$i18n.locale = lang;
      const fallbackLang = localStorage.getItem('fallbackLang');
      if (fallbackLang) this.$i18n.fallbackLocale = fallbackLang;
    },
  },
};
</script>

<style lang="scss"></style>
