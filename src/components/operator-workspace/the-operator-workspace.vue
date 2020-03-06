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
    max-height: 100vh;
    height: 100vh;
    overflow: hidden;
  }

  .workspace {
    $outerheight: calcRem(20px*2+58px+20px);
    display: grid;
    grid-template-columns: calcRem(340px) calcRem(550px) 1fr;
    grid-gap: calcRem(20px);
    height: calc(100vh - #{$outerheight});
    margin-top: calcRem(28px);

    .workspace-section {
      //max-height: calc(100vh - #{$outerheight});
     // height: calc(100vh - #{$outerheight});
    }
  }
</style>
