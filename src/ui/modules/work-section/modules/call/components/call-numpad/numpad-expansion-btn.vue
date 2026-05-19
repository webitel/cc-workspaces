<template>
  <div
    class="numpad-expansion-btn"
    :class="{'numpad-expansion-btn--opened': isOpened}">
    <div class="numpad-expansion-btn__arrow">
      <wt-icon icon="arrow-up"></wt-icon>
    </div>
    <wt-icon-btn
      class="numpad-expansion-btn__toggle-btn"
      icon="numpad"
      @click="$emit('toggle')">
    </wt-icon-btn>
  </div>
</template>

<script>
export default {
	name: 'NumpadExpansionBtn',
	props: {
		isOpened: {
			type: Boolean,
			required: true,
		},
	},
};
</script>

<style lang="scss" scoped>
  .numpad-expansion-btn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .numpad-expansion-btn__arrow {
      transition: var(--transition);
      opacity: 0;
      pointer-events: none;
      transform: translate(6px, 2px) rotate(0);
    }

    &:hover .numpad-expansion-btn__arrow {
      opacity: 1;
      pointer-events: auto;
    }

    &--opened {
      .numpad-expansion-btn__arrow {
        transform: translate(-6px, 2px) rotate(180deg);
        opacity: 1;
        pointer-events: auto;
      }
    }

    .numpad-expansion-btn__toggle-btn {
      position: relative;
      padding: 0 6px;
      bottom: 0;
      box-shadow: var(--box-shadow);
    }
  }
</style>
