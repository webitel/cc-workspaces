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

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import RadialProgress from '../../../../../../../app/components/utils/radial-progress.vue';

const ms = 1000;

const props = defineProps({
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
    description: 'Processing object with prolongation info',
  },
});

const emit = defineEmits(['click']);

const store = useStore();
const { t } = useI18n();

const now = computed(() => store.state.ui.now.now);

const processingSecLeft = computed(() => {
  return Math.max(0, Math.floor((props.processingTimeoutAt - now.value) / ms));
});

const processingEndSec = computed(() => {
  if (!now.value) return 0; // reactive ticking
  return Math.ceil((props.processingTimeoutAt - props.startProcessingAt) / ms);
});

const processingProgressSec = computed(() => {
  if (!now.value) return 0; // reactive ticking
  return processingEndSec.value - processingSecLeft.value;
});

const remainingProlongations = computed(() => {
  return props.processing?.processingProlongation?.remainingProlongations ?? 0;
});

const showRenewalButton = computed(() => {
  return (processingSecLeft.value <= props.renewalSec) && remainingProlongations.value;
});

const renewalTooltip = computed(() => {
  return `+${props.processingSec} ${t('date.sec')}`;
});

const progressColor = computed(() => {
  if (processingProgressSec.value / processingEndSec.value < 0.5) return 'success';
  if (processingProgressSec.value / processingEndSec.value < 0.75) return 'primary';
  return 'danger';
});

const handleClick = () => {
  emit('click', props.processing?.processingProlongation?.prolongationSec || 0);
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
