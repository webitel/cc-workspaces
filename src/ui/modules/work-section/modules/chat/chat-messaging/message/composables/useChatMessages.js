import { computed, inject } from 'vue';
import { useStore } from 'vuex';

import prettifyDate from '../../scripts/prettifyDate.js';
import { useMissingChatMessages } from './useMissingChatMessages';

export const useChatMessages = () => {
	const store = useStore();
	const eventBus = inject('$eventBus');
	const namespace = 'features/chat';

	const chatOnWorkspace = computed(
		() => store.getters[`${namespace}/CHAT_ON_WORKSPACE`],
	);

	const conversationId = computed(
		() => chatOnWorkspace.value?.conversationId || null,
	);
	const chatHasMissingMessages = computed(
		() => !!chatOnWorkspace.value?.hasMissingMessages,
	);

	const { messages: missingChatMessages } = useMissingChatMessages(
		conversationId,
		chatHasMissingMessages,
	);

	const failedFiles = computed(
		() => store.getters[`${namespace}/FAILED_FILES`] || [],
	);

	const messages = computed(() => {
		/**
		 * @author @OleksandrPalonnyi
		 *
		 * [WTEL-6706](https://webitel.atlassian.net/browse/WTEL-6706)
		 *
		 * failedFiles are recorded at the moment the upload fails, so
		 * chatOnWorkspace's real messages sent afterwards can already be newer
		 * */
		const currentMessages = [
			...(chatOnWorkspace.value?.messages || []),
			...failedFiles.value,
		].sort((a, b) => a.createdAt - b.createdAt);

		return [
			...store.state.features.chat.chatHistory.chatHistoryMessages,
			...missingChatMessages.value,
			...currentMessages,
		];
	});

	const isChatClosed = computed(
		() => store.getters[`${namespace}/closed/IS_CHAT_ON_WORKSPACE_WAS_CLOSED`],
	);

	function focusOnInput() {
		eventBus.$emit('chat-input-focus');
	}

	function getMessage(index) {
		return {
			prevMessage: messages.value[index - 1],
			message: messages.value[index],
			nextMessage: messages.value[index + 1],
		};
	}

	function isLastMessage(index) {
		return index === messages.value.length - 1 && isChatClosed.value;
	}

	function showChatDate(index) {
		const { prevMessage, message } = getMessage(index);
		const hasDate = prevMessage?.createdAt && message?.createdAt;

		return hasDate && prevMessage
			? prettifyDate(prevMessage?.createdAt) !==
					prettifyDate(message?.createdAt)
			: '';
	}

	const showAvatar = (index) => {
		const { prevMessage, message } = getMessage(index);

		const isBot = (msg) => !msg.channelId;

		return (
			index === 0 ||
			message.member?.type !== prevMessage.member?.type ||
			message.member?.name !== prevMessage.member?.name ||
			isBot(message) !== isBot(prevMessage)
		);
	};

	return {
		messages,

		showAvatar,
		getMessage,
		isLastMessage,
		focusOnInput,
		showChatDate,
	};
};
