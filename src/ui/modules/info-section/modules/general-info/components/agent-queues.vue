<template>
  <article class="agent-queues">
    <wt-expansion-panel :size="size">
      <template slot="title">{{ $t('infoSec.generalInfo.queue') }}</template>
      <template>
        <ul>
          <li
            class="agent-queues__item"
            v-for="queue in queues"
            :key="queue.queue.id"
          >
            <div class="agent-queues__title">{{ queue.queue.name }}</div>
            <div class="agent-queues__inner">
              <table-agents
                :agents="queue.agents"
                :size="size"
              ></table-agents>
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
import tableAgents from './table-agents.vue';
import WtExpansionPanel from './wt-expansion-panel/wt-expansion-panel.vue';

export default {
  name: 'agent-queues',
  components: {
    WtExpansionPanel,
    tableAgents,
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
.agent-queues__item {
  display: grid;
  grid-template-columns: 3fr 1fr;
  align-items: center;
  padding: var(--spacing-xs);

  .agent-queues__inner {
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

  .agent-queues__title {
    overflow-wrap: break-word;
    word-break: break-all;

    &:last-of-type {
      justify-self: end;
    }
  }
}
</style>
