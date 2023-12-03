<template>
  <div
    class="search-contact"
    :class="[`search-contact--${props.size}`]"
  >
    <div class="search-contact__header">
      <wt-search-bar
        v-if="isSearchNotByVariables"
        :value="search"
        :v="v$.search"
        :placeholder="t('infoSec.contacts.placeholder')"
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
    </div>

    <div class="search-contact__options">
      <wt-radio
        v-for="({ mode, label }) of SearchOptions"
        :key="mode"
        :label="t(label)"
        :value="mode"
        :selected="searchMode"
        @input="changeSearchMode"
      ></wt-radio>
    </div>

    <wt-loader v-show="isLoading"></wt-loader>
    <wt-dummy
      v-if="!isLoading && !contactsBySearch.length"
      :src="dummy.src"
      :text="dummy.text"
    ></wt-dummy>
    <contacts-list-wrapper
      v-if="!isLoading && contactsBySearch.length"
      :list="contactsBySearch"
      @link="linkContact"
    ></contacts-list-wrapper>

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
import { computed, ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import { required, requiredIf } from '@vuelidate/validators';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import SearchOptions from '../../enums/SearchOptions.enum';
import ContactsListWrapper from '../utils/contacts-list-wrapper.vue';
import dummyPic from '../../../../../../../../../app/assets/contacts/dummyPic.svg';
import dummyPicAfterSearch from '../../../../../../../../../app/assets/contacts/dummyPicAfterSearch.svg';

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

const searchMode = ref(SearchOptions[0].mode);
const isLoading = ref(false);
const dummy = ref({});

const isSearchNotByVariables = computed(() => searchMode.value !== 'variables');
const contactsBySearch = computed(() => getNamespacedState(store.state, props.namespace).contactsBySearch);
const searchValue = computed(() => {
  if (isSearchNotByVariables.value) return search.value;
  return `${keyVariable.value}=${valueVariables.value}`;
});

const v$ = useVuelidate(computed(() => ({
  search: { required: requiredIf(() => isSearchNotByVariables.value) },
  keyVariable: { required: requiredIf(() => !isSearchNotByVariables.value) },
  valueVariables: { required: requiredIf(() => !isSearchNotByVariables.value) },
})), { search, keyVariable, valueVariables }, { $autoDirty: true });

v$.value.$touch();

async function callSearch() {
  try {
    isLoading.value = true;
    await store.dispatch(`${props.namespace}/SEARCH_CONTACTS`, {
      q: searchValue.value,
      qin: searchMode.value,
      size: 5000,
    });
    if (!contactsBySearch.value.length) {
      return dummy.value = {
        src: dummyPicAfterSearch,
        text: t('infoSec.contacts.emptyContact'),
      };
    } else return dummy.value = {
      src: dummyPic,
    };
  } finally {
    isLoading.value = false;
  }
}

async function changeSearchMode(event) {
  await store.dispatch(`${props.namespace}/DELETE_CONTACTS_BY_SEARCH`);
  searchMode.value = event;
  search.value = '';
  keyVariable.value = '';
  valueVariables.value = '';
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
    dummy.value = {
      src: dummyPic,
    };
    changeSearchMode(searchMode.value);
  }
});

onMounted(() => dummy.value = {
  src: dummyPic,
});
</script>

<style lang="scss" scoped>
.search-contact {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);

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

  &__options {
    display: flex;
    gap: var(--spacing-xs);
  }

  &__variables {
    display: flex;
    gap: var(--spacing-xs);
    justify-content: space-between;
  }

  &__actions {
    display: flex;
    gap: var(--spacing-xs);
    flex: 0 0 auto;

    .wt-button {
      width: 100%;
    }
  }

  &--sm {
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
