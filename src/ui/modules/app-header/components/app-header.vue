<template>
  <wt-app-header>
    <a :href="startPageHref">
      <wt-logo
        :dark-mode="darkMode"
      />
    </a>
    <wt-dark-mode-switcher
      namespace="ui/appearance"
    />

    <wt-chip
      :color="isPhoneReg ? 'success' : 'primary'"
    >SIP
    </wt-chip>
    <break-timer-popup
      v-if="isAgent"
    ></break-timer-popup>
    <user-dnd-switcher></user-dnd-switcher>
<!--    <wt-switcher-->
<!--      :value="isVideo"-->
<!--      :label="$t('header.enableVideo')"-->
<!--      @change="toggleVideo"-->
<!--    ></wt-switcher>-->
    <wt-switcher
      v-if="isAgent"
      :value="isCcenterOn"
      :label="$t('agentStatus.callCenter')"
      @change="toggleCCenterMode"
    ></wt-switcher>

    <agent-status-select
      v-if="isAgent"
    ></agent-status-select>

    <wt-app-navigator
      :current-app="currentApp"
      :apps="apps"
      :dark-mode="darkMode"
    ></wt-app-navigator>
    <wt-header-actions
      :user="userinfo"
      :build-info="buildInfo"
      @settings="settings"
      @logout="logoutUser"
    />
  </wt-app-header>
</template>

<script>
import WebitelApplications from '@webitel/ui-sdk/src/enums/WebitelApplications/WebitelApplications.enum';
import WtDarkModeSwitcher from '@webitel/ui-sdk/src/modules/Appearance/components/wt-dark-mode-switcher.vue';
import { mapActions,mapGetters, mapState } from 'vuex';

import UserStatus from '../../../../features/modules/agent-status/statusUtils/UserStatus';
import BreakTimerPopup from '../../popups/break-popup/break-timer-popup.vue';
import AgentStatusSelect from './agent-status-select.vue';
import UserDndSwitcher from './user-dnd-switcher.vue';

export default {
  name: 'AppHeader',
  components: {
    WtDarkModeSwitcher,
    AgentStatusSelect,
    UserDndSwitcher,
    BreakTimerPopup,
  },
  inject: ['$config'],
  data: () => ({
    buildInfo: {
      release: process.env.npm_package_version,
      build: import.meta.env.VITE_BUILD_NUMBER,
    },
    UserStatus,
  }),
  created() {
    this.restoreVideoParam();
  },

  computed: {
    ...mapState('features/call', {
      isVideo: (state) => state.isVideo,
    }),
    ...mapState('features/globals', {
      isPhoneReg: (state) => state.isPhoneReg,
    }),
    ...mapState('ui/userinfo', {
      userinfo: (state) => state,
      currentApp: (state) => state.thisApp,
    }),
    ...mapGetters('features/status', {
      isAgent: 'IS_AGENT',
      isCcenterOn: 'IS_CCENTER_ON',
    }),
    ...mapGetters('ui/userinfo', {
      checkAccess: 'CHECK_APP_ACCESS',
    }),
    ...mapGetters('ui/appearance', {
      darkMode: 'DARK_MODE',
    }),
    startPageHref() {
      return import.meta.env.VITE_START_PAGE_URL;
    },
    apps() {
      const agent = {
        name: WebitelApplications.AGENT,
        href: import.meta.env.VITE_AGENT_URL,
      };
      const supervisor = {
        name: WebitelApplications.SUPERVISOR,
        href: import.meta.env.VITE_SUPERVISOR_URL,
      };
      const history = {
        name: WebitelApplications.HISTORY,
        href: import.meta.env.VITE_HISTORY_URL,
      };
      const audit = {
        name: WebitelApplications.AUDIT,
        href: import.meta.env.VITE_AUDIT_URL,
      };
      const admin = {
        name: WebitelApplications.ADMIN,
        href: import.meta.env.VITE_ADMIN_URL,
      };
      const grafana = {
        name: WebitelApplications.ANALYTICS,
        href: import.meta.env.VITE_GRAFANA_URL,
      };
      const crm = {
        name: WebitelApplications.CRM,
        href: import.meta.env.VITE_CRM_URL,
      };
      const apps = [admin, supervisor, agent, history, audit, crm];
      if (this.$config?.ON_SITE) apps.push(grafana);
      return apps.filter(({ name }) => this.checkAccess(name));
    },
  },

  methods: {
    ...mapActions('ui/userinfo', {
      logout: 'LOGOUT',
    }),
    ...mapActions('features/status', {
      toggleCCenterMode: 'TOGGLE_CONTACT_CENTER_MODE',
    }),
    ...mapActions('features/call', {
      toggleVideo: 'TOGGLE_VIDEO',
      restoreVideoParam: 'RESTORE_VIDEO_PARAM',
    }),
    settings() {
      const settingsUrl = import.meta.env.VITE_SETTINGS_URL;
      window.open(settingsUrl);
    },
    async logoutUser() {
      return this.logout();
    },
  },
};
</script>

<style lang="scss" scoped>
.wt-app-header {
  .wt-dark-mode-switcher {
    margin-right: auto;
  }

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
