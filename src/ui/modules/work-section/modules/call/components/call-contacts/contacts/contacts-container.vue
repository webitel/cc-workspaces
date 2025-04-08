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
    changeMode({ value }) {
      this.filterQuery = value;
      this.resetData();
    },
    fetch(params) {
      return contactsAPI.getList({ ...params, qin: this.filterQuery });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
