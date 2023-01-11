<template>
  <article
    class="agent-org-structure"
    :class="[`agent-org-structure--${size}`]"
  >
    <wt-expansion-panel :size="size">
      <template slot="title">{{ $tc('objects.team', 1) }}</template>
      <template>
        <ul>
          <li class="agent-org-structure-item">
            <div class="agent-org-structure-item__title">{{ $t('reusable.name') }}</div>
            <div class="agent-org-structure-item__value">{{ team }}</div>
          </li>
          <li class="agent-org-structure-item">
            <div class="agent-org-structure-item__title">{{ $tc('objects.supervisor', 1) }}</div>
            <div>
              <div
                class="agent-org-structure-item__value"
                v-for="(sup, key) of supervisors"
                :key="key"
              >{{ sup }}
              </div>
            </div>
          </li>
          <li class="agent-org-structure-item">
            <div class="agent-org-structure-item__title">{{ $tc('objects.auditor', 1) }}</div>
            <div>
              <div
                class="agent-org-structure-item__value"
                v-for="(auditor, key) of auditors"
                :key="key"
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
.agent-org-structure {

  .agent-org-structure-item {
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

    &__value {
      overflow-wrap: break-word;
      word-break: break-all;
    }

    &__title {
      @extend %typo-subtitle-1;
    }
  }

  &--sm {
    .agent-org-structure-item__title {
      @extend %typo-subtitle-2;
    }
  }
}
</style>
