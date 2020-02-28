<template>
  <main class="main-operator-workspace">
    <widget-bar></widget-bar>
    <section class="workspace">
      <queue-section></queue-section>
      <workspace-section></workspace-section>
      <info-section></info-section>
    </section>
  </main>
</template>

<script>
  import WidgetBar from './widget-bar/widget-bar.vue';
  import QueueSection from './queue-section/the-operator-queue-section.vue';
  import WorkspaceSection from './workspace-section/the-operator-workspace-section.vue';
  import InfoSection from './info-section/the-operator-info-section.vue';

  export default {
    name: 'the-operator-workspace',
    components: {
      WidgetBar,
      QueueSection,
      WorkspaceSection,
      InfoSection,
    },
  };
</script>

<style lang="scss" scoped>
  .main-operator-workspace {
    display: flex;
    flex-direction: column;
  }

  .workspace {
    display: grid;
    grid-template-columns: 340px 550px 1fr;
    grid-gap: 20px;
    height: 100%;
    margin-top: 28px;
  }
</style>
