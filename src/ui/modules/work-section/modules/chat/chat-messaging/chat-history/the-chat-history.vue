<template>
  <article class="chat-history chat-messages-container" @click="focusOnInput">
    <wt-replace-transition>
      <wt-loader v-if="!isHistoryLoaded"/>
      <div
        v-else
      ref="chat-messages-items"
      class="chat-history__messages chat-messages-items"
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
          :size="props.size"
          :show-avatar="showAvatar(index) || isChatStarted(index)"
          :username="props.contact?.name"
          @open-image="openMedia(message)"
          @initialized-player="attachPlayer"
        >
          <template #before-message>
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

          <template #after-message>
            <chat-activity-info
              v-if="isChatStarted(index + 1) || isLastMessage(index)"
              ended
            />
          </template>
        </message>
        <scroll-to-bottom-btn
          v-if="showScrollToBottomBtn"
          :new-message-count="newUnseenMessages"
          @scroll="scrollToBottom('smooth')"
        />
    </div>
    </wt-replace-transition>
  </article>
</template>

<script setup>
import WtReplaceTransition from '@webitel/ui-sdk/src/components/transitions/cases/wt-replace-transition.vue';
import { ComponentSize } from '@webitel/ui-sdk/src/enums/index.js';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState.js';
import { computed, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import { useStore } from 'vuex';

import ChatActivityInfo from '../components/chat-activity-info.vue';
import ChatAgent from '../components/chat-agent.vue';
import ChatDate from '../components/chat-date.vue';
import ScrollToBottomBtn from '../components/scroll-to-bottom-btn.vue';
import { useChatScroll } from '../composables/useChatScroll.js';
import Message from '../message/chat-message.vue';
import { useChatMessages } from '../message/composables/useChatMessages.js';

const props = defineProps({
  contact: {
    type: Object,
    require: true,
  },
  size: {
    type: String,
    default: ComponentSize.MD,
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

const {
  showScrollToBottomBtn,
  newUnseenMessages,
  scrollToBottom
} = useChatScroll(el);

const next = computed(() => getNamespacedState(store.state, namespace).next);

const isHistoryLoaded = computed(() => getNamespacedState(store.state, namespace).isLoaded);

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
}

function isHistoryStart(index) { // first message of all chats
  return !next.value && index === 0;
}

function getChatProvider(message) {
  const { via } = message.chat || message.member; // chat history or current chat gateway

  return { type: via?.type, name: via?.name };
}

watch(
  () => props.contact?.id,
  async () => await loadHistory(),
  { immediate: true }
);


onUnmounted(() => {
  resetHistory();
});

</script>

<style lang="scss" scoped>
</style>
