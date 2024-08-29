<template>
  <div
    class="chat-messaging"
    @dragenter.prevent="handleDragEnter"
  >
    <dropzone
      v-show="isDropzoneVisible"
      @dragenter.prevent
      @dragleave.prevent="handleDragLeave"
      @drop="handleDrop"
    />
    <current-chat
      :size="size"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import dropzoneMixin from '../../../../../../../app/mixins/dropzoneMixin';
import CurrentChat from './current-chat/current-chat.vue';

export default {
  name: 'chat-messaging-container',
  mixins: [dropzoneMixin],
  components: {
    CurrentChat,
  },
  props: {
    size: {
      type: String,
      default: 'md',
      options: ['sm', 'md'],
    },
  },
  computed: {
    ...mapGetters('features/chat', {
      chat: 'CHAT_ON_WORKSPACE',
    }),
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
.chat-messaging {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
