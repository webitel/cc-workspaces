<template>
  <div class="chat-message" :class="{'chat-message--right' : isAgentSideMessage }">
    <message-avatar
      :show-avatar="showAvatar"
      :message="message"
      :my="my"
      :bot="isBot"
    ></message-avatar>
    <!--    click.stop prevents focus on textarea and allows to select the message text -->
    <div class="chat-message__main-wrapper" @click.stop>
      <message-text
        :message="message"
        :my="my"
      ></message-text>
      <message-image
        :message="message"
        :my="my"
        @open="openImage"
      ></message-image>
      <message-document
        :message="message"
        :my="my"
      ></message-document>
    </div>
    <message-meta
      :my="my"
      :message="message"
    ></message-meta>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import MessageAvatar from './chat-message-avatar.vue';
import MessageText from './chat-message-text.vue';
import MessageImage from './chat-message-image.vue';
import MessageDocument from './chat-message-document.vue';
import MessageMeta from './chat-message-meta.vue';

export default {
  name: 'chat-message',
  components: {
    MessageAvatar,
    MessageText,
    MessageImage,
    MessageDocument,
    MessageMeta,
  },
  props: {
    message: {
      type: Object,
      required: true,
    },
    showAvatar: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    my() {
      return !!this.message.member?.self;
    },
    isBot() {
      return !this.message.channelId;
    },
    isAgentSideMessage() {
      return this.my || this.isBot;
    },
  },
  methods: {
    ...mapActions('chat', {
      openMedia: 'OPEN_MEDIA',
    }),
    openImage() {
      this.openMedia(this.message);
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-message {
  position: relative;
  display: flex;
  max-width: 80%;

  .chat-message-avatar {
    margin: 0 10px 0 0;
  }

  .chat-message__main-wrapper {
    max-width: 100%;
    padding: 8px 10px;
    background: var(--chat-client-message-bg-color);
    border-radius: var(--border-radius);
    line-height: 0; // prevents height difference from its content
  }

  &--right {
    flex-direction: row-reverse;
    margin-left: auto;

    .chat-message__main-wrapper {
      background: var(--chat-agent-message-bg-color);
    }

    .chat-message-avatar {
      margin: 0 0 0 10px;
    }

    .chat-message-meta {
      margin: 0 10px 0 0;
    }
  }
}
</style>
