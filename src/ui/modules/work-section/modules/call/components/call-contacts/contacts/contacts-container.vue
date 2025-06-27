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

<script>
import { EngineSystemSettingName } from '@webitel/api-services/gen';
import { configurations } from '@webitel/ui-sdk/src/api/clients/index';
import { SpecialGlobalAction } from '@webitel/ui-sdk/src/modules/Userinfo/v2/enums/index';
import { computed } from 'vue';
import { mapActions } from 'vuex';

import contactsAPI from '../../../../../../../../app/api/agent-workspace/endpoints/contacts/ContactsAPI';
import SearchMode from '../../../../../../../../app/api/agent-workspace/endpoints/contacts/enums/SearchMode.enum';
import infiniteScrollMixin from '../../../../../../../../app/mixins/infiniteScrollMixin';
import sizeMixin from '../../../../../../../../app/mixins/sizeMixin';
import { useUserinfoStore } from '../../../../../../userinfo/userinfoStore.js';
import LookupItemContainer from '../../../../_shared/components/lookup-item-container/lookup-item-container.vue';
import EmptySearch from '../../../../_shared/components/workspace-empty-search/components/empty-search.vue';
import ContactLookupItem from './contact-lookup-item.vue';

export default {
  name: 'ContactsContainer',
  components: {
    ContactLookupItem,
    EmptySearch,
    LookupItemContainer,
  },
  mixins: [infiniteScrollMixin, sizeMixin],

  setup() {
    const userinfoStore = useUserinfoStore();
    const isLimitContactsGranted = computed(() =>
      userinfoStore.hasSpecialGlobalActionAccess(
        SpecialGlobalAction.LimitWorkspaceContacts,
      ),
    );

    return {
      isLimitContactsGranted,
    };
  },

  data: () => ({
    dataList: [],
    SearchMode,
    filterQuery: SearchMode.NAME,
    contactsLabelsConfiguration: [],
  }),

  computed: {
    searchModeOptions() {
      return [
        {
          value: SearchMode.NAME,
          text: this.$t('reusable.name'),
        },
        {
          value: SearchMode.PHONES,
          text: this.$t('contacts.phones', 2),
        },
        {
          value: SearchMode.EMAILS,
          text: this.$t('contacts.emails', 2),
        },
      ];
    },
  },

  methods: {
    ...mapActions('features/call', {
      makeCall: 'CALL',
    }),
    async checkLabelsToLimitContacts() {
      const { items } = await configurations.getList({
        name: EngineSystemSettingName.labels_to_limit_contacts,
      });

      if (items.length) {
        this.contactsLabelsConfiguration = items[0].value;
      }
    },

    async fetch(params) {
      const defaultParams = {
        ...params,
        qin: this.filterQuery,
      };

      if (this.isLimitContactsGranted) {
        await this.checkLabelsToLimitContacts();
        return await contactsAPI.getList({
          ...defaultParams,
          label: this.contactsLabelsConfiguration,
        });
      }
      return await contactsAPI.getList({
        ...defaultParams
      });
    },

    changeMode({ value }) {
      this.filterQuery = value;
      this.resetData();
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
