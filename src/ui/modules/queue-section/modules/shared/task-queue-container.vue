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
@import '../../css/queue-task-container';
</style>
