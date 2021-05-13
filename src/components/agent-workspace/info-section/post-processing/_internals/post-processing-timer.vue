<template>
  <div class="post-processing-timer">
    <radial-progress
      :max="processingEndSec"
      :value="processingProgressSec"
      :color="progressColor"
    >
      <wt-icon-btn
        v-show="showRenewalButton"
        icon="plus"
        :tooltip="$t('+30 sec')"
        @click="handleClick"
      ></wt-icon-btn>
      <span
        v-show="!showRenewalButton"
      >{{ processingSecLeft }}</span>
    </radial-progress>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import RadialProgress from '../../../../utils/radial-progress.vue';

const ms = 1000;

export default {
  name: 'post-processing-timer',
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
    renewalSec: {
      type: Number,
      default: 5,
      description: 'How many sec should left before processingTimeout',
    },
  },
  computed: {
    ...mapState('now', {
      now: (state) => state.now,
    }),
    processingSecLeft() {
      return Math.ceil((this.processingTimeoutAt - this.now) / ms);
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
.post-processing-timer {
  display: inline-block;
}
</style>
