<template>
  <task-queue-container>
    <manual-preview
      v-for="(task, key) of manualList"
      :key="task.id"
      :task="task"
      :index="key"
      :size="size"
      @click="openTask"
      @accept="acceptTask"
    ></manual-preview>
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

const manualList = computed(() => store.state.features.call.manual.manualList);

function acceptTask(task) {
  return store.dispatch('features/call/manual/ACCEPT_TASK', task);
}

function openTask(task) {
  console.info('implement me');
}
</script>

<style lang="scss" scoped>

</style>
