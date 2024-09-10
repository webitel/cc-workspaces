<template>
  <p
    v-if="text"
    class="chat-message-text"
    :class="{
      'chat-message-text--my': my,
      'chat-message-text--bot': bot,
     }"
    v-html="text"
  ></p>
</template>

<script>
import Autolinker from 'autolinker';
import chatMessageDetailMixin from '../../../mixins/chatMessageDetailMixin.js';

export default {
  name: 'chat-message-text',
  mixins: [chatMessageDetailMixin],
  computed: {
    text() {
      if (!this.message.text) return '';
      // ATTENTION: not all libs are suitable for this case, because we want to preserve "<" signs
      // https://my.webitel.com/browse/DEV-2848
      return Autolinker.link(this.message.text, {
        newWindow: true,
        sanitizeHtml: true, // DONT FORGET TO SANITIZE, OR USE DOM PURIFY
        className: 'chat-message-text__link',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-message-text {
  @extend %typo-body-2;
  overflow-wrap: break-word;
  white-space: pre-line; // read \n as "new line"

  // reset links inside text
  :deep(.chat-message-text__link) {
    color: revert;
    text-decoration: revert;
  }
// client
  &:not(.chat-message-text--my) {
    color: var(--primary-on-color);
  }

  &.chat-message-text--my,
  &.chat-message-text--bot, {
    color: var(--secondary-on-color);
  }
}
</style>
