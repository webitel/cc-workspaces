<template>
  <p
    v-if="text"
    class="chat-message-text"
    v-html="text"
  ></p>
</template>

<script>
import linkifyHtml from 'linkify-html';
import chatMessageDetailMixin from '../../../../mixins/chatMessageDetailMixin';

export default {
  name: 'chat-message-text',
  mixins: [chatMessageDetailMixin],
  computed: {
    text() {
      if (!this.message.text) return '';
      return linkifyHtml(this.message.text, {
        className: 'chat-message-text__link',
        target: '_blank',
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
  ::v-deep .chat-message-text__link {
    color: revert;
    text-decoration: revert;
  }
}
</style>
