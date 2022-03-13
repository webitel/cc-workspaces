<template>
  <aside
    class="wt-badge"
    :class="{ 'wt-badge--outside': outside }"
    :style="{ background: `var(--${colorVariable})` }"
  ></aside>
</template>

<script>
export default {
  name: 'wt-badge',
  props: {
    colorVariable: {
      type: String,
      default: 'false-color',
      description: 'see all available colors in webitel-ui docs',
    },
    outside: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
  .wt-badge {
    --wt-badge-size: 8px;

    position: absolute;
    top: 0;
    right: 0;
    width: var(--wt-badge-size);
    height: var(--wt-badge-size);
    border-radius: 50%;

    &--outside {
      transform: translate(-100%, -100%);
    }
  }
</style>
