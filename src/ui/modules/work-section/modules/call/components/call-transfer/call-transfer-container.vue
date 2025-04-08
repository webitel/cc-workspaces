<template>
  <lookup-item-container
    :empty="!dataList.length"
    :loading="isLoading"
    :search="dataSearch"
    @more="handleIntersect"
    @search:input="dataSearch = $event"
    @search:change="resetData"
  >
    <template #after-search>
      <wt-button
        color="transfer"
        :disabled="isTransferToNumberDisabled"
        @click="transfer"
      >{{ $t('transfer.transfer') }}
      </wt-button>
    </template>

    <template #empty>
      <empty-search type="contacts" />
    </template>

    <template #content>
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
</template>

<script>
import { mapActions, mapState } from 'vuex';

import APIRepository from '../../../../../../../app/api/APIRepository';
import infiniteScrollMixin from '../../../../../../../app/mixins/infiniteScrollMixin';
import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
import TransferLookupItem from '../../../_shared/components/lookup-item/transfer-lookup-item.vue';
import LookupItemContainer from '../../../_shared/components/lookup-item-container/lookup-item-container.vue';
import EmptySearch from '../../../_shared/components/workspace-empty-search/components/empty-search.vue';

const usersAPI = APIRepository.users;

export default {
  name: 'CallTransferContainer',
  components: {
    LookupItemContainer,
    TransferLookupItem,
    EmptySearch,
  },
  mixins: [infiniteScrollMixin, sizeMixin],

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
</style>
