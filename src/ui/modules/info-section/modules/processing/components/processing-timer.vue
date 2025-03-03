<template>
  <div class="processing-timer">
    <radial-progress
      :color="progressColor"
      :max="processingEndSec"
      :value="processingProgressSec"
    >
      <wt-tooltip v-show="showRenewalButton">
        <template v-slot:activator>
          <wt-icon-btn
            icon="plus"
            @click="handleClick"
          ></wt-icon-btn>
        </template>
        {{ renewalTooltip }}
      </wt-tooltip>
      <span
        v-show="!showRenewalButton"
      >{{ processingSecLeft }}</span>
    </radial-progress>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import RadialProgress from '../../../../../../app/components/utils/radial-progress.vue';

const ms = 1000;

export default {
  name: 'processing-timer',
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
    showRenewalButton() {
      return this.processingSecLeft <= this.renewalSec;
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
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
.processing-timer {
  display: inline-block;
}
</style>
