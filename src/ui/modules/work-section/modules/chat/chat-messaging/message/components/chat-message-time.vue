<template>
  <aside class="chat-message-time">
    <div class="chat-message-time__sent-at typo-caption">
      {{ time }}
    </div>
  </aside>
</template>

<script>

import prettifyTime from '@webitel/ui-sdk/src/scripts/prettifyTime.js';

export default {
  name: 'ChatMessageTime',
  props: {
    date: {
      type: String,
      default: '',
      required: true,
    },
  },
  computed: {
    time() {
      return prettifyTime(this.date)
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.chat-message-time {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;

  &__sent-at {
    color: var(--text-main-color);
    white-space: nowrap;
  }
}
</style>
