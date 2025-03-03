<template>
  <task-queue-container>
    <div class="job-queue-container" v-for="(task, index) of taskList">
      <job-queue-preview
        :key="task.id"
        :opened="task === taskOnWorkspace"
        :size="size"
        :task="task"
        @accept="task.accept()"
        @click="openTask(task)"
        @decline="task.decline()"
      />
      <div class="job-queue-container__divider">
        <wt-divider v-if="taskList.length > index + 1"/>
      </div>
    </div>
  </task-queue-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import TaskQueueContainer from '../../../../components/task-queue-container.vue';
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
  .job-queue-container{
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);

    &__divider{
      padding: 0 var(--spacing-2xs);
    }
  }
</style>
