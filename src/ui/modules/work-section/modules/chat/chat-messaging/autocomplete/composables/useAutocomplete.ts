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
		search.value = '';
	}

	function onInput(value: string) {
		const isCommand = value[0] === '/';
		search.value = isCommand ? value.slice(1) : '';

		isCommand && autocompleteList.value.length > 0 ? open() : close();
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
		onBlur,
	};
}
