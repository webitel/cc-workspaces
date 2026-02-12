<template>
  <div class="last-message-container">
    <div>
      <wt-icon :icon="icon" />
    </div>
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    icon: string;
    message: string;
  }>(),
  {
    icon: '',
    message: '',
  });
</script>

<style scoped>
.last-message-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}
</style>
