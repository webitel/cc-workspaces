<template>
  <section
    :class="[
      `info-section--${infoSecSize}`,
      { 'info-section--pinned': pin },
    ]"
    class="workspace-section info-section"
  >
    <div class="workspace-section__collapse-actions">
      <collapse-action
        v-if="collapsible && !pin"
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
        :size="infoSecSize"
      />
      <wt-replace-transition>
        <keep-alive>
            <component
              :is="currentTab.value"
              class="info-tab"
              :task="taskOnWorkspace"
              :size="infoSecSize"
            ></component>
        </keep-alive>
      </wt-replace-transition>

    </div>
  </section>
</template>

<script>
import { useCachedInterval } from '@webitel/ui-sdk/src/composables/useCachedInterval/useCachedInterval.js';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import { mapGetters, mapState } from 'vuex';
import { CallActions, ConversationState, JobState } from 'webitel-sdk';

import CollapseAction from '../../../../app/components/utils/collapse-action.vue';
import PinAction from '../../../../app/components/utils/pin-action.vue';
import sizeMixin from '../../../../app/mixins/sizeMixin';
import ClientInfo from '../modules/client-info/components/client-info-tab.vue';
import Flows from '../modules/flows/components/flows-tab.vue';
import GeneralInfo from '../modules/general-info/components/general-info-tab.vue';
import KnowledgeBase from '../modules/knowledge-base/knowledge-base-tab.vue';
import Processing from '../modules/processing/components/processing-tab.vue';
import TheAgentInfoNavPanel from './agent-info-nav-panel/the-agent-info-nav-panel.vue';
import WtReplaceTransition from '@webitel/ui-sdk/src/components/transitions/cases/wt-replace-transition.vue';

export default {
  name: 'TheAgentInfoSection',
  components: {
    TheAgentInfoNavPanel,
    GeneralInfo,
    ClientInfo,
    KnowledgeBase,
    Processing,
    CollapseAction,
    PinAction,
    Flows,
    WtReplaceTransition
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

  setup() {
    const { subscribe } = useCachedInterval({ timeout: 5 * 1000 });
    return { subscribe };
  },
  data: () => ({
    currentTab: '',
    pin: false,
    flowsNamespace: 'ui/infoSec/flows',
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
    ...mapState({
      flowsList(state) {
        return getNamespacedState(state, `${this.flowsNamespace}`).flows;
      },
    }),
    infoSecSize() {
      // should be always md if pinned
      if (this.pin) return 'md';
      return this.size;
    },
    taskId() {
      return this.taskOnWorkspace.id;
    },
    taskState() {
      return this.taskOnWorkspace.state;
    },

    showClientInfo() {
      return this.taskOnWorkspace?.id;
    },

    showFlows() {
      return this.flowsList.length
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
      if (this.showFlows) tabs.push(this.tabsObject.flows);
      return tabs;
    },
    tabsObject() {
      const generalInfo = {
        text: this.$t('infoSec.generalInfo.generalInfo'),
        value: 'general-info',
        icon: 'general-info',
        iconPrefix: 'ws',
      };
      const clientInfo = {
        text: this.$t('infoSec.clientInfo'),
        value: 'client-info',
        icon: 'client-info',
        iconPrefix: 'ws',
      };
      const knowledgeBase = {
        text: this.$t('infoSec.knowledgeBase'),
        value: 'knowledge-base',
        icon: 'knowledge-base',
        iconPrefix: 'ws',
      };
      const processing = {
        text: this.$t('infoSec.processing.title'),
        value: 'processing',
        icon: 'processing',
        iconPrefix: 'ws',
      };
      const flows = {
        text: this.$tc('objects.flow.name', 2),
        value: 'flows',
        icon: 'flows',
      };
      return {
        generalInfo,
        clientInfo,
        knowledgeBase,
        processing,
        flows,
      };
    },
  },
  created() {
    this.currentTab = this.tabsObject.generalInfo;
  },
  mounted() {
    this.subscribe(this.loadFlowsList);
  },
  methods: {
    async loadFlowsList() {
      await this.$store.dispatch(`${this.flowsNamespace}/LOAD_FLOWS_LIST`);
    }
  }
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
      flex: 1 1 320px;
    }

    &--sm {
      /* should have 1 flex-grow/shrink in order to fit all available space if all 3 panels are minified */
      flex: 1 1 320px;
    }

    &--pinned {
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

.pin-action {
  margin-left: auto;
}

.info-tab-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 0;
  gap: var(--spacing-sm);
  flex-grow: 1;
}

.info-tab {
  position: relative;
  display: flex;
  //overflow-y: scroll;
  overflow: auto;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
  @extend %wt-scrollbar;
  max-height: 100%;
  padding-right: var(--scrollbar-width); // scrollbar offset
  scrollbar-gutter: stable both-edges;
}
</style>
