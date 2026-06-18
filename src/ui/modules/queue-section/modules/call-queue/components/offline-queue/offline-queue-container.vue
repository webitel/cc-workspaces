<template>
  <task-queue-container
    :empty="!dataList.length"
  >
    <div ref="scroll-wrap" class="offline-queue-container__scroll-wrap">
      <div
        v-for="(task, index) of dataList"
        :key="task.id"
        class="offline-queue-container__items"
      >
        <offline-preview
          :opened="task === taskOnWorkspace"
          :task="task"
          :size="size"
          @click="toggleMemberDisplay(task)"
        />
        <wt-divider v-if="dataList.length > index + 1"/>
      </div>
    </div>
  </task-queue-container>
</template>

<script setup>
import WtIntersectionObserver from '@webitel/ui-sdk/components/wt-intersection-observer/wt-intersection-observer.vue';
import { useCachedInterval } from '@webitel/ui-sdk/src/composables/useCachedInterval/useCachedInterval';
import { computed, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useWebSocketClient } from '../../../../../../../app/api/agent-workspace/websocket/useWebSocketClient';
import useInfiniteScroll from '../../../../../../../app/composables/useInfiniteScroll';
import { WebSocketConnectionState } from '../../../../../../../ui/enums/WebSocketConnectionState.enum';
import TaskQueueContainer from '../../../_shared/components/task-queue-container.vue';
import OfflinePreview from './offline-queue-preview.vue';

const props = defineProps({
	size: {
		type: String,
		default: 'md',
	},
});

const store = useStore();
const { subscribe } = useCachedInterval({
	timeout: 15 * 1000,
});
const { state } = useWebSocketClient();

const dataList = computed(() => store.state.features.member?.memberList || []);
const taskOnWorkspace = computed(
	() => store.getters['workspace/TASK_ON_WORKSPACE'],
);
const isConnected = computed(
	() => state.value === WebSocketConnectionState.Connected,
);

const loadDataList = async () => {
	const response = await store.dispatch('features/member/LOAD_DATA_LIST');
	return {
		items: response.items,
		next: response.next,
	};
};

const toggleMemberDisplay = (task) => {
	taskOnWorkspace.value.id === task.id
		? store.dispatch('features/member/RESET_WORKSPACE')
		: store.dispatch('features/member/OPEN_MEMBER_ON_WORKSPACE', task);
};

watch(
	isConnected,
	(connected) => {
		if (connected) {
			subscribe(loadDataList);
		}
	},
	{
		once: true,
	},
);

onUnmounted(() => {
	/*
  [WTEL-3064]
  When unmounting a offline-queue-container component (for example, when clicking on missed calls),
  in agent-workspace-action panel should display the last active event, except for the offline queue
  */
	store.dispatch('features/member/RESET_WORKSPACE');
});
</script>

<style lang="scss" scoped>
  .offline-queue-container__scroll-wrap {
    display: contents;
  }
  .offline-queue-container__items{
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
</style>
