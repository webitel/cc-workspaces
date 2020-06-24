<template>
  <div class="widget">
    <icon class="widget-icon" :class="`widget-icon--${iconClass}`">
      <svg class="icon sm">
        <use :xlink:href="`#icon-${widget.icon}-sm`"></use>
      </svg>
    </icon>
    <div class="widget__title">{{widget.text()}}:</div>
    <div class="widget__value">{{value}}</div>
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
    },

    computed: {
      iconClass() {
        return this.widget.icon.split('-').slice(1).join('-');
      },
    },
  };
</script>

<style lang="scss" scoped>
  $widget-inbound-color: $accent-color;
  $widget-handles-color: $true-color;
  $widget-abandoned-color: $false-color;
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
    padding: 5px;

    &__title {
      @extend .typo-widget-title;
      margin-right: 5px;
    }

    &__value {
      @extend .typo-widget-value;
    }
  }

  .widget-icon {
    margin-right: 10px;

    &--inbound .icon {
      fill: $widget-inbound-color;
      stroke: $widget-inbound-color;
    }

    &--handles .icon {
      fill: $widget-handles-color;
      stroke: $widget-handles-color;
    }

    &--abandoned .icon {
      fill: $widget-abandoned-color;
      stroke: $widget-abandoned-color;
    }

    &--avg-talk .icon {
      fill: $widget-avg-talk-color;
      stroke: $widget-avg-talk-color;
    }

    &--avg-hold .icon {
      fill: $widget-avg-hold-color;
      stroke: $widget-avg-hold-color;
    }

    .icon {
      //  width: 20px;
      //  height: 20px;
      // fill: $call-color;
      // stroke: $call-color;
    }
  }
</style>
