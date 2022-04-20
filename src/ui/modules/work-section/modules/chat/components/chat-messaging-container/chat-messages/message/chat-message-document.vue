<template>
  <div
    v-if="showDocument"
    class="chat-message-document"
    :class="{ 'chat-message-document--my': my }"
    @click="downloadDocument"
  >
    <div class="chat-message-document__icon-wrapper">
      <wt-icon
        class="chat-message-document__icon"
        icon="attach"
        :color="my ? 'primary' : 'contrast'"
      ></wt-icon>
    </div>
    <div class="chat-message-document__info-wrapper">
      <a class="chat-message-document__name" :title="document.name">{{ document.name }}</a>
      <div class="chat-message-document__size">{{ documentSize }}</div>
    </div>
  </div>
</template>

<script>
import prettifyFileSize from '@webitel/ui-sdk/src/scripts/prettifyFileSize';
import chatMessageDetailMixin from '../../../../mixins/chatMessageDetailMixin';

export default {
  name: 'chat-message-document',
  mixins: [chatMessageDetailMixin],
  computed: {
    documentSize() {
      if (!this.document) return '';
      return prettifyFileSize(this.document.size);
    },
  },
  methods: {
    downloadDocument() {
      const a = document.createElement('a');
      a.href = this.document.url;
      a.target = '_blank';
      a.download = this.document.name;
      a.click();
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-message-document {
  display: flex;
  cursor: pointer;

  &__icon-wrapper {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    border-radius: var(--border-radius);
    background: var(--chat-client-attachment-bg-color);
  }

  &__info-wrapper {
    min-height: 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
  }

  &__name {
    @extend %typo-subtitle-2;
    cursor: pointer;
    overflow-wrap: break-word;
  }

  &__size {
    @extend %typo-caption;
    color: var(--text-outline-color);
  }

  &--my {
    flex-direction: row-reverse;

    .chat-message-document__icon-wrapper {
      margin-right: 0;
      margin-left: 10px;
      background: var(--chat-agent-attachment-bg-color);
    }
  }
}
</style>
