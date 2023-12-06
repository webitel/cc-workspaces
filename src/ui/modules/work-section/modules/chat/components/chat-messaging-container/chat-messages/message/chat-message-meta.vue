<template>
  <aside class="chat-message-meta">
    <div class="chat-message-meta__sent-at">{{ sentAt }}</div>
    <wt-icon
      v-if="my"
      class="chat-message-meta__status-icon"
      icon="chat-message-status-sent"
      size="sm"
    ></wt-icon>
  </aside>
</template>

<script>
import prettifyTime from '@webitel/ui-sdk/src/scripts/prettifyTime';
import chatMessageDetailMixin from '../../../../mixins/chatMessageDetailMixin';

export default {
  name: 'chat-message-meta',
  mixins: [chatMessageDetailMixin],
  computed: {
    sentAt() {
      return prettifyTime(this.message.createdAt);
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-message-meta {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
}

.chat-message-meta__sent-at {
  @extend %typo-caption;
  color: var(--text-main-color);
  white-space: nowrap;
}
</style>
