import { useScroll } from '@vueuse/core';
import {
  computed, nextTick,
  ref,
  watch,
} from 'vue';
import { useStore } from 'vuex';

import { useChatMessages } from '../message/composables/useChatMessages.js';

export const useChatScroll = (element) => {

  const store = useStore();

  const { messages } = useChatMessages();
  const { arrivedState} = useScroll(element);

  const newUnseenMessages = ref(0);

  const lastMessage = computed(() => messages.value[messages.value?.length - 1]);
  const isLastMessageIsMy = computed(() => !!lastMessage.value?.member?.self);
  const showScrollToBottomBtn = computed(() => !arrivedState.bottom);

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

  watch(() => arrivedState.bottom, () => {
    if (arrivedState.bottom && newUnseenMessages) newUnseenMessages.value = 0;
  });

  return {
    showScrollToBottomBtn,
    newUnseenMessages,
    scrollToBottom,
  };
};
