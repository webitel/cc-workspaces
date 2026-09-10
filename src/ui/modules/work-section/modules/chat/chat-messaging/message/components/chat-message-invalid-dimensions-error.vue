<template>
  <div class="chat-message-invalid-dimensions-error typo-body-1">
    <wt-icon icon="violation" color="error" />
    <p>{{ t('workspaceSec.chat.errors.photoInvalidDimensions') }}</p>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped lang="scss">
@use '@webitel/ui-sdk/src/css/main' as *;

.chat-message-invalid-dimensions-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  white-space: pre-line;
  text-align: center;
}
</style>
