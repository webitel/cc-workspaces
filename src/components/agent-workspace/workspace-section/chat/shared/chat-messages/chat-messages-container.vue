<template>
  <section class="chat-messages-container">
    <div class="chat-messages-items" ref="chat-messages-items" v-chat-scroll>
      <scroll-observer
        :options="intersectionObserverOptions"
        @intersect="loadMessages"
      ></scroll-observer>
      <chat-message
        v-for="message of messages"
        :message="message"
        :key="message.id"
      ></chat-message>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import ChatMessage from './chat-message.vue';
import ScrollObserver from '../../../../../utils/scroll-observer.vue';
import chatScroll from '../../../../../../directives/chatScroll';

export default {
  name: 'chat-messages-container',
  directives: { chatScroll },
  components: {
    ChatMessage,
    ScrollObserver,
  },
  data: () => ({
    isMounted: false,
  }),
  mounted() {
    this.isMounted = true;
  },
  computed: {
    ...mapState('chat', {
      chat: (state) => state.chatOnWorkspace,
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
    loadMessages() {
      console.info('intersection');
    },
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
  padding: 20px 10px;
}
</style>
