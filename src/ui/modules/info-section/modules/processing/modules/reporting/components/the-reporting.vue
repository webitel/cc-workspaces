<template>
  <processing-wrapper
    v-if="taskReporting"
    class="reporting"
    :task="task"
  >
    <template v-slot:form>
      <h3>
        {{ $t('infoSec.processing.reporting.isSuccess') }}
      </h3>
      <div class="post-processing__status-wrapper">
        <wt-button
          :outline="!taskReporting.success"
          class="post-processing__status-control"
          color="success"
          @click="setSuccess(true)"
        >{{ $t('infoSec.processing.reporting.yes') }}
        </wt-button>
        <wt-button
          :outline="taskReporting.success"
          class="post-processing__status-control"
          color="danger"
          @click="setSuccess(false)"
        >{{ $t('infoSec.processing.reporting.no') }}
        </wt-button>
      </div>
      <form class="processing-form processing-form__success">
        <failure-form
          v-show="!taskReporting.success"
          :member="task.isMember"
          :reporting="taskReporting"
        ></failure-form>
        <wt-textarea
          v-model="taskReporting.description"
          :label="$t('reusable.description')"
          :placeholder="$t('reusable.description')"
        ></wt-textarea>
      </form>
    </template>
    <template v-slot:actions>
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
  name: 'the-reporting',
  mixins: [processingModuleMixin],
  components: { FailureForm },
  computed: {
    // is needed for watcher
    isTaskReporting() {
      return !!this.taskReporting;
    },
    taskReporting() {
      return this.task.postProcessData;
    },
    reportingSent() {
      return this.task.task.reportedAt;
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
.post-processing__status-wrapper {
  display: flex;
  align-items: center;
  justify-content: stretch;
  margin-bottom: 20px;

  .post-processing__status-control {
    width: 100%;

    &:first-child {
      margin-right: 10px;
    }
  }
}

.post-processing-timer {
  margin: var(--spacing-sm) auto;
}
</style>
