<template>
  <div class="table-agents">
    <wt-indicator
      color="primary"
      :text="pause"
    ></wt-indicator>
    <wt-indicator
      color="success"
      :text="free"
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
    @extend %typo-strong-lg;
  }
}
</style>
