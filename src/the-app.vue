<template>
  <router-view />
</template>

<script>
  export default {
    name: 'the-app',

    created() {
      this.setLanguage();

      // destroy does not execute on F5 as per answer below: https://my.webitel.com/browse/DEV-2144
      // https://stackoverflow.com/a/34443314/17748106

      // we have to listen to the window event:
      window.addEventListener('beforeunload', async (e) => {
        await this.$store.state.client.destroyCliInstance();
        // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
        // https://my.webitel.com/browse/WTEL-2397
        delete e.returnValue; // page will always reload
      });
    },

    methods: {
      setLanguage() {
        const lang = localStorage.getItem('lang');
        if (lang) this.$i18n.locale = lang;
      },
    },
  };
</script>

<style lang="scss">
</style>
