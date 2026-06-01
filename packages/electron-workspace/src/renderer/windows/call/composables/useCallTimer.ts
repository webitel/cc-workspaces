import { computed, onUnmounted, ref } from 'vue';

const pad = (n: number) => String(n).padStart(2, '0');

export function useCallTimer() {
	const totalSeconds = ref(0);
	let intervalId: ReturnType<typeof setInterval> | null = null;

	const min = computed(() => pad(Math.floor(totalSeconds.value / 60)));
	const sec = computed(() => pad(totalSeconds.value % 60));

	function stop() {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
	}

	function start() {
		stop();
		intervalId = setInterval(() => {
			totalSeconds.value += 1;
		}, 1000);
	}

	function reset() {
		stop();
		totalSeconds.value = 0;
	}

	function startWithDate(answeredAt: number) {
		totalSeconds.value = Math.floor((Date.now() - answeredAt) / 1000);
		start();
	}

	function startWithDuration(duration: number) {
		totalSeconds.value = duration < 0 ? 0 : duration;
		start();
	}

	onUnmounted(stop);

	return {
		min,
		sec,
		reset,
		startWithDate,
		startWithDuration,
	};
}
