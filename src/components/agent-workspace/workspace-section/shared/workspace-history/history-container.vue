<template>
  <div class="ws-worksection">
    <search
      v-model="search"
      @search="loadDataList"
    />
    <div class="ws-worksection__list" ref="scroll-wrap">
      <history-item
        v-for="(item, key) of dataList"
        :key="key"
        :item="item"
        @click.native="select(item)"
      ></history-item>
      <observer
        :options="obsOptions"
        @intersect="handleIntersect"/>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import { CallDirection } from 'webitel-sdk';
  import Search from '../../../../utils/search-input.vue';
  import HistoryItem from './history-item.vue';
  import infiniteScrollMixin from '../../../../../mixins/infiniteScrollMixin';
  import { getAgentHistory } from '../../../../../api/agent-workspace/history/history';

  export default {
    name: 'history-container',
    mixins: [infiniteScrollMixin],
    components: {
      Search,
      HistoryItem,
    },

    data: () => ({
      dataList: '',
      size: 10,
    }),

    methods: {
      select(item) {
        let destination = '';
        if (item.direction === CallDirection.Inbound) destination = item.from.number || '';
        if (item.direction === CallDirection.Outbound) destination = item.to.number || '';
        this.setNumber(destination);
      },

      async loadDataList() {
        const response = await getAgentHistory({
          page: this.page,
          size: this.size,
          search: this.search,
        });
        this.dataList = [...this.dataList, ...response];
      },

      ...mapActions('call', {
        setNumber: 'SET_NEW_CALL_NUMBER',
      }),
    },
  };
</script>

<style lang="scss" scoped>
</style>
