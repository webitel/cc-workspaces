<template>
  <section class="the-video-call-chat">
    <media-viewer />
    <chat-container
      :messages="messages"
      :size="props.size"
      :chat-actions="chatActions"
      @[`action:${ChatAction.SendMessage}`]="sendMessage"
      @[`action:${ChatAction.AttachFiles}`]="sendFiles"
      @[MessageAction.ClickOnImage]="openMedia"
    />
  </section>
</template>

<script setup lang="ts">
import { applyTransform,
  notify,
} from '@webitel/api-services/api/transformers';
import { ChatAction, ChatContainer, ChatMessageType, MessageAction } from '@webitel/ui-chats/ui';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import type { ResultCallbacks } from '@webitel/ui-sdk/src/types';
import { computed, onMounted, watch, ref } from 'vue';
import { useStore } from 'vuex';

import MediaViewer from '../../../../../../chat/media-viewer/media-viewer.vue';
import { ConversationState } from 'webitel-sdk';

const chatNamespace = 'features/chat';
const actionsForOpenedChat = [
  ChatAction.AttachFiles,
  ChatAction.EmojiPicker,
  ChatAction.SendMessage,
];

const props = withDefaults(
  defineProps<{
    size?: string;
  }>(),
  {
    size: ComponentSize.MD,
  },
);

const store = useStore();

const chatActions = ref(actionsForOpenedChat);

const chat = computed(() =>
  store.getters['features/call/videoCall/chat/VIDEO_CALL_CHAT']
);
const messages = computed(() =>
  store.getters['features/call/videoCall/chat/VIDEO_CALL_CHAT_MESSAGES']
);
const isChatClosed = computed(() => chat?.value.state === ConversationState.Closed);

async function sendMessage(text: string, options?: ResultCallbacks) {
  try {
    chat.value?.send(text);
  } catch (error) {
    throw applyTransform(error, [
      notify,
    ]);
  } finally {
    options?.onSuccess?.();
  }
}

async function sendFiles(files: File[], options?: ResultCallbacks) {
  try {
    Array.isArray(files)
      ? await Promise.all(files?.map((file) => chat.value?.sendFile(file)))
      : await chat.value?.sendFile(files);
  } catch (error) {
    throw applyTransform(error, [
      notify,
    ]);
  } finally {
    options?.onSuccess?.();
  }
}

const openMedia = (message: ChatMessageType) => {
  store.dispatch(`${chatNamespace}/chatMedia/OPEN_MEDIA`, message)
};

onMounted(() => {
  // @author ye.pohranichna
  // because the video calls chat mast be always auto-answered
  // can be removed after the fix on backend side
  // https://webitel.atlassian.net/browse/WTEL-7689
  chat.value?.join()
});

watch(isChatClosed, (value:boolean) => {
  if (value) chatActions.value = [];
  if (!value && chatActions.value) chatActions.value = actionsForOpenedChat;
})

</script>
<style scoped>
.the-video-call-chat {
  display: flex;
  height: 100%;
  width: 100%;
}

</style>
