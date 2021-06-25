<template>
  <div class="chat-preview" @dragenter.prevent="handleDragEnter">
    <dropzone
      v-show="isDropzoneVisible"
      @dragenter.prevent
      @dragleave.prevent="handleDragLeave"
      @drop="handleDrop"
    ></dropzone>
    <chat-header/>
    <chat-messages-container/>
    <chat-footer/>
  </div>
</template>

<script>
import {mapActions,} from 'vuex';
import Dropzone from '../../../../utils/dropzone.vue';
import ChatHeader from '../shared/chat-header/chat-header.vue';
import ChatMessagesContainer from '../shared/chat-messages/chat-messages-container.vue';
import ChatFooter from '../shared/chat-footer/chat-footer.vue';

export default {
  name: 'chat-preview',
  components: {
    Dropzone,
    ChatHeader,
    ChatMessagesContainer,
    ChatFooter,
  },
  data: () => ({
    isDropzoneVisible: false,
  }),
  methods: {
    ...mapActions('chat', {
      sendFile: 'SEND_FILE',
    }),
    handleDragEnter() {
      this.isDropzoneVisible = true;
    },
    handleDragLeave() {
      this.isDropzoneVisible = false;
    },
    handleDrop(event) {
      const files = Array.from(event.dataTransfer.files);
      this.sendFile(files);
      this.handleDragLeave();
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-preview {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  .chat-messages-container {
    flex: 1 1 0;
  }
}
</style>
