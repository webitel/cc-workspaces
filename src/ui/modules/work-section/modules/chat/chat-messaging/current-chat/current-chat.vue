<template>
  <section class="current-chat chat-messages-container" @click="focusOnInput">
    <div
      ref="chat-messages-items"
      class="chat-messages-items wt-scrollbar"
      @scroll="handleChatScroll"
      @resize="updateThreshold"
    >
      <message
        v-for="(message, index) of messages"
        :key="message.id"
        :message="message"
        :size="props.size"
        :show-avatar="showAvatar(index)"
        @open-image="openMedia(message)"
        @initialized-player="attachPlayer"
      >
        <template #before-message>
          <chat-date
            v-if="showChatDate(index)"
            :date="message.createdAt"
          />
        </template>
        <template #after-message>
          <chat-activity-info
            v-if="isLastMessage(index)"
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
  </section>
</template>

<script setup>
import { ComponentSize } from '@webitel/ui-sdk/src/enums/index.js';
import { computed, onMounted, nextTick, onUnmounted, useTemplateRef, watch } from 'vue';
import { useStore } from 'vuex';

import ChatActivityInfo from '../components/chat-activity-info.vue';
import ChatDate from '../components/chat-date.vue';
import ScrollToBottomBtn from '../components/scroll-to-bottom-btn.vue';
import { useChatScroll } from '../composables/useChatScroll.js';
import Message from '../message/chat-message.vue';
import { useChatMessages } from '../message/composables/useChatMessages.js';

const store = useStore();

const chatMediaNamespace = 'features/chat/chatMedia';

const props = defineProps({
  size: {
    type: String,
    default: ComponentSize.MD,
  },
})

const el = useTemplateRef('chat-messages-items');
const currentChat = computed(() => store.getters[`features/chat/CHAT_ON_WORKSPACE`]);

const {
  messages,

  showAvatar,
  showChatDate,
  focusOnInput,
  isLastMessage,
} = useChatMessages();

const {
  showScrollToBottomBtn,
  newUnseenMessages,
  scrollToBottom,
  handleChatScroll,
  updateThreshold,
} = useChatScroll(el);

onUnmounted(() => {
  cleanChatPlayers();
})

const openMedia = (message) => store.dispatch(`${chatMediaNamespace}/OPEN_MEDIA`, message);
const attachPlayer = (player) => store.dispatch(`${chatMediaNamespace}/ATTACH_PLAYER_TO_CHAT`, player);
const cleanChatPlayers = (message) => store.dispatch(`${chatMediaNamespace}/CLEAN_CHAT_PLAYERS`, message);

watch(() => currentChat.value?.id,
  async () => {
    await nextTick(() => scrollToBottom());
  },{ immediate: true }
);

onUnmounted(() => {
  cleanChatPlayers();
})
</script>

<style lang="scss" scoped>
</style>
