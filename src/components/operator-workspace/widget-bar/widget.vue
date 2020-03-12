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
      width: calcVH(20px) !important;
      height: calcVH(20px) !important;
      margin-right: calcVH(10px);

      .icon {
        width: calcVH(20px);
        height: calcVH(20px);
        fill: $call-color;
        stroke: $call-color;
      }
    }

    &__title {
      @extend .typo-body-sm;
      margin-right: calcVH(5px);
    }

    &__value {
      @extend .typo-heading-sm;
    }
  }
</style>
