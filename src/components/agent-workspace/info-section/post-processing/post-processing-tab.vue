<template>
  <div class="post-processing">
    <post-processing-wrapper v-show="!isCommunicationPopup" :color="isSuccess ? 'success' : 'failure'">
      <template slot="title">
        {{ $t('infoSec.postProcessing.isSuccess') }}
      </template>
      <template slot="main">
        <div class="post-processing__status-wrapper">
          <wt-button
            class="post-processing__status-control"
            :outline="!isSuccess"
            color="success"
            @click="setSuccess(true)"
          >{{ $t('infoSec.postProcessing.yes') }}
          </wt-button>
          <wt-button
            class="post-processing__status-control"
            :outline="isSuccess"
            color="danger"
            @click="setSuccess(false)"
          >{{ $t('infoSec.postProcessing.no') }}
          </wt-button>
        </div>
        <success-form v-show="isSuccess"/>
        <failure-form v-show="!isSuccess"/>
        <post-processing-timer
          v-if="showTimer"
          :start-processing-at="taskOnWorkspace.task.startProcessingAt"
          :processing-timeout-at="taskOnWorkspace.task.processingTimeoutAt"
          :processing-sec="taskOnWorkspace.task.processingSec"
          :renewal-sec="taskOnWorkspace.task.renewalSec"
          @click="renewProcessingTime"
        ></post-processing-timer>
      </template>
      <template slot="actions">
        <wt-button
          class="post-processing__submit-btn"
          @click="sendReporting"
        >{{ $t('reusable.send') }}
        </wt-button>
      </template>
    </post-processing-wrapper>
    <member-communication-popup v-show="isCommunicationPopup"/>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import PostProcessingWrapper from './_internals/post-processing-wrapper.vue';
import PostProcessingTimer from './_internals/post-processing-timer.vue';
import SuccessForm from './post-processing-success-form.vue';
import FailureForm from './post-processing-failure-form.vue';
import MemberCommunicationPopup from './member-communications/post-processing-communication-popup.vue';

export default {
  name: 'post-processing-tab',
  components: {
    PostProcessingWrapper,
    PostProcessingTimer,
    SuccessForm,
    FailureForm,
    MemberCommunicationPopup,
  },

  watch: {
    taskOnWorkspace: {
      handler() {
        this.resetForm();
      },
      immediate: true,
    },
  },

  computed: {
    ...mapState('reporting', {
      isSuccess: (state) => state.isSuccess,
    }),

    ...mapGetters('workspace', {
      taskOnWorkspace: 'TASK_ON_WORKSPACE',
    }),

    ...mapGetters('reporting', {
      isCommunicationPopup: 'IS_COMMUNICATION_POPUP',
    }),

    showTimer() {
      return this.taskOnWorkspace.task?.processingSec;
    },
  },

  methods: {
    ...mapActions('reporting', {
      setValue: 'SET_PROPERTY',
      sendReporting: 'SEND_REPORTING',
      resetForm: 'RESET_STATE',
    }),
    setSuccess(value) {
      this.setValue({ prop: 'isSuccess', value });
    },
    renewProcessingTime() {
      this.taskOnWorkspace.task.renew();
    },
  },
};
</script>

<style lang="scss" scoped>
.post-processing {
  @extend %wt-scrollbar;
  max-height: 100%;
  height: 100%;
  min-height: 0;
  overflow: scroll;
}

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
