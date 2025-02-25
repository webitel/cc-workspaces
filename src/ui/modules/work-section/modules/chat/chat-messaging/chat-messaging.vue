<template>
  <div
    :key="chat.id"
    class="chat-messaging"
    :class="[
      `chat-messaging--${size}`,
    ]"
    @dragenter.prevent="handleDragEnter"
  >
    <dropzone
      v-show="isDropzoneVisible"
      @dragenter.prevent
      @dragleave.prevent="handleDragLeave"
      @drop="handleDrop"
    />
    <chat-history
      v-if="chat?.contact.id"
      :contact="contact"
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
        class="chat-messaging__textarea"
        :placeholder="$t('workspaceSec.chat.draftPlaceholder')"
        autoresize
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
import insertTextAtCursor from 'insert-text-at-cursor';
import { useHotkeys } from '../../../../../hotkeys/useHotkeys.js';
import dropzoneMixin from '../../../../../../app/mixins/dropzoneMixin.js';
import CurrentChat from './current-chat/current-chat.vue';
import ChatHistory from './chat-history/the-chat-history.vue';
import ChatEmoji from './components/chat-emoji.vue';
import HotkeyAction from '../../../../../hotkeys/HotkeysActiom.enum.js';
import { getLinkedContact } from '../scripts/getLinkedContact.js';
import { useScroll } from '@vueuse/core';

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
    // chatContact: null,
  }),
  watch: {
    chat: {
      async handler() {
        // this.chatContact = await getLinkedContact(this.chat, this.contact); // We must use this.chat.contact. This logic must be removed, when back-end will be able to return chat.contact: { id: fieldValue, name: fieldValue } (when contact was linked to chat)
        await this.$nextTick(() => {
          this.setDraftFocus()
        });
      },
      immediate: true,
    },
    // async contact() { // TODO: need to be removed after chat backend refactoring https://webitel.atlassian.net/browse/WTEL-6271
    //   this.chatContact = await getLinkedContact(this.chat, this.contact); // We must use this.chat.contact. This logic must be removed, when back-end will be able to return chat.contact: { id: fieldValue, name: fieldValue } (when contact was linked to chat)
    // },
  },
  props: {
    size: {
      type: String,
      default: 'md',
      options: ['sm', 'md'],
    },
    contact: {
      type: Object,
    },
  },
  computed: {
    // ...mapState('ui/infoSec/client/contact', {
    //   contact: state => state.contact,
    // }),
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
$chatGap: var(--spacing-2xs);
$roundedAction: calc(var(--rounded-action-padding)*2 + var(--rounded-action-border-size)*2);
$textEntryActionsMd: calc(var(--icon-md-size) + $roundedAction);
$textEntryActionsSm: calc(var(--icon-sm-size) + $roundedAction);

.chat-messaging {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: $chatGap;

  &--md {
    .chat-messaging__textarea {
      max-height: calc((100% - $textEntryActionsMd) - $chatGap);
    }
  }
  &--sm {
    .chat-messaging__textarea {
      max-height: calc((100% - $textEntryActionsSm) - $chatGap);
    }
  }
}

.chat-messaging-text-entry {
  display: flex;
  flex-direction: column;
  gap: $chatGap;
  max-height: 50%;

  &__actions {
    display: flex;
    gap: $chatGap;
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
