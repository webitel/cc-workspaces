<template>
  <task-queue-container>
    <job-queue-preview
      v-for="task of taskList"
      :key="task.id"
      :opened="task === taskOnWorkspace"
      :size="size"
      :task="task"
      @accept="task.accept()"
      @click="openTask(task)"
      @decline="task.decline()"
    ></job-queue-preview>
  </task-queue-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import TaskQueueContainer from '../../../_shared/components/task-queue-container.vue';
import JobQueuePreview from './job-queue-preview.vue';

export default {
  name: 'job-queue-container',
  components: {
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
