<template>
  <wt-datepicker
    v-bind="$attrs"
    :value="value"
    mode="datetime"
    @input="$emit('input', $event)"
  ></wt-datepicker>
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
    event: 'change',
  },
  created() {
    if (this.value === 'now') {
      this.$emit('change', Date.now());
    }
  },
};
</script>

<style lang="scss" scoped>

</style>
