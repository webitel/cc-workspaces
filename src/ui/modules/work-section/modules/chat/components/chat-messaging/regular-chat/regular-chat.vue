<template>
  <section class="regular-chat chat-messages-container" @click="chatInputFocus">
    <div class="chat-messages-items" ref="chat-messages-items" v-chat-scroll>
      <scroll-observer
        :options="intersectionObserverOptions"
        @intersect="loadMessages"
      />
      <div v-for="(message, key) of messages" :key="message.id">
        <message-date
          v-if="showDate(key)"
          :time="message.createdAt"
        />
        <message
          :size="size"
          :message="message"
          :show-avatar="showAvatar(key)"
          @open-image="openImage(message)"
          @initialized-player="handlePlayerInitialize"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Message from '../message/chat-message.vue';
import MessageDate from '../message/chat-message-date.vue';
import ScrollObserver from '../../../../../../../../app/components/utils/scroll-observer.vue';
import chatScroll from '../../../../../../../../app/directives/chatScroll';

export default {
  name: 'regular-chat',
  directives: { chatScroll },
  components: {
    Message,
    MessageDate,
    ScrollObserver,
  },
  props: {
    size: {
      type: String,
      default: 'md',
      options: ['sm', 'md'],
    },
  },
  inject: ['$eventBus'],
  data: () => ({
    isMounted: false,
  }),
  computed: {
    ...mapGetters('features/chat', {
      chat: 'CHAT_ON_WORKSPACE',
    }),
    messages() {
      return this.chat.messages;
    },
    intersectionObserverOptions() {
      if (this.isMounted) {
        return {
          root: this.$refs['chat-messages-items'],
          rootMargin: '100px',
        };
      }
      return null;
    },
  },
  methods: {
    ...mapActions('features/chat', {
      openMedia: 'OPEN_MEDIA',
      attachPlayer: 'ATTACH_PLAYER_TO_CHAT',
      cleanChatPlayers: 'CLEAN_CHAT_PLAYERS',
    }),
    chatInputFocus() {
      this.$eventBus.$emit('chat-input-focus');
    },
    loadMessages() {
      // console.info('intersection');
    },
    showDate(messageIndex) {
      if (messageIndex === 0) return true;
      const messageDate = new Date(this.messages[messageIndex].createdAt);
      const prevMessageDate = new Date(this.messages[messageIndex - 1].createdAt);
      return messageDate.getFullYear() !== prevMessageDate.getFullYear()
        || messageDate.getMonth() !== prevMessageDate.getMonth()
        || messageDate.getDate() !== prevMessageDate.getDate();
    },
    showAvatar(messageIndex) {
      if (messageIndex === 0) return true;
      const message = this.messages[messageIndex];
      const prevMessage = this.messages[messageIndex - 1];
      return (message.member !== prevMessage.member)
        && (message.member?.self && !prevMessage.member?.self);
    },
    openImage(message) {
      this.openMedia(message);
    },
    handlePlayerInitialize(player) {
      this.attachPlayer({ player });
    },
  },
  mounted() {
    this.isMounted = true;
  },
  destroyed() {
    this.cleanChatPlayers();
  },
};
</script>

<style lang="scss" scoped>
.chat-messages-container {
  display: flex;
  overflow: hidden;
}

.chat-messages-items {
  @extend %wt-scrollbar;
  box-sizing: border-box;
  flex: 1 1;
  overflow-x: hidden;
  overflow-y: scroll;
  height: 100%;
}

.chat-message {
  margin: var(--spacing-xs) var(--spacing-2xs) 0 0;
}
</style>
