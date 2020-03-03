<template>
  <button class="rounded-action" type="button">
    <slot></slot>
  </button>
</template>

<script>
  export default {
    name: 'rounded-action',
  };
</script>

<style lang="scss" scoped>
  .rounded-action {
    width: calcRem(50px);
    height: calcRem(50px);
    border: none;
    border-radius: 50%;
    transition: $transition;
    cursor: pointer;

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
      color: $secondary-action-icon-color;
      background: $secondary-action-color;

      &:hover {
        color: $secondary-action-icon-color__hover;
      }

      &.active {
        color: $secondary-action-icon-color__active;
        background: $secondary-action-color__active;

        &:hover {
          background: $secondary-action-color__active-hover;
        }
      }
    }
  }
</style>
