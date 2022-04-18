<template>
  <div class="ws-worksection">
    <div class="ws-worksection__search-wrap">
      <wt-search-bar
        class="ws-worksection__search"
        v-model="search"
        @search="resetData"
      ></wt-search-bar>
      <wt-button
        color="transfer"
        :disabled="isTransferToNumberDisabled"
        @click="transfer"
      >{{$t('transfer.transfer')}}
      </wt-button>
    </div>
    <p class="ws-worksection__list-instruction">{{$t('transfer.selectAgent')}}</p>

    <section class="ws-worksection__list" ref="scroll-wrap">
      <wt-loader v-if="isLoading"/>
      <empty-search v-else-if="!dataList.length" :type="'contacts'"></empty-search>
      <div v-else class="ws-worksection__list-wrap">
        <transfer-lookup-item
          v-for="(item, key) of dataList"
          :id="`scroll-item-${key}`"
          :key="`${item.id}${key}`"
          :item="item"
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
  import TransferLookupItem from '../../../shared/components/lookup-item/transfer-lookup-item.vue';
  import EmptySearch from '../../../shared/components/workspace-empty-search/components/empty-search.vue';
  import APIRepository from '../../../../../../../app/api/APIRepository';

  const usersAPI = APIRepository.users;

  export default {
    name: 'call-transfer-container',
    mixins: [infiniteScrollMixin],
    components: {
      TransferLookupItem,
      EmptySearch,
    },

    data: () => ({
      dataList: [],
      filters: 'presence.status=sip,!dnd',
      sort: 'presence.status',
      fields: ['name', 'id', 'extension', 'presence'],
    }),

    computed: {
      ...mapState('userinfo', {
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
        const number = item.extension || this.search;
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
    margin-bottom: 10px;

    .ws-worksection__search {
      flex: 1 1 auto;
      min-width: auto;
      width: auto;
      margin: 0;
    }

    .wt-button {
      flex: 0 0 auto;
      margin-left: 10px;
    }
  }
</style>
