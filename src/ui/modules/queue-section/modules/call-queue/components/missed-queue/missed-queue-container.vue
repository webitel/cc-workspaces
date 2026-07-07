<template>
  <task-queue-container 
		:empty="!missedList.length"
	>
    <div v-for="(task, key) of missedList" class="missed-queue-container">
      <missed-preview
        :key="task.id"
        :task="task"
        :index="key"
        :size="size"
        :loading="showLoader(task.id)"
        @hide="hideMissed(task)"
        @call="handleRedial(task)"
      />
      <wt-divider v-if="missedList.length > key + 1"/>
    </div>
    <load-more-button v-show="next" :load-more="loadMore" />
  </task-queue-container>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import LoadMoreButton from '../../../../../../_shared/components/load-more-button.vue';
import { useLoader } from '../../../../../../composables/useLoader';
import TaskQueueContainer from '../../../_shared/components/task-queue-container.vue';
import MissedPreview from './missed-queue-preview.vue';

const props = defineProps({
	size: {
		type: String,
		default: null,
	},
});

const store = useStore();

const missedList = computed(() => store.state.features.call.missed.missedList);
const next = computed(() => store.state.features.call.missed.next);

const loadMore = () => store.dispatch('features/call/missed/LOAD_NEXT_PAGE');
const redial = (task) => store.dispatch('features/call/missed/REDIAL', task);
const hideMissed = (task) =>
	store.dispatch('features/call/missed/HIDE_MISSED', task);

const { showLoader, runWithLoader } = useLoader();

const handleRedial = (task) => {
	runWithLoader(task.id, () => redial(task));
};
</script>

<style lang="scss" scoped>
.missed-queue-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
</style>