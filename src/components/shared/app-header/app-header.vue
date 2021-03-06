<template>
  <wt-app-header>
    <break-popup
      v-show="isBreakPopup && !isBreak"
      @close="isBreakPopup = false"
    />
    <timer-popup
      v-show="isBreak"
    />

    <wt-switcher
      :value="isVideo"
      :label="$t('header.enableVideo')"
      @change="toggleVideo"
    ></wt-switcher>
    <wt-switcher
      :value="isAgent"
      :label="$t('agentStatus.callCenter')"
      @change="toggleCCenterMode"
    ></wt-switcher>
    <status-select
      @setBreak="isBreakPopup = true"
    />
    <wt-app-navigator :current-app="currentApp" :apps="apps"></wt-app-navigator>
    <wt-header-actions :user="user" @settings="settings" @logout="logoutUser"/>
  </wt-app-header>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { AgentStatus } from 'webitel-sdk';
import StatusSelect from './status-select.vue';
import BreakPopup from '../../break-popup/break-popup.vue';
import TimerPopup from '../../break-popup/break-timer-popup.vue';
import APIRepository from '../../../api/APIRepository';

const authAPI = APIRepository.auth;

export default {
  name: 'app-header',
  components: {
    StatusSelect,
    BreakPopup,
    TimerPopup,
  },

  data: () => ({
    AgentStatus,
    isBreakPopup: false,
    currentApp: 'agent',
    apps: {
      agent: { href: process.env.VUE_APP_AGENT_URL },
      supervisor: { href: process.env.VUE_APP_SUPERVISOR_URL },
      history: { href: process.env.VUE_APP_HISTORY_URL },
      audit: { href: process.env.VUE_APP_AUDIT_URL },
      admin: { href: process.env.VUE_APP_ADMIN_URL },
      grafana: { href: process.env.VUE_APP_GRAFANA_URL },
    },
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
    ...mapState('userinfo', {
      user: (state) => state,
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
    settings() {
      const settingsUrl = process.env.VUE_APP_SETTINGS_URL;
      window.open(settingsUrl);
    },

    async logoutUser() {
      try {
        await authAPI.logout();
        await this.$router.replace('/auth');
      } catch {
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wt-app-header {
  .wt-status-select {
    width: 150px;
    margin-left: 30px;
  }

  .wt-switcher {
    margin-left: 30px;
  }
}
</style>
