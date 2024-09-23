<template>
  <article class="chat-history" @click="chatInputFocus">
    <div
      class="chat-history__messages"
      v-chat-scroll
    >
      <chat-message
        v-for="(message, index) of messages"
        :key="message.id"
        :message="message"
        :size="size"
      >
        <template v-slot:before-message>
          <chat-date
            v-if="showChatDate(index)"
            :date="message.date || message.createdAt"
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
      </chat-message>
    </div>
  </article>
</template>

<script setup>

import { watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useChatMessage } from '../message/composables/useChatMessage.js';
import vChatScroll from '../../../../../../../../app/directives/chatScroll.js';
import ChatDate from './components/chat-date.vue';
import ChatMessage from '../message/chat-message.vue';
import ChatActivityInfo from './components/chat-activity-info.vue';


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

const namespace = 'features/chat/chatHistory';

const {
  messages,

  chatInputFocus,
  showChatDate,
  isChatStarted,
  getChatProvider,
  isLastMessage,
} = useChatMessage();

const loadMessages = async () => {
  await store.dispatch(`${namespace}/LOAD_CHAT_HISTORY`, props.contactId);
};

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
    box-sizing: border-box;
    flex: 1 1;
    height: 100%;
    padding: var(--spacing-2xs) 0;
    overflow-x: hidden;
    overflow-y: scroll;
  }
}

</style>
