<template>
  <the-agent-task-queue
    class="task-queue chat-queue"
    :title="$t('queueSec.chat.chats')"
  >
    <task-queue-container>
      <chat-queue-preview
        v-for="task of taskList"
        :task="task"
        :opened="task === taskOnWorkspace"
        :key="task.id"
        @click="openTask"
      ></chat-queue-preview>
    </task-queue-container>
  </the-agent-task-queue>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import TheAgentTaskQueue from '../../_shared/components/the-agent-task-queue.vue';
import TaskQueueContainer from '../../_shared/components/task-queue-container.vue';
import ChatQueuePreview from './chat-queue-preview.vue';

export default {
  name: 'the-agent-chat-queue',
  components: {
    TheAgentTaskQueue,
    TaskQueueContainer,
    ChatQueuePreview,
  },

  computed: {
    ...mapState('features/chat', {
      taskList: (state) => state.chatList,
    }),
    ...mapGetters('workspace', {
      taskOnWorkspace: 'TASK_ON_WORKSPACE',
    }),
  },
  methods: {
    ...mapActions('features/chat', {
      openTask: 'OPEN_CHAT',
    }),
  },
};
</script>

<style lang="scss" scoped>
</style>
