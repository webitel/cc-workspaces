<template>
  <label class="cc-input cc-search-input">
    <div class="cc-input__body" :class="{'focused': isFocused}">
      <icon>
        <svg class="icon icon-search-md md">
          <use xlink:href="#icon-search-md"></use>
        </svg>
      </icon>
      <input
        class="cc-input__input"
        :value="value"
        :placeholder="placeholder || $t('reusable.search')"
        :autofocus="autofocus"
        @input="$emit('input', $event.target.value)"
        @focusin="isFocused = true"
        @focusout="isFocused = false"
      />
      <button
        class="icon-btn cc-input__icon"
        :class="{'hidden': !value}"
        @click="$emit('input', '')"
      >
        <icon>
          <svg class="icon icon-close-md md">
            <use xlink:href="#icon-close-md"></use>
          </svg>
        </icon>
      </button>
    </div>
  </label>
</template>

<script>
import debounce from '@webitel/ui-sdk/src/scripts/debounce';

export default {
    name: 'search-input',
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
      value() {
        this.search.call(this);
      },
    },

    created() {
      this.search = debounce(this.search);
    },

    methods: {
      search() {
        this.$emit('search', this.value);
      },
    },
  };
</script>

<style scoped>

</style>
