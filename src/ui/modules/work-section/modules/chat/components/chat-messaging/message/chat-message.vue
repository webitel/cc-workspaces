<template>
  <div
    :class="{
     'chat-message--right' : isAgentSideMessage,
     'chat-message--md': size === 'md'
    }"
    class="chat-message"
  >
    <message-avatar
      :bot="isBot"
      :message="message"
      :my="my"
      :show-avatar="showAvatar"
      :username="contactName"
    />
    <!--    click.stop prevents focus on textarea and allows to select the message text -->
    <div class="chat-message__main-wrapper" @click.stop>
      <message-audio
        :message="message"
        :my="my"
        :size="size"
        @initialized="handlePlayerInitialize"
      />
      <message-image
        :message="message"
        :my="my"
        @open="openImage"
      />
      <message-document
        :message="message"
        :my="my"
      />
      <message-text
        :bot="isBot"
        :message="message"
        :my="my"
      />
    </div>
    <message-meta
      :message="message"
      :my="my"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MessageAvatar from './chat-message-avatar.vue';
import MessageAudio from './chat-message-audio.vue';
import MessageText from './chat-message-text.vue';
import MessageImage from './chat-message-image.vue';
import MessageDocument from './chat-message-document.vue';
import MessageMeta from './chat-message-meta.vue';
import MessageDate from './chat-message-date.vue';

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
    showDate: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'md',
      options: ['sm', 'md'],
    },
  },
  computed: {
    ...mapState('ui/infoSec/client/contact', {
      contact: (state) => state.contact,
    }),
    my() {
      return !!this.message.member?.self;
    },
    isAgent() {
      // after chat transfer we need to identify messages from another agent
      return this.message.member?.type === 'webitel' // for currentChat
        || this.message.peer?.type === 'user'; // for chat history
    },
    isBot() {
      return !this.message.channelId && !this.contact?.id // for current chat
        || this.message.peer?.type === 'bot'; // for chat history
    },
    isAgentSideMessage() {
      return this.my || this.isAgent || this.isBot;
    },
    contactName() {
      return !this.isBot && !this.isAgent && !this.my && this.contact?.id
        ? this.contact.name?.commonName
        : '';
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

  &.chat-message--md {
    .chat-message__main-wrapper {
      max-width: 80%;
    }
  }

  .chat-message-avatar {
    flex: 0 0 32px;
  }

  .chat-message__main-wrapper {
    display: flex;
    flex-direction: column;
    width: fit-content;
    min-width: 0;
    line-height: 0; // prevents height difference from its content
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
