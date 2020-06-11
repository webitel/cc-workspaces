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
      width: (20px) !important;
      height: (20px) !important;
      margin-right: (10px);

      .icon {
        width: (20px);
        height: (20px);
        fill: $call-color;
        stroke: $call-color;
      }
    }

    &__title {
      @extend .typo-body-sm;
      margin-right: (5px);
    }

    &__value {
      @extend .typo-heading-sm;
    }
  }
</style>
