<template>
  <label class="cc-input cc-search-input">
    <div class="cc-input__body" :class="{'focused': isFocused}">
      <button
        class="cc-input__icon icon-btn"
      >X
      </button>
      <input
        class="cc-input__input"
        :value="value"
        :placeholder="placeholder"
        :autofocus="autofocus"
        @input="$emit('input', $event.target.value)"
        @focusin="isFocused = true"
        @focusout="isFocused = false"
      />
      <button
        v-show="value"
        class="cc-input__icon icon-btn"
        @click="$emit('input', '')"
      >X
      </button>
    </div>
  </label>
</template>

<script>
  export default {
    name: 'search-input',
    props: {
      // value -- v-model from outer component
      value: {
        default: '',
      },
      // input placeholder
      placeholder: {
        type: String,
        default: 'Search',
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
  };
</script>

<style scoped>

</style>
