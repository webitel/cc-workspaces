<template>
  <article class="chat-history" @click="chatInputFocus">
    <div
      class="chat-history__messages"
      v-chat-scroll
    >
      <div
        class="chat-history__message-wrapper"
        v-for="(message) of messages"
        :key="message.id"
      >

        <chat-ended v-if="message.isChatEnded" />
        <chat-started
          v-if="message.isChatStarted"
          :provider="message.chat?.via?.type"
          :gateway="message.chat?.via?.name"
        />

        <chat-message
          :size="size"
          :message="message"
        />
      </div>
    </div>
  </article>
</template>

<script setup>

import { ref, computed, watch, inject } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import vChatScroll from '../../../../../../../../app/directives/chatScroll.js';
import ChatMessage from '../message/chat-message.vue';
import ChatEnded from './components/chat-ended.vue';
import ChatStarted from './components/chat-started.vue';

const props = defineProps({
  contactId: {
    type: String,
    require: true,
  },
  size: {
    type: String,
    default: 'md',
  },
});

const store = useStore();
const { t } = useI18n();
const eventBus = inject('$eventBus');

const namespace = 'features/chat/chatHistory';

const messages = computed(() => store.getters[`${namespace}/ALL_CONTACTS_MESSAGES`]);

const loadMessages = async () => {
  await store.dispatch(`${namespace}/LOAD_CHAT_HISTORY`, props.contactId);
}
const chatInputFocus = () => {
  eventBus.$emit('chat-input-focus');
};

watch(() => props.contactId, loadMessages, { immediate: true });

</script>

<style lang="scss" scoped>

.chat-history {
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;

  &__messages {
    @extend %wt-scrollbar;
    box-sizing: border-box;
    flex: 1 1;
    overflow-x: hidden;
    overflow-y: scroll;
    height: 100%;
  }
}

</style>
