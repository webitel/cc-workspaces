<template>
  <article
    :class="[`agent-pause-causes--${size}`]"
    class="agent-pause-causes"
  >
    <wt-expansion-panel :size="size">
      <template slot="title">{{ $t('infoSec.generalInfo.pauses') }}</template>
      <template>
        <ul>
          <li
            v-for="(cause) of pauseCauses"
            :key="cause.id"
            class="agent-pause-causes-item"
          >
            <span class="agent-pause-causes-item__name">{{ cause.name }}</span>
            <div class="agent-pause-causes-item__wrapper">
              <span>{{ duration(cause) }}</span>
              <wt-progress-bar
                :color="pauseCauseProgressColor(cause)"
                :max="cause.limitMin"
                :value="cause.durationMin"
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
    @extend %typo-body-1;
    display: grid;
    align-items: center;
    padding: var(--spacing-xs);
    grid-template-columns: 2fr 1fr;

    &:not(:last-child) {
      border-bottom: 1px solid var(--secondary-color);
    }

    &__name {
      word-break: break-all;
      overflow-wrap: break-word;
    }

    &__wrapper {
      display: grid;
      grid-template-columns: 1fr 3fr 1fr;
      gap: var(--spacing-sm);

      :last-child {
        text-align: end;
      }

      .wt-progress-bar {
        width: auto;
        height: fit-content;
        margin: auto 0;
      }
    }
  }

  &--sm {
    .agent-pause-causes-item {
      @extend %typo-body-2;
      grid-template-columns: 1fr;

      &__name {
        margin-bottom: var(--spacing-xs);
      }

      &__wrapper {
        grid-template-columns: 1fr 10fr 1fr;
        gap: var(--spacing-xs);
      }
    }
  }
}
</style>
