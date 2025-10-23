<template>
  <div class="chat-message-blocked-error">
    <wt-icon
      icon="protection-error"
      color="error"
    />
    <div >
      {{ $t('workspaceSec.chat.chatsFileBlocked') }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-message-blocked-error {
  @extend %typo-body-1;
  background: var(--p-error-highlight-color);
  border-radius: var(--spacing-xs);
  padding: var(--spacing-xs);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  white-space: pre-line;
  text-align: center;
  max-width: 138px;
}
</style>
<script setup lang="ts">
</script>
