<template>
  <div
    class="numpad-expansion-btn"
    :class="{'numpad-expansion-btn--opened': isOpened}">
    <div class="numpad-expansion-btn__arrow">
      <icon>
        <svg class="icon sm">
          <use xlink:href="#icon-arrow-up-sm"></use>
        </svg>
      </icon>
    </div>
    <button class="numpad-expansion-btn__toggle-btn" @click.prevent="$emit('toggle')">
      <icon>
        <svg class="icon sm">
          <use xlink:href="#icon-numpad-sm"></use>
        </svg>
      </icon>
    </button>
  </div>
</template>

<script>
  export default {
    name: 'numpad-expansion-btn',
    props: {
      isOpened: {
        type: Boolean,
        required: true,
      },
    },
  };
</script>

<style lang="scss" scoped>
  $box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);

  .numpad-expansion-btn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .numpad-expansion-btn__arrow {
      transition: $transition;
      opacity: 0;
      pointer-events: none;
      transform: translateY(2px) rotate(0);

      .icon {
        fill: $icon-color;
        stroke: $icon-color;
      }
    }

    &:hover .numpad-expansion-btn__arrow {
      opacity: 1;
      pointer-events: auto;

      .icon {
        fill: $icon-color__hover;
        stroke: $icon-color__hover;
      }
    }

    &:not(.numpad-expansion-btn--opened) .numpad-expansion-btn__arrow {
      transform: translateY(0) rotate(0);
    }

    &--opened .numpad-expansion-btn__arrow {
      transform: translateY(0) rotate(180deg);
      opacity: 1;
      pointer-events: auto;
    }

    .numpad-expansion-btn__toggle-btn {
      position: relative;
      padding: 0 6px;
      bottom: 0;
      background: #fff;
      border: none;
      box-shadow: $box-shadow;
    }

    &:hover .numpad-expansion-btn__toggle-btn,
    &--opened .numpad-expansion-btn__toggle-btn {
      .icon {
        fill: $icon-color__hover;
        stroke: $icon-color__hover;
      }
    }
  }
</style>
