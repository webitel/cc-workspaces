<template>
  <p
    v-if="text"
    class="chat-message-text typo-body-1"
    :class="{
      'chat-message-text--right': agent,
     }"
    v-html="text"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Autolinker from 'autolinker';


interface IChatMessageTextProps {
  text: string;
  agent?: boolean;
}

const props = withDefaults(defineProps<IChatMessageTextProps>(), {
  agent: false,
})

const text = computed(() => {
        if (!props.text) return '';
      // ATTENTION: not all libs are suitable for this case, because we want to preserve "<" signs
      // https://my.webitel.com/browse/DEV-2848
      return Autolinker.link(props.text, {
        newWindow: true,
        sanitizeHtml: true, // DONT FORGET TO SANITIZE, OR USE DOM PURIFY
        className: 'chat-message-text__link',
      });
})
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.chat-message-text {
  overflow-wrap: anywhere;
  white-space: pre-line; // read \n as "new line"
  padding: var(--spacing-xs);
  border-radius: var(--border-radius);
  background: var(--primary-light-color);
  color: var(--primary-on-color);
  place-self: flex-start;

  // reset links inside text
  :deep(.chat-message-text__link) {
    color: revert;
    text-decoration: revert;
  }

  &--right {
    background: var(--secondary-light-color);
    color: var(--secondary-on-color);
    place-self: flex-end;
  }
}

</style>
