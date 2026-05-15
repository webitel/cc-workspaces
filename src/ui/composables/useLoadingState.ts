import { ref } from 'vue';

export function useLoadingState() {
	const loadingId = ref<string | null>(null);

	function isLoading(id: string) {
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
		isLoading,
		withLoading,
	};
}
