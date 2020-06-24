<template>
  <aside class="widget-bar">
    <widget
      :widget="Widgets.INBOUND"
      :value="data[Widgets.INBOUND.field]"
    ></widget>
    <widget
      :widget="Widgets.HANDLES"
      :value="data[Widgets.HANDLES.field]"
    ></widget>
    <widget
      :widget="Widgets.MISSED"
      :value="data[Widgets.MISSED.field]"
    ></widget>
    <widget
      :widget="Widgets.AVG_TALK"
      :value="prettifySec(data[Widgets.AVG_TALK.field])"
    ></widget>
    <widget
      :widget="Widgets.AVG_HOLD"
      :value="prettifySec(data[Widgets.AVG_HOLD.field])"
    ></widget>
  </aside>
</template>

<script>
  import { mapState } from 'vuex';
  import Widget from './widget.vue';
  import APIRepository from '../../../api/APIRepository';
  import Widgets from '../../../store/modules/widgets/utils/Widgets';

  const WidgetsAPI = APIRepository.widgets;
  const REFRESH_INTERVAL_DURATION = 60 * 10 ** 3; // 1 min

  export default {
    name: 'widget-bar',
    components: {
      Widget,
    },

    data: () => ({
      Widgets,
      data: {
        abandoned: 0,
        avgHoldSec: 0,
        avgTalkSec: 0,
        count: 0,
        handles: 0,
        maxHoldSec: 0,
        maxTalkSec: 0,
        minHoldSec: 0,
        minTalkSec: 0,
        sumHoldSec: 0,
        sumTalkSec: 0,
      },
      refreshIntervalInstance: null,
    }),

    watch: {
      agent() {
        if (this.refreshIntervalInstance) this.resetRefreshInterval();
        this.setRefreshInterval();
      },
    },

    destroyed() {
      this.resetRefreshInterval();
    },

    computed: {
      // agent status
      ...mapState('status', {
        agent: (state) => state.agent,
      }),
    },

    methods: {
      setRefreshInterval() {
        this.loadWidgetsData();
        this.refreshIntervalInstance = setInterval(this.loadWidgetsData, REFRESH_INTERVAL_DURATION);
      },
      resetRefreshInterval() {
        clearInterval(this.refreshIntervalInstance);
      },

      async loadWidgetsData() {
        const { agentId } = this.agent;
        this.data = await WidgetsAPI.getWidgets({ agentId });
      },

      prettifySec(value) {
        // sec number to 'mm:ss' format
        return new Date(value * 1000).toISOString().substr(14, 5);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .widget-bar {
    position: relative;
    display: flex;
    justify-content: center;
    padding: 5px 20px;
    background: #fff;
    border-radius: $border-radius;

    @media screen and (max-height: 768px) {
      padding: 9px 20px;
    }
  }

  .widget {
    margin: 0 31px; // 63px / 2
  }
</style>
