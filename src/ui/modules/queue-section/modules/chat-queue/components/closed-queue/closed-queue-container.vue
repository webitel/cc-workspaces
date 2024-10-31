<template>
  <task-queue-container
    class="closed-queue-container"
    :empty="!taskList.length">
    <div
      v-for="(task, index) of taskList"
      class="closed-queue-container__wrapper"
    >
      <closed-preview
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
import ClosedPreview from './closed-queue-preview.vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
  },
});

const store = useStore();
const namespace = 'features/chat/closed';

const taskList = computed(() => store.getters[`${namespace}/CLOSED_CHATS`]);
const taskOnWorkspace = computed(() => store.getters['workspace/TASK_ON_WORKSPACE']);

const loadClosedChatsList = async () => await store.dispatch(`${namespace}/LOAD_CLOSED_CHATS`);
const openTask = async (task) => await store.dispatch(`${namespace}/OPEN_CLOSED_CHAT`, task);

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
