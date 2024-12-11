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
        processed
        @click="openTask(task)"
      />
      <wt-divider v-if="taskList.length > index + 1"/>
    </div>
    <load-more-button v-show="next" :load-more="loadNextClosedChats" />
  </task-queue-container>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import LoadMoreButton from '../../../../../../_shared/components/load-more-button.vue';
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
// const taskList = computed(() => store.state.features.chat.closed.closedChatsList);
const taskOnWorkspace = computed(() => store.getters['workspace/TASK_ON_WORKSPACE']);
const next = computed(() => store.state.features.chat.closed.next);

const loadClosedChatsList = () => store.dispatch(`${namespace}/LOAD_CLOSED_CHATS`);
const loadNextClosedChats = () => store.dispatch(`${namespace}/LOAD_NEXT_CHATS`)
const openTask = async (task) => await store.dispatch('features/chat/OPEN_CHAT', task);

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
