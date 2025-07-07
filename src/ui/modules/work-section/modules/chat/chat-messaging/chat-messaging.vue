<template>
  <div
    class="chat-messaging"
    :class="[
      `chat-messaging--${size}`,
    ]"
    @dragenter.prevent="handleDragEnter"
  >
      <dropzone
        v-if="isDropzoneVisible && !showQuickReplies"
        @dragenter.prevent
        @dragleave.prevent="handleDragLeave"
        @drop="handleDrop"
      />
      <chat-history
        v-if="contact?.id && !showQuickReplies"
        :contact="contact"
        :size="size"
      />
      <current-chat
        v-else-if="!showQuickReplies"
        :size="size"
      />

    <quick-replies
      v-show="showQuickReplies"
      :search="chat.draft"
      @close="closeQuickReplies"
      @select="selectQuickReply"
    />

    <div
      v-if="isChatActive"
      class="chat-messaging-text-entry"
    >
      <autocomplete-container
        v-if="isOpenAutocomplete"
        :list="autocompleteList"
        @select="selectAutocompleteOption"
      />

      <wt-textarea
        ref="message-draft"
        :value="chat.draft"
        class="chat-messaging__textarea"
        :placeholder="$t('workspaceSec.chat.draftPlaceholder')"
        autoresize
        name="draft"
        @enter="sendMessage"
        @paste="handleFilePaste"
        @keydown="onKeyDown"
        @input="inputMessage"
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
          icon="quick-replies"
          color="accent"
          :size="size"
          rounded
          wide
          @click="$emit('handle-quick-replies', true)"
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
import insertTextAtCursor from 'insert-text-at-cursor';
import { mapActions, mapGetters } from 'vuex';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import Dropzone from '../../../../../../app/components/utils/dropzone.vue';
import { useDropzoneHandlers } from '../../../../../composibles/useDropzoneHandlers.js';
import HotkeyAction from '../../../../../hotkeys/HotkeysActiom.enum.js';
import { useHotkeys } from '../../../../../hotkeys/useHotkeys.js';
import ChatHistory from './chat-history/the-chat-history.vue';
import ChatEmoji from './components/chat-emoji.vue';
import CurrentChat from './current-chat/current-chat.vue';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import QuickReplies from './quick-replies/components/quick-replies.vue';
import AutocompleteContainer from './autocomplete/components/autocomplete-container.vue';
import { useAutocomplete } from './autocomplete/composables/useAutocomplete';
import { AutocompleteOptions } from './autocomplete/enums/AutocompleteOptions';

export default {
  name: 'ChatMessagingContainer',
  components: {
    Dropzone,
    CurrentChat,
    ChatHistory,
    ChatEmoji,
    QuickReplies,
    AutocompleteContainer,
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
    showQuickReplies: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['handle-quick-replies'],
  setup() {
    const { t } = useI18n();

    const autocompleteOptions = computed(() => [
      {
        name: t('autocompleteList.quickReplies'),
        text: t('autocompleteList.quickRepliesDescription'),
        id: AutocompleteOptions.QUICK_REPLIES
      },
    ]);

    const {
      isDropzoneVisible,
      handleDragEnter,
      handleDragLeave
    } = useDropzoneHandlers();

    const {
      isOpenAutocomplete,
      autocompleteList,
      onInput: inputAutocomplete,
      onKeyDown,
      close: closeAutocomplete,
    } = useAutocomplete(autocompleteOptions);

    return {
      isDropzoneVisible,
      handleDragEnter,
      handleDragLeave,

      isOpenAutocomplete,
      autocompleteList,
      inputAutocomplete,
      onKeyDown,
      closeAutocomplete,
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
    hideQuickRepliesPanel() {
      // author @Lera24
      // https://webitel.atlassian.net/browse/WTEL-4923
      // Because quick replies open and close with animation. And need slow change of content
      this.$nextTick(() => {
        setTimeout(() => {
          this.$emit('handle-quick-replies', false);
        }, 300);
      });
    },
    selectQuickReply({text}) {
      this.chat.draft = this.chat.draft ? `${this.chat.draft} ${text}` : text;
      this.hideQuickRepliesPanel();
    },
    closeQuickReplies() {
      this.chat.draft = '';
      this.hideQuickRepliesPanel();
    },
    selectAutocompleteOption({id}) {
      switch(id) {
        case AutocompleteOptions.QUICK_REPLIES:
          this.openQuickReplies();
          break;
        default:
          console.warn(`Unknown autocomplete option selected: ${id}`);
      }
    },
    openQuickReplies() {
      this.closeAutocomplete();
      this.chat.draft = this.chat.draft.slice(0, -1);
      this.$emit('handle-quick-replies', true);
    },
    inputMessage(event) {
      this.chat.draft = event;
      this.inputAutocomplete(event);
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
  position: relative;

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
