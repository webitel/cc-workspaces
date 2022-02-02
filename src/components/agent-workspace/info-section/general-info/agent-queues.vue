<template>
  <article class="agent-queues">

    <div class="agent-queues__headers">
      <div
        class="agent-queues__headers-item"
        v-for="(header, index) in headers"
        :key="index"
      >
        {{ $t(header.locale) }}
      </div>
    </div>

    <div
      class="agent-queues__queue"
      v-for="queue in queues"
      :key="queue.queue.id"
    >
      <div class="agent-queues__queue-item">{{ queue.queue.name }}</div>

      <table-agents
        :agents="queue.agents"
      ></table-agents>

      <div class="agent-queues__queue-item">
        <wt-chip>{{ queue.waitingMembers }}</wt-chip>
      </div>
    </div>
  </article>
</template>

<script>
import tableAgents from './table-agents.vue';
import headers from '../../../../store/modules/agent-info/_internals/agentQueuesHeaders';

export default {
  name: 'agent-queues',
  components: {
    tableAgents,
  },
  data: () => ({
    headers,
  }),
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
  @extend %typo-body-1;
}

.agent-queues__headers {
  @extend %typo-subtitle-1;
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  justify-items: center;

  .agent-queues__headers-item:first-child {
    justify-self: start;
  }
}

.agent-queues__queue {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  align-items: center;
  gap: 4px;
  margin-top: var(--component-spacing);

  .agent-queues__queue-item {
    overflow-wrap: break-word;
    word-break: break-all;

    &:last-of-type {
      justify-self: center;
    }
  }

  .wt-chip {
    @extend %typo-caption;
  }
}
</style>
