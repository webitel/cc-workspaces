<template>
  <div class="chat-preview">
    <chat-header/>
    <chat-messages-container/>
    <chat-footer/>
  </div>
</template>

<script>
import ChatHeader from '../shared/chat-header/chat-header.vue';
import ChatMessagesContainer from '../shared/chat-messages/chat-messages-container.vue';
import ChatFooter from '../shared/chat-footer/chat-footer.vue';

export default {
  name: 'chat-preview',
  components: {
    ChatHeader,
    ChatMessagesContainer,
    ChatFooter,
  },
};
</script>

<style lang="scss" scoped>
.chat-preview {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 100%;
  min-height: 0;

  .chat-messages-container {
    flex: 1 1 100%;
  }
}
</style>
