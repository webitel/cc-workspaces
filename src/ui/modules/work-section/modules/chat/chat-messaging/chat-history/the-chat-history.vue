<template>
  <article class="chat-history chat-messages-container" @click="focusOnInput">
    <div
      ref="chat-messages-items"
      class="chat-history__messages chat-messages-items"
      v-chat-scroll
    >
      <wt-intersection-observer
        :next="next"
        :loading="nextLoading"
        @next="loadNextMessages"
      />
      <message
        v-for="(message, index) of messages"
        :key="message.id"
        :message="message"
        :size="size"
        :show-avatar="showAvatar(index) || isChatStarted(index)"
        :username="props.contact?.name"
        @open-image="openMedia(message)"
        @initialized-player="attachPlayer"
        @click="y = el.el.value.scrollHeight"
      >
        <template v-slot:before-message>
          <chat-date
            v-if="showChatDate(index) || isHistoryStart(index)"
            :date="message.createdAt"
          />
          <chat-activity-info
            v-if="isChatStarted(index) || isHistoryStart(index)"
            :provider="getChatProvider(message)?.type"
            :gateway="getChatProvider(message)?.name"
          />
          <chat-agent
            v-if="isChatStarted(index)"
            :chat-id="message.chat?.id"
            :contact-id="props.contact.id"
          />
        </template>

        <template v-slot:after-message>
          <chat-activity-info
            v-if="isChatStarted(index + 1) || isLastMessage(index)"
            ended
          />
        </template>
      </message>
    </div>
  </article>
</template>

<script setup>
import { watch, computed, ref, onUnmounted, onMounted, useTemplateRef, nextTick, onUpdated } from 'vue';
import { useStore } from 'vuex';
import { useChatMessages } from '../message/composables/useChatMessages.js';
import { useScroll } from '@vueuse/core';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState.js';
import vChatScroll from '../../../../../../../app/directives/chatScroll.js';
import Message from '../message/chat-message.vue';
import ChatDate from '../components/chat-date.vue';
import ChatActivityInfo from '../components/chat-activity-info.vue';
import ChatAgent from '../components/chat-agent.vue';

const props = defineProps({
  contact: {
    type: Object,
    require: true,
  },
  size: {
    type: String,
    default: 'md',
  },
});

const store = useStore();

const chatNamespace = 'features/chat';
const namespace = `${chatNamespace}/chatHistory`;

const nextLoading = ref(false);
const el = useTemplateRef('chat-messages-items');

const {
  messages,

  getMessage,
  isLastMessage,
  showChatDate,
  showAvatar,
  focusOnInput,
} = useChatMessages();

let { x, y, isScrolling, arrivedState } = useScroll(el);

const currentChat = computed(() => store.getters[`${chatNamespace}/CHAT_ON_WORKSPACE`]);
const next = computed(() => getNamespacedState(store.state, namespace).next);

const loadHistory = async () => await store.dispatch(`${namespace}/LOAD_CHAT_HISTORY`, props.contact?.id);
const resetHistory = () => store.dispatch(`${namespace}/RESET_CHAT_HISTORY`);

const attachPlayer = (player) => store.dispatch(`${chatNamespace}/chatMedia/ATTACH_PLAYER_TO_CHAT`, player);
const openMedia = (message) => store.dispatch(`${chatNamespace}/chatMedia/OPEN_MEDIA`, message);

const loadNextMessages = async () => {
  nextLoading.value = true;
  await store.dispatch(`${namespace}/LOAD_NEXT`, props.contact?.id);
  nextLoading.value = false;
}

function isChatStarted(index) {
  const { prevMessage, message, nextMessage } = getMessage(index);
  return prevMessage
    && nextMessage
    && prevMessage?.chat?.id !== message?.chat?.id // messages from different chats
};

function isHistoryStart(index) { // first message of all chats
  return !next.value && index === 0;
}

function getChatProvider(message) {
  if (message?.chat?.via) {
    return { type: message.chat.via.type, // chats from history
      name: message.chat.via.name }
  }
  if (currentChat.value?.members) {
    return { type: currentChat.value?.members[0]?.type, // from current chat
      name: currentChat.value?.members[0]?.name }
  }
};

// messages(зі стору), currentChat(зі стору), props.contact, el.value
watch([
  () => currentChat.value?.id,
  () => props.contact?.id
],  async () => {

    await loadHistory();

    await nextTick(() => {
      el.value.scrollTop = el.value?.scrollHeight;
    });

  },{ immediate: true });


watch(() => messages.value?.length,
  async (messagesLength, oldMessagesLength) => {

  const newMessages = messagesLength - oldMessagesLength;

    if (!messagesLength || !oldMessagesLength) el.value.scrollTop = el.value.scrollHeight;
    if (newMessages === 1 && messages.value[messagesLength - 1]?.member?.self) el.value.scrollTop = el.value.scrollHeight;
  },
  { flush: 'post' }
);

onUnmounted(() => {
  resetHistory();
});
</script>

<style lang="scss" scoped>
</style>
