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
      ></wt-search-bar>
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
        @call="call"
      ></contact-lookup-item>
    </template>
  </lookup-item-container>
</template>

<script>
import { configurations } from '@webitel/ui-sdk/src/api/clients/index';
import { mapActions } from 'vuex';

import contactsAPI from '../../../../../../../../app/api/agent-workspace/endpoints/contacts/ContactsAPI';
import SearchMode from '../../../../../../../../app/api/agent-workspace/endpoints/contacts/enums/SearchMode.enum';
import infiniteScrollMixin from '../../../../../../../../app/mixins/infiniteScrollMixin';
import sizeMixin from '../../../../../../../../app/mixins/sizeMixin';
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
    call({ number }) {
      this.makeCall({ number });
    },
    async checkLabelsToLimitContacts() {
      const { items } = await configurations.getList({
        //TODO: remove after migration to new EngineSystemSettingName enum
        name: 'labels_to_limit_contacts',
      });

      if (items.length) {
        this.contactsLabelsConfiguration = items[0].value;
      }
    },
    changeMode({ value }) {
      this.filterQuery = value;
      this.resetData();
    },
    async fetch(params) {
      await this.checkLabelsToLimitContacts();
      return await contactsAPI.getList({ ...params, qin: this.filterQuery, label: this.contactsLabelsConfiguration });
    },
  }
};
</script>

<style lang="scss" scoped>

</style>
