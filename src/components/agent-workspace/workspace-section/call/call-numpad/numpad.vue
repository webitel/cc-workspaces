<template>
  <div class="numpad">
    <call-state/>
    <numpad-numbers
      ref="numpad-numbers"
      :class="{'numpad-numbers--opened': isNumpadOpened}"
      @input="input"
    ></numpad-numbers>
    <rounded-action
      class="secondary numpad-btn"
      :class="{'active': isNumpadOpened}"
      @click.native="isNumpadOpened = !isNumpadOpened"
    >
      <icon>
        <svg class="icon icon-numpad-md md">
          <use xlink:href="#icon-numpad-md"></use>
        </svg>
      </icon>
    </rounded-action>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import CallState from '../call-state.vue';
  import NumpadNumbers from './numpad-numbers.vue';
  import RoundedAction from '../../../../utils/rounded-action.vue';

  export default {
    name: 'numpad',
    components: {
      CallState,
      NumpadNumbers,
      RoundedAction,
    },

    data: () => ({
      isNumpadOpened: false,
    }),
    methods: {
      ...mapActions('call', {
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
    overflow: auto;

    .numpad-btn {
      display: none;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      @media screen and (max-height: 810px) {
        display: block;
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
        padding: 20px;
        margin-bottom: 10px;
        background: #fff;
        border-radius: $border-radius;
        box-shadow: $box-shadow;
        opacity: 0;
        pointer-events: none;
        z-index: 1;

        &--opened {
          opacity: 1;
          pointer-events: auto;
        }
      }
    }
  }
</style>
