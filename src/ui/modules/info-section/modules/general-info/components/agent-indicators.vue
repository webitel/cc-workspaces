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
      :text="online"
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
    online() {
      return this.agents.online;
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
