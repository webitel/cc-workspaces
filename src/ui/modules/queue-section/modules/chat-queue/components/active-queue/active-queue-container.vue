<template>
  <task-queue-container
    class="active-queue-container"
    :empty="!activeChats.length"
  >
    <div
      v-for="(task, index) of activeChats"
      class="closed-queue-container__wrapper"
    >
      <active-preview
        :task="task"
        :opened="task.id === taskOnWorkspace.id"
        :key="task.id"
        :size="size"
        @click="openTask(task)"
      />
      <wt-divider v-if="activeChats.length > index + 1"/>
    </div>
    <div
      v-for="(task, index) of closedChats"
      class="closed-queue-container__wrapper"
    >
      <closed-preview
        :task="task"
        :opened="task.id === taskOnWorkspace.id"
        :key="task.id"
        :size="size"
        @click="openTask(task)"
      />
      <wt-divider v-if="closedChats.length > index + 1"/>
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

const activeChats = computed(() => store.state.features.chat.chatList);
const closedChats = computed(() => store.getters['features/chat/closed/UNPROCESSED_CLOSED_CHATS']);
const taskOnWorkspace = computed(() => store.getters['workspace/TASK_ON_WORKSPACE']);

function openTask(task) {
  return task.closedAt
    ? store.dispatch(`features/chat/closed/OPEN_CLOSED_CHAT`, task)
    : store.dispatch('features/chat/OPEN_CHAT', task);
}
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
