<template>
  <div :class="{'chat-message--right' : isAgentSideMessage}" class="chat-message">
    <message-avatar
      :bot="isBot"
      :message="message"
      :my="my"
      :show-avatar="showAvatar"
    ></message-avatar>
    <!--    click.stop prevents focus on textarea and allows to select the message text -->
    <div class="chat-message__main-wrapper" @click.stop>
      <message-audio
        :message="message"
        :my="my"
        :size="size"
        @initialized="handlePlayerInitialize"
      ></message-audio>
      <message-image
        :message="message"
        :my="my"
        @open="openImage"
      ></message-image>
      <message-document
        :message="message"
        :my="my"
      ></message-document>
      <message-text
        :bot="isBot"
        :message="message"
        :my="my"
      ></message-text>
    </div>
    <message-meta
      :message="message"
      :my="my"
    ></message-meta>
  </div>
</template>

<script>
import MessageAvatar from './chat-message-avatar.vue';
import MessageAudio from './chat-message-audio.vue';
import MessageText from './chat-message-text.vue';
import MessageImage from './chat-message-image.vue';
import MessageDocument from './chat-message-document.vue';
import MessageMeta from './chat-message-meta.vue';

export default {
  name: 'chat-message',
  components: {
    MessageAvatar,
    MessageAudio,
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
    size: {
      type: String,
      default: 'md',
      options: ['sm', 'md'],
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
    openImage() {
      this.$emit('open-image');
    },
    handlePlayerInitialize(player) {
      this.$emit('initialized-player', player);
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-message {
  position: relative;
  display: flex;
  max-width: 100%;
  gap: var(--spacing-xs);

  .chat-message-avatar {
    flex: 0 0 32px;
  }

  .chat-message__main-wrapper {
    display: flex;
    flex-direction: column;
    width: fit-content;
    min-width: 0;
    padding: var(--spacing-xs) var(--spacing-xs);
    line-height: 0; // prevents height difference from its content
    border-radius: var(--border-radius);
    background: var(--primary-light-color);
    gap: var(--spacing-xs);
  }

  &--right {
    flex-direction: row-reverse;
    margin-left: auto;

    .chat-message__main-wrapper {
      background: var(--secondary-light-color);
    }
  }
}
</style>
