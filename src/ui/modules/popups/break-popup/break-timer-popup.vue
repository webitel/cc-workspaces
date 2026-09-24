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
        :model-value="selectedActivityType"
        :options="activityTypes"
        @update:model-value="selectedActivityType = $event"
      />
    </template>
    <template #actions>
      <wt-button
        :color="ButtonColor.SUCCESS"
        :wide="isBreakTimerStep"
        @click="handleContinueWork"
      >{{ t('agentStatus.breakTimer.continueWork') }}
      </wt-button>
      <wt-button
        :color="secondaryButtonSettings.color"
        :wide="secondaryButtonSettings.wide"
        @click="secondaryButtonSettings.handler"
      >{{ secondaryButtonSettings.text }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script setup lang="ts">
import { ButtonColor } from '@webitel/ui-sdk/enums';
import WtCcActivityTypeOptions from '@webitel/ui-sdk/src/modules/AgentStatusSelect/components/_internals/wt-cc-activity-type-options.vue';
import { useActivityTypesOptions } from '@webitel/ui-sdk/src/modules/AgentStatusSelect/composables/useActivityTypesOptions';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import type { LookupOption } from '@webitel/ui-sdk/src/types';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { type Agent, AgentStatus } from 'webitel-sdk';

import BreakTimer from './components/break-timer.vue';

const store = useStore();
const { t } = useI18n();

const { activityTypes, defaultActivityTypeOption, loadActivityTypes } =
	useActivityTypesOptions();

const duration = ref('00:00:00');
const isBreakPopupValue = ref(false);
const isBreakTimerStep = ref(true);
const selectedActivityType = ref<LookupOption | null>(null);

const now = computed(() => store.state.ui.now.now);
const agent = computed<Agent>(() => store.state.features.status.agent);

const agentStatus = computed(() => agent.value.status);

const breakInfo = computed(() =>
	agentStatus.value === AgentStatus.Pause
		? agent.value.statusPayload
		: t(`agentStatus.breakTimer.${AgentStatus.BreakOut}`),
);

const statusComment = computed(() => agent.value?.statusComment);

const title = computed(() =>
	isBreakTimerStep.value
		? t('agentStatus.breakTimer.heading', {
				mode: t(`agentStatus.breakTimer.mode.${agentStatus.value}`),
			})
		: t('webitelUI.agentStatusSelect.activityTypePopup.title'),
);

const isBreakPopup = computed(
	() =>
		isBreakPopupValue.value &&
		(agentStatus.value === AgentStatus.Pause ||
			agentStatus.value === AgentStatus.BreakOut),
);

watch(
	now,
	() => {
		duration.value = convertDuration(agent.value?.stateDuration);
	},
	{
		immediate: true,
	},
);

watch(
	agentStatus,
	() => {
		if (
			agentStatus.value === AgentStatus.Pause ||
			agentStatus.value === AgentStatus.BreakOut
		) {
			isBreakPopupValue.value = true;
			isBreakTimerStep.value = true;
			selectedActivityType.value = null;
		}
	},
	{
		immediate: true,
	},
);

watch(
	breakInfo,
	() => {
		if (
			agentStatus.value === AgentStatus.Pause ||
			agentStatus.value === AgentStatus.BreakOut
		) {
			isBreakPopupValue.value = true;
		}
	},
	{
		immediate: true,
	},
);

async function setAgentWaiting(payload?: {
	activityType: LookupOption | null;
}) {
	await store.dispatch('features/status/SET_AGENT_WAITING_STATUS', payload);
}

async function goToActivityTypeStep() {
	await loadActivityTypes();
	if (activityTypes.value.length > 1) {
		selectedActivityType.value = activityTypes.value[0];
		isBreakTimerStep.value = false;
	} else {
		await setAgentWaiting();
	}
}

async function confirmActivityType() {
	const activityType =
		selectedActivityType.value?.id === defaultActivityTypeOption.value?.id
			? defaultActivityTypeOption.value
			: selectedActivityType.value;
	await setAgentWaiting({
		activityType,
	});
}

async function handleContinueWork() {
	if (isBreakTimerStep.value) {
		await goToActivityTypeStep();
	} else {
		await confirmActivityType();
	}
}

async function agentLogout() {
	await store.dispatch('features/status/AGENT_LOGOUT');
}

function goToBreakTimerStep() {
	isBreakTimerStep.value = true;
	selectedActivityType.value = null;
}

const secondaryButtonSettings = computed(() =>
	isBreakTimerStep.value
		? {
				color: ButtonColor.ERROR,
				wide: true,
				text: t('agentStatus.breakTimer.goOffline'),
				handler: agentLogout,
			}
		: {
				color: ButtonColor.SECONDARY,
				wide: false,
				text: t('reusable.back'),
				handler: goToBreakTimerStep,
			},
);

function close() {
	isBreakPopupValue.value = false;
}
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;
:deep(.wt-popup__main) {
  padding-right: 0;
}
</style>
