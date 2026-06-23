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
        v-model:current-tab="currentTab"
        :tabs="tabs"
        :size="infoSecSize"
        @input="currentTab = $event"
      />
      <keep-alive>
        <component
          :is="currentTab?.value"
          :key="currentTab?.value"
          class="info-tab wt-scrollbar"
          :task="taskOnWorkspace"
          :size="infoSecSize"
        ></component>
      </keep-alive>

    </div>
  </section>
</template>

<script>
import { ConfigurationsAPI } from '@webitel/api-services/api';
import { EngineSystemSettingName } from '@webitel/api-services/gen/models';
import { DefaultWorkspaceTabSettings } from '@webitel/ui-sdk/enums';
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
import Screenshots from '../modules/screenshots/components/screenshots-tab.vue';
import TheAgentInfoNavPanel from './agent-info-nav-panel/the-agent-info-nav-panel.vue';

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
		Screenshots,
	},
	mixins: [
		sizeMixin,
	],
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
		currentTab: null,
		pin: false,
		flowsNamespace: 'ui/infoSec/flows',
		defaultWorkspaceTab: null,
	}),

	watch: {
		taskId() {
			this.currentTab = this.resolveDefaultTab();
		},
		taskState() {
			if (
				(this.taskState === CallActions.Hangup ||
					this.taskState === ConversationState.Closed ||
					this.taskState === JobState.Processing) &&
				this.showProcessing
			) {
				this.currentTab = this.tabsObject.processing;
			}
		},
		showProcessing(value) {
			this.currentTab = this.resolveDefaultTab();
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
		...mapGetters('features/call/videoCall', {
			isVideoCall: 'IS_VIDEO_CALL_ON_WORKSPACE',
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
			return this.flowsList.length;
		},

		showScreenshots() {
			return this.isVideoCall;
		},

		hasKnowledgeBase() {
			const { variables } = this.taskOnWorkspace;
			return !!variables?.knowledge_base;
		},

		tabs() {
			const tabs = [
				this.tabsObject.generalInfo,
			];
			if (this.showClientInfo) tabs.push(this.tabsObject.clientInfo);
			if (this.hasKnowledgeBase) tabs.push(this.tabsObject.knowledgeBase);
			if (this.showProcessing) tabs.push(this.tabsObject.processing);
			if (this.showFlows) tabs.push(this.tabsObject.flows);
			if (this.showScreenshots) tabs.push(this.tabsObject.screenshots);
			return tabs;
		},
		tabsObject() {
			const generalInfo = {
				text: this.$t('infoSec.generalInfo.generalInfo'),
				value: 'general-info',
				icon: 'general-info',
				iconPrefix: 'ws',
				settingValue: DefaultWorkspaceTabSettings.GeneralInfo,
			};
			const clientInfo = {
				text: this.$t('infoSec.clientInfo'),
				value: 'client-info',
				icon: 'client-info',
				iconPrefix: 'ws',
				settingValue: DefaultWorkspaceTabSettings.ClientInfo,
			};
			const knowledgeBase = {
				text: this.$t('infoSec.knowledgeBase'),
				value: 'knowledge-base',
				icon: 'knowledge-base',
				iconPrefix: 'ws',
				settingValue: DefaultWorkspaceTabSettings.KnowledgeBase,
			};
			const processing = {
				text: this.$t('infoSec.processing.title'),
				value: 'processing',
				icon: 'processing',
				iconPrefix: 'ws',
				settingValue: DefaultWorkspaceTabSettings.TaskProcessing,
			};
			const flows = {
				text: this.$t('objects.flow.name', 2),
				value: 'flows',
				icon: 'flows',
				settingValue: DefaultWorkspaceTabSettings.Flows,
			};
			const screenshots = {
				text: this.$t('objects.screenshots', 2),
				value: 'screenshots',
				icon: 'preview-tag-image',
				settingValue: DefaultWorkspaceTabSettings.Screenshots,
			};
			return {
				generalInfo,
				clientInfo,
				knowledgeBase,
				processing,
				flows,
				screenshots,
			};
		},
	},
	methods: {
		resolveDefaultTab() {
			const { processing, clientInfo, generalInfo } = this.tabsObject;

			if (
				this.showProcessing &&
				this.defaultWorkspaceTab === processing.settingValue
			) {
				return processing;
			}
			if (
				this.showClientInfo &&
				this.defaultWorkspaceTab === clientInfo.settingValue
			) {
				return clientInfo;
			}

			if (!this.defaultWorkspaceTab) {
				if (this.showProcessing) return processing;
				if (this.showClientInfo) return clientInfo;
			}

			if (this.showClientInfo && this.taskOnWorkspace?.closedAt) {
				return clientInfo;
			}

			return generalInfo;
		},

		async loadDefaultWorkspaceTab() {
			const { items } = await ConfigurationsAPI.getList({
				name: [
					EngineSystemSettingName.DefaultWorkspaceTab,
				],
			});
			this.defaultWorkspaceTab = items?.[0]?.value ?? null;
		},

		async initialize() {
			await this.loadDefaultWorkspaceTab();
			this.currentTab = this.resolveDefaultTab();
		},
	},
	created() {
		this.initialize();
	},
};
</script>

<style
  lang="scss"
  scoped
>
@use '@webitel/ui-sdk/src/css/main' as *;

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
  max-height: 100%;
  padding-right: var(--scrollbar-width); // scrollbar offset
  scrollbar-gutter: stable both-edges;
}
</style>
