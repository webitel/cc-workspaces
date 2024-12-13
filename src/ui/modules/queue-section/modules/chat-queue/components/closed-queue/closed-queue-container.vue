<template>
  <task-queue-container
    class="closed-queue-container"
    :empty="!chatList.length">
    <div
      v-for="(chat, index) of chatList"
      class="closed-queue-container__wrapper"
    >
      <closed-preview
        :task="chat"
        :opened="chat.id === chatOnWorkspace.id"
        :key="chat.id"
        :size="size"
        processed
        @click="openChat(chat)"
      />
      <wt-divider v-if="chatList.length > index + 1"/>
    </div>
  </task-queue-container>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import TaskQueueContainer from '../../../_shared/components/task-queue-container.vue';
import ClosedPreview from './closed-queue-preview.vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
  },
});

const store = useStore();
const namespace = 'features/chat/closed';

const chatOnWorkspace = computed(() => store.getters['features/chat/CHAT_ON_WORKSPACE']);
const chatList = computed(() => store.getters[`${namespace}/CLOSED_CHATS`]);

const loadClosedChatsList = async () => await store.dispatch(`${namespace}/LOAD_CLOSED_CHATS`);
const openChat = async (task) => await store.dispatch('features/chat/OPEN_CHAT', task);

loadClosedChatsList();

</script>

<style lang="scss" scoped>
  .closed-queue-container {
    &__wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }
  }
</style>
