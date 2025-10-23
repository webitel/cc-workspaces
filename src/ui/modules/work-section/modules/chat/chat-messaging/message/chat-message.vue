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
        :show-avatar="props.showAvatar"
        :username="getClientUsername"
      />
      <!--    click.stop prevents focus on textarea and allows to select the message text -->
      <message-blocked-error @click.stop v-if="!message.file?.malware" />
      <div @click.stop v-else>
        <message-player
          v-if="props.message.file"
          :file="props.message.file"
          :type="props.message.file?.mime"
          :size="props.size"
          @initialized="handlePlayerInitialize"
        />
        <message-image
          :file="props.message.file"
          :type="props.message.file?.mime"
          @open="emit('open-image')"
        />
        <message-document
          :file="props.message.file"
          :type="props.message.file?.mime"
          :agent="isAgentSide"
        />
        <message-text
          :text="props.message.text"
          :agent="isAgentSide"
        />
      </div>
      <message-time
        :date="props.message.createdAt"
      />
    </div>

    <slot name="after-message" />
  </div>
</template>

<script setup>

import { ComponentSize } from '@webitel/ui-sdk/enums';
import { computed, defineEmits, defineProps } from 'vue';

import MessageAvatar from './components/chat-message-avatar.vue';
import MessageDocument from './components/chat-message-document.vue';
import MessageImage from './components/chat-message-image.vue';
import MessagePlayer from './components/chat-message-player.vue';
import MessageText from './components/chat-message-text.vue';
import MessageTime from './components/chat-message-time.vue';
import MessageBlockedError from './components/chat-message-blocked-error.vue';

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  size: {
    type: String,
    default: ComponentSize.MD,
  },
  showAvatar: {
    type: Boolean,
    default: false,
  },
  username: {
    type: String,
  },
});

const emit = defineEmits(['open-image', 'initialized-player']);


const isAgent = computed(() =>
  props.message.member?.self
  || props.message.member?.type === 'webitel'
);

const isBot = computed(() =>
  props.message.member?.type === 'bot'
  || (!props.message.member?.type && !props.message.channelId)
);

const isAgentSide = computed(() => isAgent.value || isBot.value);

const getClientUsername = computed(() => {
  return !isAgentSide.value ? props.username : ''; // need to show username avatar only for client
});

function handlePlayerInitialize(player) {
  emit('initialized-player', { player });
};

</script>

<style lang="scss" scoped>
$message-gap: var(--spacing-xs);
$chat-info-gap: var(--spacing-2xs);

.chat-message {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  gap: $chat-info-gap;

  &:last-child {
    margin-bottom: $message-gap;
  }

  &__content {
    display: flex;
    flex: 1;
    min-width: 0;
    line-height: 0; // prevents height difference from its content
    gap: $message-gap;
    margin: 0 var(--spacing-md) 0 var(--spacing-2xs);
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
    margin: 0 var(--spacing-2xs) 0 var(--spacing-md);
  }

  .chat-message-avatar {
    flex: 0 0 var(--icon-lg-size);
  }
}
</style>
