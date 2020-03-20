<template>
  <button class="cc-btn" type="button">
    <slot></slot>
  </button>
</template>

<script>
  export default {
    name: 'btn',
  };
</script>

<style lang="scss" scoped>
  .cc-btn {
    @extend .typo-btn;
    padding: calcVH(11px) calcVH(17px) calcVH(7px);
    color: #000;
    background: $default-btn-color;
    border: none;
    border-radius: $border-radius;
    transition: $transition;
    cursor: pointer;

    &:hover {
      background: $default-btn-color__hover;
    }

    &.call {
      color: #fff;
      background: $call-btn-color;

      &:hover {
        background: $call-btn-color__hover;
      }
    }

    &.end {
      color: #fff;
      background: $end-btn-color;

      &:hover {
        background: $end-btn-color__hover;
      }
    }

    &.transfer {
      color: #fff;
      background: $transfer-btn-color;

      &:hover {
        background: $transfer-btn-color__hover;
      }
    }

    &.secondary {
      color: $secondary-btn-color;
      background: #fff;
      border: 1px solid $secondary-btn-color;

      &:hover {
        color: $secondary-btn-color__hover;
        border-color: $secondary-btn-color__hover;
      }
    }

    &.disabled {
      color: $btn-disabled;
      background: $btn-disabled;
    }
  }
</style>
