<template>
  <div class="numpad">
    <call-state/>
    <wt-input
      v-if="isNewCall"
      ref="number-input"
      v-model="call.newNumber"
      @keypress.enter="makeCall"
    ></wt-input>
    <numpad-numbers
      ref="numpad-numbers"
      :class="{'numpad-numbers--opened': isNumpadOpened}"
      @input="handleNumpadInput"
    ></numpad-numbers>
    <numpad-expansion-btn
      class="numpad-btn"
      :is-opened="isNumpadOpened"
      @toggle="isNumpadOpened = !isNumpadOpened"
    ></numpad-expansion-btn>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
  import CallState from '../call-state.vue';
  import NumpadNumbers from './numpad-numbers.vue';
  import NumpadExpansionBtn from './numpad-expansion-btn.vue';

  export default {
    name: 'the-numpad',
    components: {
      CallState,
      NumpadNumbers,
      NumpadExpansionBtn,
    },

    data: () => ({
      isNumpadOpened: false,
    }),
    computed: {
      ...mapState('features/call', {
        call: (state) => state.callOnWorkspace,
      }),
      ...mapGetters('features/call', {
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
        input.focus();
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
      bottom: -24px;
      left: 50%;
      transform: translateX(-50%);
      @media screen and (max-height: 810px) {
        display: block;
      }
      @media screen and (max-height: 768px) {
        bottom: -18px;
      }
    }

    .numpad-state {
      @media screen and (max-height: 810px) {
        margin: 0 auto;
      }
    }

    .numpad-numbers {
      align-self: flex-end;

      @media screen and (max-height: 810px) {
        position: absolute;
        bottom: 53px;
        left: 50%;
        padding: 10px;
        background: #fff;
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
