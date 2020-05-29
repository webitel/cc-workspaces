<template>
  <div class="ws-worksection">
    <search
      v-model="search"
      @search="loadInitialList"
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
    getNumberHistory,
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
      fields: ['id', 'from', 'to', 'created_at', 'destination', 'duration', 'direction', 'answered_at'],
    }),

    watch: {
      call() {
        this.loadInitialList();
      },
    },

    computed: {
      ...mapState('workspace', {
        workspaceState: (state) => state.workspaceState,
      }),
      ...mapState('call', {
        call: (state) => state.callOnWorkspace,
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

      async fetch(params) {
        let response;
        if (this.workspaceState === WorkspaceStates.MEMBER) {
          response = await getMemberHistory(params);
        } else if (!this.call._isNew) {
          response = await getNumberHistory(params);
        } else {
          response = await getAgentHistory(params);
        }

        return response;
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>
