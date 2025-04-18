import { useScroll } from '@vueuse/core';
import {
  computed,
  nextTick,
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

  const chat = computed(() => store.getters['features/chat/CHAT_ON_WORKSPACE']);
  const lastMessage = computed(() => messages.value[messages.value?.length - 1]);
  const isLastMessageIsMy = computed(() => !!lastMessage.value?.member?.self);

  const scrollToBottom = (behavior = 'instant') => {
    element.value?.scrollTo({
      top: element.value?.scrollHeight,
      behavior,
    })
  }

  const scrollAfterNewMessage = () => {
    if (arrivedState.bottom || isLastMessageIsMy.value) {
      scrollToBottom('smooth');
    }
    else if (!arrivedState.bottom && !isLastMessageIsMy.value) {
      newUnseenMessages.value += 1;
    }
  }

  watch(() => chat.value?.id,  async () => { // every time a chat changes

    await nextTick(() =>
      scrollToBottom()
    );

  },{ immediate: true })

  watch(() => messages.value?.length,
    async (messagesLength, oldMessagesLength) => {
      if (!messagesLength || !oldMessagesLength) scrollToBottom(); // when messages loaded first time

      const newMessageReceived = (messagesLength - oldMessagesLength) === 1; // when chat have just 1 new message

     if (newMessageReceived) scrollAfterNewMessage();
    },
    { flush: 'post' }
  )

  watch(() => arrivedState.bottom, () => {
    if (arrivedState.bottom && newUnseenMessages) newUnseenMessages.value = 0;
  })

  return {
    newUnseenMessages,
    scrollToBottom,
  };
};
