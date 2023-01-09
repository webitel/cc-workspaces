<template>
  <div
    class="table-agents"
    :class="[`table-agents--${size}`]"
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
  name: 'table-agents',
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
.table-agents {
  display: flex;
  justify-content: space-evenly;
  gap: 4px;

  &__total {
    @extend %typo-subtitle-1;
  }
}
.table-agents--sm {
  flex-direction: column;
}
</style>
