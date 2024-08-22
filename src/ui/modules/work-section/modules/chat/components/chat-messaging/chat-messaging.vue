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
    <chat-history
      v-if="contact.id"
    />
    <regular-chat
      v-else
      :size="size"
    />
  </div>
</template>

<script>
// в цьому компоненті визначати, який буде показано чат: звичайний чи історію чатів - перевіряти чи є contact.id
import { mapActions } from 'vuex';
import dropzoneMixin from '../../../../../../../app/mixins/dropzoneMixin';
import RegularChat from './regular-chat/regular-chat.vue';
import ChatHistory from './chat-history/the-chat-history.vue';

export default {
  name: 'chat-messaging-container',
  mixins: [dropzoneMixin],
  components: {
    RegularChat,
    ChatHistory,
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
.chat-messaging {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  //.chat-messages-container {
  //  flex: 1 1 0;
  //}
}
</style>
