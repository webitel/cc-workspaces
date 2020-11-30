<template>
  <section class="chat-messages-container">
    <div class="chat-messages-items" ref="items-container">
        <chat-message
          v-for="(i, key) of 20"
          :key="key"
          :my="!(i % 2)"
        ></chat-message>
      </div>
  </section>
</template>

<script>
import ChatMessage from './chat-message.vue';

export default {
  name: 'chat-messages-container',
  components: {
    ChatMessage,
  },
  mounted() {
    this.scrollToBottom();
  },
  methods: {
    scrollToBottom() {
      const chatEnd = this.$refs['items-container'];
      chatEnd.scrollTop = chatEnd.scrollHeight - chatEnd.offsetHeight;
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
  flex: 1 1;
  overflow-x: hidden;
  overflow-y: scroll;
  height: 100%;
}
</style>
