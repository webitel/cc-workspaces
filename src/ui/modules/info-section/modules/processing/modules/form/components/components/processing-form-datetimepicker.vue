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
  name: 'processing-form-datetimepicker',
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
  },
  model: {
    event: 'input',
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
