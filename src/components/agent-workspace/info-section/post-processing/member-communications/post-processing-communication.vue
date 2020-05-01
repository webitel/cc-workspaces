<template>
  <div class="processing-communication">
    <!--    <radio-button-->
    <!--      :value="selected"-->
    <!--      :option="'id'"-->
    <!--      @input="select"-->
    <!--    ></radio-button>-->
    <cc-input
      class="processing-communication__input processing-communication__input__number"
      v-model="valueDraft.destination"
      :disabled="disabled"
      :resetable="false"
    ></cc-input>
    <multiselect
      class="processing-communication__select"
      v-model="valueDraft.type"
      :placeholder="'Type'"
      :fetch-method="fetchCommunications"
      :disabled="disabled"
    ></multiselect>
    <cc-input
      class="processing-communication__input processing-communication__input__priority"
      v-model="valueDraft.priority"
      :disabled="disabled"
      :resetable="false"
    ></cc-input>
    <button
      v-if="disabled"
      class="icon-btn"
      @click.prevent="isEditing = true"
    >
      <icon>
        <svg class="icon icon-call-ringing-md md">
          <use xlink:href="#icon-call-ringing-md"></use>
        </svg>
      </icon>
    </button>
    <button
      v-else
      class="icon-btn"
      @click.prevent="update"
    >
      <icon>
        <svg class="icon icon-tick-md md">
          <use xlink:href="#icon-tick-md"></use>
        </svg>
      </icon>
    </button>
    <button
      v-if="!exists"
      class="icon-btn"
      @click.prevent="$emit('remove')"
    >
      <icon>
        <svg class="icon icon-call-ringing-md md">
          <use xlink:href="#icon-call-ringing-md"></use>
        </svg>
      </icon>
    </button>
  </div>
</template>

<script>
  import getCommunications from '../../../../../api/agent-workspace/communications/communications';
  import CcInput from '../../../../utils/input.vue';
  import Multiselect from '../../../../utils/multiselect.vue';
  // import RadioButton from '../../../../utils/radio-button.vue';

  // represent existing member
  // fetch types dropdown
  // comm edit, reset, save event
  // add new comm
  // new comm CUD
  // icons?
  // tests?

  export default {
    name: 'post-processing-communication',
    components: {
      // RadioButton,
      CcInput,
      Multiselect,
    },
    props: {
      value: {
        type: Object,
        required: true,
      },

      selected: {
        type: String,
        required: true,
      },

      exists: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      valueDraft: {},
      isEditing: false,
    }),

    watch: {
      value: {
        handler() {
          this.valueDraft = { ...this.value };
        },
        immediate: true,
      },
    },

    computed: {
      disabled() {
        return !this.isEditing;
      },
    },

    methods: {
      update() {
        this.$emit('change', this.valueDraft);
        this.isEditing = false;
      },
      select() {
        this.$emit('select', 'id');
      },
      fetchCommunications: getCommunications,
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../../../../css/styleguide/inputs';

  .processing-communication {
    display: flex;
    justify-content: stretch;
    align-items: flex-start;
    width: 100%;
    margin-top: calcVH(30px);

    .radio-button {
      flex: 0 0 calcVH(24px);
      margin-right: calcVH(15px);
    }

    &__select {
      flex: 1 4 auto;
      width: 100%;
      margin-right: calcVH(10px);

      .disabled {
        border-color: transparent;
        cursor: text;
      }
    }

    &__input {
      flex: 4 1 auto;
      min-width: auto;
      height: calcVH(40px);
      margin-right: calcVH(10px);

      &__priority {
        flex: 0 0 calcVH(50px);
      }

      &:last-child {
        margin-right: calcVH(20px);
      }
    }
  }
</style>
