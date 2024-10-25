<template>
  <task-queue-container
    :empty="taskList.length === 0"
  >
    <div
      class="closed-queue-container"
      v-for="(task, index) of taskList"
    >
      <closed-preview
        :task="task"
        :opened="task === taskOnWorkspace"
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

const loadClosedChatsList = async () => await store.dispatch('features/chat/closed/LOAD_CLOSED_CHATS');

const taskList = computed(() => store.getters['features/chat/closed/CLOSED_CHATS']);
const taskOnWorkspace = computed(() => store.getters['workspace/TASK_ON_WORKSPACE']);

function openTask(task) {
  return store.dispatch('features/chat/OPEN_CHAT', task);
}

loadClosedChatsList();

</script>

<style lang="scss" scoped>
  .closed-queue-container{
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
</style>
