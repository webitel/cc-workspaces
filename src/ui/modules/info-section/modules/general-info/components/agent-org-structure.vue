<template>
  <article class="agent-org-structure">
    <div class="agent-org-structure__item">
      <strong class="agent-org-structure__item__title">{{ $tc('objects.team', 1) }}</strong>
      <div class="agent-org-structure__item__value">{{ team }}</div>
    </div>
    <div class="agent-org-structure__item agent-org-structure__item--supervisors">
      <strong class="agent-org-structure__item__title">{{ $tc('objects.supervisor', 1) }}</strong>
      <div class="agent-org-structure__item__value"
           v-for="(sup, key) of supervisors"
           :key="key"
      >{{ sup }}</div>
    </div>
    <div class="agent-org-structure__item agent-org-structure__item--auditors">
      <strong class="agent-org-structure__item__title">{{ $tc('objects.auditor', 1) }}</strong>
      <div class="agent-org-structure__item__value"
           v-for="(auditor, key) of auditors"
           :key="key"
      >{{ auditor }}</div>
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
    supervisors() {
      if (!this.agent.supervisor) return '';
      return this.agent.supervisor.map((supervisor) => supervisor.name);
    },
    auditors() {
      if (!this.agent.auditor) return '';
      return this.agent.auditor.map((auditor) => auditor.name);
    },
  },
};
</script>

<style lang="scss" scoped>
.agent-org-structure {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: var(--spacing-sm);

  &__item {
    text-align: center;

    &__title {
      @extend %typo-subtitle-1;
    }

    &__value {
      @extend %typo-body-1;
      overflow-wrap: break-word;
      word-break: break-all;
    }
  }
}
</style>
