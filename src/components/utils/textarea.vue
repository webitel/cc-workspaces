<template>
  <label
    class="cc-textarea"
    :class="{'focused': isFocused}"
  >
    <textarea
      class="cc-textarea__textarea"
      :value="value"
      :placeholder="placeholder"
      :autofocus="autofocus"
      @input="$emit('input', $event.target.value)"
      @focusin="isFocused = true"
      @focusout="isFocused = false"
    ></textarea>
    <button
      class="icon-btn cc-textarea__close"
      :class="{'hidden': !value}"
      @click="$emit('input', '')"
    >
      <icon>
        <svg class="icon icon-close-md md">
          <use xlink:href="#icon-close-md"></use>
        </svg>
      </icon>
    </button>
    <!--    <button-->
    <!--      class="icon-btn cc-textarea__send"-->
    <!--    >>-->
    <!--    </button>-->
  </label>
</template>

<script>
  export default {
    name: 'cc-textarea',
    props: {
      // value -- v-model from outer component
      value: {
        required: true,
      },
      // input placeholder
      placeholder: {
        type: String,
      },
      // autofocus on input when page is first loaded
      autofocus: {
        type: Boolean,
        default: false,
      },
      // for specific types like password
      type: {
        type: String,
        default: 'text',
      },
      // validation rules
      v: {},
    },

    data: () => ({
      isFocused: false,
    }),

    watch: {
      isFocused(value) {
        if (value) this.$emit('focus');
      },
    },
  };
</script>

<style scoped>

</style>
