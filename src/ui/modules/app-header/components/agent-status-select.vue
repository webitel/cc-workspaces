<template>
  <wt-cc-agent-status-select
    class="agent-status-select"
    show-call-center-switcher
    :is-call-center-on="isCcenterOn"
    :agent-id="agent.agentId"
    :status="agent.status"
    :status-duration="statusDuration"
    @changed-call-center-mode="$emit('changed-call-center-mode', $event)"
  ></wt-cc-agent-status-select>
</template>

<script>
import WtCcAgentStatusSelect from '@webitel/ui-sdk/src/modules/AgentStatusSelect/components/wt-cc-agent-status-select.vue';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import { mapGetters, mapState } from 'vuex';

export default {
	name: 'AgentStatusSelect',
	emits: [
		'changed-call-center-mode',
	],
	components: {
		WtCcAgentStatusSelect,
	},

	computed: {
		...mapState('ui/now', {
			now: (state) => state.now,
		}),

		...mapState('features/status', {
			agent: (state) => state.agent,
		}),

		...mapGetters('features/status', {
			isCcenterOn: 'IS_CCENTER_ON',
		}),

		statusDuration() {
			let time = this.now - (this.agent.lastStatusChange || Date.now());
			time = time < 0 ? 0 : time;
			return convertDuration(time / 1000);
		},
	},
};
</script>

<style lang="scss" scoped>

</style>
