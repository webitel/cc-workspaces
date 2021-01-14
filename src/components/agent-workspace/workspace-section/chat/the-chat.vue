<template>
  <div class="the-chat">
    <chat-preview/>
    <media-viewer/>
  </div>
</template>

<script>
import ChatPreview from './chat-preview/chat-preview.vue';
import MediaViewer from './shared/media-viewer/media-viewer.vue';

export default {
  name: 'the-chat',
  components: {
    ChatPreview,
    MediaViewer,
  },
};
</script>

<style lang="scss" scoped>
.the-chat {
  height: 100%;
}
</style>
