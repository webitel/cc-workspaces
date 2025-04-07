<template>
  <section class="current-chat chat-messages-container" @click="focusOnInput">
    <div ref="chat-messages-items" class="chat-messages-items">
      <message
        v-for="(message, index) of messages"
        :key="message.id"
        :message="message"
        :size="props.size"
        :show-avatar="showAvatar(index)"
        @open-image="openMedia(message)"
        @initialized-player="attachPlayer"
      >
        <template #before-message>
          <chat-date
            v-if="showChatDate(index)"
            :date="message.createdAt"
          />
        </template>
        <template #after-message>
          <chat-activity-info
            v-if="isLastMessage(index)"
            ended
          />
        </template>
      </message>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import { useStore } from 'vuex';
import { useChatMessages } from '../composables/useChatMessages.js';
import { useChatScroll } from '../composables/useChatScroll.js';
import Message from '../message/chat-message.vue';
import ChatDate from '../components/chat-date.vue';
import ChatActivityInfo from '../components/chat-activity-info.vue';

const store = useStore();

const chatMediaNamespace = 'features/chat/chatMedia';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    options: ['sm', 'md'],
  },
})

const el = useTemplateRef('chat-messages-items');

const {
  messages,

  showAvatar,
  showChatDate,
  focusOnInput,
  isLastMessage,
} = useChatMessages();

useChatScroll(el);


onUnmounted(() => {
  cleanChatPlayers();
})


const openMedia = () => store.dispatch(`${chatMediaNamespace}/OPEN_MEDIA`);
const attachPlayer = (player) => store.dispatch(`${chatMediaNamespace}/ATTACH_PLAYER_TO_CHAT`, player);
const cleanChatPlayers = (message) => store.dispatch(`${chatMediaNamespace}/CLEAN_CHAT_PLAYERS`, message);

</script>

<style lang="scss" scoped>
</style>
