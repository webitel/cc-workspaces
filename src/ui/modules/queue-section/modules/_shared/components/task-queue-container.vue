<template>
  <section class="queue-task-container">
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
  min-height: 0;
  max-height: 100%;
  overflow: auto;
}
</style>
