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

<!--not scoped to change .icon colors-->
<style lang="scss">
  .rounded-action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: calcRem(50px);
    height: calcRem(50px);
    border: none;
    border-radius: 50%;
    transition: $transition;
    cursor: pointer;

    &__lg {
      width: calcRem(60px);
      height: calcRem(60px);
    }

    &.call {
      .icon {
        stroke: #fff;
        fill: #fff;
      }
      background: $call-btn-color;

      &:hover {
        background: $call-btn-color__hover;
      }
    }

    &.end {
      .icon {
        stroke: #fff;
        fill: #fff;
      }
      background: $end-btn-color;

      &:hover {
        background: $end-btn-color__hover;
      }
    }

    &.transfer {
      .icon {
        stroke: #fff;
        fill: #fff;
      }
      background: $transfer-btn-color;

      &:hover {
        background: $transfer-btn-color__hover;
      }
    }

    &.secondary {
      .icon {
        stroke: $secondary-action-icon-color;
        fill: $secondary-action-icon-color;
      }
      background: $secondary-action-color;

      &:hover .icon {
        stroke: $secondary-action-icon-color__hover;
        fill: $secondary-action-icon-color__hover;
      }

      &.active {
        .icon {
          stroke: $secondary-action-icon-color__active;
          fill: $secondary-action-icon-color__active;
        }
        background: $secondary-action-color__active;

        &:hover {
          background: $secondary-action-color__active-hover;
        }
      }
    }
  }
</style>
