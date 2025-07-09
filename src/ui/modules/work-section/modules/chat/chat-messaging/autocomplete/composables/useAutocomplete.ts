import { ref, computed } from 'vue';

export function useAutocomplete(options = []) {
  const isOpenAutocomplete = ref(false);
  const search = ref('');

  const autocompleteList = computed(() => {
    return options.value.filter(option => option.name.includes(search.value));
  });

  function open() {
    isOpenAutocomplete.value = true;
  }

  function close() {
    isOpenAutocomplete.value = false;
  }

  function setSearch(value: string) {
    search.value = value;
  }

  function onInput(value: string) {
    const idx = value.lastIndexOf('/');
    if (idx !== -1) {
      open();
      setSearch(value.slice(idx + 1));
    } else {
      close();
    }
  }

  function onKeyDown(event: KeyboardEvent) {
    return event.key === '/' && open();
  }

  return {
    isOpenAutocomplete,
    search,
    autocompleteList,

    open,
    close,
    onInput,
    onKeyDown,
  };
}
