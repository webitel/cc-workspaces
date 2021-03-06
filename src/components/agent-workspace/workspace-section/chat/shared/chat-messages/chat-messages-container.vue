<template>
  <section class="chat-messages-container" @click="chatInputFocus">
    <div class="chat-messages-items" ref="chat-messages-items" v-chat-scroll>
      <scroll-observer
        :options="intersectionObserverOptions"
        @intersect="loadMessages"
      ></scroll-observer>
      <div v-for="(message, key) of messages" :key="message.id">
        <message-date
          v-if="showDate(key)"
          :time="message.createdAt"
        ></message-date>
        <message
          :message="message"
          :show-user-pic="showUserPic(key)"
        ></message>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import Message from './chat-message.vue';
import MessageDate from './chat-message-date.vue';
import ScrollObserver from '../../../../../utils/scroll-observer.vue';
import chatScroll from '../../../../../../directives/chatScroll';

export default {
  name: 'chat-messages-container',
  directives: { chatScroll },
  components: {
    Message,
    MessageDate,
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
    chatInputFocus() {
      this.$eventBus.$emit('chat-input-focus');
    },
    loadMessages() {
      console.info('intersection');
    },
    showDate(messageIndex) {
      if (messageIndex === 0) return true;
      const messageDate = new Date(this.messages[messageIndex].createdAt);
      const prevMessageDate = new Date(this.messages[messageIndex - 1].createdAt);
      return messageDate.getFullYear() !== prevMessageDate.getFullYear()
        || messageDate.getMonth() !== prevMessageDate.getMonth()
        || messageDate.getDate() !== prevMessageDate.getDate();
    },
    showUserPic(messageIndex) {
      if (messageIndex === 0) return true;
      const message = this.messages[messageIndex];
      const prevMessage = this.messages[messageIndex - 1];
      return message.member !== prevMessage.member;
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
