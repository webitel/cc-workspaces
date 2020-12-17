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
import { mapGetters } from 'vuex';
import { CallActions, ConversationState } from 'webitel-sdk';
import Tabs from '../../utils/tabs.vue';
import ClientInfo from './client-info/client-info-tab.vue';
import KnowledgeBase from './knowledge-base/knowledge-base-tab.vue';
import PostProcessing from './post-processing/post-processing-tab.vue';

export default {
  name: 'the-agent-info-section',
  components: {
    Tabs,
    ClientInfo,
    KnowledgeBase,
    PostProcessing,
  },
  data: () => ({
    currentTab: { value: 'client-info' },
  }),

  watch: {
    taskOnWorkspace() {
      this.currentTab = { value: 'client-info' };
    },
    taskState() {
      if ((this.taskState === CallActions.Hangup
        || this.taskState === ConversationState.Closed)
        && this.taskOnWorkspace.allowReporting) {
        this.currentTab = { value: 'post-processing' };
      } else if (this.currentTab.value === 'post-processing') {
        this.currentTab = { value: 'client-info' };
      }
    },
  },

  computed: {
    ...mapGetters('workspace', {
      taskOnWorkspace: 'TASK_ON_WORKSPACE',
    }),
    taskState() {
      return this.taskOnWorkspace.state;
    },

    hasKnowledgeBase() {
      const { variables } = this.taskOnWorkspace;
      return !!variables?.knowledge_base;
    },

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
      const tabs = [clientInfo];
      if (this.hasKnowledgeBase) tabs.push(knowledgeBase);
      if (this.taskOnWorkspace.allowReporting) tabs.push(postProcessing);
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
