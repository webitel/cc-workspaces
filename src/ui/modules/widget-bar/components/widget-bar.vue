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
      <wt-icon-btn
        class="icon"
        icon="arrow-down"
        @click="selectionMode = !selectionMode"
      ></wt-icon-btn>
    </div>
  </section>
</template>

<script>
import preventHiddenPageCallsDecorator from '@webitel/ui-sdk/src/scripts/preventHiddenPageCallsDecorator';
import { mapActions,mapState } from 'vuex';

import Widgets from '../utils/Widgets';
import Widget from './widget.vue';

const REFRESH_INTERVAL_DURATION = 20 * 1000; // 20 sec

export default {
  name: 'WidgetBar',
  components: {
    Widget,
  },

  data: () => ({
    widgets: Widgets,
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

  unmounted() {
    this.resetRefreshInterval();
  },

  computed: {
    // agent status
    ...mapState('features/status', {
      agent: (state) => state.agent,
    }),
    ...mapState('ui/widget', {
      data: (state) => state.data,
    }),
  },
  methods: {
    ...mapActions({
      loadWidgetData(dispatch, payload) {
        return dispatch('ui/widget/LOAD_WIDGET_DATA', payload);
      },
    }),
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
        this.loadWidgetData();
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.widget-bar {
  display: flex;
  background: var(--content-wrapper-color);
  border-radius: var(--border-radius);
}

.widgets-wrap {
  flex: 1;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  /*display: grid;*/
  /*grid-template-columns: repeat(auto-fit, minmax(200px, max-content));*/
  width: 100%;
  padding: var(--spacing-2xs) var(--spacing-sm);

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

  .icon {
    margin: 4px auto 0;
  }
}

.widget {
  margin: 0 31px; // 63px / 2
}
</style>
