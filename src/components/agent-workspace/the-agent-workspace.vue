<template>
  <main class="main-agent-workspace">
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
  </main>
</template>

<script>
  import { mapActions } from 'vuex';
  import Notification from '../utils/notification.vue';
  import CcHeader from '../cc-header/cc-header.vue';
  import WidgetBar from './widget-bar/widget-bar.vue';
  import QueueSection from './queue-section/the-agent-queue-section.vue';
  import WorkspaceSection from './workspace-section/the-agent-workspace-section.vue';
  import InfoSection from './info-section/the-agent-info-section.vue';

  export default {
    name: 'the-agent-workspace',
    components: {
      Notification,
      CcHeader,
      WidgetBar,
      QueueSection,
      WorkspaceSection,
      InfoSection,
    },

    created() {
      this.initWorkspace();
      this.setNowWatcher();
    },

    destroyed() {
      this.clearNowWatcher();
    },
    methods: {
      async initWorkspace() {
        await this.subscribeCalls();
        await this.subscribeStatus();
      },

      ...mapActions('workspace', {
        subscribeCalls: 'SUBSCRIBE_CALLS',
      }),

      ...mapActions('status', {
        subscribeStatus: 'SUBSCRIBE_STATUS',
      }),

      ...mapActions('now', {
        setNowWatcher: 'SET_NOW_WATCHER',
        clearNowWatcher: 'CLEAR_NOW_WATCHER',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .main-agent-workspace {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-height: 100vh;
  }

  .workspace-wrap {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: calcVH(20px) calcVH(30px);
    box-sizing: border-box;
  }

  .workspace {
    flex-grow: 1;
    display: grid;
    grid-template-columns: calcVH(340px) calcVH(550px) 1fr;
    grid-gap: calcVH(20px);
    min-height: 0;
    margin-top: calcVH(28px);

    .workspace-section {
      max-height: 100%;
      min-height: 0;
    }
  }
</style>
