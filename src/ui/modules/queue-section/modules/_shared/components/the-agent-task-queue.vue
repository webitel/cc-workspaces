<template>
  <section class="task-queue">
    <header class="task-queue-header">
      <h2 class="task-queue-header__title">
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
.task-queue {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.task-queue-header__title {
  @extend %typo-body-1;
}

</style>
