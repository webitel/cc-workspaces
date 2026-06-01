import { nextTick, onUnmounted, type Ref, unref, watch } from 'vue';
import { resizeWindow } from './useCallIPC';

export function useAutoResize(
	targetRef: Ref<HTMLElement | null>,
	width: number | Ref<number>,
) {
	let observer: ResizeObserver | null = null;
	let lastH = 0;
	let lastW = 0;

	function measureAndSend() {
		const el = targetRef.value;
		if (!el) return;
		const h = Math.max(el.clientHeight, el.scrollHeight, el.offsetHeight);
		const w = unref(width);
		if ((h !== lastH || w !== lastW) && h > 0) {
			lastH = h;
			lastW = w;
			resizeWindow([
				w,
				h,
			]);
		}
	}

	watch(
		targetRef,
		async (el) => {
			observer?.disconnect();
			observer = null;
			if (!el) return;
			observer = new ResizeObserver(measureAndSend);
			observer.observe(el);
			await nextTick();
			measureAndSend();
		},
		{
			immediate: true,
			flush: 'post',
		},
	);

	if (typeof width !== 'number') {
		watch(width, measureAndSend);
	}

	onUnmounted(() => {
		observer?.disconnect();
		observer = null;
	});
}
