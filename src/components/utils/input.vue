<template>
  <label class="cc-input">
    <div v-if="!hideLabel" class="cc-label">
      {{label}}
    </div>

    <div class="cc-input__body" :class="{'focused': isFocused}">
      <input
        class="cc-input__input"
        :value="validation"
        :type="type"
        :placeholder="placeholder || label"
        :autofocus="autofocus"
        :disabled="disabled"
        @input="$emit('input', $event.target.value)"
        @focusin="isFocused = true"
        @focusout="isFocused = false"
      />
      <button
        class="icon-btn cc-input__icon"
        :class="{'hidden': !value}"
        @click="validation = ''"
      >
        <icon>
          <svg class="icon icon-close-md md">
            <use xlink:href="#icon-close-md"></use>
          </svg>
        </icon>
      </button>
    </div>

    <validation-message
      class="cc-err-message"
      v-if="!hideDetails"
      :v="v"
    />
  </label>
</template>

<script>
  import ValidationMessage from './validation-message.vue';

  export default {
    name: 'cc-input',
    components: {
      ValidationMessage,
    },
    props: {
      // value -- v-model from outer component
      value: {
        required: true,
      },
      // label above input itself
      label: {
        type: String,
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
      // disables input
      disabled: {
        type: Boolean,
      },
      hideLabel: {
        type: Boolean,
        default: false,
      },
      hideDetails: {
        type: Boolean,
        default: false,
      },
      // validation rules
      v: {},
    },

    data: () => ({
      isFocused: false,
    }),

    mounted() {
    },
    computed: {
      validation: {
        get() {
          return this.value;
        },
        set(value) {
          if (this.v) this.v.$touch();
          this.$emit('input', value);
        },
      },
    },
    methods: {},
  };
</script>

<style lang="scss" scoped>

</style>
