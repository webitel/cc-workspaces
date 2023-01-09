<template>
  <article
    class="agent-org-structure"
    :class="[`agent-org-structure--${size}`]"
  >
    <wt-expansion-panel :size="size">
      <template slot="title">{{ $t('infoSec.generalInfo.agentTeam') }}</template>
      <template>
        <ul>
          <li class="agent-org-structure__item">
            <div class="agent-org-structure__item-title">{{ $tc('objects.team', 1) }}</div>
            <div class="agent-org-structure__item-value">{{ team }}</div>
          </li>
          <li class="agent-org-structure__item">
            <div class="agent-org-structure__item-title">{{ $tc('objects.supervisor', 1) }}</div>
            <div
              class="agent-org-structure__item-value"
              v-for="(sup, key) of supervisors"
              :key="key"
            >{{ sup }}
            </div>
          </li>
          <li class="agent-org-structure__item">
            <div class="agent-org-structure__item-title">{{ $tc('objects.auditor', 1) }}</div>
            <div
              class="agent-org-structure__item-value"
              v-for="(auditor, key) of auditors"
              :key="key"
            >{{ auditor }}
            </div>
          </li>
        </ul>
      </template>
    </wt-expansion-panel>
  </article>
</template>

<script>
import sizeMixin from '../../../../../../app/mixins/sizeMixin';
import WtExpansionPanel from './wt-expansion-panel/wt-expansion-panel.vue';

export default {
  name: 'agent-org-structure',
  props: {
    agent: {
      type: Object,
      required: true,
    },
  },
  components: { WtExpansionPanel },
  mixins: [sizeMixin],
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
.agent-org-structure__item {
  display: grid;
  grid-template-columns: 3fr 1fr;
  justify-items: flex-start;
  padding: var(--spacing-xs);

  &:not(:last-child) {
    border-bottom: 1px solid var(--secondary-color);
  }

  &:last-child {
    justify-self: start;
  }

  &-value {
    overflow-wrap: break-word;
    word-break: break-all;
  }

  &-title {
    @extend %typo-subtitle-1;
  }
}

.agent-org-structure--sm {
  &-title {
    @extend %typo-subtitle-2;
  }
}
</style>
