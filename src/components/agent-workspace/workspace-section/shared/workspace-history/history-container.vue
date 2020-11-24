<template>
  <div class="ws-worksection">
    <search
      v-model="search"
      @search="resetData"
    />
    <section class="ws-worksection__list" ref="scroll-wrap">
      <wt-loader v-if="isLoading"/>
      <empty-search v-else-if="!dataList.length" :type="'history'"></empty-search>
      <div v-else class="ws-worksection__list-wrap">
      <history-item
        v-for="item of dataList"
        :key="item.id"
        :item="item"
        :for-number="historyNumber"
        @click.native="select(item)"
      ></history-item>
    </div>

    <observer
      :options="obsOptions"
      @intersect="handleIntersect"/>
    </section>
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapState } from 'vuex';
  import { CallDirection } from 'webitel-sdk';
  import Search from '../../../../utils/search-input.vue';
  import HistoryItem from './history-item.vue';
  import EmptySearch from '../workspace-empty-search/empty-search.vue';
  import infiniteScrollMixin from '../../../../../mixins/infiniteScrollMixin';
  import WorkspaceStates
    from '../../../../../store/modules/agent-workspace/workspaceUtils/WorkspaceStates';
  import APIRepository from '../../../../../api/APIRepository';

  const historyAPI = APIRepository.history;

  export default {
    name: 'history-container',
    mixins: [infiniteScrollMixin],
    components: {
      Search,
      HistoryItem,
      EmptySearch,
    },

    data: () => ({
      dataList: '',
      historyNumber: '',
      fields: ['id', 'from', 'to', 'created_at', 'destination', 'duration', 'direction', 'answered_at'],
    }),

    watch: {
      call() {
        this.resetHistoryNumber();
        this.loadDataList();
      },
    },

    computed: {
      ...mapState('workspace', {
        workspaceState: (state) => state.workspaceState,
      }),
      ...mapState('call', {
        call: (state) => state.callOnWorkspace,
      }),
      ...mapState('member', {
        member: (state) => state.memberOnWorkspace,
      }),
      ...mapState('userinfo', {
        userId: (state) => state.userId,
      }),
      ...mapGetters('call', {
        isNewCall: 'IS_NEW_CALL',
      }),
    },

    methods: {
      ...mapActions('call', {
        setNumber: 'SET_NEW_NUMBER',
      }),

      select(item) {
        let destination = '';
        if (item.direction === CallDirection.Inbound) destination = item.from.number || '';
        if (item.direction === CallDirection.Outbound) destination = item.destination;
        this.setNumber(destination);
      },

      async fetch(argParams) {
        let response;
        const params = { ...argParams };
        if (this.workspaceState === WorkspaceStates.MEMBER) {
          response = await this.getMemberHistory(params);
        } else if (!this.isNewCall) {
          response = await this.getNumberHistory(params);
        } else {
          response = await this.getAgentHistory(params);
        }
        return response;
      },

      getAgentHistory(argParams) {
        const params = {
          ...argParams,
          userId: this.userId,
        };
        return historyAPI.getHistory(params);
      },
      getMemberHistory(argParams) {
        const params = {
          ...argParams,
          memberId: this.member.id,
        };
        return historyAPI.getHistory(params);
      },
      getNumberHistory(argParams) {
        const number = this.call.displayNumber;
        const params = {
          ...argParams,
          search: number,
        };
        this.historyNumber = number;
        return historyAPI.getHistory(params);
      },

      resetHistoryNumber() {
        this.historyNumber = '';
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>
