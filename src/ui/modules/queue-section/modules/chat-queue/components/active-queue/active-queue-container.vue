<template>
  <task-queue-container
    class="active-queue-container"
    :empty="!taskList.length"
  >
    <div
      v-for="(task, index) of taskList"
      class="closed-queue-container__wrapper"
    >
      <active-preview
        :task="task"
        :opened="task.id === taskOnWorkspace.id"
        :key="task.id"
        :size="size"
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
import ActivePreview from './active-queue-preview.vue';


const props = defineProps({
  size: {
    type: String,
    default: 'md',
  },
});

const store = useStore();

const taskList = computed(() => store.state.features.chat.chatList);
const taskOnWorkspace = computed(() => store.getters['workspace/TASK_ON_WORKSPACE']);

function openTask(task) {
  return store.dispatch('features/chat/OPEN_CHAT', task);
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
