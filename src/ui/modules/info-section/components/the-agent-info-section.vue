<template>
  <section class="workspace-section">
    <the-agent-info-nav-panel
      v-model="currentTab"
      :tabs="tabs"
    ></the-agent-info-nav-panel>
    <article class="info-tab">
      <info-section-header>
        {{ currentTab.text }}
      </info-section-header>
      <component
        :is="currentTab.value"
        :task="taskOnWorkspace"
      ></component>
    </article>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import { CallActions, ConversationState, JobState } from 'webitel-sdk';
import WorkspaceState from '../../../enums/WorkspaceState.enum';
import ClientInfo from '../modules/client-info/components/client-info-tab.vue';
import GeneralInfo from '../modules/general-info/components/general-info-tab.vue';
import KnowledgeBase from '../modules/knowledge-base/knowledge-base-tab.vue';
import TheAgentInfoNavPanel from './agent-info-nav-panel/the-agent-info-nav-panel.vue';
import Processing from '../modules/processing/components/processing-tab.vue';
import InfoSectionHeader from './agent-info-section-tab-utils/the-agent-info-section-tab-header.vue';

export default {
  name: 'the-agent-info-section',
  components: {
    TheAgentInfoNavPanel,
    InfoSectionHeader,
    GeneralInfo,
    ClientInfo,
    KnowledgeBase,
    Processing,
  },
  data: () => ({
    currentTab: '',
  }),

  watch: {
    taskId() {
      if (this.showProcessing) {
        this.currentTab = this.tabsObject.processing;
      } else if (this.showClientInfo) {
        this.currentTab = this.tabsObject.clientInfo;
      } else {
        this.currentTab = this.tabsObject.generalInfo;
      }
    },
    taskState() {
      if ((this.taskState === CallActions.Hangup
        || this.taskState === ConversationState.Closed
        || this.taskState === JobState.Processing)
        && this.showProcessing) {
        this.currentTab = this.tabsObject.processing;
      }
    },
    showProcessing(value) {
      if (value) {
        this.currentTab = this.tabsObject.processing;
      } else {
        if (this.showClientInfo) this.currentTab = this.tabsObject.clientInfo;
        else this.currentTab = this.tabsObject.generalInfo;
      }
    },
  },

  computed: {
    ...mapGetters('workspace', {
      workspaceState: 'WORKSRACE_STATE',
      taskOnWorkspace: 'TASK_ON_WORKSPACE',
    }),
    ...mapGetters('ui/infoSec/processing', {
      showProcessing: 'ALLOW_PROCESSING',
    }),
    taskId() {
      return this.taskOnWorkspace.id;
    },
    taskState() {
      return this.taskOnWorkspace.state;
    },

    showClientInfo() {
      return this.taskOnWorkspace?.id && this.workspaceState !== WorkspaceState.JOB;
    },

    hasKnowledgeBase() {
      const { variables } = this.taskOnWorkspace;
      return !!variables?.knowledge_base;
    },

    tabs() {
      const tabs = [this.tabsObject.generalInfo];
      if (this.showClientInfo) tabs.push(this.tabsObject.clientInfo);
      if (this.hasKnowledgeBase) tabs.push(this.tabsObject.knowledgeBase);
      if (this.showProcessing) tabs.push(this.tabsObject.processing);
      return tabs;
    },
    tabsObject() {
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
      const processing = {
        text: this.$t('infoSec.processing.title'),
        value: 'processing',
      };
      return {
        generalInfo,
        clientInfo,
        knowledgeBase,
        processing,
      };
    },
  },
  created() {
    this.currentTab = this.tabsObject.generalInfo;
  },
};
</script>

<style lang="scss" scoped>
.workspace-section {
  flex-grow: 1;
  display: flex;
  flex-direction: row-reverse;
  gap: var(--spacing-3xs); // to separate side panel from scroll
  box-sizing: border-box;
  min-width: 0;
  max-width: 100%;
}

.info-tab {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
  max-height: 100%;
  padding: var(--spacing-sm);
  @extend %wt-scrollbar;
  position: relative;
  overflow: scroll;

  .agent-info-section-tab-header {
    margin-bottom: var(--spacing-sm);
  }
}
</style>
