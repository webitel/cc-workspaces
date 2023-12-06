<template>
  <task-footer class="chat-footer">
    <div v-if="isChatPreview" class="chat-footer__chat-preview">
      <div class="chat-footer__chat-preview-wrapper">
        <p class="chat-footer__chat-preview__text">{{ $t('workspaceSec.chat.acceptPreviewText') }}</p>
        <wt-button color="chat" @click="accept">{{ $t('reusable.accept') }}</wt-button>
      </div>
    </div>
    <div
      v-else-if="chat.closedAt"
      class="chat-footer__chat-closed">
      <img
        alt="chat closed pic"
        src="../../../_shared/assets/chat-closed/chat-closed.svg"/>
      <p class="chat-footer__chat-closed__text">{{$t('workspaceSec.chat.closedСhat')}}</p>
    </div>
    <div v-else-if="isChatActive" class="chat-footer__chat-active">
      <wt-textarea
        ref="message-draft"
        v-model="chat.draft"
        :placeholder="$t('workspaceSec.chat.draftPlaceholder')"
        chat-mode
        name="draft"
        @enter="sendMessage"
        @paste="handleFilePaste"
      ></wt-textarea>
      <div class="chat-footer__actions">
        <div class="file-input-wrapper">
          <wt-rounded-action
            class="rounded-action-file-input"
            color="secondary"
            icon="attach"
            :size="size"
            rounded
            wide
            @click="triggerAttachmentInput"
          ></wt-rounded-action>
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
          ></chat-emoji>
          <wt-rounded-action
            icon="chat-send"
            color="accent"
            :size="size"
            rounded
            wide
            @click="sendMessage"
          ></wt-rounded-action>
      </div>
    </div>
  </task-footer>
</template>

<script>
import insertTextAtCursor from 'insert-text-at-cursor';
import { mapActions, mapGetters } from 'vuex';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import TaskFooter from '../../../_shared/components/task-footer/task-footer.vue';
import ChatEmoji from './chat-emoji.vue';

export default {
  name: 'chat-footer',
  components: {
    ChatEmoji,
    TaskFooter,
  },
  mixins: [sizeMixin],
  inject: ['$eventBus'],
  mounted() {
    this.$eventBus.$on('chat-input-focus', this.setDraftFocus);
  },
  destroyed() {
    this.$eventBus.$off('chat-input-focus', this.setDraftFocus);
  },
  watch: {
    chat: {
      handler() {
        this.$nextTick(() => this.setDraftFocus());
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters('features/chat', {
      chat: 'CHAT_ON_WORKSPACE',
      isChatPreview: 'ALLOW_CHAT_JOIN',
      isChatActive: 'IS_CHAT_ACTIVE',
    }),
  },
  methods: {
    ...mapActions('features/chat', {
      accept: 'ACCEPT',
      decline: 'CLOSE',
      send: 'SEND',
      sendFile: 'SEND_FILE',
    }),

    insertEmoji(unicode) {
      // view-source:https://bl.ocks.org/nolanlawson/raw/4f13bc639cdb3483efca8b657f30a1e0/
      const messageDraft = this.$refs['message-draft'];
      const textarea = messageDraft.$el.querySelector('textarea');
      insertTextAtCursor(textarea, unicode);
    },

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

    async sendMessage() {
      const { draft } = this.chat;
      try {
        this.chat.draft = '';
        await this.send(draft);
      } catch {
        this.chat.draft = draft;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-footer {
  display: flex;
  align-items: stretch;
  flex-direction: column;
}

.chat-footer__chat-preview {
  padding: var(--spacing-sm);
  border: 1px solid var(--main-page-bg-color);

  .chat-footer__chat-preview-wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 66%;
    min-width: 200px;
    margin: auto;
  }

  .chat-footer__chat-preview__text {
    @extend %typo-body-1;
    margin-bottom: 20px;
    text-align: center;
    color: var(--text-main-color);
  }
}

.chat-footer__chat-active {
  .wt-textarea {
    margin-bottom: var(--spacing-xs);
  }

  .chat-footer__actions {
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

.chat-footer__chat-closed {
  width: 122px;
  margin: 0 auto;
  text-align: center;
  white-space: nowrap;

  &__text {
    @extend %typo-subtitle-2;
  }
}
</style>
