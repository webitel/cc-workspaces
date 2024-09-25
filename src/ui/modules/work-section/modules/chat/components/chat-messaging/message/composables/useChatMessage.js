import { computed, inject } from 'vue';
import { useStore } from 'vuex';
import prettifyDate from '../../chat-history/scripts/prettifyDate.js';
export const useChatMessage = () => {

  const store = useStore();
  const eventBus = inject('$eventBus');
  const namespace = 'features/chat';

  const messages = computed(() => store.getters[`${namespace}/ALL_CHAT_MESSAGES`]);
  const currentChat = computed(() => store.getters[`${namespace}/CHAT_ON_WORKSPACE`]);

  console.log('messages:', messages.value);

  function chatInputFocus() {
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
    return prettifyDate(prevMessage?.date) !== prettifyDate(message?.date)
  }

  function isChatStarted(index) {
    const { prevMessage, message, nextMessage } = getMessage(index);
    return prevMessage
      && nextMessage
      && prevMessage?.chat?.id !== message?.chat?.id // messages from different chats
  }

  function getChatProvider(message) {
    return  message?.chat?.via
      ? { type: message.chat.via.type, // chats from history
        name: message.chat.via.name }
      : { type: currentChat.value.members[0].type, // from current chat
        name: currentChat.value.members[0].name }
  }

  function isLastMessage(index) {
    const { nextMessage } = getMessage(index);
    return !nextMessage && !currentChat.value.messages.length;
  }


  return {
    messages,

    chatInputFocus,
    showChatDate,
    isChatStarted,
    getChatProvider,
    isLastMessage,
  };
};
