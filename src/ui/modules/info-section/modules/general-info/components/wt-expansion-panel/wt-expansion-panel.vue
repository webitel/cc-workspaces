<template>
  <div
    :class="[{'wt-expansion-panel--opened':open},
    `wt-expansion-panel--${size}`]"
    class="wt-expansion-panel"
  >
    <div
      class="wt-expansion-panel-header"
      tabindex="0"
      @click="open = !open"
      @keypress.enter="open = !open"
    >
      <slot name="title"></slot>
      <wt-icon
        icon="arrow-right"
      ></wt-icon>
    </div>
    <wt-expand-transition>
      <div v-show="open">
        <slot></slot>
      </div>
    </wt-expand-transition>
  </div>
</template>

<script>
import WtExpandTransition from '@webitel/ui-sdk/src/components/transitions/wt-expand-transition.vue';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';

export default {
  name: 'wt-expansion-panel',
  components: { WtExpandTransition },
  mixins: [sizeMixin],
  data: () => ({
    open: true,
  }),
};
</script>

<style lang="scss" scoped>
.wt-expansion-panel {
  .wt-expansion-panel-header {
    @extend %typo-subtitle-1;
    display: flex;
    align-items: center;
    padding: var(--spacing-2xs) var(--spacing-xs);
    cursor: pointer;
    border-radius: var(--spacing-2xs);
    background-color: var(--secondary-color-50);
  }

  .wt-icon {
    margin-left: auto;
  }

  &--sm {
    .wt-expansion-panel-header {
      @extend %typo-subtitle-2;
    }
  }

  &--opened {
    .wt-icon {
      transform: rotate(90deg);
    }
  }
}
</style>
