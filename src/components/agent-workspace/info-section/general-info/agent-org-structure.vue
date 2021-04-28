<template>
  <article class="agent-org-structure">
    <div class="agent-org-structure__item">
      <strong class="agent-org-structure__item__title">{{ $tc('objects.team', 1) }}</strong>
      <div class="agent-org-structure__item__value">{{ team }}</div>
    </div>
    <div class="agent-org-structure__item">
      <strong class="agent-org-structure__item__title">{{ $tc('objects.supervisor', 1) }}</strong>
      <div class="agent-org-structure__item__value">{{ supervisor }}</div>
    </div>
    <div class="agent-org-structure__item">
      <strong class="agent-org-structure__item__title">{{ $tc('objects.auditor', 1) }}</strong>
      <div class="agent-org-structure__item__value">{{ auditor }}</div>
    </div>
  </article>
</template>

<script>
export default {
  name: 'agent-org-structure',
  props: {
    agent: {
      type: Object,
      required: true,
    },
  },
  computed: {
    team() {
      return this.agent.team?.name || '';
    },
    supervisor() {
      return this.agent.supervisor?.name || '';
    },
    auditor() {
      return this.agent.auditor?.name || '';
    },
  },
};
</script>

<style lang="scss" scoped>
.agent-org-structure {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: var(--component-spacing);

  &__item {
    text-align: center;

    &__title {
      @extend %typo-strong-lg;
    }

    &__value {
      @extend %typo-body-lg;
      overflow-wrap: break-word;
      word-break: break-all;
    }
  }
}
</style>
