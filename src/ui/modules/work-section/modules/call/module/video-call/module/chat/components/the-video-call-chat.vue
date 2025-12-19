<template>
  <section class="the-video-call-chat">
    {{ chat }}
    <chat-container
      :messages="chatMessages"
      :size="props.size"
      :chat-actions="[
        ChatAction.SendMessage,
        ChatAction.AttachFiles,
        ChatAction.EmojiPicker,
        ChatAction.QuickReplies
        ]"
    />
  </section>
</template>

<script setup lang="ts">
import { ChatAction, ChatContainer, ChatMessageType } from '@webitel/ui-chats/ui';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { computed, watch } from 'vue';
import { useStore } from 'vuex';

const props = withDefaults(
  defineProps<{
    size?: string;
  }>(),
  {
    size: ComponentSize.MD,
  },
);

const store = useStore();

const chat = computed(() => {
  console.log('call on workspace:', store.getters['features/call/videoCall/chat/VIDEO_CALL_CHAT'])
    return !store.getters['features/call/videoCall/chat/VIDEO_CALL_CHAT'];
  }
);


// const messages = computed<ChatMessageType[]>(() => call.value?.messages);

const chatMessages: ChatMessageType[] = [
  {
    id: 101,
    date: 1734631200,
    createdAt: Date.now() - 180_000,
    updatedAt: Date.now() - 180_000,
    text: 'Привіт! Це тестове повідомлення з файлом.',
    channelId: 'channel-42',
    member: {
      id: 1,
      name: 'Оператор підтримки',
      type: 'agent',
      userId: 10,
      self: true,
    },
    file: {
      id: 'file-777',
      name: 'invoice.pdf',
      size: '245KB',
      mime: 'application/pdf',
      url: 'https://example.com/files/invoice.pdf',
      streamUrl: 'https://example.com/files/invoice/stream',
    },
  },

  {
    id: 102,
    date: 1734631260,
    createdAt: Date.now() - 150_000,
    updatedAt: Date.now() - 150_000,
    text: 'Дякую! Зараз перегляну файл.',
    channelId: 'channel-42',
    member: {
      id: 2,
      name: 'Клієнт',
      type: 'contact',
      self: false,
    },
  },

  {
    id: 103,
    date: 1734631320,
    createdAt: Date.now() - 120_000,
    updatedAt: Date.now() - 120_000,
    text: 'Якщо будуть питання — напишіть, будь ласка.',
    channelId: 'channel-42',
    member: {
      id: 1,
      name: 'Оператор підтримки',
      type: 'agent',
      userId: 10,
      self: true,
    },
  },

  {
    id: 104,
    date: 1734631380,
    createdAt: Date.now() - 90_000,
    updatedAt: Date.now() - 90_000,
    channelId: 'channel-42',
    member: {
      id: 2,
      name: 'Клієнт',
      type: 'contact',
      self: false,
    },
    file: {
      id: 'file-888',
      name: 'screenshot.png',
      size: '512KB',
      mime: 'image/png',
      url: 'https://example.com/files/screenshot.png',
    },
  },

  /* --- нові 5 повідомлень --- */

  {
    id: 105,
    date: 1734631440,
    createdAt: Date.now() - 70_000,
    updatedAt: Date.now() - 70_000,
    text: 'Бачу скріншот, дякую.',
    channelId: 'channel-42',
    member: {
      id: 1,
      name: 'Оператор підтримки',
      type: 'agent',
      userId: 10,
      self: true,
    },
  },

  {
    id: 106,
    date: 1734631500,
    createdAt: Date.now() - 55_000,
    updatedAt: Date.now() - 55_000,
    text: 'Проблема виникає лише при оплаті карткою.',
    channelId: 'channel-42',
    member: {
      id: 2,
      name: 'Клієнт',
      type: 'contact',
      self: false,
    },
  },

  {
    id: 107,
    date: 1734631560,
    createdAt: Date.now() - 40_000,
    updatedAt: Date.now() - 40_000,
    text: 'Зараз перевірю цю інформацію з нашою системою.',
    channelId: 'channel-42',
    member: {
      id: 1,
      name: 'Оператор підтримки',
      type: 'agent',
      userId: 10,
      self: true,
    },
  },

  {
    id: 108,
    date: 1734631620,
    createdAt: Date.now() - 25_000,
    updatedAt: Date.now() - 25_000,
    text: 'Добре, очікую.',
    channelId: 'channel-42',
    member: {
      id: 2,
      name: 'Клієнт',
      type: 'contact',
      self: false,
    },
  },

  {
    id: 109,
    date: 1734631680,
    createdAt: Date.now() - 10_000,
    updatedAt: Date.now() - 10_000,
    text: 'Дякую за очікування. Ми знайшли проблему та вже працюємо над її виправленням.',
    channelId: 'channel-42',
    member: {
      id: 1,
      name: 'Оператор підтримки',
      type: 'agent',
      userId: 10,
      self: true,
    },
  },
];
watch(() => chat.value, (newVal) => {
  console.log(newVal);
  chat.value.join('chat.value', chat.value);
}, { immediate: true });

</script>
<style scoped>
.the-video-call-chat {
  display: flex;
  height: 100%;
  width: 100%;
}

</style>
