<template>
  <div class="ws-worksection">
    <wt-search-bar
      v-model="search"
      @search="resetData"
    ></wt-search-bar>
    <section class="ws-worksection__list" ref="scroll-wrap">
      <wt-loader v-if="isLoading"/>
      <empty-search v-else-if="!dataList.length" :type="'history'"></empty-search>
      <div v-else class="ws-worksection__list-wrap">
      <history-lookup-item
        v-for="(item) of dataList"
        :key="item.id"
        :item="item"
        :for-number="historyNumber"
        @input="select(item)"
      ></history-lookup-item>
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
  import HistoryLookupItem from '../../lookup-item/history-lookup-item.vue';
  import EmptySearch from '../../workspace-empty-search/components/empty-search.vue';
  import infiniteScrollMixin from '../../../../../../../../app/mixins/infiniteScrollMixin';
  import WorkspaceStates
    from '../../../../../../../store/workspaceUtils/WorkspaceStates';
  import APIRepository from '../../../../../../../../app/api/APIRepository';

  const historyAPI = APIRepository.history;

  export default {
    name: 'history-container',
    mixins: [infiniteScrollMixin],
    components: {
      HistoryLookupItem,
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
      ...mapState('features/call', {
        call: (state) => state.callOnWorkspace,
      }),
      ...mapState('features/member', {
        member: (state) => state.memberOnWorkspace,
      }),
      ...mapState('userinfo', {
        userId: (state) => state.userId,
      }),
      ...mapGetters('features/call', {
        isNewCall: 'IS_NEW_CALL',
      }),
    },

    methods: {
      ...mapActions('features/call', {
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
