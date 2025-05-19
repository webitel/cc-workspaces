import { useScroll } from '@vueuse/core';
import {
  computed,
  ref,
  watch,
} from 'vue';
import { useStore } from 'vuex';

import { useChatMessages } from '../message/composables/useChatMessages.js';

export const useChatScroll = (element) => {

  const store = useStore();

  const { messages } = useChatMessages();
  const { arrivedState, y} = useScroll(element);

  const newUnseenMessages = ref(0);
  const indentFromBottom = ref(0);
  const showScrollToBottomBtn = ref(false);

  const chat = computed(() => store.getters['features/chat/CHAT_ON_WORKSPACE']);
  const lastMessage = computed(() => messages.value[messages.value?.length - 1]);
  const isLastMessageIsMy = computed(() => !!lastMessage.value?.member?.self);

  const scrollToBottom = (behavior = 'instant') => {
    element.value?.scrollTo({
      top: element.value?.scrollHeight,
      behavior,
    });
    newUnseenMessages.value = 0;
    showScrollToBottomBtn.value = false;
  }

  const scrollAfterNewMessage = () => {
    if (arrivedState.bottom || isLastMessageIsMy.value) {
      scrollToBottom('smooth');
    }
    else if (!arrivedState.bottom && !isLastMessageIsMy.value) {
      newUnseenMessages.value += 1;
    }
  }

  watch(() => messages.value?.length,
    async (messagesLength, oldMessagesLength) => {
      const newMessageReceived = (messagesLength - oldMessagesLength) === 1; // when chat have just 1 new message
      if (newMessageReceived) scrollAfterNewMessage();
    },
    { flush: 'post' },
  )

  watch(() => chat.value?.id,
    async () => {

    setTimeout(() => scrollToBottom(), 500);

  },{ immediate: true });

  watch(() => element.value?.scrollHeight,
    async (newScrollHeight, oldScrollHeight) => {
    if (newScrollHeight !== oldScrollHeight) {
     indentFromBottom.value = element.value?.scrollHeight - ((element.value?.clientHeight/100) * 15); // 20% of scroll height
    }
  }, { immediate: true });


  watch(() => arrivedState.bottom, () => {
    if (arrivedState.bottom && newUnseenMessages) newUnseenMessages.value = 0;
  });

  watch(() => y.value, () => {
   const yPosition = y.value + element.value?.clientHeight;
    if (!arrivedState.bottom && (yPosition < indentFromBottom.value)) showScrollToBottomBtn.value = true;
    if (arrivedState.bottom && newUnseenMessages) {
      newUnseenMessages.value = 0;
      showScrollToBottomBtn.value = false;
    }
  });

  return {
    showScrollToBottomBtn,
    newUnseenMessages,
    scrollToBottom,
  };
};
