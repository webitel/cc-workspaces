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
    <messages-container
      :size="size"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import dropzoneMixin from '../../../../../../../app/mixins/dropzoneMixin';
import MessagesContainer from './chat-messages/chat-messages-container.vue';

export default {
  name: 'chat-messaging-container',
  mixins: [dropzoneMixin],
  components: {
    MessagesContainer,
  },
  props: {
    size: {
      type: String,
      default: 'md',
      options: ['sm', 'md'],
    },
  },
  methods: {
    ...mapActions('features/chat', {
      sendFile: 'SEND_FILE',
    }),
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
  height: 100%;

  .chat-messages-container {
    flex: 1 1 0;
  }
}
</style>
