<template>
  <form class="timepicker">
    <div class="timepicker__input-wrap">
      <input
        class="input__short timepicker__input"
        :value="computeHour"
        @input="setHour($event.target.value)"
        type="number"
      >
    </div>
    <span class="timepicker__delimiter">:</span>
    <div class="timepicker__input-wrap">
      <input
        class="input__short timepicker__input"
        :value="computeMin"
        @input="setMin($event.target.value)"
        type="number"
      >
    </div>
  </form>
</template>

<script>
  export default {
    name: 'timepicker',
    props: {
      value: {
        type: Number,
        required: true,
      },
    },

    computed: {
      computeHour() {
        return new Date(this.value).getHours();
      },
      computeMin() {
        return new Date(this.value).getMinutes();
      },
    },

    methods: {
      setHour(value) {
        const newValue = new Date(this.value).setHours(value);
        this.$emit('input', newValue);
      },
      setMin(value) {
        const newValue = new Date(this.value).setMinutes(value);
        this.$emit('input', newValue);
      },
    },
  };
</script>

<style lang="scss" scoped>
  $label-color: #ACACAC;
  $border-color: #E6E6E6;

  .timepicker {
    display: flex;
    width: fit-content;
    width: -moz-fit-content;
    align-items: center;
  }

  .timepicker__input-wrap {
    display: flex;
    flex-direction: column;
  }

  .timepicker__input {
    min-width: calcVH(50px);
  }

  .timepicker__delimiter {
    display: inline-block;
    margin: 0 calcVH(10px);
  }
</style>
