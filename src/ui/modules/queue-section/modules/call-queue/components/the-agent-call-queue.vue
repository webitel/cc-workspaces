<template>
  <article
    class="task-queue call-queue"
    :class="[
      `call-queue--${size}`
    ]"
  >
    <wt-expansion-panel
      v-for="({ value, counters }) in expansions"
      :size="size"
      :key="value"
    >
      <template v-slot:title>
        {{ `${$t(`queueSec.call.${value}`)} ${$t('queueSec.call.call', 2).toLowerCase()}` }}
      </template>
      <template v-slot:actions>
        <wt-chip
          v-for="({ color, count }, key) in counters"
          v-if="count"
          :size="size"
          :color="color"
          :key="key"
        >{{ count }}
        </wt-chip>
      </template>
      <template>
        <component
          :size="size"
          :is="`${value}-queue`"
        />
      </template>
    </wt-expansion-panel>
  </article>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { CallActions } from 'webitel-sdk';
import ActiveQueue from './active-queue/active-queue-container.vue';
import OfflineQueue from './offline-queue/offline-queue-container.vue';
import MissedQueue from './missed-queue/missed-queue-container.vue';
import ManualQueue from './manual-queue/manual-queue-container.vue';
import sizeMixin from '../../../../../../app/mixins/sizeMixin';

export default {
  name: 'the-agent-call-queue',
  mixins: [sizeMixin],
  components: {
    ActiveQueue,
    OfflineQueue,
    MissedQueue,
    ManualQueue,
  },
  data: () => ({
  }),

  computed: {
    ...mapState('features/call', {
      callList: (state) => state.callList,
    }),
    ...mapState('features/call/missed', {
      missedList: (state) => state.missedList,
    }),
    ...mapState('features/call/manual', {
      manualList: (state) => state.manualList,
    }),
    ...mapState('features/member', {
      membersList: (state) => state.memberList,
    }),
    ringingCallsCount() {
      return this.callList.filter((call) => call.state === CallActions.Ringing).length;
    },
    activeCallsCount() {
      return this.callList.length = this.ringingCallsCount;
    },

    expansions() {
      return [
        {
          value: 'active',
          counters: [
            { color: 'main', count: this.activeCallsCount },
            { color: 'success', count: this.ringingCallsCount },
          ],
        },
        {
          value: 'missed',
          counters: [
            { color: 'secondary', count: this.missedList.length },
          ],
        },
        {
          value: 'offline',
          counters: [
            { color: 'secondary', count: this.membersList.length },
          ],
        },
        {
          value: 'manual',
          counters: [
            { color: 'secondary', count: this.manualList.length },
          ],
        },
      ];
    },
  },

  methods: {
    ...mapActions('features/call', {
      openNewCall: 'OPEN_NEW_CALL',
    }),
  },
};
</script>

<style lang="scss" scoped>
.call-queue {
  .call-queue__title-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &--sm {
    .call-queue__title-wrapper {
      flex-direction: column;
      gap: var(--spacing-xs);
    }
  }
}

.wt-tabs {
  width: fit-content;

  .queue-tab__wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .queue-tab__indicator {
    position: absolute;
    top: 0;
    right: -3px;
    width: 6px;
    height: 6px;
    border-radius: 50%;

    &.active {
      background: var(--icon-success-color);
    }

    &.offline {
      background: var(--icon-primary-color);
    }

    &.missed {
      background: var(--icon-error-color);
    }

    &.manual {
      background: var(--icon-color);
    }
  }
}
</style>
