<template>
  <article
    class="chat-history chat-messages-container"
    @click="focusOnInput"
  >
    <wt-loader v-show="!showAllMessages" class="chat-history__loader" />
    <chat-container
      :readonly="isChatClosed"
      :messages="messages"
      :size="props.size"
      :can-load-next-messages="next"
      :is-next-messages-loading="isLoading"
      :contact="chatContact"
      :chat-id="chatId"
      :is-chat-closed="isChatClosed"
      :closed-chat-first-message-id="closedChatFirstMessageId"
      :class="{'chat-history__messages--processing': !showAllMessages}"
      :agent-name="agentName"
      @load-next-messages="loadNextMessages"
    >
      <template #footer />

      <template #before-message="{ message, index }">
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

      <template #after-message="{ message, index }">
        <chat-activity-info
          v-if="isChatStarted(index + 1) || isLastMessage(index)"
          ended
        />
      </template>
    </chat-container>
  </article>
</template>

<script setup>
import { ChatContainer } from '@webitel/ui-chats/ui';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState.js';
import { storeToRefs } from 'pinia';
import { computed, nextTick, onUnmounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useUserinfoStore } from '../../../../../userinfo/userinfoStore';
import ChatActivityInfo from '../components/chat-activity-info.vue';
import ChatAgent from '../components/chat-agent.vue';
import ChatDate from '../components/chat-date.vue';
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
const userinfoStore = useUserinfoStore();

const chatNamespace = 'features/chat';
const namespace = `${chatNamespace}/chatHistory`;

const { userInfo } = storeToRefs(userinfoStore);
const isLoading = ref(false);
const showAllMessages = ref(false);

const { messages, getMessage, isLastMessage, showChatDate, focusOnInput } =
	useChatMessages();

const next = computed(() => getNamespacedState(store.state, namespace).next);
const chat = computed(() => store.getters['features/chat/CHAT_ON_WORKSPACE']);
const isChatClosed = computed(
	() => store.getters['features/chat/closed/IS_CHAT_ON_WORKSPACE_CLOSED'],
);
const closedChatFirstMessageId = computed(
	() => store.state.features.chat.closed.closedChatFirstMessageId,
);
const chatId = computed(() => chat.value?.id);
const agentName = computed(
	() => userInfo.value.chatName || userInfo.value.name,
);
const chatContact = computed(() => ({
	...props.contact,
	name: {
		commonName: props.contact?.name,
	},
}));

const loadHistory = async () =>
	await store.dispatch(`${namespace}/LOAD_CHAT_HISTORY`, props.contact?.id);
const loadClosedChatHistory = async () =>
	await store.dispatch(
		`features/chat/closed/LOAD_CLOSED_CHAT_HISTORY`,
		chat.value,
	);
const resetHistory = () => store.dispatch(`${namespace}/RESET_CHAT_HISTORY`);

function isChatStarted(index) {
	const { prevMessage, message } = getMessage(index);
	return !!prevMessage && prevMessage?.chat?.id !== message?.chat?.id; // messages from different chats
}

function isHistoryStart(index) {
	// first message of all chat history
	return !next.value && index === 0;
}

function getChatProvider(message) {
	if (!message || !message.chat) return {};
	const { via } = message.chat || message.member; // chat history or current chat gateway
	return via
		? {
				type: via.type,
				name: via.name,
			}
		: {};
}

const loadNextMessages = async () => {
	if (isLoading.value || !next.value) return;
	isLoading.value = true;
	setTimeout(async () => {
		// timeout to avoid loader blinking
		await store.dispatch(`${namespace}/LOAD_NEXT`, props.contact?.id);
		await nextTick();

		isLoading.value = false;
	}, 200);
};

async function loadMessagesList() {
	if (!isChatClosed.value) {
		await loadHistory();
		await nextTick();
	} else {
		await loadClosedChatHistory();
		await nextTick();
	}

	setTimeout(() => {
		showAllMessages.value = true;
	}, 700); // wait for all media to load TODO: setTimeout can be removed after images/videos loading in chat will fixed
}

onUnmounted(() => {
	resetHistory();
});

watch(
	[
		() => props.contact?.id,
		() => chat.value?.id,
	],
	async () => {
		await loadMessagesList();
	},
	{
		immediate: true,
	},
);
</script>

<style lang="scss" scoped>
// reserve height for the loader to avoid unnecessary chat height changes https://webitel.atlassian.net/browse/WTEL-5366
.chat-history__observer-wrapper {
  min-height: calc(var(--spacing-lg)*2 + var(--icon-md-size)); // observer loader height
  // to place observer at the bottom of observer wrapper (closer to messages)
  display: flex;
  align-items: flex-end;
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
