<template>
  <the-agent-task-queue
    class="task-queue call-queue"
    :size="size"
    :class="[
      `call-queue--${size}`
    ]"
  >
    <template v-slot:title>
      <div class="call-queue__title-wrapper">
        <span class="call-queue__title">{{ $t('queueSec.call.calls') }}</span>
        <wt-tabs
          v-model="currentTab"
          :tabs="tabs"
        >
          <template
            v-for="(tab, key) of tabs"
            v-slot:[tab.value]
          >
            <div class="queue-tab__wrap" :key="key">
              <div
                v-show="tab.attention"
                class="queue-tab__indicator"
                :class="tab.value"
              ></div>
              <wt-icon
                :icon="tab.icon"
                :color="tab.iconColor"
                :size="size"
              ></wt-icon>
            </div>
          </template>
        </wt-tabs>
      </div>
    </template>
    <component
      :is="currentTabComponent"
      :size="size"
    ></component>
  </the-agent-task-queue>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import TheAgentTaskQueue from '../../_shared/components/the-agent-task-queue.vue';
import ActiveQueue from './active-queue/active-queue-container.vue';
import OfflineQueue from './offline-queue/offline-queue-container.vue';
import MissedQueue from './missed-queue/missed-queue-container.vue';
import ManualQueue from './manual-queue/manual-queue-container.vue';
import sizeMixin from '../../../../../../app/mixins/sizeMixin';

export default {
  name: 'the-agent-call-queue',
  mixins: [sizeMixin],
  components: {
    TheAgentTaskQueue,
    ActiveQueue,
    OfflineQueue,
    MissedQueue,
    ManualQueue,
  },
  data: () => ({
    currentTab: { value: 'active' },
  }),

  watch: {
    // watch for callList length instead of actual call list because it throws a Vue internals error
    callListLength() {
      this.currentTab = { value: 'active' };
    },
  },

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

    tabs() {
      return [
        {
          value: 'active',
          icon: 'call',
          iconColor: 'success',
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

    currentTabComponent() {
      return `${this.currentTab.value}-queue`;
    },
    callListLength() {
      return this.callList.length;
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
