<template>
  <footer class="chat-footer">
    <div v-if="isChatPreview" class="chat-footer__chat-preview">
      <div class="chat-footer__chat-preview-wrapper">
        <p class="chat-footer__chat-preview__text">{{ $t('workspaceSec.chat.acceptPreviewText') }}</p>
        <wt-button color="success" @click="accept">{{ $t('reusable.accept') }}</wt-button>
      </div>
    </div>
    <div v-else class="chat-footer__chat-active">
      <wt-textarea
        v-model="draft"
        :placeholder="$t('workspaceSec.chat.draftPlaceholder')"
        name="draft"
      ></wt-textarea>
      <div class="chat-footer__actions">
        <div class="chat-footer__cell-wrapper"></div>
        <div class="chat-footer__cell-wrapper">
          <wt-rounded-action icon="attach" color="secondary" @click="() => {}"></wt-rounded-action>
        </div>
        <div class="chat-footer__cell-wrapper"></div>
        <div class="chat-footer__cell-wrapper"></div>
        <div class="chat-footer__cell-wrapper"></div>
        <div class="chat-footer__cell-wrapper">
          <wt-rounded-action icon="chat-send" color="secondary" @click="send"></wt-rounded-action>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'chat-footer',
  data: () => ({
    draft: '',
  }),
  computed: {
    isChatPreview() {
      return true;
    },
  },
  methods: {
    ...mapActions('chat', {
      accept: 'ACCEPT',
      decline: 'CLOSE',
      send: '',
    }),
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
    @extend %typo-body-lg;
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
      display: flex;
      align-items: flex-start;
      justify-content: center;
    }
  }
}

</style>
