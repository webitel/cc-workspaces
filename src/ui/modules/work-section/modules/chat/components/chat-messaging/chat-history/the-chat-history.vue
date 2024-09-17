<template>
  <article class="chat-history" @click="chatInputFocus">
    <div
      class="chat-history__messages"
      v-chat-scroll
    >
      <div
        v-for="(message, index) of messages"
        :key="message.id"
      >

        <chat-activity-info
          v-if="isChatStarted(index) || isLastMessage(index)"
          ended
        />
        <chat-activity-info
          v-if="isChatStarted(index)"
          :provider="getChatProvider(message).type"
          :gateway="getChatProvider(message).name"
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

import { computed, watch, inject } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import vChatScroll from '../../../../../../../../app/directives/chatScroll.js';
import ChatMessage from '../message/chat-message.vue';
import ChatActivityInfo from './components/chat-activity-info.vue';

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
const currentChatMessages = computed(() => store.getters[`${namespace}/CURRENT_CHAT_MESSAGES`]);
const currentChat = computed(() => store.getters['features/chat/CHAT_ON_WORKSPACE']);

const getMessage = (index) => {
  return {
    prevMessage: messages.value[index - 1],
    message: messages.value[index],
    nextMessage: messages.value[index + 1],
  }
}
const getChatProvider = (message) => {
  return  message.chat?.via
    ? { type: message.chat.via.type, // chats from history
      name: message.chat.via.name }
    : { type: currentChat.value.members[0].type, // from current chat
      name: currentChat.value.members[0].name }
}
const isChatStarted = (index) => {
  const { prevMessage, message, nextMessage } = getMessage(index);

 return prevMessage
   && nextMessage
   && prevMessage?.chat?.id !== message.chat?.id // messages from different chats
};

const isLastMessage = (index) => {
  const { nextMessage } = getMessage(index);
  !nextMessage && !currentChatMessages.value.length;
}

const loadMessages = async () => {
  await store.dispatch(`${namespace}/LOAD_CHAT_HISTORY`, props.contactId);
};
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
