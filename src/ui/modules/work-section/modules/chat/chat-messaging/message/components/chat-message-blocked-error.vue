<template>
  <div class="chat-message-blocked-error">
    <wt-icon
      icon="protection-error"
      color="error"
    />
    <p>
      {{ t('workspaceSec.chat.chatsFileBlocked') }}
    </p>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped lang="scss">
@use '@webitel/ui-sdk/src/css/main' as *;

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

  //width limit for blocking error message
  max-width: 132px;
}
</style>
<script setup lang="ts">
</script>
