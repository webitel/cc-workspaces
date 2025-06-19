<template>
  <article class="chat-history chat-messages-container" @click="focusOnInput">
    <wt-replace-transition>
      <wt-loader v-show="!showAllMessages" class="chat-history__loader"/>
    </wt-replace-transition>
    <div
      ref="chat-messages-items"
      class="chat-history__messages chat-messages-items"
      :class="{'chat-history__messages--processing': !showAllMessages}"
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
  </article>
</template>

<script setup>
import WtReplaceTransition from '@webitel/ui-sdk/src/components/transitions/cases/wt-replace-transition.vue';
import { ComponentSize } from '@webitel/ui-sdk/src/enums/index.js';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState.js';
import { computed, nextTick, onUnmounted, ref, useTemplateRef, watch } from 'vue';
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
const showAllMessages = ref(false);
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
const chat = computed(() => store.getters['features/chat/CHAT_ON_WORKSPACE']);

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

async function loadMessagesList() {
  await loadHistory();
  await nextTick(() => {
    scrollToBottom();
  });
  setTimeout(() => showAllMessages.value = true, 700); // wait for all media to load TODO: setTimeout can be removed after images/videos loading in chat will fixed
}

watch(
  () => props.contact?.id,
  async () => {
    await loadMessagesList()
  },
  { immediate: true }
);

watch(() => chat.value?.id,
  async () => {
    await loadMessagesList()
    },
  { immediate: true }
);


onUnmounted(() => {
  resetHistory();
});

</script>

<style lang="scss" scoped>
.chat-history__messages {
  opacity: 100%;
  transition: all var(--transition-fast);

  &--processing {
    opacity: 0;
  }
}

.chat-history {
  position: relative;

  &__loader {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: fit-content;
  }
}
</style>
