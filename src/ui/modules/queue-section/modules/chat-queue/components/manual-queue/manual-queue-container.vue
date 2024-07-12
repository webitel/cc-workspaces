<template>
  <task-queue-container>
    <div v-for="(task, key) of manualList">
      <manual-preview
        :key="task.id"
        :task="task"
        :index="key"
        :size="size"
        @click="openTask"
        @accept="acceptTask"
      />
      <wt-divider v-if="manualList && manualList.length > key + 1" />
    </div>
  </task-queue-container>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import TaskQueueContainer from '../../../_shared/components/task-queue-container.vue';
import ManualPreview from './manual-queue-preview.vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
  },
});

const store = useStore();

console.info(store.state.features.chat.manual.manualList);

const manualList = computed(() => store.state.features.chat.manual.manualList);

function acceptTask(task) {
  return store.dispatch('features/chat/manual/ACCEPT_TASK', task);
}

function openTask(task) {
  console.info('implement me');
}
</script>

<style lang="scss" scoped></style>
