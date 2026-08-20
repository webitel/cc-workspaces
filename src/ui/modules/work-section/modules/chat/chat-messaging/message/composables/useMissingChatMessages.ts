import { computed, type Ref, ref, watch } from 'vue';

import CatalogAPI from '../../../../../../../../app/api/agent-workspace/endpoints/catalog/CatalogAPIRepository';
import { formatChatMessages } from '../../../../../../../../features/modules/chat/scripts/formatChatMessages';
import { useStore } from 'vuex';

export const useMissingChatMessages = (
	chatId: Ref<string | null>,
	hasMissingMessages: Ref<boolean>,
) => {
	const messages = ref([]);

	const store = useStore();

	const chatOnWorkspace = computed(
		() => store.getters[`features/chat/CHAT_ON_WORKSPACE`],
	);

	const getMissingMessages = async (id: string) => {
		const currentChatFirstMessageId = chatOnWorkspace.value?.messages[0].id;
		let apiMessages = [];

		try {
			const { items } = await CatalogAPI.getChatMessagesList({
				chatId: id,
			});

			apiMessages = formatChatMessages(items);
		} catch {
			apiMessages = [];
		}

		// chat could have been switched while the request was in flight
		if (chatId.value !== id) return;

		messages.value = apiMessages.filter(
			(message) => message.id !== currentChatFirstMessageId,
		);
	};

	watch(
		[
			chatId,
			hasMissingMessages,
		],
		async ([id, hasMissing]) => {
			if (id && hasMissing) {
				await getMissingMessages(id);
			} else {
				messages.value = [];
			}
		},
		{
			immediate: true,
		},
	);

	return {
		messages,
	};
};
