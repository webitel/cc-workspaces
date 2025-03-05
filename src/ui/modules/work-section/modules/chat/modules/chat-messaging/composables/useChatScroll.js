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
  const lastMessage = computed(() => messages.value[messages.value?.length - 1]);
  const isLastMessageIsMy = computed(() => lastMessage.value?.member?.self);


  watch(() => chat.value?.id,  async () => { // every time a chat changes

    await nextTick(() =>
      scrollToBottom()
    );

  },{ immediate: true })

  watch(() => messages.value?.length,
    async (messagesLength, oldMessagesLength) => {
      const newMessagesNumber = messagesLength - oldMessagesLength;

      if (!messagesLength || !oldMessagesLength) scrollToBottom(); // when messages loaded first time

      if (newMessagesNumber === 1) scrollAfterNewMessage();

    },
    { flush: 'post' }
  )


  const scrollToBottom = (behavior = 'instant') => {
    element.value?.scrollTo({
      top: element.value?.scrollHeight,
      behavior,
    })
  }

  const scrollAfterNewMessage = () => {
    console.log('scrollAfterNewMessage', messages.value[messages.value?.length - 1])
    if (arrivedState.bottom || isLastMessageIsMy) scrollToBottom('smooth');
    if (arrivedState.bottom && lastMessage.value.file) scrollAfterImageLoad();
  }

  const onImageLoaded = (src) => {
    const image = new Image();
    image.src = src;
    if (image.complete) {
      scrollToBottom('auto');
    } else {
      image.onload = scrollToBottom;
    }
  };

  const scrollAfterImageLoad = () => {
    const newChatImgs = element.value?.querySelectorAll('img.chat-message__image__img');
    console.log('scrollAfterImageLoad', newChatImgs, element.value);
    newChatImgs.forEach((img) => {
      onImageLoaded(img.getAttribute('src'));
    });
  };

  return {
    scrollToBottom,
  };
};
