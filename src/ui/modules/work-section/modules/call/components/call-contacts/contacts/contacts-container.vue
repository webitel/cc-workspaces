<template>
  <lookup-item-container
    :empty="!dataList.length"
    :loading="isLoading"
    :search="dataSearch"
    @more="handleIntersect"
    @search:input="dataSearch = $event"
    @search:change="resetData"
  >

    <template v-slot:search="{ search, inputHandler, searchHandler }">
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

    <template v-slot:empty>
      <empty-search type="contacts" />
    </template>

    <template v-slot:content>
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
import ContactLookupItem from './contact-lookup-item.vue';
import EmptySearch from '../../../../_shared/components/workspace-empty-search/components/empty-search.vue';

export default {
  name: 'contacts-container',
  mixins: [infiniteScrollMixin, sizeMixin],
  components: {
    ContactLookupItem,
    EmptySearch,
    LookupItemContainer,
  },

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
          value: SearchMode.LABELS,
          text: this.$t('vocabulary.labels', 1),
        },
        {
          value: SearchMode.ABOUT,
          text: this.$t('vocabulary.description'),
        },
        {
          value: SearchMode.VARIABLES,
          text: this.$t('infoSec.contacts.attributes', 1),
        },
        {
          value: SearchMode.DESTINATION,
          text: this.$t('infoSec.contacts.destination'),
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
      this.filterQuery = value === SearchMode.DESTINATION ? 'emails,phones' : value;
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
