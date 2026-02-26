<template>
  <wt-app-header>
    <a :href="startPageHref">
      <wt-logo :dark-mode="darkMode" />
    </a>
    <wt-dark-mode-switcher namespace="ui/appearance" />

    <wt-chip :color="isPhoneReg ? 'success' : 'primary'">SIP
    </wt-chip>
    <break-timer-popup v-if="isAgent"></break-timer-popup>
    <user-dnd-switcher></user-dnd-switcher>
    <!--    <wt-switcher-->
    <!--      :model-value="isVideo"-->
    <!--      :label="$t('header.enableVideo')"-->
    <!--      @update:model-value="toggleVideo"-->
    <!--    ></wt-switcher>-->
    <wt-switcher
      v-if="isAgent"
      :model-value="isCcenterOn"
      :label="$t('agentStatus.callCenter')"
      @update:model-value="toggleCCenterMode"
    ></wt-switcher>

    <agent-status-select v-if="isAgent"></agent-status-select>

    <wt-app-navigator
      :current-app="currentApp"
      :apps="apps"
      :dark-mode="darkMode"
    ></wt-app-navigator>
    <wt-header-actions
      :user="userInfo"
      :build-info="buildInfo"
      @settings="settings"
      @logout="logoutUser"
    />
  </wt-app-header>
</template>

<script setup>
import { WtApplication } from '@webitel/ui-sdk/enums';
import WtDarkModeSwitcher from '@webitel/ui-sdk/src/modules/Appearance/components/wt-dark-mode-switcher.vue';
import { storeToRefs } from 'pinia';
import { computed, inject, onMounted } from 'vue';
import { useStore } from 'vuex';

import packageJson from '../../../../../package.json' with { type: 'json' };
import UserStatus from '../../../../features/modules/agent-status/statusUtils/UserStatus';
import BreakTimerPopup from '../../popups/break-popup/break-timer-popup.vue';
import { useUserinfoStore } from '../../userinfo/userinfoStore';
import AgentStatusSelect from './agent-status-select.vue';
import UserDndSwitcher from './user-dnd-switcher.vue';

const store = useStore();
const config = inject('$config');

const userinfoStore = useUserinfoStore();
const { hasApplicationVisibility, logoutUser } = userinfoStore;
const { userInfo } = storeToRefs(userinfoStore);
const currentApp = computed(() => WtApplication.Agent);

const isVideo = computed(() => store.state.features?.call?.isVideo);
const isPhoneReg = computed(() => store.state.features?.globals?.isPhoneReg);
const isAgent = computed(() => store.getters['features/status/IS_AGENT']);
const isCcenterOn = computed(
	() => store.getters['features/status/IS_CCENTER_ON'],
);
const darkMode = computed(() => store.getters['ui/appearance/DARK_MODE']);

const startPageHref = computed(() => import.meta.env.VITE_START_PAGE_URL);

const buildInfo = {
	release: packageJson.version,
	build: import.meta.env.VITE_BUILD_NUMBER,
};

const apps = computed(() => {
	const agent = {
		name: WtApplication.Agent,
		href: import.meta.env.VITE_AGENT_URL,
	};
	const supervisor = {
		name: WtApplication.Supervisor,
		href: import.meta.env.VITE_SUPERVISOR_URL,
	};
	const history = {
		name: WtApplication.History,
		href: import.meta.env.VITE_HISTORY_URL,
	};
	const audit = {
		name: WtApplication.Audit,
		href: import.meta.env.VITE_AUDIT_URL,
	};
	const admin = {
		name: WtApplication.Admin,
		href: import.meta.env.VITE_ADMIN_URL,
	};
	const grafana = {
		name: WtApplication.Analytics,
		href: import.meta.env.VITE_GRAFANA_URL,
	};
	const crm = {
		name: WtApplication.Crm,
		href: import.meta.env.VITE_CRM_URL,
	};
	const allApps = [
		admin,
		supervisor,
		agent,
		history,
		audit,
		crm,
	];
	if (config?.ON_SITE) allApps.push(grafana);
	return allApps.filter(({ name }) => hasApplicationVisibility(name));
});

function toggleCCenterMode() {
	store.dispatch('features/status/TOGGLE_CONTACT_CENTER_MODE');
}

function restoreVideoParam() {
	store.dispatch('features/call/RESTORE_VIDEO_PARAM');
}

function settings() {
	const settingsUrl = import.meta.env.VITE_SETTINGS_URL;
	window.open(settingsUrl);
}

onMounted(() => {
	restoreVideoParam();
});
</script>

<style
  lang="scss"
  scoped
>
.wt-app-header {
  max-height: fit-content;

  .wt-dark-mode-switcher {
    margin-right: auto;
  }

  .wt-switcher,
  .user-dnd-switcher {
    margin-left: var(--spacing-sm);
  }

  .agent-status-select {
    max-width: 200px;
    width: 150px;
    margin-left: var(--spacing-sm);
  }
}
</style>
