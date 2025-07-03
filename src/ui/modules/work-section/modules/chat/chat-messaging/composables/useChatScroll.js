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
  const showScrollToBottomBtn = ref(false);
  const threshold = ref(150); // the distance where the scrollToBottomBtn must be shown/hide

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
    } else newUnseenMessages.value += 1;
  }

  const updateThreshold = (el) => { // when el size was changed
    if (!el) return;
    threshold.value = Math.max(150, el.clientHeight * 1.2)
  }

  const handleShowScrollToBottom = (el) => {
    if (arrivedState.bottom && newUnseenMessages.value) { // hide the btn and reset new messages count, when we arrived the bottom
      newUnseenMessages.value = 0;
      showScrollToBottomBtn.value = false;
      return; // quit the function because we are already at the bottom
    }

    const { scrollTop, scrollHeight, clientHeight } = el;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight); // how far from bottom the chat was scrolled
    const threshold = clientHeight * 0.4; // the distance where the button must be shown/hide. Why 0.4: https://webitel.atlassian.net/browse/WTEL-7136
    const shouldShowBtn = distanceFromBottom > threshold; // show the btn if we scroll above the threshold

    if (showScrollToBottomBtn.value !== shouldShowBtn) { // show or hide the button, if it is needed
      showScrollToBottomBtn.value = shouldShowBtn;
    }
  }

  const handleChatScroll = () => {
    const chatMessagingWrap = element.value;
    if (!chatMessagingWrap) return;

    handleShowScrollToBottom(chatMessagingWrap);
  };

  watch(() => messages.value?.length,
    async (newValue, oldValue) => {
      const newMessageReceived = (newValue - oldValue) === 1; // when chat have just 1 new message
      if (newMessageReceived) scrollAfterNewMessage();
    },
    { flush: 'post' },
  )

  watch(() => chat.value?.id,
    async () => {
    await nextTick()
    setTimeout(() => scrollToBottom(), 500);
  },{ immediate: true });

  return {
    showScrollToBottomBtn,
    newUnseenMessages,
    scrollToBottom,
    handleChatScroll,
    updateThreshold,
  };
};
