import { computed, ref } from 'vue';

export function useAutocomplete(options = []) {
	const isOpenAutocomplete = ref(false);
	const search = ref('');

	const autocompleteList = computed(() => {
		return options.value.filter((option) => option.name.includes(search.value));
	});

	function open() {
		isOpenAutocomplete.value = true;
	}

	function close() {
		isOpenAutocomplete.value = false;
	}

	function onInput(value: string) {
		const idx = value.lastIndexOf('/');
		if (idx !== -1) {
			search.value = value.slice(idx + 1);
			open();
		} else {
			close();
		}
	}

	function onKeyDown(event: KeyboardEvent) {
		return event.key === '/' && open();
	}

	function onBlur() {
		setTimeout(() => close(), 100);
	}

	return {
		isOpenAutocomplete,
		search,
		autocompleteList,

		open,
		close,
		onInput,
		onKeyDown,
		onBlur,
	};
}
