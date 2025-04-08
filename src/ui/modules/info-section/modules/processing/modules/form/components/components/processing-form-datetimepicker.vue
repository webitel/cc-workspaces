<template>
  <wt-datepicker
    v-bind="$attrs"
    :value="value"
    mode="datetime"
    @input="$emit('input', $event)"
  />
</template>

<script>
export default {
  name: 'ProcessingFormDatetimepicker',
  model: {
    event: 'input',
  },
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
  },
  created() {
    if (this.value === 'now') {
      this.$emit('input', Date.now());
    }
  },
};
</script>

<style lang="scss" scoped>

</style>
