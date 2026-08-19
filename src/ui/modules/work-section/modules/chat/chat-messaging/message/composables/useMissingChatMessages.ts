import { type Ref, ref, watch } from 'vue';

import CatalogAPI from '../../../../../../../../app/api/agent-workspace/endpoints/catalog/CatalogAPIRepository';
import { formatChatMessages } from '../../../../../../../../features/modules/chat/scripts/formatChatMessages';

export const useMissingChatMessages = (
	chatId: Ref<string | null>,
	hasMissingMessages: Ref<boolean>,
) => {
	const messages = ref([]);

	const getMissingMessages = async (id: string) => {
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

		messages.value = apiMessages.slice(0, 1);
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
