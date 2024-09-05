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
      v-if="contactId"
      :contact-id="contactId"
      :size="size"
    />
    <current-chat
      v-else
      :size="size"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import dropzoneMixin from '../../../../../../../app/mixins/dropzoneMixin';
import CurrentChat from './current-chat/current-chat.vue';
import ChatHistory from './chat-history/the-chat-history.vue';

export default {
  name: 'chat-messaging-container',
  mixins: [dropzoneMixin],
  components: {
    CurrentChat,
    ChatHistory,
  },
  props: {
    size: {
      type: String,
      default: 'md',
      options: ['sm', 'md'],
    },
  },
  computed: {
    ...mapState('ui/infoSec/client/contact', {
      contactId: (state) => state.contact?.id,
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
