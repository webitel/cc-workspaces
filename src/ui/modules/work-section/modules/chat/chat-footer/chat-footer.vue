<template>
  <task-footer class="chat-footer">
    <div v-if="isChatPreview" class="chat-footer__chat-preview">
      <div class="chat-footer__chat-preview-wrapper">
        <p class="chat-footer__chat-preview__text">{{ $t('workspaceSec.chat.acceptPreviewText') }}</p>
        <wt-button color="chat" @click="accept">{{ $t('reusable.accept') }}</wt-button>
      </div>
    </div>
  </task-footer>
</template>

<script>

import { mapActions, mapGetters } from 'vuex';

import sizeMixin from '../../../../../../app/mixins/sizeMixin.js';
import TaskFooter from '../../_shared/components/task-footer/task-footer.vue';

export default {
  name: 'ChatFooter',
  components: {
    TaskFooter,
  },
  mixins: [sizeMixin],
  computed: {
    ...mapGetters('features/chat', {
      chat: 'CHAT_ON_WORKSPACE',
      isChatPreview: 'ALLOW_CHAT_JOIN',
    }),
  },
  methods: {
    ...mapActions('features/chat', {
      accept: 'ACCEPT',
    }),
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
</style>
