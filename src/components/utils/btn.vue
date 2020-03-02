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
    padding: calcRem(11px) calcRem(17px) calcRem(7px);
    color: #000;
    background: $default-btn-color;
    border: none;
    border-radius: $border-radius;
    transition: $transition;
    cursor: pointer;

    &:hover {
      background: $default-btn-color__hover;
    }

    &.capitalize {
      text-transform: capitalize;
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
      background: $secondary-btn-color;

      &:hover {
        color: $secondary-btn-color__hover;
        background: $secondary-btn-color__hover;
      }
    }

    &.disabled {
      color: $btn-disabled;
      background: $btn-disabled;
    }
  }
</style>
