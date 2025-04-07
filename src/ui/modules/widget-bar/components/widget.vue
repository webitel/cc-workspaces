<template>
  <div
    class="widget"
    :class="{'widget--selectable': selectionMode}"
    @click.prevent="select"
  >
    <wt-checkbox
      v-show="selectionMode"
      class="widget-checkbox"
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
  name: 'Widget',
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
$widget-inbound-color: var(--primary-color);
$widget-handled-color: var(--success-color);
$widget-missed-color: var(--error-color);
$widget-avg-talk-color: var(--success-color);
$widget-avg-hold-color: var(--primary-color);
$widget-chat-accepts-color:  var(--success-color);
$widget-chat-aht-color:  var(--success-color);

.widget {
  display: flex;
  align-items: center;
  width: fit-content;
  height: 24px; // checkbox height
  padding: var(--spacing-2xs);
  white-space: nowrap;

  .widget__title {
    @extend %typo-caption;
    margin-right: var(--spacing-2xs);
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
  margin-right: var(--spacing-xs);
  pointer-events: none; // prevent checkbox own click event
}

.widget-icon {
  margin-right: var(--spacing-xs);

  &--widget-call-inbound.wt-icon ::v-deep .wt-icon__icon {
    fill: $widget-inbound-color;
    stroke: $widget-inbound-color;
  }

  &--widget-call-handled.wt-icon ::v-deep .wt-icon__icon {
    fill: $widget-handled-color;
    stroke: $widget-handled-color;
  }

  &--widget-call-missed.wt-icon ::v-deep .wt-icon__icon {
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
