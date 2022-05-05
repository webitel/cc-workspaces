<template>
  <button
    class="agent-info-nav-panel-tab"
    :class="{ 'agent-info-nav-panel-tab--active': active }"
    type="button"
    @click="$emit('click')"
  >
    <wt-icon
      :icon="icon"
      icon-prefix="ws"
    ></wt-icon>
    <wt-tooltip v-if="title">{{ title }}</wt-tooltip>
  </button>
</template>

<script>
export default {
  name: 'agent-info-nav-panel-tab',
  props: {
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.agent-info-nav-panel-tab {
  position: relative;
  padding: var(--spacing-xs);
  border-radius: var(--border-radius);
  transition: var(--transition);
  outline: none;
  line-height: 0;

  &:hover {
    background: var(--main-color);

    .wt-tooltip {
      opacity: 1;
    }
  }

  &--active {
    background: var(--secondary-color-50);
  }

  .wt-tooltip {
    position: absolute;
    top: 50%;
    left: calc(-100% + var(--spacing-lg));
    transform: translate(-100%, -50%);
    white-space: nowrap;
  }
}
</style>
