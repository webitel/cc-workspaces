<template>
  <section class="workspace-section">
    <tabs
      :current-tab="currentTab"
      :tabs="tabs"
    ></tabs>
    <client-info/>
  </section>
</template>

<script>
  import Tabs from '../../utils/tabs.vue';
  import ClientInfo from './client-info-tab.vue';

  export default {
    name: 'the-agent-info-section',
    components: {
      Tabs,
      ClientInfo,
    },
    data: () => ({
      currentTab: { value: 'info' },
      tabs: [
        {
          text: 'Call info',
          value: 'info',
        },
        {
          text: 'Knowledge base',
          value: 'knowledge-base',
        },
        {
          text: 'Post processing',
          value: 'post-processing',
        },
      ],
    }),
  };
</script>

<style lang="scss" scoped>
  .workspace-section {
    display: flex;
    flex-direction: column;
    min-width: 0;
    max-width: 100%;
  }

  .client-info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    max-height: 100%;
    min-height: 0;
    padding: 20px;
  }
</style>
