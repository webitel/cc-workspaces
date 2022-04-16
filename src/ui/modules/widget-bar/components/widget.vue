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
      icon-prefix="ws"
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
$widget-inbound-color: var(--accent-color);
$widget-handles-color: var(--true-color);
$widget-missed-color: var(--false-color);
$widget-avg-talk-color: #239AC0;
$widget-avg-hold-color: var(--accent-color);
$widget-chat-accepts-color:  var(--true-color);
$widget-chat-aht-color:  var(--true-color);

.widget {
  display: flex;
  align-items: center;
  width: fit-content;
  height: 24px; // checkbox height
  padding: 5px;
  white-space: nowrap;

  .widget__title {
    @extend %typo-caption;
    margin-right: 5px;
  }

  .widget__value {
    @extend %typo-caption;
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

  &--widget-inbound.wt-icon ::v-deep .wt-icon__icon {
    fill: $widget-inbound-color;
    stroke: $widget-inbound-color;
  }

  &--widget-handles.wt-icon ::v-deep .wt-icon__icon {
    fill: $widget-handles-color;
    stroke: $widget-handles-color;
  }

  &--widget-missed.wt-icon ::v-deep .wt-icon__icon {
    fill: $widget-missed-color;
    stroke: $widget-missed-color;
  }

  &--widget-avg-talk.wt-icon ::v-deep .wt-icon__icon {
    fill: $widget-avg-talk-color;
    stroke: $widget-avg-talk-color;
  }

  &--widget-avg-hold.wt-icon ::v-deep .wt-icon__icon {
    fill: $widget-avg-hold-color;
    stroke: $widget-avg-hold-color;
  }

  &--widget-chat-accepts.wt-icon ::v-deep .wt-icon__icon {
    fill: $widget-chat-accepts-color;
    stroke: $widget-chat-accepts-color;
  }

  &--widget-chat-aht.wt-icon ::v-deep .wt-icon__icon {
    fill: $widget-chat-aht-color;
    stroke: $widget-chat-aht-color;
  }
}
</style>
