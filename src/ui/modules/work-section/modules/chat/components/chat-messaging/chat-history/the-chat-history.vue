<template>
  <article class="chat-history chat-messages-container">
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
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState.js';
import { ref, reactive, computed, onMounted, watchEffect, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import ChatMessage from '../message/chat-message.vue';
import ChatHistoryAPI from '@webitel/ui-sdk/src/api/crm/contactChatMessagesHistory';


const props = defineProps({
  size: {
    type: String,
    default: 'md',
  },
});

const store = useStore();
const { t } = useI18n();


const namespace = 'features/chat/chatHistory';

let isLoaded = ref(false);

const contactID = computed(() => store.state.ui.infoSec.client.contact.contact?.id);
const messages = computed(() => store.getters[`${namespace}/ALL_CONTACTS_MESSAGES`]);
const currentChat = computed(() => store.getters['features/chat/CHAT_ON_WORKSPACE']);
const loadMessages = async () => {
  try {
    await store.dispatch(`${namespace}/LOAD_CHAT_HISTORY`, contactID.value);
  } finally {
    isLoaded.value = true;
  }
  // const { items } = await ChatHistoryAPI.getAllMessages({ id: contactID.value });
  console.log('currentChat', currentChat.value);
}

watch(contactID, loadMessages, { immediate: true });

</script>

<style lang="scss" scoped>
.chat-history {
  height: 100%;
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
