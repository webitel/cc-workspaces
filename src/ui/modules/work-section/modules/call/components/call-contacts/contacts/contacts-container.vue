<template>
  <lookup-item-container
    :search="dataSearch"
    :loading="isLoading"
    :empty="!dataList.length"
    @search:input="dataSearch = $event"
    @search:change="resetData"
    @more="handleIntersect">

    <template v-slot:search="{ search, inputHandler, searchHandler }">
      <wt-search-bar
        :value="search"
        :size="size"
        debounce
        @input="inputHandler"
        @search="searchHandler"
      >
        <template #additional-actions="options">
          <wt-context-menu
            :options="searchModeOptions"
            @click="changeMode($event.option)"
          >
            <template #activator>
              <wt-tooltip>
                <template #activator>
                  <wt-icon-btn
                    :color="options.invalid ? 'error' : 'default'"
                    icon="filter"
                  />
                </template>
                {{ $t('webitelUI.searchBar.settingsHint') }}
              </wt-tooltip>
            </template>
            <template #option="{ value, text }">
              <wt-radio
                :label="text"
                :selected="filterQuery === value"
                :value="true"
              />
            </template>
          </wt-context-menu>
        </template>
      </wt-search-bar>
    </template>

    <template v-slot:empty>
      <empty-search type="contacts" />
    </template>

    <template v-slot:content>
      <expansion-panel
        v-for="(item, index) in dataList"
        :key="item.id"
        :is-expanded="item.isExpanded"
      >
        <template v-slot:header>
          <contact-lookup-item
            :item="item"
            :size="size"
            @input="call(item)"
            @toggleExpansion="toggleExpansion(index)"
          ></contact-lookup-item>
        </template>
        <template v-slot:content>
          here go phones
          {{ item }}
<!--          <div-->
<!--            v-if="item?.phones?.length > 1"-->
<!--            class="contact-communications-list"-->
<!--          >-->
<!--            <contact-communication-item-->
<!--              v-for="phonesList in item?.phones"-->
<!--              :key="phonesList.id"-->
<!--              :phonesList="phonesList"-->
<!--              :item="item"-->
<!--              :size="size"-->
<!--            />-->
<!--          </div>-->
        </template>
      </expansion-panel>
    </template>
  </lookup-item-container>
</template>

<script>
import { mapActions } from 'vuex';
import SearchMode from '../../../../../../../../app/api/agent-workspace/endpoints/contacts/enums/SearchMode.enum';
import infiniteScrollMixin from '../../../../../../../../app/mixins/infiniteScrollMixin';
import sizeMixin from '../../../../../../../../app/mixins/sizeMixin';
import ContactLookupItem from '../../../../_shared/components/lookup-item/contact-lookup-item.vue';
import EmptySearch from '../../../../_shared/components/workspace-empty-search/components/empty-search.vue';
import contactsAPI from '../../../../../../../../app/api/agent-workspace/endpoints/contacts/ContactsAPI';
import ExpansionPanel from '../../expansion-panel.vue';
import ContactCommunicationItem from './contact-communication-item.vue';
import LookupItemContainer from '../../../../_shared/components/lookup-item-container/lookup-item-container.vue';

export default {
  name: 'call-contacts-container',
  mixins: [infiniteScrollMixin, sizeMixin],
  components: {
    ContactCommunicationItem,
    ContactLookupItem,
    EmptySearch,
    ExpansionPanel,
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
    call(contact) {
      throw new Error('fixme: implement call method for contact');
      // this.makeCall({ number: contact.extension });
    },
    changeMode({ value }) {
      this.filterQuery = value;
      this.resetData();
    },
    toggleExpansion(index) {
      this.dataList = this.dataList.map((item, i) => {
        if (i === index) {
          return { ...item, isExpanded: !item.isExpanded };
        }
        return item;
      });
    },
    fetch(params) {
      return contactsAPI.getList({ ...params, qin: this.filterQuery });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
