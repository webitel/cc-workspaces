<template>
  <section class="workspace-section">
    <tabs
      :current-tab="currentTab"
      :tabs="tabs"
    ></tabs>
    <call-preview
      v-for="(call, key) of callList"
      :item-instance="call"
      :index="key"
      :key="key"
      @click.native.prevent="openCall(key)"
    ></call-preview>

    <rounded-action
      v-show="callState !== 'NEW'"
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
  import CallPreview from './queue-call-preview.vue';
  import RoundedAction from '../../utils/rounded-action.vue';
  import Tabs from '../../utils/tabs.vue';

  export default {
    name: 'the-operator-queue-section',
    components: {
      CallPreview,
      RoundedAction,
      Tabs,
    },
    data: () => ({
      currentTab: { value: 'active' },
    }),

    computed: {
      ...mapState('operator', {
        callList: (state) => state.callList,
        callState: (state) => state.callState,
      }),

      tabs() {
        return [
          {
            text: `Active(${this.callList.length})`,
            value: 'active',
          },
          {
            text: 'Offline(0)',
            value: 'offline',
          },
        ];
      },
    },

    methods: {
      ...mapActions('operator', {
        answer: 'ANSWER',
        hangup: 'HANGUP',
        openCall: 'OPEN_CALL',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .workspace-section {
    position: relative;

    .tabs {
      text-align: center;
    }

    .rounded-action {
      position: absolute;
      bottom: calcRem(10px);
      left: calcRem(10px);
    }
  }
</style>
