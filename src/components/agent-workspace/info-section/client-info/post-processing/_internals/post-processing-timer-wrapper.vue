<template>
  <post-processing-timer
    v-if="showTimer"
    :start-processing-at="taskOnWorkspace.task.startProcessingAt"
    :processing-timeout-at="taskOnWorkspace.task.processingTimeoutAt"
    :processing-sec="taskOnWorkspace.task.processingSec"
    :renewal-sec="taskOnWorkspace.task.renewalSec"
    @click="renewProcessingTime"
  ></post-processing-timer>
</template>

<script>
import { mapGetters } from 'vuex';
import PostProcessingTimer from './post-processing-timer.vue';

export default {
  name: 'post-processing-timer-wrapper',
  components: {
    PostProcessingTimer,
  },
  computed: {
    ...mapGetters('workspace', {
      taskOnWorkspace: 'TASK_ON_WORKSPACE',
    }),
    showTimer() {
      return this.taskOnWorkspace.task?.processingSec;
    },
  },
  methods: {
    renewProcessingTime() {
      this.taskOnWorkspace.task.renew();
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
