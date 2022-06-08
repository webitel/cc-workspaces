<template>
  <div
    class="chat-messaging-container"
    @dragenter.prevent="handleDragEnter"
  >
    <dropzone
      v-show="isDropzoneVisible"
      @dragenter.prevent
      @dragleave.prevent="handleDragLeave"
      @drop="handleDrop"
    ></dropzone>
    <messages-container/>
    <messaging-footer/>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Dropzone from '../../../../../../../app/components/utils/dropzone.vue';
import MessagesContainer from './chat-messages/chat-messages-container.vue';
import MessagingFooter from './chat-messaging-footer/chat-messaging-footer.vue';

export default {
  name: 'chat-messaging-container',
  components: {
    Dropzone,
    MessagesContainer,
    MessagingFooter,
  },
  data: () => ({
    isDropzoneVisible: false,
  }),
  methods: {
    ...mapActions('features/chat', {
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
.chat-messaging-container {
  position: relative;
  display: flex;
  flex-direction: column;

  .chat-messages-container {
    flex: 1 1 0;
  }
}
</style>
