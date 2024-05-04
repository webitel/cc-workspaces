<template>
  <lookup-item-container
    :empty="!dataList.length"
    :loading="isLoading"
    :search="dataSearch"
    @more="handleIntersect"
    @search:input="dataSearch = $event"
    @search:change="resetData"
  >

    <template v-slot:empty>
      <empty-search type="history" />
    </template>

    <template v-slot:content>
      <history-lookup-item
        v-for="(item) of dataList"
        :key="item.id"
        :item="item"
        :size="size"
        :for-number="historyNumber"
        @input="select(item)"
      ></history-lookup-item>
    </template>
  </lookup-item-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { CallDirection } from 'webitel-sdk';
import LookupItemContainer from '../../lookup-item-container/lookup-item-container.vue';
import HistoryLookupItem from '../../lookup-item/history-lookup-item.vue';
import EmptySearch from '../../workspace-empty-search/components/empty-search.vue';
import infiniteScrollMixin from '../../../../../../../../app/mixins/infiniteScrollMixin';
import sizeMixin from '../../../../../../../../app/mixins/sizeMixin';
import WorkspaceStates
  from '../../../../../../../enums/WorkspaceState.enum';
import APIRepository from '../../../../../../../../app/api/APIRepository';

const historyAPI = APIRepository.history;

export default {
  name: 'history-container',
  mixins: [infiniteScrollMixin, sizeMixin],
  components: {
    LookupItemContainer,
    HistoryLookupItem,
    EmptySearch,
  },

  data: () => ({
    dataList: '',
    historyNumber: '',
    dataFields: ['id', 'from', 'to', 'created_at', 'destination', 'duration', 'direction', 'answered_at'],
  }),

  watch: {
    call() {
      this.resetHistoryNumber();
      this.loadDataList();
    },
  },

  computed: {
    ...mapState('ui/userinfo', {
      userId: (state) => state.userId,
    }),
    ...mapGetters('workspace', {
      workspaceState: 'WORKSRACE_STATE',
    }),
    ...mapGetters('features/member', {
      member: 'MEMBER_ON_WORKSPACE',
    }),
    ...mapGetters('features/call', {
      call: 'CALL_ON_WORKSPACE',
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
      this.setNumber({ value: destination });
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
