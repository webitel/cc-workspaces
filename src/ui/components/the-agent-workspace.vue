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

<script>
import WebitelApplications from '@webitel/ui-sdk/src/enums/WebitelApplications/WebitelApplications.enum';
import { mapActions, mapGetters } from 'vuex';

import appNotificationMixin from '../../features/modules/notifications/mixins/appNotificationMixin';
import panelSizeControllerMixin from '../mixins/panelSizeControllerMixin';
import CcHeader from '../modules/app-header/components/app-header.vue';
import InfoSection from '../modules/info-section/components/the-agent-info-section.vue';
import DisconnectPopup from '../modules/popups/disconnect-popup/components/disconnect-popup.vue';
import WelcomePopup from '../modules/popups/welcome-popup/welcome-popup.vue';
import QueueSection from '../modules/queue-section/components/the-agent-queue-section.vue';
import VideoContainer from '../modules/video-container/components/video-container.vue';
import WidgetBar from '../modules/widget-bar/components/widget-bar.vue';
import WorkspaceSection from '../modules/work-section/components/the-agent-workspace-section.vue';

export default {
  name: 'TheAgentWorkspace',
  components: {
    CcHeader,
    WidgetBar,
    QueueSection,
    WorkspaceSection,
    InfoSection,
    VideoContainer,
    DisconnectPopup,
    WelcomePopup,
  },
  mixins: [
    appNotificationMixin,
    panelSizeControllerMixin,
  ],
  data: () => ({
    isInitLoading: false,
    isWelcomePopup: true,
  }),

  computed: {
    ...mapGetters('ui/userinfo', {
      checkAppAccess: 'CHECK_APP_ACCESS',
    }),
    hasAccess() {
      return this.checkAppAccess(WebitelApplications.AGENT);
    },
  },

  methods: {
    ...mapActions('workspace', {
      openSession: 'OPEN_SESSION',
      closeSession: 'CLOSE_SESSION',
    }),

    async initSession() {
      try {
        this.isInitLoading = true;
        await this.openSession();
        if (this.$route.query.failureRefresh) {
          this.$router.push({ ...this.$router.currentRoute, query: { failureRefresh: undefined } });
        }
      } catch (err) {
        if (!this.$route.query.failureRefresh) {
          await this.$router.push({ ...this.$router.currentRoute, query: { failureRefresh: 'true' } });
          document.location.reload();
        }
      } finally {
        this.isInitLoading = false;
        this.isWelcomePopup = false;
      }
    },

    preventDrop(event) {
      event.preventDefault();
      event.stopPropagation();
    },

    goToApplicationHub() {
      const adminUrl = import.meta.env.VITE_APPLICATION_HUB_URL;
      window.location.href = adminUrl;
    },
  },

  unmounted() {
    this.closeSession();
  },
};
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
