<template>
  <article class="chat-history" @click="focusOnInput">
    <div
      class="chat-history__messages"
      v-chat-scroll
    >
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
            v-if="showChatDate(index)"
            :date="message.createdAt"
          />
          <chat-activity-info
            v-if="isChatStarted(index)"
            :provider="getChatProvider(message).type"
            :gateway="getChatProvider(message).name"
          />
          <chat-agent
            v-if="isChatStarted(index)"
            :agents="getChatAgents(message)"
          />
        </template>

        <template v-slot:after-message>
          <chat-activity-info
            v-if="isChatStarted(index + 1) || isLastMessage(index)"
            ended
          />
        </template>
      </message>
    </div>
  </article>
</template>

<script setup>

import { contactChatMessagesHistory } from '@webitel/ui-sdk/src/api/clients/сontacts/index.js';
import { watch, computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useChatMessages } from '../message/composables/useChatMessages.js';
import { getMessageMember } from '../../../../../../../../features/modules/chat/scripts/formatChatMessages.js';
import vChatScroll from '../../../../../../../../app/directives/chatScroll.js';
import Message from '../message/chat-message.vue';
import ChatDate from '../components/chat-date.vue';
import ChatActivityInfo from '../components/chat-activity-info.vue';
import ChatAgent from '../components/chat-agent.vue';

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

const {
  messages,

  getMessage,
  showChatDate,
  showAvatar,
  focusOnInput,
} = useChatMessages();

const currentChat = computed(() => store.getters[`${chatNamespace}/CHAT_ON_WORKSPACE`]);

const currentAgent = computed(() => store.state.features.status.agent);

const loadMessages = async () => await store.dispatch(`${namespace}/LOAD_CHAT_HISTORY`, props.contact?.id);

const attachPlayer = (player) => store.dispatch(`${chatNamespace}/ATTACH_PLAYER_TO_CHAT`, player);

const openImage = (message) => store.dispatch(`${chatNamespace}/OPEN_MEDIA`, message);

const getChatMembers = async (chatId) => {
  const { peers } = await contactChatMessagesHistory.getChat({
    contactId: props.contact?.id,
    chatId,
  });
  return peers.map((item) => (getMessageMember(item))); // formatting objects from API
};

const getAgentsFromMembers = (array) => {
  return array.filter((item) => item.type === 'webitel');
};

const currentChatAgents = computed(() => {
  return currentChat.value.members.length > 1
    ? getAgentsFromMembers(currentChat.value.members)
    : [];
});

const getChatAgents = async (message) => { // return 1 agent or array of agents
  if (message.chat?.id) { // if message have chat it means this message from chat history
    const members = await getChatMembers(message.chat.id);

    return getAgentsFromMembers(members);

  } else return currentChatAgents.value; // if message don`t have chat it means this message from current chat
};

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
