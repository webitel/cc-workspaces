<template>
  <task-container>
    <template #header>
      <member-header
        :current-tab="currentTab"
        :size="size"
        @open-tab="openTab"
      ></member-header>
    </template>
    <template #body>
			<component
        :is="currentComponent"
        :size="size"
      />
    </template>
  </task-container>
</template>

<script>
import sizeMixin from '../../../../../../app/mixins/sizeMixin';
import TaskContainer from '../../_shared/components/task-container/task-container.vue';
import History from '../../_shared/components/workspace-history/components/history-container.vue';
import { MemberTab } from '../enums/MemberTab.enum';
import MemberCommunications from './member-communications.vue';
import MemberHeader from './member-header.vue';

const memberTabComponents = {
	[MemberTab.Communications]: MemberCommunications,
	[MemberTab.History]: History,
};

export default {
	name: 'TheMember',
	components: {
		TaskContainer,
		MemberHeader,
		MemberCommunications,
		History,
	},
	mixins: [
		sizeMixin,
	],
	data: () => ({
		currentTab: MemberTab.Communications,
	}),

	computed: {
		currentComponent() {
			return this.currentTab
				? memberTabComponents[this.currentTab]
				: memberTabComponents[MemberTab.Communications];
		},
	},

	methods: {
		openTab(tab) {
			this.currentTab = this.currentTab === tab ? '' : tab;
		},
	},
};
</script>

<style lang="scss" scoped>
</style>
