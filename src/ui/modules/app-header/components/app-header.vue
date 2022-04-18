<template>
  <wt-app-header>
    <break-timer-popup/>
    <user-dnd-switcher></user-dnd-switcher>
<!--    <wt-switcher-->
<!--      :value="isVideo"-->
<!--      :label="$t('header.enableVideo')"-->
<!--      @change="toggleVideo"-->
<!--    ></wt-switcher>-->
    <wt-switcher
      :value="isAgent"
      :label="$t('agentStatus.callCenter')"
      @change="toggleCCenterMode"
    ></wt-switcher>

    <agent-status-select/>

    <wt-app-navigator :current-app="currentApp" :apps="apps"></wt-app-navigator>
    <wt-header-actions
      :user="user"
      :build-info="buildInfo"
      @settings="settings"
      @logout="logoutUser"
    />
  </wt-app-header>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import WebitelApplications from '@webitel/ui-sdk/src/enums/WebitelApplications/WebitelApplications.enum';
import authAPI from '@webitel/ui-sdk/src/modules/Userinfo/api/auth';
import AgentStatusSelect from './agent-status-select.vue';
import UserDndSwitcher from './user-dnd-switcher.vue';
import BreakTimerPopup from '../../popups/break-popup/break-timer-popup.vue';

export default {
  name: 'app-header',
  components: {
    AgentStatusSelect,
    UserDndSwitcher,
    BreakTimerPopup,
  },

  data: () => ({
    buildInfo: {
      release: process.env.VUE_APP_PACKAGE_VERSION,
      build: process.env.VUE_APP_BUILD_NUMBER,
    },
  }),
  created() {
    this.restoreVideoParam();
  },

  computed: {
    ...mapState('features/call', {
      isVideo: (state) => state.isVideo,
    }),
    ...mapState('ui/userinfo', {
      user: (state) => state,
      currentApp: (state) => state.thisApp,
    }),
    ...mapGetters('features/status', {
      isAgent: 'IS_AGENT',
    }),
    ...mapGetters('ui/userinfo', {
      checkAccess: 'CHECK_APP_ACCESS',
    }),
    apps() {
      const agent = {
        name: WebitelApplications.AGENT,
        href: process.env.VUE_APP_AGENT_URL,
      };
      const supervisor = {
        name: WebitelApplications.SUPERVISOR,
        href: process.env.VUE_APP_SUPERVISOR_URL,
      };
      const history = {
        name: WebitelApplications.HISTORY,
        href: process.env.VUE_APP_HISTORY_URL,
      };
      const audit = {
        name: WebitelApplications.AUDIT,
        href: process.env.VUE_APP_AUDIT_URL,
      };
      const admin = {
        name: WebitelApplications.ADMIN,
        href: process.env.VUE_APP_ADMIN_URL,
      };
      const grafana = {
        name: WebitelApplications.ANALYTICS,
        href: process.env.VUE_APP_GRAFANA_URL,
      };
      const apps = [admin, supervisor, agent, history, audit];
      if (this.$config?.ON_SITE) apps.push(grafana);
      return apps.filter(({ name }) => this.checkAccess(name));
    },
  },

  methods: {
    ...mapActions('features/status', {
      toggleCCenterMode: 'TOGGLE_CONTACT_CENTER_MODE',
    }),
    ...mapActions('features/call', {
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
  .wt-switcher, .user-dnd-switcher{
    margin-left: var(--spacing-sm);
  }

  .agent-status-select {
    max-width: 200px;
    width: 150px;
    margin-left: var(--spacing-sm);
  }
}
</style>
