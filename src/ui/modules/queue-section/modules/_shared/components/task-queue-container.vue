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
  // because we can't check for empty slot in vue 3 because v-for=0 => non-empty slot :(
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
  gap: var(--spacing-sm);

  &:not(.queue-task-container--empty) {
    padding-top: var(--spacing-sm);
  }
}
</style>
