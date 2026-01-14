<template>
  <main class="main-not-found-page">
    <wt-notifications-bar />
    <app-header />
    <wt-error-page :type="errorType" @back="handleBack" />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from '../modules/app-header/components/app-header.vue';

const route = useRoute();
const router = useRouter();

const errorType = computed(() => route.query.type || '404');

const handleBack = () => {
  if (errorType.value === '403') {
    return window.location.href = import.meta.env.VITE_APPLICATION_HUB_URL;
  }
  router.push('/');
};
</script>
