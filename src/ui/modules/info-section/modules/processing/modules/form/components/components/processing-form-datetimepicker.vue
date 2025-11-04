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
  watch: {
    value(newValue) {
      if (newValue === 'now') {
        this.$emit('input', Date.now());
      }
    }
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
