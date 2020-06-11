<template>
  <div class="numpad">
<!--    <call-state/>-->
    <numpad-numbers
      @input="input"
    ></numpad-numbers>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  // import CallState from '../call-state.vue';
  import NumpadNumbers from './numpad-numbers.vue';

  export default {
    name: 'numpad',
    components: {
      // CallState,
      NumpadNumbers,
    },
    methods: {
      ...mapActions('call', {
        input: 'ADD_DIGIT',
      }),
    },
  };
</script>

<style lang="scss" scoped>
  .numpad {
    display: flex;
    flex-direction: column;
    flex-basis: 100%; // make child height 100& of container
    /*margin-bottom: (60px);*/
    overflow: auto;

    /*.numpad-state {*/
    /*  flex-grow: 1;*/
    /*}*/
  }
</style>
