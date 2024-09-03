<template>
  <article class="chat-history" @click="chatInputFocus">
    <wt-loader v-show="!isLoaded" />
    <div
      v-if="isLoaded"
      class="chat-history-messages-wrap chat-messages-items"
      ref="chat-messages-items">
      <div>
        ТРАМПАМПАМ!
        <p> Chat History Empty Component </p>
        currentChat.contact: {{ currentChat?.contact.id }}
      </div>
      <chat-message
        v-for="(message, index) of messages"
        :key="message.id"
        :size="size"
        :message="message"
      />
    </div>
  </article>
</template>

<script setup>

import { ref, computed, watch, inject } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import vChatScroll from '../../../../../../../../app/directives/chatScroll.js';
import ChatMessage from '../message/chat-message.vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
  },
});

const store = useStore();
const { t } = useI18n();
const eventBus = inject('$eventBus');

const namespace = 'features/chat/chatHistory';

let isLoaded = ref(false);

const contactID = computed(() => store.state.ui.infoSec.client.contact.contact?.id);
const messages = computed(() => store.getters[`${namespace}/ALL_CONTACTS_MESSAGES`]);
const currentChat = computed(() => store.getters['features/chat/CHAT_ON_WORKSPACE']);

const loadMessages = async () => {
  await store.dispatch(`${namespace}/LOAD_CHAT_HISTORY`, contactID.value);
}
const chatInputFocus = () => {
  eventBus.$emit('chat-input-focus');
};

watch(contactID, loadMessages, { immediate: true });

</script>

<style lang="scss" scoped>

.chat-history {
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
}
.chat-messages-container {
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
