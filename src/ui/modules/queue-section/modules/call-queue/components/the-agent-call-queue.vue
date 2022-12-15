<template>
  <the-agent-task-queue
    class="task-queue call-queue"
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
            :slot="tab.value"
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
import sizeMixin from '../../../../../../app/mixins/sizeMixin';

export default {
  name: 'the-agent-call-queue',
  mixins: [sizeMixin],
  components: {
    TheAgentTaskQueue,
    ActiveQueue,
    OfflineQueue,
    MissedQueue,
  },
  data: () => ({
    currentTab: { value: 'active' },
  }),

  watch: {
    callList() {
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
          icon: 'call-disconnect',
          iconColor: 'danger',
          attention: this.isNewMissed,
        },
        {
          value: 'offline',
          icon: 'call',
          iconColor: 'accent',
          attention: this.membersList.length,
        },
      ];
    },

    currentTabComponent() {
      return `${this.currentTab.value}-queue`;
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
      background: var(--icon-true-color);
    }

    &.offline {
      background: var(--icon-accent-color);
    }

    &.missed {
      background: var(--icon-false-color);
    }
  }
}
</style>
