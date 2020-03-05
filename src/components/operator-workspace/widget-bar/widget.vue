<template>
  <div class="widget">
    <icon class="widget__icon">
      <svg class="icon icon-call-ringing-md md">
        <use xlink:href="#icon-call-ringing-md"></use>
      </svg>
    </icon>
    <div class="widget__title">Processed Calls:</div>
    <div class="widget__value">12</div>
  </div>
</template>

<script>
  export default {
    name: 'widget',
  };
</script>

<style lang="scss" scoped>
  .widget {
    display: flex;
    align-items: center;

    &__icon {
      width: calcRem(20px) !important;
      height: calcRem(20px) !important;
      margin-right: calcRem(10px);

      .icon {
        width: calcRem(20px);
        height: calcRem(20px);
        fill: $call-color;
        stroke: $call-color;
      }
    }

    &__title {
      @extend .typo-body-sm;
      margin-right: calcRem(5px);
    }

    &__value {
      @extend .typo-heading-sm;
    }
  }
</style>
