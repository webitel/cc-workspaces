<template>
  <div class="call-transfer-container">
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
          :value="search"
          @input="inputHandler"
          @search="searchHandler"
        ></wt-search-bar>
        <wt-button
          color="transfer"
          :disabled="isTransferToNumberDisabled"
          @click="transfer"
        >{{ $t('transfer.transfer') }}
        </wt-button>
      </template>

      <template v-slot:empty>
        <empty-search type="contacts" />
      </template>

      <template v-slot:content>
        <transfer-lookup-item
          v-for="(item, key) of dataList"
          :id="`scroll-item-${key}`"
          :key="`${item.id}${key}`"
          :item="item"
          :size="size"
          @input="transfer"
        ></transfer-lookup-item>
      </template>
    </lookup-item-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import infiniteScrollMixin from '../../../../../../../app/mixins/infiniteScrollMixin';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import LookupItemContainer from '../../../_shared/components/lookup-item-container/lookup-item-container.vue';
import TransferLookupItem from '../../../_shared/components/lookup-item/transfer-lookup-item.vue';
import EmptySearch from '../../../_shared/components/workspace-empty-search/components/empty-search.vue';
import APIRepository from '../../../../../../../app/api/APIRepository';

const usersAPI = APIRepository.users;

export default {
  name: 'call-transfer-container',
  mixins: [infiniteScrollMixin, sizeMixin],
  components: {
    LookupItemContainer,
    TransferLookupItem,
    EmptySearch,
  },

  data: () => ({
    dataList: [],
    dataFilters: 'presence.status=sip,!dnd',
    dataSort: 'presence.status',
    dataFields: ['name', 'id', 'extension', 'presence'],
  }),

  computed: {
    ...mapState('ui/userinfo', {
      userId: (state) => state.userId,
    }),
    isTransferToNumberDisabled() {
      return !this.dataSearch;
    },
  },

  methods: {
    ...mapActions('features/call', {
      blindTransfer: 'BLIND_TRANSFER',
    }),
    fetch(params) {
      return usersAPI.getUsers({ ...params, notId: [this.userId] });
    },
    transfer(item = {}) {
      const number = item.extension || this.dataSearch;
      this.blindTransfer(number);
    },
  },
};
</script>

<style lang="scss" scoped>
.call-transfer-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: var(--spacing-xs);
}
</style>
