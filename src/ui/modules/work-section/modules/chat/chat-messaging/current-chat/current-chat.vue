<template>
  <section class="current-chat chat-messages-container" @click="focusOnInput">
    <wt-loader v-show="!showAllMessages" class="current-chat__loader" />
    <div
      ref="chat-container"
      class="current-chat__messages wt-scrollbar"
						:class="{ 'current-chat__messages--processing': !showAllMessages }"
      @scroll="handleChatScroll"
    >
      <div
        ref="chat-content"
        class="current-chat__content"
      >
        <div
          v-if="showLoadMoreObserver"
          class="current-chat__observer-wrapper"
        >
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
import {
	computed,
	nextTick,
	onUnmounted,
	ref,
	useTemplateRef,
	watch,
} from 'vue';
import { useStore } from 'vuex';
import ChatActivityInfo from '../components/chat-activity-info.vue';
import ChatDate from '../components/chat-date.vue';
import ScrollToBottomBtn from '../components/scroll-to-bottom-btn.vue';
import Message from '../message/chat-message.vue';
import { useChatMessages } from '../message/composables/useChatMessages.js';

const store = useStore();

const chatMediaNamespace = 'features/chat/chatMedia';
/**
 * @author PolinaSukhorukova-webitel
 *
 * [WTEL-10003](https://webitel.atlassian.net/browse/WTEL-10003)
 * Allows the auto scroll only for an already-closed chat on open, not when a
 * viewed chat closes into post-processing.
 */
let wasClosedOnOpen = false;

const props = defineProps({
	size: {
		type: String,
		default: ComponentSize.MD,
	},
});

const chatContainer = useTemplateRef('chat-container');
const chatContent = useTemplateRef('chat-content');

const OBSERVER_TIMEOUT_MS = 1500;
let showAllMessagesTimer;

const isLoading = ref(false);
const isReadyForPagination = ref(false);
const lastVisibleMessageEl = ref(null);
const showAllMessages = ref(false);

const currentChat = computed(
	() => store.getters[`features/chat/CHAT_ON_WORKSPACE`],
);
const isUnseen = computed(
	() => store.getters['features/chat/unseen/IS_CHAT_UNSEEN'],
);
const next = computed(() => store.state.features.chat.closed.next);
const isChatClosed = computed(() => !!currentChat.value?.closedAt);

const showLoadMoreObserver = computed(
	() =>
		isChatClosed.value &&
		!currentChat.value?.contact?.id &&
		next.value &&
		isReadyForPagination.value,
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
	isChatClosed,
	onBeforeStart: ({ scrollToBottom }) => {
		wasClosedOnOpen = false;
		scrollToBottom();
		startObserve();
	},
	onSeen: () => {
		if (currentChat.value?.id && isUnseen.value(currentChat.value)) {
			store.dispatch('features/chat/unseen/MARK_CHAT_SEEN', currentChat.value);
		}
	},
});

const { startObserve } = useObserveHeightUntilStable(
	chatContainer,
	() => {
		if (isLoading.value) return;
		if (currentChat.value?.closedAt && !wasClosedOnOpen) return;
		scrollToBottom('instant');
	},
	OBSERVER_TIMEOUT_MS,
);

const getTopMessageEl = () => {
	if (!chatContainer.value) return;
	lastVisibleMessageEl.value =
		chatContainer.value.getElementsByClassName('chat-message')[0];
};

const loadNextMessages = async () => {
	if (isLoading.value || !next.value) return;
	isLoading.value = true;
	getTopMessageEl();
	try {
		await store.dispatch('features/chat/closed/LOAD_MORE_CLOSED_CHAT_MESSAGES');
		await nextTick();
		lastVisibleMessageEl.value?.scrollIntoView?.();
	} finally {
		isLoading.value = false;
	}
};

const openMedia = (message) =>
	store.dispatch(`${chatMediaNamespace}/OPEN_MEDIA`, message);
const attachPlayer = (player) =>
	store.dispatch(`${chatMediaNamespace}/ATTACH_PLAYER_TO_CHAT`, player);
const cleanChatPlayers = (message) =>
	store.dispatch(`${chatMediaNamespace}/CLEAN_CHAT_PLAYERS`, message);

watch(
	() => currentChat.value?.id,
	async () => {
		isReadyForPagination.value = false;
		showAllMessages.value = false;
		clearTimeout(showAllMessagesTimer);
		showAllMessagesTimer = setTimeout(() => {
			showAllMessages.value = true;
		}, 700);
		if (!isChatClosed.value) return;

		wasClosedOnOpen = true;
		await nextTick();
		scrollToBottom('instant');
		startObserve();
		isReadyForPagination.value = true;
	},
	{
		immediate: true,
	},
);

onUnmounted(() => {
	cleanChatPlayers();
	clearTimeout(showAllMessagesTimer);
});
</script>

<style scoped>
.current-chat {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  width: 100%;
}

.current-chat__loader {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: fit-content;
}

.current-chat__messages {
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  opacity: 100%;
  transition: all var(--transition-fast);
}

.current-chat__messages--processing {
  opacity: 0;
}

.current-chat__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.current-chat__observer-wrapper {
  min-height: calc(var(--spacing-lg) * 2 + var(--icon-md-size));
  display: flex;
  align-items: flex-end;
}
</style>
