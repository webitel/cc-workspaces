<template>
  <wt-datepicker
    v-bind="$attrs"
    :value="date"
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
    },
  },
  computed: {
    date() {
     return !this.value || this.value === 'now'
        ? Date.now()
        : this.value;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
