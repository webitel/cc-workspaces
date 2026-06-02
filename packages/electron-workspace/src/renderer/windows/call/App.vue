<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import CallView from './components/CallView.vue';
import ProcessingView from './components/ProcessingView.vue';
import SuccessView from './components/SuccessView.vue';
import {
	type CallPayload,
	onDestroyNotification,
	onSetProcessingInfo,
	onShowCall,
	onShowSuccessMessage,
	type ProcessingPayload,
	toggleDevTools,
} from './composables/useCallIPC';

type View = 'call' | 'processing' | 'success' | 'idle';

const view = ref<View>('idle');
const call = ref<CallPayload | null>(null);
const processing = ref<ProcessingPayload | null>(null);

const unsubscribers: Array<() => void> = [];

function onKeyup(e: KeyboardEvent) {
	if (e.keyCode === 123) toggleDevTools();
}

onMounted(() => {
	unsubscribers.push(
		onShowCall((_event, payload) => {
			call.value = payload;
			view.value = 'call';
		}),
		onDestroyNotification(() => {
			call.value = null;
			processing.value = null;
			view.value = 'idle';
		}),
		onShowSuccessMessage(() => {
			view.value = 'success';
		}),
		onSetProcessingInfo((_event, payload) => {
			processing.value = payload;
			view.value = 'processing';
		}),
	);
	window.addEventListener('keyup', onKeyup, true);
});

onUnmounted(() => {
	for (const off of unsubscribers) off();
	unsubscribers.length = 0;
	window.removeEventListener('keyup', onKeyup, true);
});
</script>

<template>
	<CallView
		v-if="view === 'call'"
		:call="call"
	/>
	<ProcessingView
		v-else-if="view === 'processing'"
		:payload="processing"
	/>
	<SuccessView v-else-if="view === 'success'" />
</template>

<style>
@import url("https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700,800,900|Ubuntu:300,400,500,600,700,800,900");

html {
	border-radius: 25px;
}
p {
	margin: 5px 0 0 0;
}
body {
	overflow: hidden;
	background: #f7f7f7;
	margin: 0;
}
</style>
