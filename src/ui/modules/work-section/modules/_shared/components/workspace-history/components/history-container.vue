<template>
  <lookup-item-container
    :empty="!dataList.length"
    :loading="isLoading"
    :search="dataSearch"
    @more="handleIntersect"
    @search:input="dataSearch = $event"
    @search:change="resetData"
  >

    <template #empty>
      <empty-search type="history" />
    </template>

    <template #content>
      <div v-for="dataItem in dataList"
        class="history-container-contact">
        <p class="history-container-contact__caption">
          {{dataItem.groupName}}
        </p>
        <history-lookup-item
          v-for="(item) of dataItem.groupData"
          :key="item.id"
          :item="item"
          :size="size"
          :for-number="historyNumber"
          class="history-container-contact__item"
          @input="select(item)"
        />
        <wt-divider/>
      </div>

    </template>

  </lookup-item-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { CallDirection } from 'webitel-sdk';

import APIRepository from '../../../../../../../../app/api/APIRepository';
import infiniteScrollMixin from '../../../../../../../../app/mixins/infiniteScrollMixin';
import sizeMixin from '../../../../../../../../app/mixins/sizeMixin';
import WorkspaceStates
  from '../../../../../../../enums/WorkspaceState.enum';
import HistoryLookupItem from '../../lookup-item/history-lookup-item.vue';
import LookupItemContainer from '../../lookup-item-container/lookup-item-container.vue';
import EmptySearch from '../../workspace-empty-search/components/empty-search.vue';

const historyAPI = APIRepository.history;

export default {
  name: 'HistoryContainer',
  components: {
    LookupItemContainer,
    HistoryLookupItem,
    EmptySearch,
  },
  mixins: [infiniteScrollMixin, sizeMixin],

  data: () => ({
    dataList: '',
    historyNumber: '',
    dataFields: ['id', 'from', 'to', 'created_at', 'destination', 'duration', 'direction', 'answered_at', 'contact'],
  }),

  watch: {
    call() {
      this.resetHistoryNumber();
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

    async loadDataList() {
      if (!this.dataList.length) this.isLoading = true;
      const params = this.collectParams();
      // both items and data because contacts return { data }, and other endpoints return { items }
      const { items, data, next } = await this.fetch(params);
      this.isNext = next;
      const sortedData = await this.groupAndSortByDate(items || data);
      this.setData(sortedData);
      this.dataPage += 1;
      this.isLoading = false;
    },
    groupAndSortByDate(data) {
      const groupedData = {};
      data.forEach(item => {
        const date = new Date(parseInt(item.createdAt));
        let dateKey;

        this.isToday(date) ? dateKey = this.$t('history.today'):
          dateKey = this.formatDate(item.createdAt);

        if (!groupedData[dateKey]) groupedData[dateKey] = [];
        groupedData[dateKey].push(item);
      });

      const result = Object.keys(groupedData).map(key => {
        return {
          groupName: key,
          groupData: groupedData[key].sort((a, b) => b.createdAt - a.createdAt)
        };
      });

      return result;
    },
    isToday(date) {
      const today = new Date();
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    },
    formatDate(timestamp) {
      const date = new Date(parseInt(timestamp));
      return `${('0' + date.getDate()).slice(-2)}.${('0' + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear()}`;
    },
  },
};
</script>

<style lang="scss" scoped>
  .history-container-contact{
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xs);
    padding-top: var(--spacing-2xs);

    &__caption{
      @extend %typo-caption;
      text-align: center;
    }
  }
</style>

