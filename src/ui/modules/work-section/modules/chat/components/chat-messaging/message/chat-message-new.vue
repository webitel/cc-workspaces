<template>
  <section class="chat-message">
    <slot name="before-message"></slot>

    <div class="chat-message__content">
      <message-text :message="props.message" />
    </div>

    <slot name="after-message"></slot>
  </section>
</template>

<script setup>

import { mapState } from 'vuex';
import MessageAvatar from './chat-message-avatar.vue';
import MessageAudio from './chat-message-audio.vue';
import MessageText from './chat-message-text.vue';
import MessageImage from './chat-message-image.vue';
import MessageDocument from './chat-message-document.vue';
import MessageMeta from './chat-message-meta.vue';
import MessageDate from './chat-message-date.vue';

const props = defineProps({
  message: {
    type: Object,
    required: true,
  }
});

</script>

<style lang="scss" scoped>
.chat-message {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  gap: var(--spacing-xs);

}
</style>
