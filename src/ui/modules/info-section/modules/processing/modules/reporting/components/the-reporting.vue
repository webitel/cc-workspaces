<template>
  <processing-wrapper
    v-if="taskReporting"
    class="reporting"
    :task="task"
  >
    <template #title>
      {{ $t('infoSec.processing.reporting.isSuccess') }}
    </template>
    <template #form>
      <div class="reporting__status-wrapper">
        <wt-radio
          v-model:selected="taskReporting.success"
          :label="$t('infoSec.processing.reporting.yes')"
          :value="true"
        ></wt-radio>

        <wt-radio
          v-model:selected="taskReporting.success"
          :label="$t('infoSec.processing.reporting.no')"
          :value="false"
        ></wt-radio>
      </div>
      <form class="reportingg-form">
        <failure-form
          v-show="!taskReporting.success"
          class="reporting-form"
          :member="task.isMember"
          :reporting="taskReporting"
        ></failure-form>
        <wt-textarea
          v-model:model-value="taskReporting.description"
          :label="$t('reusable.description')"
          :placeholder="$t('reusable.description')"
        ></wt-textarea>
      </form>
    </template>
    <template #actions>
      <wt-button
        :color="reportButtonColor"
        class="post-processing__submit-btn"
        @click="sendReporting"
      >{{ reportButtonText }}
      </wt-button>
    </template>
  </processing-wrapper>
</template>

<script>
import { mapActions } from 'vuex';

import processingModuleMixin from '../../../mixins/processingModuleMixin';
import FailureForm from './reporting-failure-form.vue';

export default {
  name: 'TheReporting',
  components: { FailureForm },
  mixins: [processingModuleMixin],
  computed: {
    // is needed for watcher
    isTaskReporting() {
      return !!this.taskReporting;
    },
    taskReporting() {
      return this.task.postProcessData;
    },
    reportingSent() {
      return this.task.attempt.reportedAt;
    },
    reportButtonColor() {
      return this.reportingSent ? 'secondary' : 'primary';
    },
    reportButtonText() {
      return this.reportingSent ? this.$t('reusable.edit') : this.$t('reusable.send');
    },
  },

  methods: {
    ...mapActions('ui/infoSec/processing/reporting', {
      initReportingForm: 'INIT_REPORTING_FORM',
    }),
    sendReporting() {
      const reporting = this.taskReporting.generateReporting();
      this.task.reporting(reporting);
    },
    setSuccess(value) {
      this.taskReporting.success = value;
    },
  },
  watch: {
    isTaskReporting: {
      handler() { this.initReportingForm(); },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.reporting__status-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);

  .wt-button {
    width: 120px;
  }
}

.reporting-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
</style>
