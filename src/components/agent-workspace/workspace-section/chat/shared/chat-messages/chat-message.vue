<template>
  <div class="chat-message" :class="{'chat-message--right': my}">
    <div class="chat-message__pic-wrapper" v-if="!my">
      <img class="chat-message__pic" src="../../../../../../assets/agent-workspace/default-avatar.svg" alt="client photo">
    </div>
    <div class="chat-message__main-wrapper">
      <p class="chat-message__text">{{ text }}</p>
    </div>
    <aside class="chat-message__message-info-wrapper">
      <div class="chat-message__sent-at">{{ sentAt }}</div>
      <wt-icon
        v-if="my"
        class="chat-message__status-icon"
        icon="chat-message-status-sent"
        size="sm"
      ></wt-icon>
    </aside>
  </div>
</template>

<script>
import prettifyTime from '@webitel/ui-sdk/src/scripts/prettifyTime';

  export default {
    name: 'chat-message',
    props: {
      message: {
        type: Object,
        required: true,
      },
    },
    computed: {
      sentAt() {
        return prettifyTime(this.message.createdAt);
      },
      text() {
        return this.message.text;
      },
      my() {
        return !!this.message.member?.self;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .chat-message {
    position: relative;
    display: flex;
    max-width: 80%;
    margin-top: 10px;

    .chat-message__main-wrapper {
      padding: 8px 10px;
      background: var(--chat-client-message-bg-color);
      border-radius: var(--border-radius);
    }

    .chat-message__text {
      @extend %typo-body-md;
    }

    .chat-message__message-info-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-end;
      margin-left: 10px;
    }

    .chat-message__sent-at {
      @extend %typo-body-sm;
      color: var(--text-outline-color);
      white-space: nowrap;
    }

    &--right {
      flex-direction: row-reverse;
      text-align: right;
      margin-left: auto;

      .chat-message__main-wrapper {
        background: var(--chat-agent-message-bg-color);
      }

      .chat-message__message-info-wrapper {
        margin-left: 0;
        margin-right: 10px;
      }
    }
  }

  .chat-message__pic-wrapper {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 10px;

    .chat-message__pic {
      width: 100%;
      height: 100%;
    }
  }
</style>
