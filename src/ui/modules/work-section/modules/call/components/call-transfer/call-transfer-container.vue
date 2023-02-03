<template>
  <div class="ws-worksection">
    <div class="ws-worksection__search-wrap">
      <wt-search-bar
        class="ws-worksection__search"
        v-model="dataSearch"
        @search="resetData"
      ></wt-search-bar>
      <wt-button
        color="transfer"
        :disabled="isTransferToNumberDisabled"
        @click="transfer"
      >{{$t('transfer.transfer')}}
      </wt-button>
    </div>
    <section class="ws-worksection__list" ref="scroll-wrap">
      <wt-loader v-if="isLoading"/>
      <empty-search v-else-if="!dataList.length" :type="'contacts'"></empty-search>
      <div v-else class="ws-worksection__list-wrap">
        <transfer-lookup-item
          v-for="(item, key) of dataList"
          :id="`scroll-item-${key}`"
          :key="`${item.id}${key}`"
          :item="item"
          :size="size"
          @input="transfer"
        ></transfer-lookup-item>
      </div>

      <observer
        :options="obsOptions"
        @intersect="handleIntersect"/>
    </section>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import infiniteScrollMixin from '../../../../../../../app/mixins/infiniteScrollMixin';
  import sizeMixin from '../../../../../../../app/mixins/sizeMixin';
  import TransferLookupItem from '../../../_shared/components/lookup-item/transfer-lookup-item.vue';
  import EmptySearch from '../../../_shared/components/workspace-empty-search/components/empty-search.vue';
  import APIRepository from '../../../../../../../app/api/APIRepository';

  const usersAPI = APIRepository.users;

  export default {
    name: 'call-transfer-container',
    mixins: [infiniteScrollMixin, sizeMixin],
    components: {
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
        return !this.search;
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
  .ws-worksection__search-wrap {
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: var(--spacing-xs);

    .ws-worksection__search {
      flex: 1 1 auto;
      min-width: auto;
      width: auto;
      margin: 0;
    }

    .wt-button {
      flex: 0 0 auto;
      margin-left: var(--spacing-xs);
    }
  }
</style>
