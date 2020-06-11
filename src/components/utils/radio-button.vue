<template>
  <label
    class="radio-button"
    @click.prevent="changeValue"
  >
    <input
      type="checkbox"
      :checked="value === option"
    >
    <span class="radio-button__btn"></span>
    <span class="radio-button__label">{{computeLabel}}</span>
  </label>
</template>

<script>
  export default {
    name: 'radio-button',
    props: {
      value: {
        type: [String, Boolean],
        required: true,
      },
      // may be a string, or object with true/false values
      option: {
        type: [String, Boolean],
        required: true,
      },
      label: {
        type: String,
      },
    },
    methods: {
      changeValue() {
        this.$emit('input', this.option);
      },
    },
    computed: {
      computeLabel() {
        if (this.label) {
          return this.label[this.value] || this.label;
        }
        return '';
      },
    },
  };
</script>

<style lang="scss" scoped>
  $radio-button-color: rgba(0, 0, 0, 0.3);
  $radio-button-color__active: #000;
  /* Customize the label (the container) */
  .radio-button {
    display: flex;
    align-items: center;
    position: relative;
    height: (24px);
    min-width: (24px);
    padding-left: (24px);
    box-sizing: border-box;
    cursor: pointer;
    user-select: none;
  }

  /* Hide the browser's default radio button */
  .radio-button input {
    position: absolute;
    opacity: 0;
    height: 0;
    width: 0;
    pointer-events: none;
  }

  /* Create a custom radio button */
  .radio-button__btn {
    position: absolute;
    //bottom: -2px;
    left: 0;
    height: (18px);
    width: (18px);
    border: (2px) solid $radio-button-color;
    background-color: #fff;
    border-radius: 50%;
    transition: $transition;
  }

  .radio-button:hover input ~ .radio-button__btn,
  .radio-button input:checked ~ .radio-button__btn {
    border-color: $radio-button-color__active;
  }

  /* Create the indicator (the dot/circle - hidden when not checked) */
  .radio-button__btn:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: (8px);
    height: (8px);
    transform: translate(-50%, -50%);
    border-radius: 50%;
    transition: $transition;
    opacity: 0;
  }

  /* Show the indicator (dot/circle) when checked */
  .radio-button input:checked ~ .radio-button__btn:after {
    opacity: 1;
  }

  /* Style the indicator (dot/circle) */
  .radio-button .radio-button__btn:after {
    background: $radio-button-color__active;
  }

  .radio-button__label {
    @extend .cc-label;
    margin-left: (10px);
  }
</style>
