<template>
  <task-queue-container
    :empty="!dataList.length"
  >
    <div ref="scroll-wrap" class="offline-queue-container__scroll-wrap">
      <div
v-for="(task, index) of dataList"
           :key="task.id"
           class="offline-queue-container__items">
        <offline-preview
          :opened="task === taskOnWorkspace"
          :task="task"
          :size="size"
          @click="toggleMemberDisplay(task)"
        />
        <wt-divider v-if="dataList.length > index + 1"/>
      </div>
      <wt-intersection-observer
        :canLoadMore="true"
        :loading="isLoading"
        @next="handleIntersect"
      />
    </div>
  </task-queue-container>
</template>

<script setup>
import { useCachedInterval } from '@webitel/ui-sdk/src/composables/useCachedInterval/useCachedInterval';
import { computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

import useInfiniteScroll from '../../../../../../../app/composables/useInfiniteScroll';
import TaskQueueContainer from '../../../_shared/components/task-queue-container.vue';
import OfflinePreview from './offline-queue-preview.vue';
import WtIntersectionObserver from '@webitel/ui-sdk/components/wt-intersection-observer/wt-intersection-observer.vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
  },
});

const store = useStore();
const { subscribe } = useCachedInterval({ timeout: 15 * 1000 });

const dataList = computed(() => store.state['features/member']?.memberList || []);
const taskOnWorkspace = computed(() => store.getters['workspace/TASK_ON_WORKSPACE']);

const fetchFn = async (params) => {
  const response = await store.dispatch('features/member/LOAD_DATA_LIST', params);
  return { items: response.items, next: response.next }; // Mock response since data is in store
};

const {
  isLoading,
  dataSearch,
  handleIntersect,
  resetData,
} = useInfiniteScroll({
  fetchFn,
  size: 20,
});

// Use the same function for initial load and infinite scroll
const loadDataList = () => fetchFn({
  search: dataSearch.value,
  page: 1,
  size: 20
});

const toggleMemberDisplay = (task) => {
  taskOnWorkspace.value.id === task.id
    ? store.dispatch('features/member/RESET_WORKSPACE')
    : store.dispatch('features/member/OPEN_MEMBER_ON_WORKSPACE', task);
};

onMounted(() => {
  subscribe(loadDataList);
});

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
