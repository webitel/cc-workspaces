<template>
  <section class="chat-messages-container">
    <div class="chat-messages-items" v-chat-scroll>
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
import chatScroll from '../../../../../../directives/chatScroll';

export default {
  name: 'chat-messages-container',
  directives: { chatScroll },
  components: {
    ChatMessage,
  },
  computed: {
    ...mapState('chat', {
      chat: (state) => state.chatOnWorkspace,
    }),
    messages() {
      return this.chat.messages;
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
