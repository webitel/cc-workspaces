<template>
  <article class="agent-queues">
    <!--    Headers-->
    <div class="agent-queues__headers">
      <div
        class="agent-queues__headers-item"
        v-for="(header, index) in headers"
        :key="index"
      >
        {{ $t(`${header.locale}`) }}
      </div>
    </div>
    <!--    Sub headers-->
    <div class="agent-queues__sub-headers">
      <div
        class="agent-queues__sub-headers-item"
        v-for="(subHeader, index) in subHeaders"
        :key="index"
      >
        {{ $t(`${subHeader.locale}`) }}
      </div>
    </div>
    <!--    Queues-->
    <div
      class="agent-queues__queue"
      v-for="queue in queues"
      :key="queue.queue.id"
    >
      <div class="agent-queues__queue-item">{{ queue.queue.name }}</div>
      <div class="agent-queues__queue-item">{{ queue.agents.total }}</div>
      <div class="agent-queues__queue-item">
        <wt-indicator
          color="primary"
          :text="queue.agents.pause"
        ></wt-indicator>
      </div>
      <div class="agent-queues__queue-item">
        <wt-indicator
          color="success"
          :text="queue.agents.free"
        ></wt-indicator>
      </div>
      <div class="agent-queues__queue-item">
        <wt-badge>{{ queue.waitingMembers }}</wt-badge>
      </div>
    </div>
  </article>
</template>

<script>
import headers from '../../../../store/modules/agent-info/_internals/headers';
import subHeaders from '../../../../store/modules/agent-info/_internals/subHeaders';

export default {
  name: 'agent-queues',
  data: () => ({
    headers,
    subHeaders,
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
  @extend %typo-body-lg;
}

.agent-queues__headers {
  @extend %typo-strong-lg;
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  justify-items: center;
}

.agent-queues__sub-headers {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  justify-items: center;

  .agent-queues__sub-headers-item:first-child {
      grid-column-start: 2;
    }
}

.agent-queues__queue {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  margin-top: var(--component-spacing);

  .agent-queues__queue-item {

    & + .agent-queues__queue-item {
      @extend %typo-strong-lg;
      justify-self: center;

    }
    .wt-badge {
      @extend %typo-strong-sm;
    }
  }
}
</style>
