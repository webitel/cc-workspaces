<template>
  <wt-select
    v-bind="$attrs"
    :options="options"
    :track-by="trackBy"
    v-on="$listeners"
  ></wt-select>
</template>

<script>
export default {
  name: 'ProcessingFormSelect',
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
