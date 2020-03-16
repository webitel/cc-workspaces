<template>
  <router-view/>
</template>

<script>
  import getSession from './api/auth/userinfo';

  export default {
    name: 'the-app',

    created() {
      getSession();
      this.setDomain();
    },
    methods: {
      setDomain() {
        const domain = localStorage.getItem('domain');
        if (domain) this.$store.dispatch('userinfo/SET_DOMAIN_ID', domain);
      },
    },
  };
</script>

<style lang="scss">
</style>
