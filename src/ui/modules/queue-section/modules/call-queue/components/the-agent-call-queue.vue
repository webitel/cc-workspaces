<template>
  <article
    class="task-queue call-queue"
    :class="[
      `call-queue--${size}`
    ]"
  >
    <wt-expansion-panel
      :size="size"
    >
      <template v-slot:title>
        {{ `${$t('queueSec.call.active')} ${$t('queueSec.call.call', 2).toLowerCase()}` }}
      </template>
      <template v-slot:actions>
        <wt-chip :size="size">{{ callList.length }}</wt-chip>
      </template>
      <template>
        <active-queue
          :size="size"
        />
      </template>
    </wt-expansion-panel>
  </article>
</template>

<script>
import { mapActions, mapState } from 'vuex';
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
      isNewMissed: (state) => state.isNewMissed,
    }),
    ...mapState('features/call/manual', {
      manualList: (state) => state.manualList,
    }),
    ...mapState('features/member', {
      membersList: (state) => state.memberList,
    }),

    expansions() {
      return [
        {
          value: 'active',
          counter: this.callList.length,
        },
        {
          value: 'missed',
          icon: 'call-missed',
          iconColor: 'error',
          attention: this.isNewMissed,
        },
        {
          value: 'offline',
          icon: 'call',
          attention: this.membersList.length,
        },
        {
          value: 'manual',
          icon: 'call-ringing',
          attention: this.manualList.length,
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
