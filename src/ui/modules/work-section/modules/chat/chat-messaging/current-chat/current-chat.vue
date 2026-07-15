<template>
  <section class="current-chat chat-messages-container" @click="focusOnInput">
    <div
      ref="chat-container"
      class="chat-messages-items wt-scrollbar"
      @scroll="handleChatScroll"
    >
      <div
        ref="chat-content"
        class="current-chat__content"
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
              v-if="showChatDate(index) || index === 0"
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
    </div>
    <scroll-to-bottom-btn
      v-if="showScrollToBottomBtn"
      :new-message-count="newUnseenMessagesCount"
      @scroll="scrollToBottom('smooth')"
    />
  </section>
</template>

<script setup>
import {
	useChatScroll,
	useObserveHeightUntilStable,
} from '@webitel/ui-chats/ui';
import { ComponentSize } from '@webitel/ui-sdk/src/enums/index.js';
import { computed, onUnmounted, useTemplateRef } from 'vue';
import { useStore } from 'vuex';
import ChatActivityInfo from '../components/chat-activity-info.vue';
import ChatDate from '../components/chat-date.vue';
import ScrollToBottomBtn from '../components/scroll-to-bottom-btn.vue';
import Message from '../message/chat-message.vue';
import { useChatMessages } from '../message/composables/useChatMessages.js';

const store = useStore();

const chatMediaNamespace = 'features/chat/chatMedia';

const props = defineProps({
	size: {
		type: String,
		default: ComponentSize.MD,
	},
});

const chatContainer = useTemplateRef('chat-container');
const chatContent = useTemplateRef('chat-content');

const currentChat = computed(
	() => store.getters[`features/chat/CHAT_ON_WORKSPACE`],
);

const {
	messages,

	showAvatar,
	showChatDate,
	focusOnInput,
	isLastMessage,
} = useChatMessages();

const {
	showScrollToBottomBtn,
	newUnseenMessagesCount,
	scrollToBottom,
	handleChatScroll,
} = useChatScroll({
	chatContainer,
	chatContent,
	messages,
	chatId: computed(() => currentChat.value?.id),
	isChatClosed: computed(() => false),
	onBeforeStart: ({ scrollToBottom }) => {
		scrollToBottom();
		startObserve();
	},
});

const { startObserve } = useObserveHeightUntilStable(chatContainer, () =>
	scrollToBottom('instant'),
);

const openMedia = (message) =>
	store.dispatch(`${chatMediaNamespace}/OPEN_MEDIA`, message);
const attachPlayer = (player) =>
	store.dispatch(`${chatMediaNamespace}/ATTACH_PLAYER_TO_CHAT`, player);
const cleanChatPlayers = (message) =>
	store.dispatch(`${chatMediaNamespace}/CLEAN_CHAT_PLAYERS`, message);

onUnmounted(() => {
	cleanChatPlayers();
});
</script>

<style lang="scss" scoped>
.current-chat__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
</style>
