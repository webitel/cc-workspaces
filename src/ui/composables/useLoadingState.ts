import { ref } from 'vue';

export function useLoadingState() {
	/**
	 * Tracks the ID of the item currently being loaded.
	 * Using an ID instead of a simple boolean flag allows multiple items
	 * to be rendered in a list at the same time, with each item independently
	 * tracking its own loading state — without blocking or affecting others.
	 */
	const loadingId = ref<string | null>(null);

	function showLoader(id: string) {
		return loadingId.value === id;
	}

	async function withLoading(id: string, callback: () => Promise<void>) {
		if (loadingId.value === id) return;
		loadingId.value = id;
		try {
			await callback();
		} finally {
			loadingId.value = null;
		}
	}

	return {
		loadingId,
		showLoader,
		withLoading,
	};
}
