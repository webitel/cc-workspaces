<template>
  <section class="current-chat chat-messages-container" @click="chatInputFocus">
    <div class="chat-messages-items" ref="chat-messages-items" v-chat-scroll>
      <scroll-observer
        :options="intersectionObserverOptions"
        @intersect="loadMessages"
      />
      <chat-message
        v-for="(message, key) of messages"
        :key="message.id"
        :message="message"
        :size="size"
        :show-avatar="showAvatar(key)"
        @open-image="openImage(message)"
        @initialized-player="handlePlayerInitialize"
      >
        <template v-slot:before-message>
          <chat-date
            v-if="showChatDate(key)"
            :date="message.date || message.createdAt"
          />
        </template>
      </chat-message>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ChatMessage from '../message/chat-message.vue';
import Message from '../message/chat-message.vue';
import ScrollObserver from '../../../../../../../../app/components/utils/scroll-observer.vue';
import chatScroll from '../../../../../../../../app/directives/chatScroll';
import chatDate from '../chat-history/components/chat-date.vue';
import chatActivityInfo from '../chat-history/components/chat-activity-info.vue';
import { useChatMessage } from '../message/composables/useChatMessage.js';

export default {
  name: 'current-chat',
  directives: { chatScroll },
  components: {
    ChatMessage,
    Message,
    ScrollObserver,
    chatActivityInfo,
    chatDate,
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
  setup() {
    const {
      messages,

      chatInputFocus,
      showChatDate,
    } = useChatMessage();

    return {
      messages,

      chatInputFocus,
      showChatDate,
    };
  },
  computed: {
    ...mapGetters('features/chat', {
      chat: 'CHAT_ON_WORKSPACE',
    }),
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
    loadMessages() {
      // console.info('intersection');
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
  height: 100%;
  padding: var(--spacing-2xs) 0;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
