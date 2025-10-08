<template>
  <main
    v-if="hasAccess"
    class="main-agent-workspace"
    @drop="preventDrop"
    @dragenter.prevent
    @dragover.prevent
  >
    <disconnect-popup />

    <welcome-popup
      v-if="isWelcomePopup"
      :loading="isInitLoading"
      @input="initSession"
    ></welcome-popup>

    <desc-track-auth-error-popup 
      v-if="isDescTrackAuthErrorPopup"
    />
    <desc-track-auth-success-popup 
      v-model:shown="isDescTrackAuthSuccessPopup"
    />

    <wt-notifications-bar />
    <cc-header />
    <div class="workspace-wrap">
      <widget-bar />
      <section class="workspace">
        <queue-section
          :size="queueSecSize"
          :collapsed="queueSecCollapsed"
          :collapsible="collapsible"
          @resize="resizeQueuePanel"
        ></queue-section>
        <workspace-section
          :size="workspaceSecSize"
          :collapsed="workspaceSecCollapsed"
          :collapsible="collapsible"
          @resize="resizeWorkspacePanel"
        ></workspace-section>
        <info-section
          :size="infoSecSize"
          :collapsed="infoSecCollapsed"
          :collapsible="collapsible"
          @resize="resizeInfoPanel"
        ></info-section>
      </section>
    </div>

    <video-container />
  </main>
  <wt-error-page v-else type="403" @back="goToApplicationHub"></wt-error-page>
</template>

<script setup lang="ts">
import WebitelApplications
  from '@webitel/ui-sdk/src/enums/WebitelApplications/WebitelApplications.enum';
import { computed, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { useAppNotification } from '../../features/modules/notifications/composables/useAppNotification';
import { usePanelSizeController } from '../composables/usePanelSizeController';
import CcHeader from '../modules/app-header/components/app-header.vue';
import InfoSection from '../modules/info-section/components/the-agent-info-section.vue';
import DisconnectPopup from '../modules/popups/disconnect-popup/components/disconnect-popup.vue';
import WelcomePopup from '../modules/popups/welcome-popup/welcome-popup.vue';
import QueueSection from '../modules/queue-section/components/the-agent-queue-section.vue';
import VideoContainer from '../modules/video-container/components/video-container.vue';
import WidgetBar from '../modules/widget-bar/components/widget-bar.vue';
import WorkspaceSection from '../modules/work-section/components/the-agent-workspace-section.vue';
import DescTrackAuthErrorPopup from '../modules/popups/desc-track-auth-popup/components/desc-track-auth-error-popup.vue';
import DescTrackAuthSuccessPopup from '../modules/popups/desc-track-auth-popup/components/desc-track-auth-success-popup.vue';

const store = useStore();
const route = useRoute();
const router = useRouter();

useAppNotification();
const {
  queueSecCollapsed,
  workspaceSecCollapsed,
  infoSecCollapsed,
  queueSecSize,
  workspaceSecSize,
  infoSecSize,
  collapsible,
  resizeQueuePanel,
  resizeWorkspacePanel,
  resizeInfoPanel,
} = usePanelSizeController();

const isInitLoading = ref(false);
const isWelcomePopup = ref(true);
const isDescTrackAuthSuccessPopup = ref(false);

const checkAppAccess = computed(() => store.getters['ui/userinfo/CHECK_APP_ACCESS']);
const isDescTrackAuthErrorPopup = computed(() => store.getters['ui/infoSec/agentInfo/IS_DESC_TRACK_AUTH_NEEDED']);

const hasAccess = computed(() => checkAppAccess.value(WebitelApplications.AGENT));

const openSession = () => store.dispatch('workspace/OPEN_SESSION');
const closeSession = () => store.dispatch('workspace/CLOSE_SESSION');
const agentLogout = () => store.dispatch('features/status/AGENT_LOGOUT');

const initSession = async () => {
  try {
    isInitLoading.value = true;
    await openSession();
    if (route.query.failureRefresh) {
      router.push({ ...router.currentRoute, query: { failureRefresh: undefined } });
    }
  } catch (err) {
    if (!route.query.failureRefresh) {
      await router.push({
        ...router.currentRoute,
        query: { failureRefresh: 'true' },
      });
      document.location.reload();
    }
  } finally {
    isInitLoading.value = false;
    isWelcomePopup.value = false;
  }
};

const preventDrop = (event: DragEvent) => {
  event.preventDefault();
  event.stopPropagation();
};

const goToApplicationHub = () => {
  const adminUrl = import.meta.env.VITE_APPLICATION_HUB_URL;
  window.location.href = adminUrl;
};

watch(isDescTrackAuthErrorPopup, () => {
  if (isDescTrackAuthErrorPopup.value) {
    agentLogout();
  } else {
    isDescTrackAuthSuccessPopup.value = true;
  }
});

onUnmounted(() => {
  closeSession();
});
</script>

<style lang="scss" scoped>
.main-agent-workspace {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.workspace-wrap {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  box-sizing: border-box;
  min-height: 0;
  padding: var(--spacing-sm);
  background: var(--wt-page-wrapper-background-color);
}

.workspace {
  flex-grow: 1;
  min-height: 0;
  margin-top: var(--spacing-sm);
  display: flex;
  gap: var(--spacing-sm);
  background: var(--wt-page-wrapper-background-color);
  //display: grid;
  //grid-template-columns: 320px 550px 1fr;
  //grid-gap: var(--spacing-sm);

  //@media screen and (max-width: 1336px) {
  //  grid-template-columns: 120px 550px 1fr; // changed 1st col width
  //}
  //
  //@media screen and (max-width: 1336px) {
  //  grid-template-columns: 120px 550px 1fr; // changed 1st col width
  //}
  //
  //@media screen and (max-height: 768px) {
  //  //grid-gap: 15px;
  //  //margin-top: 15px;
  //}
}

.workspace-section {
  position: relative;
  padding: var(--spacing-sm);
}

</style>
