<template>
  <section
    class="queue-task-container"
    :class="{
    'queue-task-container--empty': empty,
    }"
  >
    <slot></slot>
  </section>
</template>

<script setup>
const props = defineProps({
  empty: {
    type: Boolean,
    default: true,
  },
});
</script>

<style lang="scss" scoped>
.queue-task-container {
  @extend %wt-scrollbar;
  display: flex;
  flex-direction: column;
  min-height: 0;
  max-height: 100%;
  gap: var(--spacing-xs);

  &:not(.queue-task-container--empty) {
    padding: var(--spacing-xs) 0;
  }
}
</style>
