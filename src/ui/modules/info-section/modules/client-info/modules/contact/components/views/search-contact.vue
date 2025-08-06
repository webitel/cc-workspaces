<template>
  <div
    class="search-contact"
    :class="[`search-contact--${props.size}`]"
  >
    <header class="search-contact__header">
      <wt-search-bar
        v-if="isSearchNotByVariables"
        :value="search"
        :v="v$.search"
        :placeholder="t('infoSec.contacts.searchPlaceholder')"
        @input="search = $event"
      >
      </wt-search-bar>
      <div
        v-else
        class="search-contact__variables"
      >
        <wt-input
          v-model="keyVariable"
          :v="v$.keyVariable"
          :placeholder="t('vocabulary.keys',1)"
        ></wt-input>
        <wt-input
          v-model="valueVariables"
          :v="v$.valueVariables"
          :placeholder="t('vocabulary.values',1)"
        ></wt-input>
      </div>

      <wt-button
        :disabled="v$.$invalid"
        @click="callSearch"
      >
        {{ t('webitelUI.searchBar.placeholder') }}
      </wt-button>
    </header>

    <div class="search-contact__options">
      <wt-radio
        v-for="({ mode, label }) of SearchOptions"
        :key="mode"
        :label="t(label)"
        :value="mode"
        :selected="searchMode"
        @update:selected="changeSearchMode"
      ></wt-radio>
    </div>

    <div class="search-contact__content">
      <wt-loader v-show="isLoading"></wt-loader>
      <wt-dummy
        v-if="!isLoading && !contactsBySearch.length"
        :src="dummy.src"
        :text="dummy.text"
      ></wt-dummy>
      <contacts-list-wrapper
        v-if="!isLoading && contactsBySearch.length"
        :size="props.size"
        :list="contactsBySearch"
        @link="linkContact"
      ></contacts-list-wrapper>
    </div>
    <div class="search-contact__actions">
      <wt-button
        color="secondary"
        @click="close"
      >{{ t('reusable.back') }}
      </wt-button>
      <wt-button
        @click="add"
      >{{ t('reusable.add') }}
      </wt-button>
    </div>
  </div>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required, requiredIf } from '@vuelidate/validators';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import { computed, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import dummyPicAfterSearchDark from '../../../../../../../../../app/assets/contacts/dummyPicAfterSearchDark.svg';
import dummyPicAfterSearchLight from '../../../../../../../../../app/assets/contacts/dummyPicAfterSearchLight.svg';
import dummyPicDark from '../../../../../../../../../app/assets/contacts/dummyPicDark.svg';
import dummyPicLight from '../../../../../../../../../app/assets/contacts/dummyPicLight.svg';
import SearchOptions from '../../enums/SearchOptions.enum';
import ContactsListWrapper from '../utils/contacts-list-wrapper.vue';

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
  'close', 'add',
]);

const store = useStore();
const { t } = useI18n();

const search = ref('');
const keyVariable = ref('');
const valueVariables = ref('');

const alreadySearched = ref(false);
const searchMode = ref(SearchOptions[0].mode);

const isLoading = computed(() => getNamespacedState(store.state, props.namespace).isLoading);
const contactsBySearch = computed(() => getNamespacedState(store.state, props.namespace).contactsBySearch);
const isSearchNotByVariables = computed(() => searchMode.value !== 'variables');
const darkMode = computed(() => store.getters['ui/appearance/DARK_MODE']);

const searchValue = computed(() => {
  if (isSearchNotByVariables.value) return search.value;
  return `${keyVariable.value}=${valueVariables.value}`;
});

const dummy = computed(() => {
  if (alreadySearched.value) {
    return {
      src: darkMode.value ? dummyPicAfterSearchDark : dummyPicAfterSearchLight,
      text: t('infoSec.contacts.emptyContact'),
    };
  }
  return {
    src: darkMode.value ? dummyPicDark : dummyPicLight,
  };
});

const checkForStar = (value) => value !== '*';

const v$ = useVuelidate(computed(() => ({
  search: { required: requiredIf(() => isSearchNotByVariables.value), checkForStar },
  keyVariable: { required: requiredIf(() => !isSearchNotByVariables.value), checkForStar },
  valueVariables: { required: requiredIf(() => !isSearchNotByVariables.value), checkForStar },
})), { search, keyVariable, valueVariables }, { $autoDirty: true });

v$.value.$touch();

async function callSearch() {
  await store.dispatch(`${props.namespace}/SEARCH_CONTACTS`, {
    q: searchValue.value,
    qin: searchMode.value,
    size: 5000,
  });
  alreadySearched.value = true;
}

async function cleanContactsBySearch() {
  await store.dispatch(`${props.namespace}/CLEAN_CONTACTS_BY_SEARCH`);
}

function cleanSearchValue() {
  search.value = '';
  keyVariable.value = '';
  valueVariables.value = '';
}

function changeSearchMode(event) {
  cleanContactsBySearch();
  cleanSearchValue();
  searchMode.value = event;
  alreadySearched.value = false;
}

function close() {
  changeSearchMode();
  emit('close');
}

function add() {
  emit('add');
}

async function linkContact(contact) {
  await store.dispatch(`${props.namespace}/LINK_CONTACT`, contact);
  close();
}

watch([() => search.value, () => keyVariable.value, () => valueVariables.value], () => {
  if (!search.value && !keyVariable.value && !valueVariables.value) {
    alreadySearched.value = false;
    changeSearchMode(searchMode.value);
  }
});

onUnmounted(() => {
  cleanContactsBySearch();
  cleanSearchValue();
});
</script>

<style lang="scss" scoped>
.search-contact {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: var(--spacing-xs);
  gap: var(--spacing-xs);

  &__header {
    display: flex;
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-xs);

    .wt-search-bar {
      width: 100%;
    }

    .wt-button {
      height: min-content;
    }
  }

  &__content {
    display: flex;
    overflow: auto;
    flex: 1;
    flex-direction: column;
    @extend %wt-scrollbar;

    .wt-dummy {
      flex: 1;
    }
  }

  &__options {
    display: flex;
    gap: var(--spacing-xs);
  }

  &__variables {
    display: flex;
    flex-grow: 1;
    gap: var(--spacing-xs);

    .wt-input {
      width: 100%;
    }
  }

  &__actions {
    //position: absolute;
    //bottom: 0;
    //left: 0;
    width: 100%;
    display: flex;
    gap: var(--spacing-xs);
    flex: 0 0 auto;

    .wt-button {
      width: 100%;
    }
  }

  &--sm {
    display: block;

    .search-contact__header,
    .search-contact__actions,
    .search-contact__variables {
      flex-direction: column;
    }

    .search-contact__options {
      display: block;
    }
  }
}
</style>
