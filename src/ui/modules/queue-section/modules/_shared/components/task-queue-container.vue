<template>
  <section
    :class="{ 'queue-task-container--empty': !$slots.default }"
    class="queue-task-container"
  >
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'task-queue-container',
};
</script>

<style lang="scss" scoped>
.queue-task-container {
  @extend %wt-scrollbar;
  display: flex;
  flex-direction: column;
  min-height: 0;
  max-height: 100%;
  gap: var(--spacing-xs);

  &--empty {
    margin-top: 0;
  }
}
</style>
