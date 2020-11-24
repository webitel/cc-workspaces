<template>
  <section class="workspace-section queue-section">
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
            class="queue-tab__indicator"
            :class="[
              tab.value,
              { 'queue-tab__indicator--attention': tab.attention },
              ]"
          ></div>
          <span class="queue-tab__text">{{tab.text}}</span>
        </div>
      </template>
    </wt-tabs>

    <component :is="currentTabComponent"></component>

    <wt-rounded-action
      v-show="isNewCallButton"
      color="success"
      icon="call-ringing"
      size="lg"
      @click="openNewCall"
    ></wt-rounded-action>
  </section>
</template>

<script>
  import { mapGetters, mapActions, mapState } from 'vuex';
  import ActiveQueue from './active-queue/active-queue-container.vue';
  import OfflineQueue from './offline-queue/offline-queue-container.vue';
  import MissedQueue from './missed-queue/missed-queue-container.vue';
  import WorkspaceStates
    from '../../../store/modules/agent-workspace/workspaceUtils/WorkspaceStates';

  export default {
    name: 'the-agent-queue-section',
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
      ...mapState('call', {
        callList: (state) => state.callList,
      }),
      ...mapState('workspace', {
        workspaceState: (state) => state.workspaceState,
      }),
      ...mapState('call/missed', {
        isNewMissed: (state) => state.isNewMissed,
      }),
      ...mapGetters('call', {
        isNewCall: 'IS_NEW_CALL',
      }),
      ...mapGetters('member', {
        membersCount: 'MEMBERS_LENGTH',
      }),
      ...mapGetters('call/missed', {
        missedCount: 'MISSED_LENGTH',
      }),

      tabs() {
        return [
          {
            text: this.activeTabText,
            value: 'active',
          },
          {
            text: this.offlineTabText,
            value: 'offline',
          },
          {
            text: this.missedTabText,
            value: 'missed',
            attention: this.isNewMissed,
          },
        ];
      },

      activeTabText() {
        const t = this.$t('queueSec.active');
        return this.callList.length ? `${t}(${this.callList.length})` : t;
      },

      offlineTabText() {
        const t = this.$t('queueSec.offline');
        return this.membersCount ? `${t}(${this.membersCount})` : t;
      },

      missedTabText() {
        const t = this.$t('queueSec.missed');
        return this.missedCount ? `${t}(${this.missedCount})` : t;
      },

      currentTabComponent() {
        return `${this.currentTab.value}-queue`;
      },

      isNewCallButton() {
        return !this.isNewCall || !this.isCallWorkspace;
      },

      // used as isNewCallBtn check
      isCallWorkspace() {
        return this.workspaceState === WorkspaceStates.CALL;
      },
    },

    methods: {
      ...mapActions('call', {
        openNewCall: 'OPEN_NEW_CALL',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .queue-section {
    position: relative;
    display: flex;
    flex-direction: column;

    .wt-tabs {
      text-align: center;

      .queue-tab__wrap {
        display: flex;
        align-items: center;
      }

      .queue-tab__indicator {
        display: block;
        width: 24px;
        height: 24px;

        &.active {
          background: url("../../../assets/agent-workspace/queue-section/tab-indicators/indicator-active.svg");
          background-size: contain;
        }

        &.offline {
          background: url("../../../assets/agent-workspace/queue-section/tab-indicators/indicator-offline.svg");
          background-size: contain;
        }

        &.missed {
          background: url("../../../assets/agent-workspace/queue-section/tab-indicators/indicator-missed.svg");
          background-size: contain;

          &.queue-tab__indicator--attention {
            background: url("../../../assets/agent-workspace/queue-section/tab-indicators/indicator-missed--attention.svg");
            background-size: contain;
          }
        }
      }

      @media screen and (max-width: 1336px) {
        ::v-deep .wt-tab { // deeply styles tabs-component inner element, through scoped styles
          width: 24px;
          margin: 0 1px;
        }

        .queue-tab__text {
          display: none;
        }
      }
    }

    .wt-rounded-action {
      position: absolute;
      bottom: 10px;
      left: 10px;
    }
  }

  .call-preview-wrap {
    @extend %wt-scrollbar;
    min-height: 0;
    overflow: auto;
  }
</style>
