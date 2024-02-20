<template>
  <div class="ws-worksection">
    <form
      class="filter-search"
      @submit.prevent
    >
      <wt-search-bar
        v-model="dataSearch"
        debounce
        @search="resetData"
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
    </form>

    <section ref="scroll-wrap" class="ws-worksection__list">

      <wt-loader v-if="isLoading" />
      <empty-search v-else-if="!dataList.length" :type="'contacts'"></empty-search>
      <div v-else class="ws-worksection__list-wrap">
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
            <div
              v-if="item?.phones?.data.length > 1"
              class="contact-communications-list"
            >
              <contact-communication-item
                  v-for="phonesList in item?.phones?.data"
                  :key="phonesList.id"
                  :phonesList="phonesList"
                  :item="item"
                  :size="size"
              />
            </div>
          </template>
        </expansion-panel>

      </div>

      <observer
        :options="obsOptions"
        @intersect="handleIntersect"
      />
    </section>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import SearchMode from '../../../../../../../app/api/agent-workspace/endpoints/contacts/enums/SearchMode.enum';
import infiniteScrollMixin from '../../../../../../../app/mixins/infiniteScrollMixin';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import ContactLookupItem from '../../../_shared/components/lookup-item/contact-lookup-item.vue';
import EmptySearch from '../../../_shared/components/workspace-empty-search/components/empty-search.vue';
import contactsAPI from '../../../../../../../app/api/agent-workspace/endpoints/contacts/ContactsAPI';
import ExpansionPanel from '../expansion-panel.vue';
import ContactCommunicationItem from './contact-communication-item.vue';

export default {
  name: 'call-contacts-container',
  mixins: [infiniteScrollMixin, sizeMixin],
  components: {
    ContactCommunicationItem,
    ContactLookupItem,
    EmptySearch,
    ExpansionPanel,
  },

  data: () => ({
    dataList: [],
    dataSort: 'name',
    dataFields: [
      'name',
      'id',
      'about',
      'labels',
      'emails',
      'phones',
      'managers',
      'mode',
      'timezones',
      'variables',
      'imclients',
    ],
    SearchMode: {
      NAME: 'name',
      LABELS: 'labels',
      ABOUT: 'about',
      VARIABLES: 'variables',
      DESTINATION: 'destination',
    },
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
.contact-communications-list {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-xs) 0;
  gap: var(--spacing-xs);
}
</style>
