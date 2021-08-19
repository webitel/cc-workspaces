<template>
  <div
    class="widget"
    :class="{'widget--selectable': selectionMode}"
    @click.prevent="select"
  >
    <wt-checkbox
      class="widget-checkbox"
      v-show="selectionMode"
      :selected="show">
    </wt-checkbox>

    <wt-icon
      class="widget-icon"
      :class="`widget-icon--${iconWidgetName}`"
      :icon="iconWidgetName"
      icon-prefix="widget"
      size="sm">
    </wt-icon>

    <div class="widget__title">{{ $t(widget.locale) }}:</div>
    <div class="widget__value">{{ value }}</div>
  </div>
</template>

<script>

export default {
  name: 'widget',
  props: {
    widget: {
      type: Object,
      required: true,
    },
    value: {
      type: [String, Number],
    },
    // checkbox value
    show: {
      type: Boolean,
    },
    selectionMode: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    iconWidgetName() {
      return this.widget.icon.split('-').slice(1).join('-');
    },
  },

  methods: {
    select() {
      if (this.selectionMode) {
        this.$emit('select');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$widget-inbound-color: $accent-color;
$widget-handles-color: $true-color;
$widget-missed-color: $false-color;
$widget-avg-talk-color: #239AC0;
$widget-avg-hold-color: $accent-color;

.typo-widget-title {
  font-family: 'Montserrat Regular', monospace;
  font-size: 10px;
  line-height: 10px;
}

.typo-widget-value {
  font-family: 'Montserrat Semi', monospace;
  font-size: 10px;
  line-height: 10px;
}

.widget {
  display: flex;
  align-items: center;
  width: fit-content;
  height: 24px; // checkbox height
  padding: 5px;
  white-space: nowrap;

  .widget__title {
    @extend .typo-widget-title;
    margin-right: 5px;
  }

  .widget__value {
    @extend .typo-widget-value;
  }

  @media screen and (max-width: 1336px) {
    .widget__title {
      display: none;
    }
  }

  &--selectable {
    cursor: pointer;

    @media screen and (max-width: 1336px) {
      .widget__title {
        display: block;
      }
    }
  }
}

.widget-checkbox {
  margin-right: 10px;
  pointer-events: none; // prevent checkbox own click event
}

.widget-icon {
  margin-right: 10px;

  &--inbound ::v-deep .wt-icon__icon {
    fill: $widget-inbound-color;
    stroke: $widget-inbound-color;
  }

  &--handles ::v-deep .wt-icon__icon {
    fill: $widget-handles-color;
    stroke: $widget-handles-color;
  }

  &--missed ::v-deep .wt-icon__icon {
    fill: $widget-missed-color;
    stroke: $widget-missed-color;
  }

  &--avg-talk ::v-deep .wt-icon__icon {
    fill: $widget-avg-talk-color;
    stroke: $widget-avg-talk-color;
  }

  &--avg-hold ::v-deep .wt-icon__icon {
    fill: $widget-avg-hold-color;
    stroke: $widget-avg-hold-color;
  }
}
</style>
