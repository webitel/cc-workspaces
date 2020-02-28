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
    import loader from '../utils/loader.vue';
    // eslint-disable-next-line import/no-cycle
    import { handleToken } from '../../api/auth/auth';

    const authURL = process.env.VUE_APP_AUTH_MODULE_URL;

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
            async authMessageHandler(event) {
                if (event.data.accessToken) await handleToken(event.data.accessToken);
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
