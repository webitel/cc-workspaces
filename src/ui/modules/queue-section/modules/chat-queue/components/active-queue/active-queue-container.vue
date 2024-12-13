<template>
  <task-queue-container
    class="active-queue-container"
    :empty="!chatList.length"
  >
    <div
      v-for="(chat, index) of chatList"
      class="active-queue-container__wrapper"
    >
      <component
        :is="getComponent(chat)"
        :task="chat"
        :opened="chat.id === chatOnWorkspace.id"
        :key="chat.id"
        :size="size"
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
import ClosedPreview from '../closed-queue/closed-queue-preview.vue';
import ActivePreview from './active-queue-preview.vue';


const props = defineProps({
  size: {
    type: String,
    default: 'md',
  },
});

const store = useStore();

const chatOnWorkspace = computed(() => store.getters['features/chat/CHAT_ON_WORKSPACE']);

const activeChatList = computed(() => store.state.features.chat.chatList);
const unprocessedClosedChats = computed(() => store.getters['features/chat/closed/UNPROCESSED_CLOSED_CHATS'] );
const chatList = computed(() => [...activeChatList.value, ...unprocessedClosedChats.value]);

const getComponent = ((chat) => chat.closedAt && chat.closeReason ? ClosedPreview : ActivePreview);
const openChat = async (chat) => await store.dispatch('features/chat/OPEN_CHAT', chat);

</script>

<style lang="scss" scoped>
  .active-queue-container {
    &__wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }
  }
</style>
