<template>
  <section class="current-chat chat-messages-container" @click="chatInputFocus">
    <div class="chat-messages-items" ref="chat-messages-items" v-chat-scroll>
      <scroll-observer
        :options="intersectionObserverOptions"
        @intersect="loadMessages"
      />
      <message
        v-for="(message, index) of messages"
        :key="message.id"
        :message="message"
        :size="size"
        @open-image="openMedia(message)"
        @initialized-player="attachPlayer"
      >
        <template v-slot:before-message>
          <chat-date
            v-if="showChatDate(index)"
            :date="message.date || message.createdAt"
          />
        </template>
      </message>
    </div>
  </section>
</template>

<script>
import { mapActions } from 'vuex';
import { useChatMessage } from '../message/composables/useChatMessage.js';
import Message from '../message/chat-message.vue';
import chatDate from '../components/chat-date.vue';
import ScrollObserver from '../../../../../../../../app/components/utils/scroll-observer.vue';
import chatScroll from '../../../../../../../../app/directives/chatScroll';
import chatActivityInfo from '../components/chat-activity-info.vue';

export default {
  name: 'current-chat',
  directives: { chatScroll },
  components: {
    Message,
    chatDate,
    ScrollObserver,
    chatActivityInfo,
  },
  props: {
    size: {
      type: String,
      default: 'md',
      options: ['sm', 'md'],
    },
  },
  data: () => ({
    isMounted: false,
  }),
  setup() {
    const {
      messages,

      chatInputFocus,
      showChatDate,
      isChatStarted,
      getChatProvider,
    } = useChatMessage();

    return {
      messages,

      chatInputFocus,
      showChatDate,
      isChatStarted,
      getChatProvider,
    };
  },
  computed: {
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
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
