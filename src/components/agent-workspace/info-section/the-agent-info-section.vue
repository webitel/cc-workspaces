<template>
  <section class="workspace-section">
    <tabs
      v-model="currentTab"
      :tabs="tabs"
    ></tabs>
    <component class="info-tab" :is="currentTab.value"/>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import { CallActions, ConversationState } from 'webitel-sdk';
import Tabs from '../../utils/tabs.vue';
import GeneralInfo from './general-info/general-info-tab.vue';
import ClientInfo from './client-info/client-info-tab.vue';
import KnowledgeBase from './knowledge-base/knowledge-base-tab.vue';

export default {
  name: 'the-agent-info-section',
  components: {
    Tabs,
    GeneralInfo,
    ClientInfo,
    KnowledgeBase,
  },
  data: () => ({
    currentTab: { value: 'general-info' },
  }),

  watch: {
    taskOnWorkspace() {
      if (this.showClientInfo) {
        this.currentTab = { value: 'client-info' };
      } else {
        this.currentTab = { value: 'general-info' };
      }
    },
    taskState() {
      if ((this.taskState === CallActions.Hangup
        || this.taskState === ConversationState.Closed)
        && this.taskOnWorkspace.allowReporting) {
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

    showClientInfo() {
      return this.taskOnWorkspace?.id;
    },

    hasKnowledgeBase() {
      const { variables } = this.taskOnWorkspace;
      return !!variables?.knowledge_base;
    },

    tabs() {
      const generalInfo = {
        text: this.$t('infoSec.generalInfo.generalInfo'),
        value: 'general-info',
      };
      const clientInfo = {
        text: this.$t('infoSec.clientInfo'),
        value: 'client-info',
      };
      const knowledgeBase = {
        text: this.$t('infoSec.knowledgeBase'),
        value: 'knowledge-base',
      };
      const tabs = [generalInfo];
      if (this.showClientInfo) tabs.push(clientInfo);
      if (this.hasKnowledgeBase) tabs.push(knowledgeBase);
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

.info-tab {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  min-height: 0;
  padding: var(--component-padding);
}
</style>
