import { defineStore } from 'pinia';
import { ref } from 'vue';
import { contactChatMessagesHistory } from '@webitel/ui-sdk/src/api/clients/index';
import applyTransform, { notify } from '@webitel/ui-sdk/src/api/transformers/index';
import i18n from '../../../../app/locale/i18n';
import { formatChatMessages } from '../scripts/formatChatMessages';

const { t } = i18n.global;

export const useChatHistoryStore = defineStore('features/chat/chatHistory', () => {
  const chatHistoryMessages = ref<any[]>([]);
  const page = ref(1);
  const next = ref(false);
  const isLoaded = ref(false);

  const loadChatHistory = async (contactId: string) => {
    try {
      const { items, next: hasNext } = await contactChatMessagesHistory.getAllMessages({ contactId });
      const messages = formatChatMessages(items);
      chatHistoryMessages.value = messages;
      next.value = hasNext;
      isLoaded.value = true;
    } catch (err) {
      throw applyTransform(err, [
        notify(({ callback }) => callback({ type: 'error', text: t('errorNotifications.chatHistoryApi') })),
      ]);
    } finally {
      isLoaded.value = true;
    }
  };

  const loadNext = async (contactId: string) => {
    if (!next.value) return;
    page.value = page.value + 1;
    const { items, next: hasNext } = await contactChatMessagesHistory.getAllMessages({ contactId, page: page.value });
    const messages = formatChatMessages(items);
    chatHistoryMessages.value = [...messages, ...chatHistoryMessages.value];
    next.value = hasNext;
  };

  const resetChatHistory = () => {
    chatHistoryMessages.value = [];
    page.value = 1;
    next.value = false;
    isLoaded.value = false;
  };

  return {
    chatHistoryMessages,
    page,
    next,
    isLoaded,
    loadChatHistory,
    loadNext,
    resetChatHistory,
  };
});


