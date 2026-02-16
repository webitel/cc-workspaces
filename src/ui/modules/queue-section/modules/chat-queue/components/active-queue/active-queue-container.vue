<template>
  <task-queue-container
    class="active-queue-container"
    :empty="!taskList.length"
  >
    <div
      v-for="(task, index) of taskList"
      class="active-queue-container__wrapper"
    >
      <component
        :is="getComponent(task)"
        :key="task.id"
        :task="task"
        :opened="task.id === taskOnWorkspace.id"
        :size="size"
        @click="openTask(task)"
      />
      <wt-divider v-if="taskList.length > index + 1"/>
    </div>
    <load-more-button v-show="nextClosedChats" :load-more="loadNextClosedChats" />
  </task-queue-container>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

import LoadMoreButton from '../../../../../../_shared/components/load-more-button.vue';
import TaskQueueContainer from '../../../_shared/components/task-queue-container.vue';
import ClosedPreview from '../closed-queue/closed-queue-preview.vue';
import ActivePreview from './active-queue-preview.vue';

const props = defineProps({
	size: {
		type: String,
		default: 'md',
	},
});

const store = useStore();
const closedChatsNamespace = 'features/chat/closed/unprocessed';

const taskOnWorkspace = computed(
	() => store.getters['workspace/TASK_ON_WORKSPACE'],
);

const activeChats = computed(() => store.state.features.chat.chatList);
const unprocessedClosedChats = computed(
	() => store.state.features.chat.closed.unprocessed.chatsList,
);
const taskList = computed(() => [
	...activeChats.value,
	...unprocessedClosedChats.value,
]);

const nextClosedChats = computed(
	() => store.state.features.chat.closed.unprocessed.next,
);

const loadClosedChatsList = () =>
	store.dispatch(`${closedChatsNamespace}/LOAD_UNPROCESSED_CHATS`);
const loadNextClosedChats = () =>
	store.dispatch(`${closedChatsNamespace}/LOAD_NEXT_UNPROCESSED_CHATS`);

const getComponent = (task) =>
	task.closedAt && task.closeReason ? ClosedPreview : ActivePreview;
const openTask = async (task) =>
	await store.dispatch('features/chat/OPEN_CHAT', task);

loadClosedChatsList();
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
