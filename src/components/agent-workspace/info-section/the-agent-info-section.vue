<template>
  <section class="workspace-section">
    <tabs
      :current-tab="currentTab"
      :tabs="tabs"
    ></tabs>
    <client-info></client-info>
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
  .client-info {
    padding: 20px;
  }
</style>
