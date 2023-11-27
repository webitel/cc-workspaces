<script setup>
import { computed, ref } from 'vue';
import ContactsListWrapper from './contacts-list-wrapper.vue';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'md',
  },
});

const emit = defineEmits([
  'close',
]);

const searchOptions = Object.freeze([
  {
    label: '', // use i18n
    mode: 'name',
  }, {
    label: '', // use i18n
    mode: 'destination',
  }, {
    label: '', // use i18n
    mode: 'variable',
  },
]);

const search = ref('');
const searchMode = ref(searchOptions[0]);
const isLoading = ref(false);

async function callSearch() {
  isLoading.value = true;
  // dispatch search action
}

const contactsBySearch = computed(() => {
  // return contacts from store
  return [];
});

function close() {
  emit('close');
}

function linkContact(contact) {
  // dispatch link action
  close();
}
</script>

<template>
  <wt-search-bar
    :value="search"
    @input="search = $event"
  ></wt-search-bar>
  <wt-radio
    v-for="({ mode, label }) of searchOptions"
    :key="mode"
    :label="label"
    :value="mode"
    :selected="searchMode"
    @input="searchMode = $event"
  ></wt-radio>
  <wt-button
    @click="callSearch"
  >
    Search
  </wt-button>
  <contacts-list-wrapper
    :list="contactsBySearch"
    @link="linkContact"
  ></contacts-list-wrapper>
  <wt-button
    @click="close"
  >Close
  </wt-button>
</template>

<style scoped lang="scss">

</style>
