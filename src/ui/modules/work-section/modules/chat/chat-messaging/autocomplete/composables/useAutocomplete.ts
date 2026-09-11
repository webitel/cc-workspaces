import { computed, type Ref, ref } from 'vue';
import type { ChatHelperItem } from '../../types/ChatHelperItem.types';

export function useAutocomplete(options: Ref<ChatHelperItem[]> = ref([])) {
	const isOpenAutocomplete = ref(false);
	const search = ref('');
	let triggerIndex = -1;

	const autocompleteList = computed(() => {
		return options.value.filter((option) => option.name.includes(search.value));
	});

	function open() {
		isOpenAutocomplete.value = true;
	}

	function close() {
		isOpenAutocomplete.value = false;
		triggerIndex = -1;
	}

	function onInput(value: string) {
		if (triggerIndex === -1 || value[triggerIndex] !== '/') {
			close();
			return;
		}
		const tail = value.slice(triggerIndex + 1);
		if (/\s/.test(tail)) {
			close();
			return;
		}
		search.value = tail;
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.key !== '/') return;

		const target = event.target as HTMLTextAreaElement;
		const cursorIndex = target?.selectionStart ?? 0;
		const precedingChar = target?.value?.[cursorIndex - 1];
		if (cursorIndex !== 0 && precedingChar !== ' ') return;

		triggerIndex = cursorIndex;
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
		onKeyDown,
		onBlur,
	};
}
