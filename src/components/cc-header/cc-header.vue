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
      <switcher v-model="isAgent"></switcher>
      <status-select
        @setBreak="isBreakPopup = true"
      />
      <user-preferences/>
    </div>
  </header>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import { AgentStatus } from 'webitel-sdk';
  import Switcher from './cc-header-switcher.vue';
  import StatusSelect from './status-select.vue';
  import UserPreferences from './user-preferences.vue';
  import BreakPopup from '../break-popup/break-popup.vue';
  import TimerPopup from '../break-popup/break-timer-popup.vue';

  export default {
    name: 'cc-header',
    components: {
      Switcher,
      StatusSelect,
      UserPreferences,
      BreakPopup,
      TimerPopup,
    },

    data: () => ({
      AgentStatus,
      isBreakPopup: false,
    }),


    computed: {
      ...mapState('status', {
        agent: (state) => state.agent,
      }),

      isAgent: {
        get() {
          return this.$store.getters['status/IS_AGENT'];
        },
        set() {
          this.toggleCCenterMode();
        },
      },

      isBreak() {
        return this.agent.status === AgentStatus.Pause;
      },
    },

    methods: {
      ...mapActions('status', {
        toggleCCenterMode: 'TOGGLE_CCENTER_MODE',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .cc-header {
    padding: calcVH(10px) calcVH(77px);
    background: $header-bg-color;
  }

  .cc-header__container {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .status-select {
      margin-left: calcVH(30px);
    }
  }
</style>
