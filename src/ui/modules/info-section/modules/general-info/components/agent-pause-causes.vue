<template>
  <article class="agent-pause-causes">
    <wt-expansion-panel :size="size">
      <template slot="title">{{ $t('infoSec.generalInfo.reasonPauses') }}</template>
      <template>
        <ul>
          <li
            class="agent-pause-cause__item"
            :class="[`agent-pause-cause__item--${size}`]"
            v-for="(cause) of pauseCauses"
            :key="cause.id"
          >
            <span class="agent-pause-causes__name">{{ cause.name }}</span>
            <div class="agent-pause-causes__item-inner">
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
.agent-pause-cause__item {
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

  .agent-pause-causes__item-inner {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    text-align: center;

    .wt-progress-bar {
      margin: 0 var(--spacing-xs);
      width: auto;
    }
  }
}

.agent-pause-cause__item--sm {
  grid-template-columns: 1fr;

  .agent-pause-causes__name {
    margin-bottom: var(--spacing-xs);
  }

  .agent-pause-causes__item-inner {
    grid-template-columns: 1fr 10fr 1fr;
  }
}
</style>
