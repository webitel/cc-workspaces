<template>
  <wt-popup
    v-if="isBreakPopup"
    class="break-timer-popup"
    :size="isBreakTimerStep ? 'sm' : 'md'"
    @close="close"
  >
    <template #title>{{ title }}</template>
    <template #main>
      <break-timer
        v-if="isBreakTimerStep"
        :agent-status="agentStatus"
        :duration="duration"
        :break-info="breakInfo"
        :status-comment="statusComment"
      />
      <wt-cc-activity-type-options
        v-else
        v-model="selectedActivityType"
        :options="activityTypes"
      />
    </template>
    <template #actions>
      <wt-button
        color="success"
        wide
        @click="handleContinueWork"
      >{{ $t('agentStatus.breakTimer.continueWork') }}
      </wt-button>
      <wt-button
        color="error"
        wide
        @click="agentLogout"
      >{{ $t('reusable.logout') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script>
import WtCcActivityTypeOptions from '@webitel/ui-sdk/src/modules/AgentStatusSelect/components/_internals/wt-cc-activity-type-options.vue';
import { useActivityTypesOptions } from '@webitel/ui-sdk/src/modules/AgentStatusSelect/composables/useActivityTypesOptions';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import { mapActions, mapState } from 'vuex';
import { AgentStatus } from 'webitel-sdk';

import BreakTimer from './components/break-timer.vue';

export default {
	name: 'BreakTimerPopup',
	components: {
		BreakTimer,
		WtCcActivityTypeOptions,
	},
	setup() {
		const { activityTypes, defaultActivityTypeOption, loadActivityTypes } =
			useActivityTypesOptions();
		return {
			activityTypes,
			defaultActivityTypeOption,
			loadActivityTypes,
		};
	},
	data: () => ({
		AgentStatus,
		duration: '00:00:00',
		isBreakPopupValue: false,
		isBreakTimerStep: true,
		selectedActivityType: null,
	}),
	watch: {
		now: {
			handler() {
				this.duration = convertDuration(this.agent?.stateDuration);
			},
			immediate: true,
		},
		agentStatus: {
			handler() {
				if (
					this.agentStatus === AgentStatus.Pause ||
					this.agentStatus === AgentStatus.BreakOut
				) {
					this.isBreakPopupValue = true;
					this.isBreakTimerStep = true;
					this.selectedActivityType = null;
				}
			},
			immediate: true,
		},
		breakInfo: {
			handler() {
				if (
					this.agentStatus === AgentStatus.Pause ||
					this.agentStatus === AgentStatus.BreakOut
				)
					this.isBreakPopupValue = true;
			},
			immediate: true,
		},
	},

	computed: {
		...mapState('ui/now', {
			now: (state) => state.now,
		}),
		...mapState('features/status', {
			agent: (state) => state.agent,
		}),
		title() {
			return this.isBreakTimerStep
				? this.$t('agentStatus.breakTimer.heading', {
						mode: this.$t(`agentStatus.breakTimer.mode.${this.agentStatus}`),
					})
				: this.$t('webitelUI.agentStatusSelect.activityTypePopup.title');
		},
		isBreakPopup() {
			return (
				this.isBreakPopupValue &&
				(this.agentStatus === AgentStatus.Pause ||
					this.agentStatus === AgentStatus.BreakOut)
			);
		},
		agentStatus() {
			return this.agent.status;
		},
		breakInfo() {
			return this.agentStatus === AgentStatus.Pause
				? this.agent.statusPayload
				: this.$t(`agentStatus.breakTimer.${AgentStatus.BreakOut}`);
		},
		statusComment() {
			return this.agent?.statusComment;
		},
	},

	methods: {
		...mapActions('features/status', {
			setAgentWaiting: 'SET_AGENT_WAITING_STATUS',
			agentLogout: 'AGENT_LOGOUT',
		}),
		async handleContinueWork() {
			if (this.isBreakTimerStep) {
				await this.goToActivityTypeStep();
			} else {
				await this.confirmActivityType();
			}
		},
		async goToActivityTypeStep() {
			await this.loadActivityTypes();
			if (this.activityTypes.length > 1) {
				this.selectedActivityType = this.activityTypes[0];
				this.isBreakTimerStep = false;
			} else {
				await this.setAgentWaiting();
			}
		},
		async confirmActivityType() {
			const activityType =
				this.selectedActivityType.id === this.defaultActivityTypeOption?.id
					? this.defaultActivityTypeOption
					: this.selectedActivityType;
			await this.setAgentWaiting({
				activityType,
			});
		},
		close() {
			this.isBreakPopupValue = false;
		},
	},
};
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;
</style>
