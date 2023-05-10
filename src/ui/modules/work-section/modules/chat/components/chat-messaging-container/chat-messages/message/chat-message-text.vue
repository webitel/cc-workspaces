<template>
  <p
    v-if="text"
    class="chat-message-text"
    v-html="text"
  ></p>
</template>

<script>
import anchorme from 'anchorme';
import purify from 'dompurify';
import chatMessageDetailMixin from '../../../../mixins/chatMessageDetailMixin';

export default {
  name: 'chat-message-text',
  mixins: [chatMessageDetailMixin],
  computed: {
    text() {
      if (!this.message.text) return '';
      // ATTENTION: not all libs are suitable for this case, because we want to preserve "<" signs
      // https://my.webitel.com/browse/DEV-2848
      return anchorme({
        input: purify.sanitize(this.message.text),
        options: {
          attributes: {
            target: '_blank',
            class: 'chat-message-text__link',
          },
        },
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
