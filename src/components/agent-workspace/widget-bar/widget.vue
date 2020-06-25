<template>
  <div
    class="widget"
    :class="{'widget--selectable': selectionMode}"
    @click.prevent="select"
  >
    <checkbox
      class="widget-checkbox"
      v-show="selectionMode"
      :value="show"
    ></checkbox>
    <icon
      class="widget-icon"
      :class="`widget-icon--${iconClass}`"
    >
      <svg class="icon sm">
        <use :xlink:href="`#icon-${widget.icon}-sm`"></use>
      </svg>
    </icon>
    <div class="widget__title">{{widget.text()}}:</div>
    <div class="widget__value">{{value}}</div>
  </div>
</template>

<script>
  import Checkbox from '../../utils/checkbox.vue';

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
    components: {
      Checkbox,
    },

    computed: {
      iconClass() {
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
    //word-break: ;

    &--selectable {
      cursor: pointer;
    }

    &__title {
      @extend .typo-widget-title;
      margin-right: 5px;
    }

    &__value {
      @extend .typo-widget-value;
    }
  }

  .widget-checkbox {
    margin-right: 10px;
    pointer-events: none; // prevent checkbox own click event
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

    &--missed .icon {
      fill: $widget-missed-color;
      stroke: $widget-missed-color;
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
