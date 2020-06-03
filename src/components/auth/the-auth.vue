<template>
  <div class="auth-wrap">
    <div v-show="!isLoaded" class="auth-loader">
      <loader/>
    </div>
    <iframe
      class="auth"
      :src="authURL"
      @load="isLoaded = true"
    >
      <p>Your browser does not support iframes.</p>
    </iframe>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import loader from '../utils/loader.vue';
  import APIRepository from '../../api/APIRepository';

  const authURL = process.env.VUE_APP_AUTH_MODULE_URL;
  const authAPI = APIRepository.auth;

  export default {
    name: 'auth',
    components: {
      loader,
    },

    data: () => ({
      authURL,
      isLoaded: false,
    }),

    mounted() {
      window.addEventListener('message', this.authMessageHandler, false);
    },
    destroyed() {
      window.removeEventListener('message', this.authMessageHandler, false);
    },

    methods: {
      ...mapActions('userinfo', {
        setSession: 'SET_SESSION',
      }),

      async authMessageHandler(event) {
        if (event.data.accessToken) {
          authAPI.setToken(event.data.accessToken);
          await this.restoreSession();
          await this.$router.replace('/workspace');
        }
      },

      async restoreSession() {
        const userinfo = await authAPI.getSession();
        this.setSession(userinfo);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .auth-wrap {
    height: 100vh;
    width: 100vw;

    .auth-loader {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: #fff;

      .loader {
        position: absolute;
        top: 50%;
        right: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .auth {
      height: 100%;
      width: 100%;
    }
  }
</style>
