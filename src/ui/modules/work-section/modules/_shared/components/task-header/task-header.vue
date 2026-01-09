<template>
  <header
    class="task-header"
    :class="[`task-header--${size}`]"
  >
    <div class="task-header-actions">
      <div class="task-header-actions__action-section">
        <slot name="before-avatar" />
      </div>
      <wt-avatar :size="size" :username="username" />
      <div class="task-header-actions__action-section">
        <slot name="after-avatar" />
      </div>
    </div>
    <div class="task-header-info">
      <p class="task-header-info__title">
        <slot name="title" />
      </p>
      <p class="task-header-info__subtitle">
        <slot name="subtitle" />
      </p>
      <slot name="queue" />
    </div>
  </header>
</template>

<script>
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';

export default {
  name: 'TaskHeader',
  mixins: [sizeMixin],
  props: {
    username: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.task-header {
  .task-header-actions {
    display: grid;
    box-sizing: border-box;
    grid-template-columns: 1fr 40px 1fr;
    grid-gap: var(--spacing-2xs);

    &__action-section {
      display: flex;
      gap: var(--spacing-2xs);

      &:nth-child(2) {
        justify-content: flex-end;
      }
    }

    .wt-avatar {
      flex: 0 0 32px;
      transition: var(--transition);
    }
  }

  .task-header-info {
    text-align: center;

    &__title {
      @extend %typo-subtitle-1;
    }

    &__subtitle {
      @extend %typo-body-2;
      word-break: break-all;
    }
  }

  &--sm {
    .task-header-actions {
      grid-template-columns: 1fr 32px 1fr;
    }
  }
}
</style>
