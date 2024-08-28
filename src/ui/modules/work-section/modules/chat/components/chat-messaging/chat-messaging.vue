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
      :size="size"
    />
    <regular-chat
      v-else
      :size="size"
    />
  </div>
</template>

<script>

import { mapActions, mapGetters, mapState } from 'vuex';
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
  // тут має бути вотчер, який слідкує за зміною контакт айдішки
  computed: {
    ...mapGetters('features/chat', {
      chat: 'CHAT_ON_WORKSPACE',
    }),
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
  // mounted() {
  //   setInterval(() => {
  //     console.log('chat.contact:', this.chat?.contact);
  //   }, 3000)
  //   // this.subscribe(this.loadFlowsList);
  // }
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
