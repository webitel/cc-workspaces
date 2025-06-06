<template>
  <div
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
    <wt-replace-transition appear>
      <chat-history
        v-if="contact?.id"
        :contact="contact"
        :size="size"
      />
      <current-chat
        v-else
        :size="size"
      />
    </wt-replace-transition>
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
        <div class="chat-messaging-file-input-wrapper">
          <wt-rounded-action
            class="chat-messaging-file-input"
            color="secondary"
            icon="attach"
            :size="size"
            rounded
            wide
            @click="triggerAttachmentInput"
          />
          <input
            ref="attachment-input"
            class="chat-messaging-file-input__input"
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

import WtReplaceTransition from '@webitel/ui-sdk/src/components/transitions/cases/wt-replace-transition.vue';
import { ComponentSize } from '@webitel/ui-sdk/src/enums/index.js';
import insertTextAtCursor from 'insert-text-at-cursor';
import { mapActions, mapGetters } from 'vuex';

import Dropzone from '../../../../../../app/components/utils/dropzone.vue';
import { useDropzoneHandlers } from '../../../../../composibles/useDropzoneHandlers.js';
import HotkeyAction from '../../../../../hotkeys/HotkeysActiom.enum.js';
import { useHotkeys } from '../../../../../hotkeys/useHotkeys.js';
import ChatHistory from './chat-history/the-chat-history.vue';
import ChatEmoji from './components/chat-emoji.vue';
import CurrentChat from './current-chat/current-chat.vue';


export default {
  name: 'ChatMessagingContainer',
  components: {
    Dropzone,
    CurrentChat,
    ChatHistory,
    ChatEmoji,
    WtReplaceTransition,
  },
  inject: ['$eventBus'],
  props: {
    size: {
      type: String,
      default: ComponentSize.MD,
    },
    contact: {
      type: Object,
    },
  },
  setup() {
    const {
      isDropzoneVisible,
      handleDragEnter,
      handleDragLeave
    } = useDropzoneHandlers();

    return {
      isDropzoneVisible,
      handleDragEnter,
      handleDragLeave
    }
  },
  data: () => ({
    hotkeyUnsubscribers : [],
  }),
  computed: {
  ...mapGetters('features/chat', {
      chat: 'CHAT_ON_WORKSPACE',
      isChatActive: 'IS_CHAT_ACTIVE',
    }),
  },
  watch: {
    chat: {
      async handler() {
        // eslint-disable-next-line vue/valid-next-tick
        await this.$nextTick(() => {
          this.setDraftFocus()
        });
      },
      immediate: true,
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
      const subscribers = [
        {
          event: HotkeyAction.ACCEPT,
          callback: this.accept,
        },
      ];
      this.hotkeyUnsubscribers  = useHotkeys(subscribers);
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

.chat-messaging-file-input-wrapper {
  position: relative;
  width: 100%;
}

.chat-messaging-file-input__input {
  position: absolute;
  width: 0;
  height: 0;
  visibility: hidden;
}
</style>
