<template>
  <section class="task-container">
    <div class="task-container__header-wrapper">
      <wt-replace-transition>
       <slot name="header"></slot>
      </wt-replace-transition>
    </div>
    <div class="task-container__body-wrapper">
      <wt-replace-transition>
        <slot name="body"></slot>
      </wt-replace-transition>
    </div>
    <div class="task-container__footer-wrapper">
      <slot name="footer"></slot>
    </div>
  </section>
</template>

<script>
import WtReplaceTransition from '@webitel/ui-sdk/src/components/transitions/cases/wt-replace-transition.vue';
export default {
  name: 'TaskContainer',
  components: { WtReplaceTransition }
};
</script>

<style lang="scss" scoped>
.task-container {
  display: flex;
  flex-direction: column;

  .task-container__body-wrapper {
    flex-grow: 1;
    height: auto;
    min-height: 0;
    padding: var(--spacing-xs) 0;
  }
}
</style>
