<template>
  <section class="task-queue">
    <header class="task-queue__header">
      <h2 class="task-queue__header__title">
        <slot name="title">
          {{ title }}
        </slot>
      </h2>
    </header>
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'the-agent-task-queue',
  props: {
    title: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.task-queue__header {
  padding: var(--spacing-xs);
  margin-bottom: 1px;
  background: var(--main-color);
  border-radius: var(--border-radius);
}

.task-queue__header__title {
  @extend %typo-caption;
  color: var(--text-outline-color);
}

</style>
