<template>
  <article class="chat-history" @click="chatInputFocus">
    <p> Chat History Component </p>
    <div
      ref="chat-messages-items"
      class="chat-messages-items"
      v-chat-scroll
    >
      <chat-message
        v-for="(message, index) of messages"
        :key="message.id"
        :size="size"
        :message="message"
      />
      <chat-started :provider="'webchat'" :gateway="'Liza web chat (Не видаляти)'"/>
    </div>
  </article>
</template>

<script setup>

import { computed, watch, inject } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import vChatScroll from '../../../../../../../../app/directives/chatScroll.js';
import ChatMessage from '../message/chat-message.vue';
import ChatStarted from './components/chat-started.vue';

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
const eventBus = inject('$eventBus');

const namespace = 'features/chat/chatHistory';

// const contactID = computed(() => store.state.ui.infoSec.client.contact.contact?.id);
const messages = computed(() => store.getters[`${namespace}/ALL_CONTACTS_MESSAGES`]);
const loadMessages = async () => {
  await store.dispatch(`${namespace}/LOAD_CHAT_HISTORY`, props.contactId);
}
const chatInputFocus = () => {
  eventBus.$emit('chat-input-focus');
};

loadMessages();

// watch(props.contactId, loadMessages, { immediate: true });

</script>

<style lang="scss" scoped>

.chat-history {
  display: flex;
  overflow: hidden;
  flex-direction: column;
}

.chat-messages-items {
  @extend %wt-scrollbar;
  box-sizing: border-box;
  flex: 1 1;
  overflow-x: hidden;
  overflow-y: scroll;
  height: 100%;
}

</style>
