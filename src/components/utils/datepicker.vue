<template>
  <div class="datepicker">
    <label v-if="label" class="cc-label">
      {{label}}
    </label>
    <vue-datepicker
      :value="+value"
      :format="format"
      :calendar-button-icon="'icon-icon_calendar'"
      :maximum-view="maximumView"
      :disabled="disabled"
      :disabled-dates="disabledDates"
      calendar-button
      monday-first
      @input="$emit('input', $event.getTime())"
    ></vue-datepicker>
  </div>
</template>

<script>
  import VueDatepicker from 'vuejs-datepicker';

  export default {
    name: 'datepicker',
    components: {
      VueDatepicker,
    },
    props: {
      value: {
        required: true,
      },
      label: {
        type: String,
      },
      format: {
        type: String,
      },
      maximumView: {
        type: String,
        default: 'day',
      },
      disabled: {
        type: Boolean,
      },
      disabledDates: {
        type: Object,
      },
    },
  };
</script>

<style lang="scss">
  @import '../../css/styleguide/inputs';
  @import '../../css/utils/variables';

  $label-color: #000;

  .datepicker__to-right {
    .vdp-datepicker__calendar {
      right: auto;
      left: 0;
    }
  }

  .vdp-datepicker {
    @extend .cc-input;
    min-width: 100%;
    width: 100%;

    > div:first-child {
      position: relative;

      &:before {
        content: '';
        position: absolute;
        top: 50%;
        left: (10px);
        width: (24px);
        height: (24px);
        background: url("../../assets/icons/calendar_md.svg") center center;
        background-size: contain;
        transform: translateY(-50%);
        pointer-events: none;
      }

      input {
        @extend .typo-input;
        @extend .cc-input__body;
        height: (40px);
        padding: $select-paddings;
        padding-left: (44px);
      }
    }

    // arrow down icon
    .vdp-datepicker__calendar-button {
      position: absolute;
      top: 50%;
      right: (5px);
      width: (24px);
      height: (24px);
      transform: translateY(-50%);

      i:before {
        content: '';
        position: absolute;
        width: (24px);
        height: (24px);
        background: url("../../assets/icons/arrow-left.svg") center center;
        background-size: contain;
        border: none; // hide default arrows
        transform: rotate(-90deg);
      }
    }

    .vdp-datepicker__calendar {
      @extend .box-shadow;
      //display: block !important;
      width: (287px);
      right: 0;
      padding: (16px);
      margin-top: (8px);
      line-height: (36px) !important;
      border: none;
      border-radius: $border-radius;

      header {
        display: flex;
        justify-content: space-between;
        align-content: flex-end;
        margin-bottom: (24px);
        line-height: 0;

        .day__month_btn {
          @extend .typo-heading-sm;
          padding-top: (5px);
        }

        .prev, .next {
          float: none;
          text-indent: 0;
          color: transparent;
          cursor: pointer;

          &:hover {
            background-color: transparent !important;
          }

          &:after {
            content: '';
            position: absolute;
            top: (5px);
            width: (24px);
            height: (24px);
            background: url("../../assets/icons/arrow-left.svg") center center;
            background-size: contain;
            border: none !important; // hide default arrows
            transform: translateX(-50%);
          }

          &:hover:after {
            color: #000;
          }
        }

        .next:after {
          transform: translateX(-50%) rotate(180deg);
        }
      }

      .cell {
        width: (36px);
        height: (36px);
        padding: 0;
        line-height: (36px);
        font-size: (14px);
        transition: $transition;

        &.day-header {
          @extend .typo-body-sm;
          letter-spacing: 0.4px;
          color: $icon-color !important;
        }

        &.day {
          border-radius: 50%;

          &.selected {
            background: $accent-color;

            &:hover {
              background: $accent-color !important;
            }
          }

          &:not(.blank):not(.disabled).day:hover,
          &:not(.blank):not(.disabled).month:hover,
          &:not(.blank):not(.disabled).year:hover {
            background: #F2F2F2;
            border-color: transparent;
          }
        }

        &.month {
          &.selected {
            border-bottom-color: $label-color;

            &:hover {
              border-bottom-color: $accent-color !important;
            }
          }

          &:not(.blank):not(.disabled).day:hover,
          &:not(.blank):not(.disabled).month:hover,
          &:not(.blank):not(.disabled).year:hover {
            border-bottom-color: $icon-color !important;
          }
        }
      }
    }
  }
</style>
