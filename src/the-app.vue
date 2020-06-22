<template>
  <router-view/>
</template>

<script>
  import { mapActions } from 'vuex';
  import APIRepository from './api/APIRepository';

  const authAPI = APIRepository.auth;

  export default {
    name: 'the-app',

    created() {
      this.restoreSession();
    },

    methods: {
      ...mapActions('userinfo', {
        setSession: 'SET_SESSION',
      }),

      async restoreSession() {
        // ROUTER REDIRECTS EMPTY TOKEN PATHS TO /AUTH, SO THERE'S NO NEED TO CATCH IT
        try {
          const userinfo = await authAPI.getSession();
          this.setSession(userinfo);
        } catch {
          await this.$router.replace('/auth');
        }
      },
    },
  };
</script>

<style lang="scss">
</style>
