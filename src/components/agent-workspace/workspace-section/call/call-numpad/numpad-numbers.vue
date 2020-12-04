<template>
  <div class="numpad-numbers">
    <wt-rounded-action
      class="numpad-numbers__num"
      color="secondary"
      @click="input('1')"
    >1</wt-rounded-action>
    <wt-rounded-action
      class="numpad-numbers__num"
      color="secondary"
      @click="input('2')"
    >2</wt-rounded-action>
    <wt-rounded-action
      class="numpad-numbers__num"
      color="secondary"
      @click="input('3')"
    >3</wt-rounded-action>
    <wt-rounded-action
      class="numpad-numbers__num"
      color="secondary"
      @click="input('4')"
    >4</wt-rounded-action>
    <wt-rounded-action
      class="numpad-numbers__num"
      color="secondary"
      @click="input('5')"
    >5</wt-rounded-action>
    <wt-rounded-action
      class="numpad-numbers__num"
      color="secondary"
      @click="input('6')"
    >6</wt-rounded-action>
    <wt-rounded-action
      class="numpad-numbers__num"
      color="secondary"
      @click="input('7')"
    >7</wt-rounded-action>
    <wt-rounded-action
      class="numpad-numbers__num"
      color="secondary"
      @click="input('8')"
    >8</wt-rounded-action>
    <wt-rounded-action
      class="numpad-numbers__num"
      color="secondary"
      @click="input('9')"
    >9</wt-rounded-action>
    <wt-rounded-action
      class="numpad-numbers__num"
      color="secondary"
      @click="input('*')"
    >*</wt-rounded-action>
    <wt-rounded-action
      class="numpad-numbers__num"
      color="secondary"
      @click="input('0')"
    >0</wt-rounded-action>
    <wt-rounded-action
      class="numpad-numbers__num"
      color="secondary"
      @click="input('#')"
    >#</wt-rounded-action>
  </div>
</template>

<script>
  export default {
    name: 'numpad-numbers',
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
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 30px;
    margin: auto;

    @media screen and (max-height: 900px) {
      grid-gap: 10px;
    }
  }

  .numpad-numbers__num {
    @extend .typo-heading-sm;
    color: $numpad-color;
  }
</style>
