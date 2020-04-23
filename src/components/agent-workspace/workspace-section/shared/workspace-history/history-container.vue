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
  import { mapActions, mapState } from 'vuex';
  import { CallDirection } from 'webitel-sdk';
  import Search from '../../../../utils/search-input.vue';
  import HistoryItem from './history-item.vue';
  import infiniteScrollMixin from '../../../../../mixins/infiniteScrollMixin';
  import {
    getAgentHistory,
    getMemberHistory,
  } from '../../../../../api/agent-workspace/history/history';
  import WorkspaceStates
    from '../../../../../store/modules/agent-workspace/workspaceUtils/WorkspaceStates';

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

    computed: {
      ...mapState('workspace', {
        workspaceState: (state) => state.workspaceState,
      }),
      ...mapState('call', {
        callState: (state) => state.callState,
      }),
    },

    methods: {
      select(item) {
        let destination = '';
        if (item.direction === CallDirection.Inbound) destination = item.from.number || '';
        if (item.direction === CallDirection.Outbound) destination = item.destination;
        this.setNumber(destination);
      },

      async loadInitialList() {
        this.dataList = await this.loadDataList();
      },

      async loadNext() {
        const response = await this.loadDataList();
        this.dataList = [...this.dataList, ...response];
      },

      async loadDataList() {
        let response;
        const params = {
          page: this.page,
          size: this.size,
          search: this.search,
        };

        if (this.workspaceState === WorkspaceStates.MEMBER) {
          response = await getMemberHistory(params);
        } else {
          response = await getAgentHistory(params);
        }

        return response;
      },

      ...mapActions('call', {
        setNumber: 'SET_NEW_CALL_NUMBER',
      }),
    },
  };
</script>

<style lang="scss" scoped>
</style>
