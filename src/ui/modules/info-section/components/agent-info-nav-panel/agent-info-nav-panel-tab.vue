<template>
  <wt-tooltip
    class="agent-info-nav-panel-tab"
    :class="{ 'agent-info-nav-panel-tab--active': active }"
  >
    <template v-slot:activator>
      <button
        class="agent-info-nav-panel-tab__button"
        type="button"
        @click="$emit('click')"
      >
        <wt-icon
          :icon="icon"
          icon-prefix="ws"
        ></wt-icon>
      </button>
    </template>
    {{ title }}
  </wt-tooltip>
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
  }

  &--active {
    background: var(--secondary-color-50);
  }

  &__button {
    line-height: 0;
  }
}
</style>
