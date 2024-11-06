<!-- .vitepress/theme/Layout.vue -->

<script setup>
import { useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { onMounted, provide } from 'vue';

const { isDark } = useData();

const toggleComponentsDarkTheme = (value) => {
  const html = document.querySelector('html');
  if (value) html.classList.add('theme--dark');
  else html.classList.remove('theme--dark');
};

provide('toggle-appearance', () => {
  isDark.value = !isDark.value;
  toggleComponentsDarkTheme(isDark.value);
});

onMounted(() => {
  toggleComponentsDarkTheme(isDark.value);
});
</script>

<template>
  <DefaultTheme.Layout />
</template>

<style lang="scss">
:root {
  --vp-c-bg: var(--dp-22-surface-color);
  --vp-c-bg-alt: var(--dp-20-surface-color);
  --vp-c-bg-elv: var(--dp-18-surface-color);
  --vp-c-bg-soft: var(--dp-16-surface-color);
}
</style>
