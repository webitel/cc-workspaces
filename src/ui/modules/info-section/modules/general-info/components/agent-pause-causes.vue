<template>
  <article
    class="agent-pause-causes"
    :class="[`agent-pause-causes--${size}`]"
  >
    <wt-expansion-panel :size="size">
      <template slot="title">{{ $t('infoSec.generalInfo.pauses') }}</template>
      <template>
        <ul>
          <li
            class="agent-pause-causes-item"
            v-for="(cause) of pauseCauses"
            :key="cause.id"
          >
            <span class="agent-pause-causes-item__name">{{ cause.name }}</span>
            <div class="agent-pause-causes-item__wrapper">
              <span>{{ duration(cause) }}</span>
              <wt-progress-bar
                :max="cause.limitMin"
                :value="cause.durationMin"
                :color="pauseCauseProgressColor(cause)"
              ></wt-progress-bar>
              <span>
          {{ prettifyPauseCauseDuration(cause.limitMin) }}
        </span>
            </div>
          </li>
        </ul>
      </template>
    </wt-expansion-panel>
  </article>
</template>

<script>
import agentPauseCauseRepresentationMixin
  from '@webitel/cc-ui-sdk/src/mixins/agentPauseCauseRepresentation/agentPauseCauseRepresentationMixin';
import sizeMixin from '../../../../../../app/mixins/sizeMixin';
import WtExpansionPanel from './wt-expansion-panel/wt-expansion-panel.vue';

export default {
  name: 'agent-pause-causes',
  components: { WtExpansionPanel },
  mixins: [agentPauseCauseRepresentationMixin, sizeMixin],
  props: {
    pauseCauses: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.agent-pause-causes {
  .agent-pause-causes-item {
    display: grid;
    grid-template-columns: 3fr 1fr;
    align-items: center;
    padding: var(--spacing-xs);

    &:not(:last-child) {
      border-bottom: 1px solid var(--secondary-color);
    }

    &__name {
      overflow-wrap: break-word;
      word-break: break-all;
    }

    &__wrapper {
      display: grid;
      grid-template-columns: 1fr 3fr 1fr;

      :first-child {
        text-align: start;
      }

      :last-child {
        text-align: end;
      }

      .wt-progress-bar {
        width: auto;
      }
    }
  }

  &--sm {
    .agent-pause-causes-item {
      grid-template-columns: 1fr;

      &__name {
        margin-bottom: var(--spacing-xs);
      }

      &__wrapper {
        grid-template-columns: 1fr 10fr 1fr;
      }
    }
  }
}
</style>
