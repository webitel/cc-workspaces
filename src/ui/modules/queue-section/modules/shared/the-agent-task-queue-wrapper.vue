<template>
  <section class="job-queue">
    <header class="task-queue__header">
      <h2 class="task-queue__header__title">{{ title }}</h2>
    </header>
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'the-agent-task-queue-wrapper',
  props: {
    title: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../css/task-queue';
</style>
