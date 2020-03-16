<template>
  <section class="workspace-section">
    <tabs
      :current-tab="currentTab"
      :tabs="tabs"
    ></tabs>
    <section class="call-preview-wrap">
      <call-preview
        v-for="(call, key) of callList"
        :item-instance="call"
        :index="key"
        :key="key"
        @click.native.prevent="openCall(key)"
      ></call-preview>
    </section>
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
  import CallStates from '../../../store/callUtils/CallStates';
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

      CallStates: () => CallStates,

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
