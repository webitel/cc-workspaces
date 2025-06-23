<template>
  <article class="chat-history chat-messages-container" @click="focusOnInput">
    <div
      ref="chatContainer"
      class="chat-history__messages chat-messages-items"
      @scroll="handleChatScroll"
    >
      <div class="topSpacer" :style="topSpacerStyle"/>

      <wt-intersection-observer
        :next="next"
        :loading="isLoading"
        @next="loadNextMessages"
      />
      <div
        v-for="(message, index) of messages"
        :key="message.id"
        :ref="onMessageRef(message.id, index)"
        class="chat-message"
      >
      <message
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
    </div>
    <scroll-to-bottom-btn
      v-if="showScrollToBottomBtn"
      :new-message-count="newUnseenMessages"
      @scroll="scrollToBottom('smooth')"
    />
  </article>
</template>

<script setup>
import { ComponentSize } from '@webitel/ui-sdk/enums';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState.js';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
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

const chatContainer = ref(null);
const isLoading = ref(false);
const lastVisibleMessageId = ref(null);
const lastMessageEl = ref(null);

const messageRefs = ref({});

const topSpacerHeight = ref(0);

// Computes inline style for top spacer based on accumulated scroll delta
const topSpacerStyle = computed(() =>
  `height: ${topSpacerHeight.value}px;
   display: block;
   width: 100%;
   flex-shrink: 0;`
);

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
} = useChatScroll(chatContainer);

const next = computed(() => getNamespacedState(store.state, namespace).next);

const loadHistory = async () => await store.dispatch(`${namespace}/LOAD_CHAT_HISTORY`, props.contact?.id);
const resetHistory = () => store.dispatch(`${namespace}/RESET_CHAT_HISTORY`);

const attachPlayer = (player) => store.dispatch(`${chatNamespace}/chatMedia/ATTACH_PLAYER_TO_CHAT`, player);
const openMedia = (message) => store.dispatch(`${chatNamespace}/chatMedia/OPEN_MEDIA`, message);

const loadNextMessages = async () => {
  if (!next.value && topSpacerHeight.value) topSpacerHeight.value = 0;
  if (isLoading.value || !next.value) return;
  isLoading.value = true;

  lastVisibleMessageId.value = messages.value[0]?.id;

  await store.dispatch(`${namespace}/LOAD_NEXT`, props.contact?.id);

  await nextTick()

  const targetEl = messageRefs.value[lastVisibleMessageId.value];

  if (targetEl?.scrollIntoView) {
    targetEl.scrollIntoView({ block: 'start', behavior: 'auto' })
  }

  isLoading.value = false;
}

const onMessageRef = (id, index) => el => {
  if (!el) return
  if (el) messageRefs.value[id] = el

  // якщо це останній елемент списку — оновити lastMessageEl
  if (index === messages.value.length - 1) {
    lastMessageEl.value = el
  }
}

const preventOverScroll = () => {
  const container = chatContainer.value
  const firstMessageEl = messages.value.length ? messageRefs.value[messages.value[0].id] : null

  if (!container || !firstMessageEl) return

  const minScrollTop = firstMessageEl.offsetTop - 10 // невеликий буфер
  if (container.scrollTop < minScrollTop || isLoading.value) {
    container.scrollTop = minScrollTop
  }
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
  return via
    ? { type: via.type, name: via.name }
    : {};
}

onMounted(() => {
  chatContainer.value?.addEventListener('scroll', preventOverScroll);
})

watch(
  () => props.contact?.id,
  async () => {
    await loadHistory();
    await nextTick()
    if (next.value) topSpacerHeight.value = 150;
    if (lastMessageEl.value?.scrollIntoView) {
      lastMessageEl.value.scrollIntoView({ block: 'end', behavior: 'auto' })
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  resetHistory();
  chatContainer.value?.removeEventListener('scroll', preventOverScroll);
});

</script>

<style lang="scss" scoped>
.chat-history__messages {
  display: flex;
  flex-direction: column;
}
.sentinel {
  height: 1px;
}
.top-spacer {
  display: block;
  width: 100%;
  flex-shrink: 0;
}
</style>
