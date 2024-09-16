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

const data = computed(() => store.getters[`${namespace}/ALL_CONTACTS_MESSAGES`]);
const currentChatMessages = computed(() => store.getters[`${namespace}/CURRENT_CHAT_MESSAGES`]);

const isChatStarted = (previousItem, item, nextItem) => {
 return previousItem // it means first(on top) downloaded message in history
  && previousItem?.chat?.id !== item.chat?.id // messages from different chats
  || !nextItem && currentChatMessages.value.length; // it means last message in history and after this started current chat messages
}

const messages = computed(() => data.value.map((item, index, array) => {
  const start = isChatStarted(array[index-1], item, array[index+1]);
  const end = start || !currentChatMessages.value.length;

    return {
      ...item,
      isChatStarted: start,
      isChatEnded: end,
    };
  }));

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
