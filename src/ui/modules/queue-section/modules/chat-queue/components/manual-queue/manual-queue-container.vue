<template>
  <task-queue-container :empty="!manualList.length">
    <div v-for="(task, key) of manualList" :key="task.id" class="manual-queue-container">
      <manual-preview
        :task="task"
        :index="key"
        :size="size"
        :loading="showLoader(task.attemptId)"
        @click="openTask"
        @accept="acceptTask"
      />
      <wt-divider v-if="manualList.length > key + 1" />
    </div>
  </task-queue-container>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

import { useLoader } from '../../../../../../composables/useLoader';
import TaskQueueContainer from '../../../_shared/components/task-queue-container.vue';
import ManualPreview from './manual-queue-preview.vue';

const props = defineProps({
	size: {
		type: String,
		default: 'md',
	},
});

const store = useStore();

const { showLoader, runWithLoader } = useLoader();

console.info(store.state.features.chat.manual.manualList);

const manualList = computed(() => store.state.features.chat.manual.manualList);

function acceptTask(task) {
	return runWithLoader(task.attemptId, () =>
		store.dispatch('features/chat/manual/ACCEPT_TASK', task),
	);
}

function openTask(task) {
	console.info('implement me');
}
</script>

<style lang="scss" scoped>
  .manual-queue-container{
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
</style>
