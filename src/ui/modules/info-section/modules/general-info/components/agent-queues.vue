<template>
  <article
    :class="[`agent-queues--${size}`]"
    class="agent-queues"
  >
    <wt-expansion-panel :size="size">
      <template #title>{{ $t('infoSec.generalInfo.queue', 2) }}</template>
      <template #default>
        <ul>
          <li
            v-for="queue in queues"
            :key="queue.queue.id"
            class="agent-queues-item"
          >
            <div :class="['agent-queues-item__title', size === 'sm' ? 'typo-body-2' : 'typo-body-1']">{{
              queue.queue.name }}</div>
            <div class="agent-queues-item__status-wrapper">
              <agent-indicators
                :agents="queue.agents"
                :size="size"
              ></agent-indicators>
              <wt-chip>{{ displayMembers(queue) }}</wt-chip>
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

export default {
  name: 'AgentQueues',
  components: {
    agentIndicators,
  },
  mixins: [sizeMixin],
  props: {
    queues: {
      type: Array,
      required: true,
    },
  },
  methods: {
    displayMembers(queue) {
      return queue.maxMemberLimit && queue.waitingMembers > queue.maxMemberLimit
        ? `${queue.maxMemberLimit}+`
        : queue.waitingMembers;
    },
  }
};
</script>

<style
  lang="scss"
  scoped
>
@use '@webitel/ui-sdk/src/css/main' as *;

.agent-queues {
  .agent-queues-item {
    display: grid;
    align-items: center;
    padding: var(--spacing-xs);
    grid-template-columns: 2fr 2fr;

    &:not(:last-child) {
      border-bottom: 1px solid var(--divider-border-color);
    }

    .wt-chip {
      width: fit-content;
      justify-self: flex-end;
    }

    .agent-queues-item__title {
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
      grid-template-columns: 3fr 2fr;
    }
  }
}
</style>
