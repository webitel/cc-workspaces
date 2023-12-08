<template>
  <div
    class="chat-message-avatar"
  >
    <wt-avatar
      v-if="showAvatar && !bot"
      size="sm"
    ></wt-avatar>
    <div
      v-else-if="showAvatar"
      class="chat-message-avatar__bot-avatar-wrapper"
    >
      <wt-icon
        icon="ws-bot"
      ></wt-icon>
    </div>
  </div>
</template>

<script>
import chatMessageDetailMixin from '../../../../mixins/chatMessageDetailMixin';

export default {
  name: 'chat-message-avatar',
  mixins: [chatMessageDetailMixin],
  props: {
    bot: {
      type: Boolean,
      default: false,
    },
    showAvatar: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-message-avatar {
  pointer-events: none; // prevents dragging to upload file area

  &__bot-avatar-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--wt-avatar-size--size-sm);
    aspect-ratio: 1;
    border-radius: 50%;
    background-color: var(--secondary-color);
  }
}
</style>
