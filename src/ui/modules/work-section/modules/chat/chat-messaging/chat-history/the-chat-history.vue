<template>
  <article
    v-element-size="handleChatResize"
    class="chat-history chat-messages-container"
    @click="focusOnInput"
  >
      <wt-loader v-show="!showAllMessages" class="chat-history__loader"/>
    <div
      ref="chat-container"
      class="chat-history__messages chat-messages-items"
      :class="{'chat-history__messages--processing': !showAllMessages}"
      @scroll="handleChatScroll"
    >
      <div v-if="next" class="chat-history__observer-wrapper">
        <wt-intersection-observer
          :canLoadMore="next"
          :loading="isLoading"
          @next="loadNextMessages"
        />
      </div>
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
      </div>
    <scroll-to-bottom-btn
      v-if="showScrollToBottomBtn"
      :new-message-count="newUnseenMessages"
      @scroll="scrollToBottom('smooth')"
    />
  </article>
</template>

<script setup>
import { vElementSize } from '@vueuse/components'; // for chat resize observer, when chat-messages-container size changes
import { ComponentSize } from '@webitel/ui-sdk/enums';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState.js';
import {
  computed,
  inject,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  useTemplateRef,
  watch,
} from 'vue';
import { useStore } from 'vuex';

import ChatActivityInfo from '../components/chat-activity-info.vue';
import ChatAgent from '../components/chat-agent.vue';
import ChatDate from '../components/chat-date.vue';
import ScrollToBottomBtn from '../components/scroll-to-bottom-btn.vue';
import { useChatScroll } from '../composables/useChatScroll';
import Message from '../message/chat-message.vue';
import { useChatMessages } from '../message/composables/useChatMessages';

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

const chatContainer = useTemplateRef('chat-container');
const isLoading = ref(false);
const lastVisibleMessageEl = ref(null);  // message on top of the chat
const showAllMessages = ref(false);

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
  scrollToBottom,
  handleChatScroll,
  handleChatResize,
} = useChatScroll(chatContainer);

const next = computed(() => getNamespacedState(store.state, namespace).next);
const chat = computed(() => store.getters['features/chat/CHAT_ON_WORKSPACE']);

const loadHistory = async () => await store.dispatch(`${namespace}/LOAD_CHAT_HISTORY`, props.contact?.id);
const resetHistory = () => store.dispatch(`${namespace}/RESET_CHAT_HISTORY`);

const attachPlayer = (player) => store.dispatch(`${chatNamespace}/chatMedia/ATTACH_PLAYER_TO_CHAT`, player);
const openMedia = (message) => store.dispatch(`${chatNamespace}/chatMedia/OPEN_MEDIA`, message);


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
  if (!message || !message.chat) return {};
  const { via } = message.chat || message.member; // chat history or current chat gateway
  return via
    ? { type: via.type, name: via.name }
    : {};
}

const getTopMessageEl = () => { // help to fix chat viewing position when new messages was loaded
  if (!chatContainer.value.children) return;

  lastVisibleMessageEl.value = chatContainer.value.getElementsByClassName('chat-message')[0]; // to remember last visible message before load more
}

const loadNextMessages = async () => {
  if (isLoading.value || !next.value) return;
  isLoading.value = true;

  setTimeout(async () => { // timeout to avoid loader blinking
    await store.dispatch(`${namespace}/LOAD_NEXT`, props.contact?.id);
    await nextTick();

    if (lastVisibleMessageEl.value?.scrollIntoView) { // fast return the scroll view on prev position
      lastVisibleMessageEl.value.scrollIntoView({ block: 'start', behavior: 'auto' })
    }

    isLoading.value = false;
  }, 200);

  getTopMessageEl();
}

async function loadMessagesList() {
  await loadHistory();
  await nextTick(() => {
    scrollToBottom();
  });
  setTimeout(() => {
    focusOnInput() //  manually focus textarea after load message to fix emoji insertion on first interaction
    showAllMessages.value = true
  }, 700); // wait for all media to load TODO: setTimeout can be removed after images/videos loading in chat will fixed
}
onMounted(() => {
  getTopMessageEl();
})

watch(
  () => props.contact?.id,
  async () => {
    loadMessagesList()
    // await loadHistory();
    // await nextTick();
    // scrollToBottom();
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
// reserve height for the loader to avoid unnecessary chat height changes https://webitel.atlassian.net/browse/WTEL-5366
.chat-history__observer-wrapper {
  min-height: calc(var(--spacing-lg)*2 + var(--icon-md-size)); // observer loader height
  // to place observer at the bottom of observer wrapper (closer to messages)
  display: flex;
  align-items: flex-end;
}
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
