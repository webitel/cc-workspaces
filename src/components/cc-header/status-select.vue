<template>
  <div
    class="status-select"
    :class="{'opened': isOpened}"
    tabindex="0"
    @click="isOpened = !isOpened"
    @keypress.enter="isOpened = !isOpened"
    v-clickaway="close"
  >
    <div
      class="status-select__item status-select__item__selected"
      :class="{'hidden': isOpened}"
    >
      <span class="status-select__indicator status-select__indicator__active"></span>
      <div class="status-select__item__text">00:00:00</div>
      <icon class="status-select__arrow">
        <svg class="icon icon-arrow-down-md md">
          <use xlink:href="#icon-arrow-down-md"></use>
        </svg>
      </icon>
    </div>

    <ul
      class="status-select__options"
      :class="{'hidden': !isOpened}"
    >
      <li class="status-select__item">
        <span class="status-select__indicator status-select__indicator__active"></span>
        <div class="status-select__item__text">00:00:00</div>
        <icon class="status-select__arrow">
          <svg class="icon icon-arrow-down-md md">
            <use xlink:href="#icon-arrow-down-md"></use>
          </svg>
        </icon>
      </li>
      <li class="status-select__item">
        <span class="status-select__indicator status-select__indicator__break"></span>
        <div class="status-select__item__text">Break</div>
      </li>
      <li class="status-select__item">
        <span class="status-select__indicator status-select__indicator__stop"></span>
        <div class="status-select__item__text">Stop</div>
      </li>
    </ul>
  </div>
</template>

<script>
  import clickaway from '../../directives/clickaway';

  export default {
    name: 'status-select',
    directives: { clickaway },

    data: () => ({
      isOpened: false,
    }),

    methods: {
      close() {
        this.isOpened = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  $active-color: $true-color;
  $break-color: $hold-color;
  $stop-color: $false-color;
  $option-bg__hover: $page-bg-color;

  .status-select {
    position: relative;
    z-index: 100;

    &__item {
      display: flex;
      align-items: center;
      width: calcVH(130px);
      word-break: break-all;
      padding: calcVH(5px) calcVH(5px) calcVH(5px) calcVH(10px);
      background: #fff;
      transition: $transition;
      cursor: pointer;

      &__selected {
        border-radius: $border-radius;
      }

      &__text {
        @extend .typo-heading-sm;
      }
    }

    &__indicator {
      display: inline-block;
      width: calcVH(14px);
      height: calcVH(14px);
      margin-right: calcVH(9px);
      border-radius: 50%;

      &__active {
        background: $active-color;
      }

      &__break {
        background: $break-color;
      }

      &__stop {
        background: $stop-color;
      }
    }

    &__arrow {
      margin-left: auto;

      .icon {
        fill: #000;
        stroke: #000;
      }
    }

    .status-select__options {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }

    &.opened {
      .status-select__options {
        background: #fff;
        box-shadow: $box-shadow;
        border-radius: $border-radius;

        .status-select__item {
          &:first-child, &:last-child {
            border-radius: $border-radius;
          }

          &:hover {
            background: $option-bg__hover;
          }
        }
      }
    }
  }
</style>
