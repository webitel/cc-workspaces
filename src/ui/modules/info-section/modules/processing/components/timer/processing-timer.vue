<template>
  <div class="processing-timer">
    <div class="processing-timer__progress">
      <radial-progress
        :color="progressColor"
        :max="processingEndSec"
        :value="processingProgressSec"
      >
        <wt-icon-btn
          v-show="showRenewalButton"
          v-tooltip="renewalTooltip"
          icon="plus"
          @click="handleClick"
        ></wt-icon-btn>

        <span
          v-show="!showRenewalButton"
        >{{ processingSecLeft }}</span>
      </radial-progress>
    </div>

    <div class="processing-timer__retries" v-show="processing?.processingProlongation">
      <span>Retries left</span>
      <wt-chip>{{ remainingProlongations }}</wt-chip>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import RadialProgress from '../../../../../../../app/components/utils/radial-progress.vue';

const ms = 1000;

export default {
  name: 'ProcessingTimer',
  components: {
    RadialProgress,
  },
  props: {
    startProcessingAt: {
      type: Number,
      required: true,
      description: 'Timestamp. Processing start time',
    },
    processingTimeoutAt: {
      type: Number,
      required: true,
      description: 'Timestamp. Processing end and destroy() task event',
    },
    processingSec: {
      type: Number,
      required: true,
      description: 'Base processing time. Default renewal time.',
    },
    renewalSec: {
      type: Number,
      default: 5,
      description: 'How many sec should left before processingTimeout',
    },
    processing: {
      type: Object,
      default: null,
    },
  },
  computed: {
    ...mapState('ui/now', {
      now: (state) => state.now,
    }),
    processingSecLeft() {
      return Math.floor((this.processingTimeoutAt - this.now) / ms);
    },
    processingEndSec() {
      if (!this.now) return 0; // reactive ticking
      return Math.ceil((this.processingTimeoutAt - this.startProcessingAt) / ms);
    },
    processingProgressSec() {
      if (!this.now) return 0; // reactive ticking
      return this.processingEndSec - this.processingSecLeft;
    },
    remainingProlongations() {
      return this.processing?.processingProlongation?.remainingProlongations ?? 0;
    },
    showRenewalButton() {
      return (this.processingSecLeft <= this.renewalSec) && this.remainingProlongations;
    },
    renewalTooltip() {
      return `+${this.processingSec} ${this.$t('date.sec')}`;
    },
    progressColor() {
      if (this.processingProgressSec / this.processingEndSec < 0.5) return 'success';
      if (this.processingProgressSec / this.processingEndSec < 0.75) return 'primary';
      return 'danger';
    },
  },
  methods: {
    handleClick() {
      this.$emit('click', this.processing?.processingProlongation?.prolongationSec || 0);
    },
  },
};
</script>

<style lang="scss" scoped>
.processing-timer {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);

  &__progress {
    display: inline-block;
  }

  &__retries {
    display: flex;
    gap: var(--spacing-xs);
  }
}
</style>
