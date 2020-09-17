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
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 50%;
    transition: $transition;
    cursor: pointer;

    @media screen and (max-width: 1336px) {
      width: 40px;
      height: 40px;

      .icon.sm {
        width: 14px;
        height: 14px;
      }

      .icon.md {
        width: 20px;
        height: 20px;
      }

      .icon.lg {
        width: 25px;
        height: 25px;
      }

      &__lg {
        width: 48px;
        height: 48px;
      }
    }

    &__lg {
      width: 60px;
      height: 60px;
    }

    /* on top due to lower styles priority, than call, hold, transfer, end styling */
    &.secondary {
      color: $secondary-action-icon-color;

      .icon {
        stroke: $secondary-action-icon-color;
        fill: $secondary-action-icon-color;
      }

      background: $secondary-action-color;

      &:hover {
        color: $secondary-action-icon-color__hover;

        .icon {
          stroke: $secondary-action-icon-color__hover;
          fill: $secondary-action-icon-color__hover;
        }
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

    &.hold {
      .icon {
        stroke: #fff;
        fill: #fff;
      }

      background: $hold-btn-color;

      &:hover {
        background: $hold-btn-color__hover;
      }
    }

    &.call-action__mic {
      position: relative;

      &.active:before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        height: 1.5px;
        background: $secondary-action-icon-color__active;
        transform: rotate(-45deg);
        transition: $transition;
      }
    }
  }
</style>
