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
      :v="v.destination"
    ></cc-input>
    <multiselect
      class="processing-communication__select"
      v-model="valueDraft.type"
      :placeholder="'Type'"
      :fetch-method="fetchCommunications"
      :disabled="disabled"
      :v="v.type"
    ></multiselect>
    <cc-input
      class="processing-communication__input processing-communication__input__priority"
      v-model="valueDraft.priority"
      :disabled="disabled"
      :resetable="false"
    ></cc-input>
    <div class="actions">
      <div class="action-wrap">
        <button
          v-if="disabled"
          class="icon-btn"
          @click.prevent="isEditing = true"
        >
          <icon>
            <svg class="icon icon-edit-md md">
              <use xlink:href="#icon-edit-md"></use>
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
      </div>
      <div class="action-wrap">
        <button
          v-if="!exists && disabled"
          class="icon-btn"
          @click.prevent="$emit('delete')"
        >
          <icon>
            <svg class="icon icon-bucket-md md">
              <use xlink:href="#icon-bucket-md"></use>
            </svg>
          </icon>
        </button>
        <button
          v-if="!disabled"
          class="icon-btn"
          @click.prevent="reset"
        >
          <icon>
            <svg class="icon icon-close-md md">
              <use xlink:href="#icon-close-md"></use>
            </svg>
          </icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import getCommunications from '../../../../../api/agent-workspace/communications/communications';
  import CcInput from '../../../../utils/input.vue';
  import Multiselect from '../../../../utils/multiselect.vue';
  // import RadioButton from '../../../../utils/radio-button.vue';

  // new comm CUD
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

      v: {
        type: Object,
      },
    },

    data: () => ({
      valueDraft: {},
      isEditing: false,
    }),

    mounted() {
      this.isEditing = !this.exists;
    },

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
      reset() {
        console.log('reset');
        this.valueDraft = this.value;
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
      /*height: calcVH(40px);*/
      margin-right: calcVH(10px);

      &__priority {
        flex: 0 0 calcVH(50px);
      }

      &:last-child {
        margin-right: calcVH(20px);
      }
    }

    .actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: calcVH(6px);
      flex: 0 0 calcVH(24px*2 + 10px);

      .action-wrap {
        height: calcVH(24px);

        &:last-child {
          margin-left: calcVH(10px);
        }
      }
    }
  }
</style>
