<template>
  <div class="dt-picker" v-clickaway="close">
    <label class="dt-picker__label">Date & Time:</label>
    <div
      class="dt-picker__preview"
      tabindex="0"
      @click="isOpened = true"
      @keyup.enter="isOpened = true"
    >
      <div class="dt-picker__preview__wrap">
        <icon class="dt-picker__preview__icon">
          <svg class="icon icon-calendar_md md">
            <use xlink:href="#icon-calendar_md"></use>
          </svg>
        </icon>
        <div class="dt-picker__preview__title">From:</div>
        <div class="dt-picker__preview__value">{{computeFrom}}</div>
      </div>
      <div class="dt-picker__preview__wrap">
        <icon class="dt-picker__preview__icon">
          <svg class="icon icon-calendar_md md">
            <use xlink:href="#icon-calendar_md"></use>
          </svg>
        </icon>
        <div class="dt-picker__preview__title">To:</div>
        <div class="dt-picker__preview__value">{{computeTo}}</div>
      </div>
      <icon class="dt-picker__preview__icon">
        <svg class="icon icon-arrow-down_md md">
          <use xlink:href="#icon-arrow-down_md"></use>
        </svg>
      </icon>
    </div>
    <div
      class="dt-picker__form"
      v-show="isOpened"
    >
      <div class="dt-picker__form__quick-filters">
        <span class="dt-picker__form__quick-filter" @click="setLastHour">
          Last hour
        </span>
        <span class="dt-picker__form__quick-filter" @click="setLastDay">
          Last day
        </span>
      </div>
      <div class="dt-picker__form__wrap">
        <div class="dt-picker__form__col">
          <datepicker
            class="datepicker"
            id="datepicker-from"
            :value="draftFrom"
            :maximum-view="'day'"
            monday-first
            @input="setFrom($event.getTime())"
          ></datepicker>
          <timepicker
            :value="draftFrom"
            @input="setFrom"
          ></timepicker>
        </div>
        <div class="dt-picker__form__col">
          <datepicker
            class="datepicker"
            id="datepicker-to"
            :value="draftTo"
            :maximum-view="'day'"
            monday-first
            @input="setTo($event.getTime())"
          ></datepicker>
          <timepicker
            :value="draftTo"
            @input="setTo"
          ></timepicker>
        </div>
      </div>
      <div class="dt-picker__form__actions">
        <btn class="secondary" @click.native="close">Cancel</btn>
        <btn class="primary" @click.native="input">Add</btn>
      </div>
    </div>
  </div>
</template>

<script>
  import Datepicker from 'vuejs-datepicker';
  import Timepicker from './timepicker.vue';
  import Btn from './btn.vue';
  import clickaway from '../../directives/clickaway';

  export default {
    name: 'datepicker',
    directives: {
      clickaway,
    },
    components: {
      Datepicker,
      Timepicker,
      Btn,
    },

    props: {
      value: {
        type: Object,
        required: true,
      },
    },

    watch: {
      value() {
        this.setDraft();
      },
    },

    data: () => ({
      isOpened: false,
      draftFrom: 0,
      draftTo: 0,
    }),

    created() {
      this.setDraft();
    },

    computed: {
      // prop value representation on picker preview
      computeFrom() {
        const date = new Date(this.value.from).toLocaleDateString();
        const time = new Date(this.value.from).toTimeString()
          .slice(0, 5);
        return `${date} ${time}`;
      },

      // prop value representation on picker preview
      computeTo() {
        const date = new Date(this.value.to).toLocaleDateString();
        const time = new Date(this.value.to).toTimeString()
          .slice(0, 5);
        return `${date} ${time}`;
      },
    },

    methods: {
      input() {
        this.$emit('input', {
          from: this.draftFrom,
          to: this.draftTo,
        });
        this.close();
      },

      close() {
        this.isOpened = false;
      },

      setDraft() {
        this.draftFrom = this.value.from;
        this.draftTo = this.value.to;
      },

      setFrom(time) {
        this.draftFrom = time;
      },
      setTo(time) {
        this.draftTo = time;
      },

      setLastHour() {
        const from = Date.now() - 60 * 60 * 10 ** 3; // 60 min x 60 sec x 1000 ms
        const to = Date.now();
        this.$emit('input', {
          from,
          to,
        });
        this.close();
      },
      setLastDay() {
        const from = Date.now() - 24 * 60 * 60 * 10 ** 3; // 24hour x 60 min x 60 sec x 1000 ms
        const to = Date.now();
        this.$emit('input', {
          from,
          to,
        });
        this.close();
      },
    },
  };
</script>

<style lang="scss">
  $date-value-color: #808080;
  $datepicker-bg-shadow-color: rgba(23, 26, 42, 0.8);

  .dt-picker {
    position: relative;
    width: calcRem(596px);
    display: inline-block;
  }

  .dt-picker__label {
    @extend .typo-body-sm;
    display: block;
    margin-bottom: calcRem(13px);
    color: $label-color;
  }

  .dt-picker__preview {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: calcRem(7px); // 8px - border
    border: calcRem(1px) solid $input-border-color;
    border-radius: $border-radius;
    cursor: pointer;

    &__wrap {
      display: flex;
      align-items: center;
      width: 50%;
      padding-right: calcRem(20px);
    }

    &__icon {
      width: calcRem(24px);
      height: calcRem(24px);
      border-radius: 50%;
    }

    &__title {
      @extend .typo-heading-sm;
      margin: 0 calcRem(10px);
    }

    &__value {
      @extend .typo-body-sm;
      color: $date-value-color;
    }
  }

  .dt-picker__form {
    @extend .box-shadow;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    padding: calcRem(20px) calcRem(10px) calcRem(30px);
    background: #fff;
    border-radius: $border-radius;
    z-index: 2;

    &__quick-filters {
      text-align: center;
      margin-bottom: calcRem(37px);
    }

    &__quick-filter {
      @extend .typo-body-sm;
      text-decoration: underline;
      cursor: pointer;

      &:first-child {
        margin-right: calcRem(30px);
      }
    }

    &__wrap {
      display: flex;
    }

    &__col {
      width: 50%;

      &:first-child {
        border-right: 1px solid $input-border-color;
      }

      .datepicker {
        input {
          display: none;
        }

        .vdp-datepicker__calendar {
          display: block !important;
          position: static;
          width: calcRem(252px);
          margin: auto;
          line-height: calcRem(36px) !important;
          border: none;
          border-radius: $border-radius;


          header {
            display: flex;
            justify-content: space-between;
            align-content: center;
            margin-bottom: calcRem(24px);
            line-height: 0;

            .day__month_btn {
              @extend .typo-heading-sm;
              padding-top: calcRem(5px);
            }

            .prev, .next {
              float: none;
              text-indent: 0;
              color: transparent;

              &:hover {
                background-color: transparent !important;
              }

              &:after {
                content: '';
                position: absolute;
                top: calcRem(5px);
                width: calcRem(24px);
                height: calcRem(24px);
                background: url("../../assets/arrows/arrow-left.svg") center center;
                background-size: contain;
                border: none; // hide default arrows
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
            width: calcRem(36px);
            height: calcRem(36px);
            padding: 0;
            line-height: calcRem(36px);
            font-size: calcRem(12px);
            transition: $transition;

            &.day-header {
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

      .timepicker {
        margin: calcRem(30px) auto 0;
      }
    }

    &__actions {
      text-align: center;
      margin-top: calcRem(30px);

      .cc-btn {
        min-width: calcRem(110px);

        &.secondary {
          margin-right: calcRem(30px);
        }
      }
    }
  }
</style>
