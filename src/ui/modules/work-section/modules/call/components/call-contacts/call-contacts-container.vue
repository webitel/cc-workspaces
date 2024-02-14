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
        <expansion-panel v-for="(item) of dataList" :key="item.id">
          <template v-slot:header>
            <contact-lookup-item
              :item="item"
              :size="size"
              @input="makeCall({ user: $event })"
            ></contact-lookup-item>
          </template>
          <template v-slot:content>
            <div
              v-if="item?.phones?.data.length > 1"
              class="contact-communications-list"
            >
              <div
                v-for="phonesList in item?.phones?.data"
                :key="phonesList.id"
                class="contact-communications-item"
              >
                <div class="contact-communications-item__before">
                  <wt-icon
                    :icon="phonesList.primary ? 'chat-message-status-sent' : ''"
                    :size="size"
                    color="success"
                  />
                </div>
                <div class="contact-communications-item__main">
                  <span class="contact-communications-item__title">{{ phonesList.number }}</span>
                </div>
                <div class="contact-communications-item__after">
                  <button
                    class="contact-communications-item__call"
                    @click="makeCall({ user: item, number: phonesList.number })"
                  >
                    <wt-icon
                      :size="size"
                      color="success"
                      icon="call--filled"
                    />
                  </button>
                </div>
              </div>
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
import APIRepository from '../../../../../../../app/api/APIRepository';
import ExpansionPanel from '../expansion-panel.vue';

const contactsAPI = APIRepository.contacts;

export default {
  name: 'call-contacts-container',
  mixins: [infiniteScrollMixin, sizeMixin],
  components: {
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
           text: this.$t('contacts.attributes', 1),
        },
        {
          value: SearchMode.DESTINATION,
           text: this.$t('contacts.destination'),
        },
      ];
    },
  },

  methods: {
    ...mapActions('features/call', {
      makeCall: 'CALL',
    }),
    changeMode({ value }) {
      this.filterQuery = value;
      this.resetData();
    },

    fetch(params) {
      return contactsAPI.getList(params);
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

.contact-communications-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-xs);
  transition: var(--transition);
  border: 1px solid transparent;
  border-radius: var(--spacing-xs);
  gap: 8px;

  &:hover {
    border-color: var(--primary-color);

    .contact-communications-item__call {
      display: flex;
    }
  }
}

.contact-communications-item__before {
  display: flex;
  min-width: 16px;
}

.contact-communications-item__main {
  flex-grow: 1;
  line-height: 1;
}

.contact-communications-item__title {
  @extend %typo-body-2;
  overflow-wrap: anywhere;
}

.contact-communications-item__call {
  display: none;
}
</style>
