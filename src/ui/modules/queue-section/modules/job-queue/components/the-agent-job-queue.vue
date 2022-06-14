<template>
  <the-agent-task-queue-wrapper
    class="job-queue"
    :title="$t('queueSec.job.jobs')"
  >
    <task-queue-container>
      <job-queue-preview
        v-for="task of taskList"
        :task="task"
        :opened="task === taskOnWorkspace"
        :key="task.id"
        @click="openTask(task)"
      ></job-queue-preview>
    </task-queue-container>
  </the-agent-task-queue-wrapper>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import TheAgentTaskQueueWrapper from '../../shared/the-agent-task-queue-wrapper.vue';
import TaskQueueContainer from '../../shared/task-queue-container.vue';
import JobQueuePreview from './job-queue-preview.vue';

export default {
  name: 'the-agent-job-queue',
  components: {
    TheAgentTaskQueueWrapper,
    TaskQueueContainer,
    JobQueuePreview,
  },

  computed: {
    ...mapState('features/job', {
      taskList: (state) => state.jobList,
    }),
    ...mapGetters('workspace', {
      taskOnWorkspace: 'TASK_ON_WORKSPACE',
    }),
  },
  methods: {
    ...mapActions('features/job', {
      openTask: 'OPEN_JOB',
    }),
  },
};
</script>

<style lang="scss" scoped>
</style>
