<template>
  <div class="numpad-numbers">
    <div class="numpad-numbers__row">
      <rounded-action
        class="numpad-numbers__num secondary"
        @click.native="input('+')"
      >+
      </rounded-action>
    </div>
    <div class="numpad-numbers__row">
      <rounded-action
        class="numpad-numbers__num secondary"
        @click.native="input('1')"
      >1
      </rounded-action>
      <rounded-action
        class="numpad-numbers__num secondary"
        @click.native="input('2')"
      >2
      </rounded-action>
      <rounded-action
        class="numpad-numbers__num secondary"
        @click.native="input('3')"
      >3
      </rounded-action>
    </div>
    <div class="numpad-numbers__row">
      <rounded-action
        class="numpad-numbers__num secondary"
        @click.native="input('4')"
      >4
      </rounded-action>
      <rounded-action
        class="numpad-numbers__num secondary"
        @click.native="input('5')"
      >5
      </rounded-action>
      <rounded-action
        class="numpad-numbers__num secondary"
        @click.native="input('6')"
      >6
      </rounded-action>
    </div>
    <div class="numpad-numbers__row">
      <rounded-action
        class="numpad-numbers__num secondary"
        @click.native="input('7')"
      >7
      </rounded-action>
      <rounded-action
        class="numpad-numbers__num secondary"
        @click.native="input('8')"
      >8
      </rounded-action>
      <rounded-action
        class="numpad-numbers__num secondary"
        @click.native="input('9')"
      >9
      </rounded-action>
    </div>
    <div class="numpad-numbers__row">
      <rounded-action
        class="numpad-numbers__num secondary"
        @click.native="input('*')"
      >*
      </rounded-action>
      <rounded-action
        class="numpad-numbers__num secondary"
        @click.native="input('0')"
      >0
      </rounded-action>
      <rounded-action
        class="numpad-numbers__num secondary"
        @click.native="input('#')"
      >#
      </rounded-action>
    </div>
  </div>
</template>

<script>
  import RoundedAction from '../../../../utils/rounded-action.vue';

  export default {
    name: 'numpad-numbers',
    components: {
      RoundedAction,
    },

    methods: {
      input(value) {
        this.$emit('input', value);
      },
    },
  };
</script>

<style lang="scss" scoped>
  $numpad-color: #808080;

  .numpad-numbers {
    width: calcRem(210px);
    margin: auto;

    &__row {
      display: flex;
      justify-content: space-between;
      margin-top: calcRem(30px);

      &:first-child {
        justify-content: center;
        margin-top: 0;
      }
    }

    &__num {
      @extend .typo-heading-sm;
      color: $numpad-color;
    }
  }
</style>
