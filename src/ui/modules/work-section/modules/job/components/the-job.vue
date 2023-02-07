<template>
  <task-container class="the-job">
    <template v-slot:header>
      <job-header
        :size="size"
        :task="task"
      ></job-header>
    </template>
    <template v-slot:body>
      <job-variables-container
        :task="task"
      ></job-variables-container>
    </template>
    <template v-slot:footer>
      <job-footer
        :task="task"
      ></job-footer>
    </template>
  </task-container>
</template>

<script>
import { mapGetters } from 'vuex';
import TaskContainer from '../../_shared/components/task-container/task-container.vue';
import JobHeader from './job-header/job-header.vue';
import JobFooter from './job-footer/job-footer.vue';
import JobVariablesContainer from './job-variables-container/job-variables-container.vue';
import sizeMixin from '../../../../../../app/mixins/sizeMixin';

export default {
  name: 'the-job',
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
