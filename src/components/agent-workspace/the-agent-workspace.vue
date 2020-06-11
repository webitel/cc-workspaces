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

    <video-container/>
  </main>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import Notification from '../utils/notification.vue';
  import CcHeader from '../cc-header/cc-header.vue';
  import WidgetBar from './widget-bar/widget-bar.vue';
  import QueueSection from './queue-section/the-agent-queue-section.vue';
  import WorkspaceSection from './workspace-section/the-agent-workspace-section.vue';
  import InfoSection from './info-section/the-agent-info-section.vue';
  import VideoContainer from './video-container/video-container.vue';
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
    },

    created() {
      this.initWorkspace();
      this.setNowWatcher();
    },

    destroyed() {
      this.clearNowWatcher();
    },

    watch: {
      // after user info is loaded, fetch offline and missed queues data
      userId() {
        this.loadMembersList({});
        this.loadMissedList();
      },
    },

    computed: {
      // after user info is loaded, fetch offline and missed queues data
      ...mapState('userinfo', {
        userId: (state) => state.userId,
      }),
    },

    methods: {
      async initWorkspace() {
        await this.subscribeCalls();
        await this.subscribeStatus();
      },

      ...mapActions('call', {
        subscribeCalls: 'SUBSCRIBE_CALLS',
      }),

      ...mapActions('member', {
        loadMembersList: 'LOAD_DATA_LIST',
      }),

      ...mapActions('call/missed', {
        loadMissedList: 'LOAD_DATA_LIST',
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
    max-height: 100%;
  }

  .workspace-wrap {
    flex-grow: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: (20px) (30px);
    box-sizing: border-box;
  }

  .workspace {
    flex-grow: 1;
    display: grid;
    grid-template-columns: (340px) (550px) 1fr;
    grid-gap: (20px);
    min-height: 0;
    margin-top: (28px);

    .workspace-section {
      max-height: 100%;
      min-height: 0;
    }
  }
</style>
