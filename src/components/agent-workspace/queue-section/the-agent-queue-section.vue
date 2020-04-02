<template>
  <section class="workspace-section">
    <tabs
      :current-tab="currentTab"
      :tabs="tabs"
      @change="currentTab = $event"
    ></tabs>

    <component :is="computeCurrentTab"></component>

    <rounded-action
      v-show="isNewCallButton"
      class="call"
      @click.native="openCall()"
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
  import { mapActions, mapState } from 'vuex';
  import ActiveQueue from './active-queue/active-queue-container.vue';
  import OfflineQueue from './offline-queue/offline-queue-container.vue';
  import RoundedAction from '../../utils/rounded-action.vue';
  import Tabs from '../../utils/tabs.vue';

  export default {
    name: 'the-agent-queue-section',
    components: {
      ActiveQueue,
      OfflineQueue,
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
        callState: (state) => state.callState,
      }),
      ...mapState('member', {
        membersList: (state) => state.membersList,
      }),

      tabs() {
        return [
          {
            text: `Active(${this.callList.length})`,
            value: 'active',
          },
          {
            text: `Offline(${this.membersList.length})`,
            value: 'offline',
          },
        ];
      },

      computeCurrentTab() {
        return `${this.currentTab.value}-queue`;
      },

      isNewCallButton() {
        return this.callState !== 'NEW';
      },
    },

    methods: {
      ...mapActions('call', {
        openCall: 'OPEN_CALL_ON_WORKSPACE',
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
