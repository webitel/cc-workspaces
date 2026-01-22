<template>
  <section
    class="queue-task-container wt-scrollbar"
    :class="{
    'queue-task-container--empty': empty,
    }"
  >
    <slot></slot>
  </section>
</template>

<script setup>
const props = defineProps({
  // because we can't check for empty slot in vue 3 because v-for=0 => non-empty slot :(
  empty: {
    type: Boolean,
    default: true,
  },
});
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.queue-task-container {
  display: flex;
  flex-direction: column;
  min-height: 0;
  max-height: 100%;
  gap: var(--spacing-xs);

  &:not(.queue-task-container--empty) {
    padding-top: var(--spacing-xs);
  }
}
</style>
