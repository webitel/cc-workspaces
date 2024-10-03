import { computed, inject } from 'vue';
import { useStore } from 'vuex';
import prettifyDate from '../../scripts/prettifyDate.js';
export const useChatMessages = () => {

  const store = useStore();
  const eventBus = inject('$eventBus');
  const namespace = 'features/chat';

  const messages = computed(() => store.getters[`${namespace}/ALL_CHAT_MESSAGES`]);

  function focusOnInput() {
    eventBus.$emit('chat-input-focus');
  }

  function getMessage(index) {
    return {
      prevMessage: messages.value[index - 1],
      message: messages.value[index],
      nextMessage: messages.value[index + 1],
    }
  }

  function showChatDate(index) {
    const { prevMessage, message } = getMessage(index);
    return prettifyDate(prevMessage?.createdAt) !== prettifyDate(message?.createdAt)
  }

  return {
    messages,

    getMessage,
    focusOnInput,
    showChatDate,
  };
};
