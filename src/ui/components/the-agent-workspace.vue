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
        <queue-section />
        <workspace-section />
        <info-section />
      </section>
    </div>

    <video-container />
  </main>
  <wt-error-page v-else type="403" @back="goToApplicationHub"></wt-error-page>
</template>

<script>
import WebitelApplications from '@webitel/ui-sdk/src/enums/WebitelApplications/WebitelApplications.enum';
import { mapActions, mapGetters } from 'vuex';
import CcHeader from '../modules/app-header/components/app-header.vue';
import WidgetBar from '../modules/widget-bar/components/widget-bar.vue';
import QueueSection from '../modules/queue-section/components/the-agent-queue-section.vue';
import InfoSection from '../modules/info-section/components/the-agent-info-section.vue';
import WorkspaceSection from '../modules/work-section/components/the-agent-workspace-section.vue';
import VideoContainer from '../modules/video-container/components/video-container.vue';
import DisconnectPopup from '../modules/popups/disconnect-popup/components/disconnect-popup.vue';
import WelcomePopup from '../modules/popups/welcome-popup/welcome-popup.vue';
import appNotificationMixin from '../../features/modules/notifications/mixins/appNotificationMixin';

export default {
  name: 'the-agent-workspace',
  mixins: [appNotificationMixin],
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
  data: () => ({
    isInitLoading: false,
    isWelcomePopup: true,
  }),

  destroyed() {
    this.closeSession();
  },

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
      const adminUrl = process.env.VUE_APP_APPLICATION_HUB_URL;
      window.location.href = adminUrl;
    },
  },
};
</script>

<style lang="scss" scoped>
.main-agent-workspace {
  display: flex;
  flex-direction: column;
  min-width: 1280px;
  max-height: 100%;
}

.workspace-wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  box-sizing: border-box;
  min-height: 0;
  padding: var(--spacing-sm);
  background: var(--page-bg-color);

  @media screen and (max-height: 768px) {
    //padding: 15px;
  }
}

.workspace {
  display: grid;
  flex-grow: 1;
  min-height: 0;
  margin-top: var(--spacing-sm);
  grid-template-columns: 340px 550px 1fr;
  grid-gap: var(--spacing-sm);

  @media screen and (max-width: 1336px) {
    grid-template-columns: 120px 550px 1fr; // changed 1st col width
  }

  @media screen and (max-width: 1336px) {
    grid-template-columns: 120px 550px 1fr; // changed 1st col width
  }

  @media screen and (max-height: 768px) {
    //grid-gap: 15px;
    //margin-top: 15px;
  }
}

</style>
