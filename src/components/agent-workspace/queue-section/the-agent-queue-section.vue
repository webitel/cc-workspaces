<template>
  <section class="workspace-section">
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
          <div class="queue-tab__indicator" :class="tab.value"></div>
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
  .workspace-section {
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
        width: calcVH(4px);
        height: calcVH(4px);
        margin: calcVH(10px);
        border-radius: 50%;

        &.active {
          background: $call-color;
        }

        &.offline {
          background: $accent-color;
        }

        &.missed {
          background: $disconnect-color;
        }
      }
    }

    .call-preview-wrap {
      @extend .cc-scrollbar;
      min-height: 0;
      overflow: auto;
    }

    .rounded-action {
      position: absolute;
      bottom: calcVH(10px);
      left: calcVH(10px);
    }
  }
</style>
