<template>
  <p
    v-if="text"
    class="chat-message-text"
    v-html="text"
  ></p>
</template>

<script>
import Autolinker from 'autolinker';
import chatMessageDetailMixin from '../../../../mixins/chatMessageDetailMixin';

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
  @extend %typo-body-1;
  overflow-wrap: break-word;
  white-space: pre-line; // read \n as "new line"

  // reset links inside text
  ::v-deep .chat-message-text__link {
    color: revert;
    text-decoration: revert;
  }
}
</style>
