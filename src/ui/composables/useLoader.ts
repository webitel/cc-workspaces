import { onScopeDispose, ref } from 'vue';

const COOLDOWN_MS = 1000;

export function useLoader() {
	/** Tracks loading state per list item by ID. */
	const loadingId = ref<string | null>(null);
	let cooldownTimer: ReturnType<typeof setTimeout> | null = null;

	function showLoader(id: string) {
		return loadingId.value === id;
	}

	async function runWithLoader(id: string, callback: () => Promise<void>) {
		if (loadingId.value === id) return;
		loadingId.value = id;
		try {
			await callback();
		} finally {
			/**
			 * @author PolinaSukhorukova-webitel
			 *
			 * [WTEL-6752](https://webitel.atlassian.net/browse/WTEL-6752?focusedCommentId=765237)
			 * makeCall resolves as soon as the server registers the call,
			 * so reset the flag after a cooldown to debounce rapid double-clicks.
			 */
			cooldownTimer = setTimeout(() => {
				loadingId.value = null;
				cooldownTimer = null;
			}, COOLDOWN_MS);
		}
	}

	onScopeDispose(() => {
		if (cooldownTimer) clearTimeout(cooldownTimer);
	});

	return {
		loadingId,
		showLoader,
		runWithLoader,
	};
}
