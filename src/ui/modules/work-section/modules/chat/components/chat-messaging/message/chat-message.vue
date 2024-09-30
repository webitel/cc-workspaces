<template>
  <div
    :class="{
     'chat-message--right' : isAgentSide,
     'chat-message--md': props.size === 'md'
    }"
    class="chat-message"
  >
    <slot name="before-message" />

    <div class="chat-message__content">
      <message-avatar
        :bot="isBot"
        :message="props.message"
        :show-avatar="props.showAvatar"
      />
      <!--    click.stop prevents focus on textarea and allows to select the message text -->
      <div @click.stop>
        <message-player
          v-if="props.message.file"
          :file="props.message.file"
          :size="props.size"
          @initialized="handlePlayerInitialize"
        />
        <message-image
          :file="props.message.file"
          @open="emit('open-image')"
        />
        <message-document
          :file="props.message.file"
          :agent-side="isAgentSide"
        />
        <message-text
          :text="props.message.text"
          :agent-side="isAgentSide"
        />
      </div>
      <message-time
        :date="props.message.date"
      />
    </div>

    <slot name="after-message" />
  </div>
</template>

<script setup>

import { computed, defineProps, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';

import MessageAvatar from './chat-message-avatar.vue';
import MessagePlayer from './chat-message-player.vue';
import MessageText from './chat-message-text.vue';
import MessageImage from './chat-message-image.vue';
import MessageDocument from './chat-message-document.vue';
import MessageTime from './chat-message-time.vue';

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  size: {
    type: String,
    default: 'md',
    options: ['sm', 'md'],
  },
  showAvatar: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['open-image', 'initialized-player']);

const { t } = useI18n();

const isAgent = computed(() => props.message.peer?.type === 'user');

const isBot = computed(() => props.message.peer?.type === 'bot');

const isAgentSide = computed(() => isAgent.value || isBot.value);

function handlePlayerInitialize(player) {
  emit('initialized-player', { player });
}

</script>

<style lang="scss" scoped>

.chat-message {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0 var(--spacing-2xs) var(--spacing-2xs);
  max-width: 100%;
  gap: var(--spacing-2xs);

  &__content {
    display: flex;
    flex: 1;
    min-width: 0;
    line-height: 0; // prevents height difference from its content
    gap: var(--spacing-xs);
    margin: 0 var(--spacing-xs) 0 0;
  }

  &.chat-message--md {
    .chat-message__main-wrapper {
      max-width: 80%;
    }
  }

  .chat-message-avatar {
    flex: 0 0 var(--spacing-lg);
  }

  &--right .chat-message__content {
    flex-direction: row-reverse;
    margin: 0 0 0 var(--spacing-xs);
  }
}
</style>
