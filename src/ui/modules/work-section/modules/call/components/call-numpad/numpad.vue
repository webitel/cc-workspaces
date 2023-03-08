<template>
  <div class="numpad">
    <wt-input
      v-show="isNewCall"
      ref="number-input"
      :model-value="call.newNumber"
      @update:modelValue="call.newNumber = $event"
      @keypress.enter="makeCall"
    ></wt-input>
    <call-state/>
    <div class="numpad-wrapper">
      <numpad-numbers
        ref="numpad-numbers"
        :size="size"
        :class="{'numpad-numbers--opened': isNumpadOpened}"
        @input="handleNumpadInput"
      ></numpad-numbers>
    </div>
    <numpad-expansion-btn
      class="numpad-btn"
      :is-opened="isNumpadOpened"
      @toggle="isNumpadOpened = !isNumpadOpened"
    ></numpad-expansion-btn>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
  import CallState from '../call-state.vue';
  import NumpadNumbers from './numpad-numbers.vue';
  import NumpadExpansionBtn from './numpad-expansion-btn.vue';
  import sizeMixin from '../../../../../../../app/mixins/sizeMixin';

  export default {
    name: 'the-numpad',
    mixins: [sizeMixin],
    components: {
      CallState,
      NumpadNumbers,
      NumpadExpansionBtn,
    },

    data: () => ({
      isNumpadOpened: false,
    }),
    computed: {
      ...mapGetters('features/call', {
        call: 'CALL_ON_WORKSPACE',
        isNewCall: 'IS_NEW_CALL',
      }),
    },
    methods: {
      ...mapActions('features/call', {
        input: 'ADD_DIGIT',
        makeCall: 'CALL',
      }),
      setNumberFocus() {
        const input = this.$refs['number-input'].$el.querySelector('input');
        if (input) input.focus();
      },
      handleNumpadInput(value) {
        this.input(value);
        this.setNumberFocus();
      },
    },
    mounted() {
      this.setNumberFocus();
    },
  };
</script>

<style lang="scss" scoped>
  .numpad {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-basis: 100%; // make child height 100& of container
    gap: 25px;
    height: 100%;

    .wt-input ::v-deep .wt-input__input {
      text-align: center;
    }

    .numpad-btn {
      display: none;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1;
      @media screen and (max-height: 719px) {
        display: block;
      }
    }

    .numpad-state {
      @media screen and (max-height: 719px) {
        margin: 0 auto;
      }
    }

    .numpad-numbers {
      align-self: flex-end;

      @media screen and (max-height: 719px) {
        position: absolute;
        bottom: 53px;
        left: 50%;
        padding: var(--spacing-xs);
        background: var(--main-color);
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow);
        opacity: 0;
        pointer-events: none;
        z-index: 1;
        transform: translateX(-50%);

        &--opened {
          opacity: 1;
          pointer-events: auto;
        }
      }
    }
  }
</style>
