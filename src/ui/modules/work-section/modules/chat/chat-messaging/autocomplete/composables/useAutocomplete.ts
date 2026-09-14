import { computed, type Ref, ref } from 'vue';
import type { ChatHelperItem } from '../../types/ChatHelperItem.types';

export function useAutocomplete(options: Ref<ChatHelperItem[]> = ref([])) {
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
		const tail = value[0] === '/' ? value.slice(1) : null;
		if (tail === null || /\s/.test(tail)) {
			close();
			return;
		}
		search.value = tail;
		open();
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
