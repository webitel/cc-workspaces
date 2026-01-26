<template>
  <article class="processing-wrapper">
    <div class="processing-content wt-scrollbar">
      <header class="processing-header typo-heading-2">
        <slot name="title"></slot>
      </header>
      <slot name="form"></slot>
      <processing-timer
        v-if="showTimer"
        :start-processing-at="task.attempt.startProcessingAt"
        :processing-timeout-at="task.attempt.processingTimeoutAt"
        :processing-sec="task.attempt.processingSec"
        :renewal-sec="task.attempt.renewalSec"
        :processing="processing"
        @click="renewProcessing"
      ></processing-timer>
    </div>
    <footer class="processing-actions">
      <slot name="actions"></slot>
    </footer>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import applyTransform, {
  snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import ProcessingTimer from './timer/processing-timer.vue';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const showTimer = computed(() => {
  return props.task.attempt?.processingSec;
});


//NOTE: this is needed to convert _processing keys from snake_case to camelCase
//https://webitel.atlassian.net/browse/WTEL-5536
const processing = computed(() => {
  return applyTransform(props.task?.attempt?._processing, [snakeToCamel()]);
});

const renewProcessing = (prolongationSec) => {
  props.task.attempt.renew(prolongationSec);
};
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.processing-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.processing-header {
  text-align: center;
}

.processing-timer {
  align-items: center;
  padding-top: var(--spacing-sm);
}

.processing-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
  padding-top: var(--spacing-sm);
  background-color: var(--content-wrapper-color);
}

.processing-content {
  overflow-y: scroll;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding-right: var(--spacing-xs);
}
</style>
