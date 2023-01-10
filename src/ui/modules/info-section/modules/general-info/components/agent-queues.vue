<template>
  <article class="agent-queues">
    <wt-expansion-panel :size="size">
      <template slot="title">{{ $tc('infoSec.generalInfo.queue', 2) }}</template>
      <template>
        <ul>
          <li
            class="agent-queues-item"
            v-for="queue in queues"
            :key="queue.queue.id"
          >
            <div class="agent-queues-item__title">{{ queue.queue.name }}</div>
            <div class="agent-queues-item__wrapper">
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
.agent-queues-item {
  display: grid;
  grid-template-columns: 3fr 1fr;
  align-items: center;
  padding: var(--spacing-xs);

  &__wrapper {
    display: flex;
    justify-content: space-between;

    .wt-chip {
      height: fit-content;
      margin: auto 0;
    }
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--secondary-color);
  }

  &__title {
    overflow-wrap: break-word;
    word-break: break-all;

    &:last-of-type {
      justify-self: end;
    }
  }
}
</style>
