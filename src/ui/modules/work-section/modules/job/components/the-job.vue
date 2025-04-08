<template>
  <task-container class="the-job">
    <template #header>
      <job-header
        :size="size"
        :task="task"
      ></job-header>
    </template>
    <template #body>
      <job-variables-container
        :task="task"
      ></job-variables-container>
    </template>
    <template #footer>
      <job-footer
        :task="task"
      ></job-footer>
    </template>
  </task-container>
</template>

<script>
import { mapGetters } from 'vuex';

import sizeMixin from '../../../../../../app/mixins/sizeMixin';
import TaskContainer from '../../_shared/components/task-container/task-container.vue';
import JobFooter from './job-footer/job-footer.vue';
import JobHeader from './job-header/job-header.vue';
import JobVariablesContainer from './job-variables-container/job-variables-container.vue';

export default {
  name: 'TheJob',
  components: {
    TaskContainer,
    JobHeader,
    JobFooter,
    JobVariablesContainer,
  },
  mixins: [sizeMixin],
  computed: {
    ...mapGetters('workspace', {
      task: 'TASK_ON_WORKSPACE',
    }),
  },
};
</script>

<style lang="scss" scoped>
.the-job {
  display: flex;
}
.job-variables-container {
  flex: 1 0 auto;
}
</style>
