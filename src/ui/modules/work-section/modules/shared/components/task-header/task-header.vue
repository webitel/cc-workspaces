<template>
  <header class="task-header">
    <div class="task-header-actions">
      <div class="task-header-actions__action-section">
        <slot name="before-avatar"></slot>
      </div>
      <wt-avatar size="sm"></wt-avatar>
      <div class="task-header-actions__action-section">
        <slot name="after-avatar"></slot>
      </div>
    </div>
    <div class="task-header-info">
      <p class="task-header-info__title">
        <slot name="title"></slot>
      </p>
      <p class="task-header-info__subtitle">
        <slot name="subtitle"></slot>
      </p>
    </div>
  </header>
</template>

<script>
export default {
  name: 'task-header',
};
</script>

<style lang="scss" scoped>
.task-header-actions {
  box-sizing: border-box;
  height: 50px;
  display: flex;
  grid-gap: 10px;
  padding: 10px;

  &__action-section {
    flex: 1 0 auto;
    &:nth-child(2) {
      justify-content: flex-end;
    }
  }

  .wt-avatar {
    flex: 0 0 32px;
  }
}

.task-header-info {
  text-align: center;

  &__title {
    @extend %typo-subtitle-2;
  }
  &__subtitle {
    @extend %typo-body-2;
  }
}
</style>
