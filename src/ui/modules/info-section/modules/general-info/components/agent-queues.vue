<template>
  <article
    :class="[`agent-queues--${size}`]"
    class="agent-queues"
  >
    <wt-expansion-panel :size="size">
      <template slot="title">{{ $tc('infoSec.generalInfo.queue', 2) }}</template>
      <template>
        <ul>
          <li
            v-for="queue in queues"
            :key="queue.queue.id"
            class="agent-queues-item"
          >
            <div class="agent-queues-item__title">{{ queue.queue.name }}</div>
            <div class="agent-queues-item__status-wrapper">
              <agent-indicators
                :agents="queue.agents"
                :size="size"
              ></agent-indicators>
              <wt-chip>{{ queue.waitingMembers }}</wt-chip>
            </div>
          </li>
        </ul>
      </template>
    </wt-expansion-panel>
  </article>
</template>

<script>
import sizeMixin from '../../../../../../app/mixins/sizeMixin';
import agentIndicators from './agent-indicators.vue';
import WtExpansionPanel from './wt-expansion-panel/wt-expansion-panel.vue';

export default {
  name: 'agent-queues',
  components: {
    WtExpansionPanel,
    agentIndicators,
  },
  mixins: [sizeMixin],
  props: {
    queues: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.agent-queues {
  .agent-queues-item {
    display: grid;
    align-items: center;
    padding: var(--spacing-xs);
    grid-template-columns: 2fr 1fr;

    &:not(:last-child) {
      border-bottom: 1px solid var(--secondary-color);
    }

    .wt-chip {
      width: fit-content;
      justify-self: flex-end;
    }

    .agent-queues-item__title {
      @extend %typo-body-1;
      word-break: break-all;
      overflow-wrap: break-word;
    }

    .agent-queues-item__status-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  &--sm {
    .agent-queues-item {
      @extend %typo-body-2;
      grid-template-columns: 3fr 2fr;

      .agent-queues-item__title {
        @extend %typo-body-2;
      }
    }
  }
}
</style>
