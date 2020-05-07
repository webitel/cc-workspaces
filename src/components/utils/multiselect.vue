<template>
  <div class="hs-multiselect" :class="{'disabled': disabled}">
    <label class="cc-label" v-if="label">{{label}}</label>
    <div class="hs-multiselect-wrap">
      <vue-multiselect
        :class="{'opened': isOpened}"
        :value="validation"
        :options="opts"
        :placeholder="placeholder || label"
        :multiple="multiple"
        :close-on-select="closeOnSelect"
        :limit="1"
        :label="'name'"
        :track-by="trackBy"
        :limitText="limitText"
        :loading="false"
        :internal-search="!apiMode"
        :disabled="disabled"
        @input="$emit('input', $event)"
        @search-change="fetch"
        @open="isOpened = true"
        @close="close"
      >
        <template slot="option" slot-scope="{ option }">
          <div class="multiselect__option__content">
            <span>{{option.name || option }}</span>
            <icon class="multiselect__option__tick">
              <svg class="icon icon-tick-sm sm">
                <use xlink:href="#icon-tick-sm"></use>
              </svg>
            </icon>
          </div>
        </template>
      </vue-multiselect>
      <icon class="hs-multiselect__arrow-down">
        <svg class="icon icon-arrow-down-md md">
          <use xlink:href="#icon-arrow-down-md"></use>
        </svg>
      </icon>
    </div>
    <validation-message
      class="cc-err-message"
      v-if="!hideDetails"
      :v="v"
    />
  </div>
</template>

<script>
  import VueMultiselect from 'vue-multiselect';
  import ValidationMessage from './validation-message.vue';
  import debounce from '../../utils/debounce';

  export default {
    name: 'multiselect',
    components: {
      VueMultiselect,
      ValidationMessage,
    },
    props: {
      value: {
        // type: [Array, Object],
        required: true,
      },

      options: {
        type: Array,
      },

      label: {
        type: String,
      },

      placeholder: {
        type: String,
      },

      trackBy: {
        type: String,
        default: 'id',
      },

      multiple: {
        type: Boolean,
        default: false,
      },

      closeOnSelect: {
        type: Boolean,
        default: true,
      },

      apiMode: {
        type: Boolean,
        default: true,
      },

      fetchMethod: {
        type: Function,
      },

      disabled: {
        type: Boolean,
        default: false,
      },

      hideDetails: {
        type: Boolean,
        default: false,
      },

      v: {
        type: Object,
      },
    },

    data: () => ({
      isLoading: false,
      isOpened: false,
      fetchedOptions: [],
    }),

    created() {
      this.fetch();
      this.fetch = debounce(this.fetch);
    },

    computed: {
      opts() {
        if (this.apiMode) {
          return this.fetchedOptions;
        }
        return this.options;
      },

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

    methods: {
      limitText: (count) => `${count}`,

      async fetch(search) {
        if (this.apiMode) {
          this.fetchedOptions = await this.fetchMethod(search);
        }
      },

      close() {
        this.$emit('closed');
        this.isOpened = false;
      },
    },
  };
</script>

<style lang="scss">
  @import '../../css/utils/variables';

  $label-color: #000;
  $list-option__hover: transparent;

  .hs-multiselect .cc-label {
    margin-bottom: calcVH(10px);
  }

  .hs-multiselect-wrap {
    position: relative;
    width: 100%;
    height: calcVH(40px);
  }

  .hs-multiselect__arrow-down {
    position: absolute;
    top: 50%;
    right: calcVH(3px);
    transform: translateY(-50%);
    pointer-events: none;

    .icon {
      fill: #000;
      stroke: #000
    }
  }

  .multiselect {
    position: absolute;
    width: 100%;

    border: 1px solid $input-border-color;
    border-radius: $border-radius;
    background: #fff;

    cursor: pointer;
    transition: $transition;
    box-sizing: border-box;

    &.opened {
      z-index: 1;
    }

    &:hover, &.opened {
      border-color: #000;
    }

    // visible area
    &__tags {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: calcVH(38px); // 40px - 2px outer borders
      padding: $select-paddings;
      box-sizing: border-box;

      .multiselect__strong {
        // @extend .count-badge;
        font-weight: normal;
      }

      .multiselect__placeholder {
        @extend .typo-input;
        color: $label-color;
      }

      .multiselect__input {
        @extend .typo-input;
        outline: none;
        border: none;
      }

      .multiselect__single {
        @extend .typo-input;
      }

      .multiselect__tag {
        @extend .typo-input;
      }
    }

    // options
    &__content-wrapper {
      @extend .cc-scrollbar;
      overflow: auto;
    }

    &__content {
      width: 100%;
    }

    // empty/not found texts
    li:not(.multiselect__element) {
      @extend .typo-input;
      padding: $select-paddings;
    }

    &__element {
      @extend .typo-input;
      width: 100%;
      transition: $transition;
      cursor: pointer;

      .multiselect__option {
        display: block;
        border-radius: $border-radius;

        &:hover {
          background: $list-option__hover;
        }

        &__content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: $select-paddings;
          padding-right: calcVH(8px);
          box-sizing: border-box;
        }

        .multiselect__option__tick .icon {
          fill: transparent;
          stroke: transparent;
        }

        &:hover .multiselect__option__tick .icon {
          fill: #000;
          stroke: #000;
        }

        &.multiselect__option--selected
        .multiselect__option__tick .icon {
          fill: $true-color;
          stroke: $true-color;
        }
      }
    }

    &:not(.multiselect--active) {
      .multiselect__input {
        display: none;
      }
    }

    &--active {
      .multiselect__tags-wrap,
      .multiselect__strong {
        display: none !important;
      }
    }
  }

  .hs-multiselect.disabled {
    .hs-multiselect__arrow-down {
      display: none;
    }

    .multiselect {
      border: none;
      outline: none;
      cursor: text;
    }
  }
</style>
