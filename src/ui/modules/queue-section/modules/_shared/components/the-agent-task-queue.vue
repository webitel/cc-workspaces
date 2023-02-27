<template>
  <section
    class="task-queue"
    :class="[`task-queue--${size}`]"
  >
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
import sizeMixin from '../../../../../../app/mixins/sizeMixin';

export default {
  name: 'the-agent-task-queue',
  mixins: [sizeMixin],
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

  .task-queue-header__title {
    @extend %typo-body-1;
  }

  &--sm {
    .task-queue-header__title {
      @extend %typo-body-2;
      text-align: center;
    }
  }
}

</style>
