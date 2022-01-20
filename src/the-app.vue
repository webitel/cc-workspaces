<template>
  <router-view />
</template>

<script>
  export default {
    name: 'the-app',

    created() {
      this.setLanguage();

      // destroy does not execute on F5 as per answer below:
      // https://stackoverflow.com/a/34443314/17748106

      // we have to listen to the window event:
      window.onbeforeunload = async () => {
        await this.$store.state.client.destroyCliInstance();
      };
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
