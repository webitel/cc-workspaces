<template>
  <div class="processing-communication">
    <radio-button
      :value="selected"
      :option="'id'"
      @input="select"
    ></radio-button>
    <input
      class="processing-communication__input processing-communication__input__number"
      :value="'8 800 555 3535'"
      type="text"
      :disabled="disabled"
    >
    <multiselect
      class="processing-communication__select"
      :value="[]"
      :placeholder="'Type'"
      :options="[]"
      :api-mode="false"
      :disabled="disabled"
    ></multiselect>
    <input
      class="processing-communication__input processing-communication__input__priority"
      :value="'1'"
      type="number"
      :disabled="disabled"
    >
    <button class="icon-btn">
      <icon>
        <svg class="icon icon-call-ringing-md md">
          <use xlink:href="#icon-call-ringing-md"></use>
        </svg>
      </icon>
    </button>
    <button class="icon-btn">
      <icon>
        <svg class="icon icon-call-ringing-md md">
          <use xlink:href="#icon-call-ringing-md"></use>
        </svg>
      </icon>
    </button>
  </div>
</template>

<script>
  import Multiselect from '../../../../utils/multiselect.vue';
  import RadioButton from '../../../../utils/radio-button.vue';

  export default {
    name: 'post-processing-communication',
    components: {
      RadioButton,
      Multiselect,
    },
    props: {
      selected: {
        type: String,
        required: true,
      },

      disabled: {
        type: Boolean,
        default: true,
      },
    },

    data: () => ({}),

    methods: {
      select() {
        this.$emit('select', 'id');
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../../../../css/styleguide/inputs';

  .processing-communication {
    display: flex;
    justify-content: stretch;
    align-items: center;
    width: 100%;
    margin-top: calcVH(30px);

    .radio-button {
      flex: 0 0 calcVH(24px);
      margin-right: calcVH(15px);
    }

    &__select {
      flex: 1 1 auto;
      width: 100%;
      margin-right: calcVH(10px);

      .disabled {
        border-color: transparent;
        cursor: text;
      }
    }

    &__input {
      @extend .cc-input__body;
      @extend .typo-input;
      flex: 1 1 auto;
      width: 100%;
      height: calcVH(40px);
      margin-right: calcVH(10px);

      &:disabled {
        border-color: transparent;
        background: #fff;
        cursor: text;
      }

      &__priority {
        flex: 0 0 calcVH(50px);
      }

      &:last-child {
        margin-right: calcVH(20px);
      }
    }
  }
</style>
