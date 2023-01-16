<template>
  <div
    class="agent-indicators"
    :class="[`agent-indicators--${size}`]"
  >
    <wt-indicator
      color="primary"
      :text="pause"
      :size="size"
    ></wt-indicator>
    <wt-indicator
      color="success"
      :text="free"
      :size="size"
    ></wt-indicator>
  </div>
</template>

<script>
export default {
  name: 'agent-indicators',
  props: {
    agents: {
      type: Object,
      required: true,
    },
    size: {
      type: String,
      default: 'md',
      options: ['sm', 'md'],
    },
  },
  computed: {
    pause() {
      return this.agents.pause;
    },
    free() {
      return this.agents.free;
    },
  },
};
</script>

<style lang="scss" scoped>
.agent-indicators {
  display: flex;
  justify-content: space-evenly;
  gap: var(--spacing-2xs);

  &--sm {
    flex-direction: column;
  }
}
</style>
