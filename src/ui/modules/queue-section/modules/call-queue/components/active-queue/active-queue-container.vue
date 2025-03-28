<template>
  <task-queue-container
    :empty="!callList.length"
  >
    <div v-for="(task, key) of callList" class="active-queue-container">
      <active-preview
        :key="task.id"
        :index="key"
        :opened="task === taskOnWorkspace"
        :task="task"
        :size="size"
        @answer="answer({ callId: task.id })"
        @click="openCall"
        @hangup="hangup({ callId: task.id })"
      />
      <wt-divider v-if="callList.length > key + 1"/>
    </div>
  </task-queue-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import TaskQueueContainer from '../../../_shared/components/task-queue-container.vue';
import ActivePreview from './active-queue-preview.vue';

export default {
  name: 'ActiveQueueContainer',
  components: {
    TaskQueueContainer,
    ActivePreview,
  },
  mixins: [sizeMixin],

  computed: {
    ...mapState('features/call', {
      callList: (state) => state.callList,
    }),
    ...mapGetters('workspace', {
      taskOnWorkspace: 'TASK_ON_WORKSPACE',
    }),
  },

  methods: {
    ...mapActions('features/call', {
      openCall: 'OPEN_ACTIVE_CALL',
      answer: 'ANSWER',
      hangup: 'HANGUP',
    }),
  },
};
</script>

<style lang="scss" scoped>
  .active-queue-container{
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
</style>
