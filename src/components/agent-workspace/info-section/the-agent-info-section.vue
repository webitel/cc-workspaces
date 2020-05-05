<template>
  <section class="workspace-section">
    <tabs
      v-model="currentTab"
      :tabs="tabs"
    ></tabs>
    <component :is="currentTab.value"/>
  </section>
</template>

<script>
  import { mapState } from 'vuex';
  import { CallActions } from 'webitel-sdk';
  import Tabs from '../../utils/tabs.vue';
  import ClientInfo from './client-info/client-info-tab.vue';
  import PostProcessing from './post-processing/post-processing-tab.vue';

  export default {
    name: 'the-agent-info-section',
    components: {
      Tabs,
      ClientInfo,
      PostProcessing,
    },
    data: () => ({
      currentTab: { value: 'client-info' },
    }),

    watch: {
      state() {
        if (this.call.state === CallActions.Hangup && this.call.allowReporting) {
          this.currentTab = { value: 'post-processing' };
        } else {
          this.currentTab = { value: 'client-info' };
        }
      },
    },

    computed: {
      ...mapState('call', {
        call: (state) => state.callOnWorkspace,
        state: (state) => state.callOnWorkspace.state,
      }),

      tabs() {
        const clientInfo = {
          text: this.$t('infoSec.clientInfo'),
          value: 'client-info',
        };
        const postProcessing = {
          text: this.$t('infoSec.postProcessing.tab'),
          value: 'post-processing',
        };
        const knowledgeBase = {
          text: this.$t('infoSec.knowledgeBase'),
          value: 'knowledge-base',
        };
        const tabs = [
          clientInfo,
          knowledgeBase,
        ];
        if (this.call.allowReporting) {
          // insert post-processing on 2nd place
          tabs.splice(1, 0, postProcessing);
        }
        return tabs;
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
