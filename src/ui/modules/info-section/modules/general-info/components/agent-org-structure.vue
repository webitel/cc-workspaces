<template>
  <article
    class="agent-org-structure"
    :class="[`agent-org-structure--${size}`]"
  >
    <wt-expansion-panel :size="size">
      <template #title>{{ $tc('objects.team', 1) }}</template>
      <template #default>
        <ul>
          <li class="agent-org-structure-item">
            <div class="agent-org-structure-item__title">{{ $t('reusable.name') }}</div>
            <div class="agent-org-structure-item__value">{{ team }}</div>
          </li>
          <wt-divider />
          <li class="agent-org-structure-item">
            <div class="agent-org-structure-item__title">{{ $tc('objects.supervisor', 1) }}</div>
            <div>
              <div
                v-for="(sup, key) of supervisors"
                :key="key"
                class="agent-org-structure-item__value"
              >{{ sup }}
              </div>
            </div>
          </li>
          <wt-divider />
          <li class="agent-org-structure-item">
            <div class="agent-org-structure-item__title">{{ $tc('objects.auditor', 1) }}</div>
            <div>
              <div
                v-for="(auditor, key) of auditors"
                :key="key"
                class="agent-org-structure-item__value"
              >{{ auditor }}
              </div>
            </div>
          </li>
        </ul>
      </template>
    </wt-expansion-panel>
  </article>
</template>

<script>
import sizeMixin from '../../../../../../app/mixins/sizeMixin';
export default {
  name: 'AgentOrgStructure',
  mixins: [sizeMixin],
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

  .agent-org-structure-item {
    display: grid;
    grid-template-columns: 2fr 1fr;
    justify-items: flex-start;
    padding: var(--spacing-xs);


    &__value {
      @extend %typo-body-1;
      overflow-wrap: break-word;
      word-break: break-all;
    }

    &__title {
      @extend %typo-subtitle-1;
    }
  }

  &--sm {
    .agent-org-structure-item {
      grid-template-columns: 3fr 2fr;
    }
    .agent-org-structure-item__title {
      @extend %typo-subtitle-2;
    }
    .agent-org-structure-item__value {
      @extend %typo-body-2;
    }
  }
}
</style>
