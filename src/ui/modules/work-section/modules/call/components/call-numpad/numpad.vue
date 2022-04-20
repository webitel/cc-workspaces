<template>
  <div class="numpad">
    <call-state/>
    <numpad-numbers
      ref="numpad-numbers"
      :class="{'numpad-numbers--opened': isNumpadOpened}"
      @input="input"
    ></numpad-numbers>
    <numpad-expansion-btn
      class="numpad-btn"
      :is-opened="isNumpadOpened"
      @toggle="isNumpadOpened = !isNumpadOpened"
    ></numpad-expansion-btn>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import CallState from '../call-state.vue';
  import NumpadNumbers from './numpad-numbers.vue';
  import NumpadExpansionBtn from './numpad-expansion-btn.vue';

  export default {
    name: 'numpad',
    components: {
      CallState,
      NumpadNumbers,
      NumpadExpansionBtn,
    },

    data: () => ({
      isNumpadOpened: false,
    }),
    methods: {
      ...mapActions('features/call', {
        input: 'ADD_DIGIT',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .numpad {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-basis: 100%; // make child height 100& of container

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
        margin: auto;
      }
    }

    .numpad-numbers {
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
