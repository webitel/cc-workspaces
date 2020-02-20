<template>
  <main class="main-operator-workspace">
    <widget-bar></widget-bar>
    <div class="grid-wrap">
      <section class="workspace">
        <queue-section></queue-section>
        <workspace-section></workspace-section>
        <info-section></info-section>
      </section>
    </div>
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

  // wrapper class to force grid fill all available height
  .grid-wrap {
    flex-grow: 1;
    margin-top: 28px;
  }

  .workspace {
    display: grid;
    align-items: stretch;
    grid-template-columns: 340px 550px 1fr;
    grid-gap: 20px;
    min-height: 100%;
  }
</style>
