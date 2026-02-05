<template>
  <lookup-item-container
    :empty="!dataList.length"
    :loading="isLoading"
    :search="dataSearch"
    @more="handleIntersect"
    @search:input="dataSearch = $event"
    @search:change="resetData"
  >

    <template #search="{ search, inputHandler, searchHandler }">
      <wt-search-bar
        :size="size"
        :value="search"
        debounce
        :search-mode="filterQuery"
        :search-mode-options="searchModeOptions"
        @input="inputHandler"
        @search="searchHandler"
        @change:search-mode="changeMode"
      />
    </template>

    <template #empty>
      <empty-search type="contacts" />
    </template>

    <template #content>
      <contact-lookup-item
        v-for="(item) in dataList"
        :key="item.id"
        :item="item"
        :size="size"
        @call="makeCall"
      />
    </template>
  </lookup-item-container>
</template>

<script setup>
import { EngineSystemSettingName } from '@webitel/api-services/gen';
import { configurations } from '@webitel/ui-sdk/api/clients';
import { SpecialGlobalAction } from '@webitel/ui-sdk/modules/Userinfo';
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import contactsAPI from '../../../../../../../../app/api/agent-workspace/endpoints/contacts/ContactsAPI';
import SearchMode from '../../../../../../../../app/api/agent-workspace/endpoints/contacts/enums/SearchMode.enum';
import useInfiniteScroll from '../../../../../../../../app/composables/useInfiniteScroll';
import { useUserinfoStore } from '../../../../../../userinfo/userinfoStore.js';
import LookupItemContainer from '../../../../_shared/components/lookup-item-container/lookup-item-container.vue';
import EmptySearch from '../../../../_shared/components/workspace-empty-search/components/empty-search.vue';
import ContactLookupItem from './contact-lookup-item.vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
  },
});

const { t } = useI18n();
const store = useStore();
const userinfoStore = useUserinfoStore();

const filterQuery = ref(SearchMode.NAME);
const contactsLabelsConfiguration = ref([]);

const isLimitContactsGranted = computed(() =>
  userinfoStore.hasSpecialGlobalActionAccess(
    SpecialGlobalAction.LimitWorkspaceContacts,
  ),
);

const searchModeOptions = computed(() => [
  {
    value: SearchMode.NAME,
    text: t('reusable.name'),
  },
  {
    value: SearchMode.PHONES,
    text: t('contacts.phones', 2),
  },
  {
    value: SearchMode.EMAILS,
    text: t('contacts.emails', 2),
  },
]);

const checkLabelsToLimitContacts = async () => {
  const { items } = await configurations.getList({
    name: EngineSystemSettingName.LabelsToLimitContacts,
  });

  if (items.length) {
    contactsLabelsConfiguration.value = items[0].value;
  }
};

const fetchFn = async (params) => {
  const defaultParams = {
    ...params,
    qin: filterQuery.value,
  };

  if (isLimitContactsGranted.value) {
    await checkLabelsToLimitContacts();
    return await contactsAPI.getList({
      ...defaultParams,
      label: contactsLabelsConfiguration.value,
    });
  }
  return await contactsAPI.getList({
    ...defaultParams
  });
};

const makeCall = (item) => {
  store.dispatch('features/call/CALL', item);
};

const changeMode = ({ value }) => {
  filterQuery.value = value;
  resetData();
};

const {
  dataList,
  isLoading,
  dataSearch,
  handleIntersect,
  resetData,
} = useInfiniteScroll({
  fetchFn,
  size: 20,
});
</script>

<style lang="scss" scoped>

</style>
