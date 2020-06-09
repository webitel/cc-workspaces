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
        const userinfo = await authAPI.getSession();
        this.setSession(userinfo);
      },
    },
  };
</script>

<style lang="scss">
</style>
