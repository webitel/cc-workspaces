<template>
  <main class="main-not-found-page">
    <wt-notifications-bar />
    <app-header />
    <wt-error-page type="404" @back="goToHome" />
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router';

import AppHeader from '../modules/app-header/components/app-header.vue';

const router = useRouter();

const goToHome = () => {
  router.push('/');
};
</script>

