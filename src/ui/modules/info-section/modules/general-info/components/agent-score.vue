<template>
  <article
    :class="[`agent-score--${size}`]"
    class="agent-score"
  >
    <wt-expansion-panel :size="size">
      <template v-slot:title>{{ $tc('infoSec.generalInfo.score') }}</template>
      <template>
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
              {{ score.scoreCount }}
            </div>
          </li>
          <li class="agent-score-item">
            <div class="agent-score-item__title">
              {{ $t('widgets.scoreAvg') }}
            </div>
            <div class="agent-score-item__value">
              <wt-icon
                icon="widget-score-avg"
                icon-prefix="ws"
                :size="size"
              ></wt-icon>
              {{ (+score.scoreAvg || 0).toFixed() }}%
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
  name: 'agent-score',
  components: { WtExpansionPanel },
  mixins: [sizeMixin],
  props: {
    score: {
      type: Object,
      required: true,
    },
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

    &:not(:last-child) {
      border-bottom: 1px solid var(--secondary-color);
    }

    .agent-score-item__title {
      @extend %typo-body-1;
    }

    .agent-score-item__value {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
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
