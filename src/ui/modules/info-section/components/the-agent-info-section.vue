<template>
  <section class="workspace-section">
    <wt-tabs
      v-model="currentTab"
      :tabs="tabs"
    ></wt-tabs>
    <component :is="currentTab.value" class="info-tab" />
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import { CallActions, ConversationState } from 'webitel-sdk';
import ClientInfo from '../modules/client-info/components/client-info-tab.vue';
import GeneralInfo from '../modules/general-info/components/general-info-tab.vue';
import KnowledgeBase from '../modules/knowledge-base/knowledge-base-tab.vue';

export default {
  name: 'the-agent-info-section',
  components: {
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
  box-sizing: border-box;
  min-width: 0;
  max-width: 100%;
  padding: var(--spacing-sm);
  gap: var(--spacing-sm);
}

.info-tab {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
  max-height: 100%;
}
</style>
