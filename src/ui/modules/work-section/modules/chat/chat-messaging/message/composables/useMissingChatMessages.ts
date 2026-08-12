import { ref, watch } from 'vue';

import CatalogAPI from '../../../../../../../../app/api/agent-workspace/endpoints/catalog/CatalogAPIRepository';
import { formatChatMessages } from '../../../../../../../../features/modules/chat/scripts/formatChatMessages';

export const useMissingChatMessages = (chatId, hasMissingMessages: boolean) => {
	const messages = ref([]);

	const getMissingMessages = async (id: string) => {
		try {
			const { items } = await CatalogAPI.getChatMessagesList({
				chatId: id,
			});

			messages.value = formatChatMessages(items);
			console.log('useMissingChatMessages messages', items, messages.value);
		} catch {
			messages.value = [];
		}
	};

	watch(
		() => chatId,
		async (id) => {
			if (id && hasMissingMessages) {
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
