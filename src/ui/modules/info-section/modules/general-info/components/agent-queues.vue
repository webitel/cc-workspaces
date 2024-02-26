<template>
  <article
    :class="[`agent-queues--${size}`]"
    class="agent-queues"
  >
    <wt-expansion-panel :size="size">
      <template v-slot:title>{{ $tc('infoSec.generalInfo.queue', 2) }}</template>
      <template>
        <ul>
          <li
            v-for="(queue, idx) in queues"
            :key="queue.queue.id"
            class="agent-queues-item"
          >
            <wt-divider v-if="idx"></wt-divider>
            <div class="agent-queues-item__inner">
              <div class="agent-queues-item__title">{{ queue.queue.name }}</div>
              <div class="agent-queues-item__status-wrapper">
                <agent-indicators
                  :agents="queue.agents"
                  :size="size"
                ></agent-indicators>
                <wt-chip>{{ queue.waitingMembers }}</wt-chip>
              </div>
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
  name: 'agent-queues',
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
};
</script>

<style lang="scss" scoped>
.agent-queues {
  .agent-queues-item {
    &__inner {
      display: grid;
      align-items: center;
      padding: var(--spacing-xs);
      grid-template-columns: 2fr 2fr;
    }

    .wt-chip {
      width: fit-content;
      justify-self: flex-end;
    }

    &__title {
      @extend %typo-body-1;
      word-break: break-all;
      overflow-wrap: break-word;
    }

    &__status-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  &--sm {
    .agent-queues-item {
      &__inner {
        @extend %typo-body-2;
        grid-template-columns: 3fr 2fr;
      }

      &__title {
        @extend %typo-body-2;
      }
    }
  }
}
</style>
