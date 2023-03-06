<template>
  <article class="processing-wrapper">
    <div>
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
    </div>
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
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--spacing-xs);
}

.processing-header {
  @extend %typo-heading-2;
  text-align: center;
}

.processing-timer {
  display: flex;
  justify-content: center;
  padding-top: var(--spacing-sm);
}

.processing-actions {
  position: sticky;
  bottom: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
  padding-top: var(--spacing-sm);
  background-color: var(--main-color);
}
</style>
