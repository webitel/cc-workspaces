<template>
  <router-view />
</template>

<script>
  export default {
    name: 'the-app',

    created() {
      this.setLanguage();
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
