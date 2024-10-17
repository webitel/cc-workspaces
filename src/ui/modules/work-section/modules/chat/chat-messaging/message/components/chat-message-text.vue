<template>
  <p
    v-if="text"
    class="chat-message-text"
    :class="{
      'chat-message-text--right': agent,
     }"
    v-html="text"
  />
</template>

<script>
import Autolinker from 'autolinker';

export default {
  name: 'chat-message-text',
  props: {
    text: {
      type: String,
      required: true,
    },
    agent: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    text() {
      if (!this.text) return '';
      // ATTENTION: not all libs are suitable for this case, because we want to preserve "<" signs
      // https://my.webitel.com/browse/DEV-2848
      return Autolinker.link(this.text, {
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
  overflow-wrap: anywhere;
  white-space: pre-line; // read \n as "new line"
  padding: var(--spacing-xs);
  border-radius: var(--border-radius);
  background: var(--primary-light-color);

  // reset links inside text
  :deep(.chat-message-text__link) {
    color: revert;
    text-decoration: revert;
  }

  &--right {
    background: var(--secondary-light-color);
  }
}

</style>
