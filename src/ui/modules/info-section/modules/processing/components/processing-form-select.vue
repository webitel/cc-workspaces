<template>
  <wt-select
    v-bind="$attrs"
    :options="options"
    :track-by="trackBy"
  ></wt-select>
</template>

<script>
export default {
  name: 'processing-form-select',
  props: {
    options: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    trackBy() {
      return typeof this.options[0] === 'object' ? 'value' : null;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
