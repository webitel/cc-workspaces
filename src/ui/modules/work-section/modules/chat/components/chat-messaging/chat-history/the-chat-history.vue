<template>
  <article class="chat-history" @click="chatInputFocus">
    <wt-loader v-if="!isLoaded" class="chat-history__loader"/>
    <div
      v-else
      ref="chat-messages-items"
      class="chat-messages-items"
      v-chat-scroll
    >
      <div>
        <!--    temporary text for visual identification chat-history in the development process,-->
        <!--    because for the time being in some cases i cant see the difference -->
        <p> Chat History Empty Component </p>
        currentChat.contact: {{ currentChat?.contact?.id }}
      </div>
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

import { ref, computed, watch, inject } from 'vue';
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

let isLoaded = ref(false);

const messages = computed(() => store.getters[`${namespace}/ALL_CONTACTS_MESSAGES`]);
const currentChat = computed(() => store.getters['features/chat/CHAT_ON_WORKSPACE']);


const loadMessages = async () => {
  try {
    await store.dispatch(`${namespace}/LOAD_CHAT_HISTORY`, props.contactId);
  } finally {
    isLoaded.value = true;
    // even if loading was with error
  }
}
const chatInputFocus = () => {
  eventBus.$emit('chat-input-focus');
};

watch(() => props.contactId, loadMessages, { immediate: true });

</script>

<style lang="scss" scoped>

.chat-history {
  height: 100%;
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

.chat-history__loader, .chat-messages-items {
  opacity: 1;
  animation: opacity 0.2s forwards;
}

@keyframes opacity {
  0% {opacity: 0;}
  100% {opacity: 1;}
}


//@keyframes transform {
//  0% {transform: translateY(100%);}
//  100% {transform: translateY(0);}
//}

</style>
