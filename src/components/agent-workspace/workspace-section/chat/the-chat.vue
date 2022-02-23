<template>
  <section class="the-chat">
    <media-viewer/>
    <chat-header></chat-header>
<!--    <chat-messaging-container/>-->
    <chat-transfer-container></chat-transfer-container>
  </section>
</template>

<script>
import MediaViewer from './media-viewer/media-viewer.vue';
import ChatHeader from './chat-header/chat-header.vue';
import ChatMessagingContainer from './chat-messaging-container/chat-messaging-container.vue';
import ChatTransferContainer from './chat-transfer-container/chat-transfer-container.vue';

export default {
  name: 'the-chat',
  components: {
    MediaViewer,
    ChatHeader,
    ChatMessagingContainer,
    ChatTransferContainer,
  },
};
</script>

<style lang="scss" scoped>
.the-chat {
  display: flex;
  flex-direction: column;
  height: 100%;

  .chat-messaging-container,
  .chat-transfer-container {
    flex-grow: 1;
  }
  .chat-transfer-container.ws-worksection {
    height: auto;
    min-height: 0;
  }
}
</style>
