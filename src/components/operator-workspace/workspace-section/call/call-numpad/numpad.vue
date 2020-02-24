<template>
  <div class="numpad">
    <numpad-state/>
    <numpad-numbers
      @input="input"
    ></numpad-numbers>
  </div>
</template>

<script>
  import NumpadState from './numpad-state.vue';
  import NumpadNumbers from './numpad-numbers.vue';

  export default {
    name: 'numpad',
    components: {
      NumpadState,
      NumpadNumbers,
    },
    methods: {
      input(value) {
        console.log(value);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .numpad {
    display: flex;
    flex-direction: column;
    flex-basis: 100%; // make child height 100& of container
    padding: 30px 60px 60px;

    .numpad-state {
      flex-grow: 1;
    }
  }
</style>
