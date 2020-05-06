<template>
  <section class="workspace-section">
    <tabs
      :current-tab="currentTab"
      :tabs="tabs"
    ></tabs>
    <component :is="currentTab.value" />
  </section>
</template>

<script>
  import Tabs from '../../utils/tabs.vue';
  import ClientInfo from './client-info-tab.vue';
  import PostProcessing from './post-processing/post-processing-tab.vue';

  export default {
    name: 'the-agent-info-section',
    components: {
      Tabs,
      ClientInfo,
      PostProcessing,
    },
    data: () => ({
      currentTab: { value: 'post-processing' },
    }),

    computed: {
      tabs() {
        return [
          {
            text: this.$t('infoSec.clientInfo'),
            value: 'client-info',
          },
          {
            text: this.$t('infoSec.postProcessing.tab'),
            value: 'post-processing',
          },
          {
            text: this.$t('infoSec.knowledgeBase'),
            value: 'knowledge-base',
          },
        ];
      },
    },
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
