<template>
  <div v-if="showReportingForm" class="post-processing">
    <communication-popup
      v-show="isCommunicationPopup"
      :communication="taskPostProcessing.editedCommunication"
      @close="closeCommunicationPopup"
      @submit:add="taskPostProcessing.addCommunication($event)"
      @submit:edit="taskPostProcessing.editCommunication($event)"
    ></communication-popup>
    <post-processing-wrapper
      v-show="!isCommunicationPopup"
      :color="taskPostProcessing.success ? 'success' : 'failure'"
    >
      <template slot="title">
        {{ $t('infoSec.postProcessing.isSuccess') }}
      </template>
      <template slot="main">
        <div class="post-processing__status-wrapper">
          <wt-button
            :outline="!taskPostProcessing.success"
            class="post-processing__status-control"
            color="success"
            @click="setSuccess(true)"
          >{{ $t('infoSec.postProcessing.yes') }}
          </wt-button>
          <wt-button
            :outline="taskPostProcessing.success"
            class="post-processing__status-control"
            color="danger"
            @click="setSuccess(false)"
          >{{ $t('infoSec.postProcessing.no') }}
          </wt-button>
        </div>
        <success-form v-show="taskPostProcessing.success" />
        <failure-form v-show="!taskPostProcessing.success" />
        <post-processing-timer-wrapper />
      </template>
      <template slot="actions">
        <wt-button
          :color="reportButtonColor"
          class="post-processing__submit-btn"
          @click="sendReporting"
        >{{ reportButtonText }}
        </wt-button>
      </template>
    </post-processing-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import PostProcessingTimerWrapper from './_internals/post-processing-timer-wrapper.vue';
import PostProcessingWrapper from './_internals/post-processing-wrapper.vue';
import CommunicationPopup from './member-communications/post-processing-communication-popup.vue';
import FailureForm from './post-processing-failure-form.vue';
import SuccessForm from './post-processing-success-form.vue';

export default {
  name: 'post-processing',
  components: {
    PostProcessingWrapper,
    SuccessForm,
    FailureForm,
    PostProcessingTimerWrapper,
    CommunicationPopup,
  },

  computed: {
    ...mapGetters('reporting', {
      isTaskReporting: 'IS_TASK_REPORTING',
      taskPostProcessing: 'TASK_POST_PROCESSING',
      isCommunicationPopup: 'IS_COMMUNICATION_POPUP',
      reportedAt: 'REPORTED_AT',
    }),
    showReportingForm() {
      return this.isTaskReporting && this.taskPostProcessing;
    },
    reportButtonColor() {
      return this.reportedAt ? 'secondary' : 'primary';
    },
    reportButtonText() {
      return this.reportedAt ? this.$t('reusable.edit') : this.$t('reusable.send');
    },
  },

  methods: {
    ...mapActions('reporting', {
      initReportingForm: 'INIT_POST_PROCESSING_FORM',
    }),
    sendReporting() {
      this.taskPostProcessing.send();
    },
    setSuccess(value) {
      this.taskPostProcessing.success = value;
    },
    closeCommunicationPopup() {
      if (this.taskPostProcessing.editedCommunication) {
        this.taskPostProcessing.editedCommunication = null;
      } else this.taskPostProcessing.isNewCommunication = false;
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
  margin: var(--component-spacing) auto;
}
</style>
