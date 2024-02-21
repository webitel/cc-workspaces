<template>
  <article class="lookup-item-wrapper">
    <div class="lookup-item-wrapper-main-content">
      <slot>
        <div v-if="$slots.before" class="lookup-item-wrapper__before">
          <slot name="before">
            <wt-avatar></wt-avatar>
          </slot>
        </div>
        <div v-if="$slots.main" class="lookup-item-wrapper__main">
          <slot name="main">
            <div></div>
          </slot>
        </div>
        <div
          v-if="$slots.after"
          class="lookup-item-wrapper__after"
        >
          <slot name="after" v-bind="{ expanded, toggle: toggleExpansion }"></slot>
        </div>
      </slot>
    </div>
    <div
      v-if="$slots.expansion"
      class="lookup-item-wrapper-expansion"
    >
      <wt-expand-transition>
        <div
          v-if="expanded"
          class="lookup-item-wrapper-expansion__content-wrapper"
        >
          <slot name="expansion"></slot>
        </div>
      </wt-expand-transition>
    </div>
  </article>
</template>

<script>
import WtExpandTransition from '@webitel/ui-sdk/src/components/transitions/wt-expand-transition.vue';

export default {
  name: 'lookup-item-wrapper',
  components: { WtExpandTransition },
  data: () => ({
    expanded: false,
  }),
  methods: {
    toggleExpansion() {
      this.expanded = !this.expanded;
    },
  },
};
</script>

<style lang="scss" scoped>
$min-height: 50px;

.lookup-item-wrapper {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  min-height: $min-height;

  &__main {
    flex-grow: 1;
  }

  .lookup-item-wrapper-main-content {
    display: flex;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs);
    transition: var(--transition);
    border: 1px solid transparent;
    border-radius: var(--border-radius);


    &:hover {
      border-color: var(--primary-color);
    }
  }
}

.lookup-item-wrapper-expansion__content-wrapper {
  margin-top: var(--spacing-xs);
}
</style>
