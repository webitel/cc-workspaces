import { useScroll } from '@vueuse/core';
import {
  computed,
  inject,
  nextTick,
  ref,
  toRefs,
  useTemplateRef,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import { useChatMessages } from './useChatMessages.js';

export const useChatScroll = (element) => {

  const store = useStore();
  const namespace = 'features/chat';

  const { messages } = useChatMessages();
  const { arrivedState} = useScroll(element);

  const chat = computed(() => store.getters[`${namespace}/CHAT_ON_WORKSPACE`]);
  const isLastMessageIsMy = computed(() => messages.value[messages.value?.length - 1]?.member?.self);


  watch(() => chat.value?.id,  async () => { // every time a chat changes

    await nextTick(() =>
      scrollToBottom()
    );

  },{ immediate: true })

  watch(() => messages.value?.length,
    async (messagesLength, oldMessagesLength) => {
      const newMessagesNumber = messagesLength - oldMessagesLength;

      if (!messagesLength || !oldMessagesLength) scrollToBottom(); // when messages loaded first time

      if (newMessagesNumber === 1) scrollToBottomAfterNewMessage();

    },
    { flush: 'post' }
  )


  const scrollToBottom = (behavior = 'instant') => {
    element.value?.scrollTo({
      top: element.value?.scrollHeight,
      behavior,
    })
  }

  const scrollToBottomAfterNewMessage = () => {
    if (arrivedState.bottom || isLastMessageIsMy) scrollToBottom('smooth');
  }

  return {
    scrollToBottom,
  };
};
