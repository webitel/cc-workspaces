<template>
  <div
    class="wt-expansion-panel"
    :class="[{'wt-expansion-panel--opened':open},
    `wt-expansion-panel--${size}`]"
  >
    <div
      class="wt-expansion-panel-header"
      @click="open = !open"
    >
      <div>
        <slot name="title"></slot>
      </div>
      <wt-icon
        icon="arrow-right"
      ></wt-icon>
    </div>
    <transition name="fade">
      <div v-show="open">
        <slot></slot>
      </div>
    </transition>

  </div>
</template>

<script>
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';

export default {
  name: 'wt-expansion-panel',
  mixins: [sizeMixin],
  data: () => ({
    open: true,
  }),
};
</script>

<style lang="scss" scoped>
.wt-expansion-panel {
  @extend %typo-body-1;

  &-header {
    @extend %typo-subtitle-1;
    display: flex;
    align-items: center;
    padding: var(--spacing-2xs) var(--spacing-xs);
    background-color: var(--secondary-color-50);
    cursor: pointer;
  }

  .wt-icon {
    margin-left: auto;
  }

  &--sm {
    @extend %typo-body-2;

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

.fade-enter-active,
.fade-leave-active {
  transition: var(--transition);
}
</style>
