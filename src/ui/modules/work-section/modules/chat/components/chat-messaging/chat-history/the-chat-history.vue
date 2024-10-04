<template>
  <article class="chat-history" @click="focusOnInput">
    <div
      ref="scrollTarget"
      class="chat-history__messages"
      v-chat-scroll
    >
      <scroll-observer
        v-if="scrollTarget"
        :root="scrollTarget"
        @intersect="loadNextMessages"
      />
      <message
        v-for="(message, index) of messages"
        :key="message.id"
        :message="message"
        :size="size"
        @open-image="openImage(message)"
        @initialized-player="attachPlayer"
      >
        <template v-slot:before-message>
          <chat-date
            v-if="showChatDate(index)"
            :date="message.createdAt"
          />
          <chat-activity-info
            v-if="isChatStarted(index)"
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
import vChatScroll from '../../../../../../../../app/directives/chatScroll.js';
import ChatDate from '../components/chat-date.vue';
import Message from '../message/chat-message.vue';
import ChatActivityInfo from '../components/chat-activity-info.vue';
import ScrollObserver from '../../../../../../../../app/components/utils/scroll-observer.vue';

const props = defineProps({
  contactId: {
    type: String,
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

const scrollTarget = ref(null);

const {
  messages,
  showChatDate,

  getMessage,
  focusOnInput,
} = useChatMessages();

const currentChat = computed(() => store.getters[`${chatNamespace}/CHAT_ON_WORKSPACE`]);
const loadMessages = async () => await store.dispatch(`${namespace}/LOAD_CHAT_HISTORY`, props.contactId);
const attachPlayer = (player) => store.dispatch(`${chatNamespace}/ATTACH_PLAYER_TO_CHAT`, player);
const openImage = (message) => store.dispatch(`${chatNamespace}/OPEN_MEDIA`, message);
const loadNextMessages = async () => await store.dispatch(`${namespace}/LOAD_NEXT`, props.contactId);

function isChatStarted(index) {
  const { prevMessage, message, nextMessage } = getMessage(index);
  return prevMessage
    && nextMessage
    && prevMessage?.chat?.id !== message?.chat?.id // messages from different chats
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

watch(() => props.contactId, loadMessages, { immediate: true });

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
