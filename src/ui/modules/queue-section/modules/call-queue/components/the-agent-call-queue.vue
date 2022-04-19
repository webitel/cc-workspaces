<template>
  <section class="task-queue call-queue">
    <header class="task-queue__header">
      <h2 class="task-queue__header__title">{{ $t('queueSec.call.calls') }}</h2>
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
            <wt-icon :icon="tab.icon" :color="tab.iconColor"></wt-icon>
          </div>
        </template>
      </wt-tabs>
    </header>
    <component :is="currentTabComponent"></component>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ActiveQueue from './active-queue/active-queue-container.vue';
import OfflineQueue from './offline-queue/offline-queue-container.vue';
import MissedQueue from './missed-queue/missed-queue-container.vue';

export default {
  name: 'the-agent-call-queue',
  components: {
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
      membersList: (state) => state.membersList,
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
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

@import '../../../css/task-queue';

.task-queue__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  //padding: var;

  @media screen and (max-width: 1336px) {
    //padding: 0;
  }
}

.task-queue__header__title {
  @media screen and (max-width: 1336px) {
    display: none;
  }
}

.task-queue__header .wt-tabs {
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
