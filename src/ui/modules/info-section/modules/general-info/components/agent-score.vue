<template>
  <article
    :class="[`agent-score--${size}`]"
    class="agent-score"
  >
    <wt-expansion-panel :size="size">
      <template #title>{{ $tc('infoSec.generalInfo.score') }}</template>
      <template #default>
        <ul>
          <li class="agent-score-item">
            <div class="agent-score-item__title">
              {{ $t('widgets.scoreCount') }}
            </div>
            <div class="agent-score-item__value">
              <wt-icon
                icon="widget-score-count"
                icon-prefix="ws"
                :size="size"
              ></wt-icon>
              {{ scoreCount || 0 }}
            </div>
          </li>
          <wt-divider />
          <li class="agent-score-item">
            <div class="agent-score-item__title">
              {{ $t('widgets.scoreAvg') }}
            </div>
            <div class="agent-score-item__value-tooltip">
              <wt-tooltip>
                <template #activator>
                  <div class="agent-score-item__value">
                    <wt-icon
                      icon="widget-score-avg"
                      icon-prefix="ws"
                      :size="size"
                    ></wt-icon>
                    {{ (+scoreAvg || 0).toFixed(2) }}
                  </div>
                </template>
                {{ scoreAvg || 0 }}
              </wt-tooltip>
            </div>
          </li>
        </ul>
      </template>
    </wt-expansion-panel>
  </article>
</template>

<script>
import { mapGetters } from 'vuex';

import sizeMixin from '../../../../../../app/mixins/sizeMixin';

export default {
  name: 'AgentScore',
  mixins: [sizeMixin],
  computed: {
    ...mapGetters('ui/widget', {
      scoreCount: 'SCORE_COUNT',
      scoreAvg: 'SCORE_REQUIRED_AVG',
    }),
  },
};
</script>

<style lang="scss" scoped>
.agent-score {
  .agent-score-item {
    display: grid;
    align-items: center;
    padding: var(--spacing-xs);
    grid-template-columns: 3fr 2fr;

    .agent-score-item__title {
      @extend %typo-body-1;
    }

    .agent-score-item__value-tooltip {
      width: fit-content;
    }

    .agent-score-item__value {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      width: fit-content;
    }
  }

  &--sm {
    .agent-score-item {
      @extend %typo-body-2;

      .agent-score-item__title {
        @extend %typo-body-2;
      }
    }
  }
}
</style>
