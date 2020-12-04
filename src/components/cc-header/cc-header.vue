<template>
  <header class="cc-header">
    <break-popup
      v-if="isBreakPopup && !isBreak"
      @close="isBreakPopup = false"
    />
    <timer-popup
      v-if="isBreak"
    />

    <div class="cc-header__container">
      <switcher
        :value="isVideo"
        :label="$t('header.enableVideo')"
        @input="toggleVideo"
      ></switcher>
      <switcher
        :value="isAgent"
        :label="$t('agentStatus.callCenter')"
        @input="toggleCCenterMode"
      ></switcher>
      <status-select
        @setBreak="isBreakPopup = true"
      />
      <app-navigator/>
      <user-preferences/>
    </div>
  </header>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex';
  import { AgentStatus } from 'webitel-sdk';
  import Switcher from './cc-header-switcher.vue';
  import AppNavigator from './the-app-navigator.vue';
  import StatusSelect from './status-select.vue';
  import UserPreferences from './user-preferences.vue';
  import BreakPopup from '../break-popup/break-popup.vue';
  import TimerPopup from '../break-popup/break-timer-popup.vue';

  export default {
    name: 'cc-header',
    components: {
      Switcher,
      AppNavigator,
      StatusSelect,
      UserPreferences,
      BreakPopup,
      TimerPopup,
    },

    data: () => ({
      AgentStatus,
      isBreakPopup: false,
    }),

    created() {
      this.restoreVideoParam();
    },

    computed: {
      ...mapState('status', {
        agent: (state) => state.agent,
      }),
      ...mapState('call', {
        isVideo: (state) => state.isVideo,
      }),
      ...mapGetters('status', {
        isAgent: 'IS_AGENT',
      }),

      isBreak() {
        return this.agent.status === AgentStatus.Pause;
      },
    },

    methods: {
      ...mapActions('status', {
        toggleCCenterMode: 'TOGGLE_CONTACT_CENTER_MODE',
      }),
      ...mapActions('call', {
        toggleVideo: 'TOGGLE_VIDEO',
        restoreVideoParam: 'RESTORE_VIDEO_PARAM',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .cc-header {
    padding: (10px) (77px);
    background: $header-bg-color;
  }

  .cc-header__container {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .status-select, .switcher {
      margin-left: (30px);
    }
  }
</style>
