<template>
  <task-queue-container
    class="active-queue-container"
    :empty="!taskList.length"
  >
    <div
      v-for="(task, index) of taskList"
      class="active-queue-container__wrapper"
    >
      <active-preview
        v-if="!task.closedAt"
        :task="task"
        :opened="task.id === taskOnWorkspace.id"
        :key="task.id"
        :size="size"
        @click="openTask(task)"
      />
      <closed-preview
        v-else
        :task="task"
        :opened="task.id === taskOnWorkspace.id"
        :key="task.id"
        :size="size"
        not-processed
        @click="openTask(task)"
      />
      <wt-divider v-if="taskList.length > index + 1"/>
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

const taskOnWorkspace = computed(() => store.getters['workspace/TASK_ON_WORKSPACE']);
const taskList = computed(() => [...store.state.features.chat.chatList, // active chats
    ...store.getters['features/chat/closed/UNPROCESSED_CLOSED_CHATS']]); // closed chats

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
