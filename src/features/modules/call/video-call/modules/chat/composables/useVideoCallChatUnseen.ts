import { computed, type Ref, ref, watch } from 'vue';
import { useStore } from 'vuex';

export function useVideoCallChatUnseen(isOnChat: Ref<boolean>) {
	const store = useStore();

	const videoCallChat = computed(
		() => store.getters['features/call/videoCall/chat/VIDEO_CALL_CHAT'],
	);
	const videoCallChatMessages = computed(
		() =>
			store.getters['features/call/videoCall/chat/VIDEO_CALL_CHAT_MESSAGES'],
	);
	const isCallChatExist = computed(() => !!videoCallChat.value);

	const videoCallChatUnseenCount = ref(0);
	const videoCallChatUnseenBadge = computed(() =>
		videoCallChatUnseenCount.value
			? String(videoCallChatUnseenCount.value)
			: undefined,
	);

	/**
	 * @author OleksandrPalonnyi
	 *
	 * the video-call chat's messages arrive by mutating the SDK Conversation
	 * instance directly — there's no WS event to hook, so new messages are
	 * detected the same way useChatScroll does: by watching message count
	 *
	 * [WTEL-8866](https://webitel.atlassian.net/browse/WTEL-8866)
	 * */
	watch(videoCallChatMessages, (messages, prevMessages) => {
		const isNewMessage = messages?.length - (prevMessages?.length ?? 0) === 1;
		if (!isNewMessage || isOnChat.value) return;

		const lastMessage = messages.at(-1);
		if (lastMessage?.member?.self) return;

		videoCallChatUnseenCount.value += 1;
	});

	watch(isOnChat, (isActive) => {
		if (isActive) videoCallChatUnseenCount.value = 0;
	});

	watch(videoCallChat, (chat, prevChat) => {
		if (prevChat && chat?.conversationId !== prevChat.conversationId) {
			videoCallChatUnseenCount.value = 0;
		}
	});

	return {
		isCallChatExist,
		videoCallChatUnseenBadge,
	};
}
