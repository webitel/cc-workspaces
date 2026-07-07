import { ref } from 'vue';

export function useLoader() {
	/** Tracks loading state per list item by ID. */
	const loadingId = ref<string | null>(null);

	function showLoader(id: string) {
		return loadingId.value === id;
	}

	async function runWithLoader(id: string, callback: () => Promise<void>) {
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
		runWithLoader,
	};
}
