<template>
  <section class="workspace-section queue-section">
    <tabs
      :current-tab="currentTab"
      :tabs="tabs"
      @change="currentTab = $event"
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
    </tabs>

    <component :is="computeCurrentTab"></component>

    <rounded-action
      v-show="isNewCallButton"
      class="call"
      @click.native="openNewCall"
    >
      <icon>
        <svg class="icon icon-call-ringing-md md">
          <use xlink:href="#icon-call-ringing-md"></use>
        </svg>
      </icon>
    </rounded-action>
  </section>
</template>

<script>
  import { mapGetters, mapActions, mapState } from 'vuex';
  import ActiveQueue from './active-queue/active-queue-container.vue';
  import OfflineQueue from './offline-queue/offline-queue-container.vue';
  import MissedQueue from './missed-queue/missed-queue-container.vue';
  import RoundedAction from '../../utils/rounded-action.vue';
  import Tabs from '../../utils/tabs.vue';

  export default {
    name: 'the-agent-queue-section',
    components: {
      ActiveQueue,
      OfflineQueue,
      MissedQueue,
      RoundedAction,
      Tabs,
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
        if (this.callList.length) {
          return `${this.$t('queueSec.active')}(${this.callList.length})`;
        }
        return this.$t('queueSec.active');
      },

      offlineTabText() {
        if (this.membersCount) {
          return `${this.$t('queueSec.offline')}(${this.membersCount})`;
        }
        return this.$t('queueSec.offline');
      },

      missedTabText() {
        if (this.missedCount) {
          return `${this.$t('queueSec.missed')}(${this.missedCount})`;
        }
        return this.$t('queueSec.missed');
      },

      computeCurrentTab() {
        return `${this.currentTab.value}-queue`;
      },

      isNewCallButton() {
        return !this.isNewCall;
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

    .tabs {
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
        ::v-deep .tab { // deeply styles tabs-component inner element, through scoped styles
          width: 24px;
          margin: 0 1px;
        }

        .queue-tab__text {
          display: none;
        }
      }
    }

    .rounded-action {
      position: absolute;
      bottom: (10px);
      left: (10px);
    }
  }

  .call-preview-wrap {
    @extend .cc-scrollbar;
    min-height: 0;
    overflow: auto;
  }
</style>
