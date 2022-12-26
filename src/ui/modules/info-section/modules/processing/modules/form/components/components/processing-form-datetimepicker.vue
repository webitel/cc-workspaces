<template>
  <wt-datetimepicker
    v-bind="$attrs"
    v-on="$listeners"
    :value="value"
    v-model="estimatedTime"
  ></wt-datetimepicker>
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
  data: () => ({
    estimatedTime: '',
  }),
  created() {
    if (this.value === 'now') {
    //  this.$emit('input', Date.now());
      this.estimatedTime = Date.now();
    } else {
      this.estimatedTime = this.value;
    }
  },
};
</script>

<style lang="scss" scoped>

</style>
