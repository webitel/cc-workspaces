<template>
  <section class="widget-bar">
    <div class="widgets-wrap" :class="{'widgets-wrap--wide': selectionMode}">
      <widget
        v-for="(widget, key) of Object.keys(widgets)"
        v-show="widgets[widget].show || selectionMode"
        :key="key"
        :widget="widgets[widget]"
        :value="data[widgets[widget].field]"
        :show="widgets[widget].show"
        :selection-mode="selectionMode"
        @select="toggleSelect(widget)"
      ></widget>
    </div>
    <div
      class="widgets-controls"
      :class="{'widgets-controls--expanded': selectionMode}"
    >
      <button
        class="icon-btn"
        @click.prevent="selectionMode = !selectionMode"
      >
        <icon>
          <svg class="icon md">
            <use xlink:href="#icon-arrow-down-md"></use>
          </svg>
        </icon>
      </button>
    </div>
  </section>
</template>

<script>
  import { mapState } from 'vuex';
  import preventHiddenPageCallsDecorator from '@webitel/ui-sdk/src/scripts/preventHiddenPageCallsDecorator';
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
      widgets: Widgets,
      data: {
        count: 0,
        handles: 0,
        abandoned: 0,
        avgHoldSec: 0,
        avgTalkSec: 0,
        maxHoldSec: 0,
        maxTalkSec: 0,
        minHoldSec: 0,
        minTalkSec: 0,
        sumHoldSec: 0,
        sumTalkSec: 0,
      },
      refreshIntervalInstance: null,
      selectionMode: false,
    }),

    watch: {
      agent() {
        if (this.refreshIntervalInstance) this.resetRefreshInterval();
        this.setRefreshInterval();
      },
    },

    created() {
      this.getWidgetsFromLocalStorage();
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
      toggleSelect(key) {
        this.widgets[key].show = !this.widgets[key].show;
        this.setWidgetsToLocalStorage();
      },

      setWidgetsToLocalStorage() {
        const widgets = Object.values(this.widgets)
          .filter((widget) => widget.show)
          .map((widget) => widget.type)
          .join(',');
        localStorage.setItem('widgets', widgets);
      },

      getWidgetsFromLocalStorage() {
        let widgets = localStorage.getItem('widgets');
        if (widgets) {
          widgets = widgets.split(',');
          Object.values(this.widgets)
            .forEach((widget) => {
              // eslint-disable-next-line no-param-reassign
              widget.show = widgets.indexOf(widget.type) !== -1;
            });
        }
      },

      setRefreshInterval() {
        this.loadWidgetsData();
        this.loadWidgetsData = preventHiddenPageCallsDecorator(this.loadWidgetsData);
        this.refreshIntervalInstance = setInterval(this.loadWidgetsData, REFRESH_INTERVAL_DURATION);
      },

      resetRefreshInterval() {
        clearInterval(this.refreshIntervalInstance);
      },

      async loadWidgetsData() {
        if (!this.selectionMode) {
          const { agentId } = this.agent;
          this.data = await WidgetsAPI.getWidgets({ agentId });
        }
      },
    },
  };
</script>

<style lang="scss" scoped>

  .widget-bar {
    display: flex;
    background: #fff;
    border-radius: $border-radius;
  }

  .widgets-wrap {
    flex: 1;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    /*display: grid;*/
    /*grid-template-columns: repeat(auto-fit, minmax(200px, max-content));*/
    width: 100%;
    padding: 5px 20px;

    // &--wide {
    // grid-template-columns: repeat(auto-fit, minmax(250px, max-content));
    // }

    @media screen and (max-height: 768px) {
      padding: 4px 20px;
    }
  }

  .widgets-controls {
    flex: 0 0 40px;

    &--expanded {
      .icon {
        transform: rotate(180deg);
      }
    }

    .icon-btn {
      margin: 6px auto 0;
    }
  }

  .widget {
    margin: 0 31px; // 63px / 2
  }
</style>
