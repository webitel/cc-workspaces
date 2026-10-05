<template>
  <task-header :size="size" :username="member.name">
    <template #task-header-actions>
      <wt-button
		:variant="isOnHistory ? 'active' : 'outlined'"
        :size="size"
        class="call-action"
        color="secondary"
        icon="history"
        rounded
        wide
        @click="$emit('openTab', 'history')"
      />
      <wt-button
        v-show="isCall"
		variant="outlined"
        :size="size"
        color="success"
        icon="call-ringing"
        rounded
        wide
        @click="makeCall"
      />
    </template>
    <template #info>
      <task-header-info
        :title="member.name"
        :queue-name="queueName"
        :username="member.name"
        :size="size"
      />
    </template>
  </task-header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import sizeMixin from '../../../../../../app/mixins/sizeMixin';
import { getQueueName } from '../../../../../modules/queue-section/modules/_shared/scripts/getQueueName';
import TaskHeader from '../../_shared/components/task-header/task-header.vue';
import TaskHeaderInfo from '../../_shared/components/task-header/task-header-info.vue';

export default {
	name: 'WorkspaceMemberHeader',
	components: {
		TaskHeader,
		TaskHeaderInfo,
	},
	mixins: [
		sizeMixin,
	],
	props: {
		currentTab: {
			type: String,
		},
	},
	computed: {
		...mapGetters('features/member', {
			member: 'MEMBER_ON_WORKSPACE',
		}),
		...mapGetters('features/member', {
			isCommSelected: 'IS_COMMUNICATION_SELECTED',
		}),

		isOnHistory() {
			return this.currentTab === 'history';
		},

		isCall() {
			return this.isCommSelected;
		},
		queueName() {
			return getQueueName(this.member);
		},
	},

	methods: {
		...mapActions('features/member', {
			makeCall: 'CALL',
		}),
	},
};
</script>

<style lang="scss" scoped>
</style>
