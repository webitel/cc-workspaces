<template>
  <section class="the-video-call-chat">
    <chat-container
      :messages="chat?.messages"
      :size="props.size"
      :chat-actions="[
        ChatAction.SendMessage,
        ChatAction.AttachFiles,
        ChatAction.EmojiPicker,
        ChatAction.QuickReplies
        ]"
      @[`action:${ChatAction.SendMessage}`]="sendMessage"
      @[`action:${ChatAction.AttachFiles}`]="sendFiles"
    />
  </section>
</template>

<script setup lang="ts">
import { ChatAction, ChatContainer } from '@webitel/ui-chats/ui';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import applyTransform, {
  notify,
} from '@webitel/ui-sdk/src/api/transformers/index';
import type { ResultCallbacks } from '@webitel/ui-sdk/src/types';
import { computed, onMounted } from 'vue';
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

const chat = computed(() =>
  store.getters['features/call/videoCall/chat/VIDEO_CALL_CHAT']
);

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
      ? await Promise.all(files.map((file) => chat.value?.sendFile(file)))
      : await chat.value.sendFile(files);
  } catch (error) {
    throw applyTransform(error, [
      notify,
    ]);
  } finally {
    options?.onSuccess?.();
  }
}

onMounted(() => {
  chat.value?.join()
});

</script>
<style scoped>
.the-video-call-chat {
  display: flex;
  height: 100%;
  width: 100%;
}

</style>
