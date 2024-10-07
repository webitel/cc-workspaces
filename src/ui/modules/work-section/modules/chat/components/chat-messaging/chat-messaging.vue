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
    <div
      v-if="isChatActive"
      class="chat-messaging-text-entry"
    >
      <wt-textarea
        ref="message-draft"
        v-model="chat.draft"
        :placeholder="$t('workspaceSec.chat.draftPlaceholder')"
        chat-mode
        name="draft"
        @enter="sendMessage"
        @paste="handleFilePaste"
      />
      <div class="chat-messaging-text-entry__actions">
        <div class="file-input-wrapper">
          <wt-rounded-action
            class="rounded-action-file-input"
            color="secondary"
            icon="attach"
            :size="size"
            rounded
            wide
            @click="triggerAttachmentInput"
          />
          <input
            ref="attachment-input"
            class="rounded-action-file-input__input"
            type="file"
            multiple
            @change="handleAttachments"
          >
        </div>
        <chat-emoji
          :size="size"
          @insert-emoji="insertEmoji"
        />
        <wt-rounded-action
          icon="chat-send"
          color="accent"
          :size="size"
          rounded
          wide
          @click="sendMessage"
        />
      </div>
    </div>
  </div>
</template>

<script>

import { mapActions, mapGetters, mapState } from 'vuex';
import { useHotkeys } from '../../../../../../hotkeys/useHotkeys';
import insertTextAtCursor from 'insert-text-at-cursor';
import dropzoneMixin from '../../../../../../../app/mixins/dropzoneMixin';
import CurrentChat from './current-chat/current-chat.vue';
import ChatHistory from './chat-history/the-chat-history.vue';
import ChatEmoji from './components/chat-emoji.vue';
import HotkeyAction from '../../../../../../hotkeys/HotkeysActiom.enum';

export default {
  name: 'chat-messaging-container',
  components: {
    CurrentChat,
    ChatHistory,
    ChatEmoji,
  },
  mixins: [dropzoneMixin],
  inject: ['$eventBus'],
  data: () => ({
    hotkeyUnsubscribers : [],
  }),
  watch: {
    chat: {
      handler() {
        this.$nextTick(() => this.setDraftFocus());
      },
      immediate: true,
    },
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
    ...mapGetters('features/chat', {
      chat: 'CHAT_ON_WORKSPACE',
      isChatActive: 'IS_CHAT_ACTIVE',
    }),
  },
  methods: {
    ...mapActions('features/chat', {
      send: 'SEND',
      sendFile: 'SEND_FILE',
    }),
    setDraftFocus() {
      const messageDraft = this.$refs['message-draft'];
      if (!messageDraft) return;
      const textarea = messageDraft.$el.querySelector('textarea');
      if (!textarea) return;
      textarea.focus();
    },
    triggerAttachmentInput() {
      this.$refs['attachment-input'].click();
    },
    insertEmoji(unicode) {
      // view-source:https://bl.ocks.org/nolanlawson/raw/4f13bc639cdb3483efca8b657f30a1e0/
      const messageDraft = this.$refs['message-draft'];
      const textarea = messageDraft.$el.querySelector('textarea');
      insertTextAtCursor(textarea, unicode);
    },
    async sendMessage() {
      const { draft } = this.chat;
      try {
        this.chat.draft = '';
        await this.send(draft);
      } catch {
        this.chat.draft = draft;
        this.$eventBus.$emit('notification', {
          type: 'error',
          text: this.$t('error.general'),
        });
      }
    },
    setupHotkeys() {
      const subscripers = [
        {
          event: HotkeyAction.ACCEPT,
          callback: this.accept,
        },
      ];
      this.hotkeyUnsubscribers  = useHotkeys(subscripers);
    },
    handleDrop(event) {
      const files = Array.from(event.dataTransfer.files);
      this.sendFile(files);
      this.handleDragLeave();
    },
    handleFilePaste(event) {
      const files = Array
      .from(event.clipboardData.items)
      .map((item) => item.getAsFile())
      .filter((item) => !!item);
      if (files.length) {
        this.sendFile(files);
        event.preventDefault();
      }
    },
    async handleAttachments(event) {
      const files = Array.from(event.target.files);
      await this.sendFile(files);
    },
  },
  mounted() {
    this.$eventBus.$on('chat-input-focus', this.setDraftFocus);
    this.setupHotkeys();
  },
  unmounted() {
    this.$eventBus.$off('chat-input-focus', this.setDraftFocus);
    this.hotkeyUnsubscribers .forEach((unsubscribe) => unsubscribe());
  },
};
</script>

<style lang="scss" scoped>
.chat-messaging {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: var(--spacing-xs);
}

.chat-messaging-text-entry {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);

  &__actions {
    display: flex;
    gap: var(--spacing-xs);
  }
}

.file-input-wrapper {
  position: relative;
  width: 100%;

  .rounded-action-file-input__input {
    position: absolute;
    width: 0;
    height: 0;
    visibility: hidden;
  }
}
</style>
