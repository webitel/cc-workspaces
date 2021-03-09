<template>
  <main class="main-agent-workspace" @dragenter.prevent @dragover.prevent @drop="preventDrop">
    <disconnect-popup/>

    <notification/>
    <cc-header/>
    <div class="workspace-wrap">
      <widget-bar/>
      <section class="workspace">
        <queue-section/>
        <workspace-section/>
        <info-section/>
      </section>
    </div>

    <video-container/>
  </main>
</template>

<script>
  import { mapActions } from 'vuex';
  import Notification from '../utils/notification.vue';
  import CcHeader from '../shared/app-header/app-header.vue';
  import WidgetBar from './widget-bar/widget-bar.vue';
  import QueueSection from './queue-section/the-agent-queue-section.vue';
  import WorkspaceSection from './workspace-section/the-agent-workspace-section.vue';
  import InfoSection from './info-section/the-agent-info-section.vue';
  import VideoContainer from './video-container/video-container.vue';
  import DisconnectPopup from './popups/disconnect-popup/disconnect-popup.vue';
  import ringingSoundMixin from '../../mixins/ringingSoundMixin';

  export default {
    name: 'the-agent-workspace',
    mixins: [ringingSoundMixin],
    components: {
      Notification,
      CcHeader,
      WidgetBar,
      QueueSection,
      WorkspaceSection,
      InfoSection,
      VideoContainer,
      DisconnectPopup,
    },

    created() {
      this.openSession();
    },

    destroyed() {
      this.closeSession();
    },

    methods: {
      ...mapActions('workspace', {
        openSession: 'OPEN_SESSION',
        closeSession: 'CLOSE_SESSION',
      }),

      preventDrop(event) {
        event.preventDefault();
        event.stopPropagation();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .main-agent-workspace {
    display: flex;
    flex-direction: column;
    max-height: 100%;
    min-width: 1280px;
  }

  .workspace-wrap {
    flex-grow: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 20px 30px;
    box-sizing: border-box;

    @media screen and (max-height: 768px) {
      padding: 15px;
    }
  }

  .workspace {
    flex-grow: 1;
    display: grid;
    grid-template-columns: 340px 550px 1fr;
    grid-gap: 20px;
    min-height: 0;
    margin-top: 20px;

    .workspace-section {
      max-height: 100%;
      min-height: 0;
    }

    @media screen and (max-width: 1336px) {
      grid-template-columns: 120px 550px 1fr; // changed 1st col width
    }

    @media screen and (max-height: 768px) {
      grid-gap: 15px;
      margin-top: 15px;
    }
  }
</style>
