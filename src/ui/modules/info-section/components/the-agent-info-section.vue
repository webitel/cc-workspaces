<template>
  <section
    :class="[
      `info-section--${size}`,
      { 'info-section--unpinned': !pin },
    ]"
    class="workspace-section info-section"
  >
    <div class="workspace-section__collapse-actions">
      <collapse-action
        v-if="collapsible"
        :collapsed="collapsed"
        @click="$emit('resize')"
      ></collapse-action>
      <pin-action
        v-if="collapsible"
        :pinned="pin"
        @click="pin = !pin"
      ></pin-action>
    </div>
    <div class="info-tab-wrapper">
      <the-agent-info-nav-panel
        v-model="currentTab"
        :tabs="tabs"
      ></the-agent-info-nav-panel>
      <component
        class="info-tab"
        :is="currentTab.value"
        :task="taskOnWorkspace"
        :size="size"
      ></component>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import { CallActions, ConversationState, JobState } from 'webitel-sdk';
import CollapseAction from '../../../../app/components/utils/collapse-action.vue';
import PinAction from '../../../../app/components/utils/pin-action.vue';
import sizeMixin from '../../../../app/mixins/sizeMixin';
import WorkspaceState from '../../../enums/WorkspaceState.enum';
import ClientInfo from '../modules/client-info/components/client-info-tab.vue';
import GeneralInfo from '../modules/general-info/components/general-info-tab.vue';
import KnowledgeBase from '../modules/knowledge-base/knowledge-base-tab.vue';
import Processing from '../modules/processing/components/processing-tab.vue';
import TheAgentInfoNavPanel from './agent-info-nav-panel/the-agent-info-nav-panel.vue';

export default {
  name: 'the-agent-info-section',
  components: {
    TheAgentInfoNavPanel,
    GeneralInfo,
    ClientInfo,
    KnowledgeBase,
    Processing,
    CollapseAction,
    PinAction,
  },
  mixins: [sizeMixin],
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
    collapsible: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    currentTab: '',
    pin: true,
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
        icon: 'ws-general-info',
      };
      const clientInfo = {
        text: this.$t('infoSec.clientInfo'),
        value: 'client-info',
        icon: 'ws-client-info',
      };
      const knowledgeBase = {
        text: this.$t('infoSec.knowledgeBase'),
        value: 'knowledge-base',
        icon: 'ws-knowledge-base',
      };
      const processing = {
        text: this.$t('infoSec.processing.title'),
        value: 'processing',
        icon: 'ws-processing',
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
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  box-sizing: border-box;
  min-width: 0;
  gap: var(--spacing-2xs);

  &.info-section {
    width: auto;
    height: auto;

    transition: var(--transition);
    will-change: width;

    &--md {
      flex: 1 1 auto;
    }

    &--sm {
      /* should have 1 flex-grow/shrink in order to fit all available space if all 3 panels are minified */
      flex: 1 1 320px;
    }

    &--unpinned {
      position: fixed;
      z-index: 111; // overlap header actions
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }
}

.workspace-section__collapse-actions {
  display: flex;
  justify-content: space-between;
  line-height: 0;
}

.info-tab-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 0;
  gap: var(--spacing-sm);
}

.info-tab {
  position: relative;
  display: flex;
  overflow: scroll;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
  @extend %wt-scrollbar;
  max-height: 100%;
  padding-right: var(--spacing-2xs); // scrollbar offset
}
</style>
