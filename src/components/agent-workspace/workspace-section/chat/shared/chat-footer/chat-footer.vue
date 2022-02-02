<template>
  <footer class="chat-footer">
    <div v-if="isChatPreview" class="chat-footer__chat-preview">
      <div class="chat-footer__chat-preview-wrapper">
        <p class="chat-footer__chat-preview__text">{{ $t('workspaceSec.chat.acceptPreviewText') }}</p>
        <wt-button color="success" @click="accept">{{ $t('reusable.accept') }}</wt-button>
      </div>
    </div>
    <div v-else-if="isChatActive" class="chat-footer__chat-active">
      <wt-textarea
        ref="message-draft"
        v-model="draft"
        :placeholder="$t('workspaceSec.chat.draftPlaceholder')"
        name="draft"
        chat-mode
        @paste="handleFilePaste"
        @enter="sendMessage"
      ></wt-textarea>
      <div class="chat-footer__actions">
        <div class="chat-footer__cell-wrapper"></div>
        <div class="chat-footer__cell-wrapper">
          <wt-rounded-action
            class="rounded-action-file-input"
            color="secondary"
          >
            <wt-icon icon="attach"></wt-icon>
            <input
              ref="attachment-input"
              class="rounded-action-file-input__input"
              type="file"
              multiple
              @change="handleAttachments"
            >
          </wt-rounded-action>
        </div>
        <div class="chat-footer__cell-wrapper"></div>
        <div class="chat-footer__cell-wrapper"></div>
        <div class="chat-footer__cell-wrapper"></div>
        <div class="chat-footer__cell-wrapper">
          <wt-rounded-action icon="chat-send" color="secondary" @click="sendMessage"></wt-rounded-action>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'chat-footer',
  data: () => ({
    draft: '',
  }),
  mounted() {
    this.$eventBus.$on('chat-input-focus', this.setDraftFocus);
  },
  destroyed() {
    this.$eventBus.$off('chat-input-focus', this.setDraftFocus);
  },
  watch: {
    isChatActive: {
      handler(value) {
        if (value) this.$nextTick(() => this.setDraftFocus());
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters('chat', {
      isChatPreview: 'ALLOW_CHAT_JOIN',
      isChatActive: 'IS_CHAT_ACTIVE',
    }),
  },
  methods: {
    ...mapActions('chat', {
      accept: 'ACCEPT',
      decline: 'CLOSE',
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

    async handleFilePaste(event) {
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
      const { draft } = this;
      try {
        this.draft = '';
        await this.send(draft);
      } catch {
        this.draft = draft;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-footer {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 10px;
}

.chat-footer__chat-preview {
  padding: 20px;
  border: 1px solid var(--main-page-bg-color);

  .chat-footer__chat-preview-wrapper {
    width: 66%;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
  }

  .chat-footer__chat-preview__text {
    @extend %typo-body-1;
    text-align: center;
    color: var(--text-outline-color);
    margin-bottom: 20px;
  }
}

.chat-footer__chat-active {
  .wt-textarea {
    margin-bottom: 10px;
  }

  .chat-footer__actions {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-gap: 10px;

    .chat-footer__cell-wrapper {
      position: relative;
      display: flex;
      align-items: flex-start;
      justify-content: center;
    }
  }
}
.rounded-action-file-input {
  position: relative;
  .rounded-action-file-input__input {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
}
</style>
