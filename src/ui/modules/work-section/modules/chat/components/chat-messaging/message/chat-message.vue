<template>
  <div
    :class="{
     'chat-message--agent' : isAgentSide,
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
<!--      без обгортки-->
<!--      переназвати, якщо там також і відел в цьому компоненті-->
      <message-image
        :message="message"
        :my="my"
        @open="openImage"
      />
<!--      без обгортки-->
      <message-document
        :message="message"
        :my="my"
      />
      <message-text
        :bot="isBot"
        :message="message"
        :my="my"
      />
<!--      потрібна обгортка для тексту-->
    </div>
    <message-meta
      :message="message"
      :my="my"
    />
<!--    шо буде, якщо прибрати?-->
<!--    переназвати?-->
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
    isAgentSide() {
      return this.my || this.isAgent || this.isBot;
    },
    contactName() {
      // чи є якась ознака, що це контакт в message.peer ?
      return !this.isAgentSideMessage && this.contact?.id
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
$icon-width: 32px;

.chat-message {
  position: relative;
  display: flex;
  margin: var(--spacing-2xs) var(--spacing-sm) 0 var(--spacing-xs);
  max-width: 100%;
  gap: var(--spacing-xs);

  &.chat-message--md {
    .chat-message__main-wrapper {
      max-width: 80%;
    }
  }

  .chat-message-avatar {
    flex: 0 0 $icon-width;
  }

  .chat-message__main-wrapper {
    display: grid;
    width: fit-content;
    min-width: 0;
    line-height: 0; // prevents height difference from its content
  }

  &--agent {
    flex-direction: row-reverse;
    margin: var(--spacing-2xs) var(--spacing-xs) 0 var(--spacing-sm);
  }
}
</style>
