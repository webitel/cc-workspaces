<template>
  <main class="main-operator-workspace">
    <notification/>
    <widget-bar/>
    <section class="workspace">
      <queue-section/>
      <workspace-section/>
      <info-section/>
    </section>
  </main>
</template>

<script>
  import { mapActions } from 'vuex';
  import Notification from '../utils/notification.vue';
  import WidgetBar from './widget-bar/widget-bar.vue';
  import QueueSection from './queue-section/the-operator-queue-section.vue';
  import WorkspaceSection from './workspace-section/the-operator-workspace-section.vue';
  import InfoSection from './info-section/the-operator-info-section.vue';

  export default {
    name: 'the-operator-workspace',
    components: {
      Notification,
      WidgetBar,
      QueueSection,
      WorkspaceSection,
      InfoSection,
    },

    created() {
      this.initClient();
    },

    methods: {
      ...mapActions('operator', {
        initClient: 'INIT_CONNECTION',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .main-operator-workspace {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-height: 100vh;
  }

  .workspace {
    flex-grow: 1;
    display: grid;
    grid-template-columns: calcRem(340px) calcRem(550px) 1fr;
    grid-gap: calcRem(20px);
    min-height: 0;
    margin-top: calcRem(28px);

    .workspace-section {
      max-height: 100%;
      min-height: 0;
    }
  }
</style>
