<template>
	<div
		v-if="call"
		class="call-view"
	>
		<CallViewHeader
			:title="callName"
			:subtitle="callNumber"
			:duration="`${min}:${sec}`"
			:answered="!!call.answered"
			:is-hold="!!call.isHold"
			@close="collapseWindow"
		/>

		<CallViewBody
			:queue-name="queueName"
			:variables="call.variables"
		/>

		<CallViewFooter
			:active="!!call.answered"
			:is-muted="!!call.muted"
			:is-hold="!!call.isHold"
			@ringing:accept="sendCallAction('answer')"
			@ringing:reject="sendCallAction('reject')"
			@active:mute="sendCallAction('mute')"
			@active:unmute="sendCallAction('mute')"
			@active:hold="sendCallAction('hold')"
			@active:unhold="sendCallAction('hold')"
			@active:hangup="sendCallAction('reject')"
		/>
	</div>
</template>

<script
	setup
	lang="ts"
>
import { computed, watch } from 'vue';
import CallViewBody from './CallViewBody/CallViewBody.vue';
import CallViewFooter from './CallViewFooter/CallViewFooter.vue';
import CallViewHeader from './CallViewHeader/CallViewHeader.vue';
import { useCallTimer } from '../../composables/useCallTimer.js';
import {
	type CallPayload,
	sendCallAction,
	collapseWindow,
} from '../../composables/useCallIPC.js';

const props = defineProps<{
	call: CallPayload | null;
}>();

const { min, sec, reset, startWithDate, startWithDuration } = useCallTimer();

const callName = computed(() => props.call?.displayName || '');
const callNumber = computed(() =>
	props.call?.showNumber ? props.call?.displayNumber || '' : '',
);
const queueName = computed(() => props.call?.queueName || '');

watch(
	() => props.call,
	(call) => {
		if (!call) {
			reset();
			return;
		}
		if (call.action === 'features/call/TOGGLE_MUTE') return;
		if (call.answered && call.answeredAt) startWithDate(call.answeredAt);
		else if (!call.answered) startWithDuration(call.duration ?? 0);
	},
	{
		immediate: true,
	},
);
</script>

<style scoped>
.call-view {
	display: flex;
	flex-direction: column;
	gap: 10px;
	width: 100%;
	height: 100%;
	background: #f7f7f7;
	border-radius: 5px;
	overflow: auto;
}

.call-view-footer {
	margin-top: auto;
}
</style>
