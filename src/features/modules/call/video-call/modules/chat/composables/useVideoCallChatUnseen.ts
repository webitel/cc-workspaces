import { computed, type Ref, watch } from 'vue';
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

	const videoCallChatUnseenCount = computed(() =>
		store.getters['features/chat/unseen/UNSEEN_COUNT'](videoCallChat.value),
	);
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

		store.commit('features/chat/unseen/ADD_UNSEEN_CHAT', videoCallChat.value);
	});

	watch(isOnChat, (isActive) => {
		if (isActive) {
			store.dispatch(
				'features/chat/unseen/MARK_CHAT_SEEN',
				videoCallChat.value,
			);
		}
	});

	watch(videoCallChat, (chat, prevChat) => {
		if (!chat && prevChat) {
			store.commit('features/chat/unseen/REMOVE_UNSEEN_CHAT', prevChat);
		}
	});

	return {
		isCallChatExist,
		videoCallChatUnseenBadge,
	};
}
