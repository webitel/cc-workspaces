<template>
  <article class="chat-ended">
    <wt-divider />
    <div class="chat-ended__content">
      <wt-icon
        icon="chat-end"
        color="error"
        size="sm"
      />
      <p> {{ $t('workspaceSec.chat.chatEnded') }} </p>
    </div>
    <wt-divider />
  </article>
</template>

<style lang="scss" scoped>
.chat-ended {
  display: flex;
  gap: var(--spacing-2xs);
  align-items: center;

  &__content {
    display: flex;
    cursor: default;
    gap: var(--spacing-2xs)
  }

  p {
    @extend %typo-caption;
    min-width: 63px;
  }
}
</style>
