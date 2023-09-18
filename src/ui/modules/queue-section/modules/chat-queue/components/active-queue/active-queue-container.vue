<template>
  <task-queue-container>
    <active-preview
      v-for="task of taskList"
      :task="task"
      :opened="task === taskOnWorkspace"
      :key="task.id"
      :size="size"
      @click="openTask"
    ></active-preview>
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
</style>
