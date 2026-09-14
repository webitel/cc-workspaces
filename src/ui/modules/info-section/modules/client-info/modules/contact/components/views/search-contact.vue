<template>
  <div
    class="search-contact"
    :class="[`search-contact--${props.size}`]"
  >
    <header class="search-contact__header">
      <wt-search-bar
        v-if="isSearchNotByVariables"
        :value="search"
        :placeholder="t('infoSec.contacts.searchPlaceholder')"
        @input="search = $event"
      >
      </wt-search-bar>
      <div
        v-else
        class="search-contact__variables"
      >
        <wt-input-text
          v-model:model-value="keyVariable"
          :v="v$.keyVariable"
          :placeholder="t('vocabulary.keys',1)"
        />
        <wt-input-text
          v-model:model-value="valueVariables"
          :v="v$.valueVariables"
          :placeholder="t('vocabulary.values',1)"
        />
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

    <div class="search-contact__content wt-scrollbar">
        <wt-loader v-if="isLoading"/>
        <wt-empty
          v-else-if="showEmpty"
          :image="emptyImage"
          :text="emptyText"
        />
        <contacts-list-wrapper
          v-else-if="contactsBySearch.length"
          :size="props.size"
          :list="contactsBySearch"
          @link="linkContactId"
        />
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

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { requiredIf } from '@vuelidate/validators';
import type { WebitelContactsContact } from '@webitel/api-services/gen/models';
import { WtEmpty } from '@webitel/ui-sdk/components';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty';
import { storeToRefs } from 'pinia';
import { computed, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import dummyPicAfterSearchDark from '../../../../../../../../../app/assets/contacts/dummyPicAfterSearchDark.svg';
import dummyPicAfterSearchLight from '../../../../../../../../../app/assets/contacts/dummyPicAfterSearchLight.svg';
import dummyPicDark from '../../../../../../../../../app/assets/contacts/dummyPicDark.svg';
import dummyPicLight from '../../../../../../../../../app/assets/contacts/dummyPicLight.svg';
import { useContactStore } from '../../store/contact';
import ContactsListWrapper from '../utils/contacts-list-wrapper.vue';

const SearchOptions = [
	{
		label: 'reusable.name',
		mode: 'name',
	},
	{
		label: 'infoSec.contacts.destination',
		mode: 'emails,phones',
	},
	{
		label: 'infoSec.contacts.attributes',
		mode: 'variables',
	},
] as const;

const props = withDefaults(
	defineProps<{
		size?: ComponentSize;
	}>(),
	{
		size: ComponentSize.MD,
	},
);

const emit = defineEmits<{
	close: [];
	add: [];
}>();

const store = useStore();
const contactStore = useContactStore();
const { isLoading, contactsBySearch } = storeToRefs(contactStore);
const { searchContacts, cleanContactsBySearch, linkContact } = contactStore;
const { t } = useI18n();

const search = ref('');
const keyVariable = ref('');
const valueVariables = ref('');

const alreadySearched = ref(false);
const searchMode = ref<string>(SearchOptions[0].mode);

const isSearchNotByVariables = computed(() => searchMode.value !== 'variables');

const searchValue = computed(() => {
	if (isSearchNotByVariables.value) return search.value;
	return `${keyVariable.value}=${valueVariables.value}`;
});

const {
	showEmpty,
	image: emptyImage,
	text: emptyText,
} = useTableEmpty(
	{
		dataList: contactsBySearch,
		isLoading,
		// searching is treated as a "filters applied" state: before the first
		// search there's nothing to filter, so the plain empty picture is shown
		filters: computed(() =>
			alreadySearched.value
				? {
						search: true,
					}
				: undefined,
		),
	},
	computed(() => ({
		image: {
			empty: {
				dark: dummyPicDark,
				light: dummyPicLight,
			},
			filters: {
				dark: dummyPicAfterSearchDark,
				light: dummyPicAfterSearchLight,
			},
		},
		text: {
			empty: '',
			filters: t('infoSec.contacts.emptyContact'),
		},
	})),
);

const checkForStar = (value: string) => value !== '*';

const v$ = useVuelidate(
	computed(() => ({
		keyVariable: {
			required: requiredIf(() => !isSearchNotByVariables.value),
			checkForStar,
		},
		valueVariables: {
			required: requiredIf(() => !isSearchNotByVariables.value),
			checkForStar,
		},
	})),
	{
		search,
		keyVariable,
		valueVariables,
	},
	{
		$autoDirty: true,
	},
);

v$.value.$touch();

async function callSearch() {
	await searchContacts({
		q: searchValue.value,
		qin: searchMode.value,
		size: 100, // coz 100 should be enough, if we dont have pagination atm https://webitel.atlassian.net/browse/WTEL-7906
	});
	alreadySearched.value = true;
}

function cleanSearchValue() {
	search.value = '';
	keyVariable.value = '';
	valueVariables.value = '';
}

function changeSearchMode(event?: string) {
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

async function linkContactId(contact: WebitelContactsContact) {
	await linkContact(contact);
	await store.dispatch('features/chat/closed/processed/LOAD_PROCESSED_CHATS');
	close();
}

watch(
	[
		() => search.value,
		() => keyVariable.value,
		() => valueVariables.value,
	],
	() => {
		if (!search.value && !keyVariable.value && !valueVariables.value) {
			alreadySearched.value = false;
			changeSearchMode(searchMode.value);
		}
	},
);

onUnmounted(() => {
	cleanContactsBySearch();
	cleanSearchValue();
});
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

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

    .wt-empty {
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
