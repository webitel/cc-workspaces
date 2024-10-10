<template>
  <article class="chat-history" @click="focusOnInput">
    <div
      class="chat-history__messages"
      v-chat-scroll
    >
      <scroll-observer
        :next="next"
        :loading="nextLoading"
        @next="loadNextMessages"
      />
      <message
        v-for="(message, index) of messages"
        :key="message.id"
        :message="message"
        :size="size"
        :show-avatar="showAvatar(index)"
        :username="props.contact?.name"
        @open-image="openImage(message)"
        @initialized-player="attachPlayer"
      >
        <template v-slot:before-message>
          <chat-date
            якщо попереднього повідомлення немає
            v-if="showChatDate(index) || isStartHistory(index)"
            :date="message.createdAt"
          />
          <chat-activity-info
            v-if="isChatStarted(index) || isStartHistory(index)"
            :provider="getChatProvider(message).type"
            :gateway="getChatProvider(message).name"
          />
        </template>

        <template v-slot:after-message>
          <chat-activity-info
            v-if="isLastMessage(index) || isChatStarted(index + 1)"
            ended
          />
        </template>
      </message>
    </div>
  </article>
</template>

<script setup>

import { watch, computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useChatMessages } from '../message/composables/useChatMessages.js';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import vChatScroll from '../../../../../../../../app/directives/chatScroll.js';
import ChatDate from '../components/chat-date.vue';
import Message from '../message/chat-message.vue';
import ChatActivityInfo from '../components/chat-activity-info.vue';
import ScrollObserver from '../../../../../../../../app/components/utils/scroll-observer.vue';

const props = defineProps({
  contact: {
    type: Object,
    require: true,
  },
  size: {
    type: String,
    default: 'md',
  },
});

const store = useStore();
const { t } = useI18n();

const chatNamespace = 'features/chat';
const namespace = `${chatNamespace}/chatHistory`;

const nextLoading = ref(false);

const {
  messages,

  getMessage,
  showChatDate,
  showAvatar,
  focusOnInput,
} = useChatMessages();

const currentChat = computed(() => store.getters[`${chatNamespace}/CHAT_ON_WORKSPACE`]);
const next = computed(() => getNamespacedState(store.state, namespace).next);
const loadMessages = async () => await store.dispatch(`${namespace}/LOAD_CHAT_HISTORY`, props.contact?.id);
const attachPlayer = (player) => store.dispatch(`${chatNamespace}/ATTACH_PLAYER_TO_CHAT`, player);
const openImage = (message) => store.dispatch(`${chatNamespace}/OPEN_MEDIA`, message);

const loadNextMessages = async () => {
  nextLoading.value = true;
  await store.dispatch(`${namespace}/LOAD_NEXT`, props.contact?.id);
  nextLoading.value = false;
}

function isChatStarted(index) {
  const { prevMessage, message, nextMessage } = getMessage(index);
  return prevMessage
    && nextMessage
    && prevMessage?.chat?.id !== message?.chat?.id // messages from different chats
}

function isStartHistory(index) {
  console.log('isStartHistory');
  return !next.value && index === 0;
}

function isLastMessage(index) {
  const { nextMessage } = getMessage(index);
  return !nextMessage && !currentChat.value.messages.length;
}

function getChatProvider(message) {
  return  message?.chat?.via
    ? { type: message.chat.via.type, // chats from history
      name: message.chat.via.name }
    : { type: currentChat.value.members[0].type, // from current chat
      name: currentChat.value.members[0].name }
}

watch(() => props.contact?.id, loadMessages, { immediate: true });

</script>

<style lang="scss" scoped>

.chat-history {
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;

  &__messages {
    @extend %wt-scrollbar;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: scroll;
  }
}

</style>
