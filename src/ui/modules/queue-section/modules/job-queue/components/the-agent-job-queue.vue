<template>
  <the-agent-task-queue
    class="task-queue job-queue"
    :title="$t('queueSec.job.jobs')"
  >
    <task-queue-container>
      <job-queue-preview
        v-for="task of taskList"
        :task="task"
        :opened="task === taskOnWorkspace"
        :key="task.id"
        :size="size"
        @click="openTask(task)"
        @accept="task.accept()"
        @decline="task.decline()"
      ></job-queue-preview>
    </task-queue-container>
  </the-agent-task-queue>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import sizeMixin from '../../../../../../app/mixins/sizeMixin';
import TheAgentTaskQueue from '../../_shared/components/the-agent-task-queue.vue';
import TaskQueueContainer from '../../_shared/components/task-queue-container.vue';
import JobQueuePreview from './job-queue-preview.vue';

export default {
  name: 'the-agent-job-queue',
  components: {
    TheAgentTaskQueue,
    TaskQueueContainer,
    JobQueuePreview,
  },
  mixins: [sizeMixin],
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
