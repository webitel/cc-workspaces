<template>
  <div
    v-if="document"
    class="chat-message-document"
    :class="{ 'chat-message-document--right': agent }"
    @click="downloadDocument"
  >
    <div class="chat-message-document__icon-wrapper">
      <wt-icon
        class="chat-message-document__icon"
        icon="attach"
      />
    </div>
    <div class="chat-message-document__info-wrapper">
      <a class="chat-message-document__name typo-subtitle-2" :title="document.name">
        {{ document.name }}
      </a>
      <div class="chat-message-document__size typo-caption">
        {{ documentSize }}
      </div>
    </div>
  </div>
</template>

<script>
import prettifyFileSize from '@webitel/ui-sdk/src/scripts/prettifyFileSize';

import chatMessageFileMixin from '../../../mixins/chatMessageFileMixin.js';

export default {
	name: 'ChatMessageDocument',
	mixins: [
		chatMessageFileMixin,
	],
	props: {
		agent: {
			type: Boolean,
			default: false,
		},
	},
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
@use '@webitel/ui-sdk/src/css/main' as *;

.chat-message-document {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  padding: var(--spacing-xs);
  background: var(--primary-light-color);
  border-radius: var(--border-radius);

  &__icon-wrapper {
    display: flex;
    justify-content: center;
    margin-right: var(--spacing-xs);
    padding: var(--spacing-2xs);
  }

  &__info-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
  }

  &__name {
    cursor: pointer;
    overflow-wrap: break-word;
    color: var(--text-main-color);
  }

  &__size {
    color: var(--text-main-color);
  }

  &--right {
    flex-direction: row-reverse;
    background: var(--secondary-light-color);

    .chat-message-document__icon-wrapper {
      margin-right: 0;
      margin-left: var(--spacing-xs);
    }
  }
}
</style>
