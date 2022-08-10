<template>
  <header class="task-header">
    <div class="task-header-actions">
      <div class="task-header-actions__action-section">
        <slot name="before-avatar"></slot>
      </div>
      <wt-avatar></wt-avatar>
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
.task-header {
  padding: 10px;
}

.task-header-actions {
  display: grid;
  box-sizing: border-box;
  grid-template-columns: 1fr 40px 1fr;
  grid-gap: 10px;
  margin-bottom: 10px;

  &__action-section {
    display: flex;
    gap: 10px;

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
