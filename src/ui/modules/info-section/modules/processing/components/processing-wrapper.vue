<template>
  <article class="processing-wrapper">
    <header class="processing-header">
      <slot name="title"></slot>
    </header>
    <slot name="form"></slot>
    <processing-timer
      v-if="showTimer"
      :start-processing-at="task.attempt.startProcessingAt"
      :processing-timeout-at="task.attempt.processingTimeoutAt"
      :processing-sec="task.attempt.processingSec"
      :renewal-sec="task.attempt.renewalSec"
      @click="task.attempt.renew()"
    ></processing-timer>
    <footer class="processing-actions">
      <slot name="actions"></slot>
    </footer>
  </article>
</template>

<script>
import ProcessingTimer from './timer/processing-timer.vue';

export default {
  name: 'processing-wrapper',
  components: { ProcessingTimer },
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  computed: {
    showTimer() {
      return this.task.attempt?.processingSec;
    },
  },
};
</script>

<style lang="scss" scoped>
.processing-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.processing-header {
  @extend %typo-heading-2;
  text-align: center;
}

.processing-timer {
  margin: auto;
}

.processing-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}
</style>
