<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import iconPlus from '@img/icon-plus-md.svg';
import { type ProcessingPayload, resetTimer } from '../composables/useCallIPC';

const props = defineProps<{
	payload: ProcessingPayload | null;
}>();
const FULL_DASH_ARRAY = 283;

const timeLeft = ref(0);
const timeLimit = ref(0);
const renewalSec = ref(0);
let intervalId: ReturnType<typeof setInterval> | null = null;

const showRenewalButton = computed(
	() => timeLeft.value <= renewalSec.value && timeLeft.value > 0,
);

const remainingColor = computed(() => {
	if (timeLimit.value <= 0) return 'green';
	const alertThreshold = timeLimit.value / 4;
	const warningThreshold = timeLimit.value / 2;
	if (timeLeft.value <= alertThreshold) return 'red';
	if (timeLeft.value <= warningThreshold) return 'orange';
	return 'green';
});

const dashArray = computed(() => {
	if (timeLimit.value <= 0) return `${FULL_DASH_ARRAY} 283`;
	const raw = timeLeft.value / timeLimit.value;
	const adjusted = raw - (1 / timeLimit.value) * (1 - raw);
	return `${(adjusted * FULL_DASH_ARRAY).toFixed(0)} 283`;
});

function clearTimer() {
	if (intervalId) {
		clearInterval(intervalId);
		intervalId = null;
	}
}

function startAutoReload() {
	clearTimer();
	intervalId = setInterval(() => {
		if (timeLeft.value > 0) timeLeft.value -= 1;
		else clearTimer();
	}, 1000);
}

watch(
	() => props.payload,
	(p) => {
		if (!p) {
			clearTimer();
			timeLeft.value = 0;
			return;
		}
		timeLeft.value = Math.floor((p.processingTimeoutAt - p.now) / 1000);
		timeLimit.value = Math.ceil(
			(p.processingTimeoutAt - p.startProcessingAt) / 1000,
		);
		renewalSec.value = p.renewalSec;
		if (!intervalId && timeLeft.value > 0) startAutoReload();
	},
	{
		immediate: true,
	},
);

onUnmounted(clearTimer);
</script>

<template>
	<div class="timer">
		<div class="base-timer">
			<svg
				class="base-timer__svg"
				viewBox="0 0 100 100"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g class="base-timer__circle">
					<circle
						class="base-timer__path-elapsed"
						cx="50"
						cy="50"
						r="45"
					/>
					<path
						class="base-timer__path-remaining"
						:class="remainingColor"
						:stroke-dasharray="dashArray"
						d="M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0"
					/>
				</g>
			</svg>
			<span
				v-show="!showRenewalButton"
				class="base-timer__label"
			>
				{{ timeLeft }}
			</span>
			<input
				v-show="showRenewalButton"
				id="resetTimeBtn"
				class="reset-time-btn"
				type="image"
				:src="iconPlus"
				name="resetBtn"
				alt="reset"
				style="contain: content; margin-bottom: 48px; border: none; outline: none;"
				@click="resetTimer"
			/>
		</div>
	</div>
</template>
